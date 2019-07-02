var appRoot = require('app-root-path');
const v = require('voca');
const status = require(`${appRoot}/config/status`);

class Response {
    constructor(options = {}) {
        this.status = status.success;
        this.message = '';
        this.result = {};
        Object.assign(this, options);
    }
}

class ChatUser {
    constructor(options = {}) {
        this.id = ''
        this.password = ''
        this.name = ''
        this.fcm_token = ''
        this.badge = 0
        this.thumbnail = ''
        this.photo = ''
        this.rooms = ''
        
        Object.assign(this, options);
    }

    getRooms() {
        if (v.isEmpty(rooms)) {
            return null;
        }
        return this.rooms.split(',');
    }

    setRooms(rooms) {
        if (rooms) {
            this.rooms = rooms.join();
        } else {
            this.rooms = '';
        }
    }
};

class ChatRoom {
    constructor(options = {}) {
        this.rid = status.rid;
        this.creation = null;
        this.name = '';
        this.owner = '';
        this.userList = '';

        Object.assign(this, options);
    }
}

module.exports = {
    ChatUser : ChatUser,
    ChatRoom : ChatRoom,
    Response : Response
};