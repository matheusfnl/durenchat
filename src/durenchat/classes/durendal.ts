  import { Chat, MessageConfig, UserConstructor } from "../utills/types.js";
  import { Message } from './message.js';
  import { User } from './user.js';

  class Durenchat {
    wrapper_element: HTMLElement | Element;
    chat_element: HTMLElement | Element | null = null;
    self: User | null = null
    users: User[] = [];
    type: string;
    messages: Message[] = [];

    constructor(id: string | number, chat: Chat) {
      this.type = chat.type;
      this.wrapper_element = document.querySelector(`${id}`) as HTMLElement | Element;

      if (!this.wrapper_element) {
        throw new Error(`Element with the selector ${id} not found`);
      }

      if (chat.users && chat.users.length) {
        this.users = chat.users.map(user => new User(user));
      } else {
        throw new Error(`An empty user array was provided`);
      }

      if (chat.self) {
        this.self = this.getUser(chat.self);
      }
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

      return new_message;
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

      this.wrapper_element.appendChild(chatContainer);
    }

    defineFooter() {
      if (!this.wrapper_element) {
        throw new Error('O elemento do wrapper não foi encontrado.');
      }

      const footer = document.createElement('div');
      footer.classList.add('footer-chat');

      // Criar o ícone de emoji
      const emojiIcon = document.createElement('span');
      const emojiIconPath = new URL('../icons/emoji.svg', import.meta.url).href;
      const emojiImg = document.createElement('img');
      emojiImg.classList.add('footer-icon');
      emojiImg.src = emojiIconPath;
      emojiImg.alt = 'Emoji';

      emojiIcon.appendChild(emojiImg);

      // Criar o ícone de imagem
      const imageIcon = document.createElement('span');
      const imageIconPath = new URL('../icons/picture.svg', import.meta.url).href;
      const imageImg = document.createElement('img');
      imageImg.classList.add('footer-icon');
      imageImg.src = imageIconPath;
      imageImg.alt = 'Imagem';

      imageIcon.appendChild(imageImg);

      // Criar o input de texto
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

      // Adicionar os elementos ao footer
      footer.appendChild(emojiIcon);
      footer.appendChild(imageIcon);
      footer.appendChild(inputText);
      footer.appendChild(audioIcon);

      // Adicionar o footer ao wrapper
      this.wrapper_element.appendChild(footer);
    }
  }

  export default Durenchat;