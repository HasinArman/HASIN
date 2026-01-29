// Set environment variables before requiring server
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-ci';

const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const mongoose = require('mongoose');

// Increase timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe('Auth API', () => {
  beforeAll(async () => {
    // MongoDB connection with proper error handling
    // Use MongoDB Atlas if MONGODB_URI is set, otherwise use test database
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://pkdevelopers17:x9jauedVroZ3qUyA@pkdevelopers.w4clrnu.mongodb.net/pet-healthcare-test?retryWrites=true&w=majority';
    try {
      // Disconnect if already connected
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 10000 // 10 second timeout
      });
      // Wait for connection to be ready
      await mongoose.connection.db.admin().ping();
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }, 30000); // 30 second timeout for beforeAll

  afterAll(async () => {
    try {
      await User.deleteMany({});
      await mongoose.connection.close();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }, 30000);

  beforeEach(async () => {
    // Clean up with proper error handling - only delete users from this test suite
    try {
      // Delete only users created in auth tests (not pet test users)
      await User.deleteMany({ email: { $regex: /^(test-|test@example\.com$)/ } });
    } catch (error) {
      console.error('Cleanup error in beforeEach:', error);
    }
  }, 30000); // 30 second timeout for beforeEach

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'client'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should not register with duplicate email', async () => {
      // First, register a user successfully
      const testEmail = `test-${Date.now()}@example.com`;
      const firstResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'First User',
          email: testEmail,
          password: 'password123',
          role: 'client'
        });
      expect(firstResponse.status).toBe(201);

      // Wait a bit to ensure user is saved
      await new Promise(resolve => setTimeout(resolve, 200));

      // Try to register again with the same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Second User',
          email: testEmail, // Same email - should fail
          password: 'password123',
          role: 'client'
        });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Delete existing login test user first to avoid conflicts
      await User.deleteMany({ email: 'test@example.com' });
      // Small delay to ensure cleanup completes
      await new Promise(resolve => setTimeout(resolve, 50));
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.token).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});