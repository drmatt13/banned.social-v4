import { Document, Schema, model, models } from "mongoose";

// types
import type Og from "@/types/og";

export interface ISubCommentModel extends Document {
  user_id: string;
  comment_id: string;
  content: string;
  image?: string;
  og?: Og;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubCommentSchema = new Schema<ISubCommentModel>({
  user_id: {
    type: String,
    required: true,
  },
  comment_id: {
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

SubCommentSchema.pre("save", function (next) {
  next();
});

SubCommentSchema.pre("remove", function (next) {
  next();
});

// Create and export user model
const getModel = () => model("SubComment", SubCommentSchema);
export default (models.SubComment || getModel()) as ReturnType<typeof getModel>;
