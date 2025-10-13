# 2025-07-new.html 新设计页面说明

## 概述

`2025-07-new.html` 是基于 INNONATION 设计系统规则重新设计的页面，完全遵循我们建立的设计系统规范。

## 主要改进

### 1. 设计系统集成
- ✅ 使用 `../../docs/css-variables.css` 中的设计系统变量
- ✅ 遵循统一的颜色、字体、间距规范
- ✅ 使用标准化的组件样式

### 2. 样式文件更新
- **原始文件**: `../css/report-new.css`
- **新文件**: `../css/report-new-design-system.css`
- **设计系统**: `../../docs/css-variables.css`

### 3. 设计系统特性

#### 颜色系统
- **主色调**: 使用 `var(--color-brand-blue)` (#128bed)
- **功能色**: 使用 `var(--color-action-blue)` (#009dff)
- **文本色**: 使用 `var(--color-text-primary)` (#333333)
- **背景色**: 使用 `var(--color-bg-page)` (#edf1f5)

#### 字体系统
- **主字体**: `var(--font-family-primary)` (Roboto-Book)
- **标题字体**: `var(--font-family-bold)` (Roboto-Bold)
- **字体大小**: 使用预定义的尺寸变量 (xs, sm, base, md, lg, xl, 2xl, 3xl)

#### 间距系统
- **统一间距**: 使用 `var(--spacing-xs)`, `var(--spacing-sm)`, `var(--spacing-md)`, `var(--spacing-lg)`, `var(--spacing-xl)`
- **响应式**: 在不同断点下自动调整间距

#### 组件规范
- **卡片**: 使用 `.card` 类和标准阴影
- **按钮**: 使用 `.btn` 类和预定义样式
- **表格**: 使用标准化的表格样式
- **导航**: 遵循设计系统的导航规范

### 4. 响应式设计
- **移动端优先**: 767px 断点优化
- **平板端**: 1024px 断点适配
- **桌面端**: 1200px+ 断点增强

### 5. 工具类使用
- **文本样式**: `.text-primary`, `.text-secondary`, `.text-muted`
- **字体大小**: `.text-xs`, `.text-sm`, `.text-base`, `.text-md`, `.text-lg`, `.text-xl`, `.text-2xl`, `.text-3xl`
- **字体权重**: `.font-light`, `.font-normal`, `.font-medium`, `.font-semibold`, `.font-bold`
- **间距控制**: `.mb-sm`, `.mb-md`, `.mb-lg`, `.mb-xl`, `.mt-sm`, `.mt-md`, `.mt-lg`
- **背景和边框**: `.bg-white`, `.bg-light`, `.rounded-lg`, `.rounded-md`

## 文件结构

```
report/
├── new/
│   ├── 2025-07.html          # 原始页面
│   ├── 2025-07-new.html      # 新设计页面
│   └── README-new-design.md   # 本说明文件
├── css/
│   ├── report-new.css                    # 原始样式
│   └── report-new-design-system.css      # 新设计系统样式
└── docs/
    ├── css-variables.css                 # 设计系统变量
    ├── design-system-rules.md            # 完整设计系统规范
    ├── cursor-style-rules.md             # 快速参考指南
    └── README.md                         # 设计系统使用说明
```

## 使用方法

### 1. 查看新页面
直接在浏览器中打开 `2025-07-new.html` 查看新设计效果。

### 2. 对比原始页面
同时打开 `2025-07.html` 和 `2025-07-new.html` 进行对比。

### 3. 应用设计系统
在其他页面中引入 `../../docs/css-variables.css` 和 `../css/report-new-design-system.css`。

## 主要变化对比

| 方面 | 原始页面 | 新设计页面 |
|------|----------|------------|
| 样式文件 | `report-new.css` | `report-new-design-system.css` |
| 设计系统 | 无 | 完整集成 |
| 颜色管理 | 硬编码 | CSS变量系统 |
| 字体规范 | 混合使用 | 统一规范 |
| 间距系统 | 不一致 | 标准化 |
| 组件样式 | 自定义 | 设计系统规范 |
| 响应式 | 基础支持 | 完整支持 |
| 维护性 | 中等 | 高 |

## 技术特点

### 1. CSS变量系统
```css
/* 使用设计系统变量 */
.report-header h1 {
    color: var(--color-dark-text);
    font-size: var(--font-size-3xl);
    font-family: var(--font-family-bold);
}
```

### 2. 工具类系统
```html
<!-- 使用预定义的工具类 -->
<div class="text-primary text-xl font-bold mb-lg">
    标题内容
</div>
```

### 3. 响应式设计
```css
@media (max-width: 767px) {
    .page-container {
        padding: 5rem 1rem 3rem;
    }
}
```

### 4. 组件标准化
```css
.report-card {
    background: var(--color-bg-white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    transition: var(--transition-normal);
}
```

## 优势

1. **一致性**: 与整个网站设计保持一致
2. **可维护性**: 使用变量系统，易于修改和维护
3. **可扩展性**: 基于设计系统，便于添加新功能
4. **响应式**: 完整的移动端和桌面端支持
5. **性能**: 优化的CSS结构和选择器
6. **可访问性**: 遵循无障碍设计原则

## 注意事项

1. **依赖关系**: 新页面依赖 `../../docs/css-variables.css`
2. **浏览器支持**: 需要支持CSS变量的现代浏览器
3. **文件路径**: 确保CSS文件路径正确
4. **兼容性**: 与原始页面保持功能完全一致

## 下一步

1. **测试**: 在不同设备和浏览器上测试新页面
2. **反馈**: 收集用户对新设计的反馈
3. **迭代**: 根据反馈优化设计
4. **推广**: 将设计系统应用到其他页面

---

**创建时间**: 2024年  
**设计系统版本**: v1.0  
**维护者**: 前端开发团队 