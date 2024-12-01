import { User } from '../classes/user';

export type MessageContent =
  | string
  | { type: 'image', url: string, caption?: string }
  | { type: 'document', url: string, name: string, caption?: string }
  | { type: 'audio', url: string }
  | { type: 'video', url: string, caption?: string };

export type Chat = {
  self: number;
  users: UserConstructor[];
  messages: MessageConstructor[];
  icons: ChatIcons;
  prefix?: string;
}

export type MessageConstructor = {
  sender: User;
  content: MessageContent;
  sendAt?: Date;
  editedAt?: Date;
  status?: 'sent' | 'delivered' | 'read';
}
export type MessageConfig = {
  sender: number | string;
  content: MessageContent;
  sendAt?: Date;
  editedAt?: Date;
}

export type UserConstructor = {
  id: string | number;
  name: string;
  color: string;
  textColor: string;
  photoUrl: string;
}

export type PopupConfig = {
  container: string;
  color: string;
  icon: string;
  id: string;
  icons: PopupConfigIcons;
}

export type PopupConfigIcons = {
  popupOpen: string;
  popupClose: string;
}

export type ChatHeader = {
  photoUrl: string;
  name: string;
}

export type ChatEvents = { [key: string]: ChatEventListener[] }
export type ChatEventListener = (data: any) => void;

export type ChatIcons = {
  sent?: string,
  delivered?: string,
  read?: string,
  options?: string,
  cancelEdit?: string,
  emoji?: string,
  file?: string,
  microphone?: string,
  send?: string,
}