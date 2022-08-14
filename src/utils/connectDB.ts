import type { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

const connectDB =
  (handler: any) => async (req: NextRequest, res: NextResponse) => {
    // Use current db connection
    if (mongoose?.connections[0]?.readyState) {
      // console.log("Using current db connection".bold.green);
      return handler(req, res);
    }
    // Use new db connection
    if (process.env.MONGO_URL) {
      mongoose.connect(process.env.MONGO_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      } as {});
    }
    // console.log("Connected to DB".bold.green);
    return handler(req, res);
  };

export default connectDB;
