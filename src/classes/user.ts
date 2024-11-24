import { UserConstructor } from "../utills/types";

export class User {
  private id: string | number;
  private name: string;
  private color: string;
  private photoUrl: string;
  private textColor: string = '#000000';

  constructor({
    id,
    name,
    color,
    textColor,
    photoUrl,
  }: UserConstructor) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.photoUrl = photoUrl;

    if (textColor) {
      this.textColor = textColor;
    }
  }

  public getId(): string | number {
    return this.id;
  }

  public getColor(): string {
    return this.color;
  }

  public getTextColor(): string {
    return this.textColor;
  }

  public updateUser(user: UserConstructor): void {
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
