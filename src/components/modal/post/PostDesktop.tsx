import { useEffect, useRef } from "react";

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

const PostDesktop = ({ children }: Props) => {
  const { mobile } = useGlobalContext();
  const { setModal, loading } = useModalContext();
  const { post, postStyle, loadImage } = usePostContext();

  const dropRef = useRef<HTMLDivElement>(null);

  return postStyle === "mobile" ? (
    <>{children}</>
  ) : (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dropRef.current!.style.opacity = "1";
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dropRef.current!.style.opacity = "1";
      }}
      onDragOverCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dropRef.current!.style.opacity = "1";
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
    >
      <div
        ref={dropRef}
        className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white/75 dark:bg-neutral-400/60 z-10 opacity-0 transition-opacity ease-out pointer-events-none"
      >
        <div className="text-xl font-bold text-neutral-600 dark:text-stone-800 pointer-events-none">
          Drop Photo
        </div>
      </div>
      <div>
        <div className="flex flex-col h-max overflow-y-auto">
          <div className="relative text-center mt-2 mb-3 border-b border-black/[15%] dark:border-black/20 ">
            <div className="font-bold text-lg pb-2">Create post</div>
            <div
              className="absolute top-0 right-2 flex justify-center items-center"
              onClick={() => setModal(false)}
            >
              <div
                className={`${
                  mobile
                    ? "active:bg-red-400 dark:active:bg-white"
                    : "hover:bg-red-400 dark:hover:bg-white"
                } bg-neutral-300/90 dark:bg-neutral-100/80 h-7 w-7 rounded-full flex justify-center items-center cursor-pointer border hover:border-none dark:border-black/[12.5%] shadow transition-colors ease-out`}
              >
                <i className="fas fa-times text text-gray-800 w-5 h-5 flex justify-center items-center"></i>
              </div>
            </div>
          </div>
          <PostHeader />
          {children}
          <BigSubmitButton
            value="Post"
            disabled={(!post.content && !post.og) || loading}
            // onClick={getOgData}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDesktop;
