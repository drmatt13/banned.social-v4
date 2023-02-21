import { Dispatch, SetStateAction, useState, useEffect } from "react";

// components
import Settings from "@/components/modal/Settings";
import UpdateAvatar from "@/components/modal/UpdateAvatar";

// context
import { modalContext } from "@/context/modalContext";

// layout
import ModalLayout from "@/layouts/ModalLayout";

interface Props {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
}

const SettingsModal = ({ modal, setModal }: Props) => {
  const [loading, setLoading] = useState(false);
  const [settingsOptions, setSettingsOptions] = useState<
    "settings" | "update avatar"
  >("settings");

  useEffect(() => {
    if (!modal) {
      setSettingsOptions("settings");
    }
  }, [modal, settingsOptions]);

  return (
    <modalContext.Provider value={{ modal, setModal, loading, setLoading }}>
      <ModalLayout>
        <>
          {settingsOptions === "settings" && (
            <Settings setSettingsOptions={setSettingsOptions} />
          )}
          {settingsOptions === "update avatar" && <UpdateAvatar />}
        </>
      </ModalLayout>
    </modalContext.Provider>
  );
};

export default SettingsModal;
