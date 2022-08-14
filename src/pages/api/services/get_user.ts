import type { NextApiRequest, NextApiResponse } from "next";

// mongoose
import connectDB from "../../../utils/connectDB";
import User from "../../../models/User";

export default connectDB(async (req: NextApiRequest, res: NextApiResponse) => {
  let { _id, profile_id } = req.body;

  // return username, profile_id, and profileAvatar
  try {
    const user = await User.findById(profile_id || _id).select(
      "+username +profileAvatar"
    );
    if (user) {
      // console.log(user);
      res.json({ success: true, user });
    } else {
      res.json({ success: false, error: "User not found" });
    }
  } catch (error) {
    res.status(200).json({ error, success: false });
  }
});
