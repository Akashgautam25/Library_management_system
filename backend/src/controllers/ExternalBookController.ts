import { Request, Response, NextFunction } from 'express';
import { ExternalBookService } from '../services/ExternalBookService';

const externalBookService = new ExternalBookService();

export const searchExternalBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const q = req.query.q as string;
        if (!q?.trim()) {
            res.status(400).json({ success: false, message: 'Query param "q" is required' });
            return;
        }

        const subject = req.query.subject as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

        const books = await externalBookService.searchBooks(q, subject, page, limit);

        res.status(200).json({
            success: true,
            message: 'External books fetched successfully',
            data: { books, page, limit, count: books.length },
        });
    } catch (error) {
        next(error);
    }
};
