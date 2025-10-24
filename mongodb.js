const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'ViDaQR';

let client = null;
let db = null;

const initializeDatabase = async () => {
    try {
        client = new MongoClient(MONGODB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            },
            serverSelectionTimeoutMS: 10000
        });

        await client.connect();
        await client.db('admin').command({ ping: 1 });
        console.log('✅ Connected to MongoDB Atlas');

        db = client.db(DB_NAME);
        await db.collection('products').createIndex({ id: 1 }, { unique: true });
        console.log('✅ Products collection ready');
        return db;
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        throw err;
    }
};
