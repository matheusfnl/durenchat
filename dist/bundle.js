/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Durenchat"] = factory();
	else
		root["Durenchat"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/classes/durendal.ts":
/*!*********************************!*\
  !*** ./src/classes/durendal.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./message */ \"./src/classes/message.ts\");\n/* harmony import */ var _user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./user */ \"./src/classes/user.ts\");\n\n\nclass Durenchat {\n    constructor(chat) {\n        this.chat_element = null;\n        this.users = [];\n        this.messages = [];\n        this.events = {};\n        this.type = chat.type;\n        this.users = this.initializeUsers(chat.users);\n        this.self = this.getUser(chat.self);\n        const container = document.createElement('div');\n        container.style.height = '100%';\n        container.style.display = 'flex';\n        container.style.flexDirection = 'column';\n        container.style.boxSizing = 'border-box';\n        this.wrapper_element = container;\n    }\n    // Método para renderizar o chat em um elemento específico\n    render(containerId) {\n        const container = document.querySelector(`#${containerId}`);\n        if (!container) {\n            throw new Error(`Container with ID ${containerId} not found`);\n        }\n        container.appendChild(this.wrapper_element);\n    }\n    // Método para inicializar os usuários\n    initializeUsers(users) {\n        if (!users || !users.length) {\n            throw new Error(`An empty user array was provided`);\n        }\n        return users.map(user => new _user__WEBPACK_IMPORTED_MODULE_1__.User(user));\n    }\n    // Método para adicionar ouvintes de eventos\n    on(event, listener) {\n        if (!this.events[event]) {\n            this.events[event] = [];\n        }\n        this.events[event].push(listener);\n    }\n    // Método para remover ouvintes de eventos\n    off(event, listener) {\n        if (!this.events[event])\n            return;\n        this.events[event] = this.events[event].filter(e => e !== listener);\n    }\n    // Método para disparar eventos\n    emit(event, data) {\n        if (!this.events[event])\n            return;\n        this.events[event].forEach(listener => listener(data));\n    }\n    // Users\n    getUser(id) {\n        const user = this.users.find(user => user.id === id);\n        if (!user) {\n            throw new Error(`User not found`);\n        }\n        return user;\n    }\n    addUser(user) {\n        const new_user = new _user__WEBPACK_IMPORTED_MODULE_1__.User(user);\n        this.users.push(new_user);\n        return new_user;\n    }\n    updateUser(user) {\n        const selected_user = this.getUser(user.id);\n        selected_user.updateUser(user);\n        return selected_user;\n    }\n    // Message\n    sendMessage(message) {\n        const user = this.getUser(message.sender);\n        const new_message = new _message__WEBPACK_IMPORTED_MODULE_0__.Message(Object.assign(Object.assign({}, message), { sender: user }));\n        // Inserir a mensagem na posição correta com base na data\n        const index = this.messages.findIndex(m => new Date(m.sent_at) > new Date(new_message.sent_at));\n        if (index === -1) {\n            this.messages.push(new_message);\n        }\n        else {\n            this.messages.splice(index, 0, new_message);\n        }\n        this.appendMessageToChat(new_message, index);\n        this.emit('message-sent', new_message);\n        return new_message;\n    }\n    // Método para adicionar a mensagem ao chat\n    appendMessageToChat(message, index) {\n        const messageWrapper = this.createMessageWrapper(message);\n        const messageBaloon = this.createMessageBaloon(message);\n        messageWrapper.appendChild(messageBaloon);\n        if (this.chat_element) {\n            if (index === -1 || index >= this.chat_element.children.length) {\n                this.chat_element.appendChild(messageWrapper);\n            }\n            else {\n                this.chat_element.insertBefore(messageWrapper, this.chat_element.children[index]);\n            }\n            // Verificar se a mensagem foi enviada pelo usuário atual\n            if (message.sender.id === this.self.id) {\n                this.chat_element.scrollTop = this.chat_element.scrollHeight;\n            }\n        }\n        else {\n            throw new Error('O elemento chat_element não foi encontrado.');\n        }\n    }\n    // Método para criar o contêiner da mensagem\n    createMessageWrapper(message) {\n        var _a;\n        const messageWrapper = document.createElement('div');\n        messageWrapper.classList.add('message-container');\n        messageWrapper.classList.add(message.sender.id === ((_a = this.self) === null || _a === void 0 ? void 0 : _a.id) ? 'message-container-sender' : 'message-container-receiver');\n        return messageWrapper;\n    }\n    // Método para criar o balão da mensagem\n    createMessageBaloon(message) {\n        const messageBaloon = document.createElement('div');\n        messageBaloon.classList.add('chat-message');\n        messageBaloon.style.backgroundColor = message.sender.color;\n        messageBaloon.style.color = message.sender.text_color;\n        const messageContent = document.createElement('div');\n        messageContent.classList.add('chat-message-content');\n        if (typeof message.content === 'string') {\n            messageContent.textContent = message.content;\n        }\n        else {\n            this.appendContentToMessage(messageContent, message.content);\n        }\n        const messageInfo = document.createElement('div');\n        messageInfo.classList.add('chat-message-date');\n        messageInfo.textContent = message.sent_at.toLocaleString('pt-BR');\n        messageInfo.style.opacity = '0.7';\n        messageBaloon.appendChild(messageContent);\n        messageBaloon.appendChild(messageInfo);\n        return messageBaloon;\n    }\n    // Método para adicionar conteúdo ao balão da mensagem\n    appendContentToMessage(messageContent, content) {\n        const contentHandlers = {\n            'image': this.appendImageContent.bind(this, messageContent),\n            'document': this.appendDocumentContent.bind(this, messageContent),\n            'audio': this.appendAudioContent.bind(this, messageContent),\n            'video': this.appendVideoContent.bind(this, messageContent),\n        };\n        const handler = contentHandlers[content.type];\n        if (handler) {\n            handler(content);\n        }\n    }\n    // Método para adicionar conteúdo de imagem\n    appendImageContent(messageContent, content) {\n        const img = document.createElement('img');\n        img.classList.add('max-message-content');\n        img.src = content.url;\n        img.alt = 'Imagem';\n        messageContent.appendChild(img);\n        if (content.caption) {\n            const caption = document.createElement('div');\n            caption.classList.add('message-caption');\n            caption.textContent = content.caption;\n            messageContent.appendChild(caption);\n        }\n    }\n    // Método para adicionar conteúdo de documento\n    appendDocumentContent(messageContent, content) {\n        const docLink = document.createElement('a');\n        docLink.classList.add('max-message-content');\n        docLink.href = content.url;\n        docLink.textContent = content.name;\n        docLink.target = '_blank';\n        messageContent.appendChild(docLink);\n        if (content.caption) {\n            const caption = document.createElement('div');\n            caption.classList.add('message-caption');\n            caption.textContent = content.caption;\n            messageContent.appendChild(caption);\n        }\n    }\n    // Método para adicionar conteúdo de áudio\n    appendAudioContent(messageContent, content) {\n        const audio = document.createElement('audio');\n        audio.classList.add('max-message-content');\n        audio.controls = true;\n        const audioSource = document.createElement('source');\n        audioSource.src = content.url;\n        audioSource.type = 'audio/mpeg';\n        audio.appendChild(audioSource);\n        messageContent.appendChild(audio);\n    }\n    // Método para adicionar conteúdo de vídeo\n    appendVideoContent(messageContent, content) {\n        const video = document.createElement('video');\n        video.classList.add('max-message-content');\n        video.controls = true;\n        const videoSource = document.createElement('source');\n        videoSource.src = content.url;\n        videoSource.type = 'video/mp4';\n        video.appendChild(videoSource);\n        messageContent.appendChild(video);\n        if (content.caption) {\n            const caption = document.createElement('div');\n            caption.classList.add('message-caption');\n            caption.textContent = content.caption;\n            messageContent.appendChild(caption);\n        }\n    }\n    // Header\n    defineHeader(data) {\n        const header = document.createElement('div');\n        header.classList.add('header-chat');\n        const img = document.createElement('img');\n        img.classList.add('img-header-chat');\n        img.src = data.photoUrl;\n        img.alt = `${data.name} photo`;\n        const name = document.createElement('div');\n        name.classList.add('name-header-chat');\n        name.textContent = data.name;\n        header.appendChild(img);\n        header.appendChild(name);\n        this.wrapper_element.appendChild(header);\n    }\n    defineChatcontainer(containerId) {\n        const chatContainer = document.createElement('div');\n        chatContainer.id = containerId;\n        chatContainer.classList.add('chat-container');\n        this.chat_element = chatContainer;\n        this.wrapper_element.appendChild(chatContainer);\n        this.initializeDragAndDrop();\n    }\n    // Método para inicializar arrastar e soltar\n    initializeDragAndDrop() {\n        if (!this.chat_element) {\n            throw new Error('O elemento chat_element não foi encontrado.');\n        }\n        this.chat_element.addEventListener('dragover', (event) => {\n            var _a;\n            event.preventDefault();\n            (_a = this.chat_element) === null || _a === void 0 ? void 0 : _a.classList.add('dragover');\n        });\n        this.chat_element.addEventListener('dragleave', () => {\n            var _a;\n            (_a = this.chat_element) === null || _a === void 0 ? void 0 : _a.classList.remove('dragover');\n        });\n        this.chat_element.addEventListener('drop', (event) => {\n            var _a, _b;\n            event.preventDefault();\n            (_a = this.chat_element) === null || _a === void 0 ? void 0 : _a.classList.remove('dragover');\n            const dragEvent = event;\n            const files = (_b = dragEvent.dataTransfer) === null || _b === void 0 ? void 0 : _b.files;\n            if (files && files.length > 0) {\n                const file = files[0];\n                this.handleFileDrop(file);\n            }\n        });\n    }\n    // Método para lidar com o drop de arquivos\n    handleFileDrop(file) {\n        const reader = new FileReader();\n        reader.onload = () => {\n            const content = this.createMessageContent(file, reader.result);\n            if (content) {\n                this.sendMessage({\n                    sender: this.self.id,\n                    content: content,\n                    sent_at: new Date(),\n                });\n            }\n        };\n        reader.readAsDataURL(file);\n    }\n    // Método para criar o conteúdo da mensagem com base no tipo de arquivo\n    createMessageContent(file, result) {\n        const contentHandlers = {\n            'image/': (file, result) => ({ type: 'image', url: result }),\n            'video/': (file, result) => ({ type: 'video', url: result }),\n            'application/pdf': (file, result) => ({ type: 'document', url: result, name: file.name }),\n            'audio/mpeg': (file, result) => ({ type: 'audio', url: result }),\n        };\n        for (const [key, handler] of Object.entries(contentHandlers)) {\n            if (file.type.startsWith(key)) {\n                return handler(file, result);\n            }\n        }\n        return null;\n    }\n    defineFooter() {\n        const footer = document.createElement('div');\n        footer.classList.add('footer-chat');\n        const emojiIcon = this.createFooterIcon('../icons/emoji.svg', 'Emoji');\n        const documentIcon = this.createFooterIcon('../icons/picture.svg', 'Imagem');\n        const audioIcon = this.createFooterIcon('../icons/microphone.svg', 'Microfone');\n        const inputText = document.createElement('input');\n        inputText.classList.add('input-text');\n        inputText.type = 'text';\n        inputText.placeholder = 'Digite uma mensagem...';\n        inputText.addEventListener('keydown', (event) => {\n            if (event.key === 'Enter') {\n                const messageContent = inputText.value.trim();\n                if (messageContent) {\n                    this.sendMessage({\n                        sender: this.self.id,\n                        content: messageContent,\n                        sent_at: new Date(),\n                    });\n                    inputText.value = '';\n                }\n            }\n        });\n        const fileInput = document.createElement('input');\n        fileInput.type = 'file';\n        fileInput.style.display = 'none';\n        fileInput.accept = 'image/*,video/*,application/pdf,audio/mpeg';\n        documentIcon.addEventListener('click', () => {\n            fileInput.click();\n        });\n        fileInput.addEventListener('change', (event) => {\n            var _a;\n            const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];\n            if (file) {\n                this.handleFileDrop(file);\n            }\n        });\n        footer.appendChild(emojiIcon);\n        footer.appendChild(documentIcon);\n        footer.appendChild(inputText);\n        footer.appendChild(audioIcon);\n        footer.appendChild(fileInput);\n        this.wrapper_element.appendChild(footer);\n    }\n    // Método para criar ícones do rodapé\n    createFooterIcon(iconPath, altText) {\n        const iconSpan = document.createElement('span');\n        const iconImg = document.createElement('img');\n        iconImg.classList.add('footer-icon');\n        iconImg.src = '';\n        iconImg.alt = altText;\n        iconSpan.appendChild(iconImg);\n        return iconSpan;\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Durenchat);\n\n\n//# sourceURL=webpack://Durenchat/./src/classes/durendal.ts?");

