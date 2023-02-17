import { serviceError } from "@/lib/processService";
import type ServiceRequest from "@/types/serviceRequest";
import type { NextApiResponse } from "next";
import ogs from "open-graph-scraper";

// return username, profile_id, and profileAvatar
export default async function handler(
  req: ServiceRequest<"get og">,
  res: NextApiResponse
) {
  try {
    const { eventbusSecret, url } = req.body;
    if (eventbusSecret !== process.env.EVENTBUS_SECRET) {
      throw new Error(serviceError.Unauthorized);
    }
    const options = { url: url || "" };
    const { result, error } = await ogs(options);

    if (error) {
      throw new Error(serviceError.FailedToFetchOg);
    }

    return res.json({
      success: true,
      og: {
        description: result.ogDescription,
        image: result.ogImage,
        siteName: result.ogSiteName,
        title: result.ogTitle,
        url: result.requestUrl,
      },
    });
  } catch (error) {
    return res.json({ error: (error as any).message, success: false });
  }
}
