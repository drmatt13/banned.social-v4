import serviceError from "@/types/serviceError";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

export default connectDB(async (req: ServiceRequest, res: NextApiResponse) => {
  try {
    let { _id, avatar, eventbusSecret } = req.body;
    if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
      throw new Error(serviceError.Unauthorized);
    }
    const user: IUserModel | null = await UserModel.findOneAndUpdate(
      { _id },
      { avatar },
      { new: true }
    ).select("+avatar +username +admin");
    if (user) {
      return res.json({ success: true, user });
    } else {
      throw new Error(serviceError.FailedToUpdateUser);
    }
  } catch (error) {
    res.json({ error: (error as any).message, success: false });
  }
});
