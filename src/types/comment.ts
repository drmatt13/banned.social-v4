import Og from "@/types/og";

interface Comment {
  _id: string;
  user_id: string;
  comment: string;
  og?: Og;
  createdAt?: Date;
  updatedAt?: Date;
  expanded?: boolean;
}

export default Comment;
