import { useState, useEffect, useCallback } from "react";

// components
import Post from "@/components/Post";
import Loading from "@/components/Loading";

// context
import useGlobalContext from "@/context/globalContext";

// libaries
import processService from "@/lib/processService";

// types
import type IPost from "@/types/post";
import type AggregatedData from "@/types/AggregatedData";

interface Props {
  type: "global" | "friends" | "user";
  recipient_id?: string;
}

const NewsFeed = ({ type, recipient_id }: Props) => {
  const { feedCache, updateFeedCache } = useGlobalContext();

  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>({
    likes: 0,
    comments: 0,
    shares: 0,
  });

  const getPosts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await processService("get posts", {
        page,
        limit: 10,
        type: type,
        recipient_id,
      });
      const { success, error } = data;
      if (!success || !data.posts) {
        if (error === "Failed to get posts") {
          throw new Error("Failed to get posts");
        } else if (error === "No more posts") {
          console.log("No more posts");
          setLoading(false);
        } else if (error === "Unauthorized") {
          throw new Error("Unauthorized");
        } else if (error === "Server Error") {
          throw new Error("Server Error");
        }
        throw new Error("Unknown Error");
      }
      setPosts([...posts, ...data.posts]);
      setPage(page + 1);

      // update feed cache
      const userCache = new Set();
      data.posts.forEach((post: IPost) => {
        if (!feedCache[post.user_id!]) userCache.add(post.user_id);
        if (post.recipient_id && !feedCache[post.recipient_id])
          userCache.add(post.recipient_id);
        if (post.sharedPost_id && !feedCache[post.sharedPost_id])
          userCache.add(post.sharedPost_id);
      });
      const users = Array.from(userCache) as string[];
      if (users.length > 0) {
        await updateFeedCache(users);
      }
      // get aggregated data for posts { likes, comments, shares }
      //
      //
      //
      //
      //
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [feedCache, loading, page, posts, recipient_id, type, updateFeedCache]);

  useEffect(() => {
    if (initialLoad) getPosts();
    setInitialLoad(false);
  }, [getPosts, initialLoad, loading]);

  return (
    <>
      {posts &&
        posts.map((post: IPost) => (
          <Post
            key={post._id}
            _id={post._id!}
            user_id={post.user_id}
            recipient_id={post.recipient_id}
            sharedPost_id={post.sharedPost_id}
            content={post.content}
            image={post.image}
            og={post.og}
            createdAt={post.createdAt}
            updatedAt={post.updatedAt}
            aggregatedData={aggregatedData}
          />
        ))}
    </>
  );
};

export default NewsFeed;
