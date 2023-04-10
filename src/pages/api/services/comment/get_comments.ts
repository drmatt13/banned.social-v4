import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import CommentModel, { ICommentModel } from "@/models/CommentModel";

export default connectDB(
  async (req: ServiceRequest<"get comments">, res: NextApiResponse) => {
    try {
      let { eventbusSecret, page, limit, post_id } = req.body;

      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }

      if (!post_id || !page || !limit) {
        throw new Error(serviceError.InvalidRequest);
      }

      let comments: ICommentModel[] = [];

      comments = await CommentModel.find({
        post_id,
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.json({ comments, success: true });
    } catch (error) {
      return res.json({ error: (error as any).message, success: false });
    }
  }
);
