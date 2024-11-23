import { MessageConstructor, MessageContent } from '../utills/types';
import { User } from './user';
export declare class Message {
    sender: User;
    content: MessageContent;
    sent_at: Date;
    edited_at?: Date | null;
    constructor({ sender, content, sent_at, edited_at }: MessageConstructor);
}
