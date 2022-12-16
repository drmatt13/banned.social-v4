import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// components
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import UnprotectedNavbar from "@/components/UnprotectedNavbar";
import ToggleDarkModeButton from "@/components/ToggleDarkModeButton";
import OAuthSetUsername from "@/components/OAuthSetUsername";
import Modal from "@/components/Modal";

// context
import { useGlobalContext } from "@/context/globalContext";

// hooks
import useUser from "@/hooks/useUser";

// layouts
import StaticBackground from "@/layouts/StaticBackground";

interface Props {
  children: React.ReactNode;
}

const AppLayout = ({ children }: Props) => {
  const router = useRouter();
  const { loggingOut, modal, setModal, user, setUser } = useGlobalContext();
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

  useEffect(() => {
    console.log(user);
    if (user && user.username && !user.avatar) {
      setModal("update avatar");
    }
  }, [setModal, user]);

  return (
    <>
      {!loading && !user?.avatar && <ToggleDarkModeButton />}
      {loading || loggingOut ? (
        <div className="h-screen w-screen">
          <Loading />
        </div>
      ) : (
        <>
          {showNavbar && !loading && (
            <>
              {user ? (
                user.username && user.avatar && <Navbar />
              ) : (
                <UnprotectedNavbar />
              )}
            </>
          )}
          <StaticBackground showNavbar={showNavbar} user={user}>
            {modal && <Modal />}
            {user && !user.username ? (
              <OAuthSetUsername />
            ) : (
              (!user || (user && user.avatar)) && children
            )}
          </StaticBackground>
        </>
      )}
    </>
  );
};

export default AppLayout;
