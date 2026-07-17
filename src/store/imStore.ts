import { defineStore } from 'pinia';

export const useIMStore = defineStore('im', {
    state: () => ({
        name: 'imStore',
    }),
    getters: {
        getName: (state) => state.name,
    },
    actions: {
        setName(name: string) {
            this.name = name;
        },
    },
});