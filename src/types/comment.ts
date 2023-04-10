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
  expanded?: boolean;
}

export default Comment;
