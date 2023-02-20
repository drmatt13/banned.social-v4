/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

// context
import useModalContext from "@/context/modalContext";
import usePostContext from "@/context/postContext";
import useGlobalContext from "@/context/globalContext";

// data
import avatarList from "@/data/avatarList";

const PostHeader = () => {
  const { post, postStyle } = usePostContext();
  const { setModal } = useModalContext();
  const { user, mobile } = useGlobalContext();

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
          <Link href={`/${user?._id}`}>
            <div className="overflow-hidden mr-3 rounded-full border border-light-border dark:border-white/25 cursor-pointer select-none">
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
          <div>{user?.username}</div>
        </div>
        <div
          className={`${
            mobile
              ? `${
                  postStyle === "desktop"
                    ? "active:border-black/40 dark:active:bg-white/20"
                    : "active:border-black/[52.5%] dark:border-neutral-200/50 dark:active:border-neutral-200 dark:active:bg-black/25"
                } active:bg-gray-800/5`
              : `${
                  postStyle === "desktop"
                    ? "hover:border-black/40 dark:hover:bg-white/20"
                    : "hover:border-black/[52.5%] dark:border-neutral-200/50 dark:hover:border-neutral-200 dark:hover:bg-black/25"
                } hover:bg-gray-800/5`
          } w-10 h-10 flex justify-center items-center rounded border-2 border-dashed border-black/25 group cursor-pointer transition-colors ease-out`}
        >
          <i
            className={`${
              mobile
                ? `${
                    postStyle === "desktop"
                      ? "group-active:text-sky-700 dark:group-active:text-black"
                      : "group-active:text-blue-600 dark:text-neutral-200 dark:group-active:text-white"
                  }`
                : `${
                    postStyle === "desktop"
                      ? "group-hover:text-sky-700 dark:group-hover:text-black"
                      : "group-hover:text-blue-600 dark:text-neutral-200 dark:group-hover:text-white"
                  }`
            } fa-solid fa-image text-lg text-gray-800 transition-all ease-out`}
          />
        </div>
      </div>
    </>
  );
};

export default PostHeader;
