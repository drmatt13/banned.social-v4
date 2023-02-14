// no_db
interface GetOg {
  url: string;
}

// user_db
interface AddUsername {
  _id: string;
  username: string;
}

interface GetUser {
  _id?: string;
}

interface Login {
  username: string;
  password: string;
}

interface Oauth {
  provider: string;
  sessionToken?: string;
}

interface Register {
  username: string;
  email: string;
  password: string;
}

interface UpdateAvatar {
  avatar: string;
}

type ServiceBody<T> =
  // no_db
  T extends "get og"
    ? GetOg
    : // user_db
    T extends "add username"
    ? AddUsername
    : T extends "get user"
    ? GetUser | undefined
    : T extends "login"
    ? Login
    : T extends "oauth"
    ? Oauth
    : T extends "register"
    ? Register
    : T extends "update avatar"
    ? UpdateAvatar
    : never;

export default ServiceBody;
