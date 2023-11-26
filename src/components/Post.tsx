/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";

// components
import UserAvatarMini from "./UserAvatarMini";
// import LoadingPosts from "@/components/LoadingPosts";

// context
import useGlobalContext from "@/context/globalContext";
import { commentContext } from "@/context/commentContext";

// libraries
import validateUrl from "@/lib/validateUrl";
import formatDate from "@/lib/formatDate";
import processService from "@/lib/processService";

// modals
import CommentModal from "@/modals/CommentModal";

// types
import type IPost from "@/types/post";
import type FeedUser from "@/types/feedUser";
import type Comment from "@/types/comment";
import type SubComment from "@/types/subcomment";

const Post = ({
  _id,
  user_id,
  recipient_id,
  sharedPost_id,
  content,
  image,
  og,
  createdAt,
  updatedAt,
  updatePost,
  likedByUser,
  likeCount,
  commentCount,
  sharedCount,
}: IPost & {
  updatePost: (post: IPost) => void;
}) => {
  const { feedCache, user, mobile, setBigImage } = useGlobalContext();

  const [PostContentElement, setPostContentElement] = useState(<></>);

  const [postUser, setPostUser] = useState<FeedUser>(undefined);
  const [postRecipient, setPostRecipient] = useState<FeedUser>(undefined);
  const [processingLike, setProcessingLike] = useState(false);

  const [commentModal, setCommentModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subComments, setSubComments] = useState<{
    [comment_id: string]: SubComment[];
  }>({});
  const [focused, setFocused] = useState<string | undefined>(undefined);

  const likePost = useCallback(async () => {
    if (!_id) return;
    try {
      setProcessingLike(true);
      const data = await processService("create like", { post_id: _id });
      const { success, error } = data;
      if (success) {
        updatePost({
          _id,
          user_id,
          recipient_id,
          sharedPost_id,
          content,
          image,
          og,
          createdAt,
          updatedAt,
          likedByUser: true,
          likeCount: (likeCount || 0) + 1,
          commentCount,
          sharedCount,
        });
      } else {
        console.log(error);
      }
    } catch (error) {}
    setProcessingLike(false);
  }, [
    _id,
    commentCount,
    content,
    createdAt,
    image,
    likeCount,
    og,
    recipient_id,
    sharedCount,
    sharedPost_id,
    updatePost,
    updatedAt,
    user_id,
  ]);

  const unlikePost = useCallback(async () => {
    if (!_id) return;
    try {
      setProcessingLike(true);
      const data = await processService("delete like", { post_id: _id });
      const { success, error } = data;
      if (success) {
        updatePost({
          _id,
          user_id,
          recipient_id,
          sharedPost_id,
          content,
          image,
          og,
          createdAt,
          updatedAt,
          likedByUser: false,
          likeCount: (likeCount || 0) - 1,
          commentCount,
          sharedCount,
        });
      } else {
        console.log(error);
      }
    } catch (error) {}
    setProcessingLike(false);
  }, [
    _id,
    commentCount,
    content,
    createdAt,
    image,
    likeCount,
    og,
    recipient_id,
    sharedCount,
    sharedPost_id,
    updatePost,
    updatedAt,
    user_id,
  ]);

  const sharePost = useCallback(() => {}, []);

  useEffect(() => {
    const words = content
      ? DOMPurify.sanitize(content.trim())?.split(/([\s\n]+)/) || []
      : [];

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
                className="text-blue-500 dark:text-purple-400 hover:underline"
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
  }, [feedCache, image, recipient_id, user, user_id]);

  return !postUser ? (
    <></>
  ) : (
    <>
      <style jsx>{`
        @media (max-width: 535px) {
        .bg-light-secondary {
          border-radius: 0;
        }
      `}</style>
      {/* <LoadingPosts /> */}
      <div className="relative text-sm bg-light-secondary dark:bg-dark-secondary pt-3 rounded-lg mb-5 w-full border border-neutral-300/75 dark:border-dark-border shadow dark:shadow-dark-border overflow-hidden">
        <div className="mx-4 flex items-start mb-2">
          <UserAvatarMini id={user_id!} user={postUser} />
          <div className="flex-1 flex font-xs font-medium h-10">
            <div className="flex-1 flex flex-col">
              <div className="flex">
                <Link href={user_id!}>
                  <span className="mr-2 hover:underline">
                    {postUser.username}
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
              <i className="hover:bg-gray-400/20 hover:dark:bg-gray-400/25 fa-solid fa-ellipsis flex justify-center items-center h-8 w-8 text-lg rounded-full cursor-pointer transition-colors ease-out" />
            </div>
          </div>
        </div>
        {PostContentElement}
        {/* <div> */}
        {typeof image === "string" && (
          <img
            src={image}
            alt={image}
            className="cursor-pointer select-none min-h-[15rem] max-h-[31rem] w-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            onClick={() => setBigImage(image)}
          />
        )}
        {!image && og?.url && (
          <>
            <div
              onClick={() =>
                window.open(og.url, "_blank", "noopener,noreferrer")
              }
            >
              {og.image?.url && (
                <img
                  src={og.image.url}
                  alt={image}
                  className="cursor-pointer select-none min-h-[15rem] max-h-96 w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div className="flex-1 text-left p-2 overflow-hidden text-xs bg-gray-400/25 dark:bg-gray-400/20 dark:text-neutral-200 font-normal">
                {og.siteName && (
                  <p className="w-full h-[1.125rem] truncate">{og.siteName}</p>
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
            </div>
          </>
        )}
        {/* </div> */}
        {likeCount || commentCount || sharedCount ? (
          <div
            className={`${image || og ? "h-10" : "pb-2.5"} flex ${
              likeCount ? "justify-between" : "justify-end"
            } mx-3 border-b border-black/25 dark:border-white/25 select-none opacity-75`}
          >
            {likeCount ? (
              <div className="flex items-center">
                {likeCount} like{likeCount > 1 ? "s" : ""}
              </div>
            ) : null}
            <div className="flex items-center">
              {commentCount ? (
                <div
                  className={`${
                    sharedCount && "pr-3"
                  } hover:underline cursor-pointer`}
                  onClick={() => setCommentModal(true)}
                >
                  {commentCount} comments
                </div>
              ) : null}
              {sharedCount ? <div>xxx shares</div> : null}
            </div>
          </div>
        ) : (
          <div
            className={`${
              og
                ? ""
                : "pb-2.5 flex justify-between mx-3 border-b border-black/25 dark:border-white/25 select-none opacity-75"
            } `}
          />
        )}
        <div className="h-10 flex justify-evenly mx-3 select-none">
          <div
            className={`${
              likedByUser && "text-blue-500 dark:text-blue-400"
            } mr-2 my-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-gray-300/50 hover:dark:bg-gray-400/25 transition-colors ease-out`}
            onClick={
              processingLike ? () => {} : likedByUser ? unlikePost : likePost
            }
          >
            <i className="fa-solid fa-thumbs-up mr-2" />
            Like
          </div>
          <div
            className="mr-2 my-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-gray-300/50 hover:dark:bg-gray-400/25 transition-colors ease-out"
            onClick={() => {
              setCommentModal(true);
            }}
          >
            <i className="fa-solid fa-comment mr-2" />
            Comment
          </div>
          <div className="my-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-gray-300/50 hover:dark:bg-gray-400/25 transition-colors ease-out">
            <i className="fa-solid fa-share mr-2" />
            Share
          </div>
        </div>
      </div>
      <commentContext.Provider
        value={{
          post: {
            _id,
            user_id,
            recipient_id,
            sharedPost_id,
            content,
            image,
            og,
            createdAt,
            updatedAt,
            likedByUser,
            likeCount,
            commentCount,
            sharedCount,
          },
          comments,
          setComments,
          setSubComments,
          subComments,
          updatePost,
          focused,
          setFocused,
        }}
      >
        <CommentModal modal={commentModal} setModal={setCommentModal} />
      </commentContext.Provider>
    </>
  );
};

export default Post;
