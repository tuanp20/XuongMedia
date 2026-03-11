import vi from './vi.json';
import en from './en.json';

const locales: Record<string, any> = { vi, en };

/**
 * Thoát các ký tự đặc biệt của Markdown để tránh lỗi Telegram API
 */
const escapeMarkdown = (text: string | number): string => {
  return String(text).replace(/([_*\[`])/g, '\\$1');
};

/**
 * Dịch key theo ngôn ngữ, thay thế {param} bằng giá trị (đã được escape)
 */
export const t = (lang: string, key: string, params: Record<string, string | number> = {}): string => {
  let text: string = locales[lang]?.[key] || locales['vi']?.[key] || key;
  
  for (const [k, v] of Object.entries(params)) {
    // Chỉ escape nếu giá trị là string/number và key không bắt đầu bằng 'raw_'
    const value = k.startsWith('raw_') ? String(v) : escapeMarkdown(v);
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), value);
  }
  
  return text;
};
