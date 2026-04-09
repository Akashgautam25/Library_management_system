import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import Database from './config/database';

const PORT = process.env.PORT || 5001;

process.on('unhandledRejection', (reason: unknown) => { console.error('Unhandled Rejection:', reason); });
process.on('uncaughtException', (error: Error) => { console.error('Uncaught Exception:', error); });

// Export app for Vercel serverless — DB connects lazily on first request
export default app;

// Start normally when run directly (local dev)
if (process.env.NODE_ENV !== 'production') {
    Database.getInstance().connect().then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }).catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}
