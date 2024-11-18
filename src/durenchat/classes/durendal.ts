import { Chat, MessageConfig, UserConstructor } from "../utills/types.js";
import { Message } from './message.js';
import { User } from './user.js';

type EventListener = (data: any) => void;

class Durenchat {
  wrapper_element: HTMLElement | Element;
  chat_element: HTMLElement | Element | null = null;
  self: User;
  users: User[] = [];
  type: string;
  messages: Message[] = [];
  events: { [key: string]: EventListener[] } = {};

  constructor(id: string | number, chat: Chat) {
    this.type = chat.type;
    this.wrapper_element = this.getElementById(id);
    this.users = this.initializeUsers(chat.users);
    this.self = this.getUser(chat.self);
  }

  // Método para obter o elemento pelo ID
  private getElementById(id: string | number): HTMLElement | Element {
    const element = document.querySelector(`${id}`) as HTMLElement | Element;
    if (!element) {
      throw new Error(`Element with the selector ${id} not found`);
    }
    return element;
  }

  // Método para inicializar os usuários
  private initializeUsers(users: UserConstructor[]): User[] {
    if (!users || !users.length) {
      throw new Error(`An empty user array was provided`);
    }
    return users.map(user => new User(user));
  }

  // Método para adicionar ouvintes de eventos
  on(event: string, listener: EventListener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // Método para remover ouvintes de eventos
  off(event: string, listener: EventListener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(e => e !== listener);
  }

  // Método para disparar eventos
  emit(event: string, data: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(data));
  }

  // Users
  getUser(id: string | number): User {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new Error(`User not found`);
    }
    return user;
  }

  addUser(user: UserConstructor): User {
    const new_user = new User(user);
    this.users.push(new_user);
    return new_user;
  }

  updateUser(user: UserConstructor): User {
    const selected_user = this.getUser(user.id);
    selected_user.updateUser(user);
    return selected_user;
  }

  // Message
  sendMessage(message: MessageConfig): Message {
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
  private appendMessageToChat(message: Message) {
    const messageWrapper = this.createMessageWrapper(message);
    const messageBaloon = this.createMessageBaloon(message);

    messageWrapper.appendChild(messageBaloon);

    if (this.chat_element) {
      this.chat_element.appendChild(messageWrapper);
    } else {
      throw new Error('O elemento chat_wrapper não foi encontrado.');
    }
  }

  // Método para criar o contêiner da mensagem
  private createMessageWrapper(message: Message): HTMLElement {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-container');
    messageWrapper.classList.add(message.sender.id === this.self?.id ? 'message-container-sender' : 'message-container-receiver');
    return messageWrapper;
  }

  // Método para criar o balão da mensagem
  private createMessageBaloon(message: Message): HTMLElement {
    const messageBaloon = document.createElement('div');
    messageBaloon.classList.add('chat-message');
    messageBaloon.style.backgroundColor = message.sender.color;
    messageBaloon.style.color = message.sender.text_color; // Aplicar o estilo text_color ao balão

    const messageContent = document.createElement('div');
    messageContent.classList.add('chat-message-content');

    if (typeof message.content === 'string') {
      messageContent.textContent = message.content;
    } else {
      switch (message.content.type) {
        case 'image':
          const img = document.createElement('img');
          img.classList.add('max-message-content');
          img.src = message.content.url;
          img.alt = 'Imagem';
          messageContent.appendChild(img);
          if (message.content.caption) {
            const caption = document.createElement('div');
            caption.classList.add('message-caption');
            caption.textContent = message.content.caption;
            messageContent.appendChild(caption);
          }
          break;
        case 'document':
          const docLink = document.createElement('a');
          docLink.classList.add('max-message-content');
          docLink.href = message.content.url;
          docLink.textContent = message.content.name;
          docLink.target = '_blank';
          messageContent.appendChild(docLink);
          if (message.content.caption) {
            const caption = document.createElement('div');
            caption.classList.add('message-caption');
            caption.textContent = message.content.caption;
            messageContent.appendChild(caption);
          }
          break;
        case 'audio':
          const audio = document.createElement('audio');
          audio.classList.add('max-message-content');
          audio.controls = true;
          const audioSource = document.createElement('source');
          audioSource.src = message.content.url;
          audioSource.type = 'audio/mpeg';
          audio.appendChild(audioSource);
          messageContent.appendChild(audio);
          break;
        case 'video':
          const video = document.createElement('video');
          video.classList.add('max-message-content');
          video.controls = true;
          const videoSource = document.createElement('source');
          videoSource.src = message.content.url;
          videoSource.type = 'video/mp4';
          video.appendChild(videoSource);
          messageContent.appendChild(video);
          if (message.content.caption) {
            const caption = document.createElement('div');
            caption.classList.add('message-caption');
            caption.textContent = message.content.caption;
            messageContent.appendChild(caption);
          }
          break;
      }
    }

    const messageInfo = document.createElement('div');
    messageInfo.classList.add('chat-message-date');
    messageInfo.textContent = message.sent_at.toLocaleString('pt-BR');
    messageInfo.style.opacity = '0.7';

    messageBaloon.appendChild(messageContent);
    messageBaloon.appendChild(messageInfo);

    return messageBaloon;
  }

  // Header
  defineHeader(data: any) {
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

  defineChatcontainer(containerId: string) {
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
  private createFooterIcon(iconPath: string, altText: string): HTMLElement {
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