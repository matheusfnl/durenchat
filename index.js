import durenchat from './dist/durenchat/durendal.js';

const chat = durenchat('#durenchat', {
  users: [{
    id: 2,
    name: 'Matheus',
  }],

  self: 2,
  identifier: true,
  class_prefix: 'teste',
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

