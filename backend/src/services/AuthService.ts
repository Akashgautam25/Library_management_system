import { RepositoryFactory } from '../factories';
import { IUser, IAuthPayload } from '../interfaces';
import {
    generateToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashToken,
} from '../utils/helpers';
import { UnauthorizedError, ConflictError, NotFoundError } from '../utils/AppError';
import UserModel from '../models/User';

export class AuthService {
    private userRepo = RepositoryFactory.getUserRepository();

    async register(data: { name: string; email: string; password: string; role?: string }): Promise<{ user: Partial<IUser>; token: string; refreshToken: string }> {
        const existingUser = await this.userRepo.findByEmail(data.email);
        if (existingUser) throw new ConflictError('User with this email already exists');

        const user = await this.userRepo.create(data as Partial<IUser>);
        const payload: IAuthPayload = { userId: user._id.toString(), email: user.email, role: user.role };

        const token = generateToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Store hashed refresh token
        await UserModel.findByIdAndUpdate(user._id, { refreshToken: hashToken(refreshToken) });

        return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token, refreshToken };
    }

    async login(email: string, password: string): Promise<{ user: Partial<IUser>; token: string; refreshToken: string }> {
        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new UnauthorizedError('Invalid email or password');

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

        const payload: IAuthPayload = { userId: user._id.toString(), email: user.email, role: user.role };
        const token = generateToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Store hashed refresh token
        await UserModel.findByIdAndUpdate(user._id, { refreshToken: hashToken(refreshToken) });

        return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token, refreshToken };
    }

    async refreshAccessToken(refreshToken: string): Promise<{ token: string }> {
        let decoded: IAuthPayload;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch {
            throw new UnauthorizedError('Invalid or expired refresh token');
        }

        const user = await UserModel.findById(decoded.userId).select('+refreshToken');
        if (!user || user.refreshToken !== hashToken(refreshToken)) {
            throw new UnauthorizedError('Refresh token has been revoked');
        }

        const payload: IAuthPayload = { userId: user._id.toString(), email: user.email, role: user.role };
        const newToken = generateToken(payload);
        return { token: newToken };
    }

    async logout(userId: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
    }

    async getProfile(userId: string): Promise<IUser | null> {
        const user = await this.userRepo.findByIdSafe(userId);
        if (!user) throw new NotFoundError('User not found');
        return user;
    }
}
