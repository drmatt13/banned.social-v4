/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from "react";

interface Props {
  postid?: number;
  userid?: number;
  recipientId?: number;
  sharedPostId?: number;
  title?: string;
  body?: string;
}

const Post = ({ userid, recipientId, body }: Props) => {
  const postImgRef = useRef<HTMLImageElement>(null);

  const [profileImg, setProfileImg] = useState(
    `https://i.pravatar.cc/50?img=${Math.floor(Math.random() * (70 - 1) + 1)}`
  );

  const [postImg, setPostImg] = useState(
    `https://picsum.photos/id/${Math.floor(
      Math.random() * (1075 - 1) + 1
    )}/650/400`
  );

  useEffect(() => {
    postImgRef.current?.addEventListener("error", () => {
      postImgRef.current?.remove();
    });
  }, []);

  return (
    <>
      <style jsx>{`
        @media (max-width: 535px) {
        .bg-light-secondary {
          border-radius: 0;
        }
      `}</style>
      <div className="relative text-sm bg-light-secondary dark:bg-dark-secondary pt-3 rounded-lg mb-4 w-full border dark:border-dark-border shadow dark:shadow-dark-border overflow-hidden">
        <div className="mx-4 flex items-start mb-2">
          {profileImg && (
            <div className="overflow-hidden mr-3 rounded-full border border-light-border dark:border-white/25 cursor-pointer">
              <img
                className="h-10 w-10 hover:brightness-[98%] select-none"
                src={profileImg}
                alt="avatar"
              />
            </div>
          )}

          <div className="flex-1 flex self-center font-xs font-medium h-10">
            <span className="cursor-pointer mr-2">user1</span>{" "}
            <span className="mr-2">
              <i
                className="fa-solid fa-angle-right"
                style={{
                  fontSize: "0.75rem",
                }}
              />
            </span>
            <span className="cursor-pointer">user2</span>
          </div>
        </div>
        <p
          className="mx-3 pb-3 flex-1 text-left"
          style={{
            lineHeight: "1.25rem",
          }}
        >
          {body}
        </p>
        <div>
          {postImg && (
            <img
              ref={postImgRef}
              src={postImg}
              alt="postImage"
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
