import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import type User from "@/types/user";

// context
import useGlobalContext from "@/context/globalContext";

// libraries
import processService from "@/lib/processService";

const useVerifyUser = (user: User, setUser: (user: User) => void): boolean => {
  const { setFeedCache } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkCredentials = async () => {
      // check if no token cookie exists
      if (!Cookies.get("token")) return setLoading(false);
      // check if token cookie is valid and update current user
      try {
        const data = await processService("get user", {});
        const { user } = data;
        if (user) {
          setFeedCache((prev) => ({
            ...prev,
            [user._id]: { avatar: user.avatar, username: user.username },
          }));
          setUser(user);
          setLoading(false);
        } else {
          Cookies.remove("token");
          Cookies.remove("next-auth.session-token");
          Cookies.remove("next-auth.callback-url");
          Cookies.remove("next-auth.csrf-token");
          window.location.replace("/login");
        }
      } catch (error) {
        alert("something went wrong");
        Cookies.remove("token");
        Cookies.remove("next-auth.session-token");
        Cookies.remove("next-auth.callback-url");
        Cookies.remove("next-auth.csrf-token");
        window.location.replace("/login");
      }
    };

    const route = router.pathname.split("/")[1] || "/";
    if (!user && !["login", "signup", "oauth"].includes(route)) {
      checkCredentials();
    } else {
      setLoading(false);
    }
  }, [router.pathname, setFeedCache, setUser, user]);

  return loading;
};

export default useVerifyUser;
