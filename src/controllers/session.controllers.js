import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service.js";
import {
  findAndUpdateUser,
  getGoogleOAuthTokens,
  getGoogleUser,
  validatePassword,
} from "../service/user.service.js";
import { signJwt } from "../utils/jwt.utils.js";

const accessTokenCookieOptions = {
  httpOnly: true,
  path: "/",
  secure: true,
  sameSite: "None",
};

const refreshTokenCookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 3.154e10,
};

export async function createUserSessionHandler(req, res) {
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  const session = await createSession(user._id, req.get("user-agent") || "");

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req, res) {
  const userId = res.locals.user._id;
  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
}

export async function deleteSessionHandler(req, res) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
//// 222 Google
export async function googleOauthHandler(req, res) {
  const code = req.query.code;

  try {
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });

    const googleUser = await getGoogleUser({ id_token, access_token });

    if (!googleUser.verified_email) {
      return res.status(403).send("Google account is not verified");
    }

    const user = await findAndUpdateUser(
      { email: googleUser.email },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        userName: googleUser.email.split("@")[0],
      },
      { upsert: true, new: true }
    );
    const session = await createSession(user._id, req.get("user-agent") || "");
    let accessToken;
    try {
      accessToken = signJwt(
        { ...user.toJSON(), session: session._id },
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );
    } catch (error) {}

    const refreshToken = signJwt(
      { ...user.toJSON(), session: session._id },
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    console.log("accessToken: ", accessToken);
    console.log("refreshToken: ", refreshToken);

    // Instead of setting cookies in the response headers, we'll pass them as JSON data
    const cookieData = {
      accessToken,
      refreshToken,
      accessTokenOptions: accessTokenCookieOptions,
      refreshTokenOptions: refreshTokenCookieOptions,
    };

    // Redirect to a client-side route that handles setting the cookies
    res.redirect(
      `${process.env.CORS_ORIGIN}/set-cookies?data=${encodeURIComponent(
        JSON.stringify(cookieData)
      )}`
    );
  } catch (error) {
    return res.redirect(`${process.env.CORS_ORIGIN}/api/v1/users/oauth/error`);
  }
}
