/* eslint-disable @next/next/no-img-element */

// context
import useGlobalContext from "@/context/globalContext";
import useCommentContext from "@/context/commentContext";

// components
import UserAvatarMini from "@/components/UserAvatarMini";

// libaries
import formatRelativeTime from "@/lib/formatRelativeTime";

// types
import SubComment from "@/types/subcomment";

interface Props {
  subComment: SubComment;
  lastReply?: boolean;
  subCommentCount?: number;
  replying: boolean;
  setReplying: React.Dispatch<React.SetStateAction<boolean>>;
  commentInputref: React.RefObject<HTMLDivElement> | null;
}

const Reply = ({
  subComment,
  lastReply,
  subCommentCount,
  replying,
  setReplying,
  commentInputref,
}: Props) => {
  const { feedCache, user, mobile, darkMode, setBigImage, mobileModal } =
    useGlobalContext();
  const {
    post,
    focused,
    setFocused,
    setComments,
    updatePost,
    subComments,
    setSubComments,
  } = useCommentContext();

  return (
    <>
      {
        <div className="flex">
          <div className="w-10 max-h-max shrink-0">
            <div className="w-8 h-full flex flex-row-reverse relative">
              <div className="absolute w-full h-full">
                <div
                  className={`w-4 h-5 absolute top-0 right-0 border-b-2 border-l-2 border-[#bdbdbd] ${
                    mobileModal
                      ? "dark:border-stone-600"
                      : "dark:border-stone-400"
                  } rounded-bl-lg`}
                />
              </div>
              <div className="absolute right-0 translate-x-full w-2 h-full">
                <div
                  className={`h-5 w-2 border-b-2 border-[#bdbdbd] ${
                    mobileModal
                      ? "dark:border-stone-600"
                      : "dark:border-stone-400"
                  }`}
                />
              </div>
              <>
                <div
                  className={`w-4 border-l-2 border-[#bdbdbd] ${
                    mobileModal
                      ? "dark:border-stone-600"
                      : "dark:border-stone-400"
                  }`}
                />
              </>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex w-full">
              <div
                className={`h-5 w-2.5 border-b-2 border-[#bdbdbd] ${
                  mobileModal
                    ? "dark:border-stone-600"
                    : "dark:border-stone-400"
                }`}
              />
              <div
                className={`${
                  lastReply ? "" : "mb-2"
                } flex ml-1 mt-1 group w-full`}
              >
                <UserAvatarMini
                  id={subComment.user_id!}
                  user={user}
                  superSmall={true}
                />
                {/*  */}
                <div className="flex flex-col w-full pl-2">
                  <div
                    className={`${
                      subComment.content
                        ? mobileModal && darkMode
                          ? "bg-white/10"
                          : "bg-neutral-500/[17.5%] dark:bg-neutral-500/20"
                        : ""
                    } w-[97.5%] rounded-xl flex flex-col px-2 py-1.5`}
                  >
                    <div
                      className="text-[.7rem] font-bold hover:underline cursor-pointer w-max"
                      style={{
                        lineHeight: "1rem",
                      }}
                    >
                      {feedCache[subComment.user_id!]?.username}
                    </div>
                    <div>{subComment.content}</div>
                  </div>
                  {subComment.image && (
                    <div>
                      <img
                        src={subComment.image}
                        alt={subComment.image}
                        className="cursor-pointer select-none max-h-48 max-w-[16rem] object-cover rounded-xl"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        onClick={() => setBigImage(subComment.image!)}
                      />
                    </div>
                  )}
                  <div className="h-6 flex text-xs items-center font-semibold pl-4 gap-4">
                    <div
                      className={`${
                        subComment.likedByUser
                          ? `text-blue-500 ${
                              darkMode && mobileModal
                                ? "hover:text-blue-400"
                                : "hover:text-blue-600"
                            }`
                          : darkMode && mobileModal
                          ? "text-white/80 hover:text-white"
                          : "text-black/80 hover:text-black"
                      } cursor-pointer hover:underline`}
                    >
                      Like
                    </div>
                    <div
                      className={`${
                        darkMode && mobileModal
                          ? "text-white/80 hover:text-white"
                          : "text-black/80 hover:text-black"
                      } cursor-pointer hover:underline`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (!replying) setReplying(true);
                        else {
                          (
                            commentInputref?.current
                              ?.firstChild as HTMLDivElement
                          )?.focus();
                        }
                      }}
                    >
                      Reply
                    </div>
                    <div
                      className={`${
                        darkMode && mobileModal
                          ? "text-white/80"
                          : "text-black/80"
                      }`}
                    >
                      {formatRelativeTime(
                        subComment.updatedAt as unknown as string
                      )}
                    </div>
                  </div>
                </div>
                {/*  */}
              </div>
            </div>
          </div>
          {/*  */}
        </div>
      }
    </>
  );
};

export default Reply;
