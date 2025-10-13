Vue.filter("link", function (value, type) {
    if (value) {
        if (type === 'Person') {
            return "person_israel.html?pId=" + value;
        } else {
            return "company_profile_israel.html?cId=" + value;
        }
    }
    return 'javascript:;'
})

var vm = new Vue({
    el: "#deal_israel",
    data: {
        country: 'Israel',
        startTime: common.getUrlParam('sd') ? common.getUrlParam('sd') : '',
        endTime: common.getUrlParam('ed') ? common.getUrlParam('ed') : '',
        category: common.getUrlParam('industry') ? common.getUrlParam('industry') : '',
        fr: common.getUrlParam('fr') ? common.getUrlParam('fr') : '',
        ses: common.getUrlParam('ses') ? common.getUrlParam('ses') : '',
        type: common.getUrlParam('type') ? common.getUrlParam('type') : 'inv',
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
        sub_industry: '',
        subMaIndustryData: [],
        sub_industry_ma: '',
        showNeedTrackFlag: false,
        scrollHtml: '<i class="fa fa-spinner fa-spin"></i> Loading more...'
    },
    created: function () {
        if (common.userGroup.toLowerCase() == 'admin') {
            this.showNeedTrackFlag = true;
        }
        var _self = this;
        if (_self.country == 'Greater China') {
            _self.country = ['China', 'Hong Kong, China', 'Taiwan, Province of China'];
            _self.countryName = 'China;Hong Kong;Taiwan';
        }
        else if (_self.country == 'Taiwan') {
            _self.country = 'Taiwan, Province of China';
            _self.countryName = 'Taiwan';
        }
        else if (_self.country == 'Hong Kong') {
            _self.country = 'Hong Kong, China';
            _self.countryName = 'Hong Kong';
        }
        else {
            _self.countryName = _self.country;
        }
        if (_self.type == 'inv') {
            _self.country_inv = _self.country;
            _self.countryName_inv = _self.countryName;
            _self.category_inv = _self.category;
        }
        if (_self.type == 'ma') {
            _self.country_ma = _self.country;
            _self.countryName_ma = _self.countryName;
            _self.category_ma = _self.category;
        }

        $.getJSON("/data/event_category.json?timestamp=2018030601", function (json) {
            _self.categoryData = json;
            _self.$nextTick(function () {
                $("#inv #sel_category").select2({ containerCssClass: "notranslate", dropdownCssClass: "notranslate" });
                $("#inv #sel_category").on('change', function () {
                    _self.category_inv = $(this).val();
                });
                $("#ma #sel_category").select2({ containerCssClass: "notranslate", dropdownCssClass: "notranslate" });
                $("#ma #sel_category").on('change', function () {
                    _self.category_ma = $(this).val();
                });
            })
        })

        $.getJSON("/data/1.json", function (json) {
            $.each(json.data.items, function (index, item) {
                _self.categoryMappingData.push(item);
            });
        })
        $.getJSON("/data/2.json", function (json) {
            $.each(json.data.items, function (index, item) {
                _self.categoryMappingData.push(item);
            });
        })
        $.getJSON("/data/3.json", function (json) {
            $.each(json.data.items, function (index, item) {
                _self.categoryMappingData.push(item);
            });
        })

        $.getJSON("/data/stock_exchange_symbol.json", function (json) {
            $.each(json.sort(), function (index, item) {
                _self.sesData.push(item.toUpperCase());
            })
            _self.$nextTick(function () {
                $("#ipo #sel_ses").select2({ containerCssClass: "notranslate", dropdownCssClass: "notranslate" });
                $("#ipo #sel_ses").on('change', function () {
                    _self.ses = $(this).val().toLowerCase();
                });

                $("#ipo #sel_ipoType").select2({ minimumResultsForSearch: -1, containerCssClass: "notranslate", dropdownCssClass: "notranslate" });
                $("#ipo #sel_ipoType").on('change', function () {
                    _self.ipoType = $(this).val();
                    if (_self.ipoType == 'ses') {
                        _self.country_ipo = '';
                        _self.countryName_ipo = '';
                        $("#ipo #sel_region").val('').select2({ containerCssClass: "notranslate", dropdownCssClass: "notranslate" });
                    }
                    if (_self.ipoType == 'country') {
                        _self.ses = '';
                        $("#ipo #sel_ses").val('').select2({ containerCssClass: "notranslate", dropdownCssClass: "notranslate" });
                    }
                });
            })
        });

        $('#start-day').datepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            endDate: '2025-07-31',
            beforeShowDay: function (input, inst) {
                return { classes: 'notranslate' };
            },
            beforeShowMonth: function (date) {
                return { classes: 'notranslate' };
            },
            beforeShowYear: function (date) {
                return { classes: 'notranslate' };
            }
        }).on('changeDate', function (e) {
            $('#end-day').datepicker('setStartDate', e.date);
        });
        $('#end-day').datepicker({
            format: "yyyy-mm-dd",
            autoclose: true,
            endDate: '2025-07-31',
            beforeShowDay: function (input, inst) {
                return { classes: 'notranslate' };
            },
            beforeShowMonth: function (date) {
                return { classes: 'notranslate' };
            },
            beforeShowYear: function (date) {
                return { classes: 'notranslate' };
            }
        }).on('changeDate', function (e) {
            $('#start-day').datepicker('setEndDate', e.date);
        });

        var startDate = new Date();
        var endDate = new Date();
        startDate = new Date(startDate.setDate(startDate.getDate() - 30));
        $('#start-day').datepicker("setDate", '2025-07-01');
        $('#end-day').datepicker("setDate", '2025-07-31');
        if (_self.startTime.length > 0) {
            $('#start-day').datepicker("setDate", _self.startTime);
        }
        if (_self.endTime.length > 0) {
            $('#end-day').datepicker("setDate", _self.endTime);
        }
        $("#inv #sel_fr").select2({ containerCssClass: "notranslate", dropdownCssClass: "notranslate" });
        $("#inv #sel_fr").on('change', function () {
            _self.fr = $(this).val();
        });
    },
    ready: function () {
        $('body').animate({ scrollTop: 0 }, 500);
        this.InitFilter();
        window.addEventListener('scroll', this.scrollFun);
    },
    watch: {
        companyName_inv: function (val) {
            this.companyName_inv = $.trim(val);
        },
        companyName_ma: function (val) {
            this.companyName_ma = val;
        }
    },
    methods: {
        InitFilter: function () {
            var _self = this;
            $('ul.nav a').on('shown.bs.tab', function (e) {
                if (e.target.hash == '#inv') {
                    _self.searchType = 'inv';
                    _self.page = 1;
                    _self.fundingData = [];
                    _self.sub_industry = '';
                    $('#inv .see-more').html(_self.scrollHtml);
                    _self.InitFundingList();
                }
                if (e.target.hash == '#ma') {
                    _self.searchType = 'ma';
                    _self.page = 1;
                    _self.acquisitionData = [];
                    $('#ma .see-more').html(_self.scrollHtml);
                    _self.InitAcquisitionList();
                }
                if (e.target.hash == '#ipo') {
                    _self.searchType = 'ipo';
                    _self.page = 1;
                    _self.acquisitionData = [];
                    $('#ipo .see-more').html(_self.scrollHtml);
                    _self.InitIPOList();
                }
            });
            if (_self.type == 'inv') {
                _self.searchType = 'inv';
                _self.page = 1;
                _self.fundingData = [];
                _self.sub_industry = '';
                $('#inv .see-more').html(_self.scrollHtml);
                _self.InitFundingList();
            }
            if (_self.type == 'ma') {
                $('ul.nav a[href="#ma"]').tab('show');
            }
            if (_self.type == 'ipo') {
                $('ul.nav a[href="#ipo"]').tab('show');
            }
        },
        selectAny: function (e) {
            $(e.target).closest('.filter-group-content').find('.active-select').removeClass('active-select');
            $(e.target).closest('.filter-group-content').find('.btn-any').addClass('btn-any-select');
            this.sub_industry = '';
            this.page = 1;
            $('#inv .see-more').html(this.scrollHtml);
            this.fundingData = [];
            this.InitFundingList();
        },
        selectFilter: function (e, value) {
            $(e.target).closest('.filter-group-content').find('.active-select').removeClass('active-select');
            $(e.target).closest('.filter-group-content').find('.btn-any').removeClass('btn-any-select');
            $(e.target).addClass('active-select');
            this.sub_industry = value;
            this.page = 1;
            $('#inv .see-more').html(this.scrollHtml);
            this.fundingData = [];
            this.InitFundingList();
        },
        SeeMore: function () {
            if ($('#inv .show-more i').hasClass('fa-caret-up')) {
                $('#inv .show-more i').removeClass('fa-caret-up').addClass('fa-caret-down');
                $('#inv .filter-group-content').find('.filter-content').addClass('limit-one-row');
            }
            else if ($('#inv .show-more i').hasClass('fa-caret-down')) {
                $('#inv .show-more i').removeClass('fa-caret-down').addClass('fa-caret-up');
                $('#inv .filter-group-content').find('.filter-content').removeClass('limit-one-row');
            }
        },
        selectMaAny: function (e) {
            $(e.target).closest('.filter-group-content').find('.active-select').removeClass('active-select');
            $(e.target).closest('.filter-group-content').find('.btn-any').addClass('btn-any-select');
            this.sub_industry_ma = '';
            this.page = 1;
            $('#ma .see-more').html(this.scrollHtml);
            this.acquisitionData = [];
            this.InitAcquisitionList();
        },
        selectMaFilter: function (e, value) {
            $(e.target).closest('.filter-group-content').find('.active-select').removeClass('active-select');
            $(e.target).closest('.filter-group-content').find('.btn-any').removeClass('btn-any-select');
            $(e.target).addClass('active-select');
            this.sub_industry_ma = value;
            this.page = 1;
            $('#ma .see-more').html(this.scrollHtml);
            this.acquisitionData = [];
            this.InitAcquisitionList();
        },
        SeeMoreMa: function () {
            if ($('#ma .show-more i').hasClass('fa-caret-up')) {
                $('#ma .show-more i').removeClass('fa-caret-up').addClass('fa-caret-down');
                $('#ma .filter-group-content').find('.filter-content').addClass('limit-one-row');
            }
            else if ($('#ma .show-more i').hasClass('fa-caret-down')) {
                $('#ma .show-more i').removeClass('fa-caret-down').addClass('fa-caret-up');
                $('#ma .filter-group-content').find('.filter-content').removeClass('limit-one-row');
            }
        },
        InitFundingList: function () {
            var _self = this;
            _self.startTime = $('#start-day').val();
            _self.endTime = $('#end-day').val();
            var url = common.APIDomain + "/api/Funding/Search?page=" + _self.page + "&pageSize=20&sd=" + _self.startTime + "&ed=" + _self.endTime + "&country=" + _self.countryName_inv + "&industry=" + _self.category_inv + "&fr=" + _self.fr + "&sub_industry=" + _self.sub_industry + "&company=" + _self.companyName_inv;
            if (_self.minAmount) {
                url += "&amount_min=" + _self.minAmount;
            }
            if (_self.maxAmount) {
                url += "&amount_max=" + _self.maxAmount;
            }
            _self.showFlag = true;
            _self.scrollFlag = false;
            _self.$http.get(url).then(
                function (response) {
                    if (response.body.ReturnCode === 0) {
                        if (response.body.Data) {
                            $.each(response.body.Data.data, function (index, item) {
                                var investorArr = [];
                                item.URL = 'javascript:;';
                                if (item.source == 'cb') {
                                    item.URL = "company_profile_israel.html?cId=" + item.company_id;
                                    item.detailURL = "funding_round_details_israel.html?id=" + item._id;
                                    $.each(item.investors, function (index, item) {
                                        investorArr.push(item.name);
                                    });
                                }
                                if (item.source == 'kr') {
                                    item.URL = "startup_israel.html?id=" + item.company_id;
                                    item.detailURL = "startup_funding_details.html?id=" + item.company_id + "&round=" + base64.encode(item.funding_round) + "&time=" + base64.encode(item.announced_on);
                                    $.each(item.investors, function (index, item) {
                                        investorArr.push(item);
                                    });
                                }
                                item.industryStr = item.industry.join(', ');
                                item.investorStr = investorArr.join(', ');
                                item.money_raised_accurate = (item.money_raised == null || item.money_raised == '') ? '0' : item.money_raised;
                                item.money_raised = (item.money_raised == null || item.money_raised == '') ? '—' : '$' + common.nFormatter(item.money_raised, 2);
                                item.country = item.country.replace('Taiwan', 'Taiwan, Province of China').replace('Hong Kong', 'Hong Kong, China');
                                _self.fundingData.push(item);
                            })

                            _self.scrollFlag = true;
                            if (_self.page == response.body.Data.total_pages) {
                                _self.scrollFlag = false;
                                $('#inv .see-more span').text('-- The End --');
                            }
                        }
                    }

                    _self.showFlag = false;
                    if (_self.page === 1) {
                        common.hideMask();
                    }
                },
                function (response) {
                    _self.showFlag = false;
                    if (_self.page === 1) {
                        common.hideMask();
                    }
                });
        },
        InitAcquisitionList: function () {
            var _self = this;
            _self.startTime = $('#start-day').val();
            _self.endTime = $('#end-day').val();
            var url = common.APIDomain + "/api/Acquisition/SearchOpen?page=" + _self.page + "&pageSize=20&sd=" + _self.startTime + "&ed=" + _self.endTime + "&country=" + _self.countryName_ma + "&industry=" + _self.category_ma + "&sub_industry=" + _self.sub_industry_ma + "&company=" + _self.companyName_ma;
            if (_self.minPrice) {
                url += "&amount_min=" + _self.minPrice;
            }
            if (_self.maxPrice) {
                url += "&amount_max=" + _self.maxPrice;
            }
            _self.showFlag = true;
            _self.scrollFlag = false;
            _self.$http.get(url).then(
                function (response) {
                    if (response.body.ReturnCode === 0) {
                        if (response.body.Data) {
                            $.each(response.body.Data.data, function (index, item) {
                                item.industryStr = item.acquiree_industry.join(', ');
                                item.price_accurate = (item.price == null || item.price == '') ? '0' : item.price;
                                item.price = (item.price == null || item.price == '') ? '—' : '$' + common.nFormatter(item.price, 2);
                                _self.acquisitionData.push(item);
                            })

                            _self.scrollFlag = true;
                            if (_self.page == response.body.Data.total_pages) {
                                _self.scrollFlag = false;
                                $('#ma .see-more span').text('-- The End --');
                            }
                        }
                    }
                    _self.showFlag = false;
                    if (_self.page === 1) {
                        common.hideMask();
                    }
                },
                function (response) {
                    _self.showFlag = false;
                    if (_self.page === 1) {
                        common.hideMask();
                    }
                });
        },
        InitIPOList: function () {
            var _self = this;
            _self.startTime = $('#start-day').val();
            _self.endTime = $('#end-day').val();
            var url = common.APIDomain + "/api/IPO/SearchOpen?page=" + _self.page + "&pageSize=20&sd=" + _self.startTime + "&ed=" + _self.endTime + "&ses=" + _self.ses + "&country=" + _self.countryName_ipo;
            _self.showFlag = true;
            _self.scrollFlag = false;
            _self.$http.get(url).then(
                function (response) {
                    if (response.body.ReturnCode === 0) {
                        if (response.body.Data) {
                            $.each(response.body.Data.data, function (index, item) {
                                item.Price_accurate = (item.properties.money_raised_usd == null) ? '0' : item.properties.money_raised_usd;
                                item.Price = (item.properties.money_raised_usd == null) ? '—' : '$' + common.nFormatter(item.properties.money_raised_usd);
                                _self.ipoData.push(item);
                            })

                            _self.scrollFlag = true;
                            if (_self.page == response.body.Data.total_pages) {
                                _self.scrollFlag = false;
                                $('#ipo .see-more span').text('-- The End --');
                            }
                        }
                    }
                    _self.showFlag = false;
                    if (_self.page === 1) {
                        common.hideMask();
                    }
                },
                function (response) {
                    _self.showFlag = false;
                    if (_self.page === 1) {
                        common.hideMask();
                    }
                });
        },
        InitSubIndustryFilter: function () {
            var _self = this;
            _self.sub_industry = '';
            _self.subIndustryData = [];
            $('#inv .filter-group-content').find('.active-select').removeClass('active-select');
            $('#inv .filter-group-content').find('.btn-any').addClass('btn-any-select');
            $('#inv .show-more i').removeClass('fa-caret-up').addClass('fa-caret-down');
            $('#inv .filter-group-content').find('.filter-content').addClass('limit-one-row');
            $.each(_self.categoryMappingData, function (index, item) {
                if ($.inArray(_self.category_inv, item.properties.category_groups) > -1) {
                    _self.subIndustryData.push(item.properties.name);
                }
            });
        },
        InitMaSubIndustryFilter: function () {
            var _self = this;
            _self.sub_industry_ma = '';
            _self.subMaIndustryData = [];
            $('#ma .filter-group-content').find('.active-select').removeClass('active-select');
            $('#ma .filter-group-content').find('.btn-any').addClass('btn-any-select');
            $('#ma .show-more i').removeClass('fa-caret-up').addClass('fa-caret-down');
            $('#ma .filter-group-content').find('.filter-content').addClass('limit-one-row');
            $.each(_self.categoryMappingData, function (index, item) {
                if ($.inArray(_self.category_ma, item.properties.category_groups) > -1) {
                    _self.subMaIndustryData.push(item.properties.name);
                }
            });
        },
        goInv: function () {
            this.page = 1;
            $('#inv .see-more').html(this.scrollHtml);
            this.minAmount = $('#inv #min-amount').val();
            this.maxAmount = $('#inv #max-amount').val();
            this.fundingData = [];
            this.sub_industry = '';
            this.subIndustryData = [];
            this.InitFundingList();
            if (this.category_inv.length > 0) {
                this.InitSubIndustryFilter();
            }
        },
        goMa: function () {
            this.page = 1;
            $('#ma .see-more').html(this.scrollHtml);
            this.minPrice = $('#ma #min-price').val();
            this.maxPrice = $('#ma #max-price').val();
            this.acquisitionData = [];
            this.sub_industry_ma = '';
            this.subMaIndustryData = [];
            this.InitAcquisitionList();
            if (this.category_ma.length > 0) {
                this.InitMaSubIndustryFilter();
            }
        },
        goIPO: function () {
            this.page = 1;
            $('#ipo .see-more').html(this.scrollHtml);
            this.ipoData = [];
            this.InitIPOList();
        },
        ExportResultInv: function () {
            if (common.userGroup.toLowerCase() == 'free_user' || common.userGroup.toLowerCase() == 'rm' || common.userGroup.toLowerCase() == 'ry') {
                $('.discover-alert').slideToggle(1000);
                setTimeout("$('.discover-alert').slideToggle(1000)", 6000);
            }
            else {
                var _self = this;
                if (_self.fundingData.length > 0) {
                    var exportData = [];
                    $.each(_self.fundingData, function (index, item) {
                        var newItem = {};
                        newItem.Name = item.company_name;
                        newItem.FundingStatus = item.funding_round;
                        newItem.Industry = item.industryStr;
                        newItem.Investors = item.investorStr;
                        newItem.MoneyRaised = parseFloat(item.money_raised_accurate);
                        newItem.Date = item.announced_on;
                        newItem.Region = item.country;
                        if (common.userGroup.toLowerCase() == 'admin') {
                            newItem.CompanyID = item._id;
                            newItem.CompanyURL = "https://ai.innonation.io/new/" + item.URL;
                            newItem.FundingRoundURL = "https://ai.innonation.io/new/" + item.detailURL;
                        }
                        exportData.push(newItem);
                    });
                    ExportExcel(exportData, "Investment_Search_Result.xlsx");
                }
            }
        },
        ExportResultMa: function () {
            if (common.userGroup.toLowerCase() == 'free_user' || common.userGroup.toLowerCase() == 'rm' || common.userGroup.toLowerCase() == 'ry') {
                $('.discover-alert').slideToggle(1000);
                setTimeout("$('.discover-alert').slideToggle(1000)", 6000);
            }
            else {
                var _self = this;
                if (_self.acquisitionData.length > 0) {
                    var exportData = [];
                    $.each(_self.acquisitionData, function (index, item) {
                        var newItem = {};
                        newItem.Acquired_Organization = item.acquiree_name;
                        newItem.Acquiring_Organization = item.acquirer_name;
                        newItem.Industry = item.industryStr;
                        newItem.Pricing_$ = item.price_accurate;
                        newItem.Date = item.announced_on;
                        newItem.Region = item.acquiree_country;
                        if (common.userGroup.toLowerCase() == 'admin') {
                            newItem.AcquiredOrgURL = "https://ai.innonation.io/new/company_profile_israel.html?cId=" + item.acquiree_id;
                            newItem.AcquiringOrgURL = "https://ai.innonation.io/new/company_profile_israel.html?cId=" + item.acquirer_id;
                            newItem.AcquisitionDetailURL = "https://ai.innonation.io/new/acquisition_details_israel.html?id=" + item._id;
                        }
                        exportData.push(newItem);
                    });
                    ExportExcel(exportData, "Acquisition_Search_Result.xlsx");
                }
            }
        },
        ExportResultIPO: function () {
            if (common.userGroup.toLowerCase() == 'free_user' || common.userGroup.toLowerCase() == 'rm' || common.userGroup.toLowerCase() == 'ry') {
                $('.discover-alert').slideToggle(1000);
                setTimeout("$('.discover-alert').slideToggle(1000)", 6000);
            }
            else {
                var _self = this;
                if (_self.ipoData.length > 0) {
                    var exportData = [];
                    $.each(_self.ipoData, function (index, item) {
                        var newItem = {};
                        newItem.Company_Name = item.relationships.funded_company.item.properties.name;
                        newItem.Stock_Exchange = item.properties.stock_exchange_symbol;
                        newItem.Stock_Symbol = item.properties.stock_symbol;
                        newItem.MoneyRaised_$ = item.Price_accurate;
                        newItem.IPO_Date = item.properties.went_public_on;
                        exportData.push(newItem);
                    });
                    ExportExcel(exportData, "IPO_Search_Result.xlsx");
                }
            }
        },
        openAIInvestmentModal: function (id, name, type, retry) {
            var _self = this;
            $('#aiInvestmentModal .overlay').show();
            $('#aiInvestmentModal').modal('show');
            $('#aiInvestmentModal .modal-body').hide();
            $('#aiInvestmentAnswerCN').empty();
            $('#aiInvestmentAnswerEN').empty();
            $('#UnsatisfactoryEN').hide();
            $('#UnsatisfactoryCN').hide();

            try {
                var url = common.APIDomain + "/api/AI/SimpleAnalysisInvMaNews?id=" + id + "&name=" + encodeURIComponent(name) + "&type=" + type + "&retry=" + retry;
                _self.$http.get(url).then(
                    function (response) {
                        if (response.body.ReturnCode === 0) {
                            if (response.body.Data) {
                                var obj = response.body.Data;
                                $('#aiInvestmentAnswerCN').html(obj.analysis_summary_cn.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'));
                                $('#aiInvestmentAnswerEN').html(obj.analysis_summary_en.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'));
                                $('#UnsatisfactoryEN').show();
                                $('#UnsatisfactoryCN').show();

                                _self.bindUnsatisfactoryRetryEvent(id, name, type, 'retry');

                                $('#aiInvestmentModal .overlay').hide();
                                $('#aiInvestmentModal .modal-body').show();

                            }
                        }
                        else {
                            $('#aiInvestmentAnswerCN').html("出现了一些问题，请<a href='javascript:;' class='retry'>点击重试</a>。");
                            $('#aiInvestmentAnswerEN').html("An error occur, please <a href='javascript:; ' class='retry'>click retry</a>.");
                            $('#UnsatisfactoryEN').hide();
                            $('#UnsatisfactoryCN').hide();

                            _self.bindRetryEvent(id, name, type, '');
                        }
                        $('#aiInvestmentModal .overlay').hide();
                        $('#aiInvestmentModal .modal-body').show();
                    },
                    function (response) {
                        $('#aiInvestmentModal .overlay').hide();
                        if (response.status == 0) {
                            $('#aiInvestmentAnswerCN').html("出现了一些问题，请<a href='javascript:;' class='retry'>点击重试</a>。");
                            $('#aiInvestmentAnswerEN').html("An error occur, please <a href='javascript:; ' class='retry'>click retry</a>.");
                            $('#UnsatisfactoryEN').hide();
                            $('#UnsatisfactoryCN').hide();

                            _self.bindRetryEvent(id, name, type, '');
                        }
                    });
            }
            catch (error) {
                console.log(error)
                $('#aiInvestmentAnswerCN').html("出现了一些问题，请<a href='javascript:;' class='retry'>点击重试</a>。");
                $('#aiInvestmentAnswerEN').html("An error occur, please <a href='javascript:; ' class='retry'>click retry</a>.");
                $('#UnsatisfactoryEN').hide();
                $('#UnsatisfactoryCN').hide();

                _self.bindRetryEvent(id, name, type, '');
            }
            return false;
        },
        bindRetryEvent: function (id, name, type, retry) {
            var _self = this;
            $(document).off('click', 'a.retry').on('click', 'a.retry', function (event) {
                event.preventDefault();
                _self.openAIInvestmentModal(id, name, type, retry);
            });
        },
        bindUnsatisfactoryRetryEvent: function (id, name, type, retry) {
            var _self = this;
            $(document).off('click', 'button.btn-custom').on('click', 'button.btn-custom', function (event) {
                event.preventDefault();
                if (common.userGroup.toLowerCase() != 'admin') {
                    $('.warning-unsatisfactory').show();
                }
                else {
                    $('.warning-unsatisfactory').hide();
                    _self.openAIInvestmentModal(id, name, type, retry);
                }
            });
        },
        scrollFun: function () {
            var winH = $(window).height();
            var pageH = $(document).height();
            var scrollT = $(window).scrollTop();
            var resultH = (pageH - winH - scrollT) / winH;
            if (resultH < 0.02) {
                if (this.scrollFlag) {
                    this.page++;
                    if (this.searchType == 'inv') {
                        this.InitFundingList();
                    }
                    if (this.searchType == 'ma') {
                        this.InitAcquisitionList();
                    }
                    if (this.searchType == 'ipo') {
                        this.InitIPOList();
                    }
                }
            }
        }
    }
})