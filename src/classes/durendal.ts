import 'emoji-picker-element';

const MicRecorder = require('mic-recorder-to-mp3');

import { Chat, MessageConfig, UserConstructor, MessageContent } from "../utills/types";
import { Message } from './message';
import { User } from './user';

type EventListener = (data: any) => void;

class Durenchat {
  private wrapperElement: HTMLElement;
  private chatElement: HTMLElement | null = null;
  private footerElement: HTMLElement | null = null;
  private audioFooterElement: HTMLElement | null = null;
  private optionsElement: HTMLElement | null = null;
  private self: User;
  private users: User[] = [];
  private messages: Message[] = [];
  private events: { [key: string]: EventListener[] } = {};
  private recorder: any;
  private isRecording: boolean = false;

  constructor(chat: Chat) {
    this.users = this.initializeUsers(chat.users);
    this.self = this.getUser(chat.self);
    this.recorder = new MicRecorder({ bitRate: 128 });

    const container = document.createElement('div');
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.boxSizing = 'border-box';

    this.wrapperElement = container;
  }

  // Método para renderizar o chat em um elemento específico
  public render(containerId: string) {
    const container = document.querySelector(`#${containerId}`) as HTMLElement;
    if (!container) {
      throw new Error(`Container with ID ${containerId} not found`);
    }

    container.appendChild(this.wrapperElement);
  }

  // Método para inicializar os usuários
  private initializeUsers(users: UserConstructor[]): User[] {
    if (!users || !users.length) {
      throw new Error(`An empty user array was provided`);
    }
    return users.map(user => new User(user));
  }

  // Método para adicionar ouvintes de eventos
  public on(event: string, listener: EventListener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // Método para remover ouvintes de eventos
  public off(event: string, listener: EventListener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(e => e !== listener);
  }

  // Método para disparar eventos
  private emit(event: string, data?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(data));
  }

