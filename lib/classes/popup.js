"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Popup = /** @class */ (function () {
    function Popup(config) {
        this.config = config;
        this.chat = null;
        this.isOpen = false;
        this.chatContainer = null;
        this.container = document.querySelector(config.container);
        if (!this.container) {
            throw new Error("Container ".concat(config.container, " not found"));
        }
        this.iconElement = this.createIcon('../icons/chat.svg', 'Chat Icon');
        this.popupElement = this.createPopupElement();
        this.container.appendChild(this.popupElement);
    }
    Popup.prototype.createPopupElement = function () {
        var _this = this;
        var popupElement = document.createElement('div');
        popupElement.id = this.config.id;
        popupElement.style.position = 'absolute';
        popupElement.style.bottom = '20px';
        popupElement.style.right = '20px';
        popupElement.style.backgroundColor = this.config.color;
        popupElement.style.zIndex = '1000';
        popupElement.style.padding = '10px';
        popupElement.style.borderRadius = '50%';
        popupElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        popupElement.style.cursor = 'pointer';
        popupElement.style.display = 'flex';
        popupElement.style.alignItems = 'center';
        popupElement.style.justifyContent = 'center';
        popupElement.appendChild(this.iconElement);
        popupElement.addEventListener('click', function () { return _this.toggleChat(); });
        return popupElement;
    };
    Popup.prototype.createIcon = function (iconPath, altText) {
        var iconImg = document.createElement('img');
        iconImg.classList.add('popup-icon');
        iconImg.src = '';
        iconImg.alt = altText;
        iconImg.style.width = '40px';
        iconImg.style.height = '40px';
        return iconImg;
    };
    Popup.prototype.toggleChat = function () {
        if (this.isOpen) {
            this.closeChat();
        }
        else {
            this.openChat();
        }
    };
    Popup.prototype.openChat = function () {
        if (!this.chat)
            return;
        this.iconElement.src = '';
        this.chatContainer = document.createElement('div');
        this.chatContainer.id = 'popup-chat-container';
        this.chatContainer.style.position = 'absolute';
        this.chatContainer.style.bottom = '100px';
        this.chatContainer.style.right = '20px';
        this.chatContainer.style.width = '420px';
        this.chatContainer.style.height = '60%';
        this.chatContainer.style.backgroundColor = '#fff';
        this.chatContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        this.chatContainer.style.zIndex = '1001';
        this.chatContainer.style.borderRadius = '5px';
        this.chatContainer.style.overflow = 'hidden';
        this.chatContainer.style.display = 'flex';
        this.chatContainer.style.flexDirection = 'column';
        this.container.appendChild(this.chatContainer);
        this.chat.render('popup-chat-container');
        this.isOpen = true;
    };
    Popup.prototype.closeChat = function () {
        if (this.chatContainer) {
            this.iconElement.src = '';
            this.container.removeChild(this.chatContainer);
            this.chatContainer = null;
        }
        this.isOpen = false;
    };
    Popup.prototype.defineChat = function (chat) {
        this.chat = chat;
    };
    return Popup;
}());
exports.default = Popup;
