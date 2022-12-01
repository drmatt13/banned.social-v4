import React, { useState, useCallback } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Cookie from "js-cookie";
import Head from "next/head";

// components
import LoginLogo from "@/components/LoginLogo";

// context
import { useGlobalContext } from "@/context/globalContext";

// libaries
import processService from "@/lib/processService";
import Link from "next/link";

// styles
import darkStatic from "@/styles/darkStatic.module.scss";
import lightStatic from "@/styles/lightStatic.module.scss";

const Login: NextPage = () => {
  const { darkMode, mobile } = useGlobalContext();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [expires, setExpires] = useState(true);
  const [loading, setLoading] = useState(false);
  const [originalViewportHeight] = useState(window.innerHeight + "px");

  const standardLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        e.preventDefault();
        setLoading(true);
        const data = await processService("login", {
          username,
          password,
        });
        const { user, token, success } = data;
        if (success) {
          if (user && token) {
            Cookie.set("token", token, {
              expires: expires ? undefined : 3600,
            });
            const query = router.query;
            let path = "";
            if (query.path) {
              path = query.path as string;
            }
            let queryString = "";
            for (const key in query) {
              if (key !== "path") {
                queryString += `${key}=${query[key]}&`;
              }
            }
            if (queryString.endsWith("&")) {
              queryString = queryString.slice(0, -1);
            }
            window.location.replace(
              `${window.location.origin}${path}${
                queryString ? "?" : ""
              }${queryString}`
            );
          } else {
            alert("invalid credentials");
            setLoading(false);
          }
        } else {
          alert("invalid credentials");
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    [username, password, expires, router]
  );

  const oAuth = useCallback(
    (provider: string) => {
      setUsername("");
      setPassword("");
      setLoading(true);
      const query = router.query;
      let queryString = "";
      for (const key in query) {
        if (key !== "provider" && key !== "expires") {
          queryString += `${key}=${query[key]}&`;
        }
      }
      if (queryString.endsWith("&")) {
        queryString = queryString.slice(0, -1);
      }
      signIn(provider, {
        callbackUrl: `/oauth?provider=${provider}&expires=${
          expires ? "true" : "false"
        }${queryString ? "&" : ""}${queryString}`,
      });
    },
    [router, expires, setPassword, setUsername, setLoading]
  );

  return (
    <>
      <Head>
        <title>Login | Banned.Social</title>
      </Head>
      <style>{`
      ${
        darkMode
          ? `input:-webkit-autofill,
      input:-webkit-autofill:focus {
        border: 1px solid #3b4148;
        -webkit-text-fill-color: rgba(255, 255, 255, 0.9);
        -webkit-box-shadow: 0 0 0px 1000px #3b4148 inset;
        box-shadow: 0 0 0px 1000px #3b4148 inset;
        color: rgba(255, 255, 255, 0.9);
        caret-color: #fff;
      }`
          : `input:-webkit-autofill,
      input:-webkit-autofill:focus {
        border: 1px solid #ffffff;
        -webkit-text-fill-color: black;
        -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
        box-shadow: 0 0 0px 1000px #ffffff inset;
        color: black;;
      }`
      } 
      `}</style>
      <div
        className={`${
          darkMode ? darkStatic.container : lightStatic.container
        } relative flex flex-col items-center`}
        style={{
          minHeight: originalViewportHeight,
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-[700px] md:h-[850px] xl:h-[1100px] invert dark:invert-0"
          style={{
            minHeight: originalViewportHeight,
            background: darkMode
              ? mobile
                ? "radial-gradient(at center center, rgba(51, 51, 51, 0.80) 0%, rgba(0, 0, 0, 0.9) 100%)"
                : "radial-gradient(at center center, rgba(51, 51, 51, 0.50) 0%, rgba(0, 0, 0, 0.6) 100%)"
              : mobile
              ? "radial-gradient(at center center, rgba(29, 29, 29, 0.30) 0%, rgba(5, 5, 5, 0.5) 100%)"
              : "radial-gradient(at center center, rgba(29, 29, 29, 0.50) 0%, rgba(5, 5, 5, 0.7) 100%)",
          }}
        />

        <LoginLogo />
        <div className="mt-14 md:mt-16 lg:mt-20 flex flex-col items-center z-50 animate-fade-in text-black">
          <form
            onSubmit={standardLogin}
            className="w-52 text-sm md:w-72 sm:text-base"
          >
            <div className="flex flex-col items-center">
              <div className="border border-light-border dark:border-dark-border shadow-lg w-full flex rounded overflow-hidden">
                <div className="py-2 w-12 flex justify-center items-center bg-light-secondary dark:bg-dark-secondary">
                  <i className="dark:text-gray-500 text-xs fa-solid fa-user" />
                </div>
                <input
                  className={`${
                    loading ? "text-gray-400" : "dark:text-gray-200"
                  } h-10 w-full px-2 py-2 focus:outline-none bg-light-form dark:bg-dark-form`}
                  type="text"
                  placeholder="Email or Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={true}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              <div className="border border-light-border dark:border-dark-border shadow-lg mt-3 w-full flex rounded overflow-hidden">
                <div className="py-2 w-12 flex justify-center items-center bg-light-secondary dark:bg-dark-secondary">
                  <i className="dark:text-gray-500 text-xs fa-solid fa-lock" />
                </div>
                <input
                  className={`${
                    loading ? "text-gray-400" : "dark:text-gray-200"
                  } h-10 w-full px-2 py-2 focus:outline-none bg-light-form dark:bg-dark-form`}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={true}
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="mt-3 flex text-[.6rem] sm:text-xs">
              <input
                className={`${
                  loading
                    ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    : "border-black bg-black dark:bg-black/75 hover:bg-black/80 dark:hover:bg-black text-white cursor-pointer"
                } border shadow-lg flex-1 text-center py-1.5 sm:px-4 sm:py-3 rounded`}
                type="button"
                value="REGISTER"
                onClick={() => {
                  setPassword("");
                  setUsername("");
                  router.replace("/signup");
                }}
                disabled={loading}
              />

              <div className="flex-[.1]" />
              <input
                className={`${
                  loading
                    ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-secondary text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    : "border-black/50 bg-blue-500 hover:bg-blue-400 dark:bg-pink-500 dark:hover:bg-pink-400 text-white cursor-pointer"
                } border flex-1 text-center sm:px-4 sm:py-3 rounded`}
                type="submit"
                value="SIGN IN"
                disabled={loading}
              />
            </div>
          </form>
          <div className="flex w-full mt-3 text-sm sm:text-base">
            <div className="flex-1 text-right">
              {!loading ? (
                <Link
                  href="/"
                  className="sm:pr-3 cursor-pointer underline text-pink-500 dark:text-blue-400 hover:text-pink-400 dark:hover:text-purple-500 whitespace-nowrap"
                >
                  Reset password?
                </Link>
              ) : (
                <div className="sm:pr-3 cursor-not-allowed text-gray-400 dark:text-gray-500">
                  Reset password?
                </div>
              )}
            </div>
            <div className="w-5" />
            <div
              className={`${
                loading
                  ? "text-gray-400 dark:text-gray-500"
                  : "dark:text-gray-300"
              } flex-1 flex items-center text-light-primary-text`}
            >
              <input
                className={`${loading && "cursor-not-allowed"} mr-2`}
                type="checkbox"
                name="expires"
                checked={!expires}
                onChange={(e) => setExpires(!e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="expires">Remember Me?</label>
            </div>
          </div>
          <div
            className={`${
              loading
                ? "text-gray-400 dark:text-gray-500"
                : "text-light-primary-text dark:text-gray-300"
            } text-sm sm:text-base mt-5 sm:mt-6 text-center`}
          >
            or sign in with
          </div>
          <div className="flex mt-5 sm:mt-6 text-sm sm:text-base">
            <button
              className={`${
                true
                  ? "opacity-40 dark:opacity-50 bg-light-accent text-black dark:text-gray-900 cursor-not-allowed"
                  : "bg-light-secondary hover:bg-gray-300/50 dark:hover:bg-light-primary cursor-pointer"
              } border border-light-border sm:w-28 md:w-32 px-2 py-1 rounded-full cursor-not-allowed flex justify-center items-center select-none`}
              disabled={true}
            >
              <Image
                height="16"
                width="16"
                className="mr-2"
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDEyOCAxMjgiIGlkPSJTb2NpYWxfSWNvbnMiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDMxX19zdHJva2UiPjxnIGlkPSJHb29nbGUiPjxyZWN0IGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBoZWlnaHQ9IjEyOCIgd2lkdGg9IjEyOCIvPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTI3LjU4NSw2NGMwLTQuMTU3LDAuNjktOC4xNDMsMS45MjMtMTEuODgxTDcuOTM4LDM1LjY0OCAgICBDMy43MzQsNDQuMTgzLDEuMzY2LDUzLjgwMSwxLjM2Niw2NGMwLDEwLjE5MSwyLjM2NiwxOS44MDIsNi41NjMsMjguMzMybDIxLjU1OC0xNi41MDNDMjguMjY2LDcyLjEwOCwyNy41ODUsNjguMTM3LDI3LjU4NSw2NCIgZmlsbD0iI0ZCQkMwNSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNjUuNDU3LDI2LjE4MmM5LjAzMSwwLDE3LjE4OCwzLjIsMjMuNTk3LDguNDM2TDEwNy42OTgsMTYgICAgQzk2LjMzNyw2LjEwOSw4MS43NzEsMCw2NS40NTcsMEM0MC4xMjksMCwxOC4zNjEsMTQuNDg0LDcuOTM4LDM1LjY0OGwyMS41NjksMTYuNDcxQzM0LjQ3NywzNy4wMzMsNDguNjQ0LDI2LjE4Miw2NS40NTcsMjYuMTgyIiBmaWxsPSIjRUE0MzM1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02NS40NTcsMTAxLjgxOGMtMTYuODEyLDAtMzAuOTc5LTEwLjg1MS0zNS45NDktMjUuOTM3ICAgIEw3LjkzOCw5Mi4zNDlDMTguMzYxLDExMy41MTYsNDAuMTI5LDEyOCw2NS40NTcsMTI4YzE1LjYzMiwwLDMwLjU1Ny01LjU1MSw0MS43NTgtMTUuOTUxTDg2Ljc0MSw5Ni4yMjEgICAgQzgwLjk2NCw5OS44Niw3My42ODksMTAxLjgxOCw2NS40NTcsMTAxLjgxOCIgZmlsbD0iIzM0QTg1MyIgZmlsbC1ydWxlPSJldmVub2RkIi8+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTI2LjYzNCw2NGMwLTMuNzgyLTAuNTgzLTcuODU1LTEuNDU3LTExLjYzNkg2NS40NTd2MjQuNzI3ICAgIGgzNC4zNzZjLTEuNzE5LDguNDMxLTYuMzk3LDE0LjkxMi0xMy4wOTIsMTkuMTNsMjAuNDc0LDE1LjgyOEMxMTguOTgxLDEwMS4xMjksMTI2LjYzNCw4NC44NjEsMTI2LjYzNCw2NCIgZmlsbD0iIzQyODVGNCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9nPjwvZz48L3N2Zz4="
                alt="google"
              />{" "}
              Google
            </button>
            <button
              className={`${
                true
                  ? "opacity-40 dark:opacity-50 bg-light-accent text-black dark:text-gray-900 cursor-not-allowed"
                  : "bg-light-secondary hover:bg-gray-300/50 dark:hover:bg-light-primary cursor-pointer"
              } border border-light-border sm:w-28 md:w-32 px-2 py-1 mx-2.5 sm:mx-6 rounded-full cursor-not-allowed flex justify-center items-center select-none`}
              disabled={true}
            >
              <Image
                height="16"
                width="16"
                className="mr-2"
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iMTAwJSIgc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjEwMCUiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2VyaWY9Imh0dHA6Ly93d3cuc2VyaWYuY29tLyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwYXRoIGQ9Ik01MTIsMjU2YzAsLTE0MS4zODUgLTExNC42MTUsLTI1NiAtMjU2LC0yNTZjLTE0MS4zODUsMCAtMjU2LDExNC42MTUgLTI1NiwyNTZjMCwxMjcuNzc3IDkzLjYxNiwyMzMuNjg1IDIxNiwyNTIuODlsMCwtMTc4Ljg5bC02NSwwbDAsLTc0bDY1LDBsMCwtNTYuNGMwLC02NC4xNiAzOC4yMTksLTk5LjYgOTYuNjk1LC05OS42YzI4LjAwOSwwIDU3LjMwNSw1IDU3LjMwNSw1bDAsNjNsLTMyLjI4MSwwYy0zMS44MDEsMCAtNDEuNzE5LDE5LjczMyAtNDEuNzE5LDM5Ljk3OGwwLDQ4LjAyMmw3MSwwbC0xMS4zNSw3NGwtNTkuNjUsMGwwLDE3OC44OWMxMjIuMzg1LC0xOS4yMDUgMjE2LC0xMjUuMTEzIDIxNiwtMjUyLjg5WiIgc3R5bGU9ImZpbGw6IzE4NzdmMjtmaWxsLXJ1bGU6bm9uemVybzsiLz48cGF0aCBkPSJNMzU1LjY1LDMzMGwxMS4zNSwtNzRsLTcxLDBsMCwtNDguMDIyYzAsLTIwLjI0NSA5LjkxNywtMzkuOTc4IDQxLjcxOSwtMzkuOTc4bDMyLjI4MSwwbDAsLTYzYzAsMCAtMjkuMjk3LC01IC01Ny4zMDUsLTVjLTU4LjQ3NiwwIC05Ni42OTUsMzUuNDQgLTk2LjY5NSw5OS42bDAsNTYuNGwtNjUsMGwwLDc0bDY1LDBsMCwxNzguODljMTMuMDMzLDIuMDQ1IDI2LjM5MiwzLjExIDQwLDMuMTFjMTMuNjA4LDAgMjYuOTY2LC0xLjA2NSA0MCwtMy4xMWwwLC0xNzguODlsNTkuNjUsMFoiIHN0eWxlPSJmaWxsOiNmZmY7ZmlsbC1ydWxlOm5vbnplcm87Ii8+PC9nPjwvc3ZnPg=="
                alt="facebook"
              />{" "}
              Facebook
            </button>

            <button
              className={`${
                loading
                  ? "opacity-40 dark:opacity-50 bg-light-accent text-black dark:text-gray-900 cursor-not-allowed"
                  : "bg-light-secondary hover:bg-gray-300/50 dark:hover:bg-light-primary cursor-pointer"
              } border border-light-border  sm:w-28 md:w-32 px-2 py-1 rounded-full flex justify-center items-center select-none`}
              onClick={() => oAuth("github")}
              disabled={loading}
            >
              <Image
                height="16"
                width="16"
                className="mr-2"
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMtU1ZHLTIwMDEwOTA0L0RURC9zdmcxMC5kdGQnPjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzIgMzIiIGhlaWdodD0iMzJweCIgaWQ9IkxheWVyXzEiIHZlcnNpb249IjEuMCIgdmlld0JveD0iMCAwIDMyIDMyIiB3aWR0aD0iMzJweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTYuMDAzLDBDNy4xNywwLDAuMDA4LDcuMTYyLDAuMDA4LDE1Ljk5NyAgYzAsNy4wNjcsNC41ODIsMTMuMDYzLDEwLjk0LDE1LjE3OWMwLjgsMC4xNDYsMS4wNTItMC4zMjgsMS4wNTItMC43NTJjMC0wLjM4LDAuMDA4LTEuNDQyLDAtMi43NzcgIGMtNC40NDksMC45NjctNS4zNzEtMi4xMDctNS4zNzEtMi4xMDdjLTAuNzI3LTEuODQ4LTEuNzc1LTIuMzQtMS43NzUtMi4zNGMtMS40NTItMC45OTIsMC4xMDktMC45NzMsMC4xMDktMC45NzMgIGMxLjYwNSwwLjExMywyLjQ1MSwxLjY0OSwyLjQ1MSwxLjY0OWMxLjQyNywyLjQ0MywzLjc0MywxLjczNyw0LjY1NCwxLjMyOWMwLjE0Ni0xLjAzNCwwLjU2LTEuNzM5LDEuMDE3LTIuMTM5ICBjLTMuNTUyLTAuNDA0LTcuMjg2LTEuNzc2LTcuMjg2LTcuOTA2YzAtMS43NDcsMC42MjMtMy4xNzQsMS42NDYtNC4yOTJDNy4yOCwxMC40NjQsNi43Myw4LjgzNyw3LjYwMiw2LjYzNCAgYzAsMCwxLjM0My0wLjQzLDQuMzk4LDEuNjQxYzEuMjc2LTAuMzU1LDIuNjQ1LTAuNTMyLDQuMDA1LTAuNTM4YzEuMzU5LDAuMDA2LDIuNzI3LDAuMTgzLDQuMDA1LDAuNTM4ICBjMy4wNTUtMi4wNyw0LjM5Ni0xLjY0MSw0LjM5Ni0xLjY0MWMwLjg3MiwyLjIwMywwLjMyMywzLjgzLDAuMTU5LDQuMjM0YzEuMDIzLDEuMTE4LDEuNjQ0LDIuNTQ1LDEuNjQ0LDQuMjkyICBjMCw2LjE0Ni0zLjc0LDcuNDk4LTcuMzA0LDcuODkzQzE5LjQ3OSwyMy41NDgsMjAsMjQuNTA4LDIwLDI2YzAsMiwwLDMuOTAyLDAsNC40MjhjMCwwLjQyOCwwLjI1OCwwLjkwMSwxLjA3LDAuNzQ2ICBDMjcuNDIyLDI5LjA1NSwzMiwyMy4wNjIsMzIsMTUuOTk3QzMyLDcuMTYyLDI0LjgzOCwwLDE2LjAwMywweiIgZmlsbD0iIzE4MTYxNiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PGcvPjxnLz48Zy8+PGcvPjxnLz48Zy8+PC9zdmc+"
                alt="github"
              />{" "}
              Github
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
