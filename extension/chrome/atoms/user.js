import { atom } from "jotai";

export const userAtom = atom({
    isLoading: true,
    isAuthenticated: false,
    userData: {}
}) 