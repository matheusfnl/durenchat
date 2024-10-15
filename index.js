import durenchat from './dist/durenchat/index.js';

const chat = durenchat('#durenchat', {
  users: [{
    id: 2,
    name: 'Matheus',
    color: '#ccffee',
  }],

  self: 2,
});

chat.addUser({
  id: 1,
  name: 'Oliver',
  color: '#ffb8f5'
});

chat.sendMessage({
  content: 'Olá',
  sender: 1,
});

chat.sendMessage({
  content: 'Olá, td bem?',
  sender: 2,
});

chat.sendMessage({
  content: 'Como vai',
  sender: 2,
});

chat.sendMessage({
  content: 'Bem!',
  sender: 1,
});


chat.updateUser({
  id: 1,
  name: 'Oliver 2222',
  color: '#ffb8f5'
});

chat.updateUser({
  id: 2,
  name: 'Matheus Cleber',
  color: '#ffb8f5'
});


console.log(chat);