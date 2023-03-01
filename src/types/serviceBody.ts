import type FeedUser from "./feedUser";
import type Post from "./post";

type _Overwrite<T, U> = U extends object
  ? { [K in keyof T]: K extends keyof U ? _Overwrite<T[K], U[K]> : T[K] } & U
  : U;

type ExpandRecursively<T> = T extends Function
  ? T
  : T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

type Overwrite<T, U> = ExpandRecursively<_Overwrite<T, U>>;

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

interface UpdateFeedCache {
  users: string[];
}

// post_db
interface CreatePost {
  sharedPost_id?: Post;
  post: Overwrite<Post, { image: string | undefined }>;
}

interface GetPosts {
  recipient_id?: string;
  page: number;
  limit: number;
  type: "global" | "friends" | "user";
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
    : T extends "update feed cache"
    ? UpdateFeedCache
    : // post_db
    T extends "create post"
    ? CreatePost
    : T extends "get posts"
    ? GetPosts
    : never;

export default ServiceBody;
