// mongodb.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'ViDaQR';

let client = null;
let db = null;

async function initializeDatabase() {
  try {
    if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');
    console.log('🔄 Connecting to MongoDB...', MONGODB_URI);

    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      serverSelectionTimeoutMS: 10000,
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
}

function getDatabase() {
  if (!db) throw new Error('Database not initialized. Call initializeDatabase() first.');
  return db;
}

async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('✅ MongoDB connection closed');
  }
}

const ProductService = {
  async createProduct(productData) {
    const db = getDatabase();
    console.log('📝 Creating product:', productData);
    const result = await db.collection('products').insertOne({ ...productData, createdAt: new Date() });
    console.log('✅ Product created:', result);
    return result;
  },
  async findProductById(id) {
    const db = getDatabase();
    console.log('🔍 Finding product by id:', id);
    const product = await db.collection('products').findOne({ id });
    console.log('🔍 Found product:', product);
    return product;
  },
  async getAllProducts() {
    const db = getDatabase();
    return await db.collection('products').find({}).sort({ createdAt: -1 }).toArray();
  },
  async updateProduct(id, updateData) {
    const db = getDatabase();
    return await db.collection('products').updateOne(
      { id },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
  },
  async deleteProduct(id) {
    const db = getDatabase();
    return await db.collection('products').deleteOne({ id });
  },
};

module.exports = {
  initializeDatabase,
  getDatabase,
  closeConnection,
  ProductService,
};
