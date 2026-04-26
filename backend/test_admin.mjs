import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const admin = await User.findOne({ name: 'hihi' });
console.log("Admin email:", admin?.email);
console.log("Admin role:", admin?.role);
process.exit(0);
