import Og from "@/types/og";

interface Comment {
  _id: string;
  user_id: string;
  post_id: string;
  content: string;
  og?: Og;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  likeCount?: number;
  subCommentCount?: number;
  likedByUser?: boolean;
}

export default Comment;
