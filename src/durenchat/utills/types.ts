import { User } from '../classes/user.js';

export interface Chat {
  self: number;
  users: UserConstructor[];
  messages: MessageConstructor[];
}

export interface MessageConstructor {
  sender: User;
  content: string;
  sent_at?: Date;
  edited_at?: Date;
}

export interface MessageConfig {
  sender: number;
  content: string;
  sent_at?: Date;
  edited_at?: Date;
}

export interface UserConstructor {
  id: string | number;
  name: string;
  color: string;
}

