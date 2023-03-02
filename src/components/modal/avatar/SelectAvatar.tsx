import { useCallback, useEffect } from "react";
import Image from "next/image";

// components
import BigSubmitButton from "@/components/BigSubmitButton";

// context
import useGlobalContext from "@/context/globalContext";
import useModalContext from "@/context/modalContext";

// data
import avatarOrder from "@/data/avatarOrder";
import avatarList from "@/data/avatarList";

// libaries
import processService from "@/lib/processService";

// styles
import styles from "@/styles/scrollbar.module.scss";

const SelectAvatar = ({
  avatar,
  setAvatar,
}: {
  avatar: string | undefined;
  setAvatar: (avatar: string | undefined) => void;
}) => {
  const { user, setUser, logout, darkMode, mobile, setFeedCache } =
    useGlobalContext();
  const { setModal, loading, setLoading } = useModalContext();

  const updateAvatar = useCallback(async () => {
    if (!avatar) return;
    try {
      setLoading(true);
      const data = await processService("update avatar", {
        avatar,
      });
      const { user, success, error } = data;
      if (success && user) {
        setFeedCache((prev) => {
          return {
            ...prev,
            [user._id]: { avatar: user.avatar, username: user.username },
          };
        });
        setUser(user);
        setModal(false);
        setLoading(false);
      } else {
        if (error === "Unauthorized") {
          throw new Error("Unauthorized");
        } else if (error === "Failed to update user") {
          throw new Error("Failed to update user");
        } else {
          throw new Error("Server error");
        }
      }
    } catch (error) {
      alert("Server error");
      setLoading(false);
      logout();
    }
  }, [avatar, logout, setFeedCache, setLoading, setModal, setUser]);

  useEffect(() => {
    setAvatar(avatar ? avatar : user?.avatar ? user.avatar : undefined);
  }, [avatar, setAvatar, user?.avatar]);

  return (
    <div
      className={`${
        mobile ? "" : darkMode ? styles.darkScroll : styles.lightScroll
      } h-full flex flex-col`}
    >
      <div className={`${!mobile && "mr-2"} flex-1 px-3 my-2 overflow-auto`}>
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
      <BigSubmitButton
        disabled={loading || user?.avatar === avatar || !avatar}
        onClick={updateAvatar}
        value={user?.avatar ? "Update Avatar" : "Select Avatar"}
      />
    </div>
  );
};

export default SelectAvatar;
