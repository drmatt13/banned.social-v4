import { Document, Schema, model, models } from "mongoose";

// types
import type Og from "@/types/og";

export interface ICommentModel extends Document {
  user_id: string;
  post_id: string;
  content: string;
  image?: string;
  og?: Og;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema = new Schema<ICommentModel>({
  user_id: {
    type: String,
    required: true,
  },
  post_id: {
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
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

CommentSchema.pre("save", function (next) {
  next();
});

CommentSchema.pre("remove", function (next) {
  next();
});

// Create and export user model
const getModel = () => model("Comment", CommentSchema);
export default (models.Comment || getModel()) as ReturnType<typeof getModel>;
