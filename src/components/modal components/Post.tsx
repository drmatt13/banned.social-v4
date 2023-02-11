import { Dispatch, SetStateAction } from "react";

// components
import BigSubmitButton from "@/components/BigSubmitButton";

//types
import type PostType from "@/types/post";

interface Props {
  post: PostType;
  setPost: Dispatch<SetStateAction<PostType>>;
}

const Post = ({ post, setPost }: Props) => {
  return (
    <>
      <div className="h-64 flex flex-col">
        <div className="p-4">
          <input
            type="text"
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
          />
        </div>
        <BigSubmitButton value="Post" disabled={false} onClick={() => {}} />
      </div>
    </>
  );
};

export default Post;
