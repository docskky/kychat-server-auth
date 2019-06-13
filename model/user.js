const v = require('voca');

class ChatUser {
    id = ''
    password = ''
    name = ''
    fcm_token = ''
    badge = 0
    thumbnail = ''
    photo = ''
    rooms = ''

    constructor(options = {}) {
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