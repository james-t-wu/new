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
    async function getUserData() {
        // 尝试从多个来源获取用户数据
        try {
            // 1. 从 cookie 中获取 user_id (Cookie 是权威来源)
            const userId = getCookie('user_id') || localStorage.getItem('userId');

            // 2. 检查缓存的用户数据（使用userId作为key，确保不同用户有不同缓存）
            const cacheKey = `user_profile_data_${userId}`;
            const cacheTimeKey = `user_profile_cache_time_${userId}`;
            const cachedUser = sessionStorage.getItem(cacheKey);
            if (cachedUser && userId) {
                const userData = JSON.parse(cachedUser);
                // 检查缓存是否过期（5分钟）
                const cacheTime = sessionStorage.getItem(cacheTimeKey);
                if (cacheTime && (Date.now() - parseInt(cacheTime)) < 300000) {
                    logInfo(`Using cached user data for userId: ${userId}`);
                    return transformUserData(userData);
                }
            }

            // 调试日志
            console.log('[UserProfile Debug] Cookie user_id:', getCookie('user_id'));
            console.log('[UserProfile Debug] localStorage userId:', localStorage.getItem('userId'));
            console.log('[UserProfile Debug] Final userId:', userId);

            if (!userId || userId === '' || userId === 'null' || userId === 'undefined') {
                logInfo('No userId found, using default data');
                return getDefaultUserData();
            }

            // 3. 调用 UserInfo.asmx Get 方法获取用户信息
            logInfo(`Fetching user data for userId: ${userId}`);
            const userData = await fetchUserFromWebService(userId);

            if (userData) {
                // 缓存用户数据（使用userId作为key）
                const cacheKey = `user_profile_data_${userId}`;
                const cacheTimeKey = `user_profile_cache_time_${userId}`;
                sessionStorage.setItem(cacheKey, JSON.stringify(userData));
                sessionStorage.setItem(cacheTimeKey, Date.now().toString());

                // 同步localStorage的userId
                localStorage.setItem('userId', userId);

                return transformUserData(userData);
            }

            // 4. 如果获取失败，返回默认数据
            logInfo('Failed to fetch user data, using default');
            return getDefaultUserData();
        } catch (error) {
            logError('Failed to get user data', error);
            return getDefaultUserData();
        }
    }

    /**
     * 从 WebService 获取用户信息
     * @param {string} userId - 用户ID
     * @returns {Promise<Object|null>} 用户数据或null
     */
    async function fetchUserFromWebService(userId) {
        try {
            // 检测环境并使用相应的 API URL
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

            // 根据环境决定使用相对路径还是绝对路径
            // 使用 GET 方式,参数作为查询字符串
            const baseUrl = isLocalhost
                ? 'https://ai.innonation.io/user/UserInfo.asmx/Get'  // 本地开发使用绝对路径
                : '/user/UserInfo.asmx/Get';  // 生产环境使用相对路径

            // 构建带参数的 URL (GET 方式)
            const apiUrl = `${baseUrl}?userId=${encodeURIComponent(userId)}`;

            console.log('[UserProfile Debug] Environment:', isLocalhost ? 'localhost' : 'production');
            console.log('[UserProfile Debug] API URL:', apiUrl);
            console.log('[UserProfile Debug] Calling UserInfo.asmx/Get with userId:', userId);

            // 使用 GET 方式调用
            const fetchOptions = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            };

            // 生产环境添加 credentials
            if (!isLocalhost) {
                fetchOptions.credentials = 'include';
            }

            const response = await fetch(apiUrl, fetchOptions);

            console.log('[UserProfile Debug] Response status:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('[UserProfile Debug] Response data:', result);

            // 处理不同的响应格式
            let userData = null;

            // 方式1: POST 调用时,数据包裹在 'd' 属性中
            if (result.d) {
                userData = typeof result.d === 'string' ? JSON.parse(result.d) : result.d;
            }
            // 方式2: GET 调用时,直接返回用户对象
            else if (result.Id || result.Email) {
                userData = result;
            }

            if (userData) {
                console.log('[UserProfile Debug] Parsed user data:', userData);
                logInfo('User data fetched successfully from WebService');
                return userData;
            }

            logError('Invalid response format from WebService', result);
            return null;
        } catch (error) {
            logError('Error fetching user from WebService', error);
            console.error('[UserProfile Debug] Fetch error details:', error);

            // 如果是本地开发环境且 API 调用失败,提供友好提示
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.warn('[UserProfile] ⚠️ 本地开发环境检测到 API 调用失败');
                console.warn('[UserProfile] 💡 请确保:');
                console.warn('[UserProfile]    1. 后端服务正在运行');
                console.warn('[UserProfile]    2. 或者将前端部署到与后端相同的域名进行测试');
                console.warn('[UserProfile] 📌 将使用默认用户数据显示界面');
            }

            return null;
        }
    }

    /**
     * 转换后端用户数据为前端需要的格式
     * @param {Object} userData - 后端返回的用户数据
     * @returns {Object} 前端格式的用户数据
     */
    function transformUserData(userData) {
        if (!userData) return getDefaultUserData();

        // 计算会员类型
        let membership = 'FREE';
        let membershipLabel = 'Free User';

        if (userData.Group) {
            membership = userData.Group.toUpperCase();
        }

        // 格式化到期时间
        let expiry = '';
        if (userData.ExpirationDate) {
            try {
                const expirationTimestamp = parseInt(userData.ExpirationDate);
                const expirationDate = new Date(expirationTimestamp * 1000);

                // 格式化为 "Mon.DD.YYYY" 格式
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const month = months[expirationDate.getMonth()];
                const day = expirationDate.getDate();
                const year = expirationDate.getFullYear();
                expiry = `${month}.${day}.${year}`;
            } catch (error) {
                logError('Failed to parse expiration date', error);
            }
        }

        // 构建用户名称
        let name = 'User';
        if (userData.First_name && userData.Last_name) {
            name = `${userData.Last_name} ${userData.First_name}`;
        } else if (userData.Email) {
            name = userData.Email.split('@')[0];
        }

        return {
            isLoggedIn: true,  // 标记为已登录
            name: name,
            membership: membership,
            expiry: expiry,
            avatarUrl: userData.HeadImageURL || null,
            email: userData.Email || '',
            userId: userData.Id || '',
            expired: userData.Expired || false
        };
    }

    function getDefaultUserData() {
        return {
            isLoggedIn: false,  // 标记为未登录
            name: '',
            membership: '',
            expiry: '',
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

        // 如果用户未登录，显示登录按钮
        if (!userData.isLoggedIn) {
            return html`
                <div class="user-profile-container">
                    <!-- 登录按钮 -->
                    <a href="/home_new_israel.aspx" class="btn btn-primary btn-sm" style="background: linear-gradient(135deg, #2196F3 0%, #1565C0 100%); border: none; padding: 0.7rem; font-size: 0.875rem; white-space: nowrap;">
                        <i class="fas fa-sign-in-alt me-1"></i>
                        <span>${t('login') || '登录'}</span>
                    </a>
                </div>
            `;
        }

        // 已登录用户显示完整的用户资料下拉菜单
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
                            <a href="/new/profile.html" class="user-profile-menu-link">
                                <i class="fas fa-user-circle"></i>
                                <span>${t('profile')}</span>
                            </a>
                        </li>
                        <li class="user-profile-menu-item">
                            <div class="user-profile-divider"></div>
                        </li>
                        <li class="user-profile-menu-item">
                            <a href="/signout.aspx?redirect=Israel" class="user-profile-menu-link logout">
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

    // ===== 退出登录处理 =====
    function handleLogout(e) {
        e.preventDefault();

        logInfo('User logout initiated');

        // 1. 清除 localStorage 中的用户相关数据
        const localStorageKeys = ['userId', 'user_id', 'userName', 'userEmail', 'userToken', 'api_token'];
        localStorageKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                logInfo(`Removed localStorage key: ${key}`);
            }
        });

        // 2. 清除 sessionStorage 中的所有用户相关缓存
        const sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach(key => {
            if (key.startsWith('user_profile_') || key.startsWith('user_')) {
                sessionStorage.removeItem(key);
                logInfo(`Removed sessionStorage key: ${key}`);
            }
        });

        // 3. 清除所有用户相关的 cookies
        const cookiesToClear = ['user_id', 'api_token', 'auth_token', 'session_id'];
        cookiesToClear.forEach(cookieName => {
            // 清除当前域名的 cookie
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            // 清除根域名的 cookie
            const domain = window.location.hostname;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
            logInfo(`Cleared cookie: ${cookieName}`);
        });

        // 4. 清空组件状态
        state.userData = null;

        logInfo('User data cleared successfully');

        // 5. 跳转到登出页面
        const redirectUrl = e.target.closest('a').getAttribute('href');
        window.location.href = redirectUrl;
    }

    // ===== 事件绑定 =====
    function bindEvents() {
        const avatarBtn = document.getElementById('user-avatar-btn');
        const dropdown = document.getElementById('user-profile-dropdown');

        // 如果是未登录状态（没有下拉菜单），不需要绑定事件
        if (!avatarBtn || !dropdown) {
            logInfo('User not logged in or profile elements not found - skipping event binding');
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

        // 退出登录处理
        const logoutLink = dropdown.querySelector('.user-profile-menu-link.logout');
        if (logoutLink) {
            logoutLink.addEventListener('click', handleLogout);
            logInfo('Logout event handler attached');
        } else {
            logError('Logout link not found');
        }
    }

    // ===== 主渲染函数 =====
    async function render(targetElement) {
        try {
            // 加载翻译
            await loadTranslations(state.lang);

            // 获取用户数据 (现在是异步的)
            state.userData = await getUserData();

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

        // 重新渲染组件 (会清除缓存并重新获取用户数据)
        async refresh() {
            // 清除缓存
            this.clearCache();

            const container = document.getElementById(COMPONENT_ID);
            if (container) {
                return await render(container);
            }
            return false;
        },

        // 清除用户数据缓存
        clearCache() {
            // 清除所有user_profile相关的缓存
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                if (key.startsWith('user_profile_data_') || key.startsWith('user_profile_cache_time_')) {
                    sessionStorage.removeItem(key);
                }
            });
            logInfo('User profile cache cleared');
        },

        // 销毁组件
        destroy() {
            const container = document.getElementById(COMPONENT_ID);
            if (container) {
                container.remove();
            }
            state.isInitialized = false;
            this.clearCache();
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
