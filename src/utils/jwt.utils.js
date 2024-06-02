import jwt from "jsonwebtoken";
import { PRIVATE_KEY, PUBLIC_KEY } from "../../constants.js";
const privateKey = PRIVATE_KEY;
const publicKey = PUBLIC_KEY;

function signJwt(object, options) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

function verifyJwt(token) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}

export { signJwt, verifyJwt };
