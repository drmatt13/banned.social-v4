import colors from "colors";

// mongoose
import connectDB from "../../../utils/connectDB";
import User from "../../../models/User";

export default connectDB(async (req, res) => {
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
    console.log("user not found".bold.red);
    res.json({ success: false });
  }
});
