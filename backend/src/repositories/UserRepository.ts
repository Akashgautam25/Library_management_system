import { BaseRepository } from './BaseRepository';
import UserModel from '../models/User';
import { IUser } from '../interfaces';

/**
 * UserRepository - Concrete repository for User entity
 * OOP: Inheritance - extends BaseRepository for common CRUD
 * OOP: Polymorphism - can override base methods for custom behavior
 */
export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel);
    }

    /**
     * Find user by email (with password for authentication)
     */
    async findByEmail(email: string): Promise<IUser | null> {
        return this.model.findOne({ email }).select('+password').exec();
    }

    /**
     * Find all students
     */
    async findAllStudents(): Promise<IUser[]> {
        return this.model.find({ role: 'student' }).exec();
    }

    /**
     * Find user by ID (without password)
     */
    async findByIdSafe(id: string): Promise<IUser | null> {
        return this.model.findById(id).select('-password').exec();
    }
}
