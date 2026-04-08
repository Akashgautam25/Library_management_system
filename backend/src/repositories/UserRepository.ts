import { BaseRepository } from './BaseRepository';
import UserModel from '../models/User';
import { IUser } from '../interfaces';

export class UserRepository extends BaseRepository<IUser> {
    constructor() { super(UserModel); }

    async findByEmail(email: string): Promise<IUser | null> {
        return this.model.findOne({ email }).select('+password').exec();
    }

    async findAllStudents(): Promise<IUser[]> {
        return this.model.find({ role: 'student' }).exec();
    }

    async findByIdSafe(id: string): Promise<IUser | null> {
        return this.model.findById(id).select('-password').exec();
    }
}
