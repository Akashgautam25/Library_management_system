import crypto from 'crypto';
import logger from '../config/logger';

const QR_SECRET = process.env.QR_SECRET || 'qr_default_secret_change_in_prod';
const QR_TTL_SECONDS = parseInt(process.env.QR_TTL_SECONDS || '300'); // 5 minutes

export interface QRPayload {
    bookId: string;
    action: 'issue' | 'return';
    expires: number; // Unix timestamp
    sig: string;
}

export class QRService {
    /**
     * Generate a signed QR payload for a book action
     */
    generateQRPayload(bookId: string, action: 'issue' | 'return' = 'issue'): QRPayload {
        const expires = Math.floor(Date.now() / 1000) + QR_TTL_SECONDS;
        const data = `${bookId}:${action}:${expires}`;
        const sig = crypto.createHmac('sha256', QR_SECRET).update(data).digest('hex');
        return { bookId, action, expires, sig };
    }

    /**
     * Verify QR payload signature and expiry
     */
    verifyQRPayload(payload: QRPayload): { valid: boolean; reason?: string } {
        const now = Math.floor(Date.now() / 1000);
        if (now > payload.expires) {
            return { valid: false, reason: 'QR code has expired' };
        }
        const data = `${payload.bookId}:${payload.action}:${payload.expires}`;
        const expectedSig = crypto.createHmac('sha256', QR_SECRET).update(data).digest('hex');
        const sigValid = crypto.timingSafeEqual(
            Buffer.from(expectedSig, 'hex'),
            Buffer.from(payload.sig, 'hex')
        );
        if (!sigValid) {
            logger.warn('QR payload signature mismatch', { payload });
            return { valid: false, reason: 'Invalid QR code signature' };
        }
        return { valid: true };
    }

    /**
     * Get remaining seconds on a QR payload
     */
    getRemainingSeconds(payload: QRPayload): number {
        return Math.max(0, payload.expires - Math.floor(Date.now() / 1000));
    }
}

export const qrService = new QRService();
