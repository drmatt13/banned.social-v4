import { createContext, Dispatch, SetStateAction, useContext } from "react";

// types
import type Comment from "@/types/comment";
import type Post from "@/types/post";
import type AggregatedData from "@/types/AggregatedData";

export type CommentContext = {
  post: Post;
  comments: Comment[];
  setComments: Dispatch<SetStateAction<Comment[]>>;
  subComments: {
    [comment_id: string]: Comment[];
  };
  setSubComments: Dispatch<SetStateAction<{ [comment_id: string]: Comment[] }>>;
  aggregatedData?: AggregatedData;
  setAggregatedData: Dispatch<SetStateAction<AggregatedData>>;
  updatePost: (post: Post) => void;
  focused: string | undefined;
  setFocused: Dispatch<SetStateAction<string | undefined>>;
};

export const commentContext = createContext<CommentContext>({
  post: {},
  comments: [],
  setComments: () => {},
  subComments: {},
  setSubComments: () => {},
  aggregatedData: undefined,
  setAggregatedData: () => {},
  updatePost: () => {},
  focused: undefined,
  setFocused: () => {},
});

const useCommentContext = () => useContext(commentContext);

export default useCommentContext;
