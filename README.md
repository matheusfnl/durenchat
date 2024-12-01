# Durenchat

Durenchat é uma biblioteca para criar e gerenciar chats em aplicações web. Ela permite a criação de chats com funcionalidades como envio de mensagens, anexos, emojis e gravação de áudio.

## Conteúdo

- [Instalação](#instalação)
- [Importação](#imporação)
- [Exemplo](#exemplo)
- [Uso do PopUp](#uso-do-popup)
- [Métodos](#métodos)
  - [Durendal](#durendal)
  - [Message](#message)
  - [User](#user)
- [Eventos](#eventos)

### Instalação

```sh
npm install durenchat
```

### Imporação

```js
import { durenchat, popup } from 'durenchat';
```

### Exemplo

```js
const chat = durenchat({
  users: [
    {
      id: 2,
      name: 'Matheus',
      color: '#4a3d1f',
      textColor: '#fff',
      photoUrl: 'image.png',
    },
  ],
  self: 2,
  icons: {
    sent: icons.sent,
    delivered: icons.delivered,
    read: icons.read,
    options: icons.options,
    cancelEdit: icons.cancelEdit,
    send: icons.send,
    emoji: icons.emoji,
    file: icons.file,
    microphone: icons.microphone,
  },
});

const user = chat.getUser(2);

chat.defineHeader({
  photoUrl: 'photo.png',
  name: user.name,
});

chat.defineChatcontainer('dc-messages');
chat.defineFooter();

chat.render('div-id');
chat.sendMessage({
  sender: 1,
  content: 'Olá',
});
```

#### Uso do PopUp

```js
const popupChat = popup({
  container: 'body',
  color: '#5cc1ff',
  id: 'popup-container',
  icons: {
    popupOpen: icons.popupOpen,
    popupClose: icons.popupClose,
  },
});

popupChat.defineChat(chat);
```

## Métodos

### Durendal

| Método                               | Descrição                                |
|--------------------------------------|------------------------------------------|
| `render(containerId: string)`        | Renderiza o chat em um elemento específico. |
| `initializeUsers(users: UserConstructor[]): User[]` | Inicializa os usuários do chat. |
| `on(event: string, listener: ChatEventListener)` | Adiciona ouvintes de eventos. |
| `off(event: string, listener: ChatEventListener)` | Remove ouvintes de eventos. |
| `getUser(id: string/string): User` | Obtém um usuário pelo ID. |
| `addUser(user: UserConstructor): User` | Adiciona um novo usuário. |
| `updateUser(user: UserConstructor): User` | Atualiza um usuário existente. |
| `getMessage(id: string/number): Message` | Obtém uma mensagem pelo ID. |
| `sendMessage(message: MessageConfig): Message` | Envia uma mensagem. |
| `defineHeader(data: ChatHeader/string)` | Define o cabeçalho do chat. |
| `defineChatcontainer(containerId: string, html?: string)` | Define o contêiner do chat. |
| `defineFooter(html?: string)`         | Define o rodapé do chat. |

### Message

| Método                        | Descrição                                      |
|-------------------------------|------------------------------------------------|
| `getId(): string/number`    | Obtém o ID da mensagem.                        |
| `getSender(): User`           | Obtém o remetente da mensagem.                 |
| `getContent(): MessageContent`| Obtém o conteúdo da mensagem.                  |
| `getSentDate(): Date`         | Obtém a data de envio da mensagem.             |
| `getStatus(): 'sent'/'delivered'/'read'` | Obtém o status da mensagem. |
| `setStatus(newStatus: 'sent'/'delivered'/'read'): void` | Define o status da mensagem. |
| `getElement(): HTMLElement/undefined` | Obtém o elemento da mensagem no DOM. |
| `setElement(element: HTMLElement): void` | Define o elemento da mensagem no DOM. |
| `setMessageText(newContent: string): void` | Atualiza o texto da mensagem.        |

### User

| Método                        | Descrição                                      |
|-------------------------------|------------------------------------------------|
| `getId(): string/number`      | Obtém o ID do usuário.                         |
| `getColor(): string`          | Obtém a cor do usuário.                        |
| `getTextColor(): string`      | Obtém a cor do texto do usuário.               |
| `updateUser(user: UserConstructor): void` | Atualiza os dados do usuário.         |

## Eventos

| Evento                | Descrição                                  |
|-----------------------|--------------------------------------------|
| `chat-initialized`    | Disparado quando o chat é inicializado.    |
| `user-added`          | Disparado quando um novo usuário é adicionado. |
| `user-updated`        | Disparado quando um usuário é atualizado.  |
| `message-sent`        | Disparado quando uma mensagem é enviada.   |
| `message-updated`     | Disparado quando uma mensagem é atualizada. |
| `message-deleted`     | Disparado quando uma mensagem é deletada.  |
| `start-message-edit`  | Disparado quando a edição de uma mensagem é iniciada. |
| `audio-start`         | Disparado quando a gravação é iniciada.    |
| `audio-error`         | Disparado quando ocorre um erro de áudio.  |
| `audio-finish`        | Disparado quando a gravação de áudio é concluída. |
| `audio-cancel`        | Disparado quando a gravação de áudio é cancelada. |
| `file-uploaded`       | Disparado quando um arquivo é enviado.     |
| `file-dropped`        | Disparado quando um arquivo é descartado.  |
