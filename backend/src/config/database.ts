import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// ============================================================
// Design Pattern: Singleton Pattern
// Ensures only one database connection exists throughout the
// application lifecycle. The Database class uses a private
// static instance and a private constructor to prevent external
// instantiation, guaranteeing a single connection pool.
// ============================================================

class Database {
    private static instance: Database;
    private isConnected: boolean = false;

    // OOP Concept: Encapsulation - private constructor prevents
    // external instantiation, controlling object creation
    private constructor() { }

    /**
     * Get the singleton database instance
     */
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    /**
     * Connect to MongoDB
     */
    public async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('Database already connected');
            return;
        }

        try {
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';

            await mongoose.connect(mongoUri);

            this.isConnected = true;
            console.log('✅ MongoDB connected successfully');

            mongoose.connection.on('error', (error) => {
                console.error('MongoDB connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
                this.isConnected = false;
            });
        } catch (error) {
            console.error('❌ MongoDB connection failed:', error);
            process.exit(1);
        }
    }

    /**
     * Disconnect from MongoDB
     */
    public async disconnect(): Promise<void> {
        if (!this.isConnected) return;
        await mongoose.disconnect();
        this.isConnected = false;
        console.log('MongoDB disconnected');
    }

    /**
     * Check connection status
     */
    public getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

export default Database;
