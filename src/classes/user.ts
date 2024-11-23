import { UserConstructor } from "../utills/types";

export class User {
  id: string | number;
  name: string;
  color: string;
  photoUrl: string;
  text_color: string = '#000000';

  constructor({
    id,
    name,
    color,
    text_color,
    photoUrl,
  }: UserConstructor) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.photoUrl = photoUrl;

    if (text_color) {
      this.text_color = text_color;
    }
  }

  updateUser(user: UserConstructor) {
    for (const field of Object.keys(user) as Array<keyof UserConstructor>) {
      if (field === 'id' || !(field in this)) continue;

      const value = user[field];
      const type = this[field];

      if (typeof value !== typeof type) {
        throw new Error(`Invalid type for ${field}: expected ${typeof type}, got ${typeof value}`);
      }

      if (typeof value === 'string' && value === '') {
        throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be empty`);
      }

      this[field] = value;
    }
  }
}
