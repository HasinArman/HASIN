const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Pet = require('../models/Pet');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

describe('Pet API', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-healthcare-test');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Pet.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Pet.deleteMany({});

    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    userId = user._id;
    authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '7d' }
    );
  });

  describe('POST /api/pets', () => {
    it('should create a new pet', async () => {
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
      await Pet.create({
        name: 'Buddy',
        species: 'Dog',
        owner: userId
      });

      const response = await request(app)
        .get('/api/pets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.pets).toHaveLength(1);
    });
  });
});
