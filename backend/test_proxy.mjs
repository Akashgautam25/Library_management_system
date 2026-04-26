import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const admin = await User.findOne({ role: 'admin' });
    const token = jwt.sign(
        { userId: admin._id.toString(), role: admin.role, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    try {
        const res1 = await fetch('http://localhost:3000/api/transactions/all?limit=200', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("PROXY /all Status:", res1.status);
        console.log("PROXY /all Body:", (await res1.text()).substring(0, 200));
    } catch(e) { console.error("PROXY /all Error:", e.message); }

    try {
        const res2 = await fetch('http://localhost:3000/api/transactions/overdue', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("PROXY /overdue Status:", res2.status);
    } catch(e) { console.error("PROXY /overdue Error:", e.message); }

    process.exit(0);
}
test();
