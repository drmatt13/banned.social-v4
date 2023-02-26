import Og from "@/types/og";

interface Post {
  _id?: string;
  content: string;
  user_id?: string;
  recipient_id?: string;
  sharedPost_id?: string;
  image?: string;
  og?: Og;
}

export default Post;
