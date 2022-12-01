import { useCallback } from "react";

// context
import { useGlobalContext } from "@/context/globalContext";

const SignupSetAvatar = () => {
  const { user, setUser } = useGlobalContext();

  const updateUser = useCallback(() => {
    setUser({ ...user!, avatar: 2 });
  }, [setUser, user]);

  return <button onClick={updateUser}>updateAvatar</button>;
};

export default SignupSetAvatar;
