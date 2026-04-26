import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { activityLogService } from '../services/ActivityLogService';
import { refreshCookieOptions } from '../utils/helpers';
import { ValidationError } from '../utils/AppError';

export class AuthController {
    private authService: AuthService;
    constructor() { this.authService = new AuthService(); }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, email, password, role } = req.body;
            const result = await this.authService.register({ name, email, password, role });
            res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
            activityLogService.log(result.user._id!.toString(), email, 'USER_REGISTERED', undefined, 'User', { name }, req);
            res.status(201).json({ success: true, message: 'User registered successfully', data: { user: result.user, token: result.token } });
        } catch (error) { next(error); }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
            activityLogService.log(result.user._id!.toString(), email, 'USER_LOGIN', undefined, 'User', {}, req);
            res.status(200).json({ success: true, message: 'Login successful', data: { user: result.user, token: result.token } });
        } catch (error) { next(error); }
    };

    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) throw new ValidationError('Refresh token not provided');
            const result = await this.authService.refreshAccessToken(refreshToken);
            res.status(200).json({ success: true, message: 'Token refreshed', data: result });
        } catch (error) { next(error); }
    };

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (userId) {
                await this.authService.logout(userId);
                activityLogService.log(userId, req.user!.email, 'USER_LOGOUT', undefined, 'User', {}, req);
            }
            res.clearCookie('refreshToken', { path: '/' });
            res.status(200).json({ success: true, message: 'Logged out successfully' });
        } catch (error) { next(error); }
    };

    getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.authService.getProfile(req.user!.userId);
            res.status(200).json({ success: true, message: 'Profile fetched successfully', data: user });
        } catch (error) { next(error); }
    };
}
