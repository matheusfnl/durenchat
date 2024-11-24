const loadSVG = (path) => {
  return fetch(path)
    .then(response => response.text())
    .catch(error => {
      console.error(`Erro ao carregar o SVG de ${path}:`, error);
      return '';
    });
};

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

loadIcons().then(icons => {
  // CHAT 1

  const chat = Durenchat.durenchat({
    prefix: 'chat-1',
    users: [
      {
        id: 2,
        name: 'Matheus',
        color: '#4a3d1f',
        textColor: '#fff',
        photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
      },
      {
        id: 1,
        name: 'Fernanda',
        color: '#f7f2e4',
        textColor: '#000',
        photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
      }
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
    photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
    name: user.name,
  });

  chat.defineChatcontainer('dc-messages');
  chat.defineFooter();

  chat.render('chat-1');
  chat.sendMessage({
    sender: 1,
    content: 'Olá',
  });

  chat.sendMessage({
    sender: 2,
    content: { type: 'image', url: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg', caption: 'Olá, tudo bem?' },
    status: 'read',
  });

  // CHAT 2

  const chat2 = Durenchat.durenchat({
    prefix: 'chat-2',
    users: [
      {
        id: 2,
        name: 'Matheus',
        color: '#303545',
        textColor: '#fff',
        photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
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

  chat2.defineHeader({
    photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
    name: user.name,
  });

  chat2.defineChatcontainer('dc-messages');

  chat2.defineFooter('<div>HTML Personalizado para ser aplicado</div>');

  chat2.render('chat-2');
  chat2.sendMessage({
    sender: 1,
    content: 'Olá',
  });

  chat2.sendMessage({
    sender: 2,
    content: { type: 'image', url: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg', caption: 'Olá, tudo bem?' },
    status: 'read',
  });

  // CHAT 3

  const chat3 = Durenchat.durenchat({
    prefix: 'chat-3',
    users: [
      {
        id: 2,
        name: 'Matheus',
        color: '#19223d',
        textColor: '#fff',
        photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
      },
      {
        id: 1,
        name: 'Fernanda',
        color: '#ffffff',
        textColor: '#000',
        photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
      }
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

  chat3.defineHeader({
    photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
    name: user.name,
  });

  chat3.defineChatcontainer('dc-messages',
    `<div class="chat-3-chat-container">
      <div class="protected-messages">
        As mensagens desse chat são protegidas
      </div>
    </div>`
  );

  chat3.defineFooter();

  chat3.render('chat-3');
  chat3.sendMessage({
    sender: 1,
    content: 'Olá',
  });

  chat3.sendMessage({
    sender: 2,
    content: { type: 'image', url: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg', caption: 'Olá, tudo bem?' },
    status: 'read',
  });

    // Pop up
    const popupChat = Durenchat.popup({
      container: 'body',
      color: '#5cc1ff',
      id: 'popup-container',
      icons: {
        popupOpen: icons.popupOpen,
        popupClose: icons.popupClose,
      },
    });

    const chat4 = Durenchat.durenchat({
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

    popupChat.defineChat(chat4);

    chat4.defineHeader({
      photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
      name: user.name,
    });

    chat4.defineChatcontainer('dc-messages');
    chat4.defineFooter();

    chat4.sendMessage({
      sender: 1,
      content: 'Olá',
    });

    chat4.sendMessage({
      sender: 2,
      content: { type: 'image', url: 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg', caption: 'Olá, tudo bem?' },
      status: 'read',
    });
});
