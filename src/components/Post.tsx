/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from "react";

// context
import useGlobalContext from "@/context/globalContext";

// data
import avatarList from "@/data/avatarList";

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
    console.log(image);
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
          <div className="overflow-hidden mr-3 rounded-full border border-light-border dark:border-white/25 cursor-pointer">
            <img
              className="h-10 w-10 hover:brightness-[98%] select-none"
              src={
                avatarList[user?.avatar!]
                  ? `data:image/jpg;base64, ${avatarList[user?.avatar!]}`
                  : user?.avatar
              }
              alt={user?.avatar}
            />
          </div>
          <div className="flex-1 flex self-center font-xs font-medium h-10">
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
                <span className="cursor-pointer">{postRecipient.username}</span>
              </>
            )}
          </div>
        </div>
        {
          <p
            className={`${content ? "pb-3" : "pb-.5"} mx-3 flex-1 text-left`}
            style={{
              lineHeight: "1.25rem",
            }}
          >
            {content}
          </p>
        }
        <div>
          {image && (
            <img
              // ref={postImgRef}
              src={image}
              alt={image}
              className="cursor-pointer select-none"
            />
          )}
        </div>
        <div className="h-10 flex justify-between mx-3 border-b border-black/25 dark:border-white/25 select-none">
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
