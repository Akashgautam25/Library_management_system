import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config();

class Database {
    private static instance: Database;
    private isConnected = false;

    private constructor() { }

    static getInstance(): Database {
        if (!Database.instance) Database.instance = new Database();
        return Database.instance;
    }

    async connect(): Promise<void> {
        if (this.isConnected) return;
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';
        const client = new MongoClient(uri);
        await client.connect();
        this.isConnected = true;
        console.log('MongoDB connected');
        client.on('error', () => { this.isConnected = false; });
        client.on('disconnected', () => { this.isConnected = false; });
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) return;
        await this.client.close();
        this.isConnected = false;
    }

    private get client(): MongoClient {
        return this._client;
    }

    private set client(value: MongoClient) {
        this._client = value;
    }
}

export default Database;