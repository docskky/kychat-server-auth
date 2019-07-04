const pool = require('./database');
const util = require('util');
const status = require('../config/status');
const model = require('../model/model');
const utils = require('../utils');
require('../common')();

async function getEncPassword(id, cbFunc) {
    try {
        let rows = await pool.query('SELECT password FROM chatuser where `id`=?', [id]);
        //console.debug('getEncPassword='+JSON.stringify(rows));
        if (rows.length > 0) {
            cbFunc(null, rows[0]['password']);
        } else {
            cbFunc(Error.create(status.unknownUser, 'unknown user id'));
        }
    } catch (error) {
        cbFunc(error);
    }
}

async function getUser(cbFunc) {
    try {
        let rows = await pool.query('SELECT * FROM chatuser where `id`=?', [id]);
        //console.debug('getEncPassword='+JSON.stringify(rows));
        if (rows.length > 0) {
            cbFunc(null, new ChatUser(rows[0]));
        } else {
            cbFunc(Error.create(status.unknownUser, 'unknown user id'));
        }
    } catch (error) {
        cbFunc(error);
    }
}

async function addUser(user, cbFunc) {
    try {
        await pool.query('INSERT INTO chatuser (`id`, `password`, `name`, `fcm_token`, `thumbnail`, `photo`) VALUES (?,?,?,?,?,?)',
        [user["id"], user["password"], user["name"], user["fcm_token"], user["thumbnail"], user["photo"]]);
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

async function createRoom(room, cbFunc) {
    try {
        result = await pool.query('INSERT INTO chatroom (`creation`, `name`, `owner`) VALUES (?,?,?)', [
            room["creation"], room["name"], room["owner"]]);
            await pool.query('INSERT INTO chatmember (`roomid`, `user`) VALUES (?,?)', [result["insertId"], room["owner"]]);
            cbFunc(null, result);
    } catch (error) {
        cbFunc(error);
    }
}

async function joinRoom(roomid, userid, cbFunc) {
    var conn = null;
    var trans = null;
    try {
        console.debug('step0');
        conn = await pool.getConnection();

        trans = await conn.beginTransaction();
        let rows = await conn.query('SELECT `rooms` FROM chatuser WHERE `id`=?', [userid]);
        if(rows.length == 0) {
            console.debug('step4');
            cbFunc(Error.create(status.unknownUser, 'unknown user id'));
            return;
        }
        console.debug('result:'+rows);
        var rooms = rows[0]['rooms'];
        var list = new utils.StringList();
        list.set(rooms);
        list.add(roomid);
        rooms = list.toString();
        console.debug('step5');
        await conn.query('UPDATE chatuser SET `rooms` = ? WHERE `id`=?', [rooms, userid]);
        await conn.query('INSERT INTO chatmember (`roomid`, `user`) VALUES (?,?)', [roomid, userid]);

        conn.commit();
        cbFunc();

    } catch (error) {
        if(conn) {
            console.log('rollback!!!');
            conn.rollback();
        }
        cbFunc(error);
    } finally {
        if(conn) {
            conn.end();
        }
    }
}

module.exports = {
    getEncPassword : util.promisify(getEncPassword),
    addUser : util.promisify(addUser),
    deleteUser : util.promisify(deleteUser),
    joinRoom : util.promisify(joinRoom),
    createRoom : util.promisify(createRoom)
}