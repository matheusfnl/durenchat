import { Chat, MessageConfig, UserConstructor, MessageContent } from "../utills/types.js";
import { Message } from './message.js';
import { User } from './user.js';

type EventListener = (data: any) => void;

class Durenchat {
  wrapper_element: HTMLElement;
  chat_element: HTMLElement | null = null;
  self: User;
  users: User[] = [];
  type: string;
  messages: Message[] = [];
  events: { [key: string]: EventListener[] } = {};

  constructor(chat: Chat) {
    this.type = chat.type;
    this.users = this.initializeUsers(chat.users);
    this.self = this.getUser(chat.self);

    const container = document.createElement('div');
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.boxSizing = 'border-box';

    this.wrapper_element = container;
  }

  // Método para renderizar o chat em um elemento específico
  render(containerId: string) {
    const container = document.querySelector(`#${containerId}`) as HTMLElement;
    if (!container) {
      throw new Error(`Container with ID ${containerId} not found`);
    }

    container.appendChild(this.wrapper_element);
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

    // Inserir a mensagem na posição correta com base na data
    const index = this.messages.findIndex(m => new Date(m.sent_at) > new Date(new_message.sent_at));
    if (index === -1) {
      this.messages.push(new_message);
    } else {
      this.messages.splice(index, 0, new_message);
    }

    this.appendMessageToChat(new_message, index);
    this.emit('message-sent', new_message);

    return new_message;
  }

  // Método para adicionar a mensagem ao chat
  private appendMessageToChat(message: Message, index: number) {
    const messageWrapper = this.createMessageWrapper(message);
    const messageBaloon = this.createMessageBaloon(message);

    messageWrapper.appendChild(messageBaloon);

    if (this.chat_element) {
      if (index === -1 || index >= this.chat_element.children.length) {
        this.chat_element.appendChild(messageWrapper);
      } else {
        this.chat_element.insertBefore(messageWrapper, this.chat_element.children[index]);
      }

      // Verificar se a mensagem foi enviada pelo usuário atual
      if (message.sender.id === this.self.id) {
        this.chat_element.scrollTop = this.chat_element.scrollHeight;
      }
    } else {
      throw new Error('O elemento chat_element não foi encontrado.');
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
    messageBaloon.style.color = message.sender.text_color;

    const messageContent = document.createElement('div');
    messageContent.classList.add('chat-message-content');

    if (typeof message.content === 'string') {
      messageContent.textContent = message.content;
    } else {
      this.appendContentToMessage(messageContent, message.content);
    }

    const messageInfo = document.createElement('div');
    messageInfo.classList.add('chat-message-date');
    messageInfo.textContent = message.sent_at.toLocaleString('pt-BR');
    messageInfo.style.opacity = '0.7';

    messageBaloon.appendChild(messageContent);
    messageBaloon.appendChild(messageInfo);

    return messageBaloon;
  }

  // Método para adicionar conteúdo ao balão da mensagem
  private appendContentToMessage(messageContent: HTMLElement, content: Exclude<MessageContent, string>) {
    const contentHandlers: { [key: string]: (content: any) => void } = {
      'image': this.appendImageContent.bind(this, messageContent),
      'document': this.appendDocumentContent.bind(this, messageContent),
      'audio': this.appendAudioContent.bind(this, messageContent),
      'video': this.appendVideoContent.bind(this, messageContent),
    };

    const handler = contentHandlers[content.type];
    if (handler) {
      handler(content);
    }
  }

  // Método para adicionar conteúdo de imagem
  private appendImageContent(messageContent: HTMLElement, content: { type: 'image', url: string, caption?: string }) {
    const img = document.createElement('img');
    img.classList.add('max-message-content');
    img.src = content.url;
    img.alt = 'Imagem';
    messageContent.appendChild(img);
    if (content.caption) {
      const caption = document.createElement('div');
      caption.classList.add('message-caption');
      caption.textContent = content.caption;
      messageContent.appendChild(caption);
    }
  }

  // Método para adicionar conteúdo de documento
  private appendDocumentContent(messageContent: HTMLElement, content: { type: 'document', url: string, name: string, caption?: string }) {
    const docLink = document.createElement('a');
    docLink.classList.add('max-message-content');
    docLink.href = content.url;
    docLink.textContent = content.name;
    docLink.target = '_blank';
    messageContent.appendChild(docLink);
    if (content.caption) {
      const caption = document.createElement('div');
      caption.classList.add('message-caption');
      caption.textContent = content.caption;
      messageContent.appendChild(caption);
    }
  }

  // Método para adicionar conteúdo de áudio
  private appendAudioContent(messageContent: HTMLElement, content: { type: 'audio', url: string }) {
    const audio = document.createElement('audio');
    audio.classList.add('max-message-content');
    audio.controls = true;
    const audioSource = document.createElement('source');
    audioSource.src = content.url;
    audioSource.type = 'audio/mpeg';
    audio.appendChild(audioSource);
    messageContent.appendChild(audio);
  }

  // Método para adicionar conteúdo de vídeo
  private appendVideoContent(messageContent: HTMLElement, content: { type: 'video', url: string, caption?: string }) {
    const video = document.createElement('video');
    video.classList.add('max-message-content');
    video.controls = true;
    const videoSource = document.createElement('source');
    videoSource.src = content.url;
    videoSource.type = 'video/mp4';
    video.appendChild(videoSource);
    messageContent.appendChild(video);
    if (content.caption) {
      const caption = document.createElement('div');
      caption.classList.add('message-caption');
      caption.textContent = content.caption;
      messageContent.appendChild(caption);
    }
  }

  // Header
  defineHeader(data: any) {
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
    const chatContainer = document.createElement('div');
    chatContainer.id = containerId;
    chatContainer.classList.add('chat-container');

    this.chat_element = chatContainer;
    this.wrapper_element.appendChild(chatContainer);

    this.initializeDragAndDrop();
  }

  // Método para inicializar arrastar e soltar
  private initializeDragAndDrop() {
    if (!this.chat_element) {
      throw new Error('O elemento chat_element não foi encontrado.');
    }

    this.chat_element.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.chat_element?.classList.add('dragover');
    });

