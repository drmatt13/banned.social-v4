import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import type User from "@/types/user";

// context
import { useGlobalContext, GlobalContext } from "@/context/globalContext";

// utils
import processService from "../lib/processService";

const useUser = (user: User, setUser: (user: User) => void): boolean => {
  const { logout }: GlobalContext = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
  }, [router.pathname, setUser, user]);

  return loading;
};

export default useUser;
