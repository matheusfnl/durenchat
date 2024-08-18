import { Chat } from './utills/types.js';
import Durenchat from './classes/durendal.js';

export default function(
  id: string | number,
  chat: Chat,
) {
  return new Durenchat(id, chat);
}