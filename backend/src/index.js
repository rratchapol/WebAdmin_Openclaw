require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const User = require('./models/user.model'); 

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/openclaw';

mongoose.set('bufferCommands', true);

// ฟังก์ชันสร้างแอดมินให้เลยถ้า Database ว่างเปล่า
const seedAdmin = async () => {
  const users = await User.countDocuments();
  if (users === 0) {
    await User.create({
      name: 'System Admin',
      email: 'admin@openclaw.com',
      password: 'password123',
      role: 'admin'
    });
    console.log('🌱 Seeded default admin user (admin@openclaw.com / password123)');
  }
};

const startServer = async () => {
  // 1. เปิดพอร์ตรับ Request ไว้ก่อนทันที 
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  // 2. จัดการเชื่อมต่อ Database 
  try {
    console.log(`⏳ Attempting to connect to MongoDB (${MONGODB_URI})...`);
    // บังคับให้พยายามเชื่อมต่อตลอดเวลา เผื่อ Docker รันช้ากว่าเซิร์ฟเวอร์
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB (Docker)');
    await seedAdmin();
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed. Please ensure Docker is running.');
  }
};

startServer();
