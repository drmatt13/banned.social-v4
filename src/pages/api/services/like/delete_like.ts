import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import LikeModel from "@/models/LikeModel";

export default connectDB(
  async (req: ServiceRequest<"delete like">, res: NextApiResponse) => {
    try {
      let { _id, eventbusSecret, post_id, comment_id, subcomment_id } =
        req.body;

      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }

      if (!_id || (!post_id && !comment_id && !subcomment_id)) {
        throw new Error(serviceError.MissingRequiredFields);
      }

      // check if like exists
      const like = await LikeModel.findOneAndDelete({
        user_id: _id,
        post_id,
        comment_id,
        subcomment_id,
      });

      if (!like) {
        throw new Error(serviceError.FailedToUnlikeContent);
      }

      res.json({ success: true });
    } catch (error) {
      res.json({ error: (error as any).message, success: false });
    }
  }
);
