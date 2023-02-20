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

const PostDesktop = ({ children }: Props) => {
  const { post, postStyle } = usePostContext();
  const { setModal, loading } = useModalContext();
  const { mobile } = useGlobalContext();

  return postStyle === "mobile" ? (
    <>{children}</>
  ) : (
    <>
      <div className="flex flex-col">
        <div className="relative w-fill text-center mt-2 mb-3 border-b border-black/[15%] dark:border-black/20 ">
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
    </>
  );
};

export default PostDesktop;
