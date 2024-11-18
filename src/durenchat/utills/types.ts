import { User } from '../classes/user.js';

export type MessageContent =
  | string
  | { type: 'image', url: string, caption?: string }
  | { type: 'document', url: string, name: string, caption?: string }
  | { type: 'audio', url: string }
  | { type: 'video', url: string, caption?: string };

export interface Chat {
  self: number;
  users: UserConstructor[];
  messages: MessageConstructor[];
  type: string;
}

export interface MessageConstructor {
  sender: User;
  content: MessageContent;
  sent_at?: Date;
  edited_at?: Date;
}
export interface MessageConfig {
  sender: number | string;
  content: MessageContent;
  sent_at?: Date;
  edited_at?: Date;
}

export interface UserConstructor {
  id: string | number;
  name: string;
  color: string;
  text_color: string;
  photoUrl: string;
}

