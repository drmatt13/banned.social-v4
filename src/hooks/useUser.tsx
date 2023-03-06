import { useState, useEffect, useCallback } from "react";

// context
import useGlobalContext from "@/context/globalContext";

// libraries
import processService from "@/lib/processService";

// types
import type User from "@/types/user";

interface Props {
  _id?: string;
}

const useUser = ({ _id }: Props) => {
  const { setFeedCache, user } = useGlobalContext();

  const [userState, setUser] = useState<User>(undefined);
  const [loading, setLoading] = useState(true);

  const getUser = useCallback(
    async (defaultUser: User) => {
      if (!_id) return;
      setLoading(true);
      if (defaultUser && defaultUser._id === _id) {
        setUser(defaultUser);
        setLoading(false);
        return;
      }
      const data = await processService("get user", {
        _id,
      });
      const { user } = data;
      if (user) {
        setFeedCache((prev) => ({
          ...prev,
          [user._id]: { avatar: user.avatar, username: user.username },
        }));
        setUser(user);
        setLoading(false);
      }
    },
    [_id, setFeedCache]
  );

  useEffect(() => {
    if (_id) getUser(user);
  }, [getUser, _id, user]);

  return { user: userState, loading };
};

export default useUser;
