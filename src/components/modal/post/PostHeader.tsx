/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

// context
// import useModalContext from "@/context/modalContext";
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";
import usePostContext from "@/context/postContext";

// data
import avatarList from "@/data/avatarList";

const PostHeader = () => {
  const { user, mobile } = useGlobalContext();
  const { loading } = useModalContext();
  const { post, postStyle, imageInputRef } = usePostContext();

  return (
    <>
      <div
        className={`${
          postStyle === "desktop"
            ? "pb-1 pl-3 pr-2"
            : "p-2 border-b border-black/20 dark:border-white/25"
        } flex justify-between`}
      >
        <div className="flex">
          <div className={`${loading && "cursor-not-allowed"} mr-3`}>
            <Link
              href={`/${user?._id}`}
              className={`${loading && "pointer-events-none"}`}
            >
              <div className="overflow-hidden  rounded-full border border-light-border dark:border-white/25 cursor-pointer select-none">
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
            </Link>
          </div>
          <div className="pointer-events-auto">{user?.username}</div>
        </div>
        <div
          onClick={() => {
            !loading && imageInputRef.current?.click();
          }}
          className={`${
            loading
              ? `${
                  postStyle === "desktop"
                    ? "border-black/25"
                    : "border-black/25 dark:border-neutral-200/[45%]"
                } cursor-not-allowed`
              : mobile
              ? `${
                  postStyle === "desktop"
                    ? "active:border-black/40 dark:active:bg-white/20"
                    : "active:border-black/[52.5%] dark:border-neutral-200/[45%] dark:active:border-neutral-200/70 dark:active:bg-black/25"
                } active:bg-gray-800/5 border-black/25`
              : `${
                  postStyle === "desktop"
                    ? "hover:border-black/40 dark:hover:bg-white/20"
                    : "hover:border-black/[52.5%] dark:border-neutral-200/[45%] dark:hover:border-neutral-200/70 dark:hover:bg-black/25"
                } cursor-pointer hover:bg-gray-800/5 border-black/25`
          } w-10 h-10 flex justify-center items-center rounded border-2 border-dashed  group transition-colors ease-out select-none`}
        >
          <i
            className={`${
              loading
                ? `${postStyle !== "desktop" && "dark:text-neutral-200/60"}`
                : mobile
                ? `${
                    postStyle === "desktop"
                      ? "group-active:text-blue-600 dark:group-active:text-black"
                      : "group-active:text-blue-600 dark:text-neutral-200/60 dark:group-active:text-white text-gray-800"
                  }`
                : `${
                    postStyle === "desktop"
                      ? "group-hover:text-blue-600 dark:group-hover:text-black"
                      : "group-hover:text-blue-600 dark:text-neutral-200/60 dark:group-hover:text-white text-gray-800"
                  }`
            } fa-solid fa-image text-lg transition-all ease-out pointer-events-none`}
          />
        </div>
      </div>
    </>
  );
};

export default PostHeader;
