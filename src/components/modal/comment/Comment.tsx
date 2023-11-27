/* eslint-disable @next/next/no-img-element */
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Link from "next/link";

import TextareaAutosize from "react-textarea-autosize";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";
import useCommentContext from "@/context/commentContext";

// components
import UserAvatarMini from "@/components/UserAvatarMini";
import CommentInput from "@/components/modal/comment/CommentInput";
import Reply from "@/components/modal/comment/Reply";

// hooks
import useImage from "@/hooks/useImage";

// types
import FeedUser from "@/types/feedUser";

// libraries
import blobToBase64 from "@/lib/blobToBase64";
import processService from "@/lib/processService";
import formatRelativeTime from "@/lib/formatRelativeTime";

// types
import Comment from "@/types/comment";
import SubComment from "@/types/subcomment";

interface Props {
  comment: Comment;
  type: "primary comment" | "sub comment";
  lastOfType?: boolean;
}

const Comment = ({ comment, type, lastOfType }: Props) => {
  const {
    feedCache,
    user,
    mobile,
    darkMode,
    setBigImage,
    updateFeedCache,
    mobileModal,
  } = useGlobalContext();
  const { loading, setLoading } = useModalContext();
  const {
    post,
    focused,
    setFocused,
    subComments,
    setComments,
    setSubComments,
  } = useCommentContext();

  const [processingLike, setProcessingLike] = useState(false);

  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [appendedReplies, setAppendedReplies] = useState<SubComment[]>([]);

  const [replying, setReplying] = useState(false);

  const commentInputref = useRef<HTMLDivElement>(null);

  const likeComment = useCallback(
    async (e: any) => {
      e.stopPropagation();
      if (!comment._id) return;
      try {
        const data = await processService("create like", {
          comment_id: comment._id,
        });
        const { success, error } = data;
        if (success) {
          setComments((prev) => {
            return prev.map((prevComment) => {
              if (prevComment._id === comment._id) {
                return {
                  ...prevComment,
                  likedByUser: true,
                  likeCount: prevComment.likeCount! + 1,
                };
              } else return prevComment;
            });
          });
        } else {
          console.log(error);
        }
      } catch (error) {}
    },
    [comment._id, setComments]
  );

  const unlikeComment = useCallback(
    async (e: any) => {
      e.stopPropagation();
      if (!comment._id) return;
      try {
        setProcessingLike(true);
        const data = await processService("delete like", {
          comment_id: comment._id,
        });
        const { success, error } = data;
        if (success) {
          setComments((prev) => {
            return prev.map((prevComment) => {
              if (prevComment._id === comment._id) {
                return {
                  ...prevComment,
                  likedByUser: false,
                  likeCount: prevComment.likeCount! - 1,
                };
              } else return prevComment;
            });
          });
        } else {
          console.log(error);
        }
      } catch (error) {}
      setProcessingLike(false);
    },
    [comment._id, setComments]
  );

  const getSubComments = useCallback(async () => {
    if (!comment._id) return;
    if (subComments[comment._id]) {
      setShowReplies(true);
      return;
    }
    setLoadingReplies(true);
    try {
      const data = await processService("get subcomments", {
        comment_id: comment._id,
      });
      const { success, error, subcomments } = data;

      if (!success || !subcomments) {
        if (error === "Failed to get subcomments") {
          throw new Error("Failed to get subcomments");
        } else if (error === "Unauthorized") {
          throw new Error("Unauthorized");
        } else if (error === "Server Error") {
          throw new Error("Server Error");
        }
        throw new Error("Unknown Error");
      }
      if (!subComments[comment._id]) subComments[comment._id] = [];
      subComments[comment._id] = subcomments;
      setSubComments(subComments);
      setShowReplies(true);

      // update feed cache
      const userCache = new Set();
      subcomments.forEach((subComment: SubComment) => {
        if (!feedCache[subComment.user_id!]) userCache.add(subComment.user_id);
      });
      const users = Array.from(userCache) as string[];
      if (users.length > 0) {
        await updateFeedCache(users);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingReplies(true);
  }, [comment._id, feedCache, setSubComments, subComments, updateFeedCache]);

  const hideSubComments = useCallback(() => {
    setShowReplies(false);
    // transfer appended replies to subcomments when hiding and clear appended replies, push them to the end of subcomments in order to preserve order
    if (appendedReplies.length > 0) {
      if (!subComments[comment._id]) subComments[comment._id] = [];
      setSubComments((prev) => {
        return {
          ...prev,
          [comment._id!]: [...subComments[comment._id]!, ...appendedReplies],
        };
      });
      setAppendedReplies([]);
      // increase subcomment count
      setComments((prev) => {
        return prev.map((prevComment) => {
          if (prevComment._id === comment._id) {
            return {
              ...prevComment,
              subCommentCount:
                prevComment.subCommentCount! + appendedReplies.length,
            };
          } else return prevComment;
        });
      });
    }
  }, [appendedReplies, comment._id, setComments, setSubComments, subComments]);

  useEffect(() => {
    // // transfer appended replies to subcomments when hiding and clear appended replies, push them to the end of subcomments in order to preserve order (this is for when the user clicks on a comment that has replies, then clicks on another comment that has replies, then clicks back on the first comment, the replies will be appended to the end of the subcomments array)
    return () => {
      if (appendedReplies.length > 0) {
        if (!subComments[comment._id]) subComments[comment._id] = [];
        setSubComments((prev) => {
          return {
            ...prev,
            [comment._id!]: [...subComments[comment._id]!, ...appendedReplies],
          };
        });
        setAppendedReplies([]);
        // increase subcomment count
        setComments((prev) => {
          return prev.map((prevComment) => {
            if (prevComment._id === comment._id) {
              return {
                ...prevComment,
                subCommentCount:
                  prevComment.subCommentCount! + appendedReplies.length,
              };
            } else return prevComment;
          });
        });
      }
    };
  }, [appendedReplies, comment._id, setComments, setSubComments, subComments]);

  return (
    <>
      <div
        onClick={(e) => {
          if (
            focused === comment?._id &&
            commentInputref.current?.firstChild &&
            (commentInputref.current.firstChild as HTMLInputElement).value !==
              ""
          ) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        className={`w-full flex flex-col px-3`}
      >
        <div
          className={`${
            !lastOfType &&
            !replying &&
            appendedReplies.length === 0 &&
            !comment.subCommentCount &&
            "mb-2"
          } flex`}
        >
          <div className="w-10 flex flex-col">
            <UserAvatarMini
              id={comment.user_id!}
              user={user}
              extraSmall={true}
            />
            <div className="flex-1">
              <div className="w-8 h-full flex flex-row-reverse pt-[3px]">
                {(replying ||
                  (comment.subCommentCount || 0) > 0 ||
                  appendedReplies.length > 0) && (
                  <>
                    <div
                      className={`w-4 border-l-2 border-[#bdbdbd] ${
                        mobileModal
                          ? "dark:border-stone-600"
                          : "dark:border-stone-400"
                      }`}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div
              className={`${
                comment.content &&
                (focused === comment?._id
                  ? `${
                      mobileModal
                        ? "dark:bg-indigo-400/30"
                        : "dark:bg-indigo-800/30"
                    } bg-blue-500/25`
                  : mobileModal && darkMode
                  ? "bg-white/10"
                  : "bg-neutral-500/[17.5%] dark:bg-neutral-500/20")
              } w-[97.5%] rounded-xl flex flex-col px-2 py-1.5`}
              onClick={(e) => {
                if (
                  focused === comment?._id &&
                  commentInputref.current?.firstChild &&
                  (commentInputref.current?.firstChild as HTMLInputElement)
                    .value === ""
                ) {
                  e.stopPropagation();
                  e.preventDefault();
                }
              }}
            >
              <div
                className="text-[.7rem] font-bold hover:underline cursor-pointer w-max"
                style={{
                  lineHeight: "1rem",
                }}
              >
                {feedCache[comment.user_id!]?.username}
              </div>
              <div>{comment.content}</div>
            </div>
            {comment.image && (
              <div>
                <img
                  src={comment.image}
                  alt={comment.image}
                  className="cursor-pointer select-none max-h-48 max-w-[16rem] object-cover rounded-xl"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onClick={() => setBigImage(comment.image!)}
                />
              </div>
            )}
            <div
              className={`${
                !replying &&
                !comment.subCommentCount &&
                !appendedReplies.length &&
                !lastOfType &&
                "mb-2"
              } h-6 flex text-xs items-center font-semibold pl-4 gap-4`}
            >
              <div
                className={`${
                  comment.likedByUser
                    ? `text-blue-500 ${
                        darkMode && mobileModal
                          ? "hover:text-blue-400"
                          : "hover:text-blue-600"
                      }`
                    : darkMode && mobileModal
                    ? "text-white/80 hover:text-white"
                    : "text-black/80 hover:text-black"
                } cursor-pointer hover:underline`}
                onClick={
                  processingLike
                    ? () => {}
                    : comment.likedByUser
                    ? unlikeComment
                    : likeComment
                }
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
                      commentInputref.current?.firstChild as HTMLDivElement
                    )?.focus();
                  }
                }}
              >
                Reply
              </div>
              <div
                className={`${
                  darkMode && mobileModal ? "text-white/80" : "text-black/80"
                }`}
              >
                {formatRelativeTime(comment.updatedAt as unknown as string)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          {/* Replies */}

          {(showReplies || appendedReplies.length > 0) && (
            <div>
              <div className="flex-1">
                <div className="w-8 h-2 flex flex-row-reverse">
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
              {showReplies &&
                subComments[comment._id]!.map((subComment, i) => (
                  <div key={i}>
                    <Reply
                      subComment={subComment}
                      lastReply={
                        i === subComments[comment._id]!.length - 1 &&
                        !appendedReplies.length
                      }
                      subCommentCount={comment.subCommentCount}
                      replying={replying}
                      setReplying={setReplying}
                      commentInputref={commentInputref}
                    />
                  </div>
                ))}

              {appendedReplies.length > 0 && (
                <div>
                  {appendedReplies.map((subComment, i) => (
                    <div key={i}>
                      <Reply
                        subComment={subComment}
                        lastReply={i === appendedReplies.length - 1}
                        subCommentCount={comment.subCommentCount}
                        replying={replying}
                        setReplying={setReplying}
                        commentInputref={commentInputref}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Replies */}
          {/* View Replies */}
          {comment.subCommentCount ||
          appendedReplies.length > 0 ||
          subComments[comment._id] ? (
            <div className="flex">
              <div className="w-10 max-h-max shrink-0">
                <div className="w-8 h-full flex flex-row-reverse relative">
                  <div className="absolute w-full h-full">
                    <div
                      className={`w-4 h-7 absolute top-0 right-0 border-b-2 border-l-2 border-[#bdbdbd] ${
                        mobileModal
                          ? "dark:border-stone-600"
                          : "dark:border-stone-400"
                      } rounded-bl-lg`}
                    />
                  </div>
                  <div className="absolute right-0 translate-x-full w-2 h-full">
                    <div
                      className={`h-7 w-2 border-b-2 border-[#bdbdbd] ${
                        mobileModal
                          ? "dark:border-stone-600"
                          : "dark:border-stone-400"
                      }`}
                    />
                  </div>
                  {replying && (
                    <>
                      <div
                        className={`w-4 border-l-2 border-[#bdbdbd] ${
                          mobileModal
                            ? "dark:border-stone-600"
                            : "dark:border-stone-400"
                        }`}
                      />
                    </>
                  )}
                </div>
              </div>
              {/* <div className={!lastOfType ? mb-2" : ""} /> */}
              <div className="flex flex-col">
                <div className={`${!replying && "pb-2"} flex`}>
                  <div
                    className={`h-7 w-2.5 border-b-2 border-[#bdbdbd] ${
                      mobileModal
                        ? "dark:border-stone-600"
                        : "dark:border-stone-400"
                    }`}
                  />
                  <div className="ml-2.5 flex items-center mt-4 mb-2 group hover:cursor-pointer">
                    <i
                      className={`${
                        showReplies
                          ? "fa-solid fa-eye-slash"
                          : "fa-solid fa-reply"
                      } rotate-180`}
                    />
                    <div
                      className="pl-2.5 group-hover:underline"
                      onClick={
                        showReplies ||
                        (!showReplies &&
                          appendedReplies.length > 0 &&
                          comment.subCommentCount === 0)
                          ? hideSubComments
                          : getSubComments
                      }
                    >
                      {showReplies ||
                      (!showReplies &&
                        appendedReplies.length > 0 &&
                        comment.subCommentCount === 0) ? (
                        <>Hide replies</>
                      ) : (
                        <>View replies</>
                      )}

                      {/* <>View more replies</>
                      <>View reply</>
                      <>View all {comment.subCommentCount} replies</> */}
                    </div>
                    {/* <div className="pl-2.5 group-hover:underline">
                      Hide replies
                    </div> */}
                  </div>
                </div>
              </div>
              {/*  */}
            </div>
          ) : (
            <div className={!lastOfType ? "/mb-2" : ""} />
          )}
          {/* View Replies */}
          {replying && (
            <div className="flex">
              <div className="w-10 max-h-max shrink-0">
                <div className="h-3">
                  <div className="w-8 h-full flex flex-row-reverse">
                    <div
                      className={`w-4 border-l-2 border-[#bdbdbd] ${
                        mobileModal
                          ? "dark:border-stone-600"
                          : "dark:border-stone-400"
                      }`}
                    />
                  </div>
                </div>
                <div className="h-8 relative flex">
                  <div className="relative w-8">
                    <div
                      className={`w-4 h-4 absolute top-0 right-0 border-b-2 border-l-2 border-[#bdbdbd] ${
                        mobileModal
                          ? "dark:border-stone-600"
                          : "dark:border-stone-400"
                      } rounded-bl-lg`}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`h-4 w-full border-b-2 border-[#bdbdbd] ${
                        mobileModal
                          ? "dark:border-stone-600"
                          : "dark:border-stone-400"
                      }`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full">
                {/* <div>xxxxx</div>
                <div>xxxxx</div>
                <div>xxxxx</div>
                <div>xxxxx</div> */}

                <div className="flex w-full">
                  <CommentInput
                    type="sub comment"
                    comment={comment}
                    commentInputref={commentInputref}
                    setReplying={setReplying}
                    appendedReplies={appendedReplies}
                    setAppendedReplies={setAppendedReplies}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Comment;
