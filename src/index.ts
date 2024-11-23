import { Chat, PopupConfig } from './utills/types';
import Durenchat from './classes/durendal';
import Popup from './classes/popup';

export const durenchat = (chat: Chat) => {
  return new Durenchat(chat);
}

export const popup = (popup: PopupConfig) => {
  return new Popup(popup);
}