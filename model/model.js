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
        this.nickname = ''
        this.fcm_token = ''
        this.badge_cnt = 0
        this.img_profile = ''
        this.img_thumbnail = ''
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
        this.creater = '';
        this.userList = '';

        Object.assign(this, options);
    }
}


const MessageType = {
    TEXT : 0,
    JOIN_ROOM : 1,
    EXIT_ROOM : 2,
    PHOTO: 3,
    LOCATION: 4
};

class ChatMessage {
    constructor(options = {}) {
        this.roomId = '';
        this.code = '';
        this.sender = '';
        this.time = new Date();
        this.message = '';
        this.type = MessageType.TEXT;

        Object.assign(this, options);
    };
	
	/**
	 * MessageElement 객체를 이용해 message 스트링에 값을 넣는다.
	 * @param elements
	 */
	setMessageJ(element) {
		if(element!=null) {
			this.message = JSON.stringify(element);
		} else {
			this.message = null;
		}
	}
	
	/**
	 * message 값(json)을 이용해 MessageElement 객체를 리턴한다.
	 * @return
	 */
	getMessageJ() {
		if (this.message!=null) {
            var messageJ = JSON.parse(this.message);
            switch(this.type) {
                case MessageType.TEXT:
                    return new TextMessageElement(messageJ);
                case MessageType.PHOTO:
                    return new PhotoMessageElement(messageJ);
                case MessageType.LOCATION:
                    return new LocationMessageElement(messageJ);
                case MessageType.EXIT_ROOM:
                    return new UserActionMessageElement(messageJ);
                case MessageType.JOIN_ROOM:
                    return new UserActionMessageElement(messageJ);
            }
		}
		return null;
	}
	
	/*
	 * 사용자가 전달한 메시지인경우 true를 리턴
	 */
	isUserMessage() {
		return this.type==MessageType.TEXT
				|| this.type==MessageType.PHOTO
				|| this.type==MessageType.LOCATION;
	}

}

class TextMessageElement {
    constructor(options = {}) {
        this.text = '';

        Object.assign(this, options);
    };
}

class PhotoMessageElement {
    constructor(options = {}) {
        this.small = '';
        this.original = '';
        this.path = '';
        this.width = 0;
        this.height = 0;

        Object.assign(this, options);
    };

}

class UserActionMessageElement {
    constructor(options = {}) {
        this.userid = '';

        Object.assign(this, options);
    };

}

class LocationMessageElement {
    constructor(options = {}) {
        this.longitude = 0;
        this.latitude = 0;

        Object.assign(this, options);
    };
}

module.exports = {
    ChatUser : ChatUser,
    ChatRoom : ChatRoom,
    Response : Response,
    MessageType : MessageType,
    ChatMessage : ChatMessage,
    TextMessageElement : TextMessageElement,
    PhotoMessageElement : PhotoMessageElement,
    UserActionMessageElement : UserActionMessageElement,
    LocationMessageElement : LocationMessageElement
};