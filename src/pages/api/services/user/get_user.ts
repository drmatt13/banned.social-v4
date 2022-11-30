import type { NextApiRequest, NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

// return username, profile_id, and profileAvatar
export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let { _id, profile_id } = req.body;

    if (!_id && !profile_id) {
      throw new Error("No _id or profile_id");
    }

    const user: IUserModel | null = await UserModel.findById(
      profile_id || _id
    ).select("+username +avatar");
    if (user) {
      return res.json({ success: true, user });
    } else {
      return res.json({ success: false, error: "User not found" });
    }
  } catch (error) {
    res.json({ error: (error as any).message, success: false });
  }
});
