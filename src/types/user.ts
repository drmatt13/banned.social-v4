export default interface User {
  _id: string;
  username: string;
  bio?: string;
  role?: string;
  profileAvatar?: number | undefined;
  verified?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  authProvider?: string;
  providerEmail?: string;
  lastLogin?: Date;
  createdAt?: Date;
}
