import { durenchat, popup } from './dist/durenchat/index.js';

// top-left, top-right, bottom-left, bottom-right
const popupChat = popup({
  container: 'body',
  color: '#5cc1ff',
  id: 'popup-container',
});

const chat = durenchat({
  type: 'chatbox',
  users: [
    {
      id: 2,
      name: 'Matheus',
      color: '#5cc1ff',
      text_color: '#fff',
      photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
    },
    {
      id: 1,
      name: 'Fernanda',
      color: '#ebe6e6',
      text_color: '#000',
      photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
    }
  ],
  self: 2,
  prefix: 'chat-1',
});

const user = chat.getUser(2);

popupChat.defineChat(chat);

chat.defineHeader({
  photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
  name: user.name,
});

chat.defineChatcontainer('dc-messages'); // define o id do container que as mensagens vão ser inseridas
chat.defineFooter(); // define o footer

// chat.render('durenchat');

chat.sendMessage({
  sender: 2,
  content: 'Olá',
});

chat.sendMessage({
  sender: 2,
  content: { type: 'image', url: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg', caption: 'Isso é o caption' },
});

chat.sendMessage({
  sender: 2,
  content: { type: 'document', url: 'https://example.com/document.pdf', name: 'Documento', caption: 'Isso é o caption' },
});

chat.sendMessage({
  sender: 2,
  content: { type: 'audio', url: 'https://example.com/audio.mp3' },
});

chat.sendMessage({
  sender: 2,
  content: { type: 'video', url: 'https://example.com/video.mp4', caption: 'Isso é o caption' },
});

chat.sendMessage({
  sender: 1,
  content: 'Texto simples',
});

chat.sendMessage({
  sender: 1,
  content: { type: 'image', url: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg', caption: 'Isso é o caption' },
});

chat.sendMessage({
  sender: 1,
  content: { type: 'document', url: 'https://example.com/document.pdf', name: 'Documento', caption: 'Isso é o caption' },
});

chat.sendMessage({
  sender: 1,
  content: { type: 'audio', url: 'https://example.com/audio.mp3' },
});

chat.sendMessage({
  sender: 1,
  content: { type: 'video', url: 'https://example.com/video.mp4', caption: 'Isso é o caption' },
});