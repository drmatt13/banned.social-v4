import type { NextApiRequest } from "next";
import type ServiceBody from "@/types/serviceBody";

interface ServiceRequest<T> extends NextApiRequest {
  body: Partial<ServiceBody<T>> & { _id?: string; eventbusSecret?: string };
  cookies: {
    token?: string;
    "next-auth.session-token"?: string;
    "__Secure-next-auth.session-token"?: string;
  };
  headers: {
    authorization?: string;
  };
}

export default ServiceRequest;
