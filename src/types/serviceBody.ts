import type FeedUser from "./feedUser";
import Og from "./og";
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
  prevAvatar?: string;
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

// comments_db
interface CreateComment {
  post_id: string;
  content?: string;
  image?: string;
  og?: Og;
}

interface GetComments {
  post_id: string;
  page: number;
  limit: number;
}

// subcomments_db
interface CreateSubComment {
  comment_id: string;
  content?: string;
  image?: string;
  og?: Og;
}

interface GetSubComments {
  comment_id: string;
  // page: number;
  // limit: number;
}

// likes_db
interface CreateLike {
  post_id?: string;
  comment_id?: string;
  subcomment_id?: string;
}

interface DelectLike {
  post_id?: string;
  comment_id?: string;
  subcomment_id?: string;
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
    : // comments_db
    T extends "create comment"
    ? CreateComment
    : T extends "get comments"
    ? GetComments
    : // subcomments_db
    T extends "create subcomment"
    ? CreateSubComment
    : T extends "get subcomments"
    ? GetSubComments
    : // likes_db
    T extends "create like"
    ? CreateLike
    : T extends "delete like"
    ? DelectLike
    : never;

export default ServiceBody;
