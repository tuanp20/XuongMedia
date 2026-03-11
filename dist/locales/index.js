"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = void 0;
const vi_json_1 = __importDefault(require("./vi.json"));
const en_json_1 = __importDefault(require("./en.json"));
const locales = { vi: vi_json_1.default, en: en_json_1.default };
/**
 * Thoát các ký tự đặc biệt của Markdown để tránh lỗi Telegram API
 */
const escapeMarkdown = (text) => {
    return String(text).replace(/([_*\[`])/g, '\\$1');
};
/**
 * Dịch key theo ngôn ngữ, thay thế {param} bằng giá trị (đã được escape)
 */
const t = (lang, key, params = {}) => {
    let text = locales[lang]?.[key] || locales['vi']?.[key] || key;
    for (const [k, v] of Object.entries(params)) {
        // Chỉ escape nếu giá trị là string/number và key không bắt đầu bằng 'raw_'
        const value = k.startsWith('raw_') ? String(v) : escapeMarkdown(v);
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), value);
    }
    return text;
};
exports.t = t;
