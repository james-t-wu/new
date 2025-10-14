# INNONATION AI 新页面开发指南

## 概述

本指南提供精确的开发标准，确保在 `new` 目录下开发的新页面与现有页面保持完全一致的外观和功能。所有页面开发必须遵循**精确复制原则**：基于现有页面创建新页面时，必须保持完全相同的HTML结构、样式和功能，仅将可重用组件替换为公共文件引用。

## 核心原则

### 1. 精确复制原则 (Exact Replication Principle)
- **必须**保持与参考页面完全相同的HTML结构
- **必须**保持完全相同的CSS样式和类名
- **必须**保持完全相同的JavaScript功能和方法
- **仅允许**将可重用组件替换为公共文件引用
- **禁止**重新设计或修改现有UI布局和交互

### 2. 组件提取标准
只有以下组件可以提取到公共文件中：
- 完全独立的UI组件（如全局菜单）
- 纯工具函数（无UI依赖）
- 通用样式变量（不包含特定页面样式）

### 3. 开发流程
1. **分析参考页面**：完全理解目标页面的结构和功能
2. **识别可重用组件**：仅提取完全独立的组件
3. **创建公共文件**：将提取的组件放入 `common/` 目录
4. **精确复制页面**：创建与原页面完全相同的新页面
5. **替换组件引用**：仅将提取的组件替换为公共文件引用

## 目录结构

```
new/
├── common/
│   ├── css/
│   │   ├── variables.css          # CSS变量和设计系统（仅变量定义）
│   │   ├── components.css         # 通用组件样式（仅完全独立的组件）
│   │   └── utilities.css          # 工具类样式（通用工具类）
│   ├── js/
│   │   ├── inno-global-menu.js    # 全局菜单组件（完全独立）
│   │   ├── common-utils.js        # 通用工具函数（无UI依赖）
│   │   └── api-client.js          # API调用封装（纯功能）
│   └── i18n/
│       ├── menu.zh.json           # 菜单中文翻译
│       └── menu.en.json           # 菜单英文翻译
├── [页面文件].html                # 新页面文件
└── DEVELOPMENT_GUIDE.md           # 本开发指南
```

**重要**：`common/` 目录只能存放完全独立的组件，任何与特定页面相关的样式或功能都必须保留在原页面中。

## 设计系统 (Design System)

### 主要颜色变量

```css
:root {
    /* 品牌主色调 */
    --color-brand-blue: #196fa6;
    --color-deep-blue: #104991;
    --color-highlight-blue: #0ea5e9;
    --color-action-blue: #196fa6;
    --color-light-blue: #f4f8fb;

    /* 文字颜色 */
    --text-color: #1e293b;
    --light-text: #64748b;
    --muted-text: #9ca3af;

    /* 背景颜色 */
    --background-light: #f8fbfd;
    --background-white: #ffffff;
    --background-gray: #f9fafb;

    /* 状态颜色 */
    --success-color: #27ae60;
    --warning-color: #f59e0b;
    --error-color: #e74c3c;
    --info-color: #8e44ad;

    /* 阴影效果 */
    --card-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --hover-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

    /* 边框和圆角 */
    --border-color: #e2e8f0;
    --border-radius: 0.5rem;
    --border-radius-lg: 0.75rem;
    --border-radius-xl: 1rem;

    /* 动画过渡 */
    --transition-base: 0.2s ease-in-out;
    --transition-slow: 0.3s ease-in-out;
}
```

### 字体规范

```css
body {
    font-family: 'Roboto', 'Noto Sans SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif;
    color: var(--text-color);
    line-height: 1.6;
}

/* 标题字体 */
h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 1rem;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1.125rem; }
```

## 页面开发标准

### 精确复制开发步骤

**步骤1：分析参考页面**
- 完全读取并理解参考页面的HTML结构
- 识别所有CSS样式和JavaScript功能
- 确定哪些组件是完全可以独立提取的

