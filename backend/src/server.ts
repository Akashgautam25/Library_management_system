//server.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import Database from './config/database';
import logger from './config/logger';

const PORT = process.env.PORT || '5001';

const startServer = async (): Promise<void> => {
    try {
        const database = Database.getInstance();
        await database.connect();

        app.listen(PORT, () => {
            logger.info(`🚀 LibraryOS API v2.0 running on http://localhost:${PORT}`);
            logger.info(`📚 Health check: http://localhost:${PORT}/api/health`);
            logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        logger.error('Failed to start server', { error });
        process.exit(1);
    }
};

process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Rejection', { reason });
    process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
});

startServer();
