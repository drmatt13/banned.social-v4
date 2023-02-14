import { Dispatch, SetStateAction } from "react";

// components
import BigSubmitButton from "@/components/BigSubmitButton";

// context
import useModalContext from "@/context/modalContext";

//types
import type Post from "@/types/post";
import type User from "@/types/user";

interface Props {
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
  recipient?: User;
}

const PostDesktop = ({ post, setPost, recipient }: Props) => {
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

export default PostDesktop;