**步骤2：创建新页面（精确复制）**
- **必须**完全复制参考页面的HTML结构
- **必须**保持所有CSS类名和样式不变
- **必须**保持所有JavaScript功能完整
- **仅允许**在`<head>`中替换公共CSS引用：
  ```html
  <!-- 原页面的内联样式保持不变 -->
  <style>
      /* 保持原页面所有CSS变量和样式 */
  </style>

  <!-- 仅添加公共CSS引用 -->
  <link rel="stylesheet" href="common/css/variables.css">
  <link rel="stylesheet" href="common/css/components.css">
  ```

**步骤3：替换组件引用**
- **仅允许**将完全独立的组件替换为公共文件引用：
  ```html
  <!-- 原页面的内联JavaScript保持不变 -->
  <script>
      // 保持原页面所有JavaScript功能
  </script>

  <!-- 仅添加公共JavaScript引用 -->
  <script src="common/js/common-utils.js"></script>
  <script src="common/js/api-client.js"></script>
  <script src="common/js/inno-global-menu.js"></script>
  ```

### 示例：company_profile_israel.html 开发过程

1. **分析参考页面**：`company_profile_simple-1.html`
2. **提取独立组件**：仅`inno-global-menu`组件完全独立
3. **精确复制**：保持所有HTML结构、CSS样式、JavaScript功能不变
4. **替换引用**：仅将全局菜单组件替换为公共文件引用

### 关键规则

1. **禁止修改现有UI**：任何UI元素的样式、布局、交互都必须保持原样
2. **禁止重新设计**：不能为了"更好看"或"更现代"而修改设计
3. **保持功能完整**：所有原页面功能必须完全保留
4. **组件提取谨慎**：只有完全独立的组件才能提取到公共文件
5. **样式保持原样**：不能合并或重构CSS，必须保持原有结构

## 核心组件规范

### 1. 全局导航菜单 (inno-global-menu)

使用方式：在页面中添加 `<div id="inno-global-menu"></div>` 挂载点，然后引入 `common/js/inno-global-menu.js`。

特性：
- 响应式设计，移动端和桌面端不同交互方式
- 多语言支持
- 子菜单功能
- 折叠/展开状态

### 2. 标准导航栏 (Navbar)

```html
<nav class="navbar">
    <div class="container">
        <a class="navbar-brand" href="#">INNONATION <b>AI</b></a>
        <div class="ms-auto">
            <div class="language-switch" onclick="toggleLanguage()">
                <i class="fas fa-globe"></i>
                <span>中文</span>
            </div>
        </div>
    </div>
</nav>
```

### 3. 卡片组件 (Card)

```html
<div class="inno-card">
    <div class="inno-card-header">
        <h3 class="inno-card-title">卡片标题</h3>
        <div class="inno-card-actions">
            <!-- 操作按钮 -->
        </div>
    </div>
    <div class="inno-card-body">
        <!-- 卡片内容 -->
    </div>
    <div class="inno-card-footer">
        <!-- 卡片底部 -->
    </div>
</div>
```

### 4. 按钮规范

```html
<!-- 主要按钮 -->
<button class="btn btn-primary">主要操作</button>

<!-- 次要按钮 -->
<button class="btn btn-secondary">次要操作</button>

<!-- 成功按钮 -->
<button class="btn btn-success">成功操作</button>

<!-- 危险按钮 -->
<button class="btn btn-danger">危险操作</button>

<!-- 图标按钮 -->
<button class="btn btn-icon">
    <i class="fas fa-search"></i>
</button>
```

## JavaScript 开发规范

### 1. Vue.js 应用结构

```javascript
const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: false,
            error: null,
            data: [],
            // 使用明确的命名
        }
    },

    methods: {
        async fetchData() {
            this.loading = true;
            this.error = null;

            try {
                const response = await ApiClient.get('/api/endpoint');
                this.data = response.data;
            } catch (error) {
                this.error = error.message;
                console.error('API Error:', error);
            } finally {
                this.loading = false;
            }
        },

        // 使用驼峰命名法
        handleUserAction() {
            // 处理用户操作
        }
    },

    computed: {
        // 计算属性
        filteredData() {
            return this.data.filter(item => {
                // 过滤逻辑
            });
        }
    },

    mounted() {
        // 组件挂载后的初始化
        AOS.init();
        this.fetchData();
    }
}).mount('#app');
```

