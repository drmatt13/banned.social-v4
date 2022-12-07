import { useCallback, useState } from "react";

// components
import SelectAvatar from "@/components/modal components/SelectAvatar";
import UploadImage from "@/components/modal components/UploadImage";

const UpdateAvatar = () => {
  const [tab, setTab] = useState<"select avatar" | "upload image">(
    "select avatar"
  );
  const [avatar, setAvatar] = useState(1);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-[350px] flex flex-col text-sm">
      <div className="flex h-10 border-b border-black/25 select-none">
        <div
          className={`${
            tab === "select avatar"
              ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500"
              : "bg-light-secondary dark:bg-white/40 hover:bg-neutral-300 dark:hover:bg-white/60"
          } flex-1 flex justify-center items-center cursor-pointer`}
          onClick={() => setTab("select avatar")}
        >
          Select Avatar
        </div>
        {/* <div className="h-full w-[1px] bg-black"></div> */}
        <div
          className={`${
            tab === "upload image"
              ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500"
              : "bg-light-secondary dark:bg-white/40 hover:bg-neutral-300 dark:hover:bg-white/60"
          } flex-1 flex justify-center items-center cursor-pointer`}
          onClick={() => setTab("upload image")}
        >
          Upload Image
        </div>
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
            image={avatar}
            setImage={setAvatar}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateAvatar;
