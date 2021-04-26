import { User } from './types'

declare global {
    interface Array<T extends User> {
        findUser(userId?: string): T;
    }
}

Array.prototype.findUser = function<T extends User>(this: T[], userId?: string): T {
    let user = this.find(user => user.userId === userId);

    if (!user) {
        throw new Error('User does not exist');
    }

    return user;
}