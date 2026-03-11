"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReplyKeyboard = exports.getTopupMenu = exports.getVideoToolMenu = exports.getToolMenu = exports.getMainMenu = exports.getLangMenu = void 0;
const _builder_1 = require("./_builder");
const locales_1 = require("../locales");
const B = _builder_1.KeyboardBuilder.btn;
const getLangMenu = () => new _builder_1.KeyboardBuilder()
    .row(B('Tiếng Việt 🇻🇳', 'lang:vi'), B('English 🇺🇸', 'lang:en'))
    .build();
exports.getLangMenu = getLangMenu;
const getMainMenu = (lang) => new _builder_1.KeyboardBuilder()
    .row(B((0, locales_1.t)(lang, 'btn.tools'), 'm:tools'), B((0, locales_1.t)(lang, 'btn.profile'), 'm:profile'))
    .row(B((0, locales_1.t)(lang, 'btn.topup'), 'm:topup'), B((0, locales_1.t)(lang, 'btn.guide'), 'm:guide'))
    .row(B((0, locales_1.t)(lang, 'btn.referral'), 'm:referral'), B((0, locales_1.t)(lang, 'btn.support'), 'm:support'))
    .build();
exports.getMainMenu = getMainMenu;
const getToolMenu = (lang) => new _builder_1.KeyboardBuilder()
    .row(B((0, locales_1.t)(lang, 'btn.video_tools'), 'm:tools_video'), B((0, locales_1.t)(lang, 'btn.image_tools'), 'm:tools_image'))
    .row(B((0, locales_1.t)(lang, 'btn.other_tools'), 'm:tools_other'))
    .back('m:main', (0, locales_1.t)(lang, 'btn.back'))
    .build();
exports.getToolMenu = getToolMenu;
const getVideoToolMenu = (lang) => new _builder_1.KeyboardBuilder()
    .row(B('Higg (22k/vid) 💃', 's:buy:higg'))
    .row(B('Motion Control (15k/vid) 🏃', 's:buy:motion'))
    .back('m:tools', (0, locales_1.t)(lang, 'btn.back'))
    .build();
exports.getVideoToolMenu = getVideoToolMenu;
const getTopupMenu = (lang) => new _builder_1.KeyboardBuilder()
    .row(B((0, locales_1.t)(lang, 'btn.topup_vnd'), 'pay:vnd'), B((0, locales_1.t)(lang, 'btn.topup_usdt'), 'pay:usdt'))
    .back('m:main', (0, locales_1.t)(lang, 'btn.back'))
    .build();
exports.getTopupMenu = getTopupMenu;
const getReplyKeyboard = () => new _builder_1.KeyboardBuilder()
    .row({ text: '📦 Gói' }, { text: '🆘 Hỗ trợ' })
    .row({ text: '💰 Nạp tiền' })
    .buildReply();
exports.getReplyKeyboard = getReplyKeyboard;
