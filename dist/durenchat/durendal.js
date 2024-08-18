var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Durenchat {
    constructor(id, chat) {
        this.users = [];
        this.class_prefix = '';
        this.self = chat.self;
        this.element = document.querySelector(`${id}`);
        if (chat.class_prefix) {
            this.class_prefix = chat.class_prefix;
            this.addPrefixedStyles(chat.class_prefix);
        }
        if (chat.users) {
            if (!chat.users.length) {
                throw new Error(`An empty user array was provided`);
            }
            this.users = chat.users;
        }
        if (!this.element) {
            throw new Error(`Element with the selector ${id} not found`);
        }
        const chat_container = document.createElement('div');
        chat_container.id = 'chatContainer';
        chat_container.classList.add(this._class('chat-container'));
        this.element.appendChild(chat_container);
        this.chat_container = chat_container;
    }
    // Send a new message to the chat
    sendMessage(message) {
        if (!this.users.find(user => user.id === message.origin)) {
            throw new Error(`Origin ${message.origin} was not found`);
        }
        const chat_message_container_div = document.createElement('div');
        chat_message_container_div.classList.add(this._class('chat-message-container'));
        if (message.origin === this.self) {
            chat_message_container_div.classList.add(this._class('from-me'));
        }
        const chat_message_div = document.createElement('div');
        chat_message_div.classList.add(this._class('chat-message'));
        const message_p = document.createElement('span');
        message_p.innerHTML = message.text;
        chat_message_div.appendChild(message_p);
        chat_message_container_div.appendChild(chat_message_div);
        this.chat_container.appendChild(chat_message_container_div);
    }
    // Add a new user to the chat
    addUser(user) {
        this.users.push(user);
    }
    _class(name) {
        return `${this.class_prefix}-${name}`;
    }
    addPrefixedStyles(prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('src/durenchat/durendal.css');
                const cssText = yield response.text();
                const prefixedCss = this.prefixCssClasses(cssText, prefix);
                console.log(prefixedCss);
                const style = document.createElement('style');
                style.type = 'text/css';
                style.appendChild(document.createTextNode(prefixedCss));
                document.head.appendChild(style);
            }
            catch (error) {
                console.error('Erro ao carregar o arquivo CSS:', error);
            }
        });
    }
    prefixCssClasses(cssText, prefix) {
        // Regex para encontrar todas as classes CSS
        const classRegex = /\.([a-zA-Z0-9_-]+)\s*{/g;
        let match;
        let prefixedCss = cssText;
        // Iterar sobre todas as classes encontradas e adicionar o prefixo
        while ((match = classRegex.exec(cssText)) !== null) {
            const className = match[1];
            const prefixedClassName = `${prefix}-${className}`;
            const classRegexSingle = new RegExp(`\\.${className}(\\s*{)`, 'g');
            prefixedCss = prefixedCss.replace(classRegexSingle, `.${prefixedClassName}$1`);
        }
        return prefixedCss;
    }
}
;
export default function (id, chat) {
    return new Durenchat(id, chat);
}
