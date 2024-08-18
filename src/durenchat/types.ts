export interface Chat {
  users: User[];
  self: number;
  identifier: boolean | Function;
  class_prefix: string;
}

export interface Message {
  text: string;
  origin: string | number;
  identifier: boolean | Function;
}
export interface User {
  id: string | number;
  name: string;
  identifier: boolean | Function;
}