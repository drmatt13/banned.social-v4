/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from "react";

interface IProps {
  postid?: number;
  userid?: number;
  recipientId?: number;
  sharedPostId?: number;
  title?: string;
  body?: string;
}

const Post = ({ userid, recipientId, body }: IProps) => {
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
      <div className="relative bg-light-secondary dark:bg-dark-secondary pt-3 rounded-lg mb-4 w-full border dark:border-dark-border shadow dark:shadow-dark-border overflow-hidden">
        <div className="mx-4 flex items-start mb-2">
          {profileImg && (
            <div className="overflow-hidden mr-3 rounded-full /border-2 border-blue-400 dark:border-blue-500">
              <img className="h-10 w-10" src={profileImg} alt="avatar" />
            </div>
          )}
          
          <div className="flex-1 flex self-center font-mono text-sm font-bold h-10 /bg-black">
            from > to
          </div>
        </div>
        <p className="mx-3 pb-3 flex-1 text-left text-sm text" style={{
          lineHeight: "1.25rem",
        }}>{body}</p>
        <div>
          {postImg && <img ref={postImgRef} src={postImg} alt="postImage" />}
        </div>
        <div className="h-10 flex justify-between mx-3 border-b border-black/25 dark:border-white/25">
          <div className="flex items-center">xxx likes</div>
          <div className="flex items-center">
            <div className="pr-3">xxx comments</div>
            <div>xxx shares</div>
          </div>
        </div>
        <div className="h-12 flex justify-evenly mx-3">
          <div className="m-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-gray-400/20 transition-colors ease-out">
            Like
          </div>
          <div className="m-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-gray-400/20 transition-colors ease-out">
            Comment
          </div>
          <div className="m-1 flex-1 flex justify-center items-center rounded-md hover:cursor-pointer hover:bg-gray-400/20 transition-colors ease-out">
            Share
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
