/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";

// data
import avatarList from "@/data/avatarList";

// types
import type User from "@/types/user";
import type FeedCache from "@/types/feedCache";

type FeedUser = FeedCache[keyof User] | undefined;

interface Props {
  id: string;
  user: FeedUser;
}

const UserAvatarMini = ({ id, user }: Props) => {
  return (
    <>
      <div className="h-10 w-10 overflow-hidden mr-3 rounded-full border border-light-border dark:border-white/25 cursor-pointer select-none">
        <Link href={id}>
          <img
            className="h-full w-full hover:brightness-[98%] object-cover"
            src={
              avatarList[user?.avatar!]
                ? `data:image/jpg;base64, ${avatarList[user?.avatar!]}`
                : user?.avatar
            }
            alt={user?.avatar}
            loading="lazy"
          />
        </Link>
      </div>
    </>
  );
};

export default UserAvatarMini;
