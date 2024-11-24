import { describe, it, expect, vi, beforeAll } from 'vitest';
import { durenchat } from '../index.ts';
import 'emoji-picker-element';

const fixedDate = new Date('2024-12-12T00:00:00Z');

vi.useFakeTimers();
vi.setSystemTime(fixedDate);

describe('Test Durenchat class', () => {
  const chat = durenchat({
    users: [{
      id: 1,
      name: 'Matheus',
      color: '#4a3d1f',
      textColor: '#fff',
      photoUrl: '',
    }],
    self: 1,
  });

  it('should get user', () => {
    expect(chat.getUser(1)).toEqual({
      id: 1,
      name: 'Matheus',
      color: '#4a3d1f',
      textColor: '#fff',
      photoUrl: '',
    });
  });

  it('should not get user', () => {
    expect(() => chat.getUser(2)).toThrowError('User not found');
  });

  it('should define header', () => {
    chat.defineHeader({
      photoUrl: '',
      name: 'Matheus',
    });

    expect(chat.wrapperElement).toMatchSnapshot()
  });

  it('should define chat container', () => {
    chat.defineChatcontainer('dc-messages');

    expect(chat.wrapperElement).toMatchSnapshot()
  });

  it('should define footer', () => {
    chat.defineFooter();

    expect(chat.wrapperElement).toMatchSnapshot()
  });

  it('should send text', () => {
    const message = chat.sendMessage({
      sender: 1,
      content: 'Olá',
    });

    expect(message.content).toEqual('Olá');
    expect(message.status).toEqual('sent');
    expect(message.sender).toEqual({
      id: 1,
      name: 'Matheus',
      color: '#4a3d1f',
      textColor: '#fff',
      photoUrl: '',
    });
  });

  it('should send image', () => {
    const message = chat.sendMessage({
      sender: 1,
      content: {
        type: 'image',
        url: 'https://example.com/image.jpg',
        caption: 'Texto',
      },
    });

    expect(message.content).toEqual({
      type: 'image',
      url: 'https://example.com/image.jpg',
      caption: 'Texto',
    });

    expect(message.status).toEqual('sent');
    expect(message.sender).toEqual({
      id: 1,
      name: 'Matheus',
      color: '#4a3d1f',
      textColor: '#fff',
      photoUrl: '',
    });
  });

  it('should send audio', () => {
    const message = chat.sendMessage({
      sender: 1,
      content: {
        type: 'audio',
        url: 'https://example.com/audio.mp3',
      },
    });

    expect(message.content).toEqual({
      type: 'audio',
      url: 'https://example.com/audio.mp3',
    });

    expect(message.status).toEqual('sent');
    expect(message.sender).toEqual({
      id: 1,
      name: 'Matheus',
      color: '#4a3d1f',
      textColor: '#fff',
      photoUrl: '',
    });
  });

  it('should send video', () => {
    const message = chat.sendMessage({
      sender: 1,
      content: {
        type: 'video',
        url: 'https://example.com/video.mp4',
      },
    });

    expect(message.content).toEqual({
      type: 'video',
      url: 'https://example.com/video.mp4',
    });

    expect(message.status).toEqual('sent');
    expect(message.sender).toEqual({
      id: 1,
      name: 'Matheus',
      color: '#4a3d1f',
      textColor: '#fff',
      photoUrl: '',
    });
  });

  it('should send document', () => {
    const message = chat.sendMessage({
      sender: 1,
      content: {
        type: 'document',
        url: 'https://example.com/document.pdf',
      },
    });

    expect(message.content).toEqual({
      type: 'document',
      url: 'https://example.com/document.pdf',
    });

    expect(message.status).toEqual('sent');
    expect(message.sender).toEqual({
      id: 1,
      name: 'Matheus',
      color: '#4a3d1f',
      textColor: '#fff',
      photoUrl: '',
    });
  });

  it('should match snapshot', () => {
    expect(chat).toMatchSnapshot();
  })
})