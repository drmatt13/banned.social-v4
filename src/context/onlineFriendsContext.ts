import { createContext, Dispatch, SetStateAction, useContext } from "react";

// types
import User from "@/types/user";

export type OnlineFriendsContext = {
  onlineFriends: Array<User>;
  setOnlineFriends: Dispatch<SetStateAction<Array<User>>>;
  loading: boolean;
  onlineFriendsScrollPosition: number;
  setOnlineFriendsScrollPosition: Dispatch<SetStateAction<number>>;
};

export const onlineFriendsContext = createContext<OnlineFriendsContext>({
  onlineFriends: [],
  setOnlineFriends: () => {},
  loading: false,
  onlineFriendsScrollPosition: 0,
  setOnlineFriendsScrollPosition: () => {},
});

const useOnlineFriendsContext = () => useContext(onlineFriendsContext);

export default useOnlineFriendsContext;
