import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// mongoose
import connectDB from "../../../utils/connectDB";
import User from "../../../models/User";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  // check for username, email and password
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(200).json({
      success: false,
      error: "Please fill in all fields",
    });
  }

  if (req.body._id === null) {
    delete req.body._id;
  }

  try {
    // check if user exists
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    }).select("+password");
    if (user) {
      return res.status(200).json({
        success: false,
        error: "User already exists",
      });
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
    let newUser: any = await User.create(req.body);
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
    res.status(200).json({ error, success: false });
  }
});
