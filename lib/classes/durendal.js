"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var message_js_1 = require("./message.js");
var user_js_1 = require("./user.js");
var Durenchat = /** @class */ (function () {
    function Durenchat(chat) {
        this.chat_element = null;
        this.users = [];
        this.messages = [];
        this.events = {};
        this.type = chat.type;
        this.users = this.initializeUsers(chat.users);
        this.self = this.getUser(chat.self);
        var container = document.createElement('div');
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.boxSizing = 'border-box';
        this.wrapper_element = container;
    }
    // Método para renderizar o chat em um elemento específico
    Durenchat.prototype.render = function (containerId) {
        var container = document.querySelector("#".concat(containerId));
        if (!container) {
            throw new Error("Container with ID ".concat(containerId, " not found"));
        }
        container.appendChild(this.wrapper_element);
    };
    // Método para inicializar os usuários
    Durenchat.prototype.initializeUsers = function (users) {
        if (!users || !users.length) {
            throw new Error("An empty user array was provided");
        }
        return users.map(function (user) { return new user_js_1.User(user); });
    };
    // Método para adicionar ouvintes de eventos
    Durenchat.prototype.on = function (event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    };
    // Método para remover ouvintes de eventos
    Durenchat.prototype.off = function (event, listener) {
        if (!this.events[event])
            return;
        this.events[event] = this.events[event].filter(function (e) { return e !== listener; });
    };
    // Método para disparar eventos
    Durenchat.prototype.emit = function (event, data) {
        if (!this.events[event])
            return;
        this.events[event].forEach(function (listener) { return listener(data); });
    };
    // Users
    Durenchat.prototype.getUser = function (id) {
        var user = this.users.find(function (user) { return user.id === id; });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    };
    Durenchat.prototype.addUser = function (user) {
        var new_user = new user_js_1.User(user);
        this.users.push(new_user);
        return new_user;
    };
    Durenchat.prototype.updateUser = function (user) {
        var selected_user = this.getUser(user.id);
        selected_user.updateUser(user);
        return selected_user;
    };
    // Message
    Durenchat.prototype.sendMessage = function (message) {
        var user = this.getUser(message.sender);
        var new_message = new message_js_1.Message(__assign(__assign({}, message), { sender: user }));
        // Inserir a mensagem na posição correta com base na data
        var index = this.messages.findIndex(function (m) { return new Date(m.sent_at) > new Date(new_message.sent_at); });
        if (index === -1) {
            this.messages.push(new_message);
        }
        else {
            this.messages.splice(index, 0, new_message);
        }
        this.appendMessageToChat(new_message, index);
        this.emit('message-sent', new_message);
        return new_message;
    };
    // Método para adicionar a mensagem ao chat
    Durenchat.prototype.appendMessageToChat = function (message, index) {
        var messageWrapper = this.createMessageWrapper(message);
        var messageBaloon = this.createMessageBaloon(message);
        messageWrapper.appendChild(messageBaloon);
        if (this.chat_element) {
            if (index === -1 || index >= this.chat_element.children.length) {
                this.chat_element.appendChild(messageWrapper);
            }
            else {
                this.chat_element.insertBefore(messageWrapper, this.chat_element.children[index]);
            }
            // Verificar se a mensagem foi enviada pelo usuário atual
            if (message.sender.id === this.self.id) {
                this.chat_element.scrollTop = this.chat_element.scrollHeight;
            }
        }
        else {
            throw new Error('O elemento chat_element não foi encontrado.');
        }
    };
    // Método para criar o contêiner da mensagem
    Durenchat.prototype.createMessageWrapper = function (message) {
        var _a;
        var messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-container');
        messageWrapper.classList.add(message.sender.id === ((_a = this.self) === null || _a === void 0 ? void 0 : _a.id) ? 'message-container-sender' : 'message-container-receiver');
        return messageWrapper;
    };
    // Método para criar o balão da mensagem
    Durenchat.prototype.createMessageBaloon = function (message) {
        var messageBaloon = document.createElement('div');
        messageBaloon.classList.add('chat-message');
        messageBaloon.style.backgroundColor = message.sender.color;
        messageBaloon.style.color = message.sender.text_color;
        var messageContent = document.createElement('div');
        messageContent.classList.add('chat-message-content');
        if (typeof message.content === 'string') {
            messageContent.textContent = message.content;
        }
        else {
            this.appendContentToMessage(messageContent, message.content);
        }
        var messageInfo = document.createElement('div');
        messageInfo.classList.add('chat-message-date');
        messageInfo.textContent = message.sent_at.toLocaleString('pt-BR');
        messageInfo.style.opacity = '0.7';
        messageBaloon.appendChild(messageContent);
        messageBaloon.appendChild(messageInfo);
        return messageBaloon;
    };
    // Método para adicionar conteúdo ao balão da mensagem
    Durenchat.prototype.appendContentToMessage = function (messageContent, content) {
        var contentHandlers = {
            'image': this.appendImageContent.bind(this, messageContent),
            'document': this.appendDocumentContent.bind(this, messageContent),
            'audio': this.appendAudioContent.bind(this, messageContent),
            'video': this.appendVideoContent.bind(this, messageContent),
        };
        var handler = contentHandlers[content.type];
        if (handler) {
            handler(content);
        }
    };
    // Método para adicionar conteúdo de imagem
    Durenchat.prototype.appendImageContent = function (messageContent, content) {
        var img = document.createElement('img');
        img.classList.add('max-message-content');
        img.src = content.url;
        img.alt = 'Imagem';
        messageContent.appendChild(img);
        if (content.caption) {
            var caption = document.createElement('div');
            caption.classList.add('message-caption');
            caption.textContent = content.caption;
            messageContent.appendChild(caption);
        }
    };
    // Método para adicionar conteúdo de documento
    Durenchat.prototype.appendDocumentContent = function (messageContent, content) {
        var docLink = document.createElement('a');
        docLink.classList.add('max-message-content');
        docLink.href = content.url;
        docLink.textContent = content.name;
        docLink.target = '_blank';
        messageContent.appendChild(docLink);
        if (content.caption) {
            var caption = document.createElement('div');
            caption.classList.add('message-caption');
            caption.textContent = content.caption;
            messageContent.appendChild(caption);
        }
    };
    // Método para adicionar conteúdo de áudio
    Durenchat.prototype.appendAudioContent = function (messageContent, content) {
        var audio = document.createElement('audio');
        audio.classList.add('max-message-content');
        audio.controls = true;
        var audioSource = document.createElement('source');
        audioSource.src = content.url;
        audioSource.type = 'audio/mpeg';
        audio.appendChild(audioSource);
        messageContent.appendChild(audio);
    };
    // Método para adicionar conteúdo de vídeo
    Durenchat.prototype.appendVideoContent = function (messageContent, content) {
        var video = document.createElement('video');
        video.classList.add('max-message-content');
        video.controls = true;
        var videoSource = document.createElement('source');
        videoSource.src = content.url;
        videoSource.type = 'video/mp4';
        video.appendChild(videoSource);
        messageContent.appendChild(video);
        if (content.caption) {
            var caption = document.createElement('div');
            caption.classList.add('message-caption');
            caption.textContent = content.caption;
            messageContent.appendChild(caption);
        }
    };
    // Header
    Durenchat.prototype.defineHeader = function (data) {
        var header = document.createElement('div');
        header.classList.add('header-chat');
        var img = document.createElement('img');
        img.classList.add('img-header-chat');
        img.src = data.photoUrl;
        img.alt = "".concat(data.name, " photo");
        var name = document.createElement('div');
        name.classList.add('name-header-chat');
        name.textContent = data.name;
        header.appendChild(img);
        header.appendChild(name);
        this.wrapper_element.appendChild(header);
    };
    Durenchat.prototype.defineChatcontainer = function (containerId) {
        var chatContainer = document.createElement('div');
        chatContainer.id = containerId;
        chatContainer.classList.add('chat-container');
        this.chat_element = chatContainer;
        this.wrapper_element.appendChild(chatContainer);
        this.initializeDragAndDrop();
    };
    // Método para inicializar arrastar e soltar
    Durenchat.prototype.initializeDragAndDrop = function () {
        var _this = this;
        if (!this.chat_element) {
            throw new Error('O elemento chat_element não foi encontrado.');
        }
        this.chat_element.addEventListener('dragover', function (event) {
            var _a;
            event.preventDefault();
            (_a = _this.chat_element) === null || _a === void 0 ? void 0 : _a.classList.add('dragover');
        });
        this.chat_element.addEventListener('dragleave', function () {
            var _a;
            (_a = _this.chat_element) === null || _a === void 0 ? void 0 : _a.classList.remove('dragover');
        });
        this.chat_element.addEventListener('drop', function (event) {
            var _a, _b;
            event.preventDefault();
            (_a = _this.chat_element) === null || _a === void 0 ? void 0 : _a.classList.remove('dragover');
            var dragEvent = event;
            var files = (_b = dragEvent.dataTransfer) === null || _b === void 0 ? void 0 : _b.files;
            if (files && files.length > 0) {
                var file = files[0];
                _this.handleFileDrop(file);
            }
        });
    };
    // Método para lidar com o drop de arquivos
    Durenchat.prototype.handleFileDrop = function (file) {
        var _this = this;
        var reader = new FileReader();
        reader.onload = function () {
            var content = _this.createMessageContent(file, reader.result);
            if (content) {
                _this.sendMessage({
                    sender: _this.self.id,
                    content: content,
                    sent_at: new Date(),
                });
            }
        };
        reader.readAsDataURL(file);
    };
    // Método para criar o conteúdo da mensagem com base no tipo de arquivo
    Durenchat.prototype.createMessageContent = function (file, result) {
        var contentHandlers = {
            'image/': function (file, result) { return ({ type: 'image', url: result }); },
            'video/': function (file, result) { return ({ type: 'video', url: result }); },
            'application/pdf': function (file, result) { return ({ type: 'document', url: result, name: file.name }); },
            'audio/mpeg': function (file, result) { return ({ type: 'audio', url: result }); },
        };
        for (var _i = 0, _a = Object.entries(contentHandlers); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], handler = _b[1];
            if (file.type.startsWith(key)) {
                return handler(file, result);
            }
        }
        return null;
    };
    Durenchat.prototype.defineFooter = function () {
        var _this = this;
        var footer = document.createElement('div');
        footer.classList.add('footer-chat');
        var emojiIcon = this.createFooterIcon('../icons/emoji.svg', 'Emoji');
        var documentIcon = this.createFooterIcon('../icons/picture.svg', 'Imagem');
        var audioIcon = this.createFooterIcon('../icons/microphone.svg', 'Microfone');
        var inputText = document.createElement('input');
        inputText.classList.add('input-text');
        inputText.type = 'text';
        inputText.placeholder = 'Digite uma mensagem...';
        inputText.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                var messageContent = inputText.value.trim();
                if (messageContent) {
                    _this.sendMessage({
                        sender: _this.self.id,
                        content: messageContent,
                        sent_at: new Date(),
                    });
                    inputText.value = '';
                }
            }
        });
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.accept = 'image/*,video/*,application/pdf,audio/mpeg';
        documentIcon.addEventListener('click', function () {
            fileInput.click();
        });
        fileInput.addEventListener('change', function (event) {
            var _a;
            var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file) {
                _this.handleFileDrop(file);
            }
        });
        footer.appendChild(emojiIcon);
        footer.appendChild(documentIcon);
        footer.appendChild(inputText);
        footer.appendChild(audioIcon);
        footer.appendChild(fileInput);
        this.wrapper_element.appendChild(footer);
    };
    // Método para criar ícones do rodapé
    Durenchat.prototype.createFooterIcon = function (iconPath, altText) {
        var iconSpan = document.createElement('span');
        var iconImg = document.createElement('img');
        iconImg.classList.add('footer-icon');
        iconImg.src = '';
        iconImg.alt = altText;
        iconSpan.appendChild(iconImg);
        return iconSpan;
    };
    return Durenchat;
}());
exports.default = Durenchat;
