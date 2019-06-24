const pool = require('./database');
const user = require('../model/user');
require('../common')();

class ChatDao {
    async getEncPassword(id) {
        let rows = await pool.query('SELECT password FROM chatuser where `id`=?', [id]);
        if (rows.length > 0) {
            return rows.first['password']
        } else {
            throw Error.create(-2, 'unknown user id');
        }
    }

    async addUser(user) {
        await pool.query('INSERT INTO chatuser (`id`, `password`, `name`, `fcm_token`, `thumbnail`, `photo`) VALUES (?,?,?,?,?,?)',
            [user.id, user.password, user.name, user.fcm_token, user.thumbnail, user.photo]);
    }

    async deleteUser(id) {
        await pool.query('DELETE FROM chatuser where `id`=?', [id]);
    }
}

module.exports = {
    ChatDao : ChatDao
}