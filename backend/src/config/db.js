import mongoose from 'mongoose';
import dns from 'dns';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Force Google Public DNS to bypass Windows ISP querySrv DNS blocking
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if custom DNS setting is restricted
}

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // 1. Try Primary MongoDB Atlas URI configured in backend/.env
  if (uri && !uri.includes('placementportal.mongodb.net')) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
      console.log(`🚀 [MongoDB Atlas Connected]: ${conn.connection.host} / Database: ${conn.connection.name}`);
      return;
    } catch (err) {
      console.warn(`[MongoDB Atlas Warning]: SRV Connection failed (${err.message}). Trying Direct Shard Connection...`);
      
      // 1b. Direct Atlas Shard Retry
      try {
        const directAtlasUri = 'mongodb://Aashwi21:Shreeji2703@ac-wh0kgyt-shard-00-00.ej97uap.mongodb.net:27017,ac-wh0kgyt-shard-00-01.ej97uap.mongodb.net:27017,ac-wh0kgyt-shard-00-02.ej97uap.mongodb.net:27017/placement_portal?ssl=true&replicaSet=atlas-12l4mr-shard-0&authSource=admin&appName=Cluster0';
        const conn = await mongoose.connect(directAtlasUri, { serverSelectionTimeoutMS: 6000 });
        console.log(`🚀 [MongoDB Atlas Connected Direct]: ${conn.connection.host} / Database: ${conn.connection.name}`);
        return;
      } catch (directErr) {
        console.warn(`[MongoDB Atlas Warning]: Direct connection failed (${directErr.message}). Trying local fallback...`);
      }
    }
  }

  // 2. Fallback: Try Local MongoDB Instance
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/placement_portal', { serverSelectionTimeoutMS: 2000 });
    console.log(`[MongoDB Connected]: Local Instance -> ${conn.connection.host}`);
    return;
  } catch (err) {
    console.warn('[MongoDB Warning]: Local MongoDB instance not detected. Launching In-Memory Database Engine...');
  }

  // 3. Fallback: Automatic In-Memory MongoDB Server Engine
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Connected]: In-Memory Engine -> ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Critical Failure]: ${error.message}`);
  }
};
