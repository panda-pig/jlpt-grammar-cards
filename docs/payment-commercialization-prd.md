# JLPT Grammar Deck 支付与商业化 PRD

Last updated: 2026-05-27

## 1. 背景

JLPT Grammar Deck 当前已经具备可上线体验的语法学习系统基础：默认语法库、Anki 风格学习、SM-2 复习、收藏、进度统计、登录同步、用户个人语法库等。下一阶段需要加入商业化能力，用于支持内容维护、服务器成本、后续小程序开发，并为 Pro 功能提供真实支付闭环。

本 PRD 只定义支付与商业化设计，不立即实现代码。确认后再进入数据库迁移、API、页面和支付接入开发。

## 2. 产品目标

### 2.1 核心目标

- 面向中国用户优先支持微信支付。
- 后续微信小程序版本可以复用同一套订单、权益和支付状态模型。
- 提供不登录也可以完成的打赏功能。
- 提供登录后购买的 Pro 一次性买断功能。
- Pro 一开始就接入真实支付，不做纯静态假入口。
- 支付成功后自动授予权益，不依赖人工处理。
- 所有支付状态以服务端和支付平台回调为准，客户端只负责展示和轮询。

### 2.2 非目标

- 当前不做订阅制。
- 当前不做会员分销、优惠券、邀请码、拼团等复杂增长玩法。
- 当前不做 Apple IAP 或安卓应用内购。
- 当前不做海外支付优先方案，如 Stripe、PayPal、Ko-fi。
- 当前不把核心学习能力强行放进付费墙。

## 3. 商业化策略

### 3.1 免费版原则

免费用户仍然可以完成真实学习闭环：

- 查看默认语法库。
- 查看语法详情。
- 使用学习页。
- 使用复习页。
- 收藏语法。
- 使用基础 Dashboard。
- 未登录本地体验。
- 登录后同步基础学习进度。

免费版不能让用户感觉“没付钱就没法学”。Pro 应该卖增强体验，而不是卖基础学习资格。

### 3.2 Pro 一次性买断

Pro 类型：永久买断。

建议价格：

- 首发价：人民币 5.9 元。
- 后续正式价可调整为 19 元或 29 元。

Pro 权益建议：

- 高级相似语法对比。
- 错题本 / 弱点分析。
- 高级学习统计。
- Anki / CSV 导出。
- 自定义语法库更高额度或无限额度。
- AI 例句 / AI 解释额度。
- 后续微信小程序端同步 Pro 权益。

### 3.3 打赏作者

打赏不绑定 Pro 权益，也不要求登录。

推荐金额：

- 3 元：一点支持。
- 6 元：请作者喝杯咖啡。
- 18 元：支持补充更多例句。
- 30 元：支持服务器与维护。
- 自定义金额。

打赏可以允许填写昵称和留言。未填写则显示匿名支持。

## 4. 支付渠道策略

### 4.1 推荐优先级

1. 微信支付直连。
2. 支付宝网页支付，作为第二阶段补充。
3. 海外支付暂不优先。

### 4.2 网页端微信支付路径

网页端建议优先支持微信 Native 扫码支付：

- 适合桌面网页用户。
- 用户点击购买或打赏后，页面展示微信支付二维码。
- 用户用微信扫码支付。
- 页面轮询订单状态。
- 支付成功后展示成功状态。

移动网页端需要谨慎处理：

- 微信 H5 支付通常涉及 H5 支付域名配置、ICP备案、主体一致性等要求。
- 微信内网页 JSAPI 支付通常需要公众号或相关 AppID、OpenID 获取和授权域名配置。
- 当前 Vercel 默认域名不适合作为长期支付域名。

因此网页 MVP 可先支持桌面扫码支付；移动 H5/JSAPI 支付在正式域名、备案和商户配置完成后再开放。

### 4.3 小程序支付路径

后续微信小程序版本使用微信小程序支付：

- 小程序端调用后端创建订单。
- 后端调用微信支付 JSAPI/小程序下单接口生成 `prepay_id`。
- 小程序端调用 `wx.requestPayment`。
- 微信支付回调通知后端。
- 后端更新订单并授予 Pro 权益。

小程序支付必须绑定微信支付商户号和小程序 AppID。

## 5. 用户故事

