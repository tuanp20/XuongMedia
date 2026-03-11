/**
 * In-memory session store (Fallback)
 */
const sessions = new Map<number, any>();

export const getSession = (chatId: number) => sessions.get(chatId) || { lang: 'vi' };

export const setSession = (chatId: number, data: any) => {
  sessions.set(chatId, { ...getSession(chatId), ...data });
};

export const clearSession = (chatId: number) => sessions.delete(chatId);
