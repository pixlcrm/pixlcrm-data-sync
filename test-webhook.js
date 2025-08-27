#!/usr/bin/env node

/**
 * Test script for the PixlCRM CORE webhook endpoint
 * Run with: node test-webhook.js
 */

const https = require('https');
const http = require('http');

// Sample payloads for testing
const samplePayloads = {
  aryeo: {
    order: {
      id: "test-aryeo-order-123",
      date: "2024-01-15",
      total_price: 299.99,
      address: {
        full_address: "123 Main St, Anytown, USA"
      },
      items: [
        { name: "Professional Photography" },
        { name: "Virtual Tour" }
      ],
      property_website_url: "https://example.com/property/123"
    },
    agent: {
      email: "agent@example.com",
      name: "John Doe"
    }
  },

  hdphotohub: {
    AppointmentId: "test-hdph-appointment-456",
    AppointmentDate: "2024-01-15",
    DeliveryDate: "2024-01-20",
    TotalPrice: 199.99,
    PropertyAddress: "456 Oak Ave, Somewhere, USA",
    Services: ["Photography", "Drone Shots"],
    ClientEmail: "client@example.com",
    ClientName: "Jane Smith",
    Status: "Placed",
    PropertyURL: "https://example.com/property/456"
  },

  spiro: {
    job: {
      id: "test-spiro-job-789",
      date: "2024-01-15",
      deliveryDate: "2024-01-20",
      price: 399.99,
      address: "789 Pine St, Elsewhere, USA",
      services: ["Photography", "Video Tour"],
      clientEmail: "client@example.com",
      clientName: "Bob Johnson",
      status: "Placed",
      propertyUrl: "https://example.com/property/789"
    }
  },

  relahq: {
    orderId: "test-relahq-order-101",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-20",
    totalPrice: 249.99,
    propertyAddress: "101 Elm St, Nowhere, USA",
    services: ["Photography", "Floor Plan"],
    agent: {
      email: "agent@example.com",
      fullName: "Alice Brown"
    },
    status: "Placed",
    propertyUrl: "https://example.com/property/101"
  },

  tonomo: {
    orderId: "test-tonomo-order-202",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-20",
    totalPrice: 179.99,
    propertyAddress: "202 Maple Dr, Anywhere, USA",
    services: ["Photography", "Virtual Staging"],
    clientEmail: "client@example.com",
    clientName: "Charlie Wilson",
    orderStatus: "Placed",
    propertyUrl: "https://example.com/property/202"
  }
};

function makeRequest(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

async function testWebhook() {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  const webhookUrl = `${baseUrl}/api/webhook/order-event`;
  
  console.log(`🧪 Testing webhook endpoint: ${webhookUrl}\n`);

  for (const [platform, payload] of Object.entries(samplePayloads)) {
    console.log(`📤 Testing ${platform.toUpperCase()} payload...`);
    
    try {
      const response = await makeRequest(webhookUrl, payload);
      
      if (response.statusCode === 200) {
        console.log(`✅ ${platform}: SUCCESS`);
        console.log(`   Order ID: ${response.data.order_id}`);
        console.log(`   Platform: ${response.data.platform}`);
      } else {
        console.log(`❌ ${platform}: FAILED (${response.statusCode})`);
        console.log(`   Error: ${JSON.stringify(response.data, null, 2)}`);
      }
    } catch (error) {
      console.log(`❌ ${platform}: ERROR`);
      console.log(`   ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🏁 Testing complete!');
}

// Run the test
if (require.main === module) {
  testWebhook().catch(console.error);
}

module.exports = { testWebhook, samplePayloads };
