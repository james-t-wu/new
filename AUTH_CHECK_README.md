# 认证检查功能说明 (Authentication Check Documentation)

## 📋 概述

为 `new` 目录下的HTML页面添加了用户认证检查功能。如果用户未登录(没有有效的 `api_token` cookie),访问这些页面时会自动跳转到 `home_israel.aspx` 登录页面。

## 🎯 功能特点

- ✅ 自动检测用户登录状态
- ✅ 未登录用户自动跳转到登录页面
- ✅ 支持登录后返回原页面
- ✅ 轻量级实现,无需修改现有业务逻辑
- ✅ 统一的认证检查机制

## 📁 文件结构

```
new/
├── common/
│   └── js/
│       └── auth-check.js          # 认证检查核心脚本
├── company_profile_israel.html    # 已添加认证检查的示例页面
├── test-auth.html                 # 认证功能测试页面
└── AUTH_CHECK_README.md           # 本说明文档
```

## 🚀 使用方法

### 1. 在HTML页面中引入认证脚本

在需要保护的HTML页面的 `<head>` 部分添加以下代码:

```html
<!-- 认证检查脚本 - 必须在页面加载前执行 -->
<script src="common/js/auth-check.js"></script>
```

**推荐位置**: 在其他业务脚本(如Vue、Axios等)之后,在 `<style>` 标签之前引入。

### 2. 示例实现

参考 `company_profile_israel.html` 的实现:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <title>公司详情 - Innonation</title>

    <!-- 其他CSS和库文件 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

    <!-- 认证检查脚本 - 在这里引入 -->
    <script src="common/js/auth-check.js"></script>

    <style>
        /* 页面样式 */
    </style>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```

## 🔍 工作原理

### 认证检查逻辑

1. **Cookie检查**: 检查 `api_token` cookie 是否存在且有效
2. **LocalStorage检查**: 备用方案,检查 `localStorage.userId`
3. **自动跳转**: 如果两者都不存在,自动跳转到 `/home_israel.aspx`
4. **保存原地址**: 将当前页面URL保存到 `sessionStorage.redirect_after_login`,便于登录后返回

### 认证判断条件

用户被认为"已登录"需要满足以下任一条件:

- 存在有效的 `api_token` cookie (不为空、null、undefined)
- 存在有效的 `userId` 在 localStorage 中

### 跳转流程

```
用户访问页面
    ↓
auth-check.js 加载
    ↓
检查认证状态
    ↓
├─ 已登录 → 正常显示页面
└─ 未登录 → 保存当前URL → 跳转到 /home_israel.aspx
```

## 🧪 测试

### 使用测试页面

访问 `new/test-auth.html` 进行交互式测试:

1. **设置测试Token**: 模拟登录状态
2. **清除Token**: 模拟登出状态
3. **手动检查**: 查看当前认证状态
4. **刷新页面**: 触发自动认证检查

### 浏览器控制台测试

打开浏览器开发者工具,在控制台执行:

```javascript
// 检查是否已加载认证模块
console.log(window.AuthCheck);

// 检查当前认证状态
console.log('Is Authenticated:', window.AuthCheck.isAuthenticated());

// 获取 api_token
console.log('API Token:', window.AuthCheck.getCookie('api_token'));

// 手动触发认证检查
window.AuthCheck.check();
```

## 📝 批量应用到其他页面

### 需要添加认证的页面列表

以下 `new` 目录下的页面都应该添加认证检查:

- ✅ `company_profile_israel.html` (已完成)
- ⬜ `deal_israel.html`
- ⬜ `acquisition_details_israel.html`
- ⬜ `daily_news_israel.html`
- ⬜ `funding_round_details_israel.html`
- ⬜ `tech_news_israel.html`
- ⬜ `technical_card_israel.html`
- ⬜ `ai_search_israel.html`
- ⬜ `investment_statistic_israel.html`
- ⬜ `discover_israel.html`
- ⬜ `company_ai_analysis_israel.html`
- ⬜ `report_israel.html`

### 批量添加脚本

在每个页面的 `<head>` 部分添加:

```html
<!-- 认证检查脚本 - 必须在页面加载前执行 -->
<script src="common/js/auth-check.js"></script>
```

## 🔧 自定义配置

### 修改跳转目标

如果需要跳转到不同的登录页面,编辑 `common/js/auth-check.js`:

```javascript
// 修改这一行
window.location.href = '/home_israel.aspx';

// 改为你需要的页面,例如:
window.location.href = '/your-custom-login-page.aspx';
```

### 添加额外的认证检查

如果需要更复杂的认证逻辑,可以在 `isUserAuthenticated()` 函数中添加:

```javascript
function isUserAuthenticated() {
    const apiToken = getCookie('api_token');
    const userId = localStorage.getItem('userId');

    // 添加你的自定义检查
    const customCheck = yourCustomAuthCheck();

    if (apiToken && customCheck) {
        return true;
    }

    return false;
}
```

## 🐛 故障排查

### 问题: 页面无限循环跳转

**原因**: 登录页面 `home_israel.aspx` 本身不应该包含认证检查脚本

**解决**: 确保 `home_israel.aspx` 和其他登录相关页面不引入 `auth-check.js`

### 问题: 已登录用户仍被跳转

**检查项**:
1. Cookie是否正确设置 (检查 `document.cookie`)
2. Cookie的 path 和 domain 是否正确
3. 浏览器控制台是否有JavaScript错误

**调试命令**:
```javascript
console.log('api_token:', document.cookie);
console.log('userId:', localStorage.getItem('userId'));
```

### 问题: 脚本未加载

**检查项**:
1. 文件路径是否正确 (相对于HTML文件位置)
2. 服务器是否正确提供 `.js` 文件
3. 浏览器Network标签检查HTTP状态码

## 🔒 安全注意事项

1. **前端验证不能替代后端验证**: 此脚本仅用于改善用户体验,服务端API仍需验证token
2. **Token应该有过期时间**: 确保 `api_token` cookie 设置了合理的过期时间
3. **HTTPS传输**: 生产环境应使用HTTPS,并设置 `Secure` 和 `HttpOnly` cookie标志

## 📚 相关文件

- `common/js/auth-check.js` - 核心认证检查脚本
- `company_profile_israel.html` - 实现示例
- `test-auth.html` - 测试页面
- `dashboard/dist/js/pages/common.js` - 项目通用JS(包含认证相关工具函数)

## 📞 技术支持

如有问题或建议,请联系开发团队。

---

**创建日期**: 2025-10-16
**版本**: 1.0
**适用范围**: INNONATION AI Web - Israel Market Pages
