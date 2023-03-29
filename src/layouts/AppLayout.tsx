import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

// components
import Loading from "@/components/Loading";
import ToggleDarkModeButton from "@/components/ToggleDarkModeButton";
import OAuthSetUsername from "@/components/OAuthSetUsername";
import UpdateAvatarModal from "@/modals/UpdateAvatarModal";

// context
import useGlobalContext from "@/context/globalContext";
import { onlineFriendsContext } from "@/context/onlineFriendsContext";

// hooks
import useVerifyUser from "@/hooks/useVerifyUser";
import useOnlineFriends from "@/hooks/useOnlineFriends";

// layouts
import Navbar from "@/layouts/Navbar";
import UnprotectedNavbar from "@/layouts/UnprotectedNavbar";
import StaticBackground from "@/layouts/StaticBackground";
import NotificationHandler from "@/layouts/NotificationHandler";

interface Props {
  children: React.ReactNode;
}

const AppLayout = ({ children }: Props) => {
  const router = useRouter();
  const { loggingOut, user, setUser, setNavButtonsVisable } =
    useGlobalContext();
  const loadingUser = useVerifyUser(user, setUser);
  const { onlineFriends, setOnlineFriends, loadingOnlineFriends } =
    useOnlineFriends(user);
  const [showNavbar, setShowNavbar] = useState(true);
  const [modal, setModal] = useState(false);
  const [onlineFriendsScrollPosition, setOnlineFriendsScrollPosition] =
    useState(0);

  useEffect(() => {
    if (!loadingUser) {
      const route = router.pathname.split("/")[1] || "/";
      if (!["login", "signup", "oauth"].includes(route)) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    }
  }, [router.pathname, loadingUser]);

  useEffect(() => {
    if (!loadingUser && user?.username && !user?.avatar) {
      setModal(true);
    }
  }, [loadingUser, modal, user]);

  return (
    <>
      <style jsx>{`
        @media (min-width: 2024px) {
          div > div {
            width: 1600px;
          }
        }
      `}</style>
      {!loadingUser && !user?.avatar && <ToggleDarkModeButton />}
      {loadingUser || loggingOut ? (
        <div className="h-screen w-screen">
          <Loading />
        </div>
      ) : (
        <>
          <onlineFriendsContext.Provider
            value={{
              onlineFriends,
              setOnlineFriends,
              loading: loadingOnlineFriends,
              onlineFriendsScrollPosition,
              setOnlineFriendsScrollPosition,
            }}
          >
            <NotificationHandler>
              <StaticBackground showNavbar={showNavbar}>
                <UpdateAvatarModal modal={modal} setModal={setModal} />
                {user && !user.username ? (
                  <OAuthSetUsername />
                ) : (
                  (!user || (user && user.avatar)) && (
                    <div
                      className="absolute top-0 left-0 w-full min-h-screen h-full flex justify-center overflow-y-auto dark:[color-scheme:dark]"
                      onClick={() => setNavButtonsVisable(false)}
                      onDragStart={(e) => e.preventDefault()}
                    >
                      {showNavbar && !loadingUser && (
                        <>
                          {user ? (
                            user.username && user.avatar && <Navbar />
                          ) : (
                            <UnprotectedNavbar />
                          )}
                        </>
                      )}
                      <div className="absolute top-0 w-full min-h-screen max-h-screen">
                        {children}
                      </div>
                    </div>
                  )
                )}
              </StaticBackground>
            </NotificationHandler>
          </onlineFriendsContext.Provider>
        </>
      )}
    </>
  );
};

export default AppLayout;
