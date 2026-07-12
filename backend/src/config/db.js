const mongoose = require('mongoose');
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/issuepilot';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Starting without database connection. Some API routes may fail until MongoDB is available.');
  }
};

module.exports = connectDB;
