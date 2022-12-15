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
      return res.json({
        success: false,
        error: "Unauthorized",
      });
    }
    const user: IUserModel | null = await UserModel.findOne({ username });
    if (user) {
      return res.json({
        success: false,
        error: "Username already exists",
      });
    }
    const updatedUser: IUserModel | null = await UserModel.findByIdAndUpdate(
      _id,
      { username },
      { new: true }
    );
    if (!updatedUser) {
      return res.json({
        success: false,
        error: "Failed to update username",
      });
    }
    return res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.json({ error: (error as any).message, success: false });
  }
});
