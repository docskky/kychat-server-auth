var appRoot = require('app-root-path');
const db = require('mariadb');
const util = require('util')
const config = require(`${appRoot}/config/config`);

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

// eg) let obj = await pool.selectOne('select * from tbname')
pool.selectOne = util.promisify((queryStr, params, cbFunc) => {
    pool.query(queryStr, params).then((rows) => {
        if (rows && rows.length > 0) {
            cbFunc(null, rows[0]);
        } else {
            cbFunc();
        }
    }).catch((error) => {
        cbFunc(error);
    });
});

pool.query = util.promisify(pool.query);
module.exports = pool
