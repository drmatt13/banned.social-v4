import type User from "@/types/user";

interface ServiceResults {
  user?: User;
  token?: string;
  success?: boolean;
  error?: string;
}

export default ServiceResults;
