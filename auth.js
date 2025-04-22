class AuthService {
    constructor() {
        this.validCredentials = { username: 'admin', password: 'admin' };
        this.sessionTimeout = 60 * 60 * 1000; // 1 hora
    }

    authenticate(username, password) {
        return username === this.validCredentials.username && 
               password === this.validCredentials.password;
    }

    startSession() {
        localStorage.setItem('sessionStart', Date.now());
    }

    validateSession() {
        const sessionStart = localStorage.getItem('sessionStart');
        return sessionStart && (Date.now() - sessionStart) < this.sessionTimeout;
    }

    endSession() {
        localStorage.removeItem('sessionStart');
    }
}

const authService = new AuthService();