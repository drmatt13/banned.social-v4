/* eslint-disable @next/next/no-img-element */

// context
import useModalContext from "@/context/modalContext";
import useGlobalContext from "@/context/globalContext";
import usePostContext from "@/context/postContext";

const PostImage = () => {
  const { user, mobile } = useGlobalContext();
  const { loading, setLoading } = useModalContext();
  const {
    initialLoad,
    setInitialLoad,
    post,
    setPost,
    recipient,
    loadingOg,
    setLoadingOg,
    image,
    ogStack,
    setOgStack,
    processUrl,
    postStyle,
    removeImage,
  } = usePostContext();

  return (
    <>
      <div className="relative px-2 mb-3 select-none">
        <div
          className={`${
            mobile
              ? "active:bg-red-400 dark:active:bg-white"
              : "hover:bg-red-400 dark:hover:bg-white"
          } ${
            postStyle === "desktop"
              ? "dark:border-neutral-400 dark:hover:border-black/40 border-black/25 bg-white dark:bg-neutral-100 right-0.5"
              : "bg-white dark:bg-neutral-300 right-1"
          } border border-neutral-400 hover:border-none dark:hover:border-solid absolute h-5 w-5 -top-2 rounded-full p-2 flex justify-center items-center cursor-pointer pointer-events-auto transition-colors ease-out z-10`}
          onClick={removeImage}
        >
          <i className="fas fa-times text-xs text-gray-800 dark:text-black/90 w-5 h-5 flex justify-center items-center" />
        </div>
        <img
          src={image}
          alt="image for upload"
          className={`${
            postStyle === "desktop" ? "rounded-xl" : "rounded-md"
          } w-full aspect-video object-cover shadow`}
        />
      </div>
    </>
  );
};

export default PostImage;
