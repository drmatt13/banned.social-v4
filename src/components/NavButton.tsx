import { useRef } from "react";

// context
import { useGlobalContext } from "@/context/globalContext";

const NavButton = ({ className, onClick }: any) => {
  const { mobile, darkMode } = useGlobalContext();

  return (
    <>
      <style jsx>{`
        @media (max-height: 700px) {
          .text-md {
            font-size: 0.75rem;
          }
        }
        @media (max-height: 600px) {
          .text-md {
            font-size: 0.6rem;
          }
        }
        @media (max-height: 500px) {
          .text-md {
            font-size: 0.5rem;
          }
        }
        .light-hover:hover {
          box-shadow: 0 0 1em black;
          background-color: black;
          color: white;
        }
        .light-active:active {
          box-shadow: 0 0 1em black;
          background-color: black;
          color: white;
        }
        .dark-hover:hover {
          box-shadow: 0 0 1em white;
          background-color: white;
          color: black;
        }
        .dark-active:active {
          box-shadow: 0 0 1em white;
          background-color: white;
          color: black;
        }
      `}</style>
      <div
        className={`
        opacity-0
          nav-button
          shadow-xl
          bg-gray-700
          dark:bg-white
          transition
          ease-linear
          cursor-pointer 
          absolute
          h-full 
          w-full
          rounded-full
        `}
        style={
          {
            // animationDirection: "reverse",
            // animationFillMode: "forwards",
            // animationPlayState: "paused",
          }
        }
      >
        <i
          onClick={onClick}
          className={`
            ${className}
            ${
              mobile
                ? darkMode
                  ? `
            dark-active
            `
                  : `
            light-active
            `
                : darkMode
                ? `
            dark-hover
            `
                : `
            light-hover
            `
            }
            h-full 
            w-full 
            flex 
            justify-center 
            items-center 
            text-md
            rounded-full
            transition-all
            ease-linear
            shadow-xl
            text-white/80
            dark:text-black/90
          `}
        />
      </div>
    </>
  );
};

export default NavButton;
