import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

// return username, profile_id, and profileAvatar
export default connectDB(async (req: ServiceRequest, res: NextApiResponse) => {
  try {
    let { _id, username, eventbusSecret } = req.body;
    if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
      throw new Error(serviceError.Unauthorized);
    }
    const user: IUserModel | null = await UserModel.findOne({ username });
    if (user) {
      throw new Error(serviceError.UsernameAlreadyExists);
    }
    const updatedUser: IUserModel | null = await UserModel.findByIdAndUpdate(
      _id,
      { username },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error(serviceError.FailedToUpdateUser);
    }
    return res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.json({ error: (error as any).message, success: false });
  }
});
