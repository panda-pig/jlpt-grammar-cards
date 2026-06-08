# 微信支付上线验收清单

更新日期：2026-06-08

## 目标

确认 JLPT Grammar Deck 的微信 Native 支付可以在线上完成：

- Pro 永久版下单
- 匿名打赏下单
- 微信支付回调验签
- 支付成功后自动激活 Pro
- 订单记录可在账户设置和管理后台查看

## Vercel 环境变量

Production 至少需要配置：

```env
SUPABASE_SERVICE_ROLE_KEY=
PRO_LIFETIME_PRICE_CENTS=590
PAYMENT_ORDER_EXPIRE_MINUTES=30
WECHAT_PAY_MCH_ID=
WECHAT_PAY_APP_ID=
WECHAT_PAY_API_V3_KEY=
WECHAT_PAY_MERCHANT_SERIAL_NO=
WECHAT_PAY_PRIVATE_KEY=
WECHAT_PAY_NOTIFY_URL=https://jlpt-grammar-cards.com/api/payments/wechat/notify
```

注意：

- `WECHAT_PAY_PRIVATE_KEY` 必须是服务端环境变量，不能带 `NEXT_PUBLIC_`。
- 如果在 Vercel UI 粘贴 PEM 私钥，可以使用真实换行或 `\n`，代码会自动归一化。
- `WECHAT_PAY_NOTIFY_URL` 必须是公网 HTTPS。

## Supabase 数据库

确认已经执行：

- `006_payments_entitlements.sql`
- `007_pro_private_grammar_limit.sql`

验收 SQL：

```sql
select count(*) from payments;
select count(*) from user_entitlements;
select public.is_active_pro(auth.uid());
```

## Pro 购买验收

1. 登录线上账号。
2. 打开 `/zh/pro`。
3. 点击购买 Pro 永久版。
4. 应生成微信支付二维码。
5. 微信扫码支付 ¥5.9。
6. 支付后页面轮询到 `paid`。
7. `/zh/dashboard` 显示 Pro 已激活。
8. `/zh/settings` 的支付记录显示 Pro 订单已支付。
9. `/zh/admin/payments` 显示该订单、金额、状态和支付时间。

## 打赏验收

1. 退出登录或使用匿名窗口。
2. 打开 `/zh/support`。
3. 选择一个金额或输入自定义金额。
4. 点击微信扫码打赏。
5. 扫码支付。
6. 页面显示支付成功感谢提示。
7. 管理后台 `/zh/admin/payments` 可看到匿名打赏订单。

## 异常验收

1. 创建订单后不支付，等待超过过期时间。
2. 刷新订单状态或打开支付记录。
3. 订单应从 `pending` 变为 `closed`。
4. 支付面板应显示订单已过期。

## 安全验收

- 非管理员访问 `/api/admin/payments` 应返回 403。
- 未登录访问 `/api/payments/orders` 的 GET 应返回 401。
- 非订单所属用户查询他人绑定订单应返回 403。
- 微信回调金额不一致时不能激活 Pro。
- 微信回调 provider 不一致时不能激活 Pro。

## 当前未做

- 支付宝。
- 微信 H5 / JSAPI / 小程序支付。
- 退款发起与退款回调。
- 后台手动补单。
- 更完整的支付成功营销落地页（当前已有订单详情页）。
