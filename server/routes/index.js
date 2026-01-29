const express = require('express');
const router = express.Router();
const responseMiddleware = require('../middlewares/response');
const { requireAuth } = require('../middlewares/auth');

// Apply response middleware to all routes
router.use(responseMiddleware);

// Public routes
const authRoutes = require('./auth');
router.use('/auth', authRoutes);

// Protected routes
const petRoutes = require('./pet');
const appointmentRoutes = require('./appointment');
const userRoutes = require('./user');

router.use('/pets', requireAuth, petRoutes);
router.use('/appointments', requireAuth, appointmentRoutes);
router.use('/users', requireAuth, userRoutes);

module.exports = router;
