import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import Database from './config/database';

const PORT = process.env.PORT || 5001;

// Connect to DB and start server (local dev)
const startServer = async (): Promise<void> => {
    try {
        await Database.getInstance().connect();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

process.on('unhandledRejection', (reason: unknown) => { console.error('Unhandled Rejection:', reason); process.exit(1); });
process.on('uncaughtException', (error: Error) => { console.error('Uncaught Exception:', error); process.exit(1); });

// Connect DB for serverless (Vercel) — runs once per cold start
Database.getInstance().connect().catch(console.error);

// Export app for Vercel serverless
export default app;

// Start normally when run directly (local dev)
if (process.env.NODE_ENV !== 'production') {
    startServer();
}
