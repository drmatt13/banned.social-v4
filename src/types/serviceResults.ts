import { serviceError } from "@/lib/processService";

// types
import type User from "@/types/user";
import type Og from "@/types/og";
import type Post from "@/types/post";

type UniversalTypeError =
  | typeof serviceError.Unauthorized
  | typeof serviceError.ServerError
  | typeof serviceError.UnknownError;

type Type<T> =
  // no_db
  T extends "get og"
    ? {
        og?: Og;
        error?: typeof serviceError.FailedToFetchOg | UniversalTypeError;
      }
    : // user_db
    T extends "add username"
    ? {
        user?: User;
        error?:
          | typeof serviceError.UsernameAlreadyExists
          | typeof serviceError.FailedToCreateUser
          | typeof serviceError.FailedToUpdateUser
          | UniversalTypeError;
      }
    : T extends "get user"
    ? {
        user?: User;
        error?:
          | typeof serviceError.InvalidUserId
          | typeof serviceError.FailedToGetUser
          | UniversalTypeError;
      }
    : T extends "login"
    ? {
        token?: string;
        error?:
          | typeof serviceError.InvalidCredentials
          | typeof serviceError.FailedToUpdateUser
          | UniversalTypeError;
      }
    : T extends "oauth"
    ? {
        token?: string;
        error?: typeof serviceError.FailedToCreateUser | UniversalTypeError;
      }
    : T extends "register"
    ? {
        token?: string;
        error?:
          | typeof serviceError.InvalidForm
          | typeof serviceError.InvalidEmail
          | typeof serviceError.UsernameAlreadyExists
          | typeof serviceError.EmailAlreadyExists
          | UniversalTypeError;
      }
    : T extends "update avatar"
    ? {
        user?: User;
        error?:
          | typeof serviceError.InvalidUserId
          | typeof serviceError.FailedToUpdateUser
          | typeof serviceError.FailedToUploadImage
          | UniversalTypeError;
      }
    : // post_db
    T extends "create post"
    ? {
        post?: Post;
        error?:
          | typeof serviceError.FailedToCreatePost
          | typeof serviceError.FailedToUploadImage
          | UniversalTypeError;
      }
    : T extends "get posts"
    ? {
        posts?: Post[];
        error?:
          | typeof serviceError.FailedToGetPosts
          | typeof serviceError.NoMorePosts
          | typeof serviceError.InvalidRequest
          | UniversalTypeError;
      }
    : never;

type ServiceResults<T> = Type<T> & {
  success: boolean;
};

export default ServiceResults;
