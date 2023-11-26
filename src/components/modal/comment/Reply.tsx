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
  const { feedCache, user, mobile, darkMode, setBigImage } = useGlobalContext();
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
                <div className="w-4 h-5 absolute top-0 right-0 border-b-2 border-l-2 border-[#bdbdbd] dark:border-stone-400 rounded-bl-lg"></div>
              </div>
              <div className="absolute right-0 translate-x-full w-2 h-full">
                <div className="h-5 w-2 border-b-2 border-[#bdbdbd] dark:border-stone-400" />
              </div>
              <>
                <div className="w-4 border-l-2 border-[#bdbdbd] dark:border-stone-400" />
              </>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex w-full">
              <div className="h-5 w-2.5 border-b-2 border-[#bdbdbd] dark:border-stone-400" />
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
                      subComment.content && "bg-neutral-500/20"
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
                  <div className="h-6 flex text-xs items-center text-black/90 font-semibold pl-4 gap-4">
                    <div className="cursor-pointer hover:underline hover:text-black">
                      Like
                    </div>
                    <div
                      className="cursor-pointer hover:underline hover:text-black"
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
                    <div className="cursor-pointer hover:underline text-black/75 hover:text-black">
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
