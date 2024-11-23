import { MessageConstructor, MessageContent } from '../utills/types'
import { User } from './user';

export class Message {
  sender: User;
  content: MessageContent;
  sent_at: Date = new Date();
  edited_at?: Date | null = null;

  constructor({
    sender,
    content,
    sent_at = new Date(),
    edited_at
  }: MessageConstructor) {
    this.sender = sender;
    this.content = content;
    this.sent_at = sent_at;

    if (edited_at) {
      this.edited_at = edited_at;
    }
  }
}
