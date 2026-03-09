---
name: tele-affiliate-system
description: Hệ thống Affiliate & Multi-tier Referral cho Telegram Bot - commission tracking, payout, leaderboard, marketing tools. Kích hoạt khi user yêu cầu tạo hệ thống affiliate, referral nâng cao, commission, hoặc chương trình đại lý.
---

# Telegram Affiliate & Multi-tier Referral System - Expert Skill

Chuyên gia xây dựng hệ thống affiliate/đại lý trên Telegram Bot. Multi-tier commission, auto payout, marketing tools.

## System Architecture

```
src/
  services/affiliate.service.js    → Affiliate logic (register, track, payout)
  services/commission.service.js   → Commission calculation engine
  handlers/affiliate.handler.js    → Bot handlers cho affiliate
  keyboards/affiliate.keyboard.js  → Affiliate UI keyboards
  models/affiliate.model.js        → Affiliate data schema
```

## Data Models

### Affiliate Model
```javascript
const affiliate = {
  id: 'aff_123',
  userId: 123456789,           // Telegram user ID
  username: '@username',
  tier: 'silver',              // bronze → silver → gold → diamond
  referralCode: 'XM_abc123',  // Unique code
  referredBy: 'aff_000',      // Upline affiliate ID

  // Stats
  totalReferrals: 50,
  activeReferrals: 35,
  totalEarnings: 5000000,      // VNĐ
  pendingPayout: 1200000,
  paidOut: 3800000,

  // Commission rates
  commissionRate: {
    tier1: 0.20,   // 20% từ khách trực tiếp
    tier2: 0.05,   // 5% từ sub-affiliate level 1
    tier3: 0.02    // 2% từ sub-affiliate level 2
  },

  // Metadata
  joinedAt: '2026-01-15',
  lastActivity: '2026-03-10',
  status: 'active'            // active, inactive, suspended
};
```

### Commission Transaction
```javascript
const commission = {
  id: 'com_456',
  affiliateId: 'aff_123',
  orderId: 'ORD-xxx',
  customerId: 789012345,
  productId: 'prod_abc',
  orderAmount: 500000,
  commissionRate: 0.20,
  commissionAmount: 100000,
  tier: 1,                    // direct=1, sub-aff=2,3
  status: 'pending',          // pending → approved → paid
  createdAt: '2026-03-10'
};
```

## Tier System

```javascript
const TIERS = {
  bronze:  { minSales: 0,   rate1: 0.10, rate2: 0.03, rate3: 0.01, label: '🥉 Bronze' },
  silver:  { minSales: 10,  rate1: 0.15, rate2: 0.04, rate3: 0.015, label: '🥈 Silver' },
  gold:    { minSales: 50,  rate1: 0.20, rate2: 0.05, rate3: 0.02, label: '🥇 Gold' },
  diamond: { minSales: 200, rate1: 0.25, rate2: 0.07, rate3: 0.03, label: '💎 Diamond' }
};

function calculateTier(totalSales) {
  if (totalSales >= 200) return 'diamond';
  if (totalSales >= 50) return 'gold';
  if (totalSales >= 10) return 'silver';
  return 'bronze';
}
```

## Multi-tier Commission Calculation

```javascript
// commission.service.js
function calculateCommissions(order) {
  const commissions = [];
  let currentAffId = order.affiliateId;

  for (let tier = 1; tier <= 3; tier++) {
    if (!currentAffId) break;

    const affiliate = getAffiliate(currentAffId);
    if (!affiliate || affiliate.status !== 'active') break;

    const rate = affiliate.commissionRate[`tier${tier}`];
    const amount = Math.floor(order.amount * rate);

    if (amount > 0) {
      commissions.push({
        affiliateId: currentAffId,
        orderId: order.id,
        tier,
        rate,
        amount,
        status: 'pending'
      });
    }

    currentAffId = affiliate.referredBy;
  }

  return commissions;
}
```

## Bot Handler Patterns

