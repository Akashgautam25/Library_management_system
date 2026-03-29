import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

/**
 * AuthController - Handles HTTP requests for authentication
 * SOLID: Single Responsibility - delegates business logic to AuthService
 */
export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    /**
     * POST /api/auth/register
     */
    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, email, password, role } = req.body;
            const result = await this.authService.register({ name, email, password, role });
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /api/auth/login
     */
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/auth/profile
     */
    getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const user = await this.authService.getProfile(userId);
            res.status(200).json({
                success: true,
                message: 'Profile fetched successfully',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    };
}
