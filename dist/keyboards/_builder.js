"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardBuilder = void 0;
class KeyboardBuilder {
    rows = [];
    constructor() {
        this.rows = [];
    }
    row(...buttons) {
        this.rows.push(buttons);
        return this;
    }
    static btn(text, callbackData) {
        return { text, callback_data: callbackData };
    }
    static url(text, url) {
        return { text, url };
    }
    static webapp(text, url) {
        return { text, web_app: { url } };
    }
    back(callbackData = 'm:main', label = '🔙') {
        this.rows.push([{ text: label, callback_data: callbackData }]);
        return this;
    }
    build() {
        return { reply_markup: { inline_keyboard: this.rows } };
    }
    buildReply({ resize = true, persistent = true } = {}) {
        return {
            reply_markup: {
                keyboard: this.rows,
                resize_keyboard: resize,
                persistent,
            },
        };
    }
}
exports.KeyboardBuilder = KeyboardBuilder;
