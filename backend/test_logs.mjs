import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const Log = mongoose.model('ActivityLog', new mongoose.Schema({}, { strict: false }));
const logs = await Log.find({});
console.log("Total logs:", logs.length);
process.exit(0);
