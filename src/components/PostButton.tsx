/* eslint-disable @next/next/no-img-element */
import { useState, useCallback } from "react";
import Link from "next/link";

// context
import useGlobalContext from "@/context/globalContext";
import { modalContext } from "@/context/modalContext";
import { postContext } from "@/context/postContext";

// data
import avatarList from "@/data/avatarList";

// modal
import PostModal from "@/modals/PostModal";

// types
import type User from "@/types/user";
import type Post from "@/types/post";
import type UrlCache from "@/types/UrlCache";

// libaries
import processService from "@/lib/processService";

interface Props {
  recipient?: User;
}

const PostButton = ({ recipient }: Props) => {
  const { user } = useGlobalContext();
  const [post, setPost] = useState<Post>({
    content: "",
    recipient,
    og: undefined,
  });
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loadingOg, setLoadingOg] = useState(false);
  const [urlCache, setUrlCache] = useState<UrlCache>({});
  const [ogStack, setOgStack] = useState<Array<UrlCache>>([]);
  const [image, setImage] = useState<string | undefined>(undefined);

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

  const parseHTML = useCallback((html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html.replace(/<[^>]+>/gi, " ");
    return (
      div.textContent?.replace(/\s+/g, " ") ||
      div.innerText.replace(/\s+/g, " ") ||
      ""
    );
  }, []);

  return (
    <>
      {" "}
      <style jsx>{`
    @media (max-width: 535px) {
    .bg-light-secondary {
      border-radius: 0;
    }
  `}</style>
      <modalContext.Provider value={{ modal, setModal, loading, setLoading }}>
        <postContext.Provider
          value={{
            post,
            setPost,
            initialLoad,
            setInitialLoad,
            recipient,
            loadingOg,
            setLoadingOg,
            getOgData,
            urlCache,
            setUrlCache,
            ogStack,
            setOgStack,
            image,
            setImage,
          }}
        >
          <PostModal />
        </postContext.Provider>
      </modalContext.Provider>
      <div className="w-full text-sm flex bg-light-secondary dark:bg-dark-secondary rounded-lg px-4 py-3 mb-5 border dark:border-dark-border shadow-sm dark:shadow-dark-border select-none">
        <div className="overflow-hidden mr-3 rounded-full border border-light-border dark:border-white/25 cursor-pointer">
          <Link href={`/${user?._id}`}>
            <img
              className="h-10 w-10 hover:brightness-[98%]"
              src={
                avatarList[user?.avatar!]
                  ? `data:image/jpg;base64, ${avatarList[user?.avatar!]}`
                  : user?.avatar
              }
              alt={user?.avatar}
            />
          </Link>
        </div>
        <div
          onClick={() => setModal(true)}
          className="relative flex-1 h-10 rounded-full bg-light-primary dark:bg-dark-form border dark:border-gray-900/50 hover:bg-stone-200 dark:hover:bg-white/25 cursor-pointer hover:transition-colors hover:duration-200 ease-out group"
        >
          <div className="absolute h-full w-full top-0 left-0 flex items-center text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white hover:transition-colors hover:duration-200 ease-out truncate">
            <div className="truncate ml-4 mr-4">
              {parseHTML(post.content).trim() !== ""
                ? parseHTML(post.content)
                : `What's on your mind, 
            ${
              user!.username[0]?.toUpperCase() + user!.username!.substring(1)
            }?`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostButton;
