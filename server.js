const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import MongoDB configuration
const { initializeDatabase, ProductService } = require('./mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

/* ✅ CORS configuration */
const allowedOrigins = [
    'https://vi-da-frontend-gqt3lzfvb-duongs-projects-c939acf1.vercel.app', // domain hiện tại của bạn
    'https://vi-da-frontend.vercel.app', // domain rút gọn (nếu bạn dùng)
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // Cho phép request không có Origin (Postman, health check)
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', cors());
app.use(express.json());

/* ✅ Sample data */
const teamMembers = [
    { id: 1, name: "Lê Thị Tố Như", role: "CEO & Leader", description: "Lãnh đạo nhóm với tầm nhìn chiến lược về phát triển sản phẩm thân thiện môi trường.", avatar: "👩‍💼", gender: "Nữ" },
    { id: 2, name: "Nguyễn Ngọc Hân", role: "Chuyên viên sản xuất", description: "Chuyên gia về quy trình nuôi và chăm sóc scoby.", avatar: "👩‍🔬", gender: "Nữ" },
    { id: 3, name: "Nguyễn Thu Minh", role: "Thiết kế sản phẩm", description: "Thiết kế các mẫu túi từ scoby thẩm mỹ và bền vững.", avatar: "👩‍🎨", gender: "Nữ" },
    { id: 4, name: "Nguyễn Thái Dương", role: "CTO - Giám đốc Công nghệ", description: "Phụ trách công nghệ sấy khô và quy trình sản xuất.", avatar: "👨‍💻", gender: "Nam" },
    { id: 5, name: "Nguyễn Ngọc Thu Trang", role: "CMO - Giám đốc Marketing", description: "Phát triển thương hiệu ViDa và mở rộng thị trường.", avatar: "👩‍💼", gender: "Nữ" }
];

const products = [
    { id: 1, name: "Túi shopping nhỏ", description: "25x30cm, phù hợp mua sắm hàng ngày", capacity: "3-5kg", price: "Liên hệ", image: "👜" },
    { id: 2, name: "Túi shopping lớn", description: "35x40cm, lý tưởng cho việc mua sắm lớn", capacity: "8-10kg", price: "Liên hệ", image: "🛍️" },
    { id: 3, name: "Túi đựng đồ cá nhân", description: "20x25cm, hoàn hảo cho đồ dùng cá nhân", capacity: "2-3kg", price: "Liên hệ", image: "👝" },
    { id: 4, name: "Túi đựng thực phẩm", description: "30x35cm, an toàn cho thực phẩm", capacity: "5-7kg", price: "Liên hệ", image: "🥬" }
];

const futurePlans = [
    { id: 1, title: "Mở rộng quy mô sản xuất", description: "Tăng cường năng lực sản xuất", timeline: "6 tháng tới", type: "short-term" },
    { id: 2, title: "Nghiên cứu sản phẩm mới", description: "Phát triển các sản phẩm khác từ scoby", timeline: "3-6 tháng tới", type: "short-term" },
    { id: 3, title: "Trở thành thương hiệu hàng đầu", description: "Tại Việt Nam", timeline: "2-3 năm tới", type: "long-term" },
    { id: 4, title: "Xuất khẩu quốc tế", description: "Mở rộng sang Đông Nam Á", timeline: "3-5 năm tới", type: "long-term" }
];

/* ✅ Routes */
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
    if (type && ['short-term', 'long-term'].includes(type))
        filteredPlans = futurePlans.filter(plan => plan.type === type);
    res.json({ success: true, data: filteredPlans, count: filteredPlans.length });
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    console.log('New contact:', { name, email, message });
    res.json({ success: true, message: 'Cảm ơn bạn đã liên hệ!' });
});

/* ✅ QR Code endpoints */
app.post('/api/qr/create', async (req, res) => {
    const { name, type, batchNumber, producer, description } = req.body;
    if (!name || !type || !batchNumber || !producer)
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });

    try {
        const productId = `ViDa-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const productionDate = new Date().toISOString().split('T')[0];
        const productData = {
            id: productId, name, type, productionDate, batchNumber,
            producer, description: description || '',
            website: 'vida.com', lookupUrl: `vida.com/qr-lookup/${productId}`
        };
        await ProductService.createProduct(productData);
        console.log('✅ New product created:', productData);
        res.json({ success: true, data: productData, message: 'Sản phẩm đã được tạo thành công' });
    } catch (err) {
        console.error('❌ Error creating product:', err);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi tạo sản phẩm' });
    }
});

app.get('/api/qr/lookup/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await ProductService.findProductById(productId);
        if (product)
            res.json({ success: true, data: product });
        else
            res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm với mã này' });
    } catch (err) {
        console.error('❌ Error looking up product:', err);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi tra cứu sản phẩm' });
    }
});

app.get('/api/qr/products', async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        res.json({ success: true, data: products, count: products.length });
    } catch (err) {
        console.error('❌ Error fetching products:', err);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi lấy danh sách sản phẩm' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

/* ✅ 404 & Error handlers */
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Endpoint không tồn tại' }));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra trên server' });
});

/* ✅ Start server */
const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Server ViDa đang chạy tại http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
