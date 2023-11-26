import Og from "@/types/og";

interface SubComment {
  _id: string;
  user_id: string;
  comment_id?: string;
  content: string;
  og?: Og;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  likeCount?: number;
  likedByUser?: boolean;
}

export default SubComment;
