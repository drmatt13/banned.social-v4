import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import SubCommentModel, { ISubCommentModel } from "@/models/SubCommentModel";

export default connectDB(
  async (req: ServiceRequest<"get subcomments">, res: NextApiResponse) => {
    try {
      let { eventbusSecret, comment_id } = req.body;

      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }

      if (!comment_id) {
        throw new Error(serviceError.InvalidRequest);
      }

      let subcomments: ISubCommentModel[] = [];

      subcomments = await SubCommentModel.find({
        comment_id,
      }).sort({ createdAt: 1 });

      return res.json({ success: true, subcomments });
    } catch (error) {
      return res.json({ error: (error as any).message, success: false });
    }
  }
);
