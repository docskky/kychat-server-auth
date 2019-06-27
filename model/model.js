const v = require('voca');

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

module.exports = {
    ChatUser : ChatUser
};