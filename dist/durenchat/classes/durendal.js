import { Message } from './message.js';
import { User } from './user.js';
class Durenchat {
    constructor(id, chat) {
        this.chat_element = null;
        this.users = [];
        this.messages = [];
        this.events = {};
        this.type = chat.type;
        this.wrapper_element = this.getElementById(id);
        this.users = this.initializeUsers(chat.users);
        this.self = this.getUser(chat.self);
    }
    // Método para obter o elemento pelo ID
    getElementById(id) {
        const element = document.querySelector(`${id}`);
        if (!element) {
            throw new Error(`Element with the selector ${id} not found`);
        }
        return element;
    }
    // Método para inicializar os usuários
    initializeUsers(users) {
        if (!users || !users.length) {
            throw new Error(`An empty user array was provided`);
        }
        return users.map(user => new User(user));
    }
    // Método para adicionar ouvintes de eventos
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    // Método para remover ouvintes de eventos
    off(event, listener) {
        if (!this.events[event])
            return;
        this.events[event] = this.events[event].filter(e => e !== listener);
    }
    // Método para disparar eventos
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
        this.appendMessageToChat(new_message);
        this.emit('message-sent', new_message);
        return new_message;
    }
    // Método para adicionar a mensagem ao chat
    appendMessageToChat(message) {
        const messageWrapper = this.createMessageWrapper(message);
        const messageBaloon = this.createMessageBaloon(message);
        messageWrapper.appendChild(messageBaloon);
        if (this.chat_element) {
            this.chat_element.appendChild(messageWrapper);
        }
        else {
            throw new Error('O elemento chat_wrapper não foi encontrado.');
        }
    }
    // Método para criar o contêiner da mensagem
    createMessageWrapper(message) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-container');
        messageWrapper.classList.add(message.sender.id === this.self?.id ? 'message-container-sender' : 'message-container-receiver');
        return messageWrapper;
    }
    // Método para criar o balão da mensagem
    createMessageBaloon(message) {
        const messageBaloon = document.createElement('div');
        messageBaloon.classList.add('chat-message');
        messageBaloon.style.backgroundColor = message.sender.color;
        const messageContent = document.createElement('div');
        messageContent.classList.add('chat-message-content');
        messageContent.textContent = message.content;
        const messageInfo = document.createElement('div');
        messageInfo.classList.add('chat-message-date');
        messageInfo.textContent = message.sent_at.toLocaleString('pt-BR');
        messageBaloon.appendChild(messageContent);
        messageBaloon.appendChild(messageInfo);
        return messageBaloon;
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
        const emojiIcon = this.createFooterIcon('../icons/emoji.svg', 'Emoji');
        const imageIcon = this.createFooterIcon('../icons/picture.svg', 'Imagem');
        const audioIcon = this.createFooterIcon('../icons/microphone.svg', 'Microfone');
        const inputText = document.createElement('input');
        inputText.classList.add('input-text');
        inputText.type = 'text';
        inputText.placeholder = 'Digite uma mensagem...';
        inputText.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const messageContent = inputText.value.trim();
                if (messageContent) {
                    this.sendMessage({
                        sender: this.self.id,
                        content: messageContent,
                        sent_at: new Date(),
                    });
                    inputText.value = '';
                }
            }
        });
        footer.appendChild(emojiIcon);
        footer.appendChild(imageIcon);
        footer.appendChild(inputText);
        footer.appendChild(audioIcon);
        this.wrapper_element.appendChild(footer);
    }
    // Método para criar ícones do rodapé
    createFooterIcon(iconPath, altText) {
        const iconSpan = document.createElement('span');
        const iconImg = document.createElement('img');
        iconImg.classList.add('footer-icon');
        iconImg.src = new URL(iconPath, import.meta.url).href;
        iconImg.alt = altText;
        iconSpan.appendChild(iconImg);
        return iconSpan;
    }
}
export default Durenchat;
