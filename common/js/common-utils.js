/**
 * INNONATION AI - 通用工具函数
 * 提供常用的工具函数和辅助方法
 */

window.InnoUtils = (function() {
    'use strict';

    // ===== 设备检测 =====
    const Device = {
        isMobile() {
            return window.innerWidth <= 768 || ('ontouchstart' in window);
        },

        isTablet() {
            return window.innerWidth > 768 && window.innerWidth <= 1024;
        },

        isDesktop() {
            return window.innerWidth > 1024;
        },

        getViewportSize() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
    };

    // ===== 语言和国际化 =====
    const I18n = {
        getCurrentLanguage() {
            return localStorage.getItem('inno_lang') || 'zh';
        },

        setLanguage(lang) {
            localStorage.setItem('inno_lang', lang);
            return lang;
        },

        toggleLanguage() {
            const current = this.getCurrentLanguage();
            const newLang = current === 'zh' ? 'en' : 'zh';
            this.setLanguage(newLang);
            return newLang;
        },

        isRTL() {
            return false; // 目前不支持RTL语言
        }
    };

    // ===== DOM 操作 =====
    const DOM = {
        $(selector, context = document) {
            return context.querySelector(selector);
        },

        $$(selector, context = document) {
            return Array.from(context.querySelectorAll(selector));
        },

        ready(callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
            } else {
                callback();
            }
        },

        createElement(tag, attributes = {}, textContent = '') {
            const element = document.createElement(tag);

            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else {
                    element.setAttribute(key, value);
                }
            });

            if (textContent) {
                element.textContent = textContent;
            }

            return element;
        },

        addClass(element, className) {
            if (element) element.classList.add(className);
        },

        removeClass(element, className) {
            if (element) element.classList.remove(className);
        },

        toggleClass(element, className) {
            if (element) return element.classList.toggle(className);
        },

        hasClass(element, className) {
            return element ? element.classList.contains(className) : false;
        }
    };

    // ===== 事件处理 =====
    const Events = {
        on(element, event, handler, options = {}) {
            if (element && typeof handler === 'function') {
                element.addEventListener(event, handler, options);
            }
        },

        off(element, event, handler) {
            if (element) {
                element.removeEventListener(event, handler);
            }
        },

        once(element, event, handler) {
            this.on(element, event, handler, { once: true });
        },

        delegate(parent, selector, event, handler) {
            this.on(parent, event, (e) => {
                const target = e.target.closest(selector);
                if (target) {
                    handler.call(target, e);
                }
            });
        },

        trigger(element, eventName, detail = {}) {
            if (element) {
                const event = new CustomEvent(eventName, { detail });
                element.dispatchEvent(event);
            }
        }
    };

    // ===== 防抖和节流 =====
    const Throttle = {
        debounce(func, delay) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },

        throttle(func, limit) {
            let inThrottle;
            return function (...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    // ===== URL 和查询参数处理 =====
    const URL = {
        getParam(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        },

        setParam(name, value) {
            const url = new window.URL(window.location);
            url.searchParams.set(name, value);
            window.history.replaceState({}, '', url);
        },

        removeParam(name) {
            const url = new window.URL(window.location);
            url.searchParams.delete(name);
            window.history.replaceState({}, '', url);
        },

        getAllParams() {
            const params = {};
            new URLSearchParams(window.location.search).forEach((value, key) => {
                params[key] = value;
            });
            return params;
        }
    };

    // ===== 存储 =====
    const Storage = {
        set(key, value, isSession = false) {
            try {
                const storage = isSession ? sessionStorage : localStorage;
                const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                storage.setItem(key, serializedValue);
                return true;
            } catch (error) {
                console.error('Storage set error:', error);
                return false;
            }
        },

        get(key, defaultValue = null, isSession = false) {
            try {
                const storage = isSession ? sessionStorage : localStorage;
                const value = storage.getItem(key);

                if (value === null) return defaultValue;

                // 尝试解析JSON，如果失败则返回原始值
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            } catch (error) {
                console.error('Storage get error:', error);
                return defaultValue;
            }
        },

        remove(key, isSession = false) {
            try {
                const storage = isSession ? sessionStorage : localStorage;
                storage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Storage remove error:', error);
                return false;
            }
        },

        clear(isSession = false) {
            try {
                const storage = isSession ? sessionStorage : localStorage;
                storage.clear();
                return true;
            } catch (error) {
                console.error('Storage clear error:', error);
                return false;
            }
        }
    };

    // ===== 格式化工具 =====
    const Format = {
        date(date, format = 'YYYY-MM-DD') {
            if (!date) return '';

            const d = new Date(date);
            if (isNaN(d.getTime())) return '';

            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hour = String(d.getHours()).padStart(2, '0');
            const minute = String(d.getMinutes()).padStart(2, '0');
            const second = String(d.getSeconds()).padStart(2, '0');

            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hour)
                .replace('mm', minute)
                .replace('ss', second);
        },

        currency(amount, currency = 'USD', locale = 'en-US') {
            if (isNaN(amount)) return '';

            try {
                return new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: currency
                }).format(amount);
            } catch {
                return `${currency} ${amount.toLocaleString()}`;
            }
        },

        number(num, decimals = 0) {
            if (isNaN(num)) return '';
            return Number(num).toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        },

        truncate(str, length = 100, suffix = '...') {
            if (!str || str.length <= length) return str;
            return str.substring(0, length) + suffix;
        }
    };

    // ===== 验证工具 =====
    const Validate = {
        email(email) {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(email);
        },

        url(url) {
            try {
                new window.URL(url);
                return true;
            } catch {
                return false;
            }
        },

        phone(phone) {
            const pattern = /^[\+]?[1-9][\d]{0,15}$/;
            return pattern.test(phone.replace(/\s/g, ''));
        },

        required(value) {
            return value !== null && value !== undefined && value !== '';
        },

        minLength(value, min) {
            return String(value).length >= min;
        },

        maxLength(value, max) {
            return String(value).length <= max;
        }
    };

    // ===== 动画辅助 =====
    const Animation = {
        fadeIn(element, duration = 300) {
            if (!element) return;

            element.style.opacity = '0';
            element.style.display = 'block';

            const start = performance.now();
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                element.style.opacity = progress;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        },

        fadeOut(element, duration = 300) {
            if (!element) return;

            const start = performance.now();
            const initialOpacity = parseFloat(getComputedStyle(element).opacity) || 1;

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                element.style.opacity = initialOpacity * (1 - progress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                }
            };

            requestAnimationFrame(animate);
        },

        slideDown(element, duration = 300) {
            if (!element) return;

            element.style.height = '0px';
            element.style.overflow = 'hidden';
            element.style.display = 'block';

            const targetHeight = element.scrollHeight;
            const start = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                element.style.height = (targetHeight * progress) + 'px';

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.height = '';
                    element.style.overflow = '';
                }
            };

            requestAnimationFrame(animate);
        }
    };

    // ===== 通知系统 =====
    const Notification = {
        show(message, type = 'info', duration = 3000) {
            const notification = DOM.createElement('div', {
                className: `alert alert-${type} alert-notification`,
                innerHTML: `
                    <div class="d-flex align-items-center">
                        <i class="fas fa-${this.getIcon(type)} me-2"></i>
                        <span>${message}</span>
                        <button class="btn-close ms-auto" type="button"></button>
                    </div>
                `
            });

            // 创建容器（如果不存在）
            let container = DOM.$('.notification-container');
            if (!container) {
                container = DOM.createElement('div', {
                    className: 'notification-container position-fixed top-0 end-0 p-3',
                    style: 'z-index: 1080;'
                });
                document.body.appendChild(container);
            }

            container.appendChild(notification);

            // 绑定关闭按钮
            const closeBtn = notification.querySelector('.btn-close');
            Events.on(closeBtn, 'click', () => {
                this.remove(notification);
            });

            // 自动关闭
            if (duration > 0) {
                setTimeout(() => {
                    this.remove(notification);
                }, duration);
            }

            // 添加进入动画
            Animation.fadeIn(notification);

            return notification;
        },

        remove(notification) {
            if (notification && notification.parentNode) {
                Animation.fadeOut(notification, 200);
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 200);
            }
        },

        getIcon(type) {
            const icons = {
                success: 'check-circle',
                warning: 'exclamation-triangle',
                danger: 'times-circle',
                error: 'times-circle',
                info: 'info-circle'
            };
            return icons[type] || 'info-circle';
        },

        success(message, duration) {
            return this.show(message, 'success', duration);
        },

        warning(message, duration) {
            return this.show(message, 'warning', duration);
        },

        error(message, duration) {
            return this.show(message, 'danger', duration);
        },

        info(message, duration) {
            return this.show(message, 'info', duration);
        }
    };

    // ===== 加载状态管理 =====
    const Loading = {
        show(target = document.body, message = '加载中...') {
            const loader = DOM.createElement('div', {
                className: 'inno-loader position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center',
                style: 'background: rgba(255, 255, 255, 0.9); z-index: 999;',
                innerHTML: `
                    <div class="text-center">
                        <div class="loading-spinner mb-3"></div>
                        <div class="text-muted">${message}</div>
                    </div>
                `
            });

            if (target === document.body) {
                loader.style.position = 'fixed';
            } else {
                target.style.position = 'relative';
            }

            target.appendChild(loader);
            return loader;
        },

        hide(loader) {
            if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }
    };

    // ===== 公共API =====
    return {
        Device,
        I18n,
        DOM,
        Events,
        Throttle,
        URL,
        Storage,
        Format,
        Validate,
        Animation,
        Notification,
        Loading,

        // 快捷方法
        $: DOM.$,
        $$: DOM.$$,
        ready: DOM.ready,
        debounce: Throttle.debounce,
        throttle: Throttle.throttle,

        // 版本信息
        version: '1.0.0'
    };

})();