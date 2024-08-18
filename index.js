import durenchat from './dist/durenchat/index.js';

const chat = durenchat('#durenchat', {
  users: [{
    id: 2,
    name: 'Matheus',
  }],

  self: 2,
});

chat.addUser({
  id: 1,
  name: 'Oliver',
});

chat.sendMessage({
  text: 'Olá',
  origin: 1,
});

chat.sendMessage({
  text: 'Olá, td bem?',
  origin: 2,
});

