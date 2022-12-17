import { useCallback, useEffect } from "react";
import serviceError from "@/types/serviceError";
import Image from "next/image";

// context
import { useGlobalContext } from "@/context/globalContext";

// data
import avatarOrder from "@/data/avatarOrder";
import avatarList from "@/data/avatarList";

// libaries
import processService from "@/lib/processService";

const SelectAvatar = ({ avatar, setAvatar, loading, setLoading }: any) => {
  const { user, setUser, setModal, logout } = useGlobalContext();

  const updateAvatar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await processService("update avatar", {
        avatar,
      });
      const { user, success, error } = data;
      if (success && user) {
        setUser(user);
        setModal(undefined);
      } else if (error) {
        if (error === serviceError.Unauthorized) {
          throw new Error(serviceError.Unauthorized);
        } else if (error === serviceError.FailedToUpdateUser) {
          throw new Error(serviceError.FailedToUpdateUser);
        } else {
          throw new Error(serviceError.ServerError);
        }
      }
    } catch (error) {
      alert("Server error");
      setLoading(false);
      logout();
    }
  }, [avatar, logout, setLoading, setModal, setUser]);

  useEffect(() => {
    setAvatar(avatar ? avatar : user?.avatar ? user.avatar : undefined);
  }, [avatar, setAvatar, user?.avatar]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 px-3 my-2 overflow-auto">
        <div className="h-0 grid grid-cols-6 gap-2 pt-1 [&>div:last-of-type]:mb-3">
          {avatarOrder.map((img) => (
            <div key={img}>
              <div className="h-full w-full select-none">
                <button
                  className={`${
                    !loading ? "cursor-pointer" : "cursor-not-allowed"
                  } flex justify-center items-center group`}
                  onClick={() => setAvatar(img)}
                  disabled={loading}
                >
                  <div
                    className={`${img === avatar && "scale-[.8] ease-in"} ${
                      !loading && "group-hover:shadow-2xl"
                    } relative ease-out duration-100 transition-scale`}
                  >
                    <div
                      className={`${
                        loading &&
                        img !== avatar &&
                        "bg-black/[12.5%] dark:bg-black/25"
                      } absolute top-0 left-0 h-full w-full rounded-lg pointer-events-none transition-colors ease-in`}
                    />
                    <Image
                      alt={img!}
                      src={`/images/avatars-mini/${img}.jpg`}
                      blurDataURL={`data:image/jpg;base64, ${avatarList[img!]}`}
                      placeholder="blur"
                      width={80}
                      height={80}
                      className={`${
                        img === avatar &&
                        "ring-4 sm:ring-[6px] ring-blue-500 dark:ring-blue-600"
                      } object-cover aspect-square bg-black/20 dark:bg-black/50 rounded-lg`}
                      style={{
                        boxShadow:
                          img !== avatar
                            ? "rgba(50, 50, 93, 0.5) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
                            : undefined,
                      }}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className={`${
          loading || !avatar
            ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300 cursor-not-allowed"
            : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
        }  mx-2 mb-2 py-2 rounded-full`}
        onClick={updateAvatar}
        disabled={loading || !avatar}
      >
        Select Avatar
      </button>
    </div>
  );
};

export default SelectAvatar;
