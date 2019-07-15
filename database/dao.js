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
        result = await pool.query('INSERT INTO chatroom (`creation`, `name`, `creater`) VALUES (?,?,?)', 
            [room["creation"], room["name"], room["creater"]]);
        const roomid = result["insertId"];
        await pool.query('INSERT INTO chatmember (`roomid`, `user`) VALUES (?,?)', [roomid, room["creater"]]);

        // 메시지 테이블을 생성한다.
        await pool.query('create table messages_'+roomid+' (\
            `rid` int unsigned not null AUTO_INCREMENT primary key,\
            `sender` varchar(20),\
            `time` datetime,\
            `type` tinyint not null,\
            `message` JSON\
        ) character set = utf8mb4;');
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

async function exitRoom(roomid, userid, cbFunc) {
    try {
        let rows = await pool.query('SELECT `rooms` FROM chatuser WHERE `id`=?', [userid]);
        if(rows.length == 0) {
            cbFunc(Error.create(status.unknownUser, 'unknown user id'));
            return;
        }

        var rooms = rows[0]['rooms'];
        var list = new utils.StringList();
        list.set(rooms);
        list.delete(roomid);
        rooms = list.toString();
        await pool.query('UPDATE chatuser SET `rooms` = ? WHERE `id`=?', [rooms, userid]);

        try {
            await pool.query('DELETE FROM chatmember WHERE `roomid`=? AND `user`=?', [roomid, userid]);
            let rows = await pool.query('SELECT count(*) as cnt FROM chatmember WHERE `roomid`=?', [roomid]);
            if (rows.length > 0 && rows[0]['cnt'] == 0) {
                await pool.query('DELETE FROM chatroom WHERE `rid`=?', [roomid]);
            }
        } catch(error) {
            // 사용자가 해당 방에 없는경우 무시해도 된다.
            console.debug(error);
        }

        cbFunc();

    } catch (error) {
        cbFunc(error);
    } finally {
    }
}

async function addMessage(message = new model.ChatMessage(), cbFunc) {
    try {
        console.debug('message:'+JSON.stringify(message));
        await pool.query('INSERT INTO `messages_'+message.roomId+'` (`sender`, `time`, `type`, `message`) VALUES (?,?,?,?)',
        [message.sender, message.time, message.type, message.message]);
        cbFunc();
    } catch (error) {
        cbFunc(error);
    }
};

/*
    sender를 제외한 unread count를 1씩 증가시킨다.
    return: {'username': 3}
*/
async function increaseUnreadCounts(roomid, sender, cbFunc) {
    try {
        var counts = {};

        let rows = await pool.query('SELECT * FROM chatmember WHERE `roomid`=?', [roomid]);
        for(var i=0; i < rows.length; i++) {
            counts[rows[i]['user']]=0;
        }

        console.debug('roomid='+roomid+' counts:'+counts);

        let rows2 = await pool.query('SELECT * FROM unreadmessagelist where `roomid`=?', [roomid]);
        for (var i = 0; i < rows2.length; i++) {
            const item = rows2[i];
            counts[item['userid']] = item['new_count']
        }

        for(var i=0; i < rows.length; i++) {
            const item = rows[i];
            const userid = rows[i]['user'];
            if(userid != sender) {
                counts[userid] += 1;
                let cnt = counts[userid];
                await pool.query('INSERT INTO unreadmessagelist(`roomid`,`userid`,`new_count`)\
                    VALUES(?,?,?) ON DUPLICATE KEY UPDATE `new_count`=?;', [roomid, userid, cnt, cnt]);
            }
        }

        cbFunc(null, counts);
    } catch (error) {
        cbFunc(error);
    }
}

module.exports = {
    getEncPassword : util.promisify(getEncPassword),
    addUser : util.promisify(addUser),
    deleteUser : util.promisify(deleteUser),
    joinRoom : util.promisify(joinRoom),
    createRoom : util.promisify(createRoom),
    exitRoom : util.promisify(exitRoom),
    increaseUnreadCounts : util.promisify(increaseUnreadCounts),
    addMessage : util.promisify(addMessage)
}