    this.chat_element.addEventListener('dragleave', () => {
      this.chat_element?.classList.remove('dragover');
    });

    this.chat_element.addEventListener('drop', (event) => {
      event.preventDefault();
      this.chat_element?.classList.remove('dragover');

      const dragEvent = event as DragEvent;
      const files = dragEvent.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        this.handleFileDrop(file);
      }
    });
  }

  // Método para lidar com o drop de arquivos
  private handleFileDrop(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = this.createMessageContent(file, reader.result as string);
      if (content) {
        this.sendMessage({
          sender: this.self.id,
          content: content,
          sent_at: new Date(),
        });
      }
    };
    reader.readAsDataURL(file);
  }

  // Método para criar o conteúdo da mensagem com base no tipo de arquivo
  private createMessageContent(file: File, result: string): MessageContent | null {
    const contentHandlers: { [key: string]: (file: File, result: string) => MessageContent } = {
      'image/': (file, result) => ({ type: 'image', url: result }),
      'video/': (file, result) => ({ type: 'video', url: result }),
      'application/pdf': (file, result) => ({ type: 'document', url: result, name: file.name }),
      'audio/mpeg': (file, result) => ({ type: 'audio', url: result }),
    };

    for (const [key, handler] of Object.entries(contentHandlers)) {
      if (file.type.startsWith(key)) {
        return handler(file, result);
      }
    }

    return null;
  }

  defineFooter() {
    const footer = document.createElement('div');
    footer.classList.add('footer-chat');

    const emojiIcon = this.createFooterIcon('../icons/emoji.svg', 'Emoji');
    const documentIcon = this.createFooterIcon('../icons/picture.svg', 'Imagem');
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

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.accept = 'image/*,video/*,application/pdf,audio/mpeg';

    documentIcon.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.handleFileDrop(file);
      }
    });

    footer.appendChild(emojiIcon);
    footer.appendChild(documentIcon);
    footer.appendChild(inputText);
    footer.appendChild(audioIcon);
    footer.appendChild(fileInput);

    this.wrapper_element.appendChild(footer);
  }

  // Método para criar ícones do rodapé
  private createFooterIcon(iconPath: string, altText: string): HTMLElement {
    const iconSpan = document.createElement('span');
    const iconImg = document.createElement('img');
    iconImg.classList.add('footer-icon');
    iconImg.src = '';
    iconImg.alt = altText;
    iconSpan.appendChild(iconImg);
    return iconSpan;
  }
}

export default Durenchat;