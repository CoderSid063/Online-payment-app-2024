const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      "mongodb://localhost:27017/paytm"
    );
    console.log(`\n MongoDb Connected : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDb connection error", error);
    process.exit(1);
  }
};
module.exports = { connectDB };
