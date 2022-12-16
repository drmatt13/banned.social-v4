import serviceError from "@/types/serviceError";
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
      throw new Error(serviceError.Unauthorized);
    }
    let user: IUserModel | null = await UserModel.findOne({
      $or: [{ username }, { email: username?.toLowerCase() }],
    }).select("+password +avatar +username +admin +bio");
    if (!user) {
      throw new Error(serviceError.InvalidCredentials);
    }
    const isMatch = await bcrypt.compare(
      password ? password : "",
      user.password || ""
    );
    if (!isMatch) {
      throw new Error(serviceError.InvalidCredentials);
    }
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
    });
    if (!updatedUser) {
      throw new Error(serviceError.FailedToUpdateUser);
    }
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
