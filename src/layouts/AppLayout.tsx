import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// components
import Loading from "@/components/Loading";
import ToggleDarkModeButton from "@/components/ToggleDarkModeButton";
import OAuthSetUsername from "@/components/OAuthSetUsername";
import UpdateAvatarModal from "@/modals/UpdateAvatarModal";

// context
import useGlobalContext from "@/context/globalContext";

// hooks
import useUser from "@/hooks/useUser";

// layouts
import Navbar from "@/layouts/Navbar";
import UnprotectedNavbar from "@/layouts/UnprotectedNavbar";
import StaticBackground from "@/layouts/StaticBackground";

interface Props {
  children: React.ReactNode;
}

const AppLayout = ({ children }: Props) => {
  const router = useRouter();
  const { loggingOut, user, setUser, setNavButtonsVisable } =
    useGlobalContext();
  const loading = useUser(user, setUser);
  const [showNavbar, setShowNavbar] = useState(false);
  const [modal, setModal] = useState(false);

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

  useEffect(() => {
    if (!loading && user?.username && !user?.avatar) {
      setModal(true);
    }
  }, [loading, modal, user]);

  return (
    <>
      <style jsx>{`
        @media (min-width: 2024px) {
          div > div {
            width: 1600px;
          }
        }
      `}</style>
      {!loading && !user?.avatar && <ToggleDarkModeButton />}
      {loading || loggingOut ? (
        <div className="h-screen w-screen">
          <Loading />
        </div>
      ) : (
        <>
          <StaticBackground showNavbar={showNavbar} user={user}>
            <UpdateAvatarModal modal={modal} setModal={setModal} />
            {user && !user.username ? (
              <OAuthSetUsername />
            ) : (
              (!user || (user && user.avatar)) && (
                <div
                  className="absolute top-0 left-0 w-full min-h-screen h-full flex justify-center overflow-y-auto"
                  onClick={() => setNavButtonsVisable(false)}
                >
                  {showNavbar && !loading && (
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
        </>
      )}
    </>
  );
};

export default AppLayout;
