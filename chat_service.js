const v = require('voca');
//const bcrypt = require('bcrypt');
const config = require('./config/config');
const dao = require('./database/dao')
const util = require('util');
const status = require('./config/status');
const model = require('./model/model');
let middleware = require('./middleware');

require('./common')();


var ChatService = function() {
    this.createRoom = async (req, res) => {

        var room = new model.ChatRoom();
        room.creation = new Date();
        room.name = req.body.name;
        room.owner = req.userid;
        room.userList = room.owner;

        if (v.isEmpty(room.name)) {
          middleware.handleError(Error.create(status.invalidParameter, 'invalid parameter'), req, res);
          return;
        }

        if (v.isEmpty(room.owner)) {
            middleware.handleError(Error.create(status.unknownError, 'unknown user'), req, res);
            return;
        }

        try {
            let result = await dao.createRoom(room);
            room.rid = result["insertId"];
            res.json(new model.Response({
                result: room
              }));
        } catch (error) {
            middleware.handleError(error, req, res);
            return;
        }
    };

    this.joinRoom = async (req, res) => {
        var room = new model.ChatRoom();
        room.creation = new Date();
        room.name = req.body.name;
        room.owner = req.userid;
        room.userList = room.owner;
    };
};

module.exports = new ChatService();