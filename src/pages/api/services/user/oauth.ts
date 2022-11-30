import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { decode } from "next-auth/jwt";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const decodedSessionToken: any = await decode({
      token: req.body.sessionToken,
      secret: process.env.NEXTAUTH_SECRET || "",
    });
    // check if providerEmail exists in database
    let user: IUserModel | null = await UserModel.findOne({
      providerEmail: decodedSessionToken.email,
    });
    if (!user) {
      // if providerEmail does not exist, create user
      user = await UserModel.create({
        authProvider: req.body.provider,
        providerEmail: decodedSessionToken.email,
        verified: true,
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
  } catch (error) {
    res.json({ error: (error as any).message, success: false });
  }
});
