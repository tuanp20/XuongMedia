const vi = require('./vi.json');
const en = require('./en.json');

const locales = { vi, en };

/**
 * Dịch key theo ngôn ngữ, thay thế {param} bằng giá trị
 */
const t = (lang, key, params = {}) => {
  let text = locales[lang]?.[key] || locales['vi'][key] || key;
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return text;
};

module.exports = { t };
