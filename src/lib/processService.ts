import axios from "axios";
import type ServiceBody from "@/types/serviceBody";
import type ServiceResults from "@/types/serviceResults";
import type Service from "@/types/service";

const processService = async (
  service: Service,
  body?: ServiceBody
): Promise<ServiceResults> => {
  try {
    const res = await axios.post(
      `/api/eventbus`,
      {
        service,
        ...body,
      },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    return { error: "Server Error", success: false };
  }
};

export default processService;
