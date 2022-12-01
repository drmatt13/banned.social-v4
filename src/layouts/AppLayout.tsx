import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

// components
import Navbar from "@/components/Navbar";
import UnprotectedNavbar from "@/components/UnprotectedNavbar";
import ToggleDarkModeButton from "@/components/ToggleDarkModeButton";
import OAuthSetUsername from "@/components/OAuthSetUsername";
import SignupSetAvatar from "@/components/SignupSetAvatar";

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
      <>
        {!showNavbar && !loading && !user && <ToggleDarkModeButton />}
        {loading || loggingOut ? (
          <div className="w-full text-center">
            <div>loading</div>
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
              {user && !user.username ? (
                <OAuthSetUsername />
              ) : user && !user.avatar ? (
                <SignupSetAvatar />
              ) : (
                children
              )}
            </StaticBackground>
          </>
        )}
      </>
    </>
  );
};

export default AppLayout;
