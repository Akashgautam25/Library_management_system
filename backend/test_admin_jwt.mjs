import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const admin = await User.findOne({ role: 'admin' });
    
    const token = jwt.sign(
        { userId: admin._id.toString(), role: admin.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1h' }
    );
    console.log("Generated token:", token.substring(0, 20) + '...');

    const allRes = await fetch('http://localhost:5001/api/transactions/all?limit=200', {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log("ALL:", allRes.status, await allRes.text());

    const overdueRes = await fetch('http://localhost:5001/api/transactions/overdue', {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log("OVERDUE:", overdueRes.status, await overdueRes.text());

    process.exit(0);
}
test();