### Affiliate Dashboard
```javascript
// Callback: aff:dashboard
async function showAffiliateDashboard(chatId, userId, lang) {
  const aff = await getAffiliate(userId);

  const text = t(lang, 'affiliate.dashboard', {
    tier: TIERS[aff.tier].label,
    code: aff.referralCode,
    link: `https://t.me/${BOT_USERNAME}?start=ref_${aff.referralCode}`,
    totalReferrals: aff.totalReferrals,
    activeReferrals: aff.activeReferrals,
    totalEarnings: formatMoney(aff.totalEarnings),
    pendingPayout: formatMoney(aff.pendingPayout),
    thisMonth: formatMoney(getMonthlyEarnings(aff.id))
  });

  const kb = new KeyboardBuilder()
    .addButton(t(lang, 'affiliate.myLink'), 'aff:link')
    .addButton(t(lang, 'affiliate.earnings'), 'aff:earnings')
    .row()
    .addButton(t(lang, 'affiliate.team'), 'aff:team')
    .addButton(t(lang, 'affiliate.withdraw'), 'aff:withdraw')
    .row()
    .addButton(t(lang, 'affiliate.materials'), 'aff:materials')
    .addButton(t(lang, 'affiliate.leaderboard'), 'aff:leaderboard')
    .row()
    .addButton(t(lang, 'btn.back'), 'm:main')
    .build();

  await bot.editMessageText(text, { chat_id: chatId, parse_mode: 'HTML', reply_markup: kb });
}
```

### Referral Link Handling
```javascript
// start.handler.js - Deep link: /start ref_XM_abc123
bot.onText(/\/start ref_(.+)/, async (msg, match) => {
  const refCode = match[1];
  const userId = msg.from.id;

  // Không tự refer chính mình
  const referrer = await getAffiliateByCode(refCode);
  if (!referrer || referrer.userId === userId) return;

  // Check đã có referrer chưa
  const existingUser = await getUser(userId);
  if (existingUser && existingUser.referredBy) return; // Đã có

  // Ghi nhận referral
  await setUserReferrer(userId, referrer.id);
  await incrementReferralCount(referrer.id);

  // Notify referrer
  await bot.sendMessage(referrer.userId,
    t(referrer.lang, 'affiliate.newReferral', { name: msg.from.first_name })
  );
});
```

### Marketing Materials
```javascript
// Callback: aff:materials
async function showMaterials(chatId, userId, lang) {
  const aff = await getAffiliate(userId);
  const link = `https://t.me/${BOT_USERNAME}?start=ref_${aff.referralCode}`;

  const templates = [
    {
      name: '📝 Text quảng cáo',
      content: `🔥 Dùng ${BOT_NAME} để mua tools giá rẻ!\n👉 ${link}`
    },
    {
      name: '📊 Kèm social proof',
      content: `✅ 1000+ khách hàng tin dùng\n💰 Giá từ 50k\n🚀 Giao ngay 24/7\n👉 ${link}`
    },
    {
      name: '🎁 Khuyến mãi',
      content: `🎁 Đăng ký qua link nhận bonus!\n${link}`
    }
  ];

  for (const tpl of templates) {
    await bot.sendMessage(chatId, `${tpl.name}\n\n${tpl.content}\n\n─── Copy ở trên ───`);
  }
}
```

### Leaderboard
```javascript
// Callback: aff:leaderboard
async function showLeaderboard(chatId, lang) {
  const top10 = await getTopAffiliates(10, 'thisMonth');

  let text = `🏆 ${t(lang, 'affiliate.topAffiliates')}\n\n`;
  const medals = ['🥇', '🥈', '🥉'];

  top10.forEach((aff, i) => {
    const medal = medals[i] || `${i + 1}.`;
    const name = aff.username || `User ${aff.userId}`;
    text += `${medal} ${name} — ${formatMoney(aff.monthlyEarnings)} (${aff.monthlyReferrals} refs)\n`;
  });

  await bot.editMessageText(text, { chat_id: chatId, parse_mode: 'HTML' });
}
```

## Withdrawal / Payout

```javascript
// Callback: aff:withdraw
async function requestWithdrawal(chatId, userId, lang) {
  const aff = await getAffiliate(userId);
  const MIN_WITHDRAWAL = 200000; // 200k VNĐ

  if (aff.pendingPayout < MIN_WITHDRAWAL) {
    return bot.editMessageText(
      t(lang, 'affiliate.minWithdrawal', { min: formatMoney(MIN_WITHDRAWAL) }),
      { chat_id: chatId }
    );
  }

  // Create withdrawal request
  const withdrawal = {
    affiliateId: aff.id,
    amount: aff.pendingPayout,
    method: 'bank_transfer', // or crypto
    status: 'requested',
    requestedAt: new Date().toISOString()
  };

  await saveWithdrawal(withdrawal);

  // Notify admin
  await bot.sendMessage(ADMIN_CHAT_ID,
    `💸 Yêu cầu rút tiền:\n` +
    `Affiliate: ${aff.username}\n` +
    `Số tiền: ${formatMoney(withdrawal.amount)}\n` +
    `Phương thức: ${withdrawal.method}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Duyệt', callback_data: `a:payout:approve:${withdrawal.id}` },
            { text: '❌ Từ chối', callback_data: `a:payout:reject:${withdrawal.id}` }
          ]
        ]
      }
    }
  );
}
```

## n8n Integration: Auto Payout Workflow

```
Schedule (daily 10am)
  → Google Sheets (read pending withdrawals)
  → Filter (status = "approved")
  → SplitInBatches
    → HTTP Request (banking API / crypto transfer)
    → If (transfer success)
      ├── true → Sheets (update status = "paid")
      │   → Telegram (notify affiliate: "Đã chuyển tiền!")
      └── false → Telegram (alert admin: "Payout failed!")
```

## Callback Data Convention

```
aff:dashboard        → Affiliate dashboard
aff:link             → Referral link + QR
aff:earnings         → Earnings history
aff:earnings:p:{n}   → Earnings page N
aff:team             → Team (downline) list
aff:team:p:{n}       → Team page N
aff:withdraw         → Withdrawal request
aff:withdraw:c       → Confirm withdrawal
aff:materials        → Marketing materials
aff:leaderboard      → Top affiliates
aff:stats:{period}   → Stats by period (week/month/all)
```

## i18n Keys

```json
{
  "affiliate": {
    "dashboard": "📊 <b>Affiliate Dashboard</b>\n\n🏅 Hạng: {tier}\n🔗 Code: <code>{code}</code>\n\n👥 Referrals: {totalReferrals} ({activeReferrals} active)\n💰 Tổng thu nhập: {totalEarnings}\n⏳ Chờ rút: {pendingPayout}\n📅 Tháng này: {thisMonth}",
    "newReferral": "🎉 Có người mới đăng ký qua link của bạn: {name}!",
    "commissionEarned": "💰 Bạn nhận {amount} commission từ đơn hàng #{orderId}",
    "topAffiliates": "Top Affiliates tháng này",
    "minWithdrawal": "⚠️ Số dư tối thiểu để rút: {min}",
    "withdrawSuccess": "✅ Yêu cầu rút tiền đã được gửi. Admin sẽ xử lý trong 24h.",
    "payoutCompleted": "🎉 Đã chuyển {amount} vào tài khoản của bạn!"
  }
}
```

## Best Practices Affiliate MMO

```
✅ Commission real-time notification → tạo dopamine, motivate affiliates
✅ Minimum withdrawal thấp (200k) → cho affiliate nhỏ cũng tham gia
✅ Marketing materials sẵn → giúp affiliate promote dễ hơn
✅ Leaderboard monthly → tạo cạnh tranh, gamification
✅ Tier upgrade tự động → reward top performers
✅ Tracking link unique per affiliate → attribution chính xác
✅ Auto-approve commission sau 7 ngày (nếu không refund)

❌ KHÔNG cho tự refer chính mình
❌ KHÔNG commission cho fake/bot users
❌ KHÔNG quá 3 tier (phức tạp, giống MLM)
❌ KHÔNG delay payout quá 7 ngày (mất trust)
```
