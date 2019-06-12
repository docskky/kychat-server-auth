const db = require('mariadb');
const util = require('util')
const config = require('./config');

const pool = db.createPool({
    host: config.db_host,
    user:config.db_user,
    password: config.db_pw,
    database: config.db_db,
    connectionLimit: 12
})

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

pool.query = util.promisify(pool.query)

module.exports = pool