import log from "../log.js";
import asyncStorage from "../asyncStorage.js";
import User from "../models/User.js";
import {UsernameBloomFilter} from "../usernameBloomFilter.js";
import {APIError422} from "../errors.js";

export const me = async () => {
  log.info('Controller::users::me')

  const user_id = asyncStorage.getStore().user_id;

  const user = await User.get({id: user_id})

  return user
}

export const checkUsernameAvailability = async ({username}) => {
  log.info('Controller::users::checkUsernameAvailability', {username})

  const found = await UsernameBloomFilter.has(username)

  return {
    available: !found
  }
}

export const setUsername = async ({username}) => {
  log.info('Controller::users::setUsername', {username})

  const user_id = asyncStorage.getStore().user_id;

  const user = await User.get({id: user_id})
  if (user.username) {
    throw new APIError422('Username already set')
  }

  const found = await UsernameBloomFilter.has(username)
  if (found) {
    throw new APIError422('Username already taken')
  }

  const updated_user = await User.update(user_id, {username})
  await UsernameBloomFilter.add(username)

  return updated_user
}