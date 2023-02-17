import { createContext, Dispatch, SetStateAction, useContext } from "react";

// types
import Post from "@/types/post";
import User from "@/types/user";
import UrlCache from "@/types/UrlCache";

export type PostContext = {
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
  recipient?: User;
  initialLoad: boolean;
  setInitialLoad: Dispatch<SetStateAction<boolean>>;
  loadingOg: boolean;
  setLoadingOg: Dispatch<SetStateAction<boolean>>;
  getOgData: () => Promise<void>;
  urlCache: UrlCache;
  setUrlCache: Dispatch<SetStateAction<UrlCache>>;
  ogStack: Array<UrlCache>;
  setOgStack: Dispatch<SetStateAction<Array<UrlCache>>>;
  image: string | undefined;
  setImage: Dispatch<SetStateAction<string | undefined>>;
};

export const postContext = createContext<PostContext>({
  post: { content: "", og: undefined, recipient: undefined },
  setPost: () => {},
  recipient: undefined,
  initialLoad: true,
  setInitialLoad: () => {},
  loadingOg: false,
  setLoadingOg: () => {},
  getOgData: () => Promise.resolve(),
  urlCache: {},
  setUrlCache: () => {},
  ogStack: [],
  setOgStack: () => {},
  image: undefined,
  setImage: () => {},
});

const usePostContext = () => useContext(postContext);

export default usePostContext;
