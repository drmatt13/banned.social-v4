export default interface User {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  verified?: boolean;
  email?: string;
  password?: string;
  authProvider?: string;
  providerEmail?: string;
  avatar?: number;
  bio?: string;
  admin?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
}
