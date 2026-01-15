#!/usr/bin/env node

/**
 * Admin Dashboard API Test Script
 * This script tests the admin dashboard API endpoints
 */

import http from 'http';

const BASE_URL = 'http://localhost:4000';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test the dashboard stats endpoint
async function testDashboardStats(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/admin/fetch/dashboard-stats',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data, error: 'Failed to parse JSON' });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Login and get token
async function login(email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ email, password });

    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data, error: 'Failed to parse JSON' });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Main test function
async function runTests() {
  log('\n========================================', 'blue');
  log('   Admin Dashboard API Test Suite', 'blue');
  log('========================================\n', 'blue');

  try {
    // Test 1: Login
    log('Test 1: Testing Login...', 'yellow');
    log('Trying admin@example.com...', 'blue');
    let loginResult = await login('admin@example.com', 'admin123');
    
    // If admin@example.com fails, try rifat@gmail.com with different passwords
    if (loginResult.status !== 200) {
      log('  admin@example.com failed, trying rifat@gmail.com...', 'blue');
      loginResult = await login('rifat@gmail.com', 'password');
      
      if (loginResult.status !== 200) {
        loginResult = await login('rifat@gmail.com', '123456');
      }
    }
    
    if (loginResult.status === 200 && loginResult.data.token) {
      log('✓ Login successful!', 'green');
      log(`  Token: ${loginResult.data.token.substring(0, 20)}...`, 'blue');
      log(`  User: ${loginResult.data.user.name} (${loginResult.data.user.role})`, 'blue');
      
      const token = loginResult.data.token;

      // Test 2: Dashboard Stats
      log('\nTest 2: Testing Dashboard Stats API...', 'yellow');
      const statsResult = await testDashboardStats(token);
      
      if (statsResult.status === 200 && statsResult.data.success) {
        log('✓ Dashboard Stats API working!', 'green');
        log('\nDashboard Data:', 'blue');
        log(`  Total Revenue: $${statsResult.data.totalRevenueAllTime}`, 'blue');
        log(`  Today's Revenue: $${statsResult.data.todayRevenue}`, 'blue');
        log(`  Total Users: ${statsResult.data.totalUsersCount}`, 'blue');
        log(`  New Users This Month: ${statsResult.data.newUsersThisMonth}`, 'blue');
        log(`  Revenue Growth: ${statsResult.data.revenueGrowth}`, 'blue');
        log(`  Top Selling Products: ${statsResult.data.topSellingProducts.length}`, 'blue');
        log(`  Low Stock Products: ${statsResult.data.lowStockProducts.length}`, 'blue');
        
        log('\n✓ All tests passed!', 'green');
      } else {
        log(`✗ Dashboard Stats API failed!`, 'red');
        log(`  Status: ${statsResult.status}`, 'red');
        log(`  Response: ${JSON.stringify(statsResult.data, null, 2)}`, 'red');
      }
    } else {
      log('✗ Login failed!', 'red');
      log(`  Status: ${loginResult.status}`, 'red');
      log(`  Response: ${JSON.stringify(loginResult.data, null, 2)}`, 'red');
      log('\nMake sure:', 'yellow');
      log('  1. Backend server is running on port 4000', 'yellow');
      log('  2. User exists with email: rifat@gmail.com', 'yellow');
      log('  3. User role is set to "Admin"', 'yellow');
      log('  4. Password is correct (default: rifat123)', 'yellow');
    }
  } catch (error) {
    log(`\n✗ Test failed with error:`, 'red');
    log(`  ${error.message}`, 'red');
    log('\nMake sure the backend server is running!', 'yellow');
  }

  log('\n========================================\n', 'blue');
}

// Run the tests
runTests();