1. 作为未登录用户，我想不用登录也能打赏作者，以便快速表达支持。
2. 作为未登录用户，我想选择固定金额打赏，以便不用思考金额。
3. 作为未登录用户，我想填写自定义打赏金额，以便按自己的意愿支持。
4. 作为未登录用户，我想支付成功后看到感谢页面，以便确认支付完成。
5. 作为登录用户，我想购买永久 Pro，以便一次付费后长期使用高级功能。
6. 作为登录用户，我想支付完成后自动获得 Pro 权益，以便不用等待人工开通。
7. 作为登录用户，我想在设置页看到自己的 Pro 状态，以便确认权益是否生效。
8. 作为登录用户，我想在 Pro 功能入口看到清晰说明，以便知道付费后能获得什么。
9. 作为桌面网页用户，我想通过微信扫码支付，以便用熟悉的方式完成付款。
10. 作为移动端用户，我想看到当前支付方式是否支持移动网页，以便避免支付失败。
11. 作为小程序用户，我想使用微信小程序支付购买 Pro，以便在微信内完成闭环。
12. 作为作者，我想在后台或数据库中看到打赏记录，以便了解用户支持情况。
13. 作为作者，我想看到 Pro 订单状态，以便排查用户付款问题。
14. 作为系统，我要防止重复回调导致重复开通或重复记账。
15. 作为系统，我要确保只有支付平台确认成功后才授予 Pro 权益。

## 6. 页面入口设计

### 6.1 首页

位置：

- CTA 下方或页面底部。

内容：

- “支持作者继续维护语法库”
- “升级 Pro，解锁高级学习功能”

行为：

- 打赏按钮进入支持作者弹窗或页面。
- Pro 按钮进入 Pro 介绍页。

### 6.2 语法详情页

位置：

- 页面底部，不打断学习。

内容：

- “觉得这个解释有帮助？可以支持作者继续完善语法库。”

行为：

- 只展示轻量打赏入口。
- 不在语法详情页强推 Pro。

### 6.3 Dashboard

位置：

- 统计卡下方或右侧。

内容：

- 免费用户：展示 Pro 提升项。
- Pro 用户：展示 “Pro 已激活”。

行为：

- 免费用户点击进入 Pro 页面。
- Pro 用户点击进入权益详情。

### 6.4 设置页

新增区块：

- 当前计划：Free / Pro。
- Pro 状态：永久有效 / 未开通。
- 支付记录入口。
- 支持作者入口。

### 6.5 Pro 页面

Route 建议：

- `/[lang]/pro`

页面内容：

- Pro 价值说明。
- 免费版与 Pro 对比表。
- 首发价 5.9 元。
- 一次性买断说明。
- 购买按钮。
- 支付二维码区域。
- 支付状态区域。

### 6.6 支持作者页面

Route 建议：

- `/[lang]/support`

页面内容：

- 固定金额选项。
- 自定义金额。
- 可选昵称。
- 可选留言。
- 微信支付二维码。
- 支付成功感谢状态。

## 7. 数据库设计

### 7.1 `payments`

记录所有支付订单，包括打赏和 Pro。

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('tip', 'pro_lifetime')),
  provider TEXT NOT NULL CHECK (provider IN ('wechat', 'alipay')),
  channel TEXT NOT NULL CHECK (channel IN ('native', 'h5', 'jsapi', 'mini_program')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'CNY',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'closed', 'refunded')),
  out_trade_no TEXT NOT NULL UNIQUE,
  provider_transaction_id TEXT,
  provider_prepay_id TEXT,
  qr_code_url TEXT,
  payer_openid TEXT,
  nickname TEXT,
  message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

设计说明：

- `user_id` 可为空，支持未登录打赏。
- Pro 订单必须有 `user_id`。
- `out_trade_no` 由系统生成，不能由客户端传入。
- 金额以分为单位，避免浮点误差。
- `status` 只能由服务端更新。

### 7.2 `user_entitlements`

记录用户权益。

```sql
CREATE TABLE user_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro')),
  source_payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  lifetime BOOLEAN NOT NULL DEFAULT false,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, plan)
);
```

设计说明：

- 永久 Pro 使用 `plan='pro'` + `lifetime=true` + `expires_at=null`。
- 未来如果要做订阅，可以复用 `expires_at`。

### 7.3 `payment_events`

