import { useCallback } from "react";

// context
import { useGlobalContext } from "@/context/globalContext";

const OAuthSetUsername = () => {
  const { user, setUser } = useGlobalContext();

  const updateUser = useCallback(() => {
    setUser({ ...user!, username: "test" });
  }, [setUser, user]);

  return <button onClick={updateUser}>updateUsername</button>;
};

export default OAuthSetUsername;
