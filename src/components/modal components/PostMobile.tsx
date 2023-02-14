/* eslint-disable @next/next/no-img-element */
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import DOMPurify from "dompurify";

// components
import BigSubmitButton from "@/components/BigSubmitButton";

// context
import useModalContext from "@/context/modalContext";
import useGlobalContext from "@/context/globalContext";

// data
import avatarList from "@/data/avatarList";

// libaries
import processService from "@/lib/processService";

//types
import type Post from "@/types/post";
import type User from "@/types/user";

interface Props {
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
  recipient?: User;
}

const PostMobile = ({ post, setPost, recipient }: Props) => {
  const { modal, setModal, loading, setLoading } = useModalContext();
  const { user } = useGlobalContext();

  const inputRef = useRef<HTMLDivElement>(null);

  const [initialLoad, setInitialLoad] = useState(true);
  const [loadingOg, setLoadingOg] = useState(false);

  useEffect(() => {
    if (initialLoad && inputRef.current) {
      inputRef.current.innerHTML = DOMPurify.sanitize(post.content);
    }
    setInitialLoad(false);
  }, [initialLoad, post.content]);

  const getOgData = useCallback(async () => {
    setLoadingOg(true);
    try {
      const data = await processService("get og", {
        url: post.content,
      });
      const { og } = data;
      setPost({ ...post, og });
    } catch (error) {
      console.log(error);
    }
    setLoadingOg(false);
  }, [post, setPost]);

  return createPortal(
    <>
      <div className="z-50 fixed h-screen w-screen bg-light-secondary dark:bg-dark-secondary">
        <div className="h-full w-full flex flex-col">
          <header className="h-12 flex items-center border-b dark:border-white/25">
            <div className="mx-3">
              <i
                className="fa-solid fa-arrow-left cursor-pointer px-1"
                onClick={() => setModal(false)}
              />
            </div>
            <div className="flex-1">Create Post</div>
            <div
              className="mx-4 font-bold cursor-pointer dark:text-white"
              onClick={() => {}}
            >
              Post
            </div>
          </header>
          <div className="p-2 border-b dark:border-white/25 flex">
            <div className="overflow-hidden mr-3 rounded-full border border-light-border dark:border-white/25 cursor-pointer">
              <img
                className="h-10 w-10 hover:brightness-[98%]"
                src={
                  avatarList[user?.avatar!]
                    ? `data:image/jpg;base64, ${avatarList[user?.avatar!]}`
                    : user?.avatar
                }
                alt={user?.avatar}
              />
            </div>
            <div>{user?.username}</div>
          </div>
          <div className="relative text-sm mb-3 min-h-[9rem] h-max max-h-[12rem] overflow-y-auto border-b dark:border-white/25">
            {/* <input
              type="text"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            /> */}
            <div
              ref={inputRef}
              className="h-full p-2 outline-none"
              contentEditable={true}
              onInput={(e) =>
                setPost({
                  ...post,
                  content: DOMPurify.sanitize(e.currentTarget.innerText),
                })
              }
            />
            <div className="absolute top-0 pointer-events-none p-2 text-gray-500 dark:text-neutral-400">
              {!post.content && `What's on your mind, ${user?.username}?`}
            </div>
          </div>
          {/*  */}
          {loadingOg && <div className="px-2 mb-3 h-20">loading...</div>}
          {!loadingOg && post.og?.title && post.og.description && (
            <div className="px-2 mb-3 h-20">
              <div className="p-2 flex bg-gray-200 dark:bg-dark-form border border-gray-300 dark:border-white/10  w-full h-full rounded-sm">
                {post.og.image && (
                  <div className="w-14 h-9 bg-black/20 mr-2">
                    <img
                      className="w-full h-full"
                      src={post.og.image.url}
                      alt={post.og.title}
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 text-xs justify-start overflow-hidden">
                  <div className="flex-1">{post.og.title}</div>
                  <div className="flex-[2]">{post.og.description}</div>
                  <div className="flex-1">{post.og.url}</div>
                </div>
              </div>
            </div>
          )}
          {/*  */}
          <BigSubmitButton
            radius="rounded-md"
            value="Post"
            disabled={false}
            onClick={getOgData}
          />
        </div>
      </div>
    </>,
    document.getElementById("modal")!
  );
};

export default PostMobile;
