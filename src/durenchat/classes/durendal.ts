import { Chat, MessageConfig, UserConstructor } from "../utills/types.js";
import { Message } from './message.js';
import { User } from './user.js';

class Durenchat {
  element: HTMLElement | Element;
  self: User | null = null
  users: User[] = [];
  messages: Message[] = [];

  constructor(id: string | number, chat: Chat) {
    this.element = document.querySelector(`${id}`) as HTMLElement | Element;

    if (!this.element) {
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

  updateUser(user: UserConstructor) {
    const selected_user = this.getUser(user.id);
    selected_user.updateUser(user);
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
}

export default Durenchat;