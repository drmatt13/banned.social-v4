/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from "react";

// components
import UserAvatarMini from "./UserAvatarMini";

// context
import useGlobalContext from "@/context/globalContext";

// types
import type User from "@/types/user";
import type IPost from "@/types/post";
import type FeedCache from "@/types/feedCache";
import type Og from "@/types/og";

type FeedUser = FeedCache[keyof User] | undefined;

const Post = ({
  _id,
  user_id,
  recipient_id,
  sharedPost_id,
  content,
  image,
  og,
}: IPost) => {
  const { feedCache, user } = useGlobalContext();

  const [postUser, setPostUser] = useState<FeedUser>(undefined);
  const [postRecipient, setPostRecipient] = useState<FeedUser>(undefined);

  const likePost = useCallback(() => {}, []);
  const commentOnPost = useCallback(() => {}, []);
  const sharePost = useCallback(() => {}, []);

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
      <div className="relative text-sm bg-light-secondary dark:bg-dark-secondary pt-3 rounded-lg mb-5 w-full border dark:border-dark-border shadow dark:shadow-dark-border overflow-hidden">
        <div className="mx-4 flex items-start mb-2">
          <UserAvatarMini user={user} />
          <div className="flex-1 flex flex-col self-center font-xs font-medium h-10">
            <div className="flex">
              <span className="cursor-pointer mr-2">{postUser.username}</span>{" "}
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
            </div>
            <div className="flex h-full items-center text-xs font-light opacity-75">
              February 24 at 12:56 PM
            </div>
          </div>
        </div>
        {
          <p
            className={`${
              content ? "pb-3" : "pb-[0.1875rem]"
            } mx-3 flex-1 text-left`}
            style={{
              lineHeight: "1.25rem",
            }}
          >
            {content}
          </p>
        }
        <div>
          {typeof image === "string" && (
            <img
              src={image}
              alt={image}
              className="cursor-pointer select-none min-h-[15rem]"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
        <div className="h-10 flex justify-between mx-3 border-b border-black/25 dark:border-white/25 select-none opacity-75">
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
