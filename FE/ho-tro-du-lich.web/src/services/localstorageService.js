export const keyToken = 'Authentication-GOC-App-Token';
export const keyPrevious = 'previousUrl';

export const localStorageService = {
    getToken: () => {
        return JSON.parse(localStorage.getItem(keyToken));
    },
    getAccessToken: () => {
        const tokenData = JSON.parse(localStorage.getItem(keyToken));
        return tokenData ? tokenData.accessToken : null;
    },
    setToken: (token) => {
        localStorage.setItem(keyToken, token);
    },
    removeToken: () => {
        localStorage.removeItem(keyToken);
    },
    getPreviousUrl: () => {
        return localStorage.getItem(keyPrevious);
    },
    setPreviousUrl: (url) => {
        localStorage.setItem(keyPrevious, url);
    },
    removePreviousUrl: () => {
        localStorage.removeItem(keyPrevious);
    },
}