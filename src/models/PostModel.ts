import { Document, Schema, model, models } from "mongoose";

// types
import type Og from "@/types/og";

export interface IPostModel extends Document {
  _id?: string;
  content: string;
  user_id?: string;
  recipient_id?: string;
  sharedPost_id?: string;
  image?: string;
  og?: Og;
  createdAt?: Date;
}

const PostSchema = new Schema<IPostModel>({
  user_id: {
    type: String,
    required: true,
  },
  recipient_id: {
    type: String,
  },
  sharedPost_id: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  og: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

PostSchema.pre("save", function (next) {
  next();
});

PostSchema.pre("remove", function (next) {
  next();
});

// Create and export user model
const getModel = () => model("Post", PostSchema);
export default (models.Post || getModel()) as ReturnType<typeof getModel>;
