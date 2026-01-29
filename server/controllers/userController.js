const User = require('../models/User');

const getVeterinarians = async (req, res) => {
  try {
    const veterinarians = await User.find({ role: 'veterinarian' })
      .select('name email phone _id')
      .sort({ name: 1 });
    
    res.success({ veterinarians }, 'Veterinarians retrieved successfully');
  } catch (error) {
    res.fail(error.message, 500);
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.fail('Access denied. Admin only.', 403);
    }

    const users = await User.find()
      .select('name email role phone createdAt')
      .sort({ createdAt: -1 });
    
    res.success({ users }, 'Users retrieved successfully');
  } catch (error) {
    res.fail(error.message, 500);
  }
};

module.exports = { getVeterinarians, getAllUsers };
