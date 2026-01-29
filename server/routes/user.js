const express = require('express');
const router = express.Router();
const { getVeterinarians, getAllUsers } = require('../controllers/userController');
const { requireAuth } = require('../middlewares/auth');

// Get all veterinarians (public for clients to book)
router.get('/veterinarians', requireAuth, getVeterinarians);

// Get all users (admin only)
router.get('/', requireAuth, getAllUsers);

module.exports = router;
