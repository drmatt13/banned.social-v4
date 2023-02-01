import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";
import isBase64 from "is-base64";

// aws
import AWS from "aws-sdk";

// mongoose
import connectDB from "@/lib/connectDB";
import UserModel, { IUserModel } from "@/models/UserModel";

export default connectDB(async (req: ServiceRequest, res: NextApiResponse) => {
  try {
    let { _id, avatar, eventbusSecret } = req.body;
    if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
      throw new Error(serviceError.Unauthorized);
    }
    if (isBase64(avatar || "", { mimeRequired: true })) {
      AWS.config.update({ region: "us-east-1", apiVersion: "2006-03-01" });

      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

      const params = {
        Bucket: "social-media-8434-1348-6435",
        Key: `${_id}`,
        Body: Buffer.from(
          avatar!.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      };

      const upload = await s3.upload(params).promise();
      avatar = upload.Location;
      console.log("upload", upload);
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
