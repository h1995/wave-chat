type User = {
    id: string;
    username: string;
    partnerId?: string;
};

export class ChatStore {
    private users = new Map<string, User>();

    addUser(user: User) {
        this.users.set(user.id, user);
    }

    getUser(id: string) {
        return this.users.get(id);
    }

    getUserByUsername(username: string) {
        return [...this.users.values()].find(u => u.username === username);
    }

    removeUser(id: string) {
        this.users.delete(id);
    }

    setPartner(userId: string, partnerId?: string) {
        const user = this.users.get(userId);
        if (user) user.partnerId = partnerId;
    }
}