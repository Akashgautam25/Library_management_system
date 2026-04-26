import { RepositoryFactory } from '../factories';
import { IUser } from '../interfaces';
import { NotFoundError } from '../utils/AppError';
import UserModel from '../models/User';
import TransactionModel from '../models/Transaction';

/**
 * UserService - Handles user-related business logic
 * SOLID: Single Responsibility - only handles user operations
 */
export class UserService {
    private userRepo = RepositoryFactory.getUserRepository();

    /**
     * Get all users with borrow counts (admin only)
     */
    async getAllUsers(): Promise<IUser[]> {
        return this.userRepo.findAll();
    }

    /**
     * Get all users enriched with borrow count
     */
    async getAllUsersWithStats(): Promise<Array<IUser & { borrowCount: number }>> {
        const users = await UserModel.find({}, '-password -refreshToken').lean();
        const borrowCounts = await TransactionModel.aggregate([
            { $group: { _id: '$userId', count: { $sum: 1 } } }
        ]);
        const countMap = new Map(borrowCounts.map((b: any) => [String(b._id), b.count]));
        return users.map((u: any) => ({ ...u, borrowCount: countMap.get(String(u._id)) || 0 })) as any;
    }

    /**
     * Get all students
     */
    async getAllStudents(): Promise<IUser[]> {
        return this.userRepo.findAllStudents();
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<IUser> {
        const user = await this.userRepo.findByIdSafe(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    /**
     * Block a user (admin only)
     */
    async blockUser(id: string): Promise<IUser> {
        const user = await UserModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
        if (!user) throw new NotFoundError('User not found');
        return user;
    }

    /**
     * Unblock a user (admin only)
     */
    async unblockUser(id: string): Promise<IUser> {
        const user = await UserModel.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
        if (!user) throw new NotFoundError('User not found');
        return user;
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<IUser> {
        const user = await this.userRepo.delete(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    /**
     * Get total user count
     */
    async getTotalUsers(): Promise<number> {
        return this.userRepo.count();
    }

    /**
     * Get student count
     */
    async getStudentCount(): Promise<number> {
        return this.userRepo.count({ role: 'student' });
    }
}
