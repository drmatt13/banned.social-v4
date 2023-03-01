import FeedCache from "./feedCache";
import User from "./user";

type FeedUser = FeedCache[keyof User] | undefined;

export default FeedUser;
