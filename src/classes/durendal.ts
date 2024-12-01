import 'emoji-picker-element';

const MicRecorder = require('mic-recorder-to-mp3');

import { Chat, MessageConfig, UserConstructor, MessageContent, ChatEvents, ChatEventListener, ChatHeader, ChatIcons } from "../utills/types";
import { Message } from './message';
import { User } from './user';

class Durenchat {
  private wrapperElement: HTMLElement;
  private chatElement: HTMLElement | null = null;
  private footerElement: HTMLElement | null = null;
  private audioFooterElement: HTMLElement | null = null;
  private optionsElement: HTMLElement | null = null;
  private self: User;
  private users: User[] = [];
  private messages: Message[] = [];
  private events: ChatEvents = {};
  private recorder: typeof MicRecorder;
  private isRecording: boolean = false;
  private contextMenuMessage: Message | null = null;
  private editingMessage: Message | null = null;
  private icons: ChatIcons = {};
  private prefix: string = '';

  /**
   * Construtor da classe Durenchat.
   * @param chat - Objeto de configuração do chat.
   */
  constructor(chat: Chat) {
    this.users = this.initializeUsers(chat.users);
    this.self = this.getUser(chat.self);
    this.recorder = new MicRecorder({ bitRate: 128 });

    if (chat.icons) {
      this.icons = chat.icons;
    }

    if (chat.prefix) {
      this.prefix = chat.prefix;
    }

    const container = document.createElement('div');
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.boxSizing = 'border-box';

    this.wrapperElement = container;
    this.emit('chat-initialized');
  }

  /**
   * Método para renderizar o chat em um elemento específico.
   * @param containerId - ID do contêiner onde o chat será renderizado.
   */
  public render(containerId: string) {
    const container = document.querySelector(`#${containerId}`) as HTMLElement;
    if (!container) {
      throw new Error(`Container with ID ${containerId} not found`);
    }

    container.appendChild(this.wrapperElement);
  }

  /**
   * Método para inicializar os usuários.
   * @param users - Array de objetos de configuração de usuários.
   * @returns Array de instâncias de usuários.
   */
  public initializeUsers(users: UserConstructor[]): User[] {
    if (!users || !users.length) {
      throw new Error(`An empty user array was provided`);
    }
    return users.map(user => new User(user));
  }

  /**
   * Método para adicionar ouvintes de eventos.
   * @param event - Nome do evento.
   * @param listener - Função ouvinte do evento.
   */
  public on(event: string, listener: ChatEventListener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  /**
   * Método para remover ouvintes de eventos.
   * @param event - Nome do evento.
   * @param listener - Função ouvinte do evento.
   */
  public off(event: string, listener: ChatEventListener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(e => e !== listener);
  }

  /**
   * Método para disparar eventos.
   * @param event - Nome do evento.
   * @param data - Dados do evento.
   */
  private emit(event: string, data?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(data));
  }

  /**
   * Método para obter um usuário pelo ID.
   * @param id - ID do usuário.
   * @returns Instância do usuário.
   */
  public getUser(id: string | number): User {
    const user = this.users.find(user => user.getId() === id);
    if (!user) {
      throw new Error(`User not found`);
    }
    return user;
  }

  /**
   * Método para adicionar um novo usuário.
   * @param user - Objeto de configuração do usuário.
   * @returns Instância do novo usuário.
   */
  public addUser(user: UserConstructor): User {
    const newUser = new User(user);
    this.users.push(newUser);
    this.emit('user-added', newUser);
    return newUser;
  }

  /**
   * Método para atualizar um usuário existente.
   * @param user - Objeto de configuração do usuário.
   * @returns Instância do usuário atualizado.
   */
  public updateUser(user: UserConstructor): User {
    const selectedUser = this.getUser(user.id);
    selectedUser.updateUser(user);
    this.emit('user-updated', selectedUser);
    return selectedUser;
  }

  /**
   * Método para obter uma mensagem pelo ID.
   * @param id - ID da mensagem.
   * @returns Instância da mensagem.
   */
  public getMessage(id: string | number): Message {
    const message = this.messages.find(message => +message.getId() === +id);
    if (!message) {
      throw new Error(`Message not found`);
    }
    return message;
  }