记录支付平台回调和状态变化，便于排查。

```sql
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

设计说明：

- 支付回调原始内容需要留痕。
- 不在前端展示敏感字段。

## 8. RLS 与权限

### 8.1 `payments`

建议策略：

- 未登录用户可以创建打赏订单，但不能读取所有订单。
- 登录用户只能读取自己的订单。
- service role 可以读取和更新所有订单。
- 微信支付回调 API 使用服务端 service role 更新订单状态。

注意：

- 如果用 Supabase RLS，未登录创建打赏订单需要通过服务端 API 完成，不建议直接从浏览器写表。
- 客户端不能直接更新 `status`、`paid_at`、`provider_transaction_id`。

### 8.2 `user_entitlements`

建议策略：

- 登录用户只能读取自己的权益。
- 普通用户不能直接写权益。
- 只有服务端在确认支付成功后写入或更新权益。

## 9. API 设计

### 9.1 创建订单

`POST /api/payments/orders`

请求：

```json
{
  "type": "tip",
  "amountCents": 600,
  "provider": "wechat",
  "channel": "native",
  "nickname": "匿名学习者",
  "message": "继续加油"
}
```

Pro 请求：

```json
{
  "type": "pro_lifetime",
  "provider": "wechat",
  "channel": "native"
}
```

响应：

```json
{
  "paymentId": "uuid",
  "outTradeNo": "JLPT202605270001",
  "amountCents": 590,
  "status": "pending",
  "qrCodeUrl": "weixin://wxpay/...",
  "expiresAt": "2026-05-27T06:30:00.000Z"
}
```

规则：

- Pro 订单必须登录。
- Pro 金额由服务端读取配置，不接受客户端自定义金额。
- 打赏金额允许客户端选择，但服务端必须校验最小值和最大值。

### 9.2 查询订单状态

`GET /api/payments/orders/:id`

响应：

```json
{
  "paymentId": "uuid",
  "type": "pro_lifetime",
  "status": "paid",
  "paidAt": "2026-05-27T06:18:00.000Z",
  "entitlement": {
    "plan": "pro",
    "lifetime": true
  }
}
```

规则：

- 未登录打赏订单可以通过一次性 `paymentId` 查询，不返回敏感信息。
- 登录用户只能查自己的 Pro 订单。

### 9.3 微信支付回调

`POST /api/payments/wechat/notify`

职责：

- 验证微信支付签名。
- 解密回调报文。
- 根据 `out_trade_no` 查找订单。
- 幂等更新订单状态。
- 写入 `payment_events`。
- 如果是 Pro 订单，写入 `user_entitlements`。
- 返回微信支付要求的成功响应。

### 9.4 当前用户权益

`GET /api/me/entitlements`

响应：

```json
{
  "plan": "pro",
  "lifetime": true,
  "expiresAt": null
}
```

## 10. 服务端支付模块设计

建议抽出深模块：

### 10.1 `paymentService`

职责：

- 创建订单。
- 查询订单。
- 关闭过期订单。
- 处理支付成功。
- 授予权益。

对外接口：

- `createPaymentOrder(input)`
- `getPaymentStatus(paymentId, viewer)`
- `markPaymentPaid(providerPayload)`
- `grantEntitlement(userId, paymentId)`

### 10.2 `wechatPayClient`

职责：

- 生成微信支付签名。
- 调用微信下单 API。
- 验证微信回调签名。
- 解密微信回调内容。

对外接口：

- `createNativeOrder(order)`
- `createMiniProgramOrder(order, openid)`
- `verifyNotify(request)`

### 10.3 `entitlementService`

职责：

- 判断当前用户是否 Pro。
- 给用户授予永久 Pro。
- 提供前端可读取的权益状态。

对外接口：

- `getCurrentPlan(userId)`
- `isPro(userId)`
- `grantLifetimePro(userId, paymentId)`

## 11. 环境变量

建议：

```bash
WECHAT_PAY_MCH_ID=
WECHAT_PAY_APP_ID=
WECHAT_PAY_MINI_PROGRAM_APP_ID=
WECHAT_PAY_API_V3_KEY=
WECHAT_PAY_MERCHANT_SERIAL_NO=
WECHAT_PAY_PRIVATE_KEY=
WECHAT_PAY_NOTIFY_URL=
PRO_LIFETIME_PRICE_CENTS=590
PAYMENT_ORDER_EXPIRE_MINUTES=30
```

注意：

- 私钥和 API v3 key 只能放在服务端环境变量。
- 不允许暴露到 `NEXT_PUBLIC_*`。
- Vercel 生产环境需要单独配置。

## 12. 安全要求

- 所有支付订单必须由服务端创建。
- 金额、商品类型、Pro 权益不能相信客户端。
- 支付成功必须以微信支付回调为准。
- 回调必须验签。
- 回调处理必须幂等。
- 同一订单重复回调不能重复授予权益。
- Pro 权益写入必须由服务端完成。
- 订单号必须全局唯一。
- 支付私钥不能写入 Git。

## 13. 运营与合规提醒

上线真实支付前需要准备：

- 微信支付商户号。
- 商户 API 证书 / 私钥。
- API v3 key。
- 商户证书序列号。
- 小程序 AppID。
- 支付回调正式域名。
- 正式域名，建议不要长期使用 `vercel.app`。
- 如做微信 H5 支付，需要确认 ICP 备案、主体一致性、H5 支付域名配置。

产品文案需要避免承诺无法保证的结果，例如：

- “保证通过 JLPT”
- “购买后一定提分”

建议使用：

- “解锁高级学习工具”
- “帮助你更系统地复习”
- “支持作者持续维护语法库”

## 14. 测试方案

### 14.1 单元测试

覆盖：

- 金额校验。
- Pro 订单必须登录。
- 打赏订单允许未登录。
- 订单状态机。
- 幂等回调。
- 权益授予。

### 14.2 集成测试

覆盖：

- 创建 Pro 订单。
- 创建打赏订单。
- 模拟微信支付成功回调。
- 回调后订单变为 paid。
- 回调后 Pro 用户获得权益。
- 重复回调不会重复写权益。

### 14.3 手动验收

网页端：

- 未登录打赏成功。
- 登录购买 Pro 成功。
- 支付二维码过期后状态正确。
- 支付成功后 Pro 页面、Dashboard、设置页显示一致。

小程序端未来验收：

- 小程序创建订单。
- `wx.requestPayment` 成功调起。
- 支付成功后网页和小程序权益一致。

## 15. 分阶段实施计划

### Phase 1：支付基础设施

- 新增 `payments`、`payment_events`、`user_entitlements` 表。
- 新增服务端支付模块。
- 新增订单 API。
- 新增权益 API。
- 新增 Pro 判定工具。

### Phase 2：网页端 Pro 与打赏

- 新增 `/[lang]/pro` 页面。
- 新增 `/[lang]/support` 页面。
- 首页、Dashboard、设置页增加入口。
- 接入微信 Native 扫码支付。
- 支付成功后自动刷新权益。

### Phase 3：Pro 功能锁与权益展示

- 根据权益状态展示 Pro 标识。
- 给高级功能加轻量锁定态。
- 设置页展示支付记录和权益状态。

### Phase 4：移动网页与小程序准备

- 梳理 H5/JSAPI 支付前置条件。
- 准备正式域名和备案。
- 小程序端复用订单和权益 API。

### Phase 5：支付宝补充

- 接入支付宝网页支付。
- 与现有订单表复用。
- 支付宝回调写入同一套 `payments` 和 `payment_events`。

## 16. 待确认问题

1. Pro 首发价是否确定为 5.9 元永久买断？
2. 打赏金额是否采用 3 / 6 / 18 / 30 / 自定义？
3. Pro 的第一批真实权益具体启用哪些？建议先启用“高级统计、错题本、导出、AI 额度预留入口”。
4. 是否已经有微信支付商户号？
5. 是否已经有或准备申请微信小程序 AppID？
6. 是否准备绑定正式自有域名并做 ICP 备案？
7. Pro 购买是否必须先登录？本 PRD 建议必须登录。

## 17. 参考资料

- 微信支付 JSAPI/小程序下单：https://pay.wechatpay.cn/doc/v3/merchant/4012791856
- 微信支付 AppID 账号管理：https://pay.wechatpay.cn/doc/v3/merchant/4013287010
- 微信支付 H5 支付域名配置：https://pay.wechatpay.cn/doc/v3/merchant/4013287193
- 支付宝开放平台网页/移动应用：https://open.alipay.com/module/webApp
