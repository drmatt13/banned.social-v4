import React, { Dispatch, SetStateAction } from "react";

// context
import useModalContext from "@/context/modalContext";
import useGlabalContext from "@/context/globalContext";

interface Props {
  setSettingsOptions: Dispatch<SetStateAction<"settings" | "update avatar">>;
}

const Settings = ({ setSettingsOptions }: Props) => {
  const { logout, toggleDarkMode, darkMode } = useGlabalContext();
  const { setModal } = useModalContext();

  return (
    <>
      <div className="h-64 p-4">
        <button
          onClick={() => setSettingsOptions("update avatar")}
          className="p-2 bg-gray-400 m-2 border"
        >
          change profile picture
        </button>
        <button onClick={toggleDarkMode} className="p-2 bg-gray-400 m-2 border">
          darkmode
        </button>
        <button onClick={logout} className="p-2 bg-gray-400 m-2 border">
          logout
        </button>
      </div>
    </>
  );
};

export default Settings;
