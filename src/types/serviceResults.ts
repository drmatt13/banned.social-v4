import type User from "@/types/user";
import { serviceError } from "@/lib/processService";

type UniversalTypeError =
  | typeof serviceError.Unauthorized
  | typeof serviceError.ServerError
  | typeof serviceError.UnknownError;

type Type<T> =
  // no_db
  T extends "get og"
    ? {
        og?: any;
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
          | UniversalTypeError;
      }
    : never;

type ServiceResults<T> = Type<T> & {
  success: boolean;
};

export default ServiceResults;
