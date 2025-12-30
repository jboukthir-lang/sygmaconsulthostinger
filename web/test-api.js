const fetch = require('node-fetch');

async function testClientCreation() {
    try {
        console.log('Testing Client Creation API...');
        const response = await fetch('http://localhost:3000/api/clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': 'test-script-user'
            },
            body: JSON.stringify({
                name: 'Test Client Script',
                email: 'script@test.com',
                phone: '123456789',
                address: '123 Test St'
            })
        });

        const status = response.status;
        console.log(`Response Status: ${status}`);

        if (status === 200 || status === 201) {
            const data = await response.json();
            console.log('Success! Created client:', data);
        } else {
            const text = await response.text();
            console.error('Error Response:', text);
        }
    } catch (error) {
        console.error('Test Script Error:', error);
    }
}

testClientCreation();
