import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import chalk from "chalk";

// mongoose
import connectDB from "../../../utils/connectDB";
import UserModel, { IUserModel } from "../../../models/UserModel";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  try {
    let user: IUserModel | null = await UserModel.findOne({
      $or: [{ username }, { email: username.toLowerCase() }],
    }).select("+password +avatar +username +admin +bio");
    if (!user) {
      return res.status(200).json({
        success: false,
        error: "Invalid Credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password || "");
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
  } catch (error) {
    console.log(chalk.red.bold(error));
    res.status(500).json({ error, success: false });
  }
});
