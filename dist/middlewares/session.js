"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSession = exports.setSession = exports.getSession = void 0;
/**
 * In-memory session store (Fallback)
 */
const sessions = new Map();
const getSession = (chatId) => sessions.get(chatId) || { lang: 'vi' };
exports.getSession = getSession;
const setSession = (chatId, data) => {
    sessions.set(chatId, { ...(0, exports.getSession)(chatId), ...data });
};
exports.setSession = setSession;
const clearSession = (chatId) => sessions.delete(chatId);
exports.clearSession = clearSession;
