import { useState, useEffect, useCallback } from "react";

// components
import Post from "@/components/Post";
import Loading from "@/components/Loading";

// libaries
import processService from "@/lib/processService";

// types
import type IPost from "@/types/post";

const NewsFeed = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const getPosts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await processService("get posts", {
        page,
        limit: 10,
        type: "global",
      });
      const { success, error } = data;
      if (success && data.posts) {
        console.log(data.posts);
        setPosts([...posts, ...data.posts]);
        setPage(page + 1);
      } else {
        if (error === "Failed to get posts") {
          throw new Error("Failed to get posts");
        } else if (error === "No more posts") {
          console.log("No more posts");
          setLoading(false);
        } else if (error === "Unauthorized") {
          throw new Error("Unauthorized");
        } else if (error === "Server Error") {
          throw new Error("Server Error");
        } else {
          throw new Error("Unknown Error");
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [loading, page, posts]);

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
          />
        ))}

      <div className="relative h-28 mb-5">
        <Loading />
      </div>
    </>
  );
};

export default NewsFeed;
