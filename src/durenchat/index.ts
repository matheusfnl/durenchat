import { Chat, PopupConfig } from './utills/types.js';
import Durenchat from './classes/durendal.js';
import Popup from './classes/popup.js';

export const durenchat = (chat: Chat) => {
  return new Durenchat(chat);
}

export const popup = (popup: PopupConfig) => {
  return new Popup(popup);
}