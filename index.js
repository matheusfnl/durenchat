import durenchat from './dist/durenchat/index.js';

const chat = durenchat('#durenchat', {
  type: 'inbox',
  users: [{
    id: 2,
    name: 'Matheus',
    color: '#ccffee',
  }],

  type: 'inbox',
  self: 2,
  prefix: 'chat-1',
});

const user = chat.getUser(2);

chat.defineHeader({
  photoUrl: 'https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png',
  name: user.name,
});

chat.defineChatcontainer('dc-messages'); // define o id do container que as mensagens vão ser inseridas
chat.defineFooter(); // define o footer

// chat.sendMessage({
//   sender: 2,
//   content: 'Olá',
// });

// // Customizável

// chat.defineHeader(() => `
//   <div style="display: flex;">
//     <div>
//       ${data.name}
//     </div>
//   </div>
// `);
