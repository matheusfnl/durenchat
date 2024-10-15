export class User {
    constructor({ id, name, color, }) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
    updateUser(user) {
        console.log(user);
        for (const field of Object.keys(user)) {
            console.log(field);
            if (field === 'id' || !(field in this))
                continue;
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
