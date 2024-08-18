export function _handleIdentifier(chat, element, message) {
    const user = chat.users.find(user => user.id === message.origin);
    if (!user) {
        throw new Error(`Origin ${message.origin} was not found`);
    }
    const getIdentifier = () => {
        if (typeof message.identifier === 'function') {
            return message.identifier(user);
        }
        if (message.identifier && typeof message.identifier !== 'function') {
            return user.name;
        }
        if (typeof user.identifier === 'function') {
            return user.identifier(user);
        }
        if (user.identifier && typeof user.identifier !== 'function') {
            return user.name;
        }
        if (typeof chat.identifier === 'function') {
            return chat.identifier(user);
        }
        if (chat.identifier && typeof chat.identifier !== 'function') {
            return user.name;
        }
        return '';
    };
    const identifier = getIdentifier();
    if (identifier) {
        const chat_message_header_div = document.createElement('div');
        chat_message_header_div.textContent = identifier;
        element.appendChild(chat_message_header_div);
    }
}
