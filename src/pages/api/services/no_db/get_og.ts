import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";
import { fetch } from "fetch-opengraph";

// return username, profile_id, and profileAvatar
export default async function handler(
  req: ServiceRequest<"get og">,
  res: NextApiResponse
) {
  try {
    return res.json({ success: true });
    // if (user) {
    // } else {
    //   throw new Error(serviceError.UserNotFound);
    // }
  } catch (error) {
    res.json({ error: (error as any).message, success: false });
  }
}
