import jwt from 'jsonwebtoken';
import {APIError401} from "../errors.js";

export const createTokenForMagicLink = (payload) => jwt.sign(payload, process.env.JWT_AUTH_SECRET_MAGIC_LINK, {expiresIn: '1h'});
export const createAuthToken = (payload) => jwt.sign(payload, process.env.JWT_AUTH_SECRET);

export const decodeToken = (token, secret) => {
  try {
    jwt.verify(token, secret); // check if token is expired
    return jwt.decode(token); // decode payload
  } catch (error) {
    throw new APIError401();
  }
};