import { Suspense } from "react";
import dynamic from "next/dynamic";

// components
import Loading from "./Loading";

// context
import { useGlobalContext } from "@/context/globalContext";

//  modals
const UpdateAvatar = dynamic(
  () => import("@/components/modal components/UpdateAvatar"),
  {
    suspense: true,
  }
);

const Modal = () => {
  const { user, modal, setModal } = useGlobalContext();

  return (
    <>
      <div
        className={`${
          user?.avatar
            ? "dark:bg-black/20"
            : "bg-black/[15%] dark:bg-transparent"
        } z-10 fixed h-screen overflow-y-auto w-screen top-0 left-0 text-black`}
      >
        <div className="relative max-h-[700px] h-[70vh] min-h-[420px] mt-20 flex justify-center items-center">
          <div
            className="absolute h-full w-full"
            onClick={() => user?.avatar && setModal("")}
          />
          <div className="z-10 w-full flex justify-center">
            <Suspense fallback={<Loading />}>
              <div className="overflow-hidden relative border border-gray-300 dark:border-gray-500 shadow-lg rounded-2xl bg-white/75 dark:bg-white/50 /dark:backdrop-blur w-[95%] max-w-[500px]">
                {modal === "update avatar" && user && <UpdateAvatar />}
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
