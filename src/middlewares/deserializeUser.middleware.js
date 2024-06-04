import { verifyJwt } from "../utils/jwt.utils.js";
import { reIssueAccessToken } from "../service/session.service.js";
import pkg from "lodash";
const { get } = pkg;

const deserializeUser = async (req, res, next) => {
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  console.log("deserializeUser", accessToken);

  const refreshToken =
    get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    console.log(decoded);
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);

      res.cookie("accessToken", newAccessToken, {
        maxAge: 900000, // 15 mins
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "None",
      });
    }

    const result = verifyJwt(newAccessToken);

    res.locals.user = result.decoded;
    return next();
  }

  return next();
};

export default deserializeUser;
