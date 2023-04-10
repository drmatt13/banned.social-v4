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

// hooks
import useImage from "@/hooks/useImage";

// types
import FeedUser from "@/types/feedUser";

// libraries
import blobToBase64 from "@/lib/blobToBase64";
import processService from "@/lib/processService";

// types
import Comment from "@/types/comment";

interface Props {
  comment: Comment;
}

const Comment = ({ comment }: Props) => {
  const { feedCache, user, mobile, darkMode } = useGlobalContext();
  const { loading, setLoading } = useModalContext();
  const { post, focused, setFocused } = useCommentContext();

  const {
    image,
    loadImage,
    loadingImage,
    errorLoadingImage,
    removeImage,
    setErrorLoadingImage,
  } = useImage();

  const [replying, setReplying] = useState(false);

  const commentInputref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        onClick={(e) => {
          if (
            focused === comment?._id &&
            (commentInputref.current?.firstChild as HTMLInputElement).value !==
              ""
          ) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        className={`w-full flex flex-col px-3`}
      >
        <div className="flex">
          <div className="w-10 flex flex-col">
            <UserAvatarMini
              id={comment.user_id!}
              user={user}
              extraSmall={true}
            />
            <div className="flex-1">
              <div className="w-8 h-full flex flex-row-reverse pt-[3px]">
                {replying && (
                  <div className="w-4 border-l-2 border-black/30 animate-fade-in-fast" />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div
              className={`${
                comment.content &&
                (focused === comment?._id
                  ? "bg-blue-500/25 dark:bg-indigo-800/30"
                  : "bg-neutral-500/20")
              } w-[97.5%] rounded-xl flex flex-col px-2 py-1.5`}
              onClick={(e) => {
                if (
                  focused === comment?._id &&
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
                    // commentInputref.current?.scrollIntoView({
                    //   behavior: "smooth",
                    // });
                    (
                      commentInputref.current?.firstChild as HTMLDivElement
                    )?.focus();
                    // setFocused(comment._id!);
                    // console.log(commentInputref.current);
                  }
                }}
              >
                Reply
              </div>
              <div className="cursor-pointer hover:underline text-black/75 hover:text-black">
                xh
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          {replying && (
            <div className="flex">
              <div className="w-10 max-h-max shrink-0">
                <div className="h-3">
                  <div className="w-8 h-full flex flex-row-reverse">
                    {replying && (
                      <div className="w-4 border-l-2 border-black/30 animate-fade-in-fast" />
                    )}
                  </div>
                </div>
                <div className="h-8 relative flex">
                  <div className="relative w-8">
                    <div className="w-4 h-4 absolute top-0 right-0 border-b-2 border-l-2 border-black/30 animate-fade-in-fast rounded-bl-lg"></div>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-full border-b-2 border-black/30 animate-fade-in-fast" />
                  </div>
                </div>
              </div>
              <CommentInput
                type="sub comment"
                comment={comment}
                commentInputref={commentInputref}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Comment;
