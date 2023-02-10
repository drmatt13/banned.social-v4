import { useCallback, useEffect } from "react";
import Image from "next/image";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";

// data
import avatarOrder from "@/data/avatarOrder";
import avatarList from "@/data/avatarList";

// libaries
import { processService, serviceError } from "@/lib/processService";

const SelectAvatar = ({
  avatar,
  setAvatar,
  loading,
  setLoading,
}: {
  avatar: string | undefined;
  setAvatar: (avatar: string | undefined) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const { user, setUser, logout } = useGlobalContext();
  const { setModal } = useModalContext();

  const updateAvatar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await processService("update avatar", {
        avatar,
      });
      const { user, success, error } = data;
      if (success && user) {
        setUser(user);
        setModal(false);
      } else {
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
    // console.log("avatar", );
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
                      src={`data:image/jpg;base64, ${avatarList[img!]}`}
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
          loading || user?.avatar === avatar || !avatar
            ? `${
                user?.avatar
                  ? "bg-stone-500/20 dark:bg-neutral-500/30 text-black/80"
                  : "bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300"
              } border-light-border dark:border-dark-border cursor-not-allowed`
            : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
        }  mx-2 mb-2 py-2 rounded-full select-none`}
        onClick={updateAvatar}
        disabled={loading || user?.avatar === avatar || !avatar}
      >
        {user?.avatar ? "Update Avatar" : "Select Avatar"}
      </button>
    </div>
  );
};

export default SelectAvatar;
