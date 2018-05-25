/**
 * Created by WFY02 on 2017/12/8.
 */
/*
 * 关于 销售，未结订单的支付，开单，收银的 支付
 * 1.支付的html
 * */
//收款
var payCollHtml = '<li data-type="cash" data-typedm="01" class="">'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe637</div>'+
                        '<span style="width: 100px">现<i class="hidden">大</i>金</span>'+
                     '</div>'+
                     '<div class="bill_radio"></div>'+
                    '</li>'+
                    '<li class="none" data-type="fukuan" data-typedm="08">'+
                     '<i class="bill_kyed"></i>'+
                     '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe61e</div>'+
                        '<span style="width: 100px">钱<em class="hidden">大</em>包</span>'+
                        '</div>'+
                        '<div class="bill_radio"></div>'+
                    '</li>'+
                    '<li data-type="card" data-typedm="02">'+
                     '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe606</div>'+
                        '<span style="width: 100px">刷<i class="hidden">大</i>卡</span>'+
                        '</div>'+
                        '<div class="bill_radio"></div>'+
                    '</li>'+
                    '<li data-type="tencent" data-typedm="04">'+
                     '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe677</div>'+
                        '<span style="width: 100px">微<i class="hidden">大</i>信</span>'+
                        '</div>'+
                        '<div class="bill_radio"></div>'+
                    '</li>'+
                    '<li data-type="ali" data-typedm="03">'+
                     '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe67c</div>'+
                        '<span style="width: 100px">支付宝</span>'+
                        '</div>'+
                        '<div class="bill_radio"></div>'+
                    '</li>';
//付款 可输入
var payHtml = '<li data-type="cash" data-typedm="01" class="">'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe637</div>'+
                        '<span>现<i class="hidden">大</i>金</span>'+
                        '<div class="bill_inp_bx">'+
                             '<input type="tel" class="billInput" placeholder="￥" >'+
                        '</div>'+
                    '</div>'+
                    '<div class="bill_radio_close">&#xe69a</div>'+
                '</li>'+
                '<li class="none" data-type="fukuan" data-typedm="08">'+
                    '<i class="bill_kyed"></i>'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe61e</div>'+
                        '<span>钱<em class="hidden">大</em>包</span>'+
                        '<div class="bill_inp_bx">'+
                             '<input type="tel" class="billInput" placeholder="￥">'+
                        '</div>'+
                    '</div>'+
                    '<div class="bill_radio_close">&#xe69a</div>'+
                '</li>'+
                '<li data-type="card" data-typedm="02">'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe606</div>'+
                        '<span>刷<i class="hidden">大</i>卡</span>'+
                        '<div class="bill_inp_bx">'+
                             '<input type="tel" class="billInput" placeholder="￥">'+
                        '</div>'+
                    '</div>'+
                    '<div class="bill_radio_close">&#xe69a</div>'+
                '</li>'+
                '<li data-type="tencent" data-typedm="04">'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe677</div>'+
                        '<span>微<i class="hidden">大</i>信</span>'+
                        '<div class="bill_inp_bx">'+
                             '<input type="tel" class="billInput" placeholder="￥">'+
                        '</div>'+
                    '</div>'+
                    '<div class="bill_radio_close">&#xe69a</div>'+
                '</li>'+
                '<li data-type="ali" data-typedm="03">'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe67c</div>'+
                        '<span>支付宝</span>'+
                        '<div class="bill_inp_bx">'+
                             '<input type="tel" class="billInput" placeholder="￥">'+
                        '</div>'+
                    '</div>'+
                    '<div class="bill_radio_close">&#xe69a</div>'+
                '</li>';

var botBtnHtml ='<div class="pub_num">总数：<span id="totalNum">0</span></div>'+
                '<div class="pub_num">总额：<span>￥</span><span id="totalMoney">0</span></div>'+
                '<div class="pub_num pub_btn" id="sub" style="width: 120px">提交</div>';
var botBtnHtml_dtl ='<div class="pub_num">总数：<span id="totalNum">0</span></div>'+
    '<div class="pub_num">总额：<span>￥</span><span id="totalMoney">0</span></div>'+
    '<div class="pub_num pub_btn cabsdot_bosdt" id="sub_save" style="width: 60px">提交</div>'+
    '<div class="pub_num pub_btn " id="sub_sale" style="width: 60px">收银</div>';
var botBtnHtml_coll = '<div class="pub_num pub_btn" id="sub" style="width: 100%">提交</div>';

var botBtnHtml_noend =  '<div class="pub_num">总额：<span>￥</span><span id="totalMoney">0</span></div>'+
                        '<div class="pub_num" style="color: #fff;background-color: #f60" id="cannoend">取消</div>'+
                        '<div class="pub_num pub_btn" id="sub_noend" style="width: 120px">提交</div>';

var operNo = ""; //操作号
var noteNo = ""; //小票号码
var preOrdno=''; //生成预订单的 单号
var hykh = ''; //客户 卡号
var kyed = 0; // 会员可用额度
var ishykh = false;//是否选择了客户

var AppId = "201705041538001234567887654321";
var AppId = "d4adc52d61b145b5b0e1e6bfd1b0d1b8";
var IsPrint = "false";

var orderAmount = 0;// 订单金额
var sk_typedm = '';// 收款--支付方式
var sk_paylx = '';// 收款 ---支付类型
var rescodeDate ='';//支付日期
var runningWater='';// 支付流水号码 ----参考号
var cardNo ='';//支付账号*（银行卡等）
var merchantNo = '';//商户编号
var mainPayType = '';//销售收银多组合 主体支付方式
var mainPayTypeJe = '';//销售收银多组合 主体支付金额

