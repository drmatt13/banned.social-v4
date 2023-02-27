/* eslint-disable @next/next/no-img-element */

// data
import avatarList from "@/data/avatarList";

// types
import type User from "@/types/user";
import type FeedCache from "@/types/feedCache";

type FeedUser = FeedCache[keyof User] | undefined;

interface Props {
  user: FeedUser;
}

const UserAvatarMini = ({ user }: Props) => {
  return (
    <>
      <div className="overflow-hidden mr-3 rounded-full border border-light-border dark:border-white/25 cursor-pointer">
        <img
          className="h-10 w-10 hover:brightness-[98%] select-none"
          src={
            avatarList[user?.avatar!]
              ? `data:image/jpg;base64, ${avatarList[user?.avatar!]}`
              : user?.avatar
          }
          alt={user?.avatar}
          loading="lazy"
        />
      </div>
    </>
  );
};

export default UserAvatarMini;
