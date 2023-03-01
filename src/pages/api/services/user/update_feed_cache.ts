import type ServiceRequest from "@/types/serviceRequest";
import { serviceError } from "@/lib/processService";
import type { NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

// return username, profile_id, and profileAvatar
export default connectDB(
  async (req: ServiceRequest<"update feed cache">, res: NextApiResponse) => {
    try {
      let { eventbusSecret, _id, users } = req.body;
      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }
      if (!_id) {
        throw new Error(serviceError.InvalidUserId);
      }

      // take an array of users andget them from the db with only the username and avatar
      const usersFromDB = await UserModel.find(
        { _id: { $in: users } },
        { username: 1, avatar: 1 }
      );

      return res.json({ success: true, users: usersFromDB });
    } catch (error) {
      res.json({ error: (error as any).message, success: false });
    }
  }
);
