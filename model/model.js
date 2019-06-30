var appRoot = require('app-root-path');
const v = require('voca');
const status = require(`${appRoot}/config/status`);

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

class Response {
    constructor(options = {}) {
        this.status = status.success;
        this.message = '';
        this.result = {};
        Object.assign(this, options);
    }
}

module.exports = {
    ChatUser : ChatUser,
    Response : Response
};