### 2. API 调用规范

使用统一的 API 客户端：

```javascript
class ApiClient {
    static async get(url, params = {}) {
        try {
            const response = await axios.get(url, { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    static async post(url, data = {}) {
        try {
            const response = await axios.post(url, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    static handleError(error) {
        console.error('API Error:', error);
        // 统一错误处理
        if (error.response) {
            // 服务器响应错误
            const message = error.response.data?.message || '服务器错误';
            this.showNotification(message, 'error');
        } else if (error.request) {
            // 网络错误
            this.showNotification('网络连接失败', 'error');
        } else {
            // 其他错误
            this.showNotification('请求失败', 'error');
        }
    }

    static showNotification(message, type = 'info') {
        // 统一通知显示
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}
```

## 样式开发规范

### 1. CSS 类命名规范

使用 BEM (Block Element Modifier) 命名规范：

```css
/* 块 (Block) */
.inno-card { }

/* 元素 (Element) */
.inno-card__header { }
.inno-card__body { }
.inno-card__footer { }

/* 修饰符 (Modifier) */
.inno-card--loading { }
.inno-card--error { }

/* 状态类 */
.is-active { }
.is-loading { }
.is-disabled { }
```

### 2. 响应式设计

```css
/* 移动端优先 */
.component {
    /* 基础样式（移动端） */
}

/* 平板端 */
@media (min-width: 768px) {
    .component {
        /* 平板端调整 */
    }
}

/* 桌面端 */
@media (min-width: 1024px) {
    .component {
        /* 桌面端调整 */
    }
}
```

### 3. 动画效果

```css
.fade-enter-active,
.fade-leave-active {
    transition: opacity var(--transition-base);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 加载动画 */
.loading-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
```

## 国际化 (i18n) 规范

### 1. 翻译文件结构

```json
// common/i18n/menu.zh.json
{
    "aiSearch": "AI 搜索",
    "discover": "发现",
    "deal": "投融资",
    "report": "报告",
    "techNews": "科技新闻",
    "aiTools": "AI 工具",
    "internalUse": "内部使用"
}

// common/i18n/menu.en.json
{
    "aiSearch": "AI Search",
    "discover": "Discover",
    "deal": "Deals",
    "report": "Reports",
    "techNews": "Tech News",
    "aiTools": "AI Tools",
    "internalUse": "Internal Use"
}
```

### 2. 使用方式

```javascript
// 在组件中使用翻译
const i18n = {
    zh: {
        title: "欢迎使用",
        subtitle: "INNONATION AI 平台"
    },
    en: {
        title: "Welcome",
        subtitle: "INNONATION AI Platform"
    }
};

// 获取当前语言
const currentLang = localStorage.getItem('inno_lang') || 'zh';
const t = (key) => i18n[currentLang][key] || key;
```

## 性能优化规范

### 1. 资源加载优化

```html
<!-- 预加载关键资源 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.jsdelivr.net">

<!-- 异步加载非关键脚本 -->
<script async src="non-critical.js"></script>

<!-- 图片懒加载 -->
<img src="placeholder.jpg" data-src="actual-image.jpg" class="lazy-load" alt="描述">
```

### 2. 代码分割

```javascript
// 动态导入大型组件
const loadHeavyComponent = async () => {
    const module = await import('./heavy-component.js');
    return module.default;
};
```

## 测试规范

### 1. 单元测试

```javascript
// 使用 Jest 进行单元测试
describe('ApiClient', () => {
    test('should fetch data successfully', async () => {
        const mockData = { success: true };
        axios.get.mockResolvedValue({ data: mockData });

        const result = await ApiClient.get('/test');
        expect(result).toEqual(mockData);
    });
});
```

### 2. E2E 测试

