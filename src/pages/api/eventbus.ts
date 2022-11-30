import type { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import chalk from "chalk";
import axios from "axios";

const URL = process.env.BASE_URL + "/api/services";

interface EventbusApiRequest extends NextApiRequest {
  body: {
    _id?: string;
    [key: string]: any;
    service: string;
  };
  cookies: {
    token?: string;
    "next-auth.session-token"?: string;
    "__Secure-next-auth.session-token"?: string;
  };
  data: any;
  method: "POST";
}

const eventbus = async (req: EventbusApiRequest, res: NextApiResponse<any>) => {
  let verifiedToken: string | JwtPayload = "";

  const { body, cookies, method } = req;
  const { service } = body;

  try {
    if (method !== "POST") {
      throw new Error("Method not allowed");
    }
    if (!body) {
      throw new Error("No body");
    }

    body._id = undefined;

    // verify validity of the token in the cookie and return the users _id

    if (cookies.token) {
      try {
        verifiedToken = jwt.verify(
          cookies.token || "",
          process.env.NEXTAUTH_SECRET || ""
        );
        req.body._id =
          typeof verifiedToken === "object" ? verifiedToken._id : undefined;
      } catch (error) {
        console.log(chalk.red.bold(`Invalad Token -> ${req.body.service}`));
        return res.status(401).json({ success: false, error: "Invalad Token" });
      }
    }

    // log request
    let token_id = body._id
      ? body._id
      : cookies.token
      ? "Invalid Token"
      : "No Token";
    console.log(
      chalk.yellow.bold(`${token_id}`),
      chalk.red.bold("->"),
      chalk.green.bold(`${body.service}`)
    );

    const protectedRoute = () => {
      if (!body._id) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }
    };

    switch (body.service) {
      // *****************************
      // *******  NO DB  *************
      // *****************************

      // case "protected service":
      // protectedRoute();
      // req = await axios.post(`${url}/user/protected_service`, body);
      // break;

      // *****************************
      // *******  USER DB  ***********
      // *****************************

      // Get user
      // Unprotected
      // returns myself or profile_id
      // { profile_id <optional> }
      case "get user":
        req = await axios.post(`${URL}/user/get_user`, req.body);
        break;

      // Login
      // Unprotected
      // returns jwt
      // { email, password }
      case "login":
        req = await axios.post(`${URL}/user/login`, req.body);
        break;

      // Login with Oauth
      // Unprotected
      // returns jwt
      // { email, password, csrfToken }
      case "oauth":
        req = await axios.post(`${URL}/user/oauth`, {
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
        req = await axios.post(`${URL}/user/register`, body);
        break;

      // *****************************
      // *******  DEFAULT  ***********
      // *****************************

      default:
        throw new Error("Invalid service");
    }

    if (req.data.error) {
      throw new Error(req.data.error);
    }

    res.status(200).json({ ...req.data });
  } catch (error) {
    console.log(
      chalk.red.bold(`Error:`),
      chalk.red.bold((error as any).message),
      chalk.red.bold(`->`),
      chalk.yellow.bold(`${verifiedToken ? verifiedToken : "No Token"}`),
      chalk.red.bold(`->`),
      chalk.green.bold(service ? service : "No Service")
    );

    const unprotectedErrors: any = {
      "Username already exists": true,
      "Email already exists": true,
    };

    if (unprotectedErrors[(error as any).message]) {
      return res.json({ success: false, error: (error as any).message });
    }

    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export default eventbus;