  /**
   * Método para enviar uma mensagem.
   * @param message - Objeto de configuração da mensagem.
   * @returns Instância da mensagem enviada.
   */
  public sendMessage(message: MessageConfig): Message {
    const user = this.getUser(message.sender);
    const newMessage = new Message({
      ...message,
      sender: user,
    });

    const index = this.messages.findIndex(m => new Date(m.getSentDate()) > new Date(newMessage.getSentDate()));
    if (index === -1) {
      this.messages.push(newMessage);
    } else {
      this.messages.splice(index, 0, newMessage);
    }

    const messageElement = this.appendMessageToChat(newMessage, index);
    newMessage.setElement(messageElement);
    this.emit('message-sent', newMessage);

    return newMessage;
  }

  /**
   * Método para adicionar a mensagem ao chat.
   * @param message - Instância da mensagem.
   * @param index - Índice onde a mensagem será inserida.
   * @returns Elemento HTML da mensagem.
   */
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

      if (message.getSender().getId() === this.self.getId()) {
        this.chatElement.scrollTop = this.chatElement.scrollHeight;
      }
    } else {
      throw new Error('O elemento chatElement não foi encontrado.');
    }

    return messageWrapper;
  }

  /**
   * Método para criar o contêiner da mensagem.
   * @param message - Instância da mensagem.
   * @returns Elemento HTML do contêiner da mensagem.
   */
  private createMessageWrapper(message: Message): HTMLElement {
    const messageWrapper = document.createElement('div');
    this.addClass(messageWrapper, 'message-container');
    this.addClass(messageWrapper, message.getSender().getId() === this.self?.getId() ? 'message-container-sender' : 'message-container-receiver');
    return messageWrapper;
  }

  /**
   * Método para criar o balão da mensagem.
   * @param message - Instância da mensagem.
   * @returns Elemento HTML do balão da mensagem.
   */
  private createMessageBaloon(message: Message): HTMLElement {
    const messageBaloon = document.createElement('div');
    this.addClass(messageBaloon, 'chat-message');
    messageBaloon.style.backgroundColor = message.getSender().getColor();
    messageBaloon.style.color = message.getSender().getTextColor();
    messageBaloon.style.position = 'relative';

    const messageContent = document.createElement('div');
    this.addClass(messageContent, 'chat-message-content');

    const content = message.getContent();

    if (typeof content === 'string') {
      messageContent.textContent = content;
    } else {
      this.appendContentToMessage(messageContent, content);
    }

    const messageInfo = document.createElement('div');
    this.addClass(messageInfo, 'chat-message-info');

    const messageDate = document.createElement('div');
    this.addClass(messageDate, 'chat-message-date');
    messageDate.textContent = message.getSentDate().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    messageDate.style.opacity = '0.7';

    messageInfo.appendChild(messageDate);
    messageBaloon.appendChild(messageContent);
    messageBaloon.appendChild(messageInfo);

    if (message.getSender().getId() === this.self.getId()) {
      const statusSvg = this.getStatusIcon(message);
      const statusIcon = this.createIcon(statusSvg, 'chat-message-status');

      messageInfo.appendChild(statusIcon);

      const optionsContainer = document.createElement('span');
      optionsContainer.style.position = 'absolute';
      optionsContainer.style.top = '6px';
      optionsContainer.style.right = '6px';
      optionsContainer.style.backgroundColor = message.getSender().getColor();
      optionsContainer.style.display = 'none';
      optionsContainer.style.cursor = 'pointer';
      optionsContainer.style.borderRadius = '4px';
      optionsContainer.style.boxShadow = `0 0 5px 5px ${message.getSender().getColor()}80`;

      const optionsImg = this.createIcon(this.icons.options, 'options-icon');

      optionsContainer.appendChild(optionsImg);
      optionsContainer.dataset.messageId = message.getId().toString();

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

  /**
   * Método para mostrar o optionsElement.
   * @param optionsContainer - Contêiner de opções.
   */
  private showOptionsElement(optionsContainer: HTMLElement) {
    this.initializeOptionsElement();

    if (this.optionsElement && this.chatElement) {
      const message = this.getMessage(optionsContainer.dataset.messageId as string);
      this.contextMenuMessage = message;

      const editButton = this.optionsElement.getElementsByClassName('edit-button')[0] as HTMLElement;
      const content = message.getContent();

      if (typeof content === 'object' && content.type === 'audio') {
        editButton.style.display = 'none';
      } else {
        editButton.style.display = 'block';
      }

      const rect = optionsContainer.getBoundingClientRect();
      const chatRect = this.chatElement.getBoundingClientRect();
      const topPosition = rect.top - chatRect.top + optionsContainer.offsetHeight;
      const rightPosition = window.innerWidth - rect.right;

      this.optionsElement.style.top = `${topPosition}px`;
      this.optionsElement.style.right = `${rightPosition + 10}px`;
      this.optionsElement.style.display = 'flex';
    }
  }

  /**
   * Método para inicializar o optionsElement.
   */
  private initializeOptionsElement() {
    if (!this.optionsElement) {
      this.optionsElement = document.createElement('div');
      this.addClass(this.optionsElement, 'options-element');
      this.optionsElement.style.position = 'absolute';
      this.optionsElement.style.display = 'flex';

      const editButton = document.createElement('button');
      this.addClass(editButton, 'edit-button');
      editButton.textContent = 'Editar mensagem';
      editButton.style.marginBottom = '5px';
      editButton.addEventListener('click', () => {
        this.editMessage();
        this.hideOptionsElement();
      });

      this.optionsElement.appendChild(editButton);

      const deleteButton = document.createElement('button');
      this.addClass(deleteButton, 'delete-button');
      deleteButton.textContent = 'Apagar mensagem';
      deleteButton.addEventListener('click', () => {
        this.deleteMessage();
        this.hideOptionsElement();
      });

      this.optionsElement.appendChild(deleteButton);

      if (this.chatElement) {
        this.chatElement.appendChild(this.optionsElement);
      }
    }
  }

  /**
   * Método para editar uma mensagem.
   */
  private editMessage() {
    if (this.contextMenuMessage) {
      const message = this.getMessage(this.contextMenuMessage.getId());
      const inputText = this.footerElement?.querySelector('.input-text') as HTMLInputElement;

      this.editingMessage = message;

      if (inputText) {
        const content = message.getContent();

        if (typeof content === 'string') {
          inputText.value = content;
        } else if (content.type !== 'audio' && content.caption) {
          inputText.value = content.caption;
        }

        let cancelSpan = this.footerElement?.querySelector('.cancel-span') as HTMLElement;
        if (!cancelSpan) {
          cancelSpan = document.createElement('span');
          this.addClass(cancelSpan, 'cancel-span');
          cancelSpan.style.cursor = 'pointer';

          const cancelImg = this.createIcon(this.icons.cancelEdit, 'footer-container');
          cancelSpan.appendChild(cancelImg);

          cancelSpan.addEventListener('click', () => {
            inputText.value = '';
            this.editingMessage = null;
            cancelSpan.style.display = 'none';
          });

          inputText.parentNode?.insertBefore(cancelSpan, inputText.nextSibling);
        } else {
          cancelSpan.style.display = 'inline';
        }
      }

      this.emit('start-message-edit', this.contextMenuMessage.getId());
    }
  }

  /**
   * Método para apagar uma mensagem.
   */
  private deleteMessage() {
    if (this.contextMenuMessage) {
      const messageIndex = this.messages.findIndex(message => message.getId().toString() === `${this.contextMenuMessage?.getId()}`);
      if (messageIndex !== -1) {
        const [removedMessage] = this.messages.splice(messageIndex, 1);

        const messageElement = removedMessage.getElement();
        if (messageElement && messageElement.parentNode) {
          messageElement.parentNode.removeChild(messageElement);
        }

        this.emit('message-deleted', this.contextMenuMessage.getId());
      }
    }
  }

  /**
   * Método para esconder o optionsElement.
   */
  private hideOptionsElement() {
    if (this.optionsElement) {
      this.contextMenuMessage = null;
      this.optionsElement.style.display = 'none';
    }
  }

  /**
   * Método para adicionar conteúdo ao balão da mensagem.
   * @param messageContent - Elemento HTML do conteúdo da mensagem.
   * @param content - Conteúdo da mensagem.
   */
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

  /**
   * Método para adicionar conteúdo de imagem.
   * @param messageContent - Elemento HTML do conteúdo da mensagem.
   * @param content - Conteúdo da imagem.
   */
  private appendImageContent(messageContent: HTMLElement, content: { type: 'image', url: string, caption?: string }) {
    const img = document.createElement('img');
    this.addClass(img, 'max-message-content');
    img.src = content.url;
    img.alt = 'Imagem';
    messageContent.appendChild(img);
    this.appendCaption(content.caption, messageContent);
  }

  /**
   * Método para adicionar conteúdo de documento.
   * @param messageContent - Elemento HTML do conteúdo da mensagem.
   * @param content - Conteúdo do documento.
   */
  private appendDocumentContent(messageContent: HTMLElement, content: { type: 'document', url: string, name: string, caption?: string }) {
    const docLink = document.createElement('a');
    this.addClass(docLink, 'max-message-content');
    docLink.href = content.url;
    docLink.textContent = content.name;
    docLink.target = '_blank';
    messageContent.appendChild(docLink);
    this.appendCaption(content.caption, messageContent);
  }

  /**
   * Método para adicionar conteúdo de áudio.
   * @param messageContent - Elemento HTML do conteúdo da mensagem.
   * @param content - Conteúdo do áudio.
   */
  private appendAudioContent(messageContent: HTMLElement, content: { type: 'audio', url: string }) {
    const audio = document.createElement('audio');
    this.addClass(audio, 'max-message-content');
    audio.controls = true;
    const audioSource = document.createElement('source');
    audioSource.src = content.url;
    audioSource.type = 'audio/mpeg';
    audio.appendChild(audioSource);
    messageContent.appendChild(audio);
  }

  /**
   * Método para adicionar conteúdo de vídeo.
   * @param messageContent - Elemento HTML do conteúdo da mensagem.
   * @param content - Conteúdo do vídeo.
   */
  private appendVideoContent(messageContent: HTMLElement, content: { type: 'video', url: string, caption?: string }) {
    const video = document.createElement('video');
    this.addClass(video, 'max-message-content');
    video.controls = true;
    const videoSource = document.createElement('source');
    videoSource.src = content.url;
    videoSource.type = 'video/mp4';
    video.appendChild(videoSource);
    messageContent.appendChild(video);
    this.appendCaption(content.caption, messageContent);
  }

  /**
   * Método para adicionar uma legenda ao conteúdo da mensagem.
   * @param contentCaption - Legenda do conteúdo.
   * @param messageContent - Elemento HTML do conteúdo da mensagem.
   */
  private appendCaption(contentCaption: string | undefined, messageContent: HTMLElement) {
    const caption = document.createElement('div');
    this.addClass(caption, 'message-caption');

    if (contentCaption) {
      caption.textContent = contentCaption;
    }

    messageContent.appendChild(caption);
  }

  /**
   * Define o cabeçalho do chat.
   * @param data - Dados do cabeçalho.
   */
  public defineHeader(data: ChatHeader | string) {
    if (typeof data === 'string') {
      this.wrapperElement.innerHTML += data;
    } else {
      const header = document.createElement('div');
      this.addClass(header, 'header-chat');

      const img = document.createElement('img');
      this.addClass(img, 'img-header-chat');
      img.src = data.photoUrl;
      img.alt = `${data.name} photo`;

      const name = document.createElement('div');
      this.addClass(name, 'name-header-chat');
      name.textContent = data.name;

      header.appendChild(img);
      header.appendChild(name);

      this.wrapperElement.appendChild(header);
    }
  }

  /**
   * Define o contêiner do chat.
   * @param containerId - ID do contêiner do chat.
   */
  public defineChatcontainer(containerId: string, html?: string) {
    let chatContainer: HTMLElement;

    if (html) {
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = html.trim();

      chatContainer = tempContainer.firstElementChild as HTMLElement;
      if (!chatContainer) {
        throw new Error('O HTML fornecido não contém um elemento válido.');
      }

      chatContainer.id = containerId;
    } else {
      chatContainer = document.createElement('div');
      chatContainer.id = containerId;
      this.addClass(chatContainer, 'chat-container');
    }

    this.chatElement = chatContainer;
    this.wrapperElement.appendChild(chatContainer);

    this.initializeDragAndDrop();
  }
  /**
   * Inicializa a funcionalidade de arrastar e soltar.
   */
  private initializeDragAndDrop() {
    if (!this.chatElement) {
      throw new Error('O elemento chatElement não foi encontrado.');
    }

    this.chatElement.addEventListener('dragover', (event) => {
      event.preventDefault();
      if (this.chatElement) {
        this.addClass(this.chatElement, 'dragover');
      }
    });

    this.chatElement.addEventListener('dragleave', () => {
      if (this.chatElement) {
        this.removeClass(this.chatElement, 'dragover');
      }
    });

    this.chatElement.addEventListener('drop', (event) => {
      event.preventDefault();
      if (this.chatElement) {
        this.removeClass(this.chatElement, 'dragover');
      }

      const dragEvent = event as DragEvent;
      const files = dragEvent.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        this.handleFileDrop(file);
        this.emit('file-dropped', file);
      }
    });
  }

  /**
   * Lida com o drop de arquivos.
   * @param file - Arquivo que foi solto.
   */
  private handleFileDrop(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = this.createMessageContent(file, reader.result as string);
      if (content) {
        this.sendMessage({
          sender: this.self.getId(),
          content: content,
          sendAt: new Date(),
        });
      }
    };
    reader.readAsDataURL(file);
  }

  /**
   * Cria o conteúdo da mensagem com base no tipo de arquivo.
   * @param file - Arquivo.
   * @param result - Resultado da leitura do arquivo.
   * @returns Conteúdo da mensagem.
   */
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

  /**
   * Define o rodapé do chat.
   */
  public defineFooter(html?: string) {
    if (html) {
      this.wrapperElement.innerHTML += html;
    } else {
      this.footerElement = document.createElement('div');
      this.addClass(this.footerElement, 'footer-chat');

      const emojiIcon = this.createIcon(this.icons.emoji, 'footer-container');
      const documentIcon = this.createIcon(this.icons.file, 'footer-container');
      const audioIcon = this.createIcon(this.icons.microphone, 'footer-container');

      const inputText = document.createElement('input');
      this.addClass(inputText, 'input-text');
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
      this.addClass(emojiPicker, 'light');
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
  }

  /**
   * Cria ícones do rodapé.
   * @param iconPath - Caminho do ícone.
   * @param altText - Texto alternativo do ícone.
   * @returns Elemento HTML do ícone.
   */

  private createIcon(iconPath: string | undefined = '', iconClass: string) {
    const iconContainer = document.createElement('div');
    iconContainer.innerHTML = iconPath;

    if (iconClass) {
      this.addClass(iconContainer, iconClass);
    }

    return iconContainer;
  }

  private getStatusIcon(message: Message): string {
    return this.icons[message.getStatus()] || '';
  }

  /**
   * Lida com o evento de pressionar tecla no input de texto.
   * @param event - Evento de teclado.
   * @param inputText - Elemento input de texto.
   */
  private handleInputKeydown(event: KeyboardEvent, inputText: HTMLInputElement) {
    if (event.key === 'Enter') {
      const messageContent = inputText.value.trim();
      if (! this.editingMessage) {
        this.sendMessage({
          sender: this.self.getId(),
          content: messageContent,
          sendAt: new Date(),
        });
        inputText.value = '';
      } else {
        this.editingMessage.setMessageText(messageContent)
        this.emit('message-updated', this.editingMessage);
        this.editingMessage = null;
        inputText.value = '';

        const cancelSpan = this.footerElement?.querySelector('.cancel-span') as HTMLElement;
        if (cancelSpan) {
            cancelSpan.style.display = 'none';
        }
      }
    }
  }

  /**
   * Lida com a seleção de arquivos.
   * @param event - Evento de seleção de arquivo.
   */
  private handleFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.handleFileDrop(file);
      this.emit('file-uploaded', file);
    }
  }

  /**
   * Lida com o clique no ícone de emoji.
   * @param emojiPicker - Elemento do seletor de emoji.
   * @param emojiIcon - Ícone de emoji.
   */
  private handleEmojiClick(emojiPicker: HTMLElement, emojiIcon: HTMLElement) {
    const rect = emojiIcon.getBoundingClientRect();
    emojiPicker.style.top = `${rect.top - 170}px`;
    emojiPicker.style.left = `${rect.left}px`;
    emojiPicker.style.display = 'block';
  }

  /**
   * Lida com o clique no seletor de emoji.
   * @param event - Evento de clique no seletor de emoji.
   * @param inputText - Elemento input de texto.
   * @param emojiPicker - Elemento do seletor de emoji.
   */
  private handleEmojiPickerClick(
    event: CustomEvent<{ unicode: string }>,
    inputText: HTMLInputElement,
    emojiPicker: HTMLElement,
  ) {
    inputText.value += event.detail.unicode;
    emojiPicker.style.display = 'none';
    inputText.focus();
  }

  /**
   * Lida com cliques fora do seletor de emoji.
   * @param event - Evento de clique.
   * @param emojiPicker - Elemento do seletor de emoji.
   * @param emojiIcon - Ícone de emoji.
   */
  private handleOutsideEmojiClick(event: MouseEvent, emojiPicker: HTMLElement, emojiIcon: HTMLElement) {
    if (!emojiPicker.contains(event.target as Node) && !emojiIcon.contains(event.target as Node)) {
      emojiPicker.style.display = 'none';
    }
  }

  /**
   * Lida com o clique no ícone de áudio.
   */
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

  /**
   * Alterna a visibilidade do rodapé.
   */
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

  /**
   * Cria o rodapé de áudio.
   */
  private createAudioFooter() {
    const audioFooter = document.createElement('div');
    this.addClass(audioFooter, 'footer-chat');
    audioFooter.style.display = 'none';
    this.audioFooterElement = audioFooter;

    const cancelIcon = this.createIcon(this.icons.cancelEdit, 'footer-container');
    const sendIcon = this.createIcon(this.icons.send, 'footer-container');

    cancelIcon.addEventListener('click', () => this.handleCancelRecordingClick());
    sendIcon.addEventListener('click', () => this.handleStopRecordingClick());

    audioFooter.appendChild(cancelIcon);
    audioFooter.appendChild(sendIcon);

    this.wrapperElement.appendChild(audioFooter);
  }

  /**
   * Lida com o clique para parar a gravação.
   */
  private handleStopRecordingClick() {
    this.recorder.stop().getMp3().then(([buffer, blob]: [ArrayBuffer[], Blob]) => {
      const file = new File(buffer, 'recording.mp3', {
        type: blob.type,
        lastModified: Date.now()
      });

      const audioUrl = URL.createObjectURL(file);

      this.sendMessage({
        sender: this.self.getId(),
        content: { type: 'audio', url: audioUrl },
        sendAt: new Date(),
      });

      this.isRecording = false;
      this.toggleFooterVisibility();
      this.emit('audio-finish', audioUrl);
    }).catch((e: any) => {
      console.error(e);
      this.emit('audio-error', e);
    });
  }

  /**
   * Lida com o clique para cancelar a gravação.
   */
  private handleCancelRecordingClick() {
    this.recorder.stop();
    this.isRecording = false;
    this.toggleFooterVisibility();
    this.emit('audio-cancel');
  }

  /**
   * Adiciona uma classe a um elemento HTML.
   * @param element - Elemento HTML.
   * @param className - Nome da classe.
   */
  private addClass(element: HTMLElement, className: string) {
  const prefix = this.prefix ? `${this.prefix}-` : '';

    element.classList.add(`${prefix}${className}`);
  }

  /**
   * Remove uma classe de um elemento HTML.
   * @param element - Elemento HTML.
   * @param className - Nome da classe.
   */
  private removeClass(element: HTMLElement, className: string)  {
    const prefix = this.prefix ? `${this.prefix}-` : '';

    element.classList.remove(`${prefix}${className}`);
  }
}

export default Durenchat;