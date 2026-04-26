import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const admin = await User.findOne({ name: 'hihi' });
    if (!admin) { console.log("Admin not found!"); process.exit(1); }

    const token = jwt.sign(
        { userId: admin._id.toString(), role: admin.role, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    console.log("Token:", token.substring(0, 15) + "...");

    // Test /transactions/all
    try {
        const res1 = await fetch('http://localhost:5001/api/transactions/all?limit=200', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("/all Status:", res1.status);
        console.log("/all Body:", (await res1.text()).substring(0, 200));
    } catch(e) { console.error("/all Error:", e.message); }

    // Test /transactions/overdue
    try {
        const res2 = await fetch('http://localhost:5001/api/transactions/overdue', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("/overdue Status:", res2.status);
        console.log("/overdue Body:", (await res2.text()).substring(0, 200));
    } catch(e) { console.error("/overdue Error:", e.message); }

    // Test /transactions/active
    try {
        const res3 = await fetch('http://localhost:5001/api/transactions/active', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("/active Status:", res3.status);
        console.log("/active Body:", (await res3.text()).substring(0, 200));
    } catch(e) { console.error("/active Error:", e.message); }

    process.exit(0);
}
test();
