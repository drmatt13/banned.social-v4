import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
// import colors from "colors";
import axios from "axios";

const url = process.env.NEXTAUTH_URL;

interface EventbusApiRequest extends NextApiRequest {
  body: {
    _id?: string | undefined;
    service: string;
    [key: string]: any;
  };
  cookies: {
    token?: string;
    "next-auth.session-token"?: string;
    "__Secure-next-auth.session-token"?: string;
  };
  data: any;
}

const eventbus = async (req: EventbusApiRequest, res: NextApiResponse) => {
  const { body, cookies } = req;

  // verify validity of the token in the cookie and return the users _id
  let verifiedToken: string | JwtPayload;
  try {
    verifiedToken = jwt.verify(
      cookies.token || "",
      process.env.TOKEN_SECRET || ""
    );
    body._id =
      typeof verifiedToken === "object" ? verifiedToken._id : undefined;
  } catch (error) {
    body._id = undefined;
  }

  // log request
  // let token_id = body._id
  //   ? body._id
  //   : cookies.token
  //   ? "Invalid Token"
  //   : "No Token";
  // console.log(`${token_id}`.yellow, "->".red, `${body.service}`.green);

  const protectedRoute = () => {
    if (!body._id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }
  };

  try {
    switch (body.service) {
      // *****************************
      // *******  USER DB  ***********
      // *****************************

      // Get user
      // Unprotected
      // returns myself or profile_id
      // { profile_id <optional> }
      case "get user":
        req = await axios.post(`${url}/api/services/get_user`, body);
        break;

      // Login
      // Unprotected
      // returns jwt
      // { email, password }
      case "login":
        console.log(`${url}/api/services/login`);
        req = await axios.post(`${url}/api/services/login`, body);
        break;

      // Login with Oauth
      // Unprotected
      // returns jwt
      // { email, password, csrfToken }
      case "oauth":
        req = await axios.post(`${url}/api/services/oauth`, {
          ...body,
          sessionToken:
            cookies["next-auth.session-token"] ||
            cookies["__Secure-next-auth.session-token"],
        });
        break;

      // Register user
      // Unprotected
      // returns user
      // { firstName, lastName, email, password }
      case "register":
        req = await axios.post(`${url}/api/services/register`, body);
        break;

      // *****************************
      // *******  DEFAULT  ***********
      // *****************************

      default:
        // console.log("Invalid Service".red);
        req.data = {
          error: "Invalid Service",
          success: false,
        };
        break;
    }
    res.status(200).json({ ...req.data });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export default eventbus;
