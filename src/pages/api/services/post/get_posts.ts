import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import PostModel, { IPostModel } from "@/models/PostModel";

export default connectDB(
  async (req: ServiceRequest<"get posts">, res: NextApiResponse) => {
    try {
      let { _id, eventbusSecret, type, page, limit, recipient_id } = req.body;

      console.log(recipient_id || "global", page);
      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }

      if (!type || !page || !limit) {
        throw new Error(serviceError.InvalidRequest);
      }

      let posts: IPostModel[] = [];
      // get posts
      if (type === "global") {
        const userId = _id; // Replace with the actual user ID

        posts = await PostModel.aggregate([
          {
            $sort: { createdAt: -1 },
          },
          {
            $skip: (page - 1) * limit,
          },
          {
            $limit: limit,
          },
          // First $lookup to join with comments and get comment count
          {
            $lookup: {
              from: "comments",
              let: { postId: { $toString: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$post_id", "$$postId"],
                    },
                  },
                },
                {
                  $count: "count",
                },
              ],
              as: "commentCount",
            },
          },
          {
            $unwind: {
              path: "$commentCount",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              commentCount: {
                $ifNull: ["$commentCount.count", 0],
              },
            },
          },
          // Second $lookup to count likes
          {
            $lookup: {
              from: "likes",
              let: { postId: { $toString: "$_id" } }, // Convert ObjectId to string
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$post_id", "$$postId"], // Compare strings
                    },
                  },
                },
              ],
              as: "likes",
            },
          },
          {
            $addFields: {
              likeCount: { $size: "$likes" },
            },
          },
          // Third $lookup to check if the current user has liked the post
          {
            $lookup: {
              from: "likes",
              let: { postId: { $toString: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$post_id", "$$postId"] },
                        { $eq: ["$user_id", userId] }, // Check if the like is by the user
                      ],
                    },
                  },
                },
              ],
              as: "userLike",
            },
          },
          {
            $addFields: {
              likedByUser: { $gt: [{ $size: "$userLike" }, 0] },
            },
          },
          // Final projection
          {
            $project: {
              userLike: 0, // Exclude userLike array
              likes: 0, // Exclude likes array
              // Include other fields as needed
            },
          },
        ]);
      }
      // get friends posts
      // else if (type === "friends") {
      //   posts = await PostModel.find()
      //     .sort({ createdAt: -1 })
      //     .skip((page - 1) * limit)
      //     .limit(limit);
      // }
      // get user posts
      else if (type === "user") {
        if (!_id) {
          throw new Error(serviceError.InvalidUserId);
        }
        const userId = _id; // Replace with the actual user ID

        posts = await PostModel.aggregate([
          {
            $match: {
              $or: [{ user_id: recipient_id }, { recipient_id }],
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $skip: (page - 1) * limit,
          },
          {
            $limit: limit,
          },
          // Lookup to join with comments and get comment count
          {
            $lookup: {
              from: "comments",
              let: { postId: { $toString: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$post_id", "$$postId"],
                    },
                  },
                },
                {
                  $count: "count",
                },
              ],
              as: "commentCount",
            },
          },
          {
            $unwind: {
              path: "$commentCount",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              commentCount: {
                $ifNull: ["$commentCount.count", 0],
              },
            },
          },
          // Lookup to count likes
          {
            $lookup: {
              from: "likes",
              let: { postId: { $toString: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$post_id", "$$postId"],
                    },
                  },
                },
              ],
              as: "likes",
            },
          },
          {
            $addFields: {
              likeCount: { $size: "$likes" },
            },
          },
          // Lookup to check if the current user has liked the post
          {
            $lookup: {
              from: "likes",
              let: { postId: { $toString: "$_id" } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$post_id", "$$postId"] },
                        { $eq: ["$user_id", userId] },
                      ],
                    },
                  },
                },
              ],
              as: "userLike",
            },
          },
          {
            $addFields: {
              likedByUser: { $gt: [{ $size: "$userLike" }, 0] },
            },
          },
          // Final projection
          {
            $project: {
              userLike: 0, // Exclude userLike array
              likes: 0, // Exclude likes array
              // other fields
            },
          },
        ]);

        console.log(posts);
      }
      return res.json({ posts, success: true });
    } catch (error) {
      return res.json({ error: (error as any).message, success: false });
    }
  }
);
