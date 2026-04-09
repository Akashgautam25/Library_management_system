import { RepositoryFactory } from '../factories';
import { IUser, IAuthPayload } from '../interfaces';
import { generateToken } from '../utils/helpers';
import { UnauthorizedError, ConflictError, NotFoundError } from '../utils/AppError';

export class AuthService {
    private userRepo = RepositoryFactory.getUserRepository();

    async register(data: { name: string; email: string; password: string; role?: string }) {
        // Check email not already taken
        if (await this.userRepo.findByEmail(data.email)) {
            throw new ConflictError('User with this email already exists');
        }

        const user = await this.userRepo.create(data as Partial<IUser>);
        const token = generateToken({ userId: user._id.toString(), email: user.email, role: user.role });

        return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token };
    }

    async login(email: string, password: string) {
        const user = await this.userRepo.findByEmail(email);

        // Check user exists and password matches
        if (!user || !(await user.comparePassword(password))) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const token = generateToken({ userId: user._id.toString(), email: user.email, role: user.role });

        return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token };
    }

    async getProfile(userId: string) {
        const user = await this.userRepo.findByIdSafe(userId);
        if (!user) throw new NotFoundError('User not found');
        return user;
    }
}
