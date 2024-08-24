import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Log the MongoDB URI to verify it's being loaded correctly
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MONGODB connection FAILED`, error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
