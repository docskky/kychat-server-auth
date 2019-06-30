const pool = require('./database');
const util = require('util')
const user = require('../model/model');
require('../common')();

async function getEncPassword(id, cbFunc) {
    try {
        let rows = await pool.query('SELECT password FROM chatuser where `id`=?', [id]);
        //console.debug('getEncPassword='+JSON.stringify(rows));
        if (rows.length > 0) {
            cbFunc(null, rows[0]['password']);
        } else {
            cbFunc(Error.create(-2, 'unknown user id'));
        }
    } catch (error) {
        cbFunc(error);
    }
}

async function addUser(user, cbFunc) {
    try {
        await pool.query('INSERT INTO chatuser (`id`, `password`, `name`, `fcm_token`, `thumbnail`, `photo`) VALUES (?,?,?,?,?,?)',
        [user.id, user.password, user.name, user.fcm_token, user.thumbnail, user.photo]);
        cbFunc();
    } catch (error) {
        cbFunc(error);
    }
};

async function deleteUser(id, cbFunc) {
    try {
        await pool.query('DELETE FROM chatuser where `id`=?', [id]);
        cbFunc();
    } catch (error) {
        cbFunc(error);
    }
}

module.exports = {
    getEncPassword : util.promisify(getEncPassword),
    addUser : util.promisify(addUser),
    deleteUser : util.promisify(deleteUser),
}