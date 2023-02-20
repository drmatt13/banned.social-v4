/* eslint-disable @next/next/no-img-element */
import { createPortal } from "react-dom";

// components
import BigSubmitButton from "@/components/BigSubmitButton";
import PostHeader from "@/components/modal components/PostHeader";

// context
import useModalContext from "@/context/modalContext";
import usePostContext from "@/context/postContext";
import useGlobalContext from "@/context/globalContext";

interface Props {
  children: JSX.Element;
}

const PostMobile = ({ children }: Props) => {
  const { post, postStyle } = usePostContext();
  const { setModal, loading } = useModalContext();
  const { mobile } = useGlobalContext();

  return postStyle === "desktop" ? (
    <>{children}</>
  ) : (
    createPortal(
      <>
        <div className="z-50 fixed h-screen w-screen bg-light-secondary dark:bg-dark-secondary">
          <div className="h-full w-full flex flex-col">
            <div className="h-12 flex items-center border-b border-black/20 dark:border-white/25">
              <div
                className={`${
                  mobile
                    ? "active:text-black dark:text-neutral-200 dark:active:text-white"
                    : "hover:text-black dark:text-neutral-200 dark:hover:text-white"
                } text-black/90 mx-2 transition-colors ease-out select-none`}
              >
                <i
                  className="fa-solid fa-arrow-left cursor-pointer px-1"
                  onClick={() => setModal(false)}
                />
              </div>
              <div className="flex-1">Create Post</div>
              <div
                className={`${
                  mobile
                    ? "active:text-black dark:text-neutral-200 dark:active:text-white"
                    : "hover:text-black dark:text-neutral-200 dark:hover:text-white"
                } text-black/90 mx-3 font-bold cursor-pointer transition-colors ease-out select-none`}
                onClick={() => {}}
              >
                Post
              </div>
            </div>
            <PostHeader />
            {children}
            <BigSubmitButton
              customDarkDisabled={true}
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
