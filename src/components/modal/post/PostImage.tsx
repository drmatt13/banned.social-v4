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
      <div className="relative px-2 mb-2.5 select-none">
        <div
          onClick={() => !loading && removeImage()}
          className={`${
            loading
              ? "cursor-not-allowed"
              : mobile
              ? "active:bg-white"
              : "hover:bg-white cursor-pointer"
          } z-50 absolute top-2 right-4 bg-neutral-100 h-7 w-7 rounded-full flex justify-center items-center border border-black/20 shadow transition-colors ease-out`}
        >
          <i className="fas fa-times text text-gray-800 w-5 h-5 flex justify-center items-center"></i>
        </div>
        <img
          src={image}
          alt="image for upload"
          className={`${loading && "grayscale-[.5]"} ${
            postStyle === "desktop" ? "rounded-lg" : "rounded-md"
          } w-full aspect-video object-cover shadow transition-all`}
        />
      </div>
    </>
  );
};

export default PostImage;
