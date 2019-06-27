const pool = require('./database');
const user = require('../model/model');
require('../common')();

class ChatDao {
    async getEncPassword(id) {
        try {
            let rows = await pool.query('SELECT password FROM chatuser where `id`=?', [id]);
            if (rows.length > 0) {
                return rows.first['password']
            } else {
                return Error.create(-2, 'unknown user id');
            }
        } catch (error) {
            return error;
        }
    }

    async addUser(user) {
        try {
            await pool.query('INSERT INTO chatuser (`id`, `password`, `name`, `fcm_token`, `thumbnail`, `photo`) VALUES (?,?,?,?,?,?)',
            [user.id, user.password, user.name, user.fcm_token, user.thumbnail, user.photo]);
        } catch (error) {
            return error;
        }
    }

    async deleteUser(id) {
        try {
            await pool.query('DELETE FROM chatuser where `id`=?', [id]);
        } catch (error) {
            return error;
        }
    }
}

module.exports = {
    chat : new ChatDao()
}