

export class User {
    username: string;
    id: string;
    email: string;
    sessionKey: string;

    constructor(email: string, sessionKey: string) {
        this.email = email;
        this.sessionKey = sessionKey;
    }

    fetchLocal(): Promise<{}> {
        return new Promise((resolve, reject) => {
            [this.username, this.id] = localStorage.getItem(this.email).split(',');
            resolve(true);
        });
        
    }

    fetchRemoteUnauthenticated() {
        return new Promise((resolve, reject) => {
            
        });

    }

    fetchRemoteAuthenticated(): Promise<{}> {
        return new Promise((resolve, reject) => {

        });
    }
}

