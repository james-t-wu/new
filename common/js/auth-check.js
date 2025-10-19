/**
 * 认证检查脚本 - Authentication Check Script (Enhanced Version)
 * 用于new目录下的HTML页面,检查用户登录状态
 * 如果用户未登录或token已过期,自动跳转到 home_israel.aspx
 */

(function() {
    'use strict';

    // API配置
    const API_BASE_URL = 'https://ai.innonation.io/inno_ai_services/api';
    const LOGIN_PAGE = '/home_israel.aspx';

    /**
     * 获取 Cookie 值
     * @param {string} name - Cookie名称
     * @returns {string|null} Cookie值或null
     */
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    /**
     * 跳转到登录页面
     * @param {string} reason - 跳转原因
     */
    function redirectToLogin(reason) {
        console.log('[Auth Check] Redirecting to login:', reason);

        // 保存当前页面URL,以便登录后可以返回
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirect_after_login', currentUrl);

        // 清除无效的认证信息
        document.cookie = 'api_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('userId');

        // 跳转到登录页面
        window.location.href = LOGIN_PAGE;
    }

    /**
     * Base64 URL解码 (JWT使用的是URL安全的Base64)
     * @param {string} str - Base64 URL编码的字符串
     * @returns {string} 解码后的字符串
     */
    function base64UrlDecode(str) {
        // 将Base64 URL转换为标准Base64
        str = str.replace(/-/g, '+').replace(/_/g, '/');

        // 补齐padding
        while (str.length % 4) {
            str += '=';
        }

        try {
            // 解码Base64
            return decodeURIComponent(escape(atob(str)));
        } catch (e) {
            console.error('[Auth Check] Base64 decode error:', e);
            return null;
        }
    }

    /**
     * 解析JWT token并检查是否过期
     * @param {string} token - JWT token
     * @returns {object|null} 解析后的payload,如果无效则返回null
     */
    function parseJWTToken(token) {
        try {
            // JWT格式: header.payload.signature
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.error('[Auth Check] Invalid JWT format');
                return null;
            }

            // 解码payload部分
            const payload = base64UrlDecode(parts[1]);
            if (!payload) {
                return null;
            }

            return JSON.parse(payload);
        } catch (e) {
            console.error('[Auth Check] JWT parse error:', e);
            return null;
        }
    }

    /**
     * 检查JWT token是否过期
     * @param {string} token - JWT token
     * @returns {boolean} token是否有效(未过期)
     */
    function isTokenExpired(token) {
        const payload = parseJWTToken(token);

        if (!payload) {
            console.log('[Auth Check] Invalid token format');
            return true; // 无法解析,认为已过期
        }

        // 检查exp字段(过期时间戳,单位:秒)
        if (!payload.exp) {
            console.log('[Auth Check] No expiration time in token');
            return false; // 没有过期时间,认为永久有效
        }

        const now = Math.floor(Date.now() / 1000); // 当前时间戳(秒)
        const isExpired = now >= payload.exp;

        if (isExpired) {
            const expiredDate = new Date(payload.exp * 1000);
            console.log('[Auth Check] Token expired at:', expiredDate.toLocaleString());
        } else {
            const expiresIn = payload.exp - now;
            console.log('[Auth Check] Token valid, expires in:', Math.floor(expiresIn / 60), 'minutes');
        }

        return isExpired;
    }

    /**
     * 验证token是否有效 (通用方法 - 不依赖任何业务API)
     * 方法1: 优先使用JWT本地解析检查过期时间
     * 方法2: 如果解析失败,降级到API验证
     * @returns {Promise<boolean>} token是否有效
     */
    async function validateToken() {
        const apiToken = getCookie('api_token');

        if (!apiToken || apiToken === '' || apiToken === 'null' || apiToken === 'undefined') {
            console.log('[Auth Check] No token found');
            return false;
        }

        // 方法1: 本地解析JWT token检查过期时间 (最快,最可靠)
        try {
            const expired = isTokenExpired(apiToken);
            if (expired) {
                console.log('[Auth Check] Token has expired (JWT validation)');
                return false;
            }

            // Token未过期
            console.log('[Auth Check] Token validation successful (JWT validation)');
            return true;

        } catch (error) {
            // JWT解析失败,降级到API验证
            console.log('[Auth Check] JWT validation failed, trying API validation:', error.message);
            return await validateTokenWithAPI(apiToken);
        }
    }

    /**
     * 降级方案: 通过API验证token (当JWT解析失败时使用)
     * @param {string} apiToken - API token
     * @returns {Promise<boolean>} token是否有效
     */
    async function validateTokenWithAPI(apiToken) {
        try {
            // 使用一个通用的、所有页面都能访问的轻量级API
            // 这里可以使用任何需要认证的API,只是检查401/403状态
            const testUrl = `${API_BASE_URL}/User/GetInfo`;

            const response = await fetch(testUrl, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + apiToken
                },
                signal: AbortSignal.timeout(3000)
            });

            // 检查响应状态
            if (response.status === 401 || response.status === 403) {
                console.log('[Auth Check] Token invalid (API returned ' + response.status + ')');
                return false;
            }

            // 其他状态认为token通过了认证
            console.log('[Auth Check] Token valid (API validation)');
            return true;

        } catch (error) {
            console.log('[Auth Check] API validation error:', error.message);

            // API验证失败,检查token新鲜度
            const tokenAge = getTokenAge();
            if (tokenAge < 300) {
                console.log('[Auth Check] Token is fresh, allowing access');
                return true;
            }

            return false;
        }
    }

    /**
     * 获取token的年龄(秒)
     * 通过检查cookie的设置时间(如果有)或使用启发式方法
     * @returns {number} token年龄(秒),如果无法确定则返回很大的数
     */
    function getTokenAge() {
        // 简单实现:检查sessionStorage中是否有token设置时间
        const tokenSetTime = sessionStorage.getItem('token_set_time');
        if (tokenSetTime) {
            const age = (Date.now() - parseInt(tokenSetTime)) / 1000;
            return age;
        }
        // 如果没有记录,返回一个大值表示"不知道,可能很老"
        return 999999;
    }

    /**
     * 记录token设置时间(在登录时调用)
     */
    function markTokenAsSet() {
        sessionStorage.setItem('token_set_time', Date.now().toString());
    }

    /**
     * 基础的token存在性检查(不验证有效性)
     * @returns {boolean} token是否存在
     */
    function hasToken() {
        const apiToken = getCookie('api_token');
        const userId = localStorage.getItem('userId');

        if (apiToken && apiToken !== '' && apiToken !== 'null' && apiToken !== 'undefined') {
            return true;
        }

        if (userId && userId !== '' && userId !== 'null' && userId !== 'undefined') {
            return true;
        }

        return false;
    }

    /**
     * 执行完整的认证检查(异步)
     */
    async function checkAuthAndRedirect() {
        // 第一步: 快速检查token是否存在
        if (!hasToken()) {
            redirectToLogin('No token found');
            return;
        }

        console.log('[Auth Check] Token found, validating...');

        // 第二步: 验证token是否有效 (优先JWT本地解析,降级到API)
        const isValid = await validateToken();

        if (!isValid) {
            redirectToLogin('Token validation failed');
            return;
        }

        console.log('[Auth Check] ✅ Authentication successful, access granted');
    }

    /**
     * 同步版本的认证检查(仅检查token存在性)
     * @returns {boolean} 是否有token
     */
    function isUserAuthenticated() {
        return hasToken();
    }

    // 页面加载后执行检查
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAuthAndRedirect);
    } else {
        // DOM已经加载完成,立即执行
        checkAuthAndRedirect();
    }

    // 导出函数供外部使用
    window.AuthCheck = {
        isAuthenticated: isUserAuthenticated,
        check: checkAuthAndRedirect,
        validateToken: validateToken,
        parseToken: parseJWTToken,
        isTokenExpired: isTokenExpired,
        getCookie: getCookie,
        markTokenAsSet: markTokenAsSet,
        checkAuthentication: async function() {
            return new Promise((resolve, reject) => {
                if (hasToken()) {
                    validateToken().then(isValid => {
                        if (isValid) {
                            resolve();
                        } else {
                            reject(new Error('Token validation failed'));
                        }
                    }).catch(reject);
                } else {
                    reject(new Error('No token found'));
                }
            });
        }
    };
})();
