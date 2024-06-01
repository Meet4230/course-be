import get from "lodash/get";
import SessionModel from "../models/session.model";
import { verifyJwt, signJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";

async function createSession(userId, userAgent) {
  const session = await SessionModel.create({ user: userId, userAgent });
  return session.toJSON();
}

async function findSessions(query) {
  return SessionModel.find(query).lean();
}

async function updateSession(query, update) {
  return SessionModel.updateOne(query, update);
}

async function reIssueAccessToken({ refreshToken }) {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } //  30 minutes
  );

  return accessToken;
}

exports = {
  createSession,
  findSessions,
  updateSession,
  reIssueAccessToken,
};
