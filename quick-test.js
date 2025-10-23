// Quick test MongoDB data
const testData = {
    "name": "Túi Shopping Nhỏ",
    "type": "tui-shopping-nho",
    "batchNumber": "BATCH-2024-001",
    "producer": "Nguyễn Ngọc Hân",
    "description": "Túi shopping nhỏ được làm từ scoby tự nhiên, kích thước 25x30cm, thân thiện môi trường"
};

async function testAPI() {
    console.log('🧪 Testing ViDa API...\n');

    try {
        // Test 1: Tạo sản phẩm
        console.log('📝 Test data:', testData);
        console.log('⏳ Creating product...');

        const createResponse = await fetch('http://localhost:5000/api/qr/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });

        const createResult = await createResponse.json();

        if (createResult.success) {
            console.log('✅ Product created successfully!');
            console.log('📦 Product ID:', createResult.data.id);
            console.log('📦 Product Name:', createResult.data.name);

            // Test 2: Tra cứu sản phẩm
            console.log('\n🔍 Testing lookup...');
            const lookupResponse = await fetch(`http://localhost:5000/api/qr/lookup/${createResult.data.id}`);
            const lookupResult = await lookupResponse.json();

            if (lookupResult.success) {
                console.log('✅ Product lookup successful!');
                console.log('📦 Found product:', lookupResult.data.name);
            } else {
                console.log('❌ Lookup failed:', lookupResult.message);
            }

            // Test 3: Lấy danh sách
            console.log('\n📋 Testing get all products...');
            const productsResponse = await fetch('http://localhost:5000/api/qr/products');
            const productsResult = await productsResponse.json();

            if (productsResult.success) {
                console.log('✅ Products retrieved successfully!');
                console.log('📦 Total products:', productsResult.count);
                console.log('📦 Products:', productsResult.data.map(p => ({ id: p.id, name: p.name })));
            } else {
                console.log('❌ Get products failed:', productsResult.message);
            }

        } else {
            console.log('❌ Create failed:', createResult.message);
        }

    } catch (error) {
        console.log('❌ Connection error:', error.message);
        console.log('💡 Make sure backend is running on http://localhost:5000');
    }

    console.log('\n🏁 Test completed!');
}

// Run test
testAPI();
