// import { useCallback, useEffect, useRef, useState } from "react";

// components
import UserAvatarMini from "@/components/UserAvatarMini";

// context
import useOnlineFriendsContext from "@/context/onlineFriendsContext";

// layouts
import ContactsVanishingScroll from "@/layouts/ContactsVanishingScroll";

// types
import type User from "@/types/user";

const Contacts = () => {
  const { onlineFriends } = useOnlineFriendsContext();

  return (
    <ContactsVanishingScroll>
      <div className="flex flex-col mb-1.5">
        <div className="text-md px-2 mb-3 font-bold text-black/80 dark:text-white/90">
          Contacts
        </div>
        {onlineFriends.map((user, i) => (
          <div
            key={user?._id || i}
            className="flex items-center px-2 py-1.5 rounded-l-lg cursor-pointer hover:bg-light-secondary hover:dark:bg-dark-secondary transition-colors ease-out duration-150"
          >
            <UserAvatarMini id="0" user={{ avatar: user?.avatar } as User} />
            <div>{user?.username}</div>
          </div>
        ))}
      </div>
    </ContactsVanishingScroll>
  );
};

export default Contacts;
