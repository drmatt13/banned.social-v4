import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { decode } from "next-auth/jwt";

// mongoose
import connectDB from "../../../utils/connectDB";
import User from "../../../models/User";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const decodedSessionToken: any = await decode({
      token: req.body.sessionToken,
      secret: process.env.NEXTAUTH_SECRET || "",
    });
    // check if providerEmail exists in database
    let user: any = await User.findOne({
      providerEmail: decodedSessionToken.email,
    });
    if (!user) {
      // if providerEmail does not exist, create user
      user = await User.create({
        authProvider: req.body.provider,
        providerEmail: decodedSessionToken.email,
      });
    }
    const token = process.env.TOKEN_SECRET
      ? jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
      : undefined;
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
