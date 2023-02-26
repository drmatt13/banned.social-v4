import axios from "axios";
import type ServiceBody from "@/types/serviceBody";
import type ServiceResults from "@/types/serviceResults";
import type Service from "@/types/service";

export async function processService<T extends Service>(
  service: T,
  body: ServiceBody<T>,
  controller?: AbortController
): Promise<ServiceResults<T>> {
  try {
    const res = await axios.post(
      `/api/eventbus`,
      {
        service,
        signal: controller?.signal,
        ...body,
      },
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw new Error("Server error");
  }
}

export const serviceError = {
  EmailAlreadyExists: "Email already exists",
  InvalidCredentials: "Invalid Credentials",
  InvalidUserId: "Invalid user_id",
  InvalidForm: "Invalid form",
  InvalidEmail: "Invalid email",
  InvalidRequest: "Invalid request",
  FailedToCreateUser: "Failed to create user",
  FailedToCreatePost: "Failed to create post",
  FailedToUpdateUser: "Failed to update user",
  FailedToUploadImage: "Failed to upload image",
  FailedToGetUser: "Failed to get user",
  FailedToGetPosts: "Failed to get posts",
  FailedToFetchOg: "Failed to fetch og",
  NoMorePosts: "No more posts",
  Unauthorized: "Unauthorized",
  UsernameAlreadyExists: "Username already exists",
  ServerError: "Server Error",
  UnknownError: "Unknown Error",
} as const;

export default processService;
