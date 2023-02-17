/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

// components
import BigSubmitButton from "@/components/BigSubmitButton";

// context
import useModalContext from "@/context/modalContext";
import usePostContext from "@/context/postContext";
import useGlobalContext from "@/context/globalContext";

// data
import avatarList from "@/data/avatarList";

const PostDesktop = ({ children, visable }: any) => {
  const { post, setPost } = usePostContext();
  const { modal, setModal } = useModalContext();
  const { user } = useGlobalContext();

  return !visable ? (
    <>{children}</>
  ) : (
    <>
      <div className="flex flex-col">
        <div className="relative w-fill h-14 text-center">
          <div className="py-2 border-b border-black/[15%] dark:border-black/20 font-bold text-lg">
            Create post
          </div>
        </div>
        <div className="pb-1 px-3 flex">
          <div className="overflow-hidden mr-3 rounded-full border border-light-border dark:border-white/25 cursor-pointer">
            <Link href={`/${user?._id}`}>
              <img
                className="h-10 w-10 hover:brightness-[98%]"
                src={
                  avatarList[user?.avatar!]
                    ? `data:image/jpg;base64, ${avatarList[user?.avatar!]}`
                    : user?.avatar
                }
                alt={user?.avatar}
              />
            </Link>
          </div>
          <div>{user?.username}</div>
        </div>
        {children}
        <BigSubmitButton value="Post" disabled={false} onClick={() => {}} />
      </div>
    </>
  );
};

export default PostDesktop;
