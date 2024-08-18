class Durenchat {
    constructor(id, options) {
        this.self = options.self;
        this.users = options.users;
        this.element = document.querySelector(`${id}`);
        if (!this.element) {
            throw new Error(`Element with the selector ${id} not found`);
        }
        const chat_container = document.createElement('div');
        chat_container.id = 'chatContainer';
        chat_container.classList.add('chat-container');
        this.element.appendChild(chat_container);
        this.chat_container = chat_container;
    }
    sendMessage(message) {
        if (!this.users.includes(message.origin)) {
            throw new Error(`Origin ${message.origin} was not found`);
        }
        const chat_message_container_div = document.createElement('div');
        chat_message_container_div.classList.add('chat-message-container');
        if (message.origin === this.self) {
            chat_message_container_div.classList.add('from-me1');
        }
        const chat_message_div = document.createElement('div');
        chat_message_div.classList.add('chat-message');
        const message_p = document.createElement('span');
        message_p.innerHTML = message.text;
        chat_message_div.appendChild(message_p);
        chat_message_container_div.appendChild(chat_message_div);
        this.chat_container.appendChild(chat_message_container_div);
    }
}
;
export default function (id, options) {
    return new Durenchat(id, options);
}
//# sourceMappingURL=durendal.js.map