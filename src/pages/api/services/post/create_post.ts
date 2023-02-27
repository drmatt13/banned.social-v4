import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// aws
import AWS from "aws-sdk";

// mongoose
import connectDB from "@/lib/connectDB";
import PostModel, { IPostModel } from "@/models/PostModel";

export default connectDB(
  async (req: ServiceRequest<"create post">, res: NextApiResponse) => {
    try {
      let { _id, eventbusSecret, post } = req.body;

      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }

      if (post?.image && post.image) {
        try {
          AWS.config.update({ region: "us-east-1", apiVersion: "2006-03-01" });

          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_USER_TOKEN,
            secretAccessKey: process.env.AWS_USER_SECRET,
          });

          const params = {
            Bucket: process.env.AWS_S3_BUCKET || "",
            Key: `post-images/${Date.now() + Math.random()}.jpg`,
            Body: Buffer.from(post.image, "base64"),
            ContentType: "image/jpeg",
          };

          const upload = await s3.upload(params).promise();
          post.image = upload.Location;
        } catch (error) {
          throw new Error(serviceError.FailedToUploadImage);
        }
      }
      const newPost: IPostModel | null = await PostModel.create({
        content: post?.content,
        user_id: _id,
        recipient_id: post?.recipient_id,
        sharedPost_id: post?.sharedPost_id,
        image: post?.image,
        og: post?.og,
      });
      if (newPost) {
        return res.json({ success: true, post: newPost });
      } else {
        throw new Error(serviceError.FailedToUpdateUser);
      }
    } catch (error) {
      res.json({ error: (error as any).message, success: false });
    }
  }
);
