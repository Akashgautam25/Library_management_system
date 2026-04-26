import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const db = await mongoose.connect(process.env.MONGODB_URI);
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const admin = await User.findOne({ role: 'admin' });
console.log("Admin email:", admin.email);

// mock a token (or we can just query the DB directly)
const Transaction = mongoose.model('Transaction', new mongoose.Schema({}, { strict: false }));
const allT = await Transaction.find({});
console.log("Total transactions:", allT.length);
const returned = await Transaction.find({ status: 'returned' });
console.log("Returned transactions:", returned.length);
const overdue = await Transaction.find({ status: 'borrowed', dueDate: { $lt: new Date() } });
console.log("Overdue transactions:", overdue.length);

process.exit(0);
