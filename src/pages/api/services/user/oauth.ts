import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { decode } from "next-auth/jwt";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

export default connectDB(async (req: ServiceRequest, res: NextApiResponse) => {
  try {
    const { provider, sessionToken, eventbusSecret } = req.body;
    if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
      throw new Error(serviceError.Unauthorized);
    }
    const decodedSessionToken: any = await decode({
      token: sessionToken,
      secret: process.env.NEXTAUTH_SECRET || "",
    });
    // check if providerEmail exists in database
    let user: IUserModel | null = await UserModel.findOne({
      providerEmail: decodedSessionToken.email,
    });
    if (!user) {
      // if providerEmail does not exist, create user
      user = await UserModel.create({
        authProvider: provider,
        providerEmail: decodedSessionToken.email,
        verified: true,
      });
    }
    if (!user) {
      throw new Error(serviceError.FailedToCreateUser);
    }
    const token = process.env.TOKEN_SECRET
      ? jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
      : undefined;
    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.json({ error: (error as any).message, success: false });
  }
});
