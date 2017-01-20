"use strict";

var Widget = require(__dirname + "/../../../src/widget");

var widget = new Widget();

/**
 * On widget update cycle - Fired every 30 seconds for each server
 * @param {RconServer} server
 */
widget.onUpdate = function (server) {
    var commands = widget.storage.get(server, "commands") || {};
    var now = Math.floor(new Date().getTime() / 1000 / 60);
    var thisDay = new Date().getDay();
    var thisHour = new Date().getHours();
    var thisMinute = new Date().getMinutes();
    for (var commandsIndex in commands) {
        if (commands.hasOwnProperty(commandsIndex)) {
            var row = commands[commandsIndex];
            if (row.active !== "yes") continue;
            if (!row.minutes.length || !row.hours.length || !row.weekdays.length) {
                continue;
            }
            var lastExecution = row.lastExecution || 0;
            if (lastExecution < now && row.minutes.indexOf(thisMinute.toString()) > -1 && row.hours.indexOf(thisHour.toString()) > -1 && row.weekdays.indexOf(thisDay.toString()) > -1) {
                row.lastExecution = now;
                commands[commandsIndex] = row;
                server.cmd(row.command);
                widget.storage.set(server, "commands", commands);
            }
        }
    }
};

/**
 * On frontend message
 * @param {RconServer} server
 * @param {WebSocketUser} user
 * @param {string} action The action
 * @param {*} messageData Any message data received from frontend
 * @param {function} callback Pass an object as message data response for the frontend
 */
widget.onFrontendMessage = function (server, user, action, messageData, callback) {
    var commands = widget.storage.get(server, "commands") || {};
    switch (action) {
        case "delete":
            delete commands[messageData];
            widget.storage.set(server, "commands", commands);
            callback(this, null);
            break;
        case "get":
            callback(this, commands);
            break;
        case "save":
            if (messageData && messageData.name) {
                commands[messageData.name] = messageData;
                widget.storage.set(server, "commands", commands);
            }
            callback(this, null);
            break;
    }
};

module.exports = widget;