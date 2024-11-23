import { MessageConstructor, MessageContent } from '../utills/types';
import { User } from './user';

export class Message {
  private static lastId = 0;
  id: string | number;
  sender: User;
  content: MessageContent;
  sent_at: Date = new Date();
  private edited_at?: Date | null = null;
  private status: 'sent' | 'delivered' | 'read';
  private element?: HTMLElement;

  constructor({
    sender,
    content,
    sent_at = new Date(),
    edited_at,
    status,
  }: MessageConstructor) {
    this.id = Message.generateId();
    this.sender = sender;
    this.content = content;
    this.sent_at = sent_at;
    this.status = status || 'sent';

    if (edited_at) {
      this.edited_at = edited_at;
    }
  }

  // Função para obter o status
  public getStatus(): 'sent' | 'delivered' | 'read' {
    return this.status;
  }

  // Função para definir o status
  public setStatus(newStatus: 'sent' | 'delivered' | 'read'): void {
    this.status = newStatus;
    this.updateStatusInDOM();
  }

  // Função para obter o elemento
  public getElement(): HTMLElement | undefined {
    return this.element;
  }

  // Função para definir o elemento
  public setElement(element: HTMLElement): void {
    this.element = element;
  }

  // Função para atualizar o status no DOM
  private updateStatusInDOM(): void {
    if (this.element) {
      const statusIcon = this.element.querySelector('.chat-message-status') as HTMLImageElement;
      if (statusIcon) {
        statusIcon.alt = this.getStatus();
      }
    }
  }

  // Método estático para gerar um ID único
  private static generateId(): number {
    return ++Message.lastId;
  }
}