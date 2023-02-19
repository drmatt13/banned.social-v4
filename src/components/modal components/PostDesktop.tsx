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
        <div className="relative w-fill text-center mt-2 mb-3 border-b border-black/[15%] dark:border-black/20 ">
          <div className="font-bold text-lg pb-2">Create post</div>
          <div
            className="absolute top-0 right-2 flex justify-center items-center"
            onClick={() => setModal(false)}
          >
            <div className="bg-neutral-300/90 dark:bg-neutral-100/80 hover:bg-red-400 dark:hover:bg-white h-7 w-7 rounded-full flex justify-center items-center cursor-pointer border hover:border-none dark:border-black/[12.5%] shadow transition-colors ease-out">
              <i className="fas fa-times text text-gray-800 w-5 h-5 flex justify-center items-center"></i>
            </div>
          </div>
        </div>
        <div className="pb-1 px-3 flex">
          <div className="overflow-hidden mr-3 rounded-full border border-light-border dark:border-white/25 cursor-pointer select-none">
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
