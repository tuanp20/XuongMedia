const config = require('../config');

const isAdmin = (chatId) => config.admin.ids.includes(chatId);

module.exports = { isAdmin };
