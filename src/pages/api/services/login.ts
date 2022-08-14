import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// mongoose
import connectDB from "../../../utils/connectDB";
import User from "../../../models/User";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  try {
    let user: any = await User.findOne({
      $or: [{ username }, { email: username.toLowerCase() }],
    }).select("+password +avatar +username +admin +bio");
    if (!user) {
      return res.status(200).json({
        success: false,
        error: "Invalid Credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({
        success: false,
        error: "Invalid Credentials",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET || "");
    user = user.toObject();
    delete user.password;
    return res.json({
      success: true,
      token,
      user,
    });
  } catch (error: any) {
    res.status(200).json({ error, success: false });
  }
});
