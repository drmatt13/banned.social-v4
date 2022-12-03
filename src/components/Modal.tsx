import { Suspense } from "react";
import dynamic from "next/dynamic";

// components
import Loading from "./Loading";

// context
import { useGlobalContext } from "@/context/globalContext";

//  modals
const UpdateAvatar = dynamic(() => import("@/components/modals/UpdateAvatar"), {
  suspense: true,
});

const Modal = () => {
  const { user, modal, setModal } = useGlobalContext();

  return (
    <>
      <div className="z-10 fixed h-screen min-h-[500px] w-screen top-0 left-0 text-black">
        <div
          className={`${user?.avatar && "bg-black/20"} absolute h-full w-full`}
          onClick={() => user?.avatar && setModal("")}
        />
        <div className="z-10 h-full w-full flex justify-center items-center">
          <Suspense fallback={<Loading />}>
            <div className="relative border border-gray-300 dark:border-gray-500 shadow-lg rounded-lg bg-white dark:bg-white/50 dark:backdrop-blur w-[95%] max-w-[500px]">
              {modal === "update avatar" && user && <UpdateAvatar />}
            </div>
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Modal;
