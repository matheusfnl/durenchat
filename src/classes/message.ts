import { MessageConstructor, MessageContent } from '../utills/types';
import { User } from './user';

export class Message {
  private static lastId = 0;
  private id: string | number;
  private sender: User;
  private content: MessageContent;
  private sendAt: Date = new Date();
  private editedAt?: Date | null = null;
  private status: 'sent' | 'delivered' | 'read';
  private element?: HTMLElement;

  /**
   * Construtor da classe Message.
   * @param sender - O usuário que enviou a mensagem.
   * @param content - O conteúdo da mensagem.
   * @param sendAt - A data de envio da mensagem.
   * @param editedAt - A data de edição da mensagem.
   * @param status - O status da mensagem.
   */
  constructor({
    sender,
    content,
    sendAt = new Date(),
    editedAt,
    status,
  }: MessageConstructor) {
    this.id = Message.generateId();
    this.sender = sender;
    this.content = content;
    this.sendAt = sendAt;
    this.status = status || 'sent';

    if (editedAt) {
      this.editedAt = editedAt;
    }
  }

  /**
   * Função para obter o id
   * @returns O ID da mensagem
   */
  public getId(): string | number {
    return this.id;
  }

  /**
   * Função para obter quem enviou a mensagem
   * @returns O usuário que enviou a mensagem
   */
  public getSender(): User {
    return this.sender;
  }

  /**
   * Função para obter o conteúdo
   * @returns O conteúdo da mensagem
   */
  public getContent(): MessageContent {
    return this.content;
  }

  /**
   * Função para obter a data de envio
   * @returns A data de envio da mensagem
   */
  public getSentDate(): Date {
    return this.sendAt;
  }

  /**
   * Função para obter o status
   * @returns O status da mensagem
   */
  public getStatus(): 'sent' | 'delivered' | 'read' {
    return this.status;
  }

  /**
   * Função para definir o status
   * @param newStatus - O novo status da mensagem
   */
  public setStatus(newStatus: 'sent' | 'delivered' | 'read'): void {
    this.status = newStatus;
    this.updateStatusInDOM();
  }

  /**
   * Função para obter o elemento
   * @returns O elemento HTML da mensagem
   */
  public getElement(): HTMLElement | undefined {
    return this.element;
  }

  /**
   * Função para definir o elemento
   * @param element - O elemento HTML da mensagem
   */
  public setElement(element: HTMLElement): void {
    this.element = element;
  }

  /**
   * Função para atualizar o status no DOM
   */
  private updateStatusInDOM(): void {
    if (this.element) {
      const statusIcon = this.element.querySelector('.chat-message-status') as HTMLImageElement;
      if (statusIcon) {
        statusIcon.alt = this.getStatus();
      }
    }
  }

  /**
   * Método para atualizar o texto da mensagem
   * @param newContent - O novo conteúdo da mensagem
   */
  public setMessageText(newContent: string): void {
    if (typeof this.content === 'string') {
      this.content = newContent;
    } else if (this.content.type !== 'audio') {
      this.content.caption = newContent;
    }

    this.editedAt = new Date();
    this.updateMessageContentInDOM();
  }

  /**
   * Função para atualizar o conteúdo da mensagem no DOM
   */
  private updateMessageContentInDOM(): void {
    if (this.element) {
      if (typeof this.content === 'string') {
        const messageContentElement = this.element.querySelector('.chat-message-content') as HTMLElement;
        messageContentElement.textContent = this.content;
      } else if (this.content.type !== 'audio') {
        const caption = this.element.querySelector('.message-caption') as HTMLElement;
        caption.textContent = this.content.caption || '';
      }
    }
  }

  /**
   * Método estático para gerar um ID único
   * @returns Um ID único para a mensagem
   */
  private static generateId(): number {
    return ++Message.lastId;
  }
}