import { RepositoryFactory } from '../factories';
import { IUser } from '../interfaces';
import { NotFoundError } from '../utils/AppError';

/**
 * UserService - Handles user-related business logic
 * SOLID: Single Responsibility - only handles user operations
 */
export class UserService {
    private userRepo = RepositoryFactory.getUserRepository();

    /**
     * Get all users (admin only)
     */
    async getAllUsers(): Promise<IUser[]> {
        return this.userRepo.findAll();
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
