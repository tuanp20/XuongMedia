const bot = require('./bot');

// Load tất cả handlers
require('./handlers');

bot.on('polling_error', (err) => console.error('Polling Error:', err.message));

console.log('🤖 Bot is running...');