```javascript
// 使用 Cypress 进行端到端测试
describe('Page Navigation', () => {
    it('should navigate through menu items', () => {
        cy.visit('/page');
        cy.get('[data-testid="menu-toggle"]').click();
        cy.get('[data-testid="ai-search"]').click();
        cy.url().should('include', '/ai_search');
    });
});
```

## 部署和构建

### 1. 文件压缩

- CSS/JS 文件应该进行压缩
- 图片使用适当的格式和压缩比例
- 使用 Gzip 压缩传输

### 2. 版本管理

```html
<!-- 为静态资源添加版本号 -->
<link rel="stylesheet" href="common/css/components.css?v=1.0.0">
<script src="common/js/inno-global-menu.js?v=1.0.0"></script>
```

## 安全规范

### 1. XSS 防护

```javascript
// 使用 Vue 的内置 XSS 防护
<template>
    <!-- 安全：自动转义 -->
    <div>{{ userInput }}</div>

    <!-- 危险：不要使用，除非确保数据安全 -->
    <div v-html="trustedHtml"></div>
</template>
```

### 2. CSRF 防护

```javascript
// 在 API 请求中包含 CSRF token
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
```

## 最佳实践总结

1. **保持一致性**：所有页面应使用相同的设计系统和组件
2. **模块化开发**：将可重用的功能抽取为独立组件
3. **性能优先**：优化加载时间和运行性能
4. **可访问性**：确保页面对所有用户都可访问
5. **测试覆盖**：为关键功能编写测试
6. **文档维护**：及时更新开发文档

## 常见问题解答

### Q: 为什么我开发的页面与原页面不一致？
A: **最常见的原因是违反了精确复制原则**：
- ❌ 修改了HTML结构或CSS类名
- ❌ 重新设计了UI布局或样式
- ❌ 提取了不完全独立的组件
- ❌ 重构了CSS或JavaScript代码

**正确做法**：
- ✅ 完全复制原页面的HTML结构
- ✅ 保持所有CSS样式和类名不变
- ✅ 保持所有JavaScript功能完整
- ✅ 仅替换完全独立的组件引用

### Q: 如何判断一个组件是否可以提取到公共文件？
A: 只有满足以下所有条件的组件才能提取：
- ✅ 完全独立，不依赖特定页面样式
- ✅ 不包含页面特定的业务逻辑
- ✅ 在多个页面中重复使用
- ✅ 提取后不影响原页面功能

### Q: 如果公共组件样式与页面冲突怎么办？
A: **不要修改公共组件样式**，正确的做法是：
1. 在页面内部保留原有样式
2. 使用更具体的选择器覆盖冲突
3. 或者不要提取该组件到公共文件

### Q: 如何添加新的菜单项？
A: 在 `common/i18n/menu.*.json` 文件中添加翻译，然后在 `inno-global-menu.js` 中添加相应的菜单项。

### Q: 如何处理 API 错误？
A: 使用统一的 `ApiClient` 类进行 API 调用，它包含了标准的错误处理逻辑。

## 开发检查清单

在完成页面开发后，请确认以下各项：

### 页面一致性检查
- [ ] 页面外观与参考页面完全一致
- [ ] 所有交互功能正常工作
- [ ] 响应式布局与原页面相同
- [ ] 动画效果保持原样

### 组件引用检查
- [ ] 只引用了完全独立的公共组件
- [ ] 没有修改原有HTML结构和CSS类名
- [ ] 所有页面特定功能都保留在页面内
- [ ] 公共组件没有破坏原页面功能

### 代码质量检查
- [ ] 没有冗余或重复的代码
- [ ] 所有功能都经过测试
- [ ] 错误处理机制完整
- [ ] 代码结构清晰可维护

## 通用组件库 (Common Components Library)

### 1. 全局导航菜单组件 (inno-global-menu)

**组件文件**: `common/js/inno-global-menu.js`

**使用方式**:
```html
<!-- 在页面中添加挂载点 -->
<div id="inno-global-menu"></div>

<!-- 在页面底部引入组件脚本 -->
<script src="common/js/inno-global-menu.js"></script>
```

