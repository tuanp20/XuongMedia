import { InlineKeyboardButton, KeyboardButton } from 'node-telegram-bot-api';

export class KeyboardBuilder {
  private rows: any[][] = [];

  constructor() {
    this.rows = [];
  }

  row(...buttons: (InlineKeyboardButton | KeyboardButton)[]): this {
    this.rows.push(buttons);
    return this;
  }

  static btn(text: string, callbackData: string): InlineKeyboardButton {
    return { text, callback_data: callbackData };
  }

  static url(text: string, url: string): InlineKeyboardButton {
    return { text, url };
  }

  static webapp(text: string, url: string): InlineKeyboardButton {
    return { text, web_app: { url } };
  }

  back(callbackData: string = 'm:main', label: string = '🔙'): this {
    this.rows.push([{ text: label, callback_data: callbackData }]);
    return this;
  }

  build(): { reply_markup: { inline_keyboard: any[][] } } {
    return { reply_markup: { inline_keyboard: this.rows } };
  }

  buildReply({ resize = true, persistent = true } = {}): { reply_markup: { keyboard: any[][], resize_keyboard: boolean, persistent: boolean } } {
    return {
      reply_markup: {
        keyboard: this.rows,
        resize_keyboard: resize,
        persistent,
      },
    };
  }
}
