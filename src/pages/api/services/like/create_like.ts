import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import LikeModel, { ILikeModel } from "@/models/LikeModel";

export default connectDB(
  async (req: ServiceRequest<"create like">, res: NextApiResponse) => {
    try {
      let { _id, eventbusSecret, post_id, comment_id, subcomment_id } =
        req.body;

      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }

      if (!_id || (!post_id && !comment_id && !subcomment_id)) {
        throw new Error(serviceError.MissingRequiredFields);
      }

      // check if like already exists, search by user_id and
      // post_id or comment_id or subcomment_id
      const like = await LikeModel.findOne({
        user_id: _id,
        post_id,
        comment_id,
        subcomment_id,
      });

      if (like) {
        throw new Error(serviceError.FailedToLikeContent);
      }

      // create like
      const newLike = await LikeModel.create({
        user_id: _id,
        post_id,
        comment_id,
        subcomment_id,
      });

      if (!newLike) {
        throw new Error(serviceError.FailedToLikeContent);
      }

      res.json({ success: true });
    } catch (error) {
      res.json({ error: (error as any).message, success: false });
    }
  }
);