**特性**:
- ✅ 自动初始化，无需手动调用
- ✅ 响应式设计，支持移动端和桌面端
- ✅ 多语言支持 (中文/英文)
- ✅ 子菜单展开/折叠功能
- ✅ 悬停和点击交互模式
- ✅ 当前页面高亮显示

**依赖文件**:
- `common/i18n/menu.zh.json` - 中文翻译
- `common/i18n/menu.en.json` - 英文翻译

### 2. 标准导航栏 (Standard Navbar)

**HTML 结构**:
```html
<nav class="navbar navbar-expand-lg fixed-top">
    <div class="container">
        <a class="navbar-brand" href="#">
            INNONATION <b>AI</b>
        </a>
        <div class="ms-auto d-flex align-items-center gap-3">
            <div class="language-switch" @click="toggleLang">
                <i class="fa-solid fa-globe"></i>
                <span id="lang-text">{{ currentLang === 'zh' ? '中文' : 'EN' }}</span>
            </div>
        </div>
    </div>
</nav>
```

**CSS 样式**:
```css
.navbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(25, 111, 166, 0.1);
    padding: 1rem 0;
    margin-bottom: 2rem;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: 700;
    color: #196fa6 !important;
    text-decoration: none;
}
```

### 3. 语言切换组件 (Language Switch)

**HTML 结构**:
```html
<div class="language-switch" @click="toggleLang">
    <i class="fa-solid fa-globe"></i>
    <span id="lang-text">{{ currentLang === 'zh' ? '中文' : 'EN' }}</span>
</div>
```

**功能特性**:
- ✅ 中英文切换
- ✅ 本地存储记忆用户选择
- ✅ 自动更新界面文本
- ✅ 统一的交互样式

### 4. 搜索组件 (Search Component)

**HTML 结构**:
```html
<div class="custom-search">
    <div class="search-wrapper">
        <input
            type="text"
            class="form-control search_tech"
            v-model="searchTerm"
            @keyup.enter="searchTechTerm"
            :placeholder="currentLang === 'zh' ? '搜索关键词...' : 'Search keywords...'"
        >
        <span class="search-icon" @click="searchTechTerm">
            <i class="fa fa-send-o"></i>
        </span>
    </div>
</div>
```

**CSS 样式**:
```css
.search-wrapper {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
}

.search_tech {
    width: 100%;
    padding: 12px 50px 12px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 50px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
}

.search-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: #196fa6;
    color: white;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
```

### 5. 功能按钮网格 (Feature Button Grid)

**HTML 结构**:
```html
<div class="feature-buttons">
    <button class="feature-btn" @click="action1">
        <i class="fas fa-icon1"></i>
        {{ currentLang === 'zh' ? '按钮1' : 'Button 1' }}
    </button>
    <button class="feature-btn" @click="action2">
        <i class="fas fa-icon2"></i>
        {{ currentLang === 'zh' ? '按钮2' : 'Button 2' }}
    </button>
    <button class="feature-btn" @click="action3">
        <i class="fas fa-icon3"></i>
        {{ currentLang === 'zh' ? '按钮3' : 'Button 3' }}
    </button>
    <button class="feature-btn" @click="action4">
        <i class="fas fa-icon4"></i>
        {{ currentLang === 'zh' ? '按钮4' : 'Button 4' }}
    </button>
</div>
```

**CSS 样式**:
```css
.feature-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.feature-btn {
    background: linear-gradient(135deg, #196fa6 0%, #104991 100%);
    color: white;
    border: none;
    padding: 15px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.feature-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(25, 111, 166, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .feature-buttons {
        grid-template-columns: 1fr;
    }
}
```

### 6. AI 机器人展示区 (AI Robot Section)

**HTML 结构**:
```html
<div class="robot-section">
    <img src="https://innonation.oss-cn-beijing.aliyuncs.com/ai-robot.png" alt="AI Robot" class="robot-image">
    <h4>{{ currentLang === 'zh' ? 'AI 智能助手' : 'AI Assistant' }}</h4>
    <p>{{ currentLang === 'zh' ? '描述文本' : 'Description text' }}</p>
</div>
```

