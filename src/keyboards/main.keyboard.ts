import { KeyboardBuilder } from './_builder';
import { t } from '../locales';

const B = KeyboardBuilder.btn;

export const getLangMenu = () =>
  new KeyboardBuilder()
    .row(B('Tiếng Việt 🇻🇳', 'lang:vi'), B('English 🇺🇸', 'lang:en'))
    .build();

export const getMainMenu = (lang: string) =>
  new KeyboardBuilder()
    .row(B(t(lang, 'btn.tools'), 'm:tools'), B(t(lang, 'btn.profile'), 'm:profile'))
    .row(B(t(lang, 'btn.topup'), 'm:topup'), B(t(lang, 'btn.guide'), 'm:guide'))
    .row(B(t(lang, 'btn.referral'), 'm:referral'), B(t(lang, 'btn.support'), 'm:support'))
    .build();

export const getToolMenu = (lang: string) =>
  new KeyboardBuilder()
    .row(B(t(lang, 'btn.video_tools'), 'm:tools_video'), B(t(lang, 'btn.image_tools'), 'm:tools_image'))
    .row(B(t(lang, 'btn.other_tools'), 'm:tools_other'))
    .back('m:main', t(lang, 'btn.back'))
    .build();

export const getVideoToolMenu = (lang: string) =>
  new KeyboardBuilder()
    .row(B('Higg (22k/vid) 💃', 's:buy:higg'))
    .row(B('Motion Control (15k/vid) 🏃', 's:buy:motion'))
    .back('m:tools', t(lang, 'btn.back'))
    .build();

export const getTopupMenu = (lang: string) =>
  new KeyboardBuilder()
    .row(B(t(lang, 'btn.topup_vnd'), 'pay:vnd'), B(t(lang, 'btn.topup_usdt'), 'pay:usdt'))
    .back('m:main', t(lang, 'btn.back'))
    .build();

export const getReplyKeyboard = () =>
  new KeyboardBuilder()
    .row({ text: '📦 Gói' }, { text: '🆘 Hỗ trợ' })
    .row({ text: '💰 Nạp tiền' })
    .buildReply();
