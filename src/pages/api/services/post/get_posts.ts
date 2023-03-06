import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import PostModel, { IPostModel } from "@/models/PostModel";

export default connectDB(
  async (req: ServiceRequest<"get posts">, res: NextApiResponse) => {
    try {
      let { _id, eventbusSecret, type, page, limit, recipient_id } = req.body;

      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }

      if (!type || !page || !limit) {
        throw new Error(serviceError.InvalidRequest);
      }

      let posts: IPostModel[] = [];
      // get posts
      if (type === "global") {
        posts = await PostModel.find()
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);
      }
      // get friends posts
      else if (type === "friends") {
        posts = await PostModel.find()
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);
      }
      // get user posts
      else if (type === "user") {
        if (!_id) {
          throw new Error(serviceError.InvalidUserId);
        }
        posts = await PostModel.find({
          $or: [{ user_id: recipient_id }, { recipient_id }],
        })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);
      }
      return res.json({ posts, success: true });
    } catch (error) {
      return res.json({ error: (error as any).message, success: false });
    }
  }
);
