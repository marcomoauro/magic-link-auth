import log from "../log.js";
import asyncStorage from "../asyncStorage.js";
import User from "../models/User.js";

export const me = async () => {
  log.info('Controller::users::me')

  const user_id = asyncStorage.getStore().user_id;

  const user = await User.get({id: user_id})

  return user
}