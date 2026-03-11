import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  bot: {
    token: string;
    polling: boolean;
  };
  admin: {
    ids: number[];
  };
  payment: {
    bank: {
      name: string;
      account: string;
      holder: string;
    };
    crypto: {
      usdtTrc20: string;
    };
  };
  store: {
    currency: string;
    itemsPerPage: number;
  };
  db: {
    uri: string;
  };
}

const config: Config = {
  bot: {
    token: process.env.TOKEN_BOT || '',
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
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/xuongmedia',
  },
};

export default config;
