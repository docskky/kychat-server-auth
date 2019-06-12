const pool = require('./database');
class ChatDB {
    getUserPassword(username) {
        let rows = await pool.query('SELECT password FROM chatuser where `id`=?', [username]);
        if (rows.length > 0) {
            return rows.first['password']
        }
        return null;
    }

    
}