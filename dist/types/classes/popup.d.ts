import Durenchat from "./durendal";
import { PopupConfig } from "../utills/types";
declare class Popup {
    private config;
    private container;
    private popupElement;
    private iconElement;
    private chat;
    private isOpen;
    private chatContainer;
    constructor(config: PopupConfig);
    private createPopupElement;
    private createIcon;
    private toggleChat;
    private openChat;
    private closeChat;
    defineChat(chat: Durenchat): void;
}
export default Popup;
