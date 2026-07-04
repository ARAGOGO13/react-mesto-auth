const USERS_KEY = 'mesto_users';

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch {
        return {};
    }
}

export function register(email, password) {
    return new Promise((resolve, reject) => {
        const users = getUsers();
        if (users[email]) {
            reject('Ошибка: пользователь с таким email уже существует');
            return;
        }
        users[email] = { email, password };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        resolve({ email });
    });
}

export function login(email, password) {
    return new Promise((resolve, reject) => {
        const users = getUsers();
        const user = users[email];
        if (!user || user.password !== password) {
            reject('Ошибка: неверный email или пароль');
            return;
        }
        const token = btoa(`${email}:${Date.now()}`);
        resolve({ token });
    });
}

export function auth(token) {
    return new Promise((resolve, reject) => {
        try {
            const email = atob(token).split(':')[0];
            if (email) {
                resolve({ data: { email } });
            } else {
                reject('Ошибка: токен недействителен');
            }
        } catch {
            reject('Ошибка: токен недействителен');
        }
    });
}