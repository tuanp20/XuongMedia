---
name: tele-store-builder
description: Xây dựng và mở rộng Telegram Bot Store - quản lý sản phẩm, danh mục, giỏ hàng, đơn hàng. Kích hoạt khi user yêu cầu thêm sản phẩm, tạo catalog, quản lý đơn hàng, hoặc bất kỳ tính năng store nào.
---

# Telegram Store Builder - Expert Skill

Bạn là một chuyên gia Telegram Bot Store với 10+ năm kinh nghiệm xây dựng hệ thống bán hàng trên Telegram. Bạn hiểu sâu về cách tối ưu UX trên Telegram để tăng tỷ lệ chuyển đổi.

## Project Structure

```
src/
  services/store.service.js    → Logic xử lý store (CRUD sản phẩm, danh mục)
  services/order.service.js    → Logic đơn hàng (tạo, cập nhật, lịch sử)
  services/cart.service.js     → Logic giỏ hàng
  handlers/store.handler.js    → Callback handlers cho store
  keyboards/store.keyboard.js  → Inline keyboards cho store UI
  models/product.model.js      → Schema sản phẩm
  models/order.model.js        → Schema đơn hàng
  models/category.model.js     → Schema danh mục
```

## Quy tắc thiết kế Store

1. **Catalog hiển thị**: Mỗi sản phẩm hiển thị dạng card với: Tên, Giá, Mô tả ngắn, nút Mua/Chi tiết
2. **Pagination**: Tối đa 5 sản phẩm/trang, có nút ◀️ ▶️ điều hướng
3. **Giỏ hàng**: Lưu tạm trong memory/Redis, hiển thị tổng tiền real-time
4. **Đơn hàng**: Mã đơn format `ORD-{timestamp}-{random}`, trạng thái: pending → paid → processing → completed
5. **Callback data format**: `store:{action}:{id}:{page}` (max 64 bytes)

## Patterns bắt buộc

```javascript
// Callback data phải compact (Telegram giới hạn 64 bytes)
// Dùng prefix ngắn: s=store, c=cart, o=order
// Ví dụ: "s:buy:abc123:1" thay vì "store_buy_product_abc123_page_1"

// Pagination pattern
const buildPagination = (items, page, perPage, prefix) => {
  const start = page * perPage;
  const end = start + perPage;
  const pageItems = items.slice(start, end);
  const nav = [];
  if (page > 0) nav.push({ text: '◀️', callback_data: `${prefix}:${page-1}` });
  nav.push({ text: `${page+1}/${Math.ceil(items.length/perPage)}`, callback_data: 'noop' });
  if (end < items.length) nav.push({ text: '▶️', callback_data: `${prefix}:${page+1}` });
  return { pageItems, nav };
};

// Product card format
const formatProduct = (p, lang) => {
  return `*${p.name}*\n💰 ${p.price.toLocaleString()}đ\n📝 ${p.description}\n${'⭐'.repeat(p.rating || 5)}`;
};
```

## Khi thêm sản phẩm mới

1. Thêm vào `models/product.model.js`
2. Tạo keyboard tương ứng trong `keyboards/store.keyboard.js`
3. Thêm handler trong `handlers/store.handler.js`
4. Đăng ký callback trong router chính (`src/handlers/index.js`)

## Anti-patterns (KHÔNG làm)

- Không hardcode sản phẩm trong handler - luôn tách ra model/service
- Không gửi tin nhắn mới khi có thể editMessageText
- Không để callback_data > 64 bytes
- Không lưu giỏ hàng vào biến global không có TTL
