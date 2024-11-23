import { Chat, MessageConfig, UserConstructor } from "../utills/types";
import { Message } from './message';
import { User } from './user';
type EventListener = (data: any) => void;
declare class Durenchat {
    wrapper_element: HTMLElement;
    chat_element: HTMLElement | null;
    self: User;
    users: User[];
    type: string;
    messages: Message[];
    events: {
        [key: string]: EventListener[];
    };
    constructor(chat: Chat);
    render(containerId: string): void;
    private initializeUsers;
    on(event: string, listener: EventListener): void;
    off(event: string, listener: EventListener): void;
    emit(event: string, data: any): void;
    getUser(id: string | number): User;
    addUser(user: UserConstructor): User;
    updateUser(user: UserConstructor): User;
    sendMessage(message: MessageConfig): Message;
    private appendMessageToChat;
    private createMessageWrapper;
    private createMessageBaloon;
    private appendContentToMessage;
    private appendImageContent;
    private appendDocumentContent;
    private appendAudioContent;
    private appendVideoContent;
    defineHeader(data: any): void;
    defineChatcontainer(containerId: string): void;
    private initializeDragAndDrop;
    private handleFileDrop;
    private createMessageContent;
    defineFooter(): void;
    private createFooterIcon;
}
export default Durenchat;
