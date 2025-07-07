import { atom } from "jotai";

const isMobile = window.innerWidth <= 480;

export const fontSizeAtom = atom(isMobile ? 14 : 16);