import { Document, Schema, model, models } from "mongoose";

export interface ILikeModel extends Document {
  user_id: string;
  post_id: string;
  comment_id: string;
  subcomment_id?: string;
}

const LikeSchema = new Schema<ILikeModel>({
  user_id: {
    type: String,
    required: true,
  },
  post_id: {
    type: String,
  },
  comment_id: {
    type: String,
  },
  subcomment_id: {
    type: String,
  },
});

// Create and export user model
const getModel = () => model("Like", LikeSchema);
export default (models.Like || getModel()) as ReturnType<typeof getModel>;
