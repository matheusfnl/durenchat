import { UserConstructor } from "../utills/types";
export declare class User {
    id: string | number;
    name: string;
    color: string;
    photoUrl: string;
    text_color: string;
    constructor({ id, name, color, text_color, photoUrl, }: UserConstructor);
    updateUser(user: UserConstructor): void;
}
