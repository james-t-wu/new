# 🔐 认证检查功能使用说明

## ✅ 已解决的问题

之前的问题:**Token存在但已过期,页面仍然可以访问**

现在的解决方案:**两层验证机制**
1. ✅ 检查token是否存在
2. ✅ **通过实际API调用验证token是否有效** (新增!)

## 🚀 工作原理

```
用户访问页面
    ↓
【第1层】检查 api_token cookie 是否存在
    ↓
├─ 不存在 → ❌ 立即跳转到登录页
└─ 存在 → 继续检查
    ↓
【第2层】调用API验证token是否有效
    ↓
    ├─ HTTP 401/403 → ❌ Token已过期,清除cookie并跳转
    ├─ HTTP 200/404 → ✅ Token有效,允许访问
    └─ 网络错误 → 根据token新鲜度决定
        ├─ Token设置<5分钟 → ✅ 信任token (可能是网络问题)
        └─ Token较旧 → ❌ 不信任,跳转登录
```

## 📝 核心特性

### 1. **真实API验证**
不再只是检查cookie存在,而是实际调用API:
```javascript
GET https://ai.innonation.io/inno_ai_services/api/Company/GetDetailInfo?id=test
Authorization: Bearer {your_api_token}
```

### 2. **智能降级策略**
- ✅ Token刚设置(<5分钟) + 网络故障 = 允许访问
- ❌ 老Token + 无法验证 = 拒绝访问
- ❌ 返回401/403 = 立即拒绝并清除cookie

### 3. **自动清理**
Token验证失败时,自动执行:
```javascript
// 清除过期的cookie
document.cookie = 'api_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
// 清除localStorage
localStorage.removeItem('userId');
// 跳转登录页
window.location.href = '/home_israel.aspx';
```

## 🎯 使用方法

### 在HTML页面中引入

```html
<!DOCTYPE html>
<html>
<head>
    <title>您的页面</title>

    <!-- 其他脚本 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

    <!-- 认证检查脚本 - 在这里引入 -->
    <script src="common/js/auth-check.js"></script>

    <style>
        /* 样式 */
    </style>
</head>
<body>
    <!-- 内容 -->
</body>
</html>
```

### 就这么简单!

✅ **无需任何额外配置**
✅ **自动执行检查**
✅ **自动跳转**

## 🧪 测试场景

### 场景1: 用户未登录
```
1. 清除浏览器所有cookie
2. 访问 company_profile_israel.html
3. 结果: 立即跳转到 /home_israel.aspx
```

### 场景2: Token已过期
```
1. 浏览器中有 api_token cookie,但token已过期
2. 访问 company_profile_israel.html
3. 结果: API返回401 → 清除cookie → 跳转到登录页
```

### 场景3: Token有效
```
1. 浏览器中有有效的 api_token
2. 访问 company_profile_israel.html
3. 结果: 正常显示页面
```

### 场景4: 网络故障
```
1. 断开网络连接
2. 浏览器中有最近(<5分钟)设置的token
3. 访问 company_profile_israel.html
4. 结果: 允许访问 (避免因网络问题误拦截)
```

## 🔍 调试方法

### 在浏览器控制台查看日志

```javascript
// 正常流程
[Auth Check] Token found, validating with API...
[Auth Check] Token validation successful (status: 200)
[Auth Check] Authentication successful, access granted

// Token过期
[Auth Check] Token found, validating with API...
[Auth Check] Token is invalid or expired (HTTP 401)
[Auth Check] Redirecting to login: Token validation failed

// 无Token
[Auth Check] Redirecting to login: No token found
```

### 手动测试API

```javascript
// 在控制台执行
await window.AuthCheck.validateToken()
// 返回: true (token有效) 或 false (token无效)

// 查看当前token
window.AuthCheck.getCookie('api_token')

// 手动触发检查
await window.AuthCheck.check()
```

## ⚙️ 高级配置

### 修改API验证端点

如果需要使用不同的API:

```javascript
// 编辑 auth-check.js 第62行
const testUrl = `${API_BASE_URL}/Company/GetDetailInfo?id=test`;

// 改为:
const testUrl = `${API_BASE_URL}/YourAPI/Endpoint`;
```

### 修改Token新鲜度阈值

默认5分钟内的token在网络故障时仍被信任:

```javascript
// 编辑 auth-check.js 第97行
if (tokenAge < 300) { // 300秒 = 5分钟

// 改为10分钟:
if (tokenAge < 600) { // 600秒 = 10分钟
```

### 修改登录页面

```javascript
// 编辑 auth-check.js 第12行
const LOGIN_PAGE = '/home_israel.aspx';

// 改为你的登录页:
const LOGIN_PAGE = '/your-login-page.aspx';
```

## 📊 性能影响

- **首次检查时间**: ~50-200ms (API调用)
- **网络超时**: 3秒后自动失败
- **缓存**: 无缓存,每次页面加载都验证
- **用户体验**: 异步执行,不阻塞页面渲染

## ❓ 常见问题

### Q: 为什么登录后还是跳转?
**A**: 检查以下几点:
1. 登录页面是否正确设置了 `api_token` cookie
2. Cookie的 `path` 是否为 `/`
3. 浏览器控制台是否有JavaScript错误

### Q: 如何避免刚登录就被验证踢出?
**A**: 在登录成功后调用:
```javascript
window.AuthCheck.markTokenAsSet();
```
这会标记token为"新鲜",在网络问题时不会被拦截。

### Q: 本地开发时总是跳转怎么办?
**A**: 两个方法:
1. 暂时注释掉 `<script src="common/js/auth-check.js"></script>`
2. 在控制台设置测试token:
```javascript
document.cookie = 'api_token=test_token; path=/';
sessionStorage.setItem('token_set_time', Date.now());
location.reload();
```

### Q: API调用会影响页面加载速度吗?
**A**: 不会!
- 检查是**异步执行**的,不阻塞页面渲染
- 用户可以立即看到页面内容
- 只有在token无效时才会跳转

## 📋 批量应用清单

需要添加认证的页面:

- [x] `company_profile_israel.html` ✅ 已完成
- [ ] `deal_israel.html`
- [ ] `acquisition_details_israel.html`
- [ ] `daily_news_israel.html`
- [ ] `funding_round_details_israel.html`
- [ ] `tech_news_israel.html`
- [ ] `technical_card_israel.html`
- [ ] `ai_search_israel.html`
- [ ] `investment_statistic_israel.html`
- [ ] `discover_israel.html`
- [ ] `company_ai_analysis_israel.html`
- [ ] `report_israel.html`

## 🔒 安全说明

1. ✅ **Token验证由后端执行** - 前端只是触发检查
2. ✅ **过期Token会被清除** - 防止重复使用
3. ✅ **401/403立即拦截** - 不给过期token任何机会
4. ⚠️ **前端检查不是安全保障** - 后端API必须独立验证token

## 📞 技术支持

如有问题,请检查:
1. 浏览器控制台日志
2. Network标签查看API响应
3. Cookie设置是否正确

---

**版本**: 2.0 (Enhanced with API Validation)
**更新日期**: 2025-10-16
**主要改进**: 添加了实际API验证,解决了Token过期但仍能访问的问题
