// Função para carregar o SVG como string
const loadSVG = (path) => {
  return fetch(path)
    .then(response => response.text())  // Obtém o conteúdo do SVG como texto
    .catch(error => {
      console.error(`Erro ao carregar o SVG de ${path}:`, error);
      return '';  // Retorna uma string vazia se houver erro no carregamento
    });
};

// Função para carregar todos os ícones necessários
const loadIcons = async () => {
  const popupOpen = await loadSVG('./src/icons/chat.svg');
  const popupClose = await loadSVG('./src/icons/close.svg');
  const emoji = await loadSVG('./src/icons/emoji.svg');
  const microphone = await loadSVG('./src/icons/microphone.svg');
  const file = await loadSVG('./src/icons/picture.svg');
  const send = await loadSVG('./src/icons/send.svg');
  const cancelEdit = await loadSVG('./src/icons/close-circle.svg');
  const read = await loadSVG('./src/icons/read.svg');
  const delivered = await loadSVG('./src/icons/delivered.svg');
  const sent = await loadSVG('./src/icons/sent.svg');
  const options = await loadSVG('./src/icons/dots.svg');

  return {
    popupOpen,
    popupClose,
    emoji,
    microphone,
    file,
    send,
    cancelEdit,
    read,
    delivered,
    sent,
    options,
  };
};

// Carregar os ícones antes de inicializar o chat
loadIcons().then(icons => {
  const popupChat = Durenchat.popup({
    container: 'body',
    color: '#5cc1ff',
    id: 'popup-container',
    icons: {
      popupOpen: icons.popupOpen,
      popupClose: icons.popupClose,
    },
  });

  const chat = Durenchat.durenchat({
    users: [
      {
        id: 2,
        name: 'Matheus',
        color: '#5cc1ff',
        textColor: '#fff',
        photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
      },
      {
        id: 1,
        name: 'Fernanda',
        color: '#ebe6e6',
        textColor: '#000',
        photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
      }
    ],
    self: 2,
    prefix: 'chat-1',
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

  popupChat.defineChat(chat);

  chat.defineHeader({
    photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
    name: user.name,
  });

  chat.defineChatcontainer('dc-messages'); // define o id do container que as mensagens vão ser inseridas
  chat.defineFooter(); // define o footer

  chat.render('durenchat');

  chat.sendMessage({
    sender: 2,
    content: 'Olá',
    status: 'delivered',
  });

  chat.sendMessage({
    sender: 2,
    content: { type: 'image', url: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg', caption: 'Isso é o caption' },
    status: 'delivered',
  });

  chat.sendMessage({
    sender: 2,
    content: { type: 'document', url: 'https://example.com/document.pdf', name: 'Documento', caption: 'Isso é o caption' },
    sent_at: new Date('2021-08-10T15:00:00'),
    status: 'delivered',
  });

  chat.sendMessage({
    sender: 2,
    content: { type: 'audio', url: 'https://example.com/audio.mp3' },
    status: 'read',
  });

  chat.sendMessage({
    sender: 2,
    content: { type: 'video', url: 'https://example.com/video.mp4', caption: 'Isso é o caption' },
    status: 'read',
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
    sent_at: new Date('2021-08-10T15:00:00'),
  });

  const message = chat.sendMessage({
    sender: 1,
    content: { type: 'video', url: 'https://example.com/video.mp4', caption: 'Isso é o caption' },
  });

  message.setStatus('delivered');
});
