/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";

// components
import BigSubmitButton from "@/components/BigSubmitButton";

// context
import useModalContext from "@/context/modalContext";
import useGlobalContext from "@/context/globalContext";

// data
import avatarList from "@/data/avatarList";

//types
import type PostType from "@/types/post";

interface Props {
  post: PostType;
  setPost: Dispatch<SetStateAction<PostType>>;
  recipient: string;
}

const MobilePost = ({ post, setPost, recipient }: Props) => {
  const { modal, setModal } = useModalContext();
  const { user } = useGlobalContext();

  return createPortal(
    <>
      <div className="z-50 fixed h-screen w-screen bg-light-secondary dark:bg-dark-secondary">
        <div className="h-full w-full flex flex-col">
          <header className="h-12 flex items-center border-b">
            <div className="mx-4">
              <i
                className="fa-solid fa-arrow-left cursor-pointer"
                onClick={() => setModal(false)}
              />
            </div>
            <div className="flex-1">Create Post</div>
            <div className="mx-4 font-bold cursor-pointer" onClick={() => {}}>
              Post
            </div>
          </header>
          <div className="p-2 border-b flex">
            <div className="overflow-hidden mr-3 rounded-full border border-light-border dark:border-white/25 cursor-pointer">
              <img
                className="h-10 w-10 hover:brightness-[98%]"
                src={
                  avatarList[user?.avatar!]
                    ? `data:image/jpg;base64, ${avatarList[user?.avatar!]}`
                    : user?.avatar
                }
                alt={user?.avatar}
              />
            </div>
            <div>{user?.username}</div>
          </div>
          <div className="mb-4 min-h-[9rem] h-max max-h-[15rem] overflow-y-auto border-b">
            {/* <input
              type="text"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            /> */}
            <div className="h-full p-2 text-sm" contentEditable={true}>
              sdfsdf
            </div>
          </div>
          <BigSubmitButton value="Post" disabled={false} onClick={() => {}} />
        </div>
      </div>
    </>,
    document.getElementById("modal")!
  );
};

export default MobilePost;
