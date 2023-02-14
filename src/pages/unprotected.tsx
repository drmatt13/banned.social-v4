import { useEffect, useCallback } from "react";

// libraries
import processService from "@/lib/processService";

const Unprotected = () => {
  const test = async () => {
    try {
      const data = await processService("update avatar", {
        _id: "",
        avatar: "",
      });

      data.error === "";
    } catch (error) {}
  };

  return <></>;
};

export default Unprotected;
