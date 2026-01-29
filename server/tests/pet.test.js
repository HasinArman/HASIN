// Set environment variables before requiring server
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-ci';

const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Pet = require('../models/Pet');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Increase timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe('Pet API', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
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
      await Pet.deleteMany({});
      await mongoose.connection.close();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }, 30000);

  beforeEach(async () => {
    // Clean up with proper error handling - only delete pet test users (not auth test users)
    try {
      // Delete only users created in pet tests (email pattern: test-timestamp-random@example.com)
      await User.deleteMany({ email: { $regex: /^test-\d+-[a-z0-9]+@example\.com$/ } });
      await Pet.deleteMany({});
    } catch (error) {
      console.error('Cleanup error in beforeEach:', error);
    }

    // Create user with unique email to avoid duplicate key errors
    const uniqueEmail = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
    const user = await User.create({
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123'
    });

    // Ensure user is saved - User.create already saves, but verify
    userId = user._id;
    
    // Verify user exists in database
    const savedUser = await User.findById(userId);
    if (!savedUser) {
      throw new Error(`User with ID ${userId} was not saved properly`);
    }

    // Use same JWT_SECRET as server expects
    const jwtSecret = process.env.JWT_SECRET || 'test-secret-key-for-ci';
    // Use ObjectId string for token
    authToken = jwt.sign(
      { userId: userId.toString() },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Small delay to ensure everything is saved
    await new Promise(resolve => setTimeout(resolve, 50));
  }, 30000); // 30 second timeout for beforeEach

  describe('POST /api/pets', () => {
    it('should create a new pet', async () => {
      // Verify user exists and mongoose is connected
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Mongoose is not connected');
      }
      
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found in database`);
      }

      // Verify token is valid
      const jwtSecret = process.env.JWT_SECRET || 'test-secret-key-for-ci';
      let decoded;
      try {
        decoded = jwt.verify(authToken, jwtSecret);
        if (decoded.userId !== userId.toString()) {
          throw new Error(`Token userId ${decoded.userId} doesn't match ${userId.toString()}`);
        }
      } catch (error) {
        throw new Error(`Token verification failed: ${error.message}`);
      }

      const response = await request(app)
        .post('/api/pets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Buddy',
          species: 'Dog',
          breed: 'Golden Retriever',
          age: 3,
          weight: 25
        });
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.pet).toBeDefined();
      expect(response.body.data.pet.name).toBe('Buddy');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/pets')
        .send({
          name: 'Buddy',
          species: 'Dog'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/pets', () => {
    it('should get all pets for the user', async () => {
      // Ensure user exists (it should from beforeEach, but verify)
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found - beforeEach might have failed');
      }

      // Create pet with the user's ID
      await Pet.create({
        name: 'Buddy',
        species: 'Dog',
        owner: userId
      });

      // Verify token is valid
      const jwtSecret = process.env.JWT_SECRET || 'test-secret-key-for-ci';
      try {
        const decoded = jwt.verify(authToken, jwtSecret);
        if (decoded.userId !== userId.toString()) {
          throw new Error('Token userId mismatch');
        }
      } catch (error) {
        throw new Error(`Token verification failed: ${error.message}`);
      }

      const response = await request(app)
        .get('/api/pets')
        .set('Authorization', `Bearer ${authToken}`);

      // Debug: log response if failed
      if (response.status !== 200) {
        console.error('Response status:', response.status);
        console.error('Response body:', JSON.stringify(response.body, null, 2));
      }

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.pets).toBeDefined();
      expect(Array.isArray(response.body.data.pets)).toBe(true);
      expect(response.body.data.pets.length).toBeGreaterThanOrEqual(1);
    });
  });
});