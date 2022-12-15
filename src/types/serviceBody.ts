interface ServiceBody {
  _id?: string;
  profile_id?: string;
  username?: string;
  password?: string;
  email?: string;
  provider?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  sessionToken?: string;
  eventbusSecret?: string;
}

export default ServiceBody;
