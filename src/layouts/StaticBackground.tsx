// context
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context/globalContext";
import type User from "@/types/user";

// styles
import darkStatic from "@/styles/darkStatic.module.scss";
import lightStatic from "@/styles/lightStatic.module.scss";

interface Props {
  children: React.ReactNode;
  showNavbar?: boolean;
  user: User | null;
}

const StaticBackground = ({ children, showNavbar, user }: Props) => {
  const { darkMode, mobile } = useGlobalContext();
  const [viewportHeight, setViewportHeight] = useState(
    window.innerHeight + 150 + "px"
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight + 150 + "px");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return !showNavbar || !user?.avatar || !user.username ? (
    <div
      className={`${
        darkMode ? darkStatic.container : lightStatic.container
      } relative flex flex-col items-center h-screen overflow-hidden animate-fade-in`}
    >
      {!mobile && (
        <div className="absolute top-0 left-0 h-200vh w-full hidden dark:inline">
          <video
            style={
              mobile
                ? {
                    minHeight: viewportHeight,
                    minWidth: viewportHeight,
                    objectPosition: "right",
                    rotate: "90deg",
                    scale: "2",
                    opacity: "0.6",
                  }
                : {
                    minHeight: viewportHeight,
                    opacity: "0.75",
                  }
            }
            className="h-200vh w-full object-cover"
            src="videos/prism-background.mp4"
            autoPlay={true}
            muted={true}
            loop={true}
          ></video>
        </div>
      )}
      <div
        className="absolute top-0 left-0 w-full h-[700px] md:h-[850px] xl:h-[1100px] invert dark:invert-0"
        style={{
          minHeight: viewportHeight,
          background: darkMode
            ? mobile
              ? "radial-gradient(at center center, rgba(51, 51, 51, 0.3) 0%, rgba(0, 0, 0, 0.9) 100%)"
              : "radial-gradient(at center center, rgba(51, 51, 51, 0.50) 0%, rgba(0, 0, 0, 0.6) 100%)"
            : mobile
            ? "radial-gradient(at center center, rgba(29, 29, 29, 0.30) 0%, rgba(5, 5, 5, 0.5) 100%)"
            : "radial-gradient(at center center, rgba(29, 29, 29, 0.75) 0%, rgba(5, 5, 5, 0.7) 100%)",
        }}
      />
      <div className="z-10">{children}</div>
    </div>
  ) : (
    <>{children}</>
  );
};

export default StaticBackground;
