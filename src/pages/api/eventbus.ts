import type { NextApiRequest, NextApiResponse } from "next";
import { serviceError } from "@/lib/processService";
import jwt, { JwtPayload } from "jsonwebtoken";
import chalk from "chalk";
import axios from "axios";

const URL = process.env.BASE_URL + "/api/services";

const eventbus = async (
  req: NextApiRequest & {
    data: any;
  },
  res: NextApiResponse
) => {
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
    body.eventbusSecret = process.env.TOKEN_SECRET;

    // verify validity of the token in the cookie and return the users _id

    if (cookies.token) {
      try {
        verifiedToken = jwt.verify(
          cookies.token || "",
          process.env.TOKEN_SECRET || ""
        );
        body._id =
          typeof verifiedToken === "object" ? verifiedToken._id : undefined;
      } catch (error) {
        console.log(chalk.red.bold(`Invalad Token -> ${req.body.service}`));
        return res.status(401).json({ success: false, error: "Invalad Token" });
      }
    }

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
      case "get og":
        req = await axios.post(`${URL}/no_db/get_og`, body);
        break;

      // *****************************
      // *******  USER DB  ***********
      // *****************************

      // Get user
      // returns myself or profile_id
      // { profile_id <optional> }
      case "get user":
        req = await axios.post(`${URL}/user/get_user`, body);
        break;

      // Login
      // returns jwt
      // { email, password }
      case "login":
        req = await axios.post(`${URL}/user/login`, body);
        break;

      // Register user
      // returns user
      // { firstName, lastName, email, password }
      case "register":
        req = await axios.post(`${URL}/user/register`, body);
        break;

      // Login with Oauth
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

      // Add username to user
      // returns user
      // { username }
      case "add username":
        protectedRoute();
        req = await axios.post(`${URL}/user/add_username`, body);
        break;

      // Update user avatar
      // returns user
      // { username, avatar }
      case "update avatar":
        protectedRoute();
        req = await axios.post(`${URL}/user/update_avatar`, body);
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

    // log request
    console.log(
      chalk.yellow.bold(
        body._id ? body._id : cookies.token ? "Invalid Token" : "No Token"
      ),
      chalk.red.bold("->"),
      chalk.green.bold(`${body.service}`)
    );

    res.status(200).json({ ...req.data });
  } catch (error) {
    console.log(
      chalk.red.bold(`Error:`),
      chalk.red.bold((error as any).message),
      chalk.red.bold(`->`),
      chalk.yellow.bold(
        body._id ? body._id : cookies.token ? "Invalid Token" : "No Token"
      ),
      chalk.red.bold(`->`),
      chalk.green.bold(service ? service : "No Service")
    );

    if (Object.values(serviceError).includes((error as any).message)) {
      return res.json({
        success: false,
        error: (error as any).message,
      });
    }

    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export default eventbus;
