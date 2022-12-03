import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // check for username, email and password
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(200).json({
        success: false,
        error: "Please fill in all fields",
      });
    }

    if (req.body._id) {
      delete req.body._id;
    }

    // check if user exists
    const user: IUserModel | null = await UserModel.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.email.toLowerCase() },
      ],
    }).select("+password");
    if (user) {
      if (req.body.username === user.username) {
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

    req.body.password = await bcrypt.hash(req.body.password, 10);
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
