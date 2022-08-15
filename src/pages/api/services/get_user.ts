import type { NextApiRequest, NextApiResponse } from "next";

// mongoose
import connectDB from "../../../utils/connectDB";
import UserModel, { IUserModel } from "../../../models/UserModel";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  let { _id, profile_id } = req.body;

  // return username, profile_id, and profileAvatar
  try {
    const user: IUserModel | null = await UserModel.findById(
      profile_id || _id
    ).select("+username +avatar");
    if (user) {
      // console.log(user);
      res.json({ success: true, user });
    } else {
      res.json({ success: false, error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error, success: false });
  }
});
