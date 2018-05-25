/**
 * Created by WFY2016 on 2017/10/19.
 */

/*
* 以下关于辅助性操作的字段、
* 涉及到 支付 保存单据等字段 在 pay.js
* */
var pageName;//页面名 msa020_1200--入库单
var storedm = '';//门店代码
var storewldm = '';//门店 往来代码
var storearr = [];
var storewldmarr = [];//往来
var guidedm,beginTime,endTime,machinedm,machine;
var guidearr = [];
var timearr = [];
var store_rest = [];//门店结果集
var guide_rest = [];//导购结果集

localStorage.timearr = [];
$(function () {
    wfy.tap('#slideups',function (that) {
        var dm = $(that).attr('data-win');
        if(dm == 'up'){
            $('#slideups').attr('data-win','down').children('i').html('&#xe6a6');
            $('.pay_style').removeClass('pos_slideup').addClass('pos_slidedown');
        }
        if(dm == 'down'){
            $('#slideups').attr('data-win','up').children('i').html('&#xe6a5');
            $('.pay_style').removeClass('pos_slidedown').addClass('pos_slideup');
        }
    })
    pageinit(function (obj) {
        pageName = obj.page;
        if(pageName == 'msa030_0800'){//销售开单
            $('#pagename').html('销售开单');
            $('#pay_head,#pay_style').hide();
            $('.js_createMoney,.js_createZK').addClass('none');
            $('#pub_bottom_btn').html(botBtnHtml);
        }
        if(pageName == 'msa030_0100'){//销售收银
            $('#pagename').html('销售收银');
            $('.js_createMoney').addClass('none');
            $('#pub_bottom_btn').html(botBtnHtml);
        }
        if(pageName == 'msa030_0200'){
            $('#pagename').html('收款');
            $('.js_hidebill,.js_createZK,.js_createLX').addClass('none');
            $('#pub_bottom_btn').html(botBtnHtml_coll);
        }
    })
    getPosStore(function (res) {
        store_rest = res;
        if(store_rest.length == 0){
            wfy.alert('门店获取失败！页面信息不全~')
        }
        //将门店结果 处理成 数组
        for(var i=0;i<res.length;i++){
            storearr.push(res[i].kcckmc);
            storewldmarr.push(res[i].xtwldm);
        }
        $("#createStore").val(res[0].kcckmc);
        storewldm = res[0].xtwldm;
        storedm = res[0].kcckdm;
        localStorage.storedm = storedm;
        localStorage.storewldm = storewldm;
        //依据门店获取门店下的导购
        getGuide(localStorage.storedm,function (ress) {
            guide_rest = ress;
            for(var i=0;i<ress.length;i++){
                guidearr.push(ress[i].xtyhxm);
            }
            if(guidearr.val_in_array(localStorage.czry)){
                var ind = guidearr.indexOf(localStorage.czry);
                guidedm = ress[ind].xtyhdm;
                $("#createGuide").val(localStorage.czry);
            }else {
                guidedm = ress[0].xtyhdm;
                $("#createGuide").val(ress[0].xtyhxm);
            }

        });
        // 获取日期
        getHandDate(localStorage.storedm,function (res) {
            console.log(res)
            $('#createDate').val(res[0].kcczrq);
            beginTime = res[0].zxczrq;
            endTime = res[0].zdczrq;
            localStorage.beginTime =beginTime;
            localStorage.endTime =endTime;
            timearr = wfy.getAllDay(localStorage.beginTime,localStorage.endTime);
            localStorage.timearr = timearr;
        })
        //隐藏操作 获取生成单号 和 每个店面一个pos机。获取pos机的 编码
        getorder("SA",function (d) {
            preno = d;
            operNo = d[0].operid;
            noteNo = d[0].orderid;
        })
        getMachine(localStorage.storedm,function (res) {
            machine = res[0].kcpsmc;
            machinedm = res[0].kcpsdm;
        })
        //点击 门店
        $("#createStore").picker({
            title: "请选择仓/店",
            cols: [
                {
                    textAlign: 'center',
                    values:storearr
                }
            ],
            onChange:function (p) {
                var vue = p.value[0];
                for(var i = 0; i<store_rest.length; i++){
                    if(vue == store_rest[i].kcckmc){
                        storedm = store_rest[i].kcckdm;
                        storewldm = store_rest[i].xtwldm;
                        localStorage.storedm = storedm;
                        localStorage.storewldm = storewldm;
                    }
                }
            }
        });
        //点击 导购店员
        $("#createGuide").picker({
            title: "请选择店员",
            cols: [
                {
                    textAlign: 'center',
                    values:guidearr
                }
            ],
            onChange:function (p) {
                var vue = p.value[0];
                for(var i = 0; i<guide_rest.length; i++){
                    if(vue == guide_rest[i].xtyhxm){
                        guidedm = guide_rest[i].xtyhdm;
                    }
                }
                console.log(guidedm)
            }
        });
        //点击时间
        wfy.tap('#createDate',function () {
            //收款 不选时间！！！！
            if(pageName =='msa030_0100' || pageName =='msa030_0800' ){
                $("#createDate").picker({
                    title: "请选择有效时间",
                    cols: [
                        {
                            textAlign: 'center',
                            values:localStorage.timearr.split(',')
                        }
                    ],
                    onChange:function (p) {}
                });
            }
        })
    })

    //客户
    wfy.tap('#createKehu',function (that) {
        getKHList('');
        document.documentElement.style.overflow = "hidden";
        $('#kehu').removeClass('y100');
    })
    //选择客户 取消
    wfy.tap('#kehu_can',function () {
        $('#kehu').addClass('y100');
        document.documentElement.style.overflow = "scroll";
    })
    //选中客户
    $('body').hammer().on('tap','.al_kehu',function (event) {
        event.stopPropagation();
        hykh = $(this).attr('data-hykh');
        var hymc = $(this).find('em').html();
        kyed = Number($(this).attr('data-kyed'));
        $('#createKehu').val(hymc).attr('data-hykh',hykh);

        $('#dtl_createKehu').val(hymc).attr('data-hykh',hykh);//用于未接订单详情
        $('#sub_save').removeClass('cabsdot_bosdt');//用于未接订单详情

        if(pageName =='msa030_0100' || pageName =='msa030_0800' ){
            $('#pay_style li[data-type="fukuan"]').find('.billInput').val('');
            $('#pay_style li[data-type="fukuan"]').removeClass('none');//选中客户的时候，预付款方式出现
            $('#pay_style li[data-type="fukuan"]').removeClass('poschecked');//如果之前选了预付款，切换用户 清除选择
            $('#pay_style li').eq(1).find('i').html('可用：'+kyed);
        }
        ishykh = true;
        document.documentElement.style.overflow = "scroll";
        $('#kehu').addClass('y100');
        $('.kehudel').removeClass('none');
    })
    //清除客户
    $('body').hammer().on('tap','.kehudel',function (event) {
        event.stopPropagation();
        hykh = '';
        ishykh = false;
        $('#createKehu').val('').attr('data-hykh','');
        $(this).addClass('none');
        $('#pay_style li[data-type="fukuan"]').addClass('none');//清除客户的时候，预付款方式消失
    })
    // 监测 输入框
    $("#search").on('keypress',function(e) {
        var keycode = e.keyCode;
        var searchName = $(this).val();
        if(keycode=='13') {
            e.preventDefault();
            //请求搜索接口
            getKHList(searchName);
        }
    });
    //点击选择 支付方式(当以预付款方式为主要支付方式的时候，需要验证 额度和商品金额)
    $('body').hammer().on('tap','#pay_style li .pay_inputandicon',function (event) {
        event.stopPropagation();
        var paytype = $(this).parent().attr('data-type');
        var je = Number($('#totalMoney').html());
        if(pageName == "msa030_0100" || pageName =="msa030_0900"){
            if(paytype == "tencent" || paytype == "ali" || paytype=="card"){
                var li_val = $(this).find('.billInput').val();
                $('#pay_style li:gt(1)').children('.pay_inputandicon').removeClass('poschecked').find('.billInput').val("");
                $('#pay_style li:gt(1)').removeClass('poschecked');
                $(this).find('.billInput').val(li_val);
                $(this).addClass('poschecked');
                $(this).parent('li').addClass('poschecked');
            }else {
                $(this).addClass('poschecked');
                $(this).parent('li').addClass('poschecked');
            }
        }
        if(pageName == "msa030_0200"){
            $('#pay_style li .pay_inputandicon').removeClass('poschecked');
            $('#pay_style li').removeClass('poschecked');
            $('#pay_style li .bill_radio').removeClass('bill_radio_ch');
            $(this).addClass('poschecked');
            $(this).parent('li').addClass('poschecked');
            $(this).siblings().addClass('bill_radio_ch');
        }
    })
    //机具 优化
    //依据 android端$(window).height()会改变 判断键盘
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    // $(window).on('resize', function () {
    //     var nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //     if (clientHeight > nowClientHeight) {
    //         //键盘弹出的事件处理
    //         $('#pay_style').css({
    //             'padding-bottom':'200px'
    //         })
    //         setTimeout(function () {
    //             var h = document.body.scrollHeight
    //             console.log(h)
    //             $(window).scrollTop(h);
    //         },50)
    //     }
    //     else {
    //         //键盘收起的事件处理
    //         $('#pay_style').css({
    //             'padding-bottom':'30px'
    //         })
    //         setTimeout(function () {
    //             var h = document.body.scrollHeight
    //             console.log(h)
    //             $(window).scrollTop(h);
    //         },50)
    //     } });
})
//获取服务需要的信息
function getCommRequestBean() {
    var arr = [];
    var posCommRequestBean = {
        oprUser:LoginName,
        oprNo:  operNo ||"",
        noteNo: noteNo ||"",
        shopCode:localStorage.storewldm,//往来代码
        vipNO:hykh,//会员卡号 先写个固定的  15151112222
        whCode:storedm, //门店代码
        changefee:0,
        actualFee:0,
        vipPoints:0
    };

    arr.push(posCommRequestBean);
    var posOrderHeadRequestBean = {
        posCode:machinedm, //POS机器编号
        oprType:"sale",
        oprDate:$("#createDate").val()+" "+wfy.format("hh:mm:ss")||"",
        remark :$('#createBZ').val(),//备注
        isPrint:"Y",
        cashier:LoginName,
        macAddress: localStorage.golbalMac //'30:74:96:b6:1d:70'
    };
    arr.push(posOrderHeadRequestBean);

    var payLogList = [];//数组格式！！
    $('#pay_style li.poschecked').each(function () {
        var tonum = Number($('#totalMoney').html());//最终判断 金额 正负的参数
        console.log(tonum);
        var pay = {};
        pay.payFee = $('#totalMoney').html();
        pay.payType = $(this).attr('data-typedm');//支付方式
        pay.payTypeMc = $(this).find('span').html().replace('<i class="hidden">大</i>','');// 支付方式名称
        pay.kyed = kyed;//可用额度
        pay.payTypeFee = tonum < 0 ? (-Math.abs(Number($(this).find('.billInput').val()))) : (Math.abs(Number($(this).find('.billInput').val())));
        // if(pay.payTypeFee != 0){
        //     payLogList.push(pay);
        // }
        //由于 存在正负抵消正好为0 
        payLogList.push(pay);
    })
    arr.push(payLogList);
    //导购格式  var s = {'guideCode':"BJ001011",'isMain':true,'lineNo':'1','rate':'1'}   rate比例  lineNo导购人数排序（1,2，3.。。累增）
    var guide = [{"guideCode":guidedm,"isMain":true,"lineNo":"1","rate":"1"}];
    arr.push(guide);
    return arr;
}








