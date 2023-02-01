import axios from "axios";
import type ServiceBody from "@/types/serviceBody";
import type ServiceResults from "@/types/serviceResults";
import type Service from "@/types/service";

export const processService = async (
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
    return { error: serviceError.ServerError, success: false };
  }
};

export const serviceError = {
  EmailAlreadyExists: "Email already exists",
  InvalidCredentials: "Invalid Credentials",
  InvalidUserId: "Invalid user_id",
  InvalidForm: "Invalid form",
  InvalidEmail: "Invalid email",
  FailedToCreateUser: "Failed to create user",
  FailedToUpdateUser: "Failed to update user",
  FailedToCreateSession: "Failed to create session",
  Unauthorized: "Unauthorized",
  UserNotFound: "User not found",
  UsernameAlreadyExists: "Username already exists",
  ServerError: "Server Error",
} as const;

export default processService;
