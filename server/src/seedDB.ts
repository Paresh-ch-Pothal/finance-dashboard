// seedDB.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import UserModel, { Iuser } from './models/userModel';
import RecordModel, { Irecord } from './models/recordModel';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding...');
    } catch (err) {
        console.error('MongoDB connection failed', err);
        process.exit(1);
    }
}

// Seed Users
const users: Partial<Iuser>[] = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123', // will hash
        role: 'Admin',
        isActive: true,
    },
    {
        name: 'Analyst User',
        email: 'analyst@example.com',
        password: 'analyst123',
        role: 'Analyst',
        isActive: true,
    },
    {
        name: 'Viewer User',
        email: 'viewer@example.com',
        password: 'viewer123',
        role: 'Viewer',
        isActive: true,
    }
];

// Seed Records
const records: Partial<Irecord>[] = [
    {
        type: 'Income',
        amount: 5000,
        category: 'Salary',
        date: new Date(),
        description: 'Monthly salary',
    },
    {
        type: 'Expense',
        amount: 1500,
        category: 'Food',
        date: new Date(),
        description: 'Groceries',
    },
    {
        type: 'Income',
        amount: 2000,
        category: 'Freelance',
        date: new Date(),
        description: 'Freelance project',
    },
    {
        type: 'Expense',
        amount: 800,
        category: 'Transport',
        date: new Date(),
        description: 'Taxi and fuel',
    }
];

async function seedDB() {
    await connectDB();

    try {
        // Clear existing data
        await UserModel.deleteMany({});
        await RecordModel.deleteMany({});

        // Create users with hashed passwords
        const createdUsers: Iuser[] = [];
        for (const u of users) {
            const hashedPassword = await bcrypt.hash(u.password!, 10);
            const newUser = await UserModel.create({ ...u, password: hashedPassword });
            createdUsers.push(newUser);
        }

        console.log('Users seeded:', createdUsers.map(u => u.email));

        // Assign records randomly to users
        for (const r of records) {
            const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            await RecordModel.create({ ...r, createdBy: randomUser._id as any });
        }

        console.log('Records seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seedDB();