import { useState } from "react";

// components
import SelectAvatar from "@/components/modal components/SelectAvatar";
import UploadImage from "@/components/modal components/UploadImage";

// context
import useGlobalContext from "@/context/globalContext";

const UpdateAvatar = () => {
  const { user } = useGlobalContext();
  const [tab, setTab] = useState<"select avatar" | "upload image">(
    "select avatar"
  );
  const [avatar, setAvatar] = useState(user?.avatar);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-[350px] flex flex-col text-sm">
      <div className="flex-shrink-0 flex h-10 border-b border-black/25 select-none">
        <button
          className={`${
            tab === "select avatar"
              ? loading
                ? "border-light-border dark:border-dark-border bg-gray-500/40 dark:bg-dark-form text-gray-600 dark:text-gray-300 cursor-not-allowed"
                : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
              : loading
              ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300 cursor-not-allowed"
              : "bg-light-secondary dark:bg-white/40 hover:bg-neutral-300 dark:hover:bg-white/60 cursor-pointer"
          } flex-1 flex justify-center items-center`}
          onClick={() => setTab("select avatar")}
          disabled={loading}
        >
          Select Avatar
        </button>
        <button
          className={`${
            tab === "upload image"
              ? loading
                ? "border-light-border dark:border-dark-border bg-gray-500/40 dark:bg-dark-form text-gray-600 dark:text-gray-300 cursor-not-allowed"
                : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 cursor-pointer"
              : loading
              ? "border-light-border dark:border-dark-border bg-light-secondary dark:bg-dark-accent text-gray-600 dark:text-gray-300 cursor-not-allowed"
              : "bg-light-secondary dark:bg-white/40 hover:bg-neutral-300 dark:hover:bg-white/60 cursor-pointer"
          } flex-1 flex justify-center items-center`}
          onClick={() => setTab("upload image")}
          disabled={loading}
        >
          Upload Image
        </button>
      </div>
      <div className="flex-1">
        {tab === "select avatar" && (
          <SelectAvatar
            avatar={avatar}
            setAvatar={setAvatar}
            loading={loading}
            setLoading={setLoading}
          />
        )}
        {tab === "upload image" && (
          <UploadImage
            image={image}
            setImage={setImage}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateAvatar;
