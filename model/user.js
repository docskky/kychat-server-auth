const v = require('voca');

class ChatUser {
    constructor(options = {}) {
        id = ''
        password = ''
        name = ''
        fcm_token = ''
        badge = 0
        thumbnail = ''
        photo = ''
        rooms = ''
        
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
}

module.exports = ChatUser