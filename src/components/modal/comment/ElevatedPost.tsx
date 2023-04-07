/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

import TextareaAutosize from "react-textarea-autosize";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";
import useCommentContext from "@/context/commentContext";

// components
import UserAvatarMini from "@/components/UserAvatarMini";

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
    },
    comments,
    setComments,
    subComments,
    setSubComments,
    aggregatedData,
    setAggregatedData,
    updatePost,
  } = useCommentContext();

  const [postUser, setPostUser] = useState<FeedUser>(undefined);
  const [postRecipient, setPostRecipient] = useState<FeedUser>(undefined);

  const [PostContentElement, setPostContentElement] = useState(<></>);

  const [comment, setComment] = useState("");
  const [focused, setFocused] = useState(false);
  const [creatingComment, setCreatingComment] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createComment = useCallback(async () => {}, []);

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
    textareaRef.current?.focus();
  }, [feedCache, image, recipient_id, user, user_id]);

  return (
    <>
      <div className="relative text-sm pt-3 rounded-lg w-full flex-1 overflow-y-auto">
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
        {typeof image === "string" && (
          <img
            src={image}
            alt={image}
            className="cursor-pointer select-none min-h-[10rem] h-[15rem] max-h-[30vh] w-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        {!image && og?.url && (
          <>
            <Link href={og.url}>
              <>
                {og.image?.url && (
                  <img
                    src={og.image.url}
                    alt={image}
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
            image || og ? "h-10" : "pb-2.5"
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
            onClick={() => textareaRef.current?.focus()}
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
        <div className="h-32">comments</div>
        {/* Comment section */}
      </div>
      <div
        className={`${
          darkMode ? styles.darkScroll : styles.lightScroll
        } my-3 w-full px-3 flex`}
      >
        <UserAvatarMini id={user_id!} user={user} extraSmall={true} />
        <div
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onClick={() => textareaRef.current?.focus()}
          className="relative flex-1 min-h-8 rounded-2xl bg-light-primary border border-neutral-600/60 cursor-text pl-3 pr-1.5 flex flex-col justify-center text-black/80 overflow-hidden"
        >
          <TextareaAutosize
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            minRows={1}
            maxRows={7}
            placeholder="Write a comment..."
            className={`
            
            ${
              // if it is scrollable
              (textareaRef.current?.scrollHeight || 0) > 140 &&
              (textareaRef.current?.scrollHeight || 0) >
                (textareaRef.current?.clientHeight || 0)
                ? "overflow-y-scroll"
                : "overflow-hidden"
            }
            ${(focused || textareaRef.current?.value) && "mt-1"}
            ${
              loading ? "animate-pulse" : ""
            } outline-none h-full resize-none decoration-none bg-transparent w-full text-sm`}
            style={{
              lineHeight: "1.45rem",
            }}
          />
          <div
            className={`${
              focused || textareaRef.current?.value
                ? "h-7 opacity-100"
                : "h-0 opacity-0"
            } transition-all ease-out duration-300 flex flex-row-reverse w-full items-center`}
          >
            <i
              className={`${
                focused || textareaRef.current?.value ? "scale-100" : "scale-0"
              } ${
                textareaRef.current?.value
                  ? "text-blue-600 hover:text-blue-500 cursor-pointer"
                  : "text-black/50 cursor-not-allowed"
              } fa-solid fa-share transition-all ease-out duration-300`}
            ></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElevatedPost;
