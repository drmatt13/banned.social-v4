import type User from "@/types/user";
import Og from "@/types/og";

interface Post {
  content: string;
  recipient?: User;
  og?: Og;
}

export default Post;
