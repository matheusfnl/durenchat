import Durenchat from "./durendal";
import { PopupConfig } from "../utills/types";

class Popup {
  private container: HTMLElement;
  private popupElement: HTMLElement;
  private iconElement: HTMLImageElement;
  private chat: Durenchat | null = null;
  private isOpen: boolean = false;
  private chatContainer: HTMLElement | null = null;

  constructor(private config: PopupConfig) {
    this.container = document.querySelector(config.container) as HTMLElement;
    if (!this.container) {
      throw new Error(`Container ${config.container} not found`);
    }
    this.iconElement = this.createIcon('../icons/chat.svg', 'Chat Icon');
    this.popupElement = this.createPopupElement();
    this.container.appendChild(this.popupElement);
  }

  private createPopupElement(): HTMLElement {
    const popupElement = document.createElement('div');
    popupElement.id = this.config.id;
    popupElement.style.position = 'absolute';
    popupElement.style.bottom = '20px';
    popupElement.style.right = '20px';
    popupElement.style.backgroundColor = this.config.color;
    popupElement.style.zIndex = '1000';
    popupElement.style.padding = '10px';
    popupElement.style.borderRadius = '50%';
    popupElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    popupElement.style.cursor = 'pointer';
    popupElement.style.display = 'flex';
    popupElement.style.alignItems = 'center';
    popupElement.style.justifyContent = 'center';

    popupElement.appendChild(this.iconElement);
    popupElement.addEventListener('click', () => this.toggleChat());

    return popupElement;
  }

  private createIcon(iconPath: string, altText: string): HTMLImageElement {
    const iconImg = document.createElement('img');

    iconImg.classList.add('popup-icon');
    iconImg.src = '';
    iconImg.alt = altText;
    iconImg.style.width = '40px';
    iconImg.style.height = '40px';

    return iconImg;
  }

  private toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  private openChat() {
    if (!this.chat) return;

    this.iconElement.src = '';

    this.chatContainer = document.createElement('div');
    this.chatContainer.id = 'popup-chat-container';
    this.chatContainer.style.position = 'absolute';
    this.chatContainer.style.bottom = '100px';
    this.chatContainer.style.right = '20px';
    this.chatContainer.style.width = '420px';
    this.chatContainer.style.height = '60%';
    this.chatContainer.style.backgroundColor = '#fff';
    this.chatContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    this.chatContainer.style.zIndex = '5';
    this.chatContainer.style.borderRadius = '5px';
    this.chatContainer.style.overflow = 'hidden';
    this.chatContainer.style.display = 'flex';
    this.chatContainer.style.flexDirection = 'column';

    this.container.appendChild(this.chatContainer);
    this.chat.render('popup-chat-container');
    this.isOpen = true;
  }

  private closeChat() {
    if (this.chatContainer) {
      this.iconElement.src = '';

      this.container.removeChild(this.chatContainer);
      this.chatContainer = null;
    }

    this.isOpen = false;
  }

  public defineChat(chat: Durenchat) {
    this.chat = chat;
  }
}

export default Popup;