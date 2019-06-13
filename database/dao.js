const pool = require('./database');
const user = require('../model/user');

class ChatDao {
    getUserPassword(username) {
        try {
            let rows = await pool.query('SELECT password FROM chatuser where `id`=?', [username]);
            if (rows.length > 0) {
                return rows.first['password']
            }
        } catch {

        }
        return null;
    }

    addUser(user) {
        await pool.query('INSERT INTO chatuser (`id`, `password`, `name`, `fcm_token`, `badge`, `thumbnail`, `photo`, `rooms`) VALUES (?, ?)', 
            [user.id, user.password, user.name, user.fcm_token, user.badge, user.thumbnail, user.photo, user.rooms]);
    }
    
}