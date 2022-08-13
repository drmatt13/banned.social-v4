import colors from "colors";
import mongoose from "mongoose";

const connectDB = (handler) => async (req, res) => {
  // Use current db connection
  if (mongoose.connections[0].readyState) {
    // console.log("Using current db connection".bold.green);
    return handler(req, res);
  }
  // Use new db connection
  await mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  // console.log("Connected to DB".bold.green);
  return handler(req, res);
};

export default connectDB;
