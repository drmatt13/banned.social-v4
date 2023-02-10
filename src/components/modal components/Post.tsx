import { Dispatch, SetStateAction } from "react";

//types
import type PostType from "@/types/post";

interface Props {
  post: PostType;
  setPost: Dispatch<SetStateAction<PostType>>;
}

const Post = ({ post, setPost }: Props) => {
  return (
    <>
      <div className="h-64 p-4">
        <input
          type="text"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
        />
      </div>
    </>
  );
};

export default Post;