var weijiepay = [];//未接订单 支付方式汇总  yo用于未接订单 刷卡 微信等 回调处理
var mlje = wfy.empty(localStorage.saleFormatNum) ? 10 : localStorage.saleFormatNum;
$(function () {
    if(pageName == 'msa030_0100'){//销售收银
        $('#pay_style').html(payHtml);
    }
    if(pageName == 'msa030_0200'){//收款
        $('#pay_style').html(payCollHtml);
    }
    if(pageName == 'msa030_0900'){//未结订单
        $('#pay_style').html(payHtml).css({
            'padding-bottom':'70px'
        });
        $('#pub_bottom_btn').html(botBtnHtml_noend);
    }
    $("body").hammer().on("tap", ".bill_radio_close", function (event) {
        event.stopPropagation();
        $(this).parent('li').removeClass('poschecked');
        $(this).prev().removeClass('poschecked');
        $(this).prev().find('.billInput').val("");
    });
    //---------------------------------------------------点击 提交（销售 和 收款。销售开单··）--------------------------
    $('body').hammer().on('tap','#sub',function (event) {
        event.stopPropagation();
        var cont = [];
        for(var a = 0; a<data.length;a++){
            cont = cont.concat(data[a].cont);
        }
        hykh = $('#createKehu').attr('data-hykh');
        //销售收银----------------------------------------销售收银---------------------------
        if(pageName == 'msa030_0100'){
            if(cont.length == 0){
                wfy.alert('请先选择商品');
                return false;
            }
            if($('#pay_style li.poschecked').length == 0){
                wfy.alert('请先设置支付方式');
                return false;
            }
            orderAmount = Number($('#totalMoney').html());
            console.error(orderAmount)
            var tipCont = '您选择的支付信息<br>';
            var pay_check_dm = [];
            var pay_check_mc = [];
            var pay_check_je = [];
            var pay_check_je_total = 0;
            $('#pay_style li.poschecked').each(function () {
                var dm = $(this).attr('data-typedm');
                var mc = $(this).find('span').html();
                var je = Number($(this).find('.billInput').val());
                if(je < 0){
                    je = je*(-1);
                }
                pay_check_dm.push(dm);
                pay_check_mc.push(mc);
                pay_check_je.push(je);
                pay_check_je_total = Components.add(pay_check_je_total,je);

            })
            //-----------------------------对于金额的判断 分开执行----------------------------

            if(orderAmount <= 0){
                orderAmount = orderAmount*(-1);
                //涉及到负销售
                var is_fa = false;
                $('#pay_style li:gt(1)').each(function () {
                    if($(this).hasClass('poschecked')){
                        is_fa = true;
                        $(this).children('.pay_inputandicon').removeClass('poschecked')
                        $(this).removeClass('poschecked').find('.billInput').val("");
                    }
                })
                if(is_fa || ($('#pay_style li[data-type="cash"]').hasClass('poschecked') && $('#pay_style li[data-type="fukuan"]').hasClass('poschecked'))){
                    wfy.alert('销售金额为负数，只能选择现金或者钱包中的一种');
                    return false;
                }

                if( pay_check_je_total != orderAmount){
                    wfy.alert('付款金额与订单金额不相等，请重新输入！');
                    return false;
                }
            }else{
                //首先如果有选客户，验证客户的额度
                if(ishykh){
                    var val_yf =  $('#pay_style li[data-type="fukuan"]').find('.billInput').val();
                    if(val_yf > kyed){
                        wfy.alert("可用额度不足！");
                        return false;
                    }
                }
                if(pay_check_je_total > orderAmount){
                    wfy.alert("输入的支付金额大于订单金额，请重新设置支付金额！");
                    return false;
                }
                if((orderAmount - pay_check_je_total) > mlje){
                    wfy.alert("已选支付方式的支付金额与订单金额相差较大，请重新设置支付金额！");
                    return false;
                }
                if((orderAmount - pay_check_je_total) != 0){
                    tipCont +='支付金额与订单金额相差'+Components.sub(orderAmount,pay_check_je_total)+
                        '元,抹掉'+Components.sub(orderAmount , pay_check_je_total)+'元';
                }
            }


            for(var i = 0; i<pay_check_dm.length;i++){
                if(pay_check_je[i] != 0){
                    tipCont += '<div style="width: 100%;height:36px;overflow: hidden">' +
                        '<span style="float:left;width: 40%; margin-left: 10%">'+pay_check_mc[i]+':</span>' +
                        '<span style="float: left;width: 50%">'+pay_check_je[i]+'元</span>' +
                        '</div>';
                }
            }
            if(tipCont =='您选择的支付信息<br>'){
                tipCont = '订单含有正负商品，总金额为0，请确认商品信息！'
            }

            wfy.confirm(tipCont,function () {
                //生成预订单
                //如果用户取消 支付，再次点击的时候 生成预订单失败。需要验证预订单的存在


                /*2018-5-14 bug  tuguo 如果用户 取消后在添加商品   卧槽 商品漏了 金额照收
                * 所以 下面的 支付 直接删除  提示不能继续支付了 到 未接订货单处理
                * 按照这个思路的话  这里 整体的改换 流程 现 整体 判断  是否存在-------最合理
                 * 但是 算了 直接在这里 提示让去未接订单处理
                * */

                if(preOrdno == ''){
                    createOrder();
                }else{
                    //直接走支付
                    // var pay = [];
                    // mainPayType = '';//主体支付方式
                    // mainPayTypeJe = '';//主体支付金额
                    // pay = getCommRequestBean()[2];
                    // //选取 主要的支付方式
                    // for(var i = 0; i<pay.length; i++){
                    //     if(pay[i].payType == '02' || pay[i].payType == '03' || pay[i].payType == '04'){
                    //         if(pay[i].payTypeFee != ''){
                    //             mainPayType = pay[i].payType;
                    //             mainPayTypeJe = pay[i].payTypeFee;
                    //         }else {
                    //             mainPayType = '';
                    //         }
                    //     }else {
                    //         mainPayType = '';
                    //     }
                    // }
                    // if(mainPayType == ''){
                    //     updaState(getCommRequestBean()[2]);
                    // }
                    // if(mainPayType == '02'){
                    //     //刷卡
                    //     payBankOrder(preOrdno,preOrdno,mainPayTypeJe)
                    // }
                    // if(mainPayType == '04' || mainPayType == '03'){
                    //     //扫一扫
                    //     payScanOrder(preOrdno,preOrdno,mainPayTypeJe)
                    // }
                    Components.confirm('此单已生成，中途有取消或者其他操作请到未接订单进行处理',function (flg) {
                        if(flg){
                            wfy.pagegoto('bill_noend');
                        }else {
                            window.location.reload();
                        }
                    })
                }

            },function () {
                
            });
            
        }
        //销售开单
        if(pageName =="msa030_0800"){
            if(cont.length == 0){
                wfy.alert('请先选择商品');
                return false;
            }
            createOrder();
        }
        //收款
        if(pageName == 'msa030_0200'){
            sk_typedm = $('#pay_style li.poschecked').attr('data-typedm');//收款只有一个付款方式
            orderAmount = Number($('#createMoney').val());
            if(sk_typedm =='02'){//银行卡
                sk_paylx = '2';
            }
            if(sk_typedm =='04'){//微信
                sk_paylx = '6';
            }
            if(sk_typedm =='03'){//支付宝
                sk_paylx = '5';
            }
            if(wfy.empty(hykh)){
                wfy.alert('请先选择客户');
                return false;
            }
            if(orderAmount == ""){
                wfy.alert('请先输入金额');
                return false;
            }
            if(orderAmount < 0){
                wfy.alert('收款金额不能小于0');
                return false;
            }
            if($('#pay_style li.poschecked').length == 0){
                wfy.alert('请先设置支付方式');
                return false;
            }
            getorder("",function (res) {
                noteNo = res[0].orderid;
                if(sk_typedm == '01'){
                    //现金
                    payOverCallback(false);
                }
                if(sk_typedm == '02'){
                    //刷卡
                    payBankOrder(noteNo,noteNo,orderAmount)
                }
                if(sk_typedm == '04' || sk_typedm == '03'){
                    //扫一扫
                    payScanOrder(noteNo,noteNo,orderAmount)
                }
            });
        }
    })
    //------------------------------------------点击 提交（关于未结订单页面的）-------------------------------------------
    $("body").hammer().on("tap", "#sub_noend", function (event) {
        operNo = czhm;
        noteNo = xtxphm;
        preOrdno= czhm;
        orderAmount = Number($('#totalMoney').html());
        if($('#pay_style li.poschecked').length == 0){
            wfy.alert('请先设置支付方式');
            return false;
        }
        //可能多个组合付款方式，先 做个支付信息的提示
        var tipCont = '您选择的支付信息<br>';
        var pay_check_dm = [];
        var pay_check_mc = [];
        var pay_check_je = [];
        var pay_check_je_total = 0
        $('#pay_style li.poschecked').each(function () {
            var dm = $(this).attr('data-typedm');
            var mc = $(this).find('span').html();
            var je = Number($(this).find('.billInput').val());
            if(je < 0){
                je = je*(-1);
            }
            pay_check_dm.push(dm);
            pay_check_mc.push(mc);
            pay_check_je.push(je);
            pay_check_je_total = Components.add(pay_check_je_total,je);
        })
        if(orderAmount <= 0){
            orderAmount = orderAmount*(-1);
            var is_fa = false;
            $('#pay_style li:gt(1)').each(function () {
                if($(this).hasClass('poschecked')){
                    is_fa = true;
                    $(this).children('.pay_inputandicon').removeClass('poschecked')
                    $(this).removeClass('poschecked').find('.billInput').val("");
                }
            })
            if(is_fa || ($('#pay_style li[data-type="cash"]').hasClass('poschecked') && $('#pay_style li[data-type="fukuan"]').hasClass('poschecked'))){
                wfy.alert('销售金额为负数，只能选择现金或者钱包中的一种');
                return false;
            }

            if( pay_check_je_total != orderAmount){
                wfy.alert('销售金额为负数，付款金额与订单金额不相等，请重新输入！');
                return false;
            }
        }else {
            if(ishykh){
                var val_yf =  $('#pay_style li[data-type="fukuan"]').find('.billInput').val();
                if(val_yf > kyed){
                    wfy.alert("可用额度不足！");
                    return false;
                }
            }
            if(pay_check_je_total > orderAmount){
                wfy.alert("输入的支付金额大于订单金额，请重新设置支付金额！");
                return false;
            }
            if((orderAmount - pay_check_je_total) > mlje){
                wfy.alert("已选支付方式的支付金额与订单金额相差较大，请重新设置支付金额！");
                return false;
            }

        }
        if((orderAmount - pay_check_je_total) != 0){
            tipCont +='支付金额与订单金额相差'+Components.sub(orderAmount , pay_check_je_total)+
                '元,如果确认付款，相当于抹掉'+Components.sub(orderAmount , pay_check_je_total)+'元';
        }
        var pay = [];
        $('#pay_style li.poschecked').each(function () {
            if(Number($(this).find('.billInput').val()) != 0){
                var payobj = {};
                payobj.payFee = $('#totalMoney').html();
                payobj.payType = $(this).attr('data-typedm');//支付方式
                payobj.payTypeMc = $(this).find('span').html().replace('<i class="hidden">大</i>','');// 支付方式名称
                payobj.kyed = kyed;//可用额度
                payobj.payTypeFee = Number($(this).find('.billInput').val());
                pay.push(payobj);
            }

        })
        mainPayType = '';//主体支付方式
        mainPayTypeJe = '';//主体支付金额
        //选取 主要的支付方式
        for(var i = 0; i<pay.length; i++){
            if(pay[i].payType == '02' || pay[i].payType == '03' || pay[i].payType == '04'){
                mainPayType = pay[i].payType;
                mainPayTypeJe = pay[i].payTypeFee;
            }
        }
        
        for(var i = 0; i<pay_check_dm.length;i++){
            if(pay_check_je[i] != 0){
                tipCont += '<div style="width: 100%;height:36px;overflow: hidden">' +
                    '<span style="float:left;width: 40%; margin-left: 10%">'+pay_check_mc[i]+':</span>' +
                    '<span style="float: left;width: 50%">'+pay_check_je[i]+'元</span>' +
                    '</div>';
            }
        }

        if(tipCont =='您选择的支付信息<br>'){
            tipCont = '订单含有正负商品，总金额为0，请确认商品信息！'
        }
        weijiepay = getCommpay();//  函数  代替 pay 数组
        wfy.confirm(tipCont,function () {
            console.log(weijiepay)
            if(mainPayType == ''){
                updaState(weijiepay);
            }
            if(mainPayType == '02'){
                //刷卡
                payBankOrder(xtxphm,xtxphm,mainPayTypeJe)
            }
            if(mainPayType == '04' || mainPayType == '03'){
                //扫一扫
                payScanOrder(xtxphm,xtxphm,mainPayTypeJe)
            }
        },function () {

        });

    });
})

