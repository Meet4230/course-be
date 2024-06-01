import { User } from "../models/user.models";
import axios from "axios";
async function createUser(input) {
  try {
    const user = await User.create(input);
    return omit(user.toJSON(), "password");
  } catch (e) {
    throw new Error(e);
  }
}

async function validatePassword({ email, password }) {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

async function findUser(query) {
  return User.findOne(query).lean();
}

async function getGoogleOAuthTokens({ code }) {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (error) {
    console.error(error.response.data.error);
    log.error(error, "Failed to fetch Google Oauth Tokens");
    throw new Error(error.message);
  }
}

async function getGoogleUser({ id_token, access_token }) {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    log.error(error, "Error fetching Google user");
    throw new Error(error.message);
  }
}

async function findAndUpdateUser(query, update, options = {}) {
  return UserModel.findOneAndUpdate(query, update, options);
}

export {
  createUser,
  validatePassword,
  findUser,
  getGoogleOAuthTokens,
  getGoogleUser,
  findAndUpdateUser,
};
