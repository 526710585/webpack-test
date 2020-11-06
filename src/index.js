(function () {
    // 通用配置
    var host = getUrlParam("isprod") && getUrlParam("isprod") == 1 ? 'https://app.tga.qq.com' : 'https://op.tga.qq.com/test';
    // 提交接口
    var doSmobaReportUserFeedbackUrl = host + '/web/smoba/doSmobaReportUserFeedback';

    //数据上报的url
    const REPORT_URL = 'https://op.tga.qq.com/test' + "/app/tgatv_api/dataReport?appid=10013";
    // const REPORT_URL = "//report.tga.qq.com/app/tgatv_api/dataReport?appid=10013";  


    //6:Android；7:iOS


    class Page {
        constructor() {
            this.queryMsg = this.GetRequest();
            this.loginMsg = this.getLoginMsg();
            this.phoneMsg = this.getPhoneMsg();
            this.isAndroid = (/android/gi).test(navigator.appVersion);
            this.isIOS = (/iphone|ipad/gi).test(navigator.appVersion);
            this.toastTimeID = null;
            this.init();
        }
        init() {
            console.log('客户端参数: ', this.GetRequest());
            //设置标题
            TGAJSMethods.setPageTitle('帮助与反馈');
            this.bindEvents();
            this.setVersion();
            this.setQuestion();
            this.setFeedBack();
            this.dataReport('H5_UserFeedback_PageShow_wzry');
        }
        bindEvents() {
            var self = this;
            $('.close').on('click', function () {
                $('.dialog__wrapper').hide();
            })
            $(document).on('click', '.question-item', function () {
                var dataObj = QUESTION_ARR[$(this).index()];
                self.showDialog(dataObj);
                var index = $(this).index() + 1;
                self.dataReport('H5_FAQQuestionClick_wzry', `|${index}|${dataObj.question}`);
            })
            $(document).on('click', '.type-item', function () {
                $(this).toggleClass('active').siblings().removeClass('active');
            })
            $(document).on('click', '.submit', function () {
                self.clickSubmitBtn();
            })

        }
        GetRequest() {
            var url = location.search; //获取url中"?"符后的字串  
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    if (strs[i].length > 0) {
                        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                    }
                }
            }
            return theRequest;
        }
        showDialog(obj) {

            obj = Object.assign({
                question: '问题详情短文字带图',
                answer: '您可以点击直播画面唤起下方播控栏位，通过右下角的设置按钮，管理礼物特效的显示或隐藏',
                imgUrl: './img/game.png'
            }, obj)

            if (obj.imgUrl.length === 0) {
                $('.dialog__wrapper').removeClass('img-item');
                $('.dialog__wrapper img').hide();
            } else {
                $('.dialog__wrapper').addClass('img-item');
                $('.dialog__wrapper img').attr('src', obj.imgUrl);
                $('.dialog__wrapper img').show();
            }
            $('.dialog__wrapper .question').html(obj.question);
            $('.dialog__wrapper .answer .text').html(obj.answer);
            $('.dialog__wrapper').show();
        }
        setVersion() {
            var version = this.queryMsg.tga_version ? this.queryMsg.tga_version : '';
            $('.tga-version').text(`v${version}`)
        }
        setQuestion() {
            var htmlStr = QUESTION_ARR.reduce((str, item) => {
                return str + `<p class="question-item">${item.question}</p>`;
            }, '')
            $('.question-list').html(htmlStr);
        }
        setFeedBack() {
            // FEED_BACK_LIST
            var htmlStr = FEED_BACK_LIST.reduce((str, item) => {
                return str + `<div class="type-item" data-value="${item.value}">${item.text}</div>`;
            }, '')
            $('.type-list').html(htmlStr)
        }
        getLoginMsg() {
            // var areaid = self.getValue("area");
            // areaid = areaid ? areaid : self.getValue("areaid"); //兼容ios areaid
            // //抢先服的特别适配
            // if (partition == '6011' || partition == '7011') {
            //   areaid = parseInt(partition / 1000);
            // }
            let param =
                "&sig=" +
                this.queryMsg.sig +
                "&timestamp=" +
                this.queryMsg.timestamp +
                "&appid=" +
                this.queryMsg.appid +
                "&openid=" +
                this.queryMsg.openid +
                "&algorithm=" +
                this.queryMsg.algorithm +
                "&version=" +
                this.queryMsg.version +
                "&encode=" +
                this.queryMsg.encode;
            return {
                openid: this.queryMsg.openid,
                platid: '1',
                partition: parseInt(this.queryMsg.partition),
                param: param,
                code: this.queryMsg.msdkEncodeParam,
                sig: this.queryMsg.sig,
                timestamp: parseInt(this.queryMsg.timestamp),
                userid: this.queryMsg.roleid,
                area: this.queryMsg.area ? this.queryMsg.area : this.queryMsg.areaid,
                source: "0", //反馈来源, 0电视台 1视频中心
                pf: this.queryMsg.pf,
                midas_token: this.queryMsg.midas_token,
            }
        }
        getPhoneMsg() {
            //设备信息
            var cellModel = getCellOS(); //获取手机信息
            var model = cellModel && cellModel.model ? cellModel.model : '';
            var os_ver = cellModel && cellModel.os ? cellModel.os : '';
            return {
                GameVersion: '', //游戏app版本 （后续客户端透传，目前传空）
                PluginVersion: this.queryMsg.tga_version, //客户端SDK版本 客户端透传参数tga_version
                MachineCode: '', //机器码 （后续客户端透传，目前传空）
                Model: model, //手机机型
                OSVersion: os_ver, //手机系统版本
                UnityVersion: '', //unity版本 （后续客户端透传，目前传空）
            }
        }
        //post请求
        post(url, data = {}) {
            var self = this;
            var loginData = self.loginMsg;
            var dtEventTime = parseInt(new Date().getTime() / 1000);
            data = Object.assign({
                ...data,
                dtEventTime
            }, loginData);
            return new Promise((resolve, reject) => {
                $.ajax({
                    url,
                    type: 'post',
                    data: JSON.stringify(data),
                    xhrFields: {
                        withCredentials: true // 跨域请求传递cookie
                    },
                    success: function (res) {
                        resolve(res);
                    },
                    error: function (err) {
                        reject(err);
                    }
                })
            })
        }
        //提交按钮
        async clickSubmitBtn() {
            var checkboxDom = $('.type-list').find('.type-item.active');
            var descriptionDom = $('.description-item');
            var contactDom = $('.contact-item');

            const FeedbackType = checkboxDom.data('value');
            const FeedbackContent = checkboxDom.text();
            const FeedbackDetail = descriptionDom.val().trim();
            const ContactAccount = contactDom.val().trim();
            //1.判断空态
            if (checkboxDom.length == 0) {
                this.toast('请选择反馈问题类型');
                return;
            }
            //2.清空
            $('.type-list .type-item').removeClass('active');
            descriptionDom.val('');
            contactDom.val('');
            //3.数据整合
            var data = {
                FeedbackType,
                FeedbackContent,
                FeedbackDetail,
                ContactAccount,
            }
            data = Object.assign(data, this.phoneMsg);
            //4.请求
            var res = await this.post(doSmobaReportUserFeedbackUrl, data);

            if (res.result == 0) {
                this.toast('提交成功~')
            } else {
                this.toast('提交失败~')
            }
        }
        toast(str = '错误提示', ms = 1000) {
            var self = this;
            $('.toast').hide();
            if (self.toastTimeID) {
                clearTimeout(self.toastTimeID)
            };
            $('.toast .toast-text').text(str).parent().show();
            self.toastTimeID = setTimeout(() => {
                $('.toast').hide();
            }, ms)
        }
        //上报
        dataReport(key, value = '') {
            var dataReportUrl = REPORT_URL + '&client_type=12&client_ver=webh5&seq=1&token=8ecb531483801b49a4dfeb021f959786&uid=1321&model=123&os_ver=123&area_id=1';
            var userId = this.loginMsg.userid;
            var ClientType = this.isAndroid ? '6' : this.isIOS ? '7' : '8';
            var partition = this.loginMsg.partition;
            var dataValue = `${userId}|${ClientType}|${'WZRY'}|${partition}|${this.getNowDate()}`;
            dataValue += value;

            $.ajax({
                url: dataReportUrl,
                type: 'POST',
                data: JSON.stringify([{
                    key: key,
                    value: dataValue
                }]),
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (data) {},
                error: function (e) {}
            });
        }
        //获取时间
        getNowDate() {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();

            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();

            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;

            return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        }
    }
    const page = new Page();
})()