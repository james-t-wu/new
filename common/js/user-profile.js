/**
 * INNONATION AI - User Profile Dropdown Component
 * 用户资料下拉菜单组件
 *
 * 功能特性：
 * - 响应式设计
 * - 多语言支持
 * - 点击外部自动关闭
 * - 用户信息展示
 * - 自动初始化
 */

(function() {
    'use strict';

    // ===== 配置常量 =====
    const COMPONENT_ID = 'user-profile-component';
    let lang = (localStorage.getItem('inno_lang') || 'zh').toLowerCase();
    if (lang === 'zh') lang = 'zh';
    const DEFAULT_LANG = lang;
    const I18N_BASE_PATH = 'common/i18n/user-profile.';

    // ===== 全局状态 =====
    let state = {
        lang: DEFAULT_LANG,
        t: (key) => key,
        translations: {},
        isInitialized: false,
        userData: null
    };

    // ===== 工具函数 =====
    function html(strings, ...values) {
        return strings.reduce((prev, curr, i) => prev + curr + (values[i] ?? ''), '');
    }

    function logError(message, error) {
        console.error(`[UserProfile] ${message}`, error);
    }

    function logInfo(message) {
        console.log(`[UserProfile] ${message}`);
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
            state.translations = getDefaultTranslations();
            state.t = (key) => state.translations[key] || key;
            return false;
        }
    }

    function getDefaultTranslations() {
        return {
            profile: '个人资料',
            signOut: '退出登录',
            membership: '会员身份',
            until: '有效期至',
            admin: '管理员',
            premiumUser: '付费用户',
            freeUser: '免费用户'
        };
    }

    // ===== 用户数据获取 =====
    function getUserData() {
        // 尝试从多个来源获取用户数据
        try {
            // 1. 从 cookie 中获取
            const userCookie = getCookie('user_info');
            if (userCookie) {
                return JSON.parse(decodeURIComponent(userCookie));
            }

            // 2. 从 localStorage 中获取
            const userLocal = localStorage.getItem('user_info');
            if (userLocal) {
                return JSON.parse(userLocal);
            }

            // 3. 从全局变量获取（如果存在）
            if (window.currentUser) {
                return window.currentUser;
            }

            // 4. 返回默认数据
            return getDefaultUserData();
        } catch (error) {
            logError('Failed to get user data', error);
            return getDefaultUserData();
        }
    }

    function getDefaultUserData() {
        return {
            name: 'wu James',
            membership: 'ADMIN',
            expiry: 'Jun.21.2030',
            avatarUrl: null
        };
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // ===== 用户资料组件模板 =====
    function getUserProfileTemplate(userData) {
        const t = state.t;
        const hasAvatar = userData.avatarUrl && userData.avatarUrl !== '';

        return html`
            <div class="user-profile-container">
                <!-- 用户头像按钮 -->
                <div class="user-avatar-btn" id="user-avatar-btn">
                    ${hasAvatar
                        ? `<img src="${userData.avatarUrl}" alt="${userData.name}" class="user-avatar-img">`
                        : `<i class="fas fa-user user-avatar-icon"></i>`
                    }
                </div>

                <!-- 下拉菜单 -->
                <div class="user-profile-dropdown" id="user-profile-dropdown">
                    <!-- 用户信息头部 -->
                    <div class="user-profile-header">
                        <div class="user-profile-avatar-large">
                            ${hasAvatar
                                ? `<img src="${userData.avatarUrl}" alt="${userData.name}" class="user-avatar-img">`
                                : `<i class="fas fa-user user-avatar-icon"></i>`
                            }
                        </div>
                        <div class="user-profile-name">${userData.name || 'User'}</div>
                        <div class="user-profile-membership">
                            ${t('membership')}: ${getMembershipLabel(userData.membership)}
                        </div>
                        ${userData.expiry ? `<div class="user-profile-expiry">${t('until')}: ${userData.expiry}</div>` : ''}
                    </div>

                    <!-- 菜单项 -->
                    <ul class="user-profile-menu">
                        <li class="user-profile-menu-item">
                            <a href="/dashboard/profile_israel.aspx" class="user-profile-menu-link">
                                <i class="fas fa-user-circle"></i>
                                <span>${t('profile')}</span>
                            </a>
                        </li>
                        <li class="user-profile-menu-item">
                            <div class="user-profile-divider"></div>
                        </li>
                        <li class="user-profile-menu-item">
                            <a href="/signout.aspx" class="user-profile-menu-link logout">
                                <i class="fas fa-sign-out-alt"></i>
                                <span>${t('signOut')}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    function getMembershipLabel(membership) {
        const t = state.t;
        if (!membership) return t('freeUser');

        const membershipUpper = membership.toUpperCase();
        if (membershipUpper === 'ADMIN') return t('admin');
        if (membershipUpper.includes('PREMIUM') || membershipUpper.includes('PAID')) return t('premiumUser');
        return t('freeUser');
    }

    // ===== 事件绑定 =====
    function bindEvents() {
        const avatarBtn = document.getElementById('user-avatar-btn');
        const dropdown = document.getElementById('user-profile-dropdown');

        if (!avatarBtn || !dropdown) {
            logError('User profile elements not found');
            return;
        }

        // 切换下拉菜单显示
        avatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        // 点击外部关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== avatarBtn) {
                dropdown.classList.remove('show');
            }
        });

        // 防止下拉菜单内的点击关闭菜单（除了链接）
        dropdown.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                e.stopPropagation();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });
    }

    // ===== 主渲染函数 =====
    async function render(targetElement) {
        try {
            // 加载翻译
            await loadTranslations(state.lang);

            // 获取用户数据
            state.userData = getUserData();

            // 渲染组件
            targetElement.innerHTML = getUserProfileTemplate(state.userData);

            // 绑定事件
            bindEvents();

            logInfo('User profile component rendered successfully');
            return true;
        } catch (error) {
            logError('Failed to render user profile component', error);
            return false;
        }
    }

    // ===== 公共API =====
    const UserProfile = {
        // 初始化组件
        async init(targetSelector = '.language-switch') {
            if (state.isInitialized) {
                logInfo('User profile component already initialized');
                return true;
            }

            // 查找目标元素的父容器
            const languageSwitch = document.querySelector(targetSelector);
            if (!languageSwitch) {
                logError(`Target element not found: ${targetSelector}`);
                return false;
            }

            // 创建组件容器并插入到语言切换按钮之后
            const container = document.createElement('div');
            container.id = COMPONENT_ID;
            languageSwitch.parentNode.insertBefore(container, languageSwitch.nextSibling);

            const success = await render(container);
            if (success) {
                state.isInitialized = true;
                logInfo('User profile component initialized successfully');
            }
            return success;
        },

        // 切换语言
        async setLang(lang) {
            if (lang === state.lang) return true;

            state.lang = lang;
            const container = document.getElementById(COMPONENT_ID);
            if (container) {
                return await render(container);
            }
            return false;
        },

        // 更新用户数据
        async updateUserData(userData) {
            state.userData = { ...state.userData, ...userData };
            const container = document.getElementById(COMPONENT_ID);
            if (container) {
                return await render(container);
            }
            return false;
        },

        // 获取当前语言
        getCurrentLanguage() {
            return state.lang;
        },

        // 重新渲染组件
        async refresh() {
            const container = document.getElementById(COMPONENT_ID);
            if (container) {
                return await render(container);
            }
            return false;
        },

        // 销毁组件
        destroy() {
            const container = document.getElementById(COMPONENT_ID);
            if (container) {
                container.remove();
            }
            state.isInitialized = false;
            logInfo('User profile component destroyed');
        }
    };

    // ===== 自动初始化 =====
    function autoInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // 延迟初始化，确保语言切换按钮已渲染
                setTimeout(() => {
                    UserProfile.init().catch(error => {
                        logError('Auto initialization failed', error);
                    });
                }, 100);
            });
        } else {
            setTimeout(() => {
                UserProfile.init().catch(error => {
                    logError('Auto initialization failed', error);
                });
            }, 100);
        }
    }

    // ===== 语言变化监听 =====
    window.addEventListener('inno_lang_change', (event) => {
        if (event.detail && state.isInitialized) {
            UserProfile.setLang(event.detail).catch(error => {
                logError('Failed to change language', error);
            });
        }
    });

    // 导出到全局
    window.UserProfile = UserProfile;

    // 自动初始化
    autoInit();

})();
