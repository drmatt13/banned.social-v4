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
  extraSmall?: boolean;
  superSmall?: boolean;
}

const UserAvatarMini = ({ id, user, extraSmall, superSmall }: Props) => {
  return (
    <>
      <div
        className={`${
          superSmall
            ? "h-7 w-7"
            : extraSmall
            ? "h-8 w-8 mr-2"
            : "h-10 w-10 mr-3"
        } overflow-hidden rounded-full border border-light-border dark:border-white/25 cursor-pointer select-none`}
      >
        <Link href={id}>
          <img
            className="h-full w-full hover:brightness-[98%] object-cover"
            src={
              avatarList[user?.avatar!]
                ? `data:image/jpg;base64, ${avatarList[user?.avatar!]}`
                : `https://social-media-8434-1348-6435.s3.us-east-1.amazonaws.com/avatars-mini/${user?.avatar}`
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
