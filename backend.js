"use strict";

var Widget = require(__dirname + "/../../../src/widget");

var widget = new Widget();

/**
 * On rcon server has successfully connected and authenticated
 * @param {RconServer} server
 */
widget.onServerConnected = function (server) {

};

/**
 * Fired when widget is added to a server dashboard
 * @param {RconServer} server
 */
widget.onWidgetAdded = function (server) {

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

};

/**
 * On receive a server message
 * @param {RconServer} server
 * @param {RconMessage} message
 */
widget.onServerMessage = function (server, message) {

};

module.exports = widget;