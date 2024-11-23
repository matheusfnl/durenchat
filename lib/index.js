"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.popup = exports.durenchat = void 0;
var durendal_js_1 = __importDefault(require("./classes/durendal.js"));
var popup_js_1 = __importDefault(require("./classes/popup.js"));
var durenchat = function (chat) {
    return new durendal_js_1.default(chat);
};
exports.durenchat = durenchat;
var popup = function (popup) {
    return new popup_js_1.default(popup);
};
exports.popup = popup;
