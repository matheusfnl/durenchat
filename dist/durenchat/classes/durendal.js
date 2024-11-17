import { Message } from './message.js';
import { User } from './user.js';
class Durenchat {
    constructor(id, chat) {
        this.chat_element = null;
        this.self = null;
        this.users = [];
        this.messages = [];
        this.events = {};
        this.type = chat.type;
        this.wrapper_element = document.querySelector(`${id}`);
        if (!this.wrapper_element) {
            throw new Error(`Element with the selector ${id} not found`);
        }
        if (chat.users && chat.users.length) {
            this.users = chat.users.map(user => new User(user));
        }
        else {
            throw new Error(`An empty user array was provided`);
        }
        if (chat.self) {
            this.self = this.getUser(chat.self);
        }
    }
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    off(event, listener) {
        if (!this.events[event])
            return;
        this.events[event] = this.events[event].filter(e => e !== listener);
    }
    emit(event, data) {
        if (!this.events[event])
            return;
        this.events[event].forEach(listener => listener(data));
    }
    // Users
    getUser(id) {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new Error(`User not found`);
        }
        return user;
    }
    addUser(user) {
        const new_user = new User(user);
        this.users.push(new_user);
        return new_user;
    }
    updateUser(user) {
        const selected_user = this.getUser(user.id);
        selected_user.updateUser(user);
        return selected_user;
    }
    // Message
    sendMessage(message) {
        const user = this.getUser(message.sender);
        const new_message = new Message({
            ...message,
            sender: user,
        });
        this.messages.push(new_message);
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-container');
        messageWrapper.classList.add(new_message.sender.id === this.self?.id ? 'message-container-sender' : 'message-container-receiver');
        const messageBaloon = document.createElement('div');
        messageBaloon.classList.add('chat-message');
        messageBaloon.style.backgroundColor = new_message.sender.color;
        const messageContent = document.createElement('div');
        messageContent.classList.add('chat-message-content');
        messageContent.textContent = new_message.content;
        const messageInfo = document.createElement('div');
        messageInfo.classList.add('chat-message-date');
        messageInfo.textContent = new_message.sent_at.toLocaleString('pt-BR');
        messageBaloon.appendChild(messageContent);
        messageBaloon.appendChild(messageInfo);
        messageWrapper.appendChild(messageBaloon);
        if (this.chat_element) {
            this.chat_element.appendChild(messageWrapper);
        }
        else {
            throw new Error('O elemento chat_wrapper não foi encontrado.');
        }
        this.emit('message-sent', new_message);
        return new_message;
    }
    // Header
    defineHeader(data) {
        if (!this.wrapper_element) {
            throw new Error('O elemento do wrapper não foi encontrado.');
        }
        const header = document.createElement('div');
        header.classList.add('header-chat');
        const img = document.createElement('img');
        img.classList.add('img-header-chat');
        img.src = data.photoUrl;
        img.alt = `${data.name} photo`;
        const name = document.createElement('div');
        name.classList.add('name-header-chat');
        name.textContent = data.name;
        header.appendChild(img);
        header.appendChild(name);
        this.wrapper_element.appendChild(header);
    }
    defineChatcontainer(containerId) {
        if (!this.wrapper_element) {
            throw new Error('O elemento do wrapper não foi encontrado.');
        }
        const chatContainer = document.createElement('div');
        chatContainer.id = containerId;
        chatContainer.classList.add('chat-container');
        this.chat_element = chatContainer;
        this.wrapper_element.appendChild(chatContainer);
    }
    defineFooter() {
        if (!this.wrapper_element) {
            throw new Error('O elemento do wrapper não foi encontrado.');
        }
        const footer = document.createElement('div');
        footer.classList.add('footer-chat');
        const emojiIcon = document.createElement('span');
        const emojiIconPath = new URL('../icons/emoji.svg', import.meta.url).href;
        const emojiImg = document.createElement('img');
        emojiImg.classList.add('footer-icon');
        emojiImg.src = emojiIconPath;
        emojiImg.alt = 'Emoji';
        emojiIcon.appendChild(emojiImg);
        const imageIcon = document.createElement('span');
        const imageIconPath = new URL('../icons/picture.svg', import.meta.url).href;
        const imageImg = document.createElement('img');
        imageImg.classList.add('footer-icon');
        imageImg.src = imageIconPath;
        imageImg.alt = 'Imagem';
        imageIcon.appendChild(imageImg);
        const inputText = document.createElement('input');
        inputText.classList.add('input-text');
        inputText.type = 'text';
        inputText.placeholder = 'Digite uma mensagem...';
        const audioIcon = document.createElement('span');
        const audioIconPath = new URL('../icons/microphone.svg', import.meta.url).href;
        const audioImg = document.createElement('img');
        audioImg.classList.add('footer-icon');
        audioImg.src = audioIconPath;
        audioImg.alt = 'Microfone';
        audioIcon.appendChild(audioImg);
        footer.appendChild(emojiIcon);
        footer.appendChild(imageIcon);
        footer.appendChild(inputText);
        footer.appendChild(audioIcon);
        this.wrapper_element.appendChild(footer);
    }
}
export default Durenchat;
