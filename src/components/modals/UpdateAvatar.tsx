import { useCallback } from "react";

// context
import { useGlobalContext } from "@/context/globalContext";

const UpdateAvatar = () => {
  const { user, setUser, setModal } = useGlobalContext();

  const temp = useCallback(() => {
    setUser({ ...user, avatar: 4 } as any);
    setModal("");
  }, [setModal, setUser, user]);

  return (
    <div className="h-[350px]">
      <button onClick={temp}>TEST</button>
    </div>
  );
};

export default UpdateAvatar;
