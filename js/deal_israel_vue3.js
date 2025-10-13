// Vue 3 Implementation for Deal Israel Page
// Integrated with main Vue app

window.DealIsraelApp = {
    // Initialize function called by main Vue app
    init(vueApp) {
        const { ref, reactive, computed, watch, onMounted, nextTick } = Vue;

        // Add reactive state to main Vue app
        Object.assign(vueApp, {
            // Basic state
            currentLang: vueApp.currentLang || 'zh',
            country: 'Israel',
            startTime: '',
            endTime: '',
            category: '',
            fr: '',
            ses: '',
            type: 'inv',
            fundingData: [],
            acquisitionData: [],
            ipoData: [],
            countryCode: [],
            categoryData: [],
            sesData: [],
            frData: ['Angel', 'Convertible Note', 'Corporate Round', 'Debt Financing', 'Equity Crowdfunding', 'Grant', 'Initial Coin Offering', 'Non Equity Assistance', 'Post Ipo Debt',
                'Post Ipo Equity', 'Post Ipo Secondary', 'Private Equity', 'Product Crowdfunding', 'Secondary Market', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'Series E', 'Series F',
                'Series G', 'Series H', 'Series I', 'Undisclosed', 'Venture'],
            page: 1,
            showFlag: false,
            scrollFlag: true,
            minAmount: '',
            maxAmount: '',
            minPrice: '',
            maxPrice: '',
            countryName: 'Israel',
            country_inv: 'Israel',
            country_ma: 'Israel',
            country_ipo: 'Israel',
            countryName_inv: 'Israel',
            countryName_ma: 'Israel',
            countryName_ipo: 'Israel',
            category_inv: '',
            category_ma: '',
            companyName_inv: '',
            companyName_ma: '',
            searchType: 'inv',
            ipoType: 'ses',
            categoryMappingData: [],
            subIndustryData: [],
            subMaIndustryData: [],
            sub_industry: '',
            sub_industry_ma: '',
            showMoreInv: false,
            showMoreMa: false,
            showNeedTrackFlag: false,
            scrollHtml: '<i class="fa fa-spinner fa-spin"></i> Loading more...'
        });

        // Add methods to main Vue app
        Object.assign(vueApp, {
            // Basic methods
            t(key) {
                return vueApp.translations[key] || key;
            },

            toggleLang() {
                vueApp.currentLang = vueApp.currentLang === 'zh' ? 'en' : 'zh';
                localStorage.setItem('inno_lang', vueApp.currentLang);
                window.dispatchEvent(new CustomEvent('inno_lang_change', { detail: vueApp.currentLang }));
                if (window.InnoGlobalMenu) {
                    window.InnoGlobalMenu.switchLanguage(vueApp.currentLang);
                }
            },

            // Deal functionality methods
            goInv() {
                vueApp.page = 1;
                vueApp.fundingData = [];
                vueApp.sub_industry = '';
                vueApp.subIndustryData = [];
                vueApp.minAmount = document.getElementById('min-amount').value;
                vueApp.maxAmount = document.getElementById('max-amount').value;
                vueApp.InitFundingList();
                if (vueApp.category_inv.length > 0) {
                    vueApp.InitSubIndustryFilter();
                }
            },

            goMa() {
                vueApp.page = 1;
                vueApp.minPrice = document.getElementById('min-price').value;
                vueApp.maxPrice = document.getElementById('max-price').value;
                vueApp.acquisitionData = [];
                vueApp.sub_industry_ma = '';
                vueApp.subMaIndustryData = [];
                vueApp.InitAcquisitionList();
                if (vueApp.category_ma.length > 0) {
                    vueApp.InitMaSubIndustryFilter();
                }
            },

            goIPO() {
                vueApp.page = 1;
                vueApp.ipoData = [];
                vueApp.InitIPOList();
            },

            InitFilter() {
                console.log('InitFilter called');
                // Initialize datepickers and selects
                nextTick(() => {
                    this.initializeDatePickers();

                    if (window.$ && window.$.fn.select2) {
                        $(".select2").select2();
                    }
                });
            },

            // Initialize date pickers with default values
            initializeDatePickers() {
                if (window.$ && window.$.fn.datepicker) {
                    // Initialize main tab date pickers
                    $('#start-day').datepicker({
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        endDate: '2025-07-31'
                    }).on('changeDate', function (e) {
                        $('#end-day').datepicker('setStartDate', e.date);
                    });

                    $('#end-day').datepicker({
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        endDate: '2025-07-31'
                    }).on('changeDate', function (e) {
                        $('#start-day').datepicker('setEndDate', e.date);
                    });

                    // Set default dates following the original logic
                    const defaultStartDate = this.startTime || '2025-07-01';
                    const defaultEndDate = this.endTime || '2025-07-31';

                    $('#start-day').datepicker("setDate", defaultStartDate);
                    $('#end-day').datepicker("setDate", defaultEndDate);

                    // Also set the M&A tab date pickers
                    $('#start-day-ma').datepicker({
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        endDate: '2025-07-31'
                    }).on('changeDate', function (e) {
                        $('#end-day-ma').datepicker('setStartDate', e.date);
                    });

                    $('#end-day-ma').datepicker({
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        endDate: '2025-07-31'
                    }).on('changeDate', function (e) {
                        $('#start-day-ma').datepicker('setEndDate', e.date);
                    });

                    // Set default dates for M&A tab
                    $('#start-day-ma').datepicker("setDate", defaultStartDate);
                    $('#end-day-ma').datepicker("setDate", defaultEndDate);

                    // Also set the IPO tab date pickers
                    $('#start-day-ipo').datepicker({
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        endDate: '2025-07-31'
                    }).on('changeDate', function (e) {
                        $('#end-day-ipo').datepicker('setStartDate', e.date);
                    });

                    $('#end-day-ipo').datepicker({
                        format: "yyyy-mm-dd",
                        autoclose: true,
                        endDate: '2025-07-31'
                    }).on('changeDate', function (e) {
                        $('#start-day-ipo').datepicker('setEndDate', e.date);
                    });

                    // Set default dates for IPO tab
                    $('#start-day-ipo').datepicker("setDate", defaultStartDate);
                    $('#end-day-ipo').datepicker("setDate", defaultEndDate);

                    console.log('Date pickers initialized with defaults:', {
                        start: defaultStartDate,
                        end: defaultEndDate
                    });

                    // Verify the date picker values were set
                    setTimeout(() => {
                        const startVal = $('#start-day').val();
                        const endVal = $('#end-day').val();
                        console.log('Date picker values after initialization:', {
                            startVal: startVal,
                            endVal: endVal,
                            startTime: this.startTime,
                            endTime: this.endTime
                        });
                    }, 100);
                }
            },

            // Export methods
            ExportResultInv() {
                if (common.userGroup.toLowerCase() === 'free_user') {
                    $('.alert-warning').show();
                    setTimeout(() => $('.alert-warning').hide(), 3000);
                }
            },

            ExportResultMa() {
                if (common.userGroup.toLowerCase() === 'free_user') {
                    $('.alert-warning').show();
                    setTimeout(() => $('.alert-warning').hide(), 3000);
                }
            },

            ExportResultIPO() {
                if (common.userGroup.toLowerCase() === 'free_user') {
                    $('.alert-warning').show();
                    setTimeout(() => $('.alert-warning').hide(), 3000);
                }
            },

            openAIInvestmentModal(id, name, type, retry) {
                $('#aiInvestmentModal').modal('show');
            },

            // Filter methods
            selectAny() {
                this.sub_industry = '';
            },

            selectMaAny() {
                this.sub_industry_ma = '';
            },

            selectFilter(event, item) {
                this.sub_industry = item;
            },

            selectMaFilter(event, item) {
                this.sub_industry_ma = item;
            },

            SeeMore() {
                this.showMoreInv = !this.showMoreInv;
            },

            SeeMoreMa() {
                this.showMoreMa = !this.showMoreMa;
            }
        });

        // Initialize on mounted
        onMounted(() => {
            vueApp.InitFilter();
        });
    }
};