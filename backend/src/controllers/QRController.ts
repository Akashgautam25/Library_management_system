import { Request, Response, NextFunction } from 'express';
import { qrService } from '../services/QRService';
import { TransactionService } from '../services/TransactionService';
import { UnauthorizedError, ValidationError } from '../utils/AppError';

export class QRController {
    private transactionService = new TransactionService();

    /**
     * GET /api/qr/book/:bookId?action=issue|return
     * Generates a signed QR payload for a book action
     */
    generateQR = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { bookId } = req.params;
            const action = (req.query.action as 'issue' | 'return') || 'issue';

            if (!['issue', 'return'].includes(action)) {
                throw new ValidationError('Action must be "issue" or "return"');
            }

            const payload = qrService.generateQRPayload(bookId, action);
            const remaining = qrService.getRemainingSeconds(payload);

            res.status(200).json({
                success: true,
                message: 'QR payload generated',
                data: { payload, expiresInSeconds: remaining },
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * POST /api/qr/scan
     * Validates QR payload and issues/returns the book
     */
    scanQR = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { payload } = req.body;
            if (!payload) throw new ValidationError('QR payload is required');

            const verification = qrService.verifyQRPayload(payload);
            if (!verification.valid) {
                throw new UnauthorizedError(verification.reason || 'Invalid QR code');
            }

            const userId = req.user!.userId;
            let transaction;

            if (payload.action === 'issue') {
                transaction = await this.transactionService.issueBook(userId, payload.bookId, req);
            } else {
                transaction = await this.transactionService.returnBook(userId, payload.bookId, req);
            }

            res.status(200).json({
                success: true,
                message: payload.action === 'issue' ? 'Book issued via QR' : 'Book returned via QR',
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    };
}