//查询 客户
function getKHList(AS_KEYWORD) {
    var vBiz = new FYBusiness("biz.crm.crminfo.list");
    var vOpr1 = vBiz.addCreateService("svc.crm.crminfo.list", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID",LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.crm.crminfo.list");
    vOpr1Data.setValue("AS_CXCS", AS_KEYWORD);
    vOpr1Data.setValue("AS_KHHYKH","");
    vOpr1Data.setValue("AN_PSIZ", 100);
    vOpr1Data.setValue("AN_PINDEX",1);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var restult = vOpr1.getResult(d, 'AC_RESULT').rows || [];
            var htmlStr ="";
            if(restult.length ==0){
                htmlStr = wfy.zero();
            }
            for(var i =0; i< restult.length;i++){
                var item=restult[i];
                htmlStr += '<li class="al_kehu" style="line-height: 40px" data-kyed="'+item.hykyed+'" data-hykh = "'+item.khhykh+'">' +
                    '<em style="float: left;width:50%; padding-left: 12px">'+item.khhyxm+' </em>' +
                    '<span>'+item.khhysj+'</span>' +
                    '<br>' +
                    '<span style="float: left;padding-left: 12px;width: 100px">可用额：'+item.hykyed+'</span><span>钱包余额：'+item.hydqye+'</span><span style="float: right;width: 120px">授信额：'+item.khxyed+'</span></li>'
            }
            $("#kehu_list").html(htmlStr);
        } else {
            // todo...[d.errorMessage]
            wfy.alert('没有查询到会员信息！' + (d.errorMessage || ''));
        }
    }) ;
}

