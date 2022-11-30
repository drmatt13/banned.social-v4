import axios from "axios";
import type User from "../types/user";

interface ServiceResults {
  user?: User;
  token?: string;
  success?: boolean;
  error?: string;
}

const processService = async (
  service: string,
  data: object = {}
): Promise<ServiceResults> => {
  try {
    const res = await axios.post(
      `/api/eventbus`,
      {
        service,
        ...data,
      },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    return { error: "Server Error", success: false };
  }
};

export default processService;
