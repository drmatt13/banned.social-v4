/* eslint-disable @next/next/no-img-element */
import { useRef } from "react";
import { createPortal } from "react-dom";

// components
import BigSubmitButton from "@/components/BigSubmitButton";
import PostHeader from "@/components/modal/post/PostHeader";

// context
import useModalContext from "@/context/modalContext";
import usePostContext from "@/context/postContext";
import useGlobalContext from "@/context/globalContext";

interface Props {
  children: JSX.Element;
}

const PostMobile = ({ children }: Props) => {
  const { mobile, darkMode } = useGlobalContext();
  const { setModal, loading } = useModalContext();
  const { post, postStyle, loadImage, submitPost, image } = usePostContext();

  const dropRef = useRef<HTMLDivElement>(null);

  return postStyle === "desktop" ? (
    <>{children}</>
  ) : (
    createPortal(
      <>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!loading) dropRef.current!.style.opacity = "1";
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!loading) dropRef.current!.style.opacity = "1";
          }}
          onDragOverCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!loading) dropRef.current!.style.opacity = "1";
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dropRef.current!.style.opacity = "0";
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dropRef.current!.style.opacity = "0";
            loadImage(e);
          }}
          onDragEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dropRef.current!.style.opacity = "0";
          }}
          className={`${
            darkMode && "dark:[color-scheme:dark]"
          } z-50 fixed h-screen w-screen bg-light-secondary dark:bg-dark-secondary overflow-y-auto`}
        >
          <div
            ref={dropRef}
            className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center bg-white/75 dark:bg-neutral-700/40 z-10 opacity-0 transition-opacity ease-out pointer-events-none"
          >
            <div className="text-xl font-bold text-neutral-600 dark:text-black pointer-events-none">
              Drop Photo
            </div>
          </div>
          <div className="w-full flex flex-col">
            <div className="h-12 shrink-0 flex items-center border-b border-black/20 dark:border-white/25">
              <div
                className={`${
                  loading
                    ? "cursor-not-allowed"
                    : mobile
                    ? "active:text-black dark:active:text-white"
                    : "hover:text-black dark:hover:text-white cursor-pointer"
                } text-black/90 dark:text-neutral-200 mx-2 transition-colors ease-out select-none`}
              >
                <i
                  className="fa-solid fa-arrow-left px-1"
                  onClick={() => !loading && setModal(false)}
                />
              </div>
              <div className="flex-1">Create Post</div>
              <div
                className={`${
                  loading
                    ? "cursor-not-allowed"
                    : mobile
                    ? "active:text-black dark:active:text-white"
                    : "hover:text-black dark:hover:text-white cursor-pointer"
                } text-black/90 dark:text-neutral-200 mx-3 font-bold  transition-colors ease-out select-none`}
                onClick={submitPost}
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
              disabled={(!post.content && !post.og && !image) || loading}
              onClick={submitPost}
            />
          </div>
        </div>
      </>,
      document.getElementById("modal")!
    )
  );
};

export default PostMobile;
