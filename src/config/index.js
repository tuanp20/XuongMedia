require('dotenv').config();

module.exports = {
  bot: {
    token: process.env.TOKEN_BOT,
    polling: true,
  },
  admin: {
    ids: process.env.ADMIN_IDS?.split(',').map(Number) || [],
  },
  payment: {
    bank: {
      name: process.env.BANK_NAME || 'MBBank',
      account: process.env.BANK_ACCOUNT || '',
      holder: process.env.BANK_HOLDER || '',
    },
    crypto: {
      usdtTrc20: process.env.USDT_TRC20 || '',
    },
  },
  store: {
    currency: 'VNĐ',
    itemsPerPage: 5,
  },
};
