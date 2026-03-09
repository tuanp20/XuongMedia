// In-memory session store
const sessions = new Map();

const getSession = (chatId) => sessions.get(chatId) || { lang: 'vi' };

const setSession = (chatId, data) => {
  sessions.set(chatId, { ...getSession(chatId), ...data });
};

const clearSession = (chatId) => sessions.delete(chatId);

module.exports = { getSession, setSession, clearSession };
