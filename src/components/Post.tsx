/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

// components
import UserAvatarMini from "./UserAvatarMini";

// context
import useGlobalContext from "@/context/globalContext";

// libraries
import validateUrl from "@/lib/validateUrl";

// types
import type IPost from "@/types/post";
import type FeedUser from "@/types/feedUser";
import type Og from "@/types/og";

const Post = ({
  _id,
  user_id,
  recipient_id,
  sharedPost_id,
  content,
  image,
  og,
}: IPost) => {
  const { feedCache, user, mobile } = useGlobalContext();

  const [PostContentElement, setPostContentElement] = useState(<></>);

  const [postUser, setPostUser] = useState<FeedUser>(undefined);
  const [postRecipient, setPostRecipient] = useState<FeedUser>(undefined);

  const likePost = useCallback(() => {}, []);
  const commentOnPost = useCallback(() => {}, []);
  const sharePost = useCallback(() => {}, []);

  useEffect(() => {
    const words = content.split(/([\s\n]+)/);

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
      <></>
      <div className="relative text-sm bg-light-secondary dark:bg-dark-secondary pt-3 rounded-lg mb-5 w-full border dark:border-dark-border shadow dark:shadow-dark-border overflow-hidden">
        <div className="mx-4 flex items-start mb-2">
          <UserAvatarMini id={user_id!} user={postUser} />
          <div className="flex-1 flex font-xs font-medium h-10">
            <div className="flex-1 flex flex-col self-center">
              <div className="flex">
                <Link href={user_id!}>
                  <span className="cursor-pointer mr-2">
                    {postUser.username}
                  </span>{" "}
                  {postRecipient && (
                    <>
                      <span className="mr-2">
                        <i
                          className="fa-solid fa-angle-right"
                          style={{
                            fontSize: "0.75rem",
                          }}
                        />
                      </span>
                      <span className="cursor-pointer">
                        {postRecipient.username}
                      </span>
                    </>
                  )}
                </Link>
              </div>
              <div className="flex h-full items-center text-xs font-light opacity-75">
                February 24 at 12:56 PM
              </div>
            </div>
            <div className="h-full flex justify-center items-center">
              <i className="hover:bg-gray-400/20 fa-solid fa-ellipsis flex justify-center items-center h-8 w-8 text-lg rounded-full cursor-pointer transition-colors ease-out" />
            </div>
          </div>
        </div>
        {PostContentElement}
        {/* <div> */}
        {typeof image === "string" && (
          <img
            src={image}
            alt={image}
            className="cursor-pointer select-none min-h-[15rem] max-h-96 w-full object-cover"
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
                    className="cursor-pointer select-none min-h-[15rem] max-h-96 w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <div className="flex-1 text-left p-2 overflow-hidden text-xs bg-neutral-300/80 dark:bg-gray-400/20 dark:text-neutral-200 font-normal">
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
          } flex justify-between mx-3 border-b border-black/25 dark:border-white/25 select-none opacity-75`}
        >
          <div className="flex items-center">xxx likes</div>
          <div className="flex items-center">
            <div className="pr-3">xxx comments</div>
            <div>xxx shares</div>
          </div>
        </div>
        <div className="h-10 flex justify-evenly mx-3 select-none">
          <div className="m-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-gray-400/20 transition-colors ease-out">
            <i className="fa-solid fa-thumbs-up mr-2" />
            Like
          </div>
          <div className="m-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-gray-400/20 transition-colors ease-out">
            <i className="fa-solid fa-comment mr-2" />
            Comment
          </div>
          <div className="m-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-gray-400/20 transition-colors ease-out">
            <i className="fa-solid fa-share mr-2" />
            Share
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
