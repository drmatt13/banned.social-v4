import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import type User from "../types/user";

// utils
import processService from "../utils/processService";

const useUser = (
  user: User | {},
  setUser: (user: User | {}) => void
): boolean => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCredentials = async () => {
      // check if no token cookie exists
      if (!Cookies.get("token")) return setLoading(false);
      // check if token cookie is valid and update current user
      try {
        const res = await processService("get user");
        if (res.user) {
          setUser(res.user);
          setLoading(false);
        } else {
          Cookies.remove("token");
          Cookies.remove("next-auth.session-token");
          Cookies.remove("next-auth.callback-url");
          Cookies.remove("next-auth.csrf-token");
          setUser({});
          window.location.href = "/login";
        }
      } catch (error) {
        console.log("invalid token");
      }
    };
    checkCredentials();
  }, [setUser]);

  return loading;
};

export default useUser;
