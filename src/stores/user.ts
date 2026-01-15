import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '' as string,
        username: '' as string,
    }),
    actions: {
        setToken(newToken: string) {
            this.token = newToken;
        },
        setUsername(newUsername: string) {
            this.username = newUsername;
        },
        clearToken() {
            this.token = '';
        }},
    getters: {
        isLoggedIn: (state) => !!state.token,
    },
});