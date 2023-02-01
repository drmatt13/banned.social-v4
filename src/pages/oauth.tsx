import { useRef, useEffect, useCallback } from "react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import Head from "next/head";

// components
import Loading from "@/components/Loading";

// context
import { useGlobalContext } from "../context/globalContext";

// utils
import { processService, serviceError } from "../lib/processService";

const Login: NextPage = () => {
  const { data: session } = useSession();
  const { setUser, logout } = useGlobalContext();
  const processing = useRef(false);
  const router = useRouter();

  const oAuthLogin = useCallback(
    async (query: { provider: string; expires?: string; path: string }) => {
      try {
        processing.current = true;
        const res = await processService("oauth", {
          provider: query.provider,
        });
        const { token, success, error } = res;
        if (success && token) {
          Cookie.set("token", token, {
            expires: query.expires ? undefined : 3600,
          });
          delete query.expires;
          let path = "";
          if (query.path) {
            path = query.path;
          }
          let queryString = "";
          for (const key in query) {
            if (key !== "path") {
              queryString += `${key}=${(query as any)[key]}&`;
            }
          }
          if (queryString.endsWith("&")) {
            queryString = queryString.slice(0, -1);
          }
          router.replace(
            `${path && "/" + path}${queryString ? "?" : ""}${queryString}`
          );
        } else {
          if (error === serviceError.Unauthorized) {
            throw new Error(serviceError.Unauthorized);
          } else if (error === serviceError.FailedToCreateUser) {
            throw new Error(serviceError.FailedToCreateUser);
          } else {
            throw new Error(serviceError.ServerError);
          }
        }
      } catch (error) {
        alert("Server error");
        logout();
      }
    },
    [logout, router]
  );

  useEffect(() => {
    if (processing.current) return;
    const query = router.asPath
      .replace("/oauth?", "")
      .split("&")
      .reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        if (key) acc[key] = value;
        return acc;
      }, {} as any);
    if (!processing.current) {
      oAuthLogin(query);
    }
    if (typeof session !== "undefined") {
      if (session !== null) {
        oAuthLogin(query);
      } else if (session === null) {
        logout();
      }
    }
  }, [processing, session, router, logout, oAuthLogin]);

  return (
    <>
      <Head>
        <title>Login | Social</title>
      </Head>
      <Loading />
    </>
  );
};

export default Login;