**CSS 样式**:
```css
.robot-section {
    text-align: center;
    margin-bottom: 30px;
}

.robot-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 15px;
    box-shadow: 0 4px 15px rgba(25, 111, 166, 0.2);
}
```

## 页面结构模板 (Page Structure Template)

### 基础页面结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>页面标题 - Innonation AI</title>

    <!-- 通用 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">

    <!-- 页面特定 CSS -->
    <link href="common/css/[page-specific].css" rel="stylesheet">

    <!-- 自定义样式 -->
    <style>
        /* 全局样式 */
        body {
            font-family: 'Roboto', 'Noto Sans SC', 'Source Han Sans SC', 'Microsoft YaHei', sans-serif;
            color: #333;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            line-height: 1.6;
            overflow-x: hidden;
            margin: 0;
            padding: 0;
            min-height: 100vh;
        }

        /* 页面特定样式 */
        /* ... */
    </style>
</head>
<body>
    <!-- 全局菜单挂载点 -->
    <div id="inno-global-menu"></div>

    <!-- 标准导航栏 -->
    <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container">
            <a class="navbar-brand" href="#">
                INNONATION <b>AI</b>
            </a>
            <div class="ms-auto d-flex align-items-center gap-3">
                <div class="language-switch" @click="toggleLang">
                    <i class="fa-solid fa-globe"></i>
                    <span id="lang-text">{{ currentLang === 'zh' ? '中文' : 'EN' }}</span>
                </div>
            </div>
        </div>
    </nav>

    <!-- Vue 应用挂载点 -->
    <div id="app" v-cloak>
        <!-- 页面内容 -->
        <div class="main-content">
            <!-- 页面特定内容 -->
        </div>
    </div>

    <!-- 通用 JavaScript -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

    <!-- 全局菜单组件 -->
    <script src="common/js/inno-global-menu.js"></script>

    <!-- Vue 应用逻辑 -->
    <script>
        const { createApp } = Vue;

        createApp({
            data() {
                return {
                    currentLang: 'zh',
                    // 页面特定数据
                }
            },

            methods: {
                toggleLang() {
                    this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
                    localStorage.setItem('inno_lang', this.currentLang);
                    document.getElementById('lang-text').textContent = this.currentLang === 'zh' ? '中文' : 'EN';
                },

                // 页面特定方法
            }
        }).mount('#app');
    </script>
</body>
</html>
```

## 组件使用注意事项

### 1. 全局菜单组件
- **必须**: 在每个页面中包含 `<div id="inno-global-menu"></div>`
- **必须**: 在页面底部引用 `common/js/inno-global-menu.js`
- **禁止**: 在页面中实现自定义菜单逻辑
- **注意**: 组件会自动初始化，无需手动调用

### 2. 样式统一性
- **必须**: 使用设计系统中定义的颜色变量
- **必须**: 保持导航栏样式的一致性
- **禁止**: 修改通用组件的核心样式
- **建议**: 页面特定样式应添加在 `<style>` 标签中

### 3. 响应式设计
- **必须**: 所有组件必须支持移动端适配
- **必须**: 使用 Bootstrap 的响应式类
- **建议**: 测试在不同屏幕尺寸下的显示效果

### 4. 国际化支持
- **必须**: 所有用户界面文本支持中英文切换
- **必须**: 使用 `currentLang` 变量控制语言显示
- **建议**: 将文本内容集中在 Vue 数据中管理

### 5. 性能优化
- **必须**: 按需加载第三方库
- **建议**: 使用 CDN 加速资源加载
- **注意**: 避免重复引用相同的资源文件

---

**重要提醒**：如果发现新页面与原页面有任何差异，请立即检查是否违反了精确复制原则。差异通常是由于过度设计或组件提取不当造成的。

*此文档将随着项目发展持续更新，请定期查看最新版本。*