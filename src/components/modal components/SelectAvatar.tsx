import { useState, useCallback } from "react";
import Image from "next/image";

// context
import { useGlobalContext } from "@/context/globalContext";

const SelectAvatar = ({ avatar, setAvatar, loading, setLoading }: any) => {
  const { user, setUser, setModal } = useGlobalContext();

  const temp = useCallback(() => {
    setUser({ ...user, avatar: 4 } as any);
    setModal("");
  }, [setModal, setUser, user]);

  const [avatars] = useState([
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
    "9.jpg",
    "10.jpg",
    "11.jpg",
    "12.jpg",
    "13.jpg",
    "14.jpg",
    "15.jpg",
    "16.jpg",
    "17.jpg",
    "18.jpg",
    "19.jpg",
    "20.jpg",
    "21.jpg",
    "22.jpg",
    "23.jpg",
    "24.jpg",
    "25.jpg",
    "26.jpg",
    "27.jpg",
    "28.jpg",
    "29.jpg",
    "30.jpg",
    "31.jpg",
    "32.jpg",
  ]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 px-3 my-2 overflow-auto">
        <div className="h-0 grid grid-cols-6 gap-2 pt-1 [&>div:last-of-type]:mb-3">
          {avatars.map((avatar, index) => (
            <div key={index}>
              <div className="h-full w-full">
                <div className="flex justify-center items-center group cursor-pointer">
                  <Image
                    src={`/images/avatars/${avatar}`}
                    alt="avatar"
                    // layout="fill"
                    width={80}
                    height={80}
                    objectFit="cover"
                    className="bg-white aspect-square group-hover:scale-90 transition-transform duration-300 ease-out rounded-lg"
                    style={{
                      boxShadow:
                        "rgba(50, 50, 93, 0.5) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 mx-2 mb-2 py-2 rounded-full"
        onClick={temp}
      >
        Select Avatar
      </button>
    </div>
  );
};

export default SelectAvatar;
