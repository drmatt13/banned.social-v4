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
    let { username, email, password, eventbusSecret } = req.body;
    if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
      throw new Error(serviceError.Unauthorized);
    }
    // check for username, email and password
    if (!username || !email || !password) {
      throw new Error(serviceError.InvalidForm);
    }

    // check if user exists
    const user: IUserModel | null = await UserModel.findOne({
      $or: [{ username: username }, { email: email.toLowerCase() }],
    }).select("+password");
    if (user) {
      if (username === user.username) {
        throw new Error(serviceError.UsernameAlreadyExists);
      } else {
        throw new Error(serviceError.EmailAlreadyExists);
      }
    }

    password = await bcrypt.hash(password, 10);
    let newUser: IUserModel = await UserModel.create(req.body);
    const token = process.env.TOKEN_SECRET
      ? jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET)
      : undefined;
    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.json({ error: (error as any).message, success: false });
  }
});
