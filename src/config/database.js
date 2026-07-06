const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO);
  console.log(mongoose.connection.name);

};

module.exports = connectDB;