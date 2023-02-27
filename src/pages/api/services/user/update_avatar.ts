import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// aws
import AWS from "aws-sdk";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

export default connectDB(
  async (req: ServiceRequest<"update avatar">, res: NextApiResponse) => {
    try {
      let { _id, avatar, eventbusSecret } = req.body;
      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }
      if (avatar?.charAt(0) === "/") {
        try {
          AWS.config.update({ region: "us-east-1", apiVersion: "2006-03-01" });

          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_USER_TOKEN,
            secretAccessKey: process.env.AWS_USER_SECRET,
          });

          const params = {
            Bucket: process.env.AWS_S3_BUCKET || "",
            Key: `avatars/${_id}`,
            Body: Buffer.from(avatar, "base64"),
            ContentType: "image/jpeg",
          };

          const upload = await s3.upload(params).promise();
          avatar = upload.Location;
        } catch (error) {
          throw new Error(serviceError.FailedToUploadImage);
        }
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
  }
);
