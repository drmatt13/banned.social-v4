import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

// context
import { useGlobalContext } from "@/context/globalContext";

// data
import avatarOrder from "@/data/avatarOrder";
import avatarList from "@/data/avatarList";

// libaries
import processService from "@/lib/processService";

const SelectAvatar = ({ avatar, setAvatar, loading, setLoading }: any) => {
  const { user, setUser, setModal } = useGlobalContext();

  const temp = useCallback(() => {
    setUser({ ...user, avatar: 4 } as any);
    setModal("");
  }, [setModal, setUser, user]);

  const updateAvatar = useCallback(async () => {}, []);

  useEffect(() => {
    setAvatar(
      avatar
        ? avatar
        : user?.avatar
        ? user.avatar
        : avatarOrder[0]?.split(".")[0]
    );
  }, [avatar, setAvatar, user?.avatar]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 px-3 my-2 overflow-auto">
        <div className="h-0 grid grid-cols-6 gap-2 pt-1 [&>div:last-of-type]:mb-3">
          {avatarOrder.map((img) => (
            <div key={img.split(".")[0]}>
              <div className="h-full w-full select-none">
                <div
                  className="flex justify-center items-center group cursor-pointer"
                  onClick={() => setAvatar(img.split(".")[0])}
                >
                  <div
                    className={`${
                      img.split(".")[0] === avatar && "scale-[.8] ease-in"
                    } group-hover:shadow-2xl ease-out duration-100 transition-scale`}
                  >
                    <Image
                      alt={img.split(".")[0]!}
                      src={`/images/avatars-mini/${img.split(".")[0]}.jpg`}
                      blurDataURL={`data:image/jpg;base64, ${
                        avatarList[img.split(".")[0]!]
                      }`}
                      placeholder="blur"
                      width={80}
                      height={80}
                      className={`${
                        img.split(".")[0] === avatar &&
                        "ring-4 sm:ring-[6px] ring-blue-500 dark:ring-blue-600"
                      } object-cover aspect-square bg-black rounded-lg`}
                      style={{
                        boxShadow:
                          img.split(".")[0] !== avatar
                            ? "rgba(50, 50, 93, 0.5) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
                            : undefined,
                      }}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 mx-2 mb-2 py-2 rounded-full"
        onClick={updateAvatar}
      >
        Select Avatar
      </button>
    </div>
  );
};

export default SelectAvatar;
