import { createContext, Dispatch, SetStateAction, useContext } from "react";

// types
import type Comment from "@/types/comment";
import type SubComment from "@/types/subcomment";
import type Post from "@/types/post";

export type CommentContext = {
  post: Post;
  comments: Comment[];
  setComments: Dispatch<SetStateAction<Comment[]>>;
  subComments: {
    [comment_id: string]: SubComment[];
  };
  setSubComments: Dispatch<
    SetStateAction<{ [comment_id: string]: SubComment[] }>
  >;
  updatePost: (post: Post) => void;
  focused: string | undefined;
  setFocused: Dispatch<SetStateAction<string | undefined>>;
  hidePrimaryCommentInput: boolean;
  setHidePrimaryCommentInput: Dispatch<SetStateAction<boolean>>;
};

export const commentContext = createContext<CommentContext>({
  post: {},
  comments: [],
  setComments: () => {},
  subComments: {},
  setSubComments: () => {},
  updatePost: () => {},
  focused: undefined,
  setFocused: () => {},
  hidePrimaryCommentInput: false,
  setHidePrimaryCommentInput: () => {},
});

const useCommentContext = () => useContext(commentContext);

export default useCommentContext;
