import Durenchat from './classes/durendal.js';
import Popup from './classes/popup.js';
export const durenchat = (chat) => {
    return new Durenchat(chat);
};
export const popup = (popup) => {
    return new Popup(popup);
};
