import { Message } from './message.js';
import { User } from './user.js';
class Durenchat {
    constructor(id, chat) {
        this.self = null;
        this.users = [];
        this.messages = [];
        this.element = document.querySelector(`${id}`);
        if (!this.element) {
            throw new Error(`Element with the selector ${id} not found`);
        }
        if (chat.users && chat.users.length) {
            this.users = chat.users.map(user => new User(user));
        }
        else {
            throw new Error(`An empty user array was provided`);
        }
        if (chat.self) {
            this.self = this.getUser(chat.self);
        }
    }
    // Users
    getUser(id) {
        const user = this.users.find(user => user.id === id);
        if (!user) {
            throw new Error(`User not found`);
        }
        return user;
    }
    addUser(user) {
        const new_user = new User(user);
        this.users.push(new_user);
        return new_user;
    }
    updateUser(user) {
        const selected_user = this.getUser(user.id);
        if (!user) {
            throw new Error(`User not found`);
        }
        selected_user.updateUser(user);
    }
    // Message
    sendMessage(message) {
        const user = this.getUser(message.sender);
        const new_message = new Message(Object.assign(Object.assign({}, message), { sender: user }));
        this.messages.push(new_message);
        return new_message;
    }
}
export default Durenchat;
