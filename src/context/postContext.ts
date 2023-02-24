import {
  createContext,
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useContext,
} from "react";

// types
import type Og from "@/types/og";
import type Post from "@/types/post";
import type User from "@/types/user";
import type UrlCache from "@/types/UrlCache";

export type PostContext = {
  post: Post;
  setPost: Dispatch<SetStateAction<Post>>;
  recipient?: User;
  initialLoad: boolean;
  setInitialLoad: Dispatch<SetStateAction<boolean>>;
  loadingOg: boolean;
  setLoadingOg: Dispatch<SetStateAction<boolean>>;
  ogStack: Array<Og>;
  setOgStack: Dispatch<SetStateAction<Array<Og>>>;
  processUrl: (url: string) => void;
  postStyle: "mobile" | "desktop";
  image: string;
  loadImage: (e: unknown) => void;
  loadingImage: boolean;
  errorLoadingImage: boolean;
  setErrorLoadingImage: Dispatch<SetStateAction<boolean>>;
  removeImage: () => void;
  imageInputRef: RefObject<HTMLInputElement>;
  urlCacheRef: MutableRefObject<UrlCache>;
};

export const postContext = createContext<PostContext>({
  post: { content: "", og: undefined, recipient: undefined },
  setPost: () => {},
  recipient: undefined,
  initialLoad: true,
  setInitialLoad: () => {},
  loadingOg: false,
  setLoadingOg: () => {},
  ogStack: [],
  setOgStack: () => {},
  processUrl: () => {},
  postStyle: "mobile",
  image: "",
  loadImage: () => {},
  loadingImage: false,
  errorLoadingImage: false,
  setErrorLoadingImage: () => {},
  removeImage: () => {},
  imageInputRef: { current: null },
  urlCacheRef: { current: {} },
});

const usePostContext = () => useContext(postContext);

export default usePostContext;
