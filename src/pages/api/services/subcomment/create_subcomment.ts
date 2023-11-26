import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// aws
import AWS from "aws-sdk";

// mongoose
import connectDB from "@/lib/connectDB";
import SubCommentModel, { ISubCommentModel } from "@/models/SubCommentModel";

export default connectDB(
  async (req: ServiceRequest<"create subcomment">, res: NextApiResponse) => {
    try {
      let { _id, eventbusSecret, content, image, comment_id, og } = req.body;

      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }

      if (!_id || !comment_id || !(content || image)) {
        throw new Error(serviceError.MissingRequiredFields);
      }

      if (image) {
        try {
          AWS.config.update({ region: "us-east-1", apiVersion: "2006-03-01" });

          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_USER_TOKEN,
            secretAccessKey: process.env.AWS_USER_SECRET,
          });

          const params = {
            Bucket: process.env.AWS_S3_BUCKET || "",
            Key: `comment-images/${Date.now() + Math.random()}.jpg`,
            Body: Buffer.from(image, "base64"),
            ContentType: "image/jpeg",
          };

          const upload = await s3.upload(params).promise();
          image = upload.Location;
        } catch (error) {
          throw new Error(serviceError.FailedToUploadImage);
        }
      }
      const subcomment: ISubCommentModel | null = await SubCommentModel.create({
        user_id: _id,
        comment_id,
        content,
        image,
        og,
      });
      if (subcomment) {
        return res.json({ success: true, subcomment });
      } else {
        throw new Error(serviceError.FailedToCreateSubComment);
      }
    } catch (error) {
      res.json({ error: (error as any).message, success: false });
    }
  }
);
