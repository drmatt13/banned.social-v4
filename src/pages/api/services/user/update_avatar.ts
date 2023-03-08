import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// aws
import AWS from "aws-sdk";

// data
import avatarList from "@/data/avatarList";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

// sharp
import sharp from "sharp";

export default connectDB(
  async (req: ServiceRequest<"update avatar">, res: NextApiResponse) => {
    try {
      let { _id, prevAvatar, avatar, eventbusSecret } = req.body;
      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }
      if (!avatarList[prevAvatar || ""] || avatar?.charAt(0) === "/") {
        try {
          AWS.config.update({ region: "us-east-1", apiVersion: "2006-03-01" });

          const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_USER_TOKEN,
            secretAccessKey: process.env.AWS_USER_SECRET,
          });

          if (!avatarList[prevAvatar || ""]) {
            await s3
              .deleteObject({
                Bucket: process.env.AWS_S3_BUCKET || "",
                Key: `avatars-mini/${prevAvatar}`,
              })
              .promise();
            await s3
              .deleteObject({
                Bucket: process.env.AWS_S3_BUCKET || "",
                Key: `avatars/${prevAvatar}`,
              })
              .promise();
          }

          const avatarName = `${_id}-${Date.now()}`;

          if (avatar?.charAt(0) === "/") {
            await s3
              .upload({
                Bucket: process.env.AWS_S3_BUCKET || "",
                Key: `avatars/${avatarName}`,
                Body: Buffer.from(avatar, "base64"),
                ContentType: "image/jpeg",
              })
              .promise();

            // resize avatar to 100x100 and upload to s3
            await s3
              .upload({
                Bucket: process.env.AWS_S3_BUCKET || "",
                Key: `avatars-mini/${avatarName}`,
                Body: await sharp(Buffer.from(avatar, "base64"))
                  .resize(40, 40, {
                    fit: "cover",
                    position: "center",
                  })
                  .toFormat("jpeg")
                  .toBuffer(),
                ContentType: "image/jpeg",
              })
              .promise();

            avatar = avatarName;
          }
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
