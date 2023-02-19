/* eslint-disable @next/next/no-img-element */
import { createPortal } from "react-dom";

// components
import BigSubmitButton from "@/components/BigSubmitButton";

// context
import useModalContext from "@/context/modalContext";
import useGlobalContext from "@/context/globalContext";
import usePostContext from "@/context/postContext";

// data
import avatarList from "@/data/avatarList";

const PostMobile = ({ children, visable }: any) => {
  const { post } = usePostContext();
  const { setModal, loading } = useModalContext();
  const { user } = useGlobalContext();

  return !visable ? (
    <>{children}</>
  ) : (
    createPortal(
      <>
        <div className="z-50 fixed h-screen w-screen bg-light-secondary dark:bg-dark-secondary">
          <div className="h-full w-full flex flex-col">
            <header className="h-12 flex items-center border-b border-black/20 dark:border-white/25">
              <div className="mx-3">
                <i
                  className="fa-solid fa-arrow-left cursor-pointer px-1"
                  onClick={() => setModal(false)}
                />
              </div>
              <div className="flex-1">Create Post</div>
              <div
                className="mx-4 font-bold cursor-pointer dark:text-white"
                onClick={() => {}}
              >
                Post
              </div>
            </header>
            <div className="p-2 border-b border-black/20 dark:border-white/25 flex">
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
            {children}
            <BigSubmitButton
              radius="rounded-md"
              value="Post"
              disabled={(!post.content && !post.og) || loading}
              // onClick={getOgData}
            />
          </div>
        </div>
      </>,
      document.getElementById("modal")!
    )
  );
};

export default PostMobile;
