import type ServiceRequest from "@/types/serviceRequest";
import { serviceError } from "@/lib/processService";
import type { NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

// return username, profile_id, and profileAvatar
export default connectDB(
  async (req: ServiceRequest<"get user">, res: NextApiResponse) => {
    try {
      let { _id, eventbusSecret } = req.body;
      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }
      if (!_id) {
        throw new Error(serviceError.InvalidUserId);
      }

      const user: IUserModel | null = await UserModel.findById(_id).select(
        "+username +avatar"
      );
      if (user) {
        return res.json({ success: true, user });
      } else {
        throw new Error(serviceError.FailedToGetUser);
      }
    } catch (error) {
      res.json({ error: (error as any).message, success: false });
    }
  }
);
