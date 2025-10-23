// Test API tạo sản phẩm
const testData = {
    "name": "Test Product",
    "type": "test",
    "batchNumber": "TEST-001",
    "producer": "Test User",
    "description": "Test description"
};

async function testCreate() {
    try {
        console.log('🧪 Testing create product API...');
        console.log('📝 Data:', testData);

        const response = await fetch('http://localhost:5000/api/qr/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        console.log('📊 Response status:', response.status);
        const result = await response.json();
        console.log('📦 Response:', result);

        if (result.success) {
            console.log('✅ Product created successfully!');
            console.log('🆔 Product ID:', result.data.id);

            // Test lookup
            console.log('\n🔍 Testing lookup...');
            const lookupResponse = await fetch(`http://localhost:5000/api/qr/lookup/${result.data.id}`);
            const lookupResult = await lookupResponse.json();
            console.log('🔍 Lookup result:', lookupResult);

        } else {
            console.log('❌ Error:', result.message);
        }

    } catch (error) {
        console.log('❌ Connection error:', error.message);
    }
}

testCreate();
