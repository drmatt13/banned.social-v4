import type Post from "./post";

// no_db
interface GetOg {
  url: string;
}

// user_db
interface AddUsername {
  // _id: string;
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

// post_db
interface CreatePost {
  sharedPost_id?: Post;
  post: Post;
}

interface GetPosts {
  page: number;
  limit: number;
  type: "global" | "friends";
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
    : // post_db
    T extends "create post"
    ? CreatePost
    : T extends "get posts"
    ? GetPosts
    : never;

export default ServiceBody;
