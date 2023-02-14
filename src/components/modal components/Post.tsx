import { Dispatch, SetStateAction } from "react";

// components
import BigSubmitButton from "@/components/BigSubmitButton";

// context
import useModalContext from "@/context/modalContext";

//types
import type PostType from "@/types/post";

interface Props {
  post: PostType;
  setPost: Dispatch<SetStateAction<PostType>>;
  recipient: string;
}

const Post = ({ post, setPost, recipient }: Props) => {
  const { modal, setModal } = useModalContext();

  return (
    <>
      <div className="h-64 flex flex-col">
        <div className="p-4">
          <input
            className="outline-none"
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
