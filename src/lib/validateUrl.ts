import { z } from "zod";

export default function validateUrl(url: string) {
  const urlSchema = z.string().url();
  try {
    urlSchema.parse(url);
    return true;
  } catch (err) {
    return false;
  }
}
