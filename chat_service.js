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
        room.creater = req.userid;
        //room.userList = room.owner;

        if (v.isEmpty(room.name)) {
          middleware.handleError(Error.create(status.invalidParameter, 'invalid parameter'), req, res);
          return;
        }

        if (v.isEmpty(room.creater)) {
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
        let userid = req.userid;
        let roomid = req.body.roomid;

        if (v.isEmpty(roomid)) {
            middleware.handleError(Error.create(status.invalidParameter, 'invalid parameter'), req, res);
            return;
        }

        try {
            await dao.joinRoom(roomid, userid);
            res.json(new model.Response());
        } catch (error) {
            middleware.handleError(error, req, res);
            return;
        }
    };

    this.exitRoom = async (req, res) => {
        console.debug('exitRoom1');
        let userid = req.userid;
        let roomid = req.body.roomid;

        if (v.isEmpty(roomid)) {
            middleware.handleError(Error.create(status.invalidParameter, 'invalid parameter'), req, res);
            return;
        }

        console.debug('exitRoom2');
        try {
            await dao.exitRoom(roomid, userid);
            console.debug('exitRoom3');
            res.json(new model.Response());
        } catch (error) {
            middleware.handleError(error, req, res);
            return;
        }
    };

    this.sendMessage = async (req, res) => {
        let userid = req.userid;
        let message = req.body.message;

        if (v.isEmpty(message)) {
            middleware.handleError(Error.create(status.invalidParameter, 'invalid parameter'), req, res);
            return;
        }

        var msg = new model.ChatMessage(message);
        
    };


};

module.exports = new ChatService();