var getCommpay = function () {
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
    return payLogList;
}







//刷卡
function payBankOrder(_xtxphm, noteNo, _money) {
    uexMposUMS.payorder_callback = payOrder_callback;
    var _transData = {};
    _transData["appId"] = AppId;
    _transData["extOrderNo"] = noteNo;  //支付流水号
    _transData["extBillNo"] = _xtxphm;  //小票号
    _transData["isNeedPrintReceipt"] = IsPrint;
    _transData["amt"] = _money*100;

    var _data = {};
    _data["appName"] = "银行卡收款";
    _data["transId"] = "消费";
    _data["transData"] = _transData;

    try {
        uexMposUMS.payOrder(_data["appName"],_data["transId"],_transData);
    } catch(e) {
        // statements
        alert("取消"+e.message);
    }

}
//扫一扫 （微信和 支付宝）
function payScanOrder(_xtxphm, noteNo, _money) {
    uexMposUMS.payorder_callback = payOrder_callback;
    var _transData = {};
    _transData["appId"] = AppId;
    _transData["extOrderNo"] = noteNo;  //支付流水号
    _transData["extBillNo"] = _xtxphm;  //小票号
    _transData["isNeedPrintReceipt"] = IsPrint;
    _transData["amt"] = _money*100;
    var _data = {};
    _data["appName"] = "POS 通";
    _data["transId"] = "扫一扫";
    _data["transData"] = _transData;
    try {
        uexMposUMS.payOrder(_data["appName"],_data["transId"],_transData);
    } catch(e) {
        alert("取消"+e.message);
    }
}
//退货
function refundOrder(_refNo, _date, _money) {
    uexMposUMS.payorder_callback = payOrder_callback;
    var _transData = {};
    _transData["appId"] = AppId;
    _transData["refNo"] = _refNo;  //支付流水号
    _transData["date"] = _date;  //小票号
    _transData["amt"] = _money;

    var _data = {};
    _data["appName"] = "公共资源";
    _data["transId"] = "退货";
    _data["transData"] = _transData;

    try {
        uexMposUMS.payOrder(_data["appName"],_data["transId"],_transData);
    } catch(e) {
        // statements
        alert(e.message);
    }

}
//支付回调
var payOrder_callback_ss = function (opCode, dataType, data){
    // 卧槽 用户竟然不输入密码 再次回来 操作商品！！！避之 数据清除
    //window.location.reload();
    //dataType 为1
    alert(opCode+" ----------"+dataType+'-----------'+data);
    var datastr = data.replace(/"{/g, "{").replace(/}"/g, "}");
    var datastr_re =  datastr.split(',"memInfo"')[0]+'}}';
    eval("var _jsoninfo_ = "+datastr_re);
    //判断调用接口是否成功
    var resultCode = _jsoninfo_["resultCode"]+"";//接口调用成功，业务判断
    var resultMsg = _jsoninfo_["resultMsg"];//接口调用成功，业务判断
    var appName = _jsoninfo_["appName"];// 银行卡收款
    var transId = _jsoninfo_["transId"];//消费------交易类型

    var _jsondata_ = _jsoninfo_["transData"];//承载交易信息

    //alert(resultCode+","+resultMsg+","+appName+","+transId);
    //接口调用成功，业务判断
    alert(resultCode)
    alert(_jsondata_["resCode"])
    if(resultCode=="0")
    {
        if(_jsondata_["resCode"]=="00")// 00表示交易成功！
        {
            //业务返回正确,建议返回完整的transData
            //关键和都有的数据如下：
            /*
             merchantName:商户名
             merchantNo:商户编号
             terminalNo:终端编号
             operNo:操作员号
             amt:交易金额
             batchNo:批次号
             traceNo:凭证号
             refNo:参考号   XXXXXXXXXXXXXXXXXXXX 极其重要 退款需要 XXXXXXXXXXXXXXXXXXXXXX
             date:日期
             time:时间
             memInfo:备注
             */
            merchantNo = _jsondata_["merchantNo"];
            rescodeDate = _jsondata_["date"];
            runningWater = _jsondata_["refNo"];
            cardNo = _jsondata_["cardNo"];
            if(pageName == 'msa030_0100'){//销售收银
                updaState(getCommRequestBean()[2]);
            }
            if(pageName == 'msa030_0200'){//收款
                payOverCallback(true);
            }
            if(pageName == 'msa030_0900'){//未接订单
                updaState(weijiepay);
            }
            // if(transId=="退货")
            // {
            //     //退货成功回调
            //     /**************************************************************************
            //      * refundSuccessCallBack(_jsondata_);
            //      ***************************************************************************/
            // }
            // else
            // {
            //     //支付成功回调
            //     /**************************************************************************
            //      * paySuccessCallBack(_jsondata_);
            //      ***************************************************************************/
            // }
        }else if(_jsondata_["resCode"]=="FJ"){
            wfy.alert(_jsondata_["resDesc"]+'请到未接订单处理',function () {
                window.location.reload();
            })
        }else if(_jsondata_["resCode"]=="FK"){
            wfy.alert(_jsondata_["resDesc"]+'请到未接订单处理',function () {
                window.location.reload();
            })
        }else {
            //报错回调,参数建议使用 _jsondata_["resCode"]   _jsondata_["resDesc"]，也可以直接使用transData
            wfy.alert('交易失败！'+_jsondata_["resCode"],function () {
                window.location.reload();
            })
            //2018-5-25
            /*
            * 出现用户 不输入密码 等待超时 或者 密码界面取消 等 竟然没走到这里
            * resCode = FJ 等待超时
            * resCode = FK 用户取消
            * 这两个状态 应该是进入这里的，统一按 支付失败处理！！
            * 那就 加 else if 处理
            * */
            if(transId=="退货")
            {
                //退货失败回调
                /**************************************************************************
                 * refundErrorCallBack(rcode, rmsg)
                 ***************************************************************************/
            }
            else
            {
                //支付失败回调
                /**************************************************************************
                 * payErrorCallBack(rcode, rmsg)
                 ***************************************************************************/
            }
        }
    }
    else
    {
        //支付没成功！！
        //已经生成订单
        $.confirm('支付失败，已经生成预订单，继续销售还是前往未结订单页面继续付款？',function () {
            wfy.pagegoto('bill_noend');
        },function () {
            window.location.reload();
        })
        //报错回调,参数建议使用 resultCode， resultMsg，也可以直接使用transData
        if(transId=="退货")
        {
            //退货失败回调
            /**************************************************************************
             * refundErrorCallBack(rcode, rmsg)
             ***************************************************************************/
        }
        else
        {
            //支付失败回调
            /**************************************************************************
             * payErrorCallBack(rcode, rmsg)
             ***************************************************************************/
        }
    }
};




//支付回调
var payOrder_callback = function (opCode, dataType, data){
    // 卧槽 用户竟然不输入密码 再次回来 操作商品！！！避之 数据清除
    //window.location.reload();
    //dataType  为1
    //alert(opCode+" ----------"+dataType+'-----------'+data);
    /*
    * 5.25 当用户支付的时候 取消或者 等待超时的时候，返回的data格式  很简单，
    * 正常支付的 情况下 返回的串 很长 ，而且后面有很多错乱的字母符号（实际上是二维码的内容）！！！直接转json 会失败
    * 所以 就 依据 串的长度 分别处理
    * */
    //alert(data);
    var datastr = data.replace(/"{/g, "{").replace(/}"/g, "}");
    // alert(datastr);
    // alert(datastr.length);
    var datajson={};
    if(datastr.length>300){
        var datastr_re =  datastr.split(',"memInfo"')[0]+'}}';//memInfo 从memInfo 处截取 前面的内容 并补齐json格式
        datajson = eval('('+datastr_re+')');
    }else{
        datajson = JSON.parse(data);
    }
    var resultcode = datajson.resultCode;//接口调用成功，业务判断
    //alert(resultcode)
    var transData = {};//承载交易信息
    if(resultcode =='0'){
        //0 表示接口成
        transData = datajson.transData;
        var resCode = transData.resCode;
        //alert(resCode);
        if(resCode == '00'){
            //00 表示交易成功！
            merchantNo = transData.merchantNo;
            rescodeDate = transData.date;
            runningWater = transData.refNo;
            cardNo = transData.cardNo;
            if(pageName == 'msa030_0100'){//销售收银
                updaState(getCommRequestBean()[2]);
            }
            if(pageName == 'msa030_0200'){//收款
                payOverCallback(true);
            }
            if(pageName == 'msa030_0900'){//未接订单
                updaState(weijiepay);
            }
        }else if(resCode =='FJ'){
            //resCode = FJ 等待超时
            wfy.alert(transData.resDesc+'请到未接订单处理或重新支付',function () {
                window.location.reload();
            })
        }else if(resCode =='FK'){
            //resCode = FK 用户取消
            wfy.alert(transData.resDesc+'请到未接订单处理或重新支付',function () {
                window.location.reload();
            })
        }else{
            wfy.alert('交易失败！',function () {
                window.location.reload();
            })
        }
    }else{
        $.confirm('支付失败，已经生成预订单，继续销售还是前往未结订单页面继续付款？',function () {
            wfy.pagegoto('bill_noend');
        },function () {
            window.location.reload();
        })
    }
};
// 生成 预订单
function createOrder() {
    var cont = [];
    var list=[];
    for(var a = 0; a<data.length;a++){
        cont = cont.concat(data[a].cont);
    }
    console.log('预订单数据'+cont)
    for (var i = 0 ; i< cont.length;i++){
        var obj ={};
        obj['actualFee'] = (cont[i].price)*(cont[i].num);// 神马价格？   //实收金额
        obj['discountReason'] = '';//
        obj['giftFlag'] = 'N';//赠品标志
        obj['khhyzk'] = '0';//zhe折扣？
        obj['lineNo'] = i+1;//行号？
        obj['mainGuide'] = guidedm;//
        obj['qty'] = cont[i].num;//
        obj['saleFee'] = cont[i].wpdj;//   销售金额
        obj['sku'] = cont[i].sku;//
        obj['wpxsdj'] = cont[i].wpdj;//
        obj['xtcxyy'] = '';//
        obj['xtcxzk'] = '1';//
        obj['xtssje'] = cont[i].price;//kcxsdj  xtssje
        obj['xtwpdm'] = cont[i].sku;// 物品代码 = sku
        obj['xtwpks'] = cont[i].price;//
        obj['xtwplj'] = '';//
        obj['xtwpmc'] = cont[i].ksmc;//
        obj['xtwpsl'] = cont[i].num;//
        obj['xtwpxh'] = cont[i].style;//
        obj['xtysmc'] = cont[i].color;//
        list.push(obj);
    }
    var perOrder = {
        "requestName": "posMsgSave",
        "identityId": "",
        "requestNo": "PosMsgSave",
        "commRequestBean": getCommRequestBean()[0],//对象格式
        "posOrderHeadRequestBean": getCommRequestBean()[1],//对象格式
        "posPaymentList": [],//对象数组格式  getCommRequestBean()[2],修改：生成预订单--的时候支付为空。
        "posCouponList": null,
        "posPrePayCardList": null,
        "posCardList": null,
        "posOrderProductList": list,//对象数组格式
        "posGuideList": getCommRequestBean()[3]//对象数组格式
    }; //预订单信息
    console.log(JSON.stringify(perOrder))
    var callService = new CallService("posMsgSave", _wfy_order_svr); //创建一个调用外部服务的方法
    wfy.showload("正在保存预订单");
    callService.invoke(perOrder, function(d)
        {
            wfy.hideload();
            console.error(d)
            if(d.success) //调用成功
            {
                preOrdno = d.preOrdno; //预订单单号
                //在此区分  销售 还是 开单
                if(pageName == 'msa030_0800'){//销售开单
                    wfy.alert("单据开票成功",function () {
                        window.location.reload();
                    })
                }
                if(pageName == 'msa030_0100'){//销售收银
                    var pay = [];
                    mainPayType = '';//主体支付方式
                    mainPayTypeJe = '';//主体支付金额
                    pay = getCommRequestBean()[2];
                    //选取 主要的支付方式
                    for(var i = 0; i<pay.length; i++){
                        if(pay[i].payType == '02' || pay[i].payType == '03' || pay[i].payType == '04'){
                            if(pay[i].payTypeFee != ''){
                                mainPayType = pay[i].payType;
                                mainPayTypeJe = pay[i].payTypeFee;
                            }else {
                                mainPayType = '';
                            }
                        }else {
                            mainPayType = '';
                        }
                    }
                    if(mainPayType == ''){
                        updaState(getCommRequestBean()[2]);
                    }
                    if(mainPayType == '02'){
                        //刷卡
                        payBankOrder(preOrdno,preOrdno,mainPayTypeJe)
                    }
                    if(mainPayType == '04' || mainPayType == '03'){
                        //扫一扫
                        payScanOrder(preOrdno,preOrdno,mainPayTypeJe)
                    }
                }
            }
            else {
                alert(d.errorMessage);
            }
        },
        function()
        {
            alert(JSON.stringify(data));
        },
        true);
}
//支付完 的回调  ----只用在收款模块（向数据库保存银行收款信息）
var payOverCallback = function (flag) {
    var vBiz = new FYBusiness("biz.vipremoney.cash.save");
    var vOpr1 = vBiz.addCreateService("svc.pos.cashreturn.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.cashreturn.save");
    vOpr1Data.setValue("AS_XTXPHM", noteNo);//小票号
    vOpr1Data.setValue("AS_KHHYKH", hykh);//会员卡号
    vOpr1Data.setValue("AN_KHCZJE", Number(orderAmount));//金额
    vOpr1Data.setValue("AS_XTWLDM", storewldm);//往来门店
    vOpr1Data.setValue("AS_KHCZLX", "00");//操作类型 00-收款 05退货
    var vOpr2 = vBiz.addCreateService("svc.pos.cashpay.save", false);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.pos.cashpay.save");
    vOpr2Data.setValue("AS_KHCZID", noteNo);//小票号
    vOpr2Data.setValue("AS_XSZFFS", sk_typedm);//支付方式 ---只有收款传，其他模块是空
    vOpr2Data.setValue("AN_XSZFJE", Number(orderAmount));//支付金额

    // 只有 非现金支付的方式 才有第三个
    if(flag){
        var vOpr3 = vBiz.addCreateService("svc.pos.cashpaydtl.save", false);
        var vOpr3Data = vOpr3.addCreateData();
        vOpr3Data.setValue("AS_USERID", LoginName);
        vOpr3Data.setValue("AS_WLDM", DepartmentCode);
        vOpr3Data.setValue("AS_FUNC", "svc.pos.cashpaydtl.save");
        vOpr3Data.setValue("AS_KCCZHM", noteNo);//小票号
        vOpr3Data.setValue("AS_KCDJDH", noteNo);//小票号
        vOpr3Data.setValue("AS_YSDJDH", noteNo);//小票号
        vOpr3Data.setValue("AS_XSZFFS", sk_typedm);//支付方式
        vOpr3Data.setValue("AS_XTCZLX", "0");//操作类型  0--收款 1 --退款
        vOpr3Data.setValue("AS_XSJFLX", sk_paylx);//支付类型（5;支付宝  6：微信 2银行卡）
        vOpr3Data.setValue("AS_XSZFZH", "");//公司支付账号
        vOpr3Data.setValue("AS_XTXPHM", noteNo);//小票号码
        vOpr3Data.setValue("AS_YSXPHM", noteNo);//同上
        vOpr3Data.setValue("AS_DDZFJE", Number(orderAmount));// 支付金额
        vOpr3Data.setValue("AS_XSZFZT", "SUCCESS");//支付状态  FAILED：失败   SUCCESS：支付成功   UNKNOWN：异常    CREATE：支付创建等待客户输入密码
        vOpr3Data.setValue("AS_ZFSBYY", "");//失败愿因
        vOpr3Data.setValue("AS_MJZFTM", "");// 买家支付条码
        vOpr3Data.setValue("AS_MJZFZH", "");//买家支付号码
        vOpr3Data.setValue("AN_XTJYJE", Number(orderAmount));//交易金额 商品定价总金额 ，没有就空
        vOpr3Data.setValue("AN_XTSSJE", Number(orderAmount));// 实收金额 -----单据最后总金额
        vOpr3Data.setValue("AN_MJFKJE", Number(orderAmount));// 买家实际付款金额 ----刷卡等操作的金额（除现金）， 上述三个金额。收款模式下相同！！！
        vOpr3Data.setValue("AS_ZFLSHM", runningWater);// 支付流水号码 ----参考号
        vOpr3Data.setValue("AS_XSFKRQ", rescodeDate);//日期
        vOpr3Data.setValue("AS_ZFTJXX", "");//支付提交信息
        vOpr3Data.setValue("AS_ZFFHXX", "");//支付返回信息
    }
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            wfy.alert("收款成功！",function () {
                window.location.reload();
            })
        } else {
            // todo...[d.errorMessage]
            wfy.alert("回调失败"+d.errorMessage)
        }
    }) ;
}
//更新状态
function updaState(pay) {
    //alert(JSON.stringify(pay))
    var vBiz = new FYBusiness("biz.pos.pay.status.save");
    var vOpr1 = vBiz.addCreateService("svc.pos.paymode.save", false);
    var vOpr1Data = [];
    for(var i =0; i<pay.length; i++){
        var payTypeFee = Math.abs(Number(pay[i].payTypeFee));
        if(Number($('#totalMoney').html()) < 0){
            payTypeFee = payTypeFee*(-1);
        }
        var o = {};
        o.AS_USERID = LoginName;
        o.AS_WLDM = DepartmentCode;
        o.AS_FUNC = "svc.pos.paymode.save";
        o.AS_KCCZHM =operNo; //操作号码
        o.AS_XSZFFS = pay[i].payType;//支付方式
        o.AN_XSZFJE = payTypeFee;//支付金额 由于前台界面默认都要输入整数，所以依据总金额的正负，赋予该方式的支付金额正负！！注意如果用书输入负数，先转绝对值 在判断
        o.AN_XSDKJF = 0;
        o.AN_YDZFJE = 0;//原单支付金额 为0
        o.AN_YDDKJF = 0;
        o.AS_XSZFZH = '';//银行卡号
        o.AS_XTXPHM = noteNo;//x小票号码
        o.AS_ZFLSHM = runningWater;//流水号（参考号）
        vOpr1Data.push(o);
    }
    vOpr1.addDataArray(vOpr1Data)
    var vOpr2 = vBiz.addCreateService("svc.pos.paystatus.upt", false);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.pos.paystatus.upt");
    vOpr2Data.setValue("AS_KCCZHM",preOrdno);
    var vOpr3 = vBiz.addCreateService("svc.pos.preposexec.save", false);
    var vOpr3Data = vOpr3.addCreateData();
    vOpr3Data.setValue("AS_USERID", LoginName);
    vOpr3Data.setValue("AS_WLDM", DepartmentCode);
    vOpr3Data.setValue("AS_FUNC", "svc.pos.preposexec.save");
    vOpr3Data.setValue("AS_PRECZHM", preOrdno);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip));
    ip.invoke(function(d){
        console.log(d)
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            Components.alert('生成订单成功！',function () {
                preOrdno = '';
                $.confirm('支付成功，已生成订单！是否打印单据？',function () {
                    console.log(noteNo)
                    uexBluetoothSerial.isEnabled();
                    uexBluetoothSerial.onIsEnabledCallback = function (opId, dataType, datable) {
                        datable = JSON.parse(datable || 'false');
                        if(datable){
                            uexBluetoothSerial.isConnected();
                            uexBluetoothSerial.onIsConnectedCallback = function(opId,dataType,data){
                                data = JSON.parse(data || 'false');
                                if(data){
                                    //直接打印！
                                    //Components.bluetoothPrint.printSaleTicket(operNo,noteNo,'57');
                                    Components.bluetoothPrint.printTicket100(noteNo);
                                    setTimeout(function () {
                                        if(pageName =='msa030_0900'){
                                            wfy.pagegoto('bill_noend');
                                        }else {
                                            window.location.reload();
                                        }
                                    },1000)
                                }else{
                                    var deviceListBox = new Components.SingleSelectBox('head');
                                    var deviceList = [], load = null;
                                    deviceListBox.setItemTpl(function (index, item) {
                                        return '<div style="line-height:35px;background:transparent;text-align:left;' +
                                            'padding:5px 12px;border-bottom:1px solid #d9d9d9;">' +
                                            '<p>' + (item.name || '') + (item.class ? '(' + item.class + ')' : '') + '</p>' +
                                            '<p>' + (item.address || '') + '</p></div>';
                                    });
                                    deviceListBox.setItemTapFunc(function (src, elem, item) {
                                        load = Components.loading(false, '连接蓝牙设备' + item.name + '中...');
                                        uexBluetoothSerial.connect(item.address || '');
                                    });
                                    load = Components.loading(false, '搜索蓝牙设备中...');
                                    uexBluetoothSerial.listDevices();
                                    uexBluetoothSerial.onlistDevicesCallback = function (opId, dataType, data) {
                                        Components.unload(load);
                                        deviceList = JSON.parse(data || '[]');
                                        deviceListBox.setList(deviceList).show();
                                    };
                                    uexBluetoothSerial.onConnectionSuccessEvent = function (opId, dataType, data) {
                                        Components.unload(load);
                                        //直接打印！
                                        Components.bluetoothPrint.printTicket100(noteNo);
                                        setTimeout(function () {
                                            if(pageName =='msa030_0900'){
                                                wfy.pagegoto('bill_noend');
                                            }else {
                                                window.location.reload();
                                            }
                                        },1000)
                                    };
                                    uexBluetoothSerial.onConnectionLostEvent = function (opId, dataType, data) {
                                        Components.unload(load);
                                        Components.alert('蓝牙设备已断开');
                                        setTimeout(function () {
                                            if(pageName =='msa030_0900'){
                                                wfy.pagegoto('bill_noend');
                                            }else {
                                                window.location.reload();
                                            }
                                        },1000)
                                    };
                                }
                            }
                        }else{
                            Components.alert('本机蓝牙不可用，请先打开蓝牙并与设备配对！');
                            setTimeout(function () {
                                if(pageName =='msa030_0900'){
                                    wfy.pagegoto('bill_noend');
                                }else {
                                    window.location.reload();
                                }
                            },1000)
                        }
                    }
                },function () {
                    if(pageName =='msa030_0900'){
                        wfy.pagegoto('bill_noend');
                    }else {
                        window.location.reload();
                    }
                })
            });
        } else {
            // todo...[d.errorMessage]
            wfy.alert('操作失败！'+d.errorMessage)
        }
    }) ;
}










