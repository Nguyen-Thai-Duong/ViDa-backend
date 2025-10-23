const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import MongoDB configuration
const { initializeDatabase, ProductService } = require('./mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
const teamMembers = [
    {
        id: 1,
        name: "Lê Thị Tố Như",
        role: "CEO & Leader",
        description: "Lãnh đạo nhóm với tầm nhìn chiến lược về phát triển sản phẩm thân thiện môi trường. Có kinh nghiệm quản lý và định hướng phát triển bền vững.",
        avatar: "👩‍💼",
        gender: "Nữ"
    },
    {
        id: 2,
        name: "Nguyễn Ngọc Hân",
        role: "Chuyên viên sản xuất",
        description: "Chuyên gia về quy trình nuôi và chăm sóc scoby. Đảm bảo chất lượng nguyên liệu đầu vào cho sản phẩm.",
        avatar: "👩‍🔬",
        gender: "Nữ"
    },
    {
        id: 3,
        name: "Nguyễn Thu Minh",
        role: "Thiết kế sản phẩm",
        description: "Chịu trách nhiệm thiết kế các mẫu túi đa dạng và thẩm mỹ từ scoby. Tạo ra những sản phẩm vừa đẹp vừa thân thiện môi trường.",
        avatar: "👩‍🎨",
        gender: "Nữ"
    },
    {
        id: 4,
        name: "Nguyễn Thái Dương",
        role: "CTO - Giám đốc Công nghệ",
        description: "Chuyên gia về công nghệ sấy khô và quy trình sản xuất. Đảm bảo hiệu quả và chất lượng trong toàn bộ quy trình sản xuất.",
        avatar: "👨‍💻",
        gender: "Nam"
    },
    {
        id: 5,
        name: "Nguyễn Ngọc Thu Trang",
        role: "CMO - Giám đốc Marketing",
        description: "Chịu trách nhiệm phát triển thương hiệu ViDa và mở rộng thị trường. Xây dựng chiến lược marketing cho sản phẩm thân thiện môi trường.",
        avatar: "👩‍💼",
        gender: "Nữ"
    }
];

const products = [
    {
        id: 1,
        name: "Túi shopping nhỏ",
        description: "Kích thước 25x30cm, phù hợp cho việc mua sắm hàng ngày",
        capacity: "Chứa được 3-5kg",
        price: "Liên hệ",
        image: "👜"
    },
    {
        id: 2,
        name: "Túi shopping lớn",
        description: "Kích thước 35x40cm, lý tưởng cho việc mua sắm lớn",
        capacity: "Chứa được 8-10kg",
        price: "Liên hệ",
        image: "🛍️"
    },
    {
        id: 3,
        name: "Túi đựng đồ cá nhân",
        description: "Kích thước 20x25cm, hoàn hảo cho đồ dùng cá nhân",
        capacity: "Chứa được 2-3kg",
        price: "Liên hệ",
        image: "👝"
    },
    {
        id: 4,
        name: "Túi đựng thực phẩm",
        description: "Kích thước 30x35cm, an toàn cho thực phẩm",
        capacity: "Chứa được 5-7kg",
        price: "Liên hệ",
        image: "🥬"
    }
];

const futurePlans = [
    {
        id: 1,
        title: "Mở rộng quy mô sản xuất",
        description: "Tăng cường năng lực sản xuất để đáp ứng nhu cầu thị trường ngày càng tăng",
        timeline: "6 tháng tới",
        type: "short-term"
    },
    {
        id: 2,
        title: "Nghiên cứu sản phẩm mới",
        description: "Phát triển các sản phẩm khác từ scoby như hộp đựng, túi xách, v.v.",
        timeline: "3-6 tháng tới",
        type: "short-term"
    },
    {
        id: 3,
        title: "Trở thành thương hiệu hàng đầu",
        description: "Trở thành thương hiệu tiên phong trong lĩnh vực sản phẩm thân thiện môi trường tại Việt Nam",
        timeline: "2-3 năm tới",
        type: "long-term"
    },
    {
        id: 4,
        title: "Xuất khẩu ra thị trường quốc tế",
        description: "Mở rộng sang các thị trường Đông Nam Á và châu Á",
        timeline: "3-5 năm tới",
        type: "long-term"
    }
];

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Chào mừng đến với API Scoby!',
        version: '1.0.0',
        endpoints: [
            '/api/team',
            '/api/products',
            '/api/plans',
            '/api/contact'
        ]
    });
});

// Team members endpoint
app.get('/api/team', (req, res) => {
    res.json({
        success: true,
        data: teamMembers,
        count: teamMembers.length
    });
});

// Products endpoint
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        data: products,
        count: products.length
    });
});

// Future plans endpoint
app.get('/api/plans', (req, res) => {
    const { type } = req.query;
    let filteredPlans = futurePlans;

    if (type && ['short-term', 'long-term'].includes(type)) {
        filteredPlans = futurePlans.filter(plan => plan.type === type);
    }

    res.json({
        success: true,
        data: filteredPlans,
        count: filteredPlans.length
    });
});

// Contact endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin'
        });
    }

    // In a real application, you would save this to a database
    console.log('New contact message:', { name, email, message });

    res.json({
        success: true,
        message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.'
    });
});

// QR Code endpoints
app.post('/api/qr/create', async (req, res) => {
    const { name, type, batchNumber, producer, description } = req.body;

    if (!name || !type || !batchNumber || !producer) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
        });
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
            website: 'vida.com',
            lookupUrl: `vida.com/qr-lookup/${productId}`
        };

        await ProductService.createProduct(productData);

        console.log('✅ New product created in MongoDB:', productData);

        res.json({
            success: true,
            data: productData,
            message: 'Sản phẩm đã được tạo thành công'
        });
    } catch (err) {
        console.error('❌ Error creating product:', err);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi tạo sản phẩm'
        });
    }
});

app.get('/api/qr/lookup/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await ProductService.findProductById(productId);

        if (product) {
            const productInfo = {
                id: product.id,
                name: product.name,
                type: product.type,
                productionDate: product.productionDate,
                batchNumber: product.batchNumber,
                producer: product.producer,
                description: product.description || '',
                website: 'vida.com',
                lookupUrl: `vida.com/qr-lookup/${product.id}`
            };

            res.json({
                success: true,
                data: productInfo
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm với mã này'
            });
        }
    } catch (err) {
        console.error('❌ Error looking up product:', err);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi tra cứu sản phẩm'
        });
    }
});

app.get('/api/qr/products', async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();

        const formattedProducts = products.map(product => ({
            id: product.id,
            name: product.name,
            type: product.type,
            productionDate: product.productionDate,
            batchNumber: product.batchNumber,
            producer: product.producer,
            description: product.description || '',
            website: 'vida.com',
            createdAt: product.createdAt
        }));

        res.json({
            success: true,
            data: formattedProducts,
            count: formattedProducts.length
        });
    } catch (err) {
        console.error('❌ Error fetching products:', err);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy danh sách sản phẩm'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint không tồn tại'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra trên server'
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        // Initialize database connection
        await initializeDatabase();

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server ViDa đang chạy tại http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
            console.log(`🗄️  Database: SQL Server connected`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};

// Start the server
startServer();