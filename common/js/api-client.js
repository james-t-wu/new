/**
 * INNONATION AI - API 客户端
 * 统一的API调用封装，提供错误处理、重试机制和请求拦截
 */

window.ApiClient = (function() {
    'use strict';

    // ===== 配置 =====
    const config = {
        baseURL: '', // 可以设置基础URL
        timeout: 30000, // 30秒超时
        retries: 3, // 重试次数
        retryDelay: 1000, // 重试延迟（毫秒）
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    // ===== 工具函数 =====
    function buildURL(url, params = {}) {
        const fullURL = config.baseURL + url;
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        return queryString ? `${fullURL}?${queryString}` : fullURL;
    }

    function createTimeout(ms) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), ms);
        });
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getErrorMessage(error) {
        if (error.response) {
            // 服务器响应错误
            const data = error.response.data;
            return data?.message || data?.error || `HTTP ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
            // 网络错误
            return '网络连接失败，请检查您的网络连接';
        } else {
            // 其他错误
            return error.message || '请求失败';
        }
    }

    function logRequest(method, url, data) {
        console.log(`[ApiClient] ${method.toUpperCase()} ${url}`, data || '');
    }

    function logResponse(method, url, response, duration) {
        console.log(`[ApiClient] ${method.toUpperCase()} ${url} - ${response.status} (${duration}ms)`);
    }

    function logError(method, url, error) {
        console.error(`[ApiClient] ${method.toUpperCase()} ${url} - Error:`, error);
    }

    // ===== 请求拦截器 =====
    const requestInterceptors = [];
    const responseInterceptors = [];
    const errorInterceptors = [];

    function applyRequestInterceptors(config) {
        let result = { ...config };
        requestInterceptors.forEach(interceptor => {
            result = interceptor(result);
        });
        return result;
    }

    function applyResponseInterceptors(response) {
        let result = response;
        responseInterceptors.forEach(interceptor => {
            result = interceptor(result);
        });
        return result;
    }

    function applyErrorInterceptors(error) {
        let result = error;
        errorInterceptors.forEach(interceptor => {
            result = interceptor(result);
        });
        return result;
    }

    // ===== 核心请求方法 =====
    async function makeRequest(method, url, data = null, options = {}) {
        const startTime = Date.now();
        const requestConfig = applyRequestInterceptors({
            method: method.toUpperCase(),
            headers: { ...config.headers, ...options.headers },
            timeout: options.timeout || config.timeout,
            ...options
        });

        // 构建请求URL
        const requestURL = method === 'GET' && data
            ? buildURL(url, data)
            : (config.baseURL + url);

        // 准备请求体
        let body = null;
        if (data && method !== 'GET') {
            body = options.isFormData ? data : JSON.stringify(data);
            if (!options.isFormData && requestConfig.headers['Content-Type'] === 'application/json') {
                // JSON内容已经设置正确的Content-Type
            }
        }

        let lastError;

        // 重试逻辑
        for (let attempt = 0; attempt <= config.retries; attempt++) {
            try {
                logRequest(method, requestURL, data);

                // 创建fetch promise和timeout promise
                const fetchPromise = fetch(requestURL, {
                    method: requestConfig.method,
                    headers: requestConfig.headers,
                    body,
                    ...requestConfig
                });

                const timeoutPromise = createTimeout(requestConfig.timeout);

                // 等待请求完成或超时
                const response = await Promise.race([fetchPromise, timeoutPromise]);
                const duration = Date.now() - startTime;

                logResponse(method, requestURL, response, duration);

                // 检查响应状态
                if (!response.ok) {
                    const errorData = await response.text();
                    let parsedError;

                    try {
                        parsedError = JSON.parse(errorData);
                    } catch {
                        parsedError = { message: errorData };
                    }

                    const error = new Error(getErrorMessage({
                        response: {
                            status: response.status,
                            statusText: response.statusText,
                            data: parsedError
                        }
                    }));

                    error.response = {
                        status: response.status,
                        statusText: response.statusText,
                        data: parsedError
                    };

                    throw error;
                }

                // 解析响应
                const contentType = response.headers.get('content-type');
                let responseData;

                if (contentType && contentType.includes('application/json')) {
                    responseData = await response.json();
                } else {
                    responseData = await response.text();
                }

                const finalResponse = {
                    data: responseData,
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    config: requestConfig,
                    duration
                };

                return applyResponseInterceptors(finalResponse);

            } catch (error) {
                lastError = error;
                logError(method, requestURL, error);

                // 如果是最后一次尝试，或者是不可重试的错误，直接抛出
                if (attempt === config.retries ||
                    (error.response && error.response.status < 500)) {
                    throw applyErrorInterceptors(error);
                }

                // 等待后重试
                if (attempt < config.retries) {
                    console.log(`[ApiClient] Retrying ${method} ${url} (attempt ${attempt + 2}/${config.retries + 1})`);
                    await delay(config.retryDelay * (attempt + 1)); // 指数退避
                }
            }
        }

        // 如果所有重试都失败了
        throw applyErrorInterceptors(lastError);
    }

    // ===== 便捷方法 =====
    const ApiClient = {
        // GET请求
        async get(url, params = {}, options = {}) {
            return await makeRequest('GET', url, params, options);
        },

        // POST请求
        async post(url, data = {}, options = {}) {
            return await makeRequest('POST', url, data, options);
        },

        // PUT请求
        async put(url, data = {}, options = {}) {
            return await makeRequest('PUT', url, data, options);
        },

        // PATCH请求
        async patch(url, data = {}, options = {}) {
            return await makeRequest('PATCH', url, data, options);
        },

        // DELETE请求
        async delete(url, options = {}) {
            return await makeRequest('DELETE', url, null, options);
        },

        // 文件上传
        async upload(url, file, additionalData = {}, options = {}) {
            const formData = new FormData();
            formData.append('file', file);

            // 添加额外数据
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            return await makeRequest('POST', url, formData, {
                ...options,
                isFormData: true,
                headers: {
                    ...options.headers,
                    // 让浏览器自动设置Content-Type（包含boundary）
                }
            });
        },

        // 下载文件
        async download(url, params = {}, filename = '') {
            try {
                const response = await this.get(url, params, {
                    headers: {
                        'Accept': '*/*'
                    }
                });

                // 创建Blob
                const blob = new Blob([response.data]);
                const downloadUrl = window.URL.createObjectURL(blob);

                // 创建下载链接
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = filename || `download_${Date.now()}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // 清理URL
                window.URL.revokeObjectURL(downloadUrl);

                return response;
            } catch (error) {
                console.error('Download failed:', error);
                throw error;
            }
        },

        // ===== 拦截器管理 =====
        addRequestInterceptor(interceptor) {
            requestInterceptors.push(interceptor);
        },

        addResponseInterceptor(interceptor) {
            responseInterceptors.push(interceptor);
        },

        addErrorInterceptor(interceptor) {
            errorInterceptors.push(interceptor);
        },

        // ===== 配置管理 =====
        setConfig(newConfig) {
            Object.assign(config, newConfig);
        },

        getConfig() {
            return { ...config };
        },

        setBaseURL(baseURL) {
            config.baseURL = baseURL;
        },

        setDefaultHeaders(headers) {
            Object.assign(config.headers, headers);
        },

        // ===== 便捷错误处理 =====
        handleError(error, showNotification = true) {
            const message = getErrorMessage(error);

            console.error('API Error:', error);

            if (showNotification && window.InnoUtils) {
                window.InnoUtils.Notification.error(message);
            }

            return {
                message,
                status: error.response?.status,
                data: error.response?.data
            };
        },

        // ===== 批量请求 =====
        async all(requests) {
            try {
                return await Promise.all(requests);
            } catch (error) {
                console.error('Batch request failed:', error);
                throw error;
            }
        },

        // ===== 请求取消（使用AbortController） =====
        createCancelToken() {
            return new AbortController();
        },

        // ===== 缓存支持 =====
        cache: new Map(),

        async getCached(url, params = {}, cacheTime = 300000) { // 5分钟缓存
            const cacheKey = `${url}?${new URLSearchParams(params).toString()}`;
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < cacheTime) {
                console.log(`[ApiClient] Cache hit for ${cacheKey}`);
                return cached.data;
            }

            const response = await this.get(url, params);
            this.cache.set(cacheKey, {
                data: response,
                timestamp: Date.now()
            });

            return response;
        },

        clearCache(pattern = null) {
            if (pattern) {
                // 清除匹配模式的缓存
                const regex = new RegExp(pattern);
                Array.from(this.cache.keys()).forEach(key => {
                    if (regex.test(key)) {
                        this.cache.delete(key);
                    }
                });
            } else {
                // 清除所有缓存
                this.cache.clear();
            }
        }
    };

    // ===== 默认拦截器 =====

    // 请求拦截器：添加认证token
    ApiClient.addRequestInterceptor((config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    });

    // 响应拦截器：处理通用响应格式
    ApiClient.addResponseInterceptor((response) => {
        // 如果API返回统一格式，在这里处理
        if (response.data && typeof response.data === 'object' && 'code' in response.data) {
            if (response.data.code !== 200 && response.data.code !== 0) {
                throw new Error(response.data.message || 'API Error');
            }
        }
        return response;
    });

    // 错误拦截器：处理401未授权
    ApiClient.addErrorInterceptor((error) => {
        if (error.response && error.response.status === 401) {
            // 清除token并重定向到登录页
            localStorage.removeItem('auth_token');

            if (window.InnoUtils) {
                window.InnoUtils.Notification.warning('登录已过期，请重新登录');
            }

            // 可以在这里添加重定向逻辑
            // window.location.href = '/login';
        }
        return error;
    });

    return ApiClient;

})();