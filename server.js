// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import MongoDB configuration
const { initializeDatabase, ProductService } = require('./mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

/** ---------------- CORS (cho Vercel & localhost) ---------------- **/
const allowedOrigins = [
    'http://localhost:3000',
    'https://vi-da-frontend-gqt3lzfvb-duongs-projects-c939acf1.vercel.app',
    process.env.FRONTEND_URL,
];

// Cấu hình CORS cho production
app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true); // health/ping, server-to-server
        const ok = allowedOrigins.filter(Boolean).some(o => origin.startsWith(o));
        if (ok) return cb(null, true);
        return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
}));

// đảm bảo preflight luôn 204
app.options('*', cors());
app.use((req, res, next) => {
    // Có thể bỏ 3 header dưới khi đã khóa origin theo whitelist ở trên
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

/** ---------------- Body parser ---------------- **/
app.use(express.json());

/** ---------------- Sample data ---------------- **/
const teamMembers = [
    { id: 1, name: "Lê Thị Tố Như", role: "CEO & Leader", description: "Lãnh đạo nhóm với tầm nhìn chiến lược về phát triển sản phẩm thân thiện môi trường. Có kinh nghiệm quản lý và định hướng phát triển bền vững.", avatar: "👩‍💼", gender: "Nữ" },
    { id: 2, name: "Nguyễn Ngọc Hân", role: "Chuyên viên sản xuất", description: "Chuyên gia về quy trình nuôi và chăm sóc scoby. Đảm bảo chất lượng nguyên liệu đầu vào cho sản phẩm.", avatar: "👩‍🔬", gender: "Nữ" },
    { id: 3, name: "Nguyễn Thu Minh", role: "Thiết kế sản phẩm", description: "Chịu trách nhiệm thiết kế các mẫu túi đa dạng và thẩm mỹ từ scoby. Tạo ra những sản phẩm vừa đẹp vừa thân thiện môi trường.", avatar: "👩‍🎨", gender: "Nữ" },
    { id: 4, name: "Nguyễn Thái Dương", role: "CTO - Giám đốc Công nghệ", description: "Chuyên gia về công nghệ sấy khô và quy trình sản xuất. Đảm bảo hiệu quả và chất lượng trong toàn bộ quy trình sản xuất.", avatar: "👨‍💻", gender: "Nam" },
    { id: 5, name: "Nguyễn Ngọc Thu Trang", role: "CMO - Giám đốc Marketing", description: "Chịu trách nhiệm phát triển thương hiệu ViDa và mở rộng thị trường. Xây dựng chiến lược marketing cho sản phẩm thân thiện môi trường.", avatar: "👩‍💼", gender: "Nữ" }
];

const products = [
    { id: 1, name: "Túi shopping nhỏ", description: "Kích thước 25x30cm, phù hợp cho việc mua sắm hàng ngày", capacity: "Chứa được 3-5kg", price: "Liên hệ", image: "👜" },
    { id: 2, name: "Túi shopping lớn", description: "Kích thước 35x40cm, lý tưởng cho việc mua sắm lớn", capacity: "Chứa được 8-10kg", price: "Liên hệ", image: "🛍️" },
    { id: 3, name: "Túi đựng đồ cá nhân", description: "Kích thước 20x25cm, hoàn hảo cho đồ dùng cá nhân", capacity: "Chứa được 2-3kg", price: "Liên hệ", image: "👝" },
    { id: 4, name: "Túi đựng thực phẩm", description: "Kích thước 30x35cm, an toàn cho thực phẩm", capacity: "Chứa được 5-7kg", price: "Liên hệ", image: "🥬" }
];

const futurePlans = [
    { id: 1, title: "Mở rộng quy mô sản xuất", description: "Tăng cường năng lực sản xuất để đáp ứng nhu cầu thị trường ngày càng tăng", timeline: "6 tháng tới", type: "short-term" },
    { id: 2, title: "Nghiên cứu sản phẩm mới", description: "Phát triển các sản phẩm khác từ scoby như hộp đựng, túi xách, v.v.", timeline: "3-6 tháng tới", type: "short-term" },
    { id: 3, title: "Trở thành thương hiệu hàng đầu", description: "Trở thành thương hiệu tiên phong trong lĩnh vực sản phẩm thân thiện môi trường tại Việt Nam", timeline: "2-3 năm tới", type: "long-term" },
    { id: 4, title: "Xuất khẩu ra thị trường quốc tế", description: "Mở rộng sang các thị trường Đông Nam Á và châu Á", timeline: "3-5 năm tới", type: "long-term" }
];

/** ---------------- Routes ---------------- **/
app.get('/', (req, res) => {
    res.json({
        message: 'Chào mừng đến với API Scoby!',
        version: '1.0.0',
        endpoints: ['/api/team', '/api/products', '/api/plans', '/api/contact']
    });
});

app.get('/api/team', (req, res) => {
    res.json({ success: true, data: teamMembers, count: teamMembers.length });
});

app.get('/api/products', (req, res) => {
    res.json({ success: true, data: products, count: products.length });
});

app.get('/api/plans', (req, res) => {
    const { type } = req.query;
    let filteredPlans = futurePlans;
    if (type && ['short-term', 'long-term'].includes(type)) {
        filteredPlans = futurePlans.filter(p => p.type === type);
    }
    res.json({ success: true, data: filteredPlans, count: filteredPlans.length });
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }
    console.log('New contact message:', { name, email, message });
    res.json({ success: true, message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.' });
});

// QR: create
app.post('/api/qr/create', async (req, res) => {
    console.log('📝 Received create request:', req.body);
    const { name, type, batchNumber, producer, description } = req.body || {};
    if (!name || !type || !batchNumber || !producer) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    try {
        const productId = `ViDa-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const productionDate = new Date().toISOString().split('T')[0];

        const productData = {
            id: productId,
            name,
            type,
            productionDate,
            batchNumber,
            producer,
            description: description || '',
            website: 'https://vi-da-frontend-gqt3lzfvb-duongs-projects-c939acf1.vercel.app',
            // QR code sẽ chỉ chứa ID sản phẩm
            qrContent: productId
        };

        await ProductService.createProduct(productData);
        console.log('✅ New product created in MongoDB:', productData);

        res.json({ success: true, data: productData, message: 'Sản phẩm đã được tạo thành công' });
    } catch (err) {
        console.error('❌ Error creating product:', err);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi tạo sản phẩm' });
    }
});

// QR: lookup
app.get('/api/qr/lookup/:productId', async (req, res) => {
    const { productId } = req.params;
    console.log('🔍 Looking up product:', productId);
    try {
        const product = await ProductService.findProductById(productId);
        console.log('📦 Found product:', product);
        if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm với mã này' });

        const productInfo = {
            id: product.id,
            name: product.name,
            type: product.type,
            productionDate: product.productionDate,
            batchNumber: product.batchNumber,
            producer: product.producer,
            description: product.description || '',
            website: 'https://vi-da-frontend-gqt3lzfvb-duongs-projects-c939acf1.vercel.app'
            // Không cần trả về lookupUrl vì frontend sẽ tự xử lý based on ID
        };
        res.json({ success: true, data: productInfo });
    } catch (err) {
        console.error('❌ Error looking up product:', err);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi tra cứu sản phẩm' });
    }
});

// list products
app.get('/api/qr/products', async (req, res) => {
    try {
        const list = await ProductService.getAllProducts();
        const formatted = list.map(p => ({
            id: p.id,
            name: p.name,
            type: p.type,
            productionDate: p.productionDate,
            batchNumber: p.batchNumber,
            producer: p.producer,
            description: p.description || '',
            website: 'vida.com',
            createdAt: p.createdAt
        }));
        res.json({ success: true, data: formatted, count: formatted.length });
    } catch (err) {
        console.error('❌ Error fetching products:', err);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi lấy danh sách sản phẩm' });
    }
});

// Health
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// 404
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint không tồn tại' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra trên server' });
});

// Init DB & start
const startServer = async () => {
    try {
        console.log('🔄 Initializing server...');
        await initializeDatabase();
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server ViDa đang chạy tại http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    console.error(err.stack);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    if (err instanceof Error) console.error(err.stack);
});

startServer();
