/**
 * INNONATION AI - 全局菜单组件
 * 基于原始company_profile_simple-1.html中的菜单系统重构
 *
 * 功能特性：
 * - 响应式设计（移动端和桌面端不同交互方式）
 * - 多语言支持
 * - 子菜单功能
 * - 折叠/展开状态
 * - 自动初始化和事件绑定
 *
 * 使用方法：
 * 1. 在HTML中添加挂载点: <div id="inno-global-menu"></div>
 * 2. 引入此脚本文件
 * 3. 组件会自动初始化并渲染
 */

(function() {
    'use strict';

    // ===== 配置常量 =====
    const CONTAINER_SELECTOR = '#inno-global-menu';
    	let lang = (localStorage.getItem('inno_lang') || 'zh').toLowerCase();
	if (lang === 'zh') lang = 'zh';
	const DEFAULT_LANG = lang;

    // 动态计算i18n路径 - 根据当前页面位置自动调整
    function getI18nBasePath() {
        const currentPath = window.location.pathname;

        // 找到 'new' 在路径中的位置
        const pathParts = currentPath.split('/').filter(part => part); // 移除空字符串
        const newIndex = pathParts.indexOf('new');

        if (newIndex === -1) {
            // 如果路径中没有 'new'，使用默认相对路径
            return 'common/i18n/menu.';
        }

        // 计算从当前HTML文件到 /new/ 目录的层级数
        // pathParts.length - 1 是因为最后一个是文件名
        // newIndex + 1 是 /new/ 目录的下一层
        const depth = pathParts.length - 1 - (newIndex + 1);

        if (depth === 0) {
            // 文件直接在 /new/ 目录下 (如 /new/index.html)
            return 'common/i18n/menu.';
        } else {
            // 文件在 /new/ 的子目录中
            const prefix = '../'.repeat(depth);
            return `${prefix}common/i18n/menu.`;
        }
    }

    const I18N_BASE_PATH = getI18nBasePath();

    // 调试信息 - 生产环境可以注释掉
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('[InnoGlobalMenu] Current path:', window.location.pathname);
        console.log('[InnoGlobalMenu] Calculated i18n base path:', I18N_BASE_PATH);
    }

    // ===== 全局状态 =====
    let state = {
        lang: DEFAULT_LANG,
        t: (key) => key, // 默认翻译函数
        translations: {},
        isInitialized: false
    };

    // ===== 工具函数 =====
    function html(strings, ...values) {
        return strings.reduce((prev, curr, i) => prev + curr + (values[i] ?? ''), '');
    }

    function isMobileDevice() {
        return window.innerWidth <= 768 || ('ontouchstart' in window);
    }

    function logError(message, error) {
        console.error(`[InnoGlobalMenu] ${message}`, error);
    }

    function logInfo(message) {
        console.log(`[InnoGlobalMenu] ${message}`);
    }

    // ===== 国际化处理 =====
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`${I18N_BASE_PATH}${lang}.json`, {
                cache: 'no-cache',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            state.translations = await response.json();
            state.t = (key) => state.translations[key] || key;

            logInfo(`Translations loaded for language: ${lang}`);
            return true;
        } catch (error) {
            logError(`Failed to load translations for ${lang}`, error);
            // 使用默认翻译
            state.translations = getDefaultTranslations();
            state.t = (key) => state.translations[key] || key;
            return false;
        }
    }

    function getDefaultTranslations() {
        return {
            aiSearch: '智能查询',
            discover: '查询',
            discover_company: '查询公司',
            discover_deal: '查询投资收购',
            deal: '投资事件',
            patent: '技术专利',
            report: '商业报告',
            techNewsIsrael: '科技新闻 - 以色列',
            techNewsChina: '科技新闻 - 中国',
            annualInvestMap: '年度投资图谱',
            aiTools: 'AI 小工具',
            techExplainer: '科技小百科',
            companyAnalyze: '公司简介生成器',
            translateTool: '翻译工具',
            omgene: 'OMGENE',
            geneticAI: '基因AI',
            geneticAINews: '基因AI新闻',
            internalUse: '内部使用',
            analysisSummary: '分析汇总',
            generateReport: '生成报告',
            newsAnalysis: '新闻分析'
        };
    }

    // ===== 菜单HTML模板 =====
    function getMenuTemplate() {
        const t = state.t;
        return html`
            <i class="fas fa-bars modern-menu-toggle" data-role="toggle" title="打开菜单"></i>
            <div class="modern-menu-modal" data-role="modal">
                <div class="modern-menu-content" data-role="content">
                    <div class="modern-menu-header">
                        <div class="modern-menu-logo">
                            <span class="menu-logo-text">INNONATION <b>AI</b></span>
                        </div>
                        <div class="menu-controls">
                            <button class="modern-menu-collapse" data-role="collapse" title="折叠菜单">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                        </div>
                    </div>
                    <nav class="modern-menu-nav">
                        <ul class="modern-menu-list">
                            <!-- 主要功能菜单 -->
                            <li class="modern-menu-item ai-search">
                                <a href="/new/ai_search_israel.html" class="modern-menu-link">
                                    <i class="fas fa-robot"></i>
                                    <span>${t('aiSearch')}</span>
                                </a>
                            </li>
                            <li class="modern-menu-item discover-company">
                                <a href="/new/discover_israel.html" class="modern-menu-link">
                                    <i class="fas fa-magnifying-glass"></i>
                                    <span>${t('discover_company')}</span>
                                </a>
                            </li>
                            <li class="modern-menu-item deal">
                                <a href="/new/deal_israel.html" class="modern-menu-link">
                                    <i class="fas fa-building"></i>
                                    <span>${t('deal')}</span>
                                </a>
                            </li>
                            <li class="modern-menu-item report">
                                <a href="/new/report_israel.html" class="modern-menu-link">
                                    <i class="fas fa-file-lines"></i>
                                    <span>${t('report')}</span>
                                </a>
                            </li>

                            <!-- 新闻菜单 -->
                            <li class="modern-menu-item tech-news">
                                <a href="/new/tech_news_israel.html" class="modern-menu-link">
                                    <i class="fas fa-newspaper"></i>
                                    <span>${t('techNewsIsrael')}</span>
                                </a>
                            </li>
                            <li class="modern-menu-item tech-news-china">
                                <a href="/new/daily_news_israel.html" class="modern-menu-link">
                                    <i class="fas fa-layer-group"></i>
                                    <span>${t('techNewsChina')}</span>
                                </a>
                            </li>

                            <!-- 投资地图 -->
                            <li class="modern-menu-item invest-map">
                                <a href="/new/investment_statistic_israel.html" class="modern-menu-link">
                                    <i class="fas fa-cube"></i>
                                    <span>${t('annualInvestMap')}</span>
                                </a>
                            </li>

                            <li class="modern-menu-item tech-explainer">
                                <a href="/new/technical_card_israel.html" class="modern-menu-link">
                                    <i class="fas fa-lightbulb"></i>
                                    <span>${t('techExplainer')}</span>
                                </a>
                            </li>
                            <li class="modern-menu-item company-ai-analysis">
                                <a href="/new/company_ai_analysis_israel.html" class="modern-menu-link">
                                    <i class="fa fa-codepen"></i>
                                    <span>${t('companyAnalyze')}</span>
                                </a>
                            </li>

                        </ul>
                    </nav>
                </div>
            </div>
        `;
    }

    // ===== 菜单样式 =====
    function injectStyles() {
        if (document.getElementById('inno-global-menu-styles')) {
            return; // 样式已经注入
        }

        const styles = `
            <style id="inno-global-menu-styles">
                /* 全局菜单样式 */
                .modern-menu-toggle {
                    position: fixed;
                    top: 1rem;
                    left: 1rem;
                    z-index: 1001;
                    font-size: 1.5rem;
                    color: var(--color-brand-blue, #196fa6);
                    cursor: pointer;
                    background: var(--background-white, #ffffff);
                    border: 2px solid var(--color-brand-blue, #196fa6);
                    border-radius: var(--border-radius, 0.5rem);
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all var(--transition-base, 0.2s ease-in-out);
                    box-shadow: var(--shadow-base, 0 4px 6px -1px rgb(0 0 0 / 0.1));
                }

                .modern-menu-toggle:hover {
                    background: var(--color-brand-blue, #196fa6);
                    color: var(--text-white, #ffffff);
                    transform: scale(1.05);
                }

                .modern-menu-modal {
                    position: fixed;
                    top: 0;
                    left: -320px;
                    width: 320px;
                    height: 100vh;
                    background: var(--background-white, #ffffff);
                    box-shadow: var(--shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.1));
                    z-index: 1000;
                    transition: left var(--transition-slow, 0.3s ease-in-out);
                    overflow-y: auto;
                    border-right: 1px solid var(--border-color, #e2e8f0);
                }

                .modern-menu-modal.active {
                    left: 0;
                }

                .modern-menu-content {
                    padding: 0;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    transition: all var(--transition-base, 0.2s ease-in-out);
                }

                .modern-menu-content.collapsed {
                    width: 80px;
                }

                .modern-menu-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.5rem 1rem;
                    border-bottom: 1px solid var(--border-color, #e2e8f0);
                    background: var(--gradient-primary, linear-gradient(135deg, #196fa6, #104991));
                    color: var(--text-white, #ffffff);
                }

                .modern-menu-logo {
                    display: flex;
                    align-items: center;
                }

                .menu-logo-text {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--text-white, #ffffff);
                }

                .menu-logo-text b {
                    color: var(--color-highlight-blue, #0ea5e9);
                    text-shadow: 0 0 3px rgba(14, 165, 233, 0.3);
                }

                .menu-controls {
                    display: flex;
                    gap: 0.5rem;
                }

                .modern-menu-collapse {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: var(--text-white, #ffffff);
                    padding: 0.5rem;
                    border-radius: var(--border-radius, 0.5rem);
                    cursor: pointer;
                    transition: all var(--transition-base, 0.2s ease-in-out);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                }

                .modern-menu-collapse:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .modern-menu-nav {
                    flex: 1;
                    padding: 1rem 0;
                }

                .modern-menu-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .modern-menu-item {
                    margin: 0;
                    position: relative;
                }

                .modern-menu-link {
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    color: var(--text-color, #1e293b);
                    text-decoration: none;
                    transition: all var(--transition-base, 0.2s ease-in-out);
                    border-left: 3px solid transparent;
                    position: relative;
                }

                .modern-menu-link:hover {
                    background: var(--color-light-blue, #f4f8fb);
                    border-left-color: var(--color-brand-blue, #196fa6);
                    color: var(--color-brand-blue, #196fa6);
                }

                .modern-menu-link i {
                    width: 20px;
                    margin-right: 1rem;
                    text-align: center;
                    font-size: 1rem;
                }

                .modern-menu-link span {
                    flex: 1;
                    font-weight: 500;
                }

                .modern-menu-arrow {
                    margin-left: auto;
                    transition: transform var(--transition-base, 0.2s ease-in-out);
                }

                .modern-menu-item.active > .modern-menu-link .modern-menu-arrow {
                    transform: rotate(90deg);
                }

                .modern-submenu {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    background: var(--background-gray, #f9fafb);
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height var(--transition-base, 0.2s ease-in-out);
                }

                .modern-menu-item.active .modern-submenu {
                    max-height: 300px;
                }

                .modern-submenu-link {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 3rem;
                    color: var(--text-light, #64748b);
                    text-decoration: none;
                    transition: all var(--transition-base, 0.2s ease-in-out);
                    font-size: 0.9rem;
                }

                .modern-submenu-link:hover {
                    background: var(--background-white, #ffffff);
                    color: var(--color-brand-blue, #196fa6);
                    padding-left: 3.25rem;
                }

                .modern-submenu-link i {
                    width: 16px;
                    margin-right: 0.75rem;
                    text-align: center;
                    font-size: 0.9rem;
                }

                /* 选中状态样式 */
                .modern-menu-link.active {
                    background: var(--color-light-blue, #f4f8fb);
                    border-left-color: var(--color-brand-blue, #196fa6);
                    color: var(--color-brand-blue, #196fa6);
                    font-weight: 600;
                }

                .modern-submenu-link.active {
                    background: var(--background-white, #ffffff);
                    color: var(--color-brand-blue, #196fa6);
                    font-weight: 600;
                }

                /* 折叠状态样式 */
                .modern-menu-content.collapsed .menu-logo-text,
                .modern-menu-content.collapsed .modern-menu-link span {
                    opacity: 0;
                    visibility: hidden;
                }

                .modern-menu-content.collapsed .modern-menu-link {
                    justify-content: center;
                    padding: 1rem;
                }

                .modern-menu-content.collapsed .modern-menu-link i {
                    margin: 0;
                }

                .modern-menu-content.collapsed .modern-menu-arrow,
                .modern-menu-content.collapsed .modern-submenu {
                    display: none;
                }

                /* 移动端适配 */
                @media (max-width: 768px) {
                    .modern-menu-toggle {
                        top: 0.75rem;
                        left: 12px;
                        width: 40px;
                        height: 40px;
                        font-size: 1.25rem;
                    }

                    .modern-menu-modal {
                        width: 280px;
                        left: -280px;
                    }

                    .modern-menu-collapse {
                        display: none;
                    }

                    .menu-logo-text {
                        font-size: 1.1rem;
                    }

                    .modern-menu-link {
                        padding: 0.875rem 1.25rem;
                    }

                    .modern-submenu-link {
                        padding: 0.625rem 2.5rem;
                    }
                }

                /* 页面内容推移效果（仅桌面端） */
                @media (min-width: 769px) {
                    body.menu-active {
                        margin-left: 320px;
                        transition: margin-left var(--transition-slow, 0.3s ease-in-out);
                    }

                    body.menu-collapsed {
                        margin-left: 80px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // ===== 高亮当前页面菜单项 =====
    function highlightCurrentPage(container) {
        try {
            // 获取当前页面路径
            const currentPath = window.location.pathname;
            const currentSearch = window.location.search;
            const currentUrl = currentPath + currentSearch;

            // 规范化路径函数
            const normalizePath = (path) => {
                if (!path) return '';
                // 移除开头的斜杠并转为小写
                return path.replace(/^\/+/, '').toLowerCase();
            };

            const normalizedCurrentPath = normalizePath(currentPath);
            const normalizedCurrentUrl = normalizePath(currentUrl);

            // 获取所有菜单链接及其匹配得分
            const menuLinks = container.querySelectorAll('.modern-menu-link, .modern-submenu-link');
            const matches = [];

            menuLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (!href || href === '#') return;

                const normalizedHref = normalizePath(href);
                if (!normalizedHref) return;

                let matchScore = 0;
                let isMatch = false;

                // 1. 优先级最高: 完全匹配 (路径 + 查询参数)
                if (normalizedCurrentUrl === normalizedHref) {
                    matchScore = 1000;
                    isMatch = true;
                }
                // 2. 次优先级: 路径完全匹配 + 查询参数包含
                else if (normalizedCurrentUrl.startsWith(normalizedHref) && normalizedHref.includes('?')) {
                    matchScore = 900;
                    isMatch = true;
                }
                // 3. 第三优先级: 仅路径完全匹配 (当前页面无参数,菜单项也无参数)
                else if (normalizedCurrentPath === normalizedHref && !normalizedHref.includes('?') && !currentSearch) {
                    matchScore = 800;
                    isMatch = true;
                }
                // 4. 最低优先级: 路径包含匹配 (仅当菜单项无参数时)
                else if (!normalizedHref.includes('?') && normalizedCurrentPath.includes(normalizedHref)) {
                    matchScore = normalizedHref.length; // 越长的匹配越精确
                    isMatch = true;
                }

                if (isMatch) {
                    matches.push({ link, href, score: matchScore });
                }
            });

            // 如果有多个匹配,选择得分最高的
            if (matches.length > 0) {
                // 按得分降序排序
                matches.sort((a, b) => b.score - a.score);

                // 只高亮得分最高的那个
                const bestMatch = matches[0];
                bestMatch.link.classList.add('active');

                // 如果是子菜单项，展开父菜单
                if (bestMatch.link.classList.contains('modern-submenu-link')) {
                    const parentMenuItem = bestMatch.link.closest('.modern-menu-item');
                    if (parentMenuItem) {
                        parentMenuItem.classList.add('active');
                    }
                }

                logInfo(`Menu item highlighted: ${bestMatch.href} (score: ${bestMatch.score})`);
            } else {
                logInfo('No matching menu item found for current page');
            }
        } catch (error) {
            logError('Failed to highlight current page', error);
        }
    }

    // ===== 事件绑定 =====
    function bindEvents(container) {
        const toggleBtn = container.querySelector('[data-role="toggle"]');
        const modal = container.querySelector('[data-role="modal"]');
        const collapseBtn = container.querySelector('[data-role="collapse"]');
        const content = container.querySelector('[data-role="content"]');

        if (!toggleBtn || !modal || !content) {
            logError('Required menu elements not found');
            return;
        }

        // 打开和关闭菜单的函数
        const openMenu = () => {
            modal.classList.add('active');
            toggleBtn.style.display = 'none';
            if (!isMobileDevice()) {
                document.body.classList.add('menu-active');
            }
        };

        const closeMenu = () => {
            modal.classList.remove('active');
            toggleBtn.style.display = '';
            content.classList.remove('collapsed');
            document.body.classList.remove('menu-active', 'menu-collapsed');
        };

        // 折叠功能
        const toggleCollapse = () => {
            const isCollapsed = content.classList.toggle('collapsed');
            const collapseIcon = collapseBtn.querySelector('i');

            if (isCollapsed) {
                collapseIcon.className = 'fas fa-chevron-right';
                collapseBtn.title = '展开菜单';
                document.body.classList.add('menu-collapsed');
            } else {
                collapseIcon.className = 'fas fa-chevron-left';
                collapseBtn.title = '折叠菜单';
                document.body.classList.remove('menu-collapsed');
            }
        };

        // 检测设备类型并绑定相应的事件
        if (isMobileDevice()) {
            // 移动端：点击打开，点击外部关闭
            toggleBtn.addEventListener('click', openMenu);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeMenu();
            });

            // 隐藏折叠按钮
            if (collapseBtn) collapseBtn.style.display = 'none';
        } else {
            // 桌面端：悬停打开，也可以点击打开
            toggleBtn.addEventListener('mouseenter', openMenu);
            toggleBtn.addEventListener('click', openMenu);

            // 折叠功能
            if (collapseBtn) {
                collapseBtn.addEventListener('click', toggleCollapse);
            }

            // 鼠标离开延迟关闭
            let closeTimer;
            const delayClose = () => {
                closeTimer = setTimeout(() => {
                    if (!content.classList.contains('collapsed')) {
                        closeMenu();
                    }
                }, 300);
            };

            const cancelClose = () => {
                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }
            };

            modal.addEventListener('mouseleave', delayClose);
            modal.addEventListener('mouseenter', cancelClose);
        }

        // 子菜单切换
        const submenuToggles = container.querySelectorAll('[data-role="submenu-toggle"]');
        submenuToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const menuItem = toggle.closest('.modern-menu-item');
                const isActive = menuItem.classList.contains('active');

                // 关闭所有子菜单
                container.querySelectorAll('.modern-menu-item.active').forEach(item => {
                    item.classList.remove('active');
                });

                // 切换当前子菜单
                if (!isActive) {
                    menuItem.classList.add('active');
                }
            });
        });

        // 键盘导航支持
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });

        // 窗口大小变化时重新绑定事件
        window.addEventListener('resize', () => {
            // 防抖
            clearTimeout(window.menuResizeTimer);
            window.menuResizeTimer = setTimeout(() => {
                if (isMobileDevice() && document.body.classList.contains('menu-active')) {
                    document.body.classList.remove('menu-active', 'menu-collapsed');
                }
            }, 250);
        });
    }

    // ===== 主渲染函数 =====
    async function render(container) {
        try {
            // 注入样式
            injectStyles();

            // 加载翻译
            await loadTranslations(state.lang);

            // 渲染菜单
            container.innerHTML = getMenuTemplate();

            // 绑定事件
            bindEvents(container);

            // 高亮当前页面菜单项
            highlightCurrentPage(container);

            logInfo('Menu rendered successfully');
            return true;
        } catch (error) {
            logError('Failed to render menu', error);
            return false;
        }
    }

    // ===== 公共API =====
    const InnoGlobalMenu = {
        // 初始化菜单
        async init(selector = CONTAINER_SELECTOR) {
            if (state.isInitialized) {
                logInfo('Menu already initialized');
                return true;
            }

            const container = document.querySelector(selector);
            if (!container) {
                logError(`Container not found: ${selector}`);
                return false;
            }

            const success = await render(container);
            if (success) {
                state.isInitialized = true;
                logInfo('Menu initialized successfully');
            }
            return success;
        },

        // 切换语言
        async switchLanguage(lang) {
            if (lang === state.lang) return true;

            state.lang = lang;
            localStorage.setItem('inno_lang', lang);

            const container = document.querySelector(CONTAINER_SELECTOR);
            if (container) {
                return await render(container);
            }
            return false;
        },

        // 获取当前语言
        getCurrentLanguage() {
            return state.lang;
        },

        // 重新渲染菜单
        async refresh() {
            const container = document.querySelector(CONTAINER_SELECTOR);
            if (container) {
                return await render(container);
            }
            return false;
        },

        // 销毁菜单
        destroy() {
            const container = document.querySelector(CONTAINER_SELECTOR);
            if (container) {
                container.innerHTML = '';
            }

            // 移除样式
            const styles = document.getElementById('inno-global-menu-styles');
            if (styles) {
                styles.remove();
            }

            // 重置状态
            state.isInitialized = false;
            document.body.classList.remove('menu-active', 'menu-collapsed');

            logInfo('Menu destroyed');
        }
    };

    // ===== 语言切换事件监听 =====
    function setupLanguageListener() {
        // 监听全局语言切换事件
        window.addEventListener('inno_lang_change', async (event) => {
            const newLang = event.detail;
            logInfo(`Language change event detected: ${newLang}`);

            // 切换菜单语言
            await InnoGlobalMenu.switchLanguage(newLang);
        });

        logInfo('Language change listener registered');
    }

    // ===== 自动初始化 =====
    function autoInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                InnoGlobalMenu.init().catch(error => {
                    logError('Auto initialization failed', error);
                });
                // 设置语言切换监听器
                setupLanguageListener();
            });
        } else {
            InnoGlobalMenu.init().catch(error => {
                logError('Auto initialization failed', error);
            });
            // 设置语言切换监听器
            setupLanguageListener();
        }
    }

    // 导出到全局
    window.InnoGlobalMenu = InnoGlobalMenu;

    // 自动初始化
    autoInit();

})();