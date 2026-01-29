const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable if set, otherwise use default
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://pkdevelopers17:x9jauedVroZ3qUyA@pkdevelopers.w4clrnu.mongodb.net/pet-healthcare?retryWrites=true&w=majority';
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('\n💡 Authentication Failed - Solutions:');
      console.error('1. Check MongoDB Atlas username and password');
      console.error('2. Verify database user has proper permissions');
      console.error('3. If password has special characters, URL encode them');
      console.error('4. Check MongoDB Atlas → Database Access → Verify user exists');
      console.error('5. Try resetting the database user password in Atlas');
    } else if (error.message.includes('IP')) {
      console.error('\n💡 IP Whitelist Issue - Solutions:');
      console.error('1. Go to MongoDB Atlas → Network Access');
      console.error('2. Click "Add IP Address"');
      console.error('3. Add your current IP or use 0.0.0.0/0 (for development only)');
    } else {
      console.error('\n💡 General Solutions:');
      console.error('1. Check your internet connection');
      console.error('2. Verify MongoDB Atlas cluster is running');
      console.error('3. Try using local MongoDB: mongodb://localhost:27017/pet-healthcare');
    }
    
    console.error('\n📝 To use local MongoDB instead, set in .env:');
    console.error('MONGODB_URI=mongodb://localhost:27017/pet-healthcare\n');
    
    process.exit(1);
  }
};

module.exports = connectDB;



