import { useEffect } from "react";
import { useRouter } from "next/router";

// components
import NewsFeed from "@/components/NewsFeed";
import PostButton from "@/components/PostButton";

// hooks
import useUser from "@/hooks/useUser";

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useUser({ _id: (id as string) || undefined });

  return (
    <div className="mt-28 h-screen">
      {loading || !id ? (
        <>loading</>
      ) : (
        <div className="w-screen">
          <div className="max-w-lg mx-auto">
            <PostButton recipient_id={id as string} />
            <NewsFeed type="user" recipient_id={id as string} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
