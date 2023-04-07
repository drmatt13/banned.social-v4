import {
  useState,
  useEffect,
  useCallback,
  useRef,
  SetStateAction,
  Dispatch,
} from "react";
import { useRouter } from "next/router";

// components
import Post from "@/components/Post";
import LoadingPosts from "@/components/LoadingPosts";

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
  const router = useRouter();

  const { feedCache, updateFeedCache } = useGlobalContext();

  const newsfeedResetFlag = useRef(false);

  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const [page, setPage] = useState(1);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>({
    likes: 0,
    comments: 0,
    shares: 0,
  });

  const getPosts = useCallback(async () => {
    if (loading || (initialLoad && page > 1)) return;
    setLoading(true);
    setInitialLoad(false);
    try {
      const data = await processService("get posts", {
        page,
        limit: 15,
        type: type,
        recipient_id,
      });
      const { success, error } = data;
      if (!success || !data.posts) {
        if (error === "Failed to get posts") {
          throw new Error("Failed to get posts");
        } else if (error === "Unauthorized") {
          throw new Error("Unauthorized");
        } else if (error === "Server Error") {
          throw new Error("Server Error");
        }
        throw new Error("Unknown Error");
      }

      setPosts((posts) => {
        return [...posts, ...(data.posts as Array<IPost>)];
      });
      setPage(page + 1);
      // console.log(recipient_id || "global", data.posts);

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
      if (data.posts.length < 15) {
        setNoMorePosts(true);
        return;
      }
    } catch (error) {
      console.log(error);
    }
    // setTimeout(() => {
    setLoading(false);
    // }, 1000);
  }, [
    feedCache,
    initialLoad,
    loading,
    page,
    recipient_id,
    setPage,
    type,
    updateFeedCache,
  ]);

  useEffect(() => {
    setPage(1);
    setPosts([]);
    setLoading(false);
    setNoMorePosts(false);
    setInitialLoad(true);
    newsfeedResetFlag.current = true;
  }, [router.asPath, setPage]);

  useEffect(() => {
    if (initialLoad && page === 1) {
      newsfeedResetFlag.current = false;
      setInitialLoad(false);
      getPosts();
    }
  }, [getPosts, initialLoad, page]);

  useEffect(() => {
    const mainContainer = document.getElementById("__next");
    const firstChild = mainContainer?.firstChild as HTMLDivElement;
    firstChild.scrollTo({ top: 0, behavior: "smooth" });
  }, [router.query]);

  useEffect(() => {
    const scrollListener = async (e: Event) => {
      const scrollHeight = (e.target as HTMLDivElement).scrollHeight;
      const offsetHeight = (e.target as HTMLDivElement).offsetHeight;
      const scrollTop = (e.target as HTMLDivElement).scrollTop;
      if (
        !newsfeedResetFlag.current &&
        !initialLoad &&
        Math.floor(scrollHeight - (offsetHeight + scrollTop)) < 300
      ) {
        // console.log("get more posts");
        getPosts();
      }
    };
    const mainContainer = document.getElementById("__next");
    const firstChild = mainContainer?.firstChild as HTMLDivElement;
    firstChild.addEventListener("scroll", scrollListener);
    return () => {
      firstChild.removeEventListener("scroll", scrollListener);
    };
  }, [getPosts, initialLoad, page]);

  return (
    <>
      {posts &&
        posts.map((post: IPost, index) => (
          <Post
            key={post._id}
            _id={post._id}
            user_id={post.user_id}
            recipient_id={post.recipient_id}
            sharedPost_id={post.sharedPost_id}
            content={post.content}
            image={post.image}
            og={post.og}
            createdAt={post.createdAt}
            updatedAt={post.updatedAt}
            aggregatedData={aggregatedData}
            setAggregatedData={setAggregatedData}
            updatePost={(() => {
              return (updatedPost: IPost) => {
                setPosts((posts) => {
                  return posts.map((post) => {
                    if (post._id === post._id) {
                      return {
                        ...updatedPost,
                      };
                    }
                    return post;
                  });
                });
              };
            })()}
          />
        ))}
      {!noMorePosts && (
        <>
          {loading && (
            <>
              <LoadingPosts />
              <LoadingPosts />
              <LoadingPosts />
              <LoadingPosts />
              <LoadingPosts />
            </>
          )}
        </>
      )}
    </>
  );
};

export default NewsFeed;
