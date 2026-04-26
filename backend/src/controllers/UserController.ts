import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';

/**
 * UserController - Handles HTTP requests for user operations
 * SOLID: Single Responsibility - delegates logic to UserService
 */
export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * GET /api/users
     */
    getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({ success: true, message: 'Users fetched successfully', data: users });
        } catch (error) { next(error); }
    };

    /**
     * GET /api/users/stats  — returns all users enriched with borrow count
     */
    getAllUsersWithStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.userService.getAllUsersWithStats();
            res.status(200).json({ success: true, message: 'Users with stats fetched', data: users });
        } catch (error) { next(error); }
    };

    /**
     * GET /api/users/students
     */
    getAllStudents = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const students = await this.userService.getAllStudents();
            res.status(200).json({ success: true, message: 'Students fetched successfully', data: students });
        } catch (error) { next(error); }
    };

    /**
     * GET /api/users/:id
     */
    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            res.status(200).json({ success: true, message: 'User fetched successfully', data: user });
        } catch (error) { next(error); }
    };

    /**
     * PATCH /api/users/:id/block
     */
    blockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.userService.blockUser(req.params.id);
            res.status(200).json({ success: true, message: 'User blocked', data: user });
        } catch (error) { next(error); }
    };

    /**
     * PATCH /api/users/:id/unblock
     */
    unblockUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await this.userService.unblockUser(req.params.id);
            res.status(200).json({ success: true, message: 'User unblocked', data: user });
        } catch (error) { next(error); }
    };

    /**
     * DELETE /api/users/:id
     */
    deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.userService.deleteUser(req.params.id);
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        } catch (error) { next(error); }
    };
}
