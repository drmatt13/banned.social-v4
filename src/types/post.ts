import Og from "@/types/og";

interface Post {
  _id?: string;
  content?: string;
  user_id?: string;
  recipient_id?: string;
  sharedPost_id?: string;
  image?: Blob | string;
  og?: Og;
  createdAt?: Date;
  updatedAt?: Date;
  likeCount?: number;
  commentCount?: number;
  sharedCount?: number;
  likedByUser?: boolean;
}

export default Post;
