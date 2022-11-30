import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

// components
import Navbar from "../components/Navbar";
import UnprotectedNavbar from "../components/UnprotectedNavbar";

// context
import { useGlobalContext } from "../context/globalContext";

// hooks
import useUser from "../hooks/useUser";

interface ChildProps {
  children?: React.ReactNode;
}

const AppLayout = ({ children }: ChildProps) => {
  const router = useRouter();
  const { user, setUser, loggingOut } = useGlobalContext();
  const loading = useUser(user, setUser);
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    if (!loading) {
      const route = router.pathname.split("/")[1] || "/";
      if (!["login", "signup", "oauth"].includes(route)) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    }
  }, [router.pathname, loading]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <ToggleDarkModeButton />
        {loading || loggingOut ? (
          <div className="w-full text-center">
            <div className="text-black dark:text-white">loading</div>
          </div>
        ) : (
          <div>
            {user?._id && !user.username ? <></> : <></>}
            {user?._id && !user.avatar ? <></> : <></>}
            {showNavbar && (
              <>{user?._id ? <Navbar /> : <UnprotectedNavbar />}</>
            )}
            <div>{children}</div>
          </div>
        )}
      </div>
    </>
  );
};

const ToggleDarkModeButton = () => {
  const { darkMode, toggleDarkMode, mobile } = useGlobalContext();
  return (
    <div className="z-10 top-0 h-28 w-full absolute py-8 pr-8 flex flex-row-reverse noselect pointer-events-none select-none">
      <div className="w-10 h-10">
        <i
          onClick={toggleDarkMode}
          className={`${
            mobile
              ? "active:scale-90 active:bg-black/75"
              : "hover:scale-90 hover:bg-black/75"
          } pointer-events-auto fa-solid bg-black/50 cursor-pointer transition-all text-lg flex justify-center items-center h-full w-full rounded-full 
            ${
              darkMode
                ? "fa-moon text-purple-500 active:text-purple-400"
                : "fa-sun text-orange-400 /active:text-yellow-400"
            }`}
        />
      </div>
    </div>
  );
};

export default AppLayout;
