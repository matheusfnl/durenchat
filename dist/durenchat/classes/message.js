export class Message {
    sender;
    content;
    sent_at = new Date();
    edited_at = null;
    constructor({ sender, content, sent_at = new Date(), edited_at }) {
        this.sender = sender;
        this.content = content;
        this.sent_at = sent_at;
        if (edited_at) {
            this.edited_at = edited_at;
        }
    }
}
