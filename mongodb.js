const { MongoClient } = require('mongodb');

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vida-admin:<password>@vida-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = 'ViDaQR';

// Connection pool
let client = null;
let db = null;

// Initialize MongoDB connection
const initializeDatabase = async () => {
    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();

        // Test the connection
        await client.db('admin').command({ ping: 1 });
        console.log('✅ Connected to MongoDB Atlas');

        db = client.db(DB_NAME);

        // Create collection if not exists
        await db.collection('products').createIndex({ id: 1 }, { unique: true });
        console.log('✅ Products collection ready');

        return db;
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err);
        throw err;
    }
};

// Get database connection
const getDatabase = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
};

// Close database connection
const closeConnection = async () => {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('✅ MongoDB connection closed');
    }
};

// Product operations
const ProductService = {
    // Create new product
    async createProduct(productData) {
        const db = getDatabase();
        const result = await db.collection('products').insertOne({
            ...productData,
            createdAt: new Date()
        });
        return result;
    },

    // Find product by ID
    async findProductById(id) {
        const db = getDatabase();
        return await db.collection('products').findOne({ id });
    },

    // Get all products
    async getAllProducts() {
        const db = getDatabase();
        return await db.collection('products').find({}).sort({ createdAt: -1 }).toArray();
    },

    // Update product
    async updateProduct(id, updateData) {
        const db = getDatabase();
        return await db.collection('products').updateOne(
            { id },
            { $set: { ...updateData, updatedAt: new Date() } }
        );
    },

    // Delete product
    async deleteProduct(id) {
        const db = getDatabase();
        return await db.collection('products').deleteOne({ id });
    }
};

module.exports = {
    initializeDatabase,
    getDatabase,
    closeConnection,
    ProductService
};
