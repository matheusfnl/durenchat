"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(_a) {
        var id = _a.id, name = _a.name, color = _a.color, text_color = _a.text_color, photoUrl = _a.photoUrl;
        this.text_color = '#000000';
        this.id = id;
        this.name = name;
        this.color = color;
        this.photoUrl = photoUrl;
        if (text_color) {
            this.text_color = text_color;
        }
    }
    User.prototype.updateUser = function (user) {
        for (var _i = 0, _a = Object.keys(user); _i < _a.length; _i++) {
            var field = _a[_i];
            if (field === 'id' || !(field in this))
                continue;
            var value = user[field];
            var type = this[field];
            if (typeof value !== typeof type) {
                throw new Error("Invalid type for ".concat(field, ": expected ").concat(typeof type, ", got ").concat(typeof value));
            }
            if (typeof value === 'string' && value === '') {
                throw new Error("".concat(field.charAt(0).toUpperCase() + field.slice(1), " cannot be empty"));
            }
            this[field] = value;
        }
    };
    return User;
}());
exports.User = User;
