import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";

// mongoose
import connectDB from "@/lib/connectDB";
import CommentModel, { ICommentModel } from "@/models/CommentModel";

export default connectDB(
  async (req: ServiceRequest<"get comments">, res: NextApiResponse) => {
    try {
      let { eventbusSecret, page, limit, post_id, _id } = req.body;

      if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
        throw new Error(serviceError.Unauthorized);
      }

      if (!post_id || !page || !limit) {
        throw new Error(serviceError.InvalidRequest);
      }

      let comments: ICommentModel[] = [];

      const userId = _id; // Replace with the actual user ID

      comments = await CommentModel.aggregate([
        {
          $match: {
            post_id,
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
        {
          $lookup: {
            from: "subcomments",
            let: {
              commentId: {
                $toString: "$_id",
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$comment_id", "$$commentId"],
                  },
                },
              },
              {
                $count: "count",
              },
            ],
            as: "subCommentCount",
          },
        },
        {
          $unwind: {
            path: "$subCommentCount",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            subCommentCount: {
              $ifNull: ["$subCommentCount.count", 0],
            },
          },
        },
        {
          $lookup: {
            from: "likes",
            let: {
              commentId: {
                $toString: "$_id",
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$comment_id", "$$commentId"],
                  },
                },
              },
              {
                $count: "count",
              },
            ],
            as: "likeCount",
          },
        },
        {
          $unwind: {
            path: "$likeCount",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            likeCount: {
              $ifNull: ["$likeCount.count", 0],
            },
          },
        },
        {
          $lookup: {
            from: "likes",
            let: {
              commentId: {
                $toString: "$_id",
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$comment_id", "$$commentId"],
                      },
                      {
                        $eq: ["$user_id", _id],
                      },
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
            likedByUser: {
              $gt: [
                {
                  $size: "$userLike",
                },
                0,
              ],
            },
          },
        },
        {
          $project: {
            userLike: 0,
          },
        },
      ]);

      return res.json({ comments, success: true });
    } catch (error) {
      return res.json({ error: (error as any).message, success: false });
    }
  }
);
