import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    private static instance: Database;
    private isConnected = false;

    private constructor() {}

    static getInstance(): Database {
        if (!Database.instance) Database.instance = new Database();
        return Database.instance;
    }

    async connect(): Promise<void> {
        if (this.isConnected) return;
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';
        await mongoose.connect(uri);
        this.isConnected = true;
        console.log('✅ MongoDB connected');
        mongoose.connection.on('error', () => { this.isConnected = false; });
        mongoose.connection.on('disconnected', () => { this.isConnected = false; });
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) return;
        await mongoose.disconnect();
        this.isConnected = false;
    }
}

export default Database;
