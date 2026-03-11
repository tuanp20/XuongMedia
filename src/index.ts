import mongoose from 'mongoose';
import config from './config';

// Connect to MongoDB
mongoose.connect(config.db.uri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Khởi tạo bot và handlers sau khi DB sẵn sàng
    // We use dynamic import or require here because handlers rely on the bot instance
    // which is initialized in bot.ts. But since we use ES modules now,
    // we can just import them.
    
    require('./handlers');
    const bot = require('./bot').default;
    
    bot.on('polling_error', (err: any) => {
      if (err.message.includes('409 Conflict')) {
        console.warn('⚠️ Polling Conflict: Đang có một instance khác chạy. Vui lòng đóng các cửa sổ terminal cũ.');
      } else {
        console.error('❌ Polling Error:', err.message);
      }
    });

    console.log('🤖 Bot is running...');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
