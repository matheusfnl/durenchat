import { UserConstructor } from "../utills/types";

export class User {
  private id: string | number;
  private name: string;
  private color: string;
  private photoUrl: string;
  private textColor: string = '#000000';

  /**
   * Construtor da classe User.
   * @param id - O ID do usuário.
   * @param name - O nome do usuário.
   * @param color - A cor associada ao usuário.
   * @param textColor - A cor do texto do usuário.
   * @param photoUrl - A URL da foto do usuário.
   */
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

  /**
   * Função para obter o ID do usuário.
   * @returns O ID do usuário.
   */
  public getId(): string | number {
    return this.id;
  }

  /**
   * Função para obter a cor associada ao usuário.
   * @returns A cor do usuário.
   */
  public getColor(): string {
    return this.color;
  }

  /**
   * Função para obter a cor do texto do usuário.
   * @returns A cor do texto do usuário.
   */
  public getTextColor(): string {
    return this.textColor;
  }

  /**
   * Função para atualizar os dados do usuário.
   * @param user - Objeto contendo os novos dados do usuário.
   */
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