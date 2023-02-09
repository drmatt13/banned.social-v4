/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import avatarList from "@/data/avatarList";

// context
import useGlobalContext from "@/context/globalContext";

// modal
import UpdateAvatarModal from "@/modals/UpdateAvatarModal";

const PostButton = () => {
  const { user } = useGlobalContext();
  const [post, setPost] = useState("");
  const [modal, setModal] = useState(false);

  return (
    <>
      {" "}
      <style jsx>{`
    @media (max-width: 535px) {
    .bg-light-secondary {
      border-radius: 0;
    }
  `}</style>
      <UpdateAvatarModal modal={modal} setModal={setModal} />
      <div className="w-full text-sm flex bg-light-secondary dark:bg-dark-secondary rounded-lg px-4 py-3 mb-5 border dark:border-dark-border shadow-sm dark:shadow-dark-border select-none">
        <div className="overflow-hidden mr-3 rounded-full border border-light-border dark:border-white/25 cursor-pointer">
          <img
            className="h-10 w-10 hover:brightness-[98%]"
            src={
              avatarList[user?.avatar!]
                ? `data:image/jpg;base64, ${avatarList[user?.avatar!]}`
                : user?.avatar
            }
            alt={user?.avatar}
          />
        </div>
        <div
          onClick={() => setModal(true)}
          className="relative flex-1 h-10 rounded-full bg-light-primary dark:bg-dark-form border dark:border-gray-900/50 hover:bg-zinc-200 dark:hover:bg-white/25 cursor-pointer hover:transition-colors hover:duration-200 ease-out group"
        >
          <div className="absolute h-full w-full top-0 left-0 flex items-center ml-4 text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white hover:transition-colors hover:duration-200 ease-out">
            What&apos;s on your mind,{" "}
            {user!.username[0]?.toUpperCase() + user!.username!.substring(1)}?
          </div>
        </div>
      </div>
    </>
  );
};

export default PostButton;