  // Users
  public getUser(id: string | number): User {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new Error(`User not found`);
    }
    return user;
  }

  public addUser(user: UserConstructor): User {
    const new_user = new User(user);
    this.users.push(new_user);
    return new_user;
  }

  public updateUser(user: UserConstructor): User {
    const selected_user = this.getUser(user.id);
    selected_user.updateUser(user);
    return selected_user;
  }

  // Message
  public sendMessage(message: MessageConfig): Message {
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

    const messageElement = this.appendMessageToChat(new_message, index);
    new_message.setElement(messageElement);
    this.emit('message-sent', new_message);

    return new_message;
  }

  // Método para adicionar a mensagem ao chat
  private appendMessageToChat(message: Message, index: number) {
    const messageWrapper = this.createMessageWrapper(message);
    const messageBaloon = this.createMessageBaloon(message);

    messageWrapper.appendChild(messageBaloon);

    if (this.chatElement) {
      if (index === -1 || index >= this.chatElement.children.length) {
        this.chatElement.appendChild(messageWrapper);
      } else {
        this.chatElement.insertBefore(messageWrapper, this.chatElement.children[index]);
      }

      if (message.sender.id === this.self.id) {
        this.chatElement.scrollTop = this.chatElement.scrollHeight;
      }
    } else {
      throw new Error('O elemento chatElement não foi encontrado.');
    }

    return messageWrapper;
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
    messageBaloon.style.position = 'relative';

    const messageContent = document.createElement('div');
    messageContent.classList.add('chat-message-content');

    if (typeof message.content === 'string') {
      messageContent.textContent = message.content;
    } else {
      this.appendContentToMessage(messageContent, message.content);
    }

    const messageInfo = document.createElement('div');
    messageInfo.classList.add('chat-message-info');

    const messageDate = document.createElement('div');
    messageDate.classList.add('chat-message-date');
    messageDate.textContent = message.sent_at.toLocaleString('pt-BR');
    messageDate.style.opacity = '0.7';

    const statusIcon = document.createElement('img');
    statusIcon.classList.add('chat-message-status');
    statusIcon.src = '';
    statusIcon.alt = message.getStatus();

    messageInfo.appendChild(messageDate);
    messageInfo.appendChild(statusIcon);

    messageBaloon.appendChild(messageContent);
    messageBaloon.appendChild(messageInfo);

    if (message.sender.id === this.self.id) {
      const optionsContainer = document.createElement('span');
      optionsContainer.style.position = 'absolute';
      optionsContainer.style.top = '6px';
      optionsContainer.style.right = '6px';
      optionsContainer.style.backgroundColor = message.sender.color;
      optionsContainer.style.display = 'none';
      optionsContainer.style.cursor = 'pointer';
      optionsContainer.style.padding = '4px';
      optionsContainer.style.borderRadius = '50%';
      optionsContainer.style.boxShadow = `0 0 5px 5px ${message.sender.color}80`;

      const optionsImg = document.createElement('img');
      optionsImg.classList.add('options-icon');
      optionsImg.src = '';
      optionsImg.alt = 'options';

      optionsContainer.appendChild(optionsImg);
      optionsContainer.dataset.messageId = message.id.toString();

      messageBaloon.appendChild(optionsContainer);

      messageBaloon.addEventListener('mouseover', () => {
        optionsContainer.style.display = 'flex';
      });

      messageBaloon.addEventListener('mouseout', () => {
        optionsContainer.style.display = 'none';
      });

      optionsContainer.addEventListener('click', (event) => {
        event.stopPropagation();
        this.showOptionsElement(optionsContainer);
      });

      document.addEventListener('click', (event) => {
        if (this.optionsElement && this.optionsElement.style.display === 'flex') {
          const target = event.target as Node;
          if (!this.optionsElement.contains(target)) {
            this.hideOptionsElement();
          }
        }
      });
    }

    return messageBaloon;
  }

  // Método para mostrar o optionsElement
  private showOptionsElement(optionsContainer: HTMLElement) {
    this.initializeOptionsElement();

    if (this.optionsElement && this.chatElement) {
      const rect = optionsContainer.getBoundingClientRect();
      const chatRect = this.chatElement.getBoundingClientRect();
      const topPosition = rect.top - chatRect.top + optionsContainer.offsetHeight;
      const rightPosition = window.innerWidth - rect.right;

      this.optionsElement.style.top = `${topPosition}px`;
      this.optionsElement.style.right = `${rightPosition + 10}px`;
      this.optionsElement.style.display = 'flex';
      this.optionsElement.dataset.messageId = optionsContainer.dataset.messageId;
    }
  }

  // Método para inicializar o optionsElement
  private initializeOptionsElement() {
    if (!this.optionsElement) {
      this.optionsElement = document.createElement('div');
      this.optionsElement.classList.add('options-element');
      this.optionsElement.style.position = 'absolute';
      this.optionsElement.style.display = 'flex';

      const editButton = document.createElement('button');
      editButton.textContent = 'Editar mensagem';
      editButton.style.marginBottom = '5px';
      editButton.addEventListener('click', () => {
        const messageId = this.optionsElement?.dataset.messageId;
        if (messageId) {
          console.log(`Editar mensagem com ID: ${messageId}`);
        }
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Apagar mensagem';
      deleteButton.addEventListener('click', () => {
        const messageId = this.optionsElement?.dataset.messageId;
        if (messageId) {
          console.log(`Apagar mensagem com ID: ${messageId}`);
        }
      });

      this.optionsElement.appendChild(editButton);
      this.optionsElement.appendChild(deleteButton);

      if (this.chatElement) {
        this.chatElement.appendChild(this.optionsElement);
      }
    }
  }

  // Método para esconder o optionsElement
  private hideOptionsElement() {
    if (this.optionsElement) {
      this.optionsElement.style.display = 'none';
    }
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
  public defineHeader(data: any) {
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

    this.wrapperElement.appendChild(header);
  }

  public defineChatcontainer(containerId: string) {
    const chatContainer = document.createElement('div');
    chatContainer.id = containerId;
    chatContainer.classList.add('chat-container');

    this.chatElement = chatContainer;
    this.wrapperElement.appendChild(chatContainer);

    this.initializeDragAndDrop();
  }

  // Método para inicializar arrastar e soltar
  private initializeDragAndDrop() {
    if (!this.chatElement) {
      throw new Error('O elemento chatElement não foi encontrado.');
    }

    this.chatElement.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.chatElement?.classList.add('dragover');
    });

    this.chatElement.addEventListener('dragleave', () => {
      this.chatElement?.classList.remove('dragover');
    });

    this.chatElement.addEventListener('drop', (event) => {
      event.preventDefault();
      this.chatElement?.classList.remove('dragover');

      const dragEvent = event as DragEvent;
      const files = dragEvent.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        this.handleFileDrop(file);
        this.emit('file-dropped', file);
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

  public defineFooter() {
    this.footerElement = document.createElement('div');
    this.footerElement.classList.add('footer-chat');

    const emojiIcon = this.createFooterIcon('../icons/emoji.svg', 'Emoji');
    const documentIcon = this.createFooterIcon('../icons/picture.svg', 'Imagem');
    const audioIcon = this.createFooterIcon('../icons/microphone.svg', 'Microfone');

    const inputText = document.createElement('input');
    inputText.classList.add('input-text');
    inputText.type = 'text';
    inputText.placeholder = 'Digite uma mensagem...';
    inputText.addEventListener('keydown', (event) => this.handleInputKeydown(event, inputText));

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.accept = 'image/*,video/*,application/pdf,audio/mpeg';

    documentIcon.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (event) => this.handleFileSelected(event));

    const emojiPicker = document.createElement('emoji-picker');
    emojiPicker.classList.add('light');
    emojiPicker.style.position = 'absolute';
    emojiPicker.style.display = 'none';
    emojiPicker.style.backgroundColor = 'white';
    emojiPicker.style.border = '1px solid #ccc';
    emojiPicker.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(emojiPicker);

    emojiIcon.addEventListener('click', () => this.handleEmojiClick(emojiPicker, emojiIcon));
    emojiPicker.addEventListener('emoji-click', (event) => {
      const customEvent = event as CustomEvent<{ unicode: string }>;
      this.handleEmojiPickerClick(customEvent, inputText, emojiPicker);
    });

    document.addEventListener('click', (event) => this.handleOutsideEmojiClick(event, emojiPicker, emojiIcon));
    audioIcon.addEventListener('click', this.handleAudioIconClick.bind(this));

    this.footerElement.appendChild(emojiIcon);
    this.footerElement.appendChild(documentIcon);
    this.footerElement.appendChild(inputText);
    this.footerElement.appendChild(audioIcon);
    this.footerElement.appendChild(fileInput);

    this.wrapperElement.appendChild(this.footerElement);
  }

  // Método para criar ícones do rodapé
  private createFooterIcon(iconPath: string, altText: string): HTMLElement {
    const iconSpan = document.createElement('span');
    const iconImg = document.createElement('img');
    iconImg.classList.add('footer-icon');
    iconImg.src = iconPath;
    iconImg.alt = altText;
    iconSpan.appendChild(iconImg);
    return iconSpan;
  }

  private handleInputKeydown(event: KeyboardEvent, inputText: HTMLInputElement) {
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
  }

  private handleFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.handleFileDrop(file);
      this.emit('file-uploaded', file);
    }
  }

  private handleEmojiClick(emojiPicker: HTMLElement, emojiIcon: HTMLElement) {
    const rect = emojiIcon.getBoundingClientRect();
    emojiPicker.style.top = `${rect.top - 420}px`;
    emojiPicker.style.left = `${rect.left}px`;
    emojiPicker.style.display = 'block';
  }

  private handleEmojiPickerClick(
    event: CustomEvent<{ unicode: string }>,
    inputText: HTMLInputElement,
    emojiPicker: HTMLElement,
  ) {
    inputText.value += event.detail.unicode;
    emojiPicker.style.display = 'none';
  }

  private handleOutsideEmojiClick(event: MouseEvent, emojiPicker: HTMLElement, emojiIcon: HTMLElement) {
    if (!emojiPicker.contains(event.target as Node) && !emojiIcon.contains(event.target as Node)) {
      emojiPicker.style.display = 'none';
    }
  }

  private handleAudioIconClick() {
    if (!this.isRecording) {
      this.recorder.start().then(() => {
        this.isRecording = true;
        this.toggleFooterVisibility();
        this.emit('audio-start');
      }).catch((e: any) => {
        console.error(e);
        this.emit('audio-error', e);
      });
    }
  }

  private toggleFooterVisibility() {
    if (this.footerElement) {
      if (this.isRecording) {
        this.footerElement.style.display = 'none';

        if (!this.audioFooterElement) {
          this.createAudioFooter();
        }

        if (this.audioFooterElement) {
          this.audioFooterElement.style.display = 'flex';
          this.audioFooterElement.style.justifyContent = 'flex-end';
        }
      } else {
        this.footerElement.style.display = 'flex';

        if (this.audioFooterElement) {
          this.audioFooterElement.style.display = 'none';
        }
      }
    }
  }

  private createAudioFooter() {
    const audioFooter = document.createElement('div');
    audioFooter.classList.add('footer-chat');
    audioFooter.style.display = 'none';
    this.audioFooterElement = audioFooter;

    const cancelIcon = this.createFooterIcon('../icons/cancel.svg', 'Cancelar');
    const sendIcon = this.createFooterIcon('../icons/send.svg', 'Enviar');

    cancelIcon.addEventListener('click', () => this.handleCancelRecordingClick());
    sendIcon.addEventListener('click', () => this.handleStopRecordingClick());

    audioFooter.appendChild(cancelIcon);
    audioFooter.appendChild(sendIcon);

    this.wrapperElement.appendChild(audioFooter);
  }

  private handleStopRecordingClick() {
    this.recorder.stop().getMp3().then(([buffer, blob]: [ArrayBuffer[], Blob]) => {
      const file = new File(buffer, 'recording.mp3', {
        type: blob.type,
        lastModified: Date.now()
      });

      const audioUrl = URL.createObjectURL(file);

      this.sendMessage({
        sender: this.self.id,
        content: { type: 'audio', url: audioUrl },
        sent_at: new Date(),
      });

      this.isRecording = false;
      this.toggleFooterVisibility();
      this.emit('audio-finish', audioUrl);
    }).catch((e: any) => {
      console.error(e);
      this.emit('audio-error', e);
    });
  }

  private handleCancelRecordingClick() {
    this.recorder.stop();
    this.isRecording = false;
    this.toggleFooterVisibility();
    this.emit('audio-cancel');
  }
}

export default Durenchat;