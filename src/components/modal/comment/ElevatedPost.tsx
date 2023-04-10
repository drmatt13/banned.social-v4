/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";
import useCommentContext from "@/context/commentContext";

// components
import UserAvatarMini from "@/components/UserAvatarMini";
import CommentInput from "@/components/modal/comment/CommentInput";
import Comment from "@/components/modal/comment/Comment";

// types
import FeedUser from "@/types/feedUser";

// libraries
import formatDate from "@/lib/formatDate";
import validateUrl from "@/lib/validateUrl";
import processService from "@/lib/processService";

// styles
import styles from "@/styles/scrollbar.module.scss";

const ElevatedPost = () => {
  const { feedCache, user, mobile, darkMode } = useGlobalContext();
  const { modal, setModal, loading, setLoading } = useModalContext();
  const {
    post,
    post: {
      _id,
      user_id,
      recipient_id,
      sharedPost_id,
      content,
      og,
      createdAt,
      updatedAt,
    },
    comments,
    setComments,
    subComments,
    setSubComments,
    aggregatedData,
    setAggregatedData,
    updatePost,
    setFocused,
  } = useCommentContext();

  const [postUser, setPostUser] = useState<FeedUser>(undefined);
  const [postRecipient, setPostRecipient] = useState<FeedUser>(undefined);
  const [PostContentElement, setPostContentElement] = useState(<></>);
  const [page, setPage] = useState(1);
  const [loadingComments, setLoadingComments] = useState(false);

  const commentInputref = useRef<HTMLDivElement>(null);

  // TEMPORARY
  const [disable, setDisable] = useState(false);

  const getComments = useCallback(async () => {
    if (!post?._id || loadingComments) return;
    setLoadingComments(true);
    const data = await processService("get comments", {
      post_id: post._id,
      page,
      limit: 15,
    });
    const { success, comments, error } = data;
    if (success && comments) {
      if (comments.length === 0) setDisable(true);
      setComments((prev) => {
        return [...prev, ...comments];
      });
      setPage((prev) => prev + 1);
    } else {
      // if (error === "Unauthorized") {
      //   throw new Error("Unauthorized");
      // } else if (error === "Failed to update user") {
      //   throw new Error("Failed to update user");
      // } else if (error === "Failed to upload image") {
      //   throw new Error("Failed to upload image");
      // } else {
      //   throw new Error("Server error");
      // }
    }
    setLoadingComments(false);
  }, [loadingComments, page, post._id, setComments]);

  useEffect(() => {
    if (comments.length === 0 && !disable) getComments();
  }, [comments.length, disable, getComments]);

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  useEffect(() => {
    const words = content?.split(/([\s\n]+)/) || [];

    setPostContentElement(
      <p
        className={`${
          content ? "pb-3" : "pb-[0.1875rem]"
        } mx-3 flex-1 text-left`}
        style={{
          lineHeight: "1.25rem",
        }}
      >
        {words.map((word, i) => {
          if (validateUrl(word)) {
            return (
              <a
                key={i}
                className="text-blue-500 dark:text-purple-700 hover:underline"
                href={word}
              >
                {word}
              </a>
            );
          } else {
            return word;
          }
        })}
      </p>
    );
  }, [content]);

  useEffect(() => {
    if (user_id && (user_id === user?._id || feedCache[user_id])) {
      setPostUser(feedCache[user_id] || user);
    }
    if (recipient_id && feedCache[recipient_id]) {
      setPostRecipient(feedCache[recipient_id]);
    }
  }, [feedCache, post.image, recipient_id, user, user_id]);

  return (
    <>
      <div
        className="relative text-sm pt-3 rounded-lg w-full flex-1 overflow-y-auto"
        onClick={() => setFocused(undefined)}
      >
        <div className="mx-4 flex items-start mb-2">
          <UserAvatarMini id={user_id!} user={postUser} />
          <div className="flex-1 flex font-xs font-medium h-10">
            <div className="flex-1 flex flex-col">
              <div className="flex">
                <Link href={user_id!}>
                  <span className="mr-2 hover:underline">
                    {postUser?.username}
                  </span>{" "}
                </Link>
                {postRecipient && postUser !== postRecipient && (
                  <>
                    <span className="mr-2">
                      <i
                        className="fa-solid fa-angle-right"
                        style={{
                          fontSize: "0.75rem",
                        }}
                      />
                    </span>
                    <Link href={recipient_id!}>
                      <span className="hover:underline">
                        {postRecipient.username}
                      </span>
                    </Link>
                  </>
                )}
              </div>
              <div className="flex h-full items-center text-xs font-light opacity-75">
                {updatedAt && <>{formatDate(updatedAt)}</>}
              </div>
            </div>
            <div className="h-full flex justify-center items-center">
              <i className="hover:bg-black/10 fa-solid fa-times flex justify-center items-center h-8 w-8 text-lg rounded-full cursor-pointer transition-colors ease-out" />
            </div>
          </div>
        </div>
        {PostContentElement}
        {/* <div> */}
        {typeof post.image === "string" && (
          <img
            src={post.image}
            alt={post.image}
            className="cursor-pointer select-none min-h-[10rem] h-[15rem] max-h-[30vh] w-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        {!post.image && og?.url && (
          <>
            <Link href={og.url}>
              <>
                {og.image?.url && (
                  <img
                    src={og.image.url}
                    alt={post.image}
                    className="cursor-pointer select-none min-h-[10rem] h-[15rem] max-h-[30vh] w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <div className="flex-1 text-left p-2 overflow-hidden text-xs font-normal">
                  {og.siteName && (
                    <p className="w-full h-[1.125rem] truncate">
                      {og.siteName}
                    </p>
                  )}
                  {og.title && (
                    <p className="w-full h-[1.125rem] font-bold truncate">
                      {og.title}
                    </p>
                  )}
                  {og.description && (
                    <p className="w-full h-[1.125rem] truncate">
                      {og.description}
                    </p>
                  )}
                  {og.url && !og.siteName && (
                    <p className="w-full h-[1.125rem] truncate">
                      {decodeURI(og.url || "")}
                    </p>
                  )}
                </div>
              </>
            </Link>
          </>
        )}
        {/* </div> */}
        <div
          className={`${
            post.image || og ? "h-10" : "pb-2.5"
          } flex justify-between mx-3 border-b border-black/25 select-none opacity-75`}
        >
          <div className="flex items-center">xxx likes</div>
          <div className="flex items-center">
            <div className="pr-3">xxx comments</div>
            <div>xxx shares</div>
          </div>
        </div>
        <div className="h-10 flex justify-evenly mx-3 select-none">
          <div
            className="mr-2 my-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-black/10 transition-colors ease-out"
            onClick={() => {}}
          >
            <i className="fa-solid fa-thumbs-up mr-2" />
            Like
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              (commentInputref.current?.firstChild as HTMLInputElement).click();
            }}
            className="mr-2 my-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-black/10 transition-colors ease-out"
          >
            <i className="fa-solid fa-comment mr-2" />
            Comment
          </div>
          <div className="my-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-black/10 transition-colors ease-out">
            <i className="fa-solid fa-share mr-2" />
            Share
          </div>
        </div>
        {/* Comment section */}
        <div className="pt-2">
          {comments.length > 0 &&
            comments.map((comment) => (
              <div key={comment._id}>
                <Comment comment={comment} />
              </div>
            ))}
          {!loadingComments && (
            <>
              <div
                className="py-[.2rem] w-max cursor-pointer hover:underline mx-3 text-[.7rem] font-semibold text-black/90 hover:text-black"
                onClick={getComments}
              >
                View more comments
              </div>
            </>
          )}
        </div>
      </div>
      <CommentInput type="primary comment" commentInputref={commentInputref} />
    </>
  );
};

export default ElevatedPost;
