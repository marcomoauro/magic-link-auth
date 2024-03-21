import {APIError400} from "../errors.js";
import log from "../log.js";
import {createAuthToken, createTokenForMagicLink, decodeToken} from "../api/jwt.js";
import sendMail from "../api/mailer.js";
import User from "../models/User.js";

export const sendMagicLink = async ({email}) => {
  email &&= email.toLowerCase()
  log.info('Controller::auth::sendMagicLink', {email})

  if (!email) throw new APIError400('email is required')

  const magic_token = createTokenForMagicLink({email})

  const subject = '🪄 Magic link - confirm your email 🔗'
  const body = '🔐 Click on the link below to login:\n\n' + '🔗 ' + 'process.env.PODRIDGE_URL' + '/login?magic_token=' + magic_token
  await sendMail({email, subject, body})

  return {success: true}
}

export const loginByMagicLink = async ({magic_token}) => {
  log.info('Controller::auth::loginByMagicLink', {magic_token})

  if (!magic_token) throw new APIError400('magic_token is required')

  const {email} = decodeToken(magic_token, process.env.JWT_AUTH_SECRET_MAGIC_LINK)

  const user = await User.getOrCreate({email})

  const auth_token = createAuthToken({user_id: user.id})

  return {auth_token}
}