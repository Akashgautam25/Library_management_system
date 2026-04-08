//server.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import Database from './config/database';

/**
 * Server Entry Point
 * Uses Singleton Database instance for connection management
 */
const PORT = process.env.PORT;

if (!PORT) {
    console.error('❌ PORT is not defined in the environment variables');
    process.exit(1);
}

const startServer = async (): Promise<void> => {
    try {
        // Connect to database using Singleton pattern
        const database = Database.getInstance();
        await database.connect();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 Library Management System API v1.0`);
            console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled rejections
process.on('unhandledRejection', (reason: unknown) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

startServer();