/***/ }),

/***/ "./src/classes/message.ts":
/*!********************************!*\
  !*** ./src/classes/message.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Message: () => (/* binding */ Message)\n/* harmony export */ });\nclass Message {\n    constructor({ sender, content, sent_at = new Date(), edited_at }) {\n        this.sent_at = new Date();\n        this.edited_at = null;\n        this.sender = sender;\n        this.content = content;\n        this.sent_at = sent_at;\n        if (edited_at) {\n            this.edited_at = edited_at;\n        }\n    }\n}\n\n\n//# sourceURL=webpack://Durenchat/./src/classes/message.ts?");

/***/ }),

/***/ "./src/classes/popup.ts":
/*!******************************!*\
  !*** ./src/classes/popup.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Popup {\n    constructor(config) {\n        this.config = config;\n        this.chat = null;\n        this.isOpen = false;\n        this.chatContainer = null;\n        this.container = document.querySelector(config.container);\n        if (!this.container) {\n            throw new Error(`Container ${config.container} not found`);\n        }\n        this.iconElement = this.createIcon('../icons/chat.svg', 'Chat Icon');\n        this.popupElement = this.createPopupElement();\n        this.container.appendChild(this.popupElement);\n    }\n    createPopupElement() {\n        const popupElement = document.createElement('div');\n        popupElement.id = this.config.id;\n        popupElement.style.position = 'absolute';\n        popupElement.style.bottom = '20px';\n        popupElement.style.right = '20px';\n        popupElement.style.backgroundColor = this.config.color;\n        popupElement.style.zIndex = '1000';\n        popupElement.style.padding = '10px';\n        popupElement.style.borderRadius = '50%';\n        popupElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';\n        popupElement.style.cursor = 'pointer';\n        popupElement.style.display = 'flex';\n        popupElement.style.alignItems = 'center';\n        popupElement.style.justifyContent = 'center';\n        popupElement.appendChild(this.iconElement);\n        popupElement.addEventListener('click', () => this.toggleChat());\n        return popupElement;\n    }\n    createIcon(iconPath, altText) {\n        const iconImg = document.createElement('img');\n        iconImg.classList.add('popup-icon');\n        iconImg.src = '';\n        iconImg.alt = altText;\n        iconImg.style.width = '40px';\n        iconImg.style.height = '40px';\n        return iconImg;\n    }\n    toggleChat() {\n        if (this.isOpen) {\n            this.closeChat();\n        }\n        else {\n            this.openChat();\n        }\n    }\n    openChat() {\n        if (!this.chat)\n            return;\n        this.iconElement.src = '';\n        this.chatContainer = document.createElement('div');\n        this.chatContainer.id = 'popup-chat-container';\n        this.chatContainer.style.position = 'absolute';\n        this.chatContainer.style.bottom = '100px';\n        this.chatContainer.style.right = '20px';\n        this.chatContainer.style.width = '420px';\n        this.chatContainer.style.height = '60%';\n        this.chatContainer.style.backgroundColor = '#fff';\n        this.chatContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';\n        this.chatContainer.style.zIndex = '1001';\n        this.chatContainer.style.borderRadius = '5px';\n        this.chatContainer.style.overflow = 'hidden';\n        this.chatContainer.style.display = 'flex';\n        this.chatContainer.style.flexDirection = 'column';\n        this.container.appendChild(this.chatContainer);\n        this.chat.render('popup-chat-container');\n        this.isOpen = true;\n    }\n    closeChat() {\n        if (this.chatContainer) {\n            this.iconElement.src = '';\n            this.container.removeChild(this.chatContainer);\n            this.chatContainer = null;\n        }\n        this.isOpen = false;\n    }\n    defineChat(chat) {\n        this.chat = chat;\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Popup);\n\n\n//# sourceURL=webpack://Durenchat/./src/classes/popup.ts?");

/***/ }),

