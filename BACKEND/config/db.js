const mongoose = require('mongoose');
require('dotenv').config();
const URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log(`Database connected`);
  } catch (error) {
    console.log(`Error occured in connecting to database ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