//向 预订单 传输 支付信息
var postPay = function (pay) {
    var vBiz = new FYBusiness("biz.pos.paymode.save");
    var vOpr1 = vBiz.addCreateService("svc.pos.paymode.save", false);
    var vOpr1Data = [];
    for(var i =0; i<pay.length; i++){
        var o = {};
        o.AS_USERID = LoginName;
        o.AS_WLDM = DepartmentCode;
        o.AS_FUNC = "svc.pos.paymode.save";
        o.AS_KCCZHM =operNo; //操作号码
        o.AS_XSZFFS = pay[i].payType;//支付方式
        o.AN_XSZFJE = Number(pay[i].payTypeFee) ;//支付金额
        o.AN_XSDKJF = 0;
        o.AN_YDZFJE = 0;//原单支付金额 为0
        o.AN_YDDKJF = 0;
        o.AS_XSZFZH = '';//银行卡号
        o.AS_XTXPHM = noteNo;//x小票号码
        o.AS_ZFLSHM = runningWater;//流水号（参考号）
        vOpr1Data.push(o);
    }
    vOpr1.addDataArray(vOpr1Data)
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip));
    ip.invoke(function(d){
        console.log(d)
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            updatePayStatus(preOrdno);
        } else {
            // todo...[d.errorMessage]
            wfy.alert("更新失败");
        }
    }) ;
}
//销售收银更新支付状态
function updatePayStatus(AS_KCCZHM) {
    var biz = new FYBusiness('biz.pos.paystatus.upt');
    var svc = biz.addCreateService("svc.pos.paystatus.upt",false);
    var data = svc.addCreateData();
    data.setValue("AS_USERID", LoginName);
    data.setValue("AS_WLDM", DepartmentCode);
    data.setValue("AS_FUNC", "svc.pos.paystatus.upt");
    data.setValue("AS_KCCZHM",AS_KCCZHM);
    var ip = new InvokeProc("true","proc");
    ip.addBusiness(biz);
    //console.log(JSON.stringify(ip))
    ip.invoke(function (res) {
        if(res && res.success)
        {
            console.info(res);
            saveFinalOrd(); //支付成功将订单转换为正式订单
        }else{
            wfy.alert("支付状态更新失败！");
            //funs.goto("myOrder");
        }
    });
}
//将预订单转换为最终的订单保存最终的订单信息
function saveFinalOrd() {
    var biz = new FYBusiness("biz.pos.preposexec.save");
    var svc = biz.addCreateService("svc.pos.preposexec.save", false);
    var data = svc.addCreateData();
    data.setValue("AS_USERID", LoginName);
    data.setValue("AS_WLDM", DepartmentCode);
    data.setValue("AS_FUNC", "svc.pos.preposexec.save");
    data.setValue("AS_PRECZHM", preOrdno);
    data.setValue("AS_KCCZHM","");
    data.setValue("AS_KCPDHM","");
    data.setValue("AS_THCZHM","");
    data.setValue("AS_THXPHM","");

    var ip = new InvokeProc("ture","proc");
    ip.addBusiness(biz);
    //console.log(JSON.stringify(ip));
    ip.invoke(function (res) {
        if (res && res.success) {
            console.log('生成订单成功！');
            preOrdno = '';
            $.confirm('支付成功，已生成订单！是否打印单据？',function () {
                console.log(noteNo)
                uexBluetoothSerial.isEnabled();
                uexBluetoothSerial.onIsEnabledCallback = function (opId, dataType, datable) {
                    datable = JSON.parse(datable || 'false');
                    if(datable){
                        uexBluetoothSerial.isConnected();
                        uexBluetoothSerial.onIsConnectedCallback = function(opId,dataType,data){
                            data = JSON.parse(data || 'false');
                            if(data){
                                //直接打印！
                                //Components.bluetoothPrint.printSaleTicket(operNo,noteNo,'57');
                                Components.bluetoothPrint.printTicket100(noteNo);
                                setTimeout(function () {
                                    window.location.reload();
                                },1000)
                            }else{
                                var deviceListBox = new Components.SingleSelectBox('head');
                                var deviceList = [], load = null;
                                deviceListBox.setItemTpl(function (index, item) {
                                    return '<div style="line-height:35px;background:transparent;text-align:left;' +
                                        'padding:5px 12px;border-bottom:1px solid #d9d9d9;">' +
                                        '<p>' + (item.name || '') + (item.class ? '(' + item.class + ')' : '') + '</p>' +
                                        '<p>' + (item.address || '') + '</p></div>';
                                });
                                deviceListBox.setItemTapFunc(function (src, elem, item) {
                                    load = Components.loading(false, '连接蓝牙设备' + item.name + '中...');
                                    uexBluetoothSerial.connect(item.address || '');
                                });
                                load = Components.loading(false, '搜索蓝牙设备中...');
                                uexBluetoothSerial.listDevices();
                                uexBluetoothSerial.onlistDevicesCallback = function (opId, dataType, data) {
                                    Components.unload(load);
                                    deviceList = JSON.parse(data || '[]');
                                    deviceListBox.setList(deviceList).show();
                                };
                                uexBluetoothSerial.onConnectionSuccessEvent = function (opId, dataType, data) {
                                    Components.unload(load);
                                    //直接打印！
                                    Components.bluetoothPrint.printTicket100(noteNo);
                                    setTimeout(function () {
                                        window.location.reload();
                                    },1000)
                                };
                                uexBluetoothSerial.onConnectionLostEvent = function (opId, dataType, data) {
                                    Components.unload(load);
                                    Components.alert('蓝牙设备已断开');
                                    setTimeout(function () {
                                        window.location.reload();
                                    },1000)
                                };
                            }
                        }
                    }else{
                        Components.alert('本机蓝牙不可用，请先打开蓝牙并与设备配对！');
                        setTimeout(function () {
                            window.location.reload();
                        },1000)
                    }
                }
            },function () {
                window.location.reload();
            })
        } else {
            wfy.alert("预订单转换为正式订单失败！");
        }
    });
}




















