/***/ "./src/classes/user.ts":
/*!*****************************!*\
  !*** ./src/classes/user.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   User: () => (/* binding */ User)\n/* harmony export */ });\nclass User {\n    constructor({ id, name, color, text_color, photoUrl, }) {\n        this.text_color = '#000000';\n        this.id = id;\n        this.name = name;\n        this.color = color;\n        this.photoUrl = photoUrl;\n        if (text_color) {\n            this.text_color = text_color;\n        }\n    }\n    updateUser(user) {\n        for (const field of Object.keys(user)) {\n            if (field === 'id' || !(field in this))\n                continue;\n            const value = user[field];\n            const type = this[field];\n            if (typeof value !== typeof type) {\n                throw new Error(`Invalid type for ${field}: expected ${typeof type}, got ${typeof value}`);\n            }\n            if (typeof value === 'string' && value === '') {\n                throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`);\n            }\n            this[field] = value;\n        }\n    }\n}\n\n\n//# sourceURL=webpack://Durenchat/./src/classes/user.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   durenchat: () => (/* binding */ durenchat),\n/* harmony export */   popup: () => (/* binding */ popup)\n/* harmony export */ });\n/* harmony import */ var _classes_durendal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/durendal */ \"./src/classes/durendal.ts\");\n/* harmony import */ var _classes_popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes/popup */ \"./src/classes/popup.ts\");\n\n\nconst durenchat = (chat) => {\n    return new _classes_durendal__WEBPACK_IMPORTED_MODULE_0__[\"default\"](chat);\n};\nconst popup = (popup) => {\n    return new _classes_popup__WEBPACK_IMPORTED_MODULE_1__[\"default\"](popup);\n};\n\n\n//# sourceURL=webpack://Durenchat/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});