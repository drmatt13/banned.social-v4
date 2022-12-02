import type { NextApiRequest, NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

// return username, profile_id, and profileAvatar
export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let { _id, username } = req.body;
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
