import { Chat, Message, User } from './types';

class Durenchat {
  element: HTMLElement | Element;
  chat_container: HTMLElement | Element;
  self: string | number;
  users: User[] = [];
  class_prefix: string = '';

  constructor(
    id: string | number,
    chat: Chat,
  ) {
    this.self = chat.self;
    this.element = document.querySelector(`${id}`) as HTMLElement | Element;

    if (chat.class_prefix) {
      this.class_prefix = chat.class_prefix;
    }

    if (chat.users) {
      if (! chat.users.length) {
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
  sendMessage(message: Message) {
    if (! this.users.find(user => user.id === message.origin)) {
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
  addUser(user: User) {
    this.users.push(user);
  }

  _class(name: string): string {
    return `${this.class_prefix}-${name}`;
  }
};

export default function(
  id: string | number,
  chat: Chat,
) {
  return new Durenchat(id, chat);
}