"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
var Message = /** @class */ (function () {
    function Message(_a) {
        var sender = _a.sender, content = _a.content, _b = _a.sent_at, sent_at = _b === void 0 ? new Date() : _b, edited_at = _a.edited_at;
        this.sent_at = new Date();
        this.edited_at = null;
        this.sender = sender;
        this.content = content;
        this.sent_at = sent_at;
        if (edited_at) {
            this.edited_at = edited_at;
        }
    }
    return Message;
}());
exports.Message = Message;
