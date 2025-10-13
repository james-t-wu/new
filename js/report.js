// report.js - 通用报表脚本文件

$(document).ready(function() {
    // 初始化 AOS 动画
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
    
    // 页面加载完成后隐藏预加载器
    $(window).on('load', function() {
        $('.preloader').fadeOut('slow');
    });

    // 获取页面文件名并提取参数
    function getContentFromFileName() {
        // 获取当前页面的文件名
        var pathname = window.location.pathname;
        var filename = pathname.split('/').pop(); // 获取文件名部分
        var nameWithoutExt = filename.replace('.html', ''); // 去掉扩展名
        
        // 支持多种格式：
        // 1. YYYY-MM 格式 (如: 2024-10)
        // 2. YYYY-MM-XX 格式 (如: 2024-10-en, 2024-10-zh)
        if (/^\d{4}-\d{2}(-\w+)?$/.test(nameWithoutExt)) {
            return nameWithoutExt;
        }
        
        // 如果不符合格式，可以设置默认值或者从其他地方获取
        console.warn('页面文件名不符合预期格式 (YYYY-MM 或 YYYY-MM-XX):', nameWithoutExt);
        return new Date().toISOString().slice(0, 7); // 默认返回当前年月
    }

    // 发送访问记录
    function recordVisit() {
        var content = getContentFromFileName();
        
        var param = {
            content: content
        };
        
        $.ajax({
            type: 'post',
            url: '/user/UserInfo.asmx/ViewReport',
            dataType: 'json',
            data: JSON.stringify(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                console.log('Visit recorded for:', content);
            },
            error: function (jqXHR) {
                console.log('Error recording visit for:', content);
            }
        });
    }

    // 执行访问记录
    recordVisit();

    // 返回顶部按钮功能
    function initBackToTop() {
        let topBtn = document.getElementById("backToTopBtn");
        
        if (!topBtn) {
            console.warn('未找到 backToTopBtn 元素');
            return;
        }

        window.onscroll = function() {
            scrollFunction();
        };

        function scrollFunction() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                topBtn.style.display = "flex";
            } else {
                topBtn.style.display = "none";
            }
        }

        topBtn.addEventListener("click", function(e) {
            e.preventDefault();
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }

    // 初始化返回顶部功能
    initBackToTop();

    // 添加 spinner 样式
    function addSpinnerStyles() {
        // 检查是否已经存在该样式
        if (document.getElementById('spinner-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // 添加 spinner 样式
    addSpinnerStyles();
});

// 如果需要手动指定 content 值的功能（可选）
window.ReportUtils = {
    // 手动记录访问（如果需要覆盖自动检测的值）
    recordVisitManual: function(content) {
        var param = {
            content: content
        };
        
        $.ajax({
            type: 'post',
            url: '/user/UserInfo.asmx/ViewReport',
            dataType: 'json',
            data: JSON.stringify(param),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                console.log('Manual visit recorded for:', content);
            },
            error: function (jqXHR) {
                console.log('Error recording manual visit for:', content);
            }
        });
    },
    
    // 获取当前页面的 content 值
    getCurrentContent: function() {
        var pathname = window.location.pathname;
        var filename = pathname.split('/').pop();
        return filename.replace('.html', '');
    }
};