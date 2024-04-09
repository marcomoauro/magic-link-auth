import log from '../log.js'
import {APIError404, APIError422} from "../errors.js";
import {query} from '../database.js'

export default class User {
  id
  email
  username

  constructor(properties) {
    Object.keys(this)
      .filter((k) => typeof this[k] !== 'function')
      .map((k) => (this[k] = properties[k]))
  }

  static fromDBRow = (row) => {
    const user = new User({
      id: row.id,
      email: row.email,
      username: row.username,
    })

    return user
  }

  static getOrCreate = async ({email}) => {
    log.info('Model::User::getOrCreate', {
      email,
    })

    let user
    try {
      user = await User.get({email})
      if (user) return user
    } catch (error) {
      if (!(error instanceof APIError404)) throw error
    }

    user = await User.create({email})

    return user
  }

  static get = async ({id, email}) => {
    log.info('Model::User::get', {id, email})

    const params = []

    let query_sql = `
        select *
        from users
        where true
    `;

    if (id) {
      query_sql += ` and id = ?`;
      params.push(id);
    }

    if (email) {
      query_sql += ` and email = ?`;
      params.push(email);
    }

    const rows = await query(query_sql, params);

    if (rows.length !== 1) throw new APIError404('User not found.')

    const user = User.fromDBRow(rows[0])

    return user
  }

  static create = async ({email}) => {
    log.info('Model::User::create', {email})

    const {insertId: id} = await query(`
                insert into users (email)
                values (?)`,
      [email]
    );

    const user = await User.get({id})

    return user
  }

  static update = async (id, params_to_update) => {
    log.info('Model::User::update', {id, params_to_update})

    if (params_to_update.length === 0) {
      throw new APIError422('At least one parameter must be provided to update the user.')
    }

    const {username} = params_to_update

    const params = []

    let query_sql = `
        update users
        set
    `;

    if (username) {
      query_sql += ` username = ?`;
      params.push(username);
    }

    query_sql += ` where id = ?`;
    params.push(id);

    await query(query_sql, params);

    const user = await User.get({id})

    return user
  }
}