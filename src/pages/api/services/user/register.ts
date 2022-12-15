import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

export default connectDB(async (req: ServiceRequest, res: NextApiResponse) => {
  try {
    let { username, email, password, eventbusSecret } = req.body;
    if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
      return res.json({
        success: false,
        error: "Unauthorized",
      });
    }
    // check for username, email and password
    if (!username || !email || !password) {
      return res.status(200).json({
        success: false,
        error: "Please fill in all fields",
      });
    }

    // check if user exists
    const user: IUserModel | null = await UserModel.findOne({
      $or: [{ username: username }, { email: email.toLowerCase() }],
    }).select("+password");
    if (user) {
      if (username === user.username) {
        return res.json({
          success: false,
          error: "Username already exists",
        });
      } else {
        return res.status(200).json({
          success: false,
          error: "Email already exists",
        });
      }
    }

    password = await bcrypt.hash(password, 10);
    let newUser: IUserModel = await UserModel.create(req.body);
    const token = process.env.TOKEN_SECRET
      ? jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET)
      : undefined;
    newUser = newUser.toObject();
    delete newUser.password;
    delete newUser.email;
    delete newUser.lastLogin;
    delete newUser.createdAt;
    return res.json({
      success: true,
      token,
      user: newUser,
    });
  } catch (error) {
    res.json({ error: (error as any).message, success: false });
  }
});
