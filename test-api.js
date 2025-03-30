const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Test configuration
const TEST_FILE = './test-image.jpg'; // Replace with actual test file
const API_URL = 'http://localhost:8000/api/verify';
const MEDIA_TYPE = 'image';

async function testVerification() {
    try {
        console.log('Starting API test...');
        
        // Check if test file exists
        if (!fs.existsSync(TEST_FILE)) {
            console.error('Test file not found. Please create a test file first.');
            return;
        }

        // Prepare form data
        const form = new FormData();
        form.append('file', fs.createReadStream(TEST_FILE));
        form.append('type', MEDIA_TYPE);

        // Send request
        console.log('Sending verification request...');
        const response = await axios.post(API_URL, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        // Check response
        if (response.data && response.data.verdict) {
            console.log('Test successful!');
            console.log('Verification results:');
            console.log(`- Verdict: ${response.data.verdict}`);
            console.log(`- Confidence: ${response.data.confidence}%`);
            console.log(`- Media Type: ${response.data.mediaType}`);
            console.log('Detailed analysis:');
            console.log(response.data.details);
        } else {
            console.error('Unexpected response format:', response.data);
        }
    } catch (error) {
        console.error('Test failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

// Run test
testVerification();