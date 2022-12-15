import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

export default connectDB(async (req: ServiceRequest, res: NextApiResponse) => {
  try {
    const { username, password, eventbusSecret } = req.body;
    if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
      return res.json({
        success: false,
        error: "Unauthorized",
      });
    }
    let user: IUserModel | null = await UserModel.findOne({
      $or: [{ username }, { email: username?.toLowerCase() }],
    }).select("+password +avatar +username +admin +bio");
    if (!user) {
      return res.json({
        success: false,
        error: "Invalid Credentials",
      });
    }
    const isMatch = await bcrypt.compare(
      password ? password : "",
      user.password || ""
    );
    if (!isMatch) {
      return res.json({
        success: false,
        error: "Invalid Credentials",
      });
    }
    await UserModel.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
    });
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET || "");
    user = user.toObject();
    delete user.password;
    return res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.json({ error: (error as any).message, success: false });
  }
});
