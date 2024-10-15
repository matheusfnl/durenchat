export class Message {
    constructor({ sender, content, sent_at = new Date(), edited_at }) {
        this.sent_at = new Date();
        this.edited_at = null;
        this.sender = sender;
        this.content = content;
        this.sent_at = sent_at;
        if (edited_at) {
            this.edited_at = edited_at;
        }
    }
    updateContent(newContent) {
        this.content = newContent;
    }
}
