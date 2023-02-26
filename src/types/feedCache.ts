interface FeedCache {
  [_id: string]: {
    username: string;
    avatar: string;
  };
}

export default FeedCache;
