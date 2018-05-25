var savedata ={};
$(function () {
    getqx(function (res) {
        cbqx = res[0].xtcbqx;
        syqx = res[0].xtsyqx;
        console.log(cbqx);
        console.log(syqx);
    })

    console.error(pageName)
    $('body').hammer().on('tap','#back',function (event) {
        event.stopPropagation();
        wfy.goto('bill_noend');
    });
    //客户
    wfy.tap('#dtl_createKehu',function (that) {
        getKHList('');
        document.documentElement.style.overflow = "hidden";
        $('#kehu').removeClass('y100');
    })
    dtl();
    //提交
    $('body').hammer().on('tap','#sub_save',function (event) {
        event.stopPropagation();
        if(!$(this).hasClass('cabsdot_bosdt')){
            saveData();
        }
    });
    //收银
    //------------------------------------------点击 提交（）-------------------------------------------
    $("body").hammer().on("tap", "#sub_sale", function (event) {
        if($(this).hasClass('cabsdot_bosdt')){
            return false;
        }
        if(syqx == 'N'){
            wfy.alert('抱歉，您未有收银权限！');
            return ;
        }
        operNo = savedata.czhm;
        noteNo = savedata.xtxphm;
        console.error(noteNo)
        preOrdno= savedata.czhm;
        orderAmount = Number($('#totalMoney').html());
        if($('#pay_style li.poschecked').length == 0){
            wfy.alert('请先设置支付方式');
            return false;
        }
        var tipCont = '您选择的支付信息<br>';
        //可能多个组合付款方式，先 做个支付信息的提示
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
            if(je != 0){
                pay_check_dm.push(dm);
                pay_check_mc.push(mc);
                pay_check_je.push(je);
                pay_check_je_total = Components.add(pay_check_je_total,je);
            }
        })
        var pay = [];
        $('#pay_style li.poschecked').each(function () {
            if(Number($(this).find('.billInput').val()) != 0){
                var payobj = {};
                payobj.payFee = $('#totalMoney').html();
                payobj.payType = $(this).attr('data-typedm');//支付方式
                payobj.payTypeMc = $(this).find('span').html();// 支付方式名称
                payobj.kyed = kyed;//可用额度
                payobj.payTypeFee = Number($(this).find('.billInput').val());
                pay.push(payobj);
            }

        })
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
                wfy.alert('销售金额为负数，付款金额与订单金额不相等，请重新输入！');
                return false;
            }
            for(var i = 0; i<pay_check_dm.length;i++){
                if(pay_check_je[i] != 0){
                    tipCont += '<div style="width: 100%;height:36px;overflow: hidden">' +
                        '<span style="float:left;width: 40%; margin-left: 10%">'+pay_check_mc[i]+':</span>' +
                        '<span style="float: left;width: 50%">'+pay_check_je[i]+'元</span>' +
                        '</div>';
                }
            }
        }else{
            //首先如果有选客户，验证客户的额度
            if(ishykh){
                var val_yf =  $('#pay_style li[data-type="fukuan"]').find('.billInput').val();
                if(val_yf > kyed){
                    wfy.alert("钱包金额大于用户可用额度！");
                    return false;
                }
            }
            if(pay_check_je_total > orderAmount){
                wfy.alert("输入的支付金额大于订单金额，请重新设置支付金额！");
                return false;
            }
            if((orderAmount - pay_check_je_total) > mlje){
                wfy.alert("支付总金额与订单金额相差较大，请重新设置支付金额！");
                return false;
            }
            for(var i = 0; i<pay_check_dm.length;i++){
                if(pay_check_je[i] != 0){
                    tipCont += '<div style="width: 100%;height:36px;overflow: hidden">' +
                        '<span style="float:left;width: 40%; margin-left: 10%">'+pay_check_mc[i]+':</span>' +
                        '<span style="float: left;width: 50%">'+pay_check_je[i]+'元</span>' +
                        '</div>';
                }
            }
            if((orderAmount - pay_check_je_total) != 0){
                tipCont +='支付金额与订单金额相差'+Components.sub(orderAmount , pay_check_je_total)+
                    '元,抹掉'+Components.sub(orderAmount , pay_check_je_total)+'元';
            }
        }
        if(tipCont =='您选择的支付信息<br>'){
            tipCont = '订单含有正负商品，总金额为0，请确认商品信息！'
        }
        wfy.confirm(tipCont,function () {
            //如果用户取消 支付，再次点击的时候 生成预订单失败。需要验证预订单的存在
            if(preOrdno == ''){
                createOrder();
            }else{
                //直接走支付
                //直接走支付
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
                weijiepay = getCommRequestBean()[2];
                console.error(weijiepay);
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

        },function () {

        });

    });

})
function dtl() {
    var vBiz = new FYBusiness("biz.pos.order.msg.qry");
    var vOpr1 = vBiz.addCreateService("svc.pos.order.msg.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.order.msg.qry");
    vOpr1Data.setValue("AS_PRECZHM", localStorage.yd_czhm);//00171000085441
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            //AC_HEAD,AC_PAYTYPE,AC_COUPON,AC_PREPAY,AC_PRODUCT,AC_GUIDE
            var AC_HEAD = vOpr1.getResult(d, "AC_HEAD").rows;
            var AC_PAYTYPE = vOpr1.getResult(d, "AC_PAYTYPE").rows;
            var AC_COUPON = vOpr1.getResult(d, "AC_COUPON").rows;
            var AC_PREPAY = vOpr1.getResult(d, "AC_PREPAY").rows;
            var AC_PRODUCT = vOpr1.getResult(d, "AC_PRODUCT").rows;
            var AC_GUIDE = vOpr1.getResult(d, "AC_GUIDE").rows;
            console.log(AC_HEAD)
            console.log(AC_PAYTYPE)
            console.log(AC_COUPON)
            console.log(AC_PREPAY)
            console.log(AC_PRODUCT)
            console.log(AC_GUIDE)
            savedata.czhm = AC_HEAD[0].kcczhm;
            savedata.xtxphm = AC_HEAD[0].xtxphm;
            kyed = AC_HEAD[0].hykyje;
            ishykh = wfy.empty(AC_HEAD[0].khhykh) ? false:true;
            console.log(ishykh);
            if(AC_HEAD.length != 0){
                $("#xiaopiao").html(AC_HEAD[0].xtxphm || "");
            }else {
                $("#xiaopiao").html("获取失败");
            }
            $('#dtl_createStore').val(AC_HEAD[0].xtwlmc).attr('data-wlmc',AC_HEAD[0].xtwldm);
            $('#dtl_createDate').val((AC_HEAD[0].kcczrq).slice(0,10));
            $('#dtl_createGuide').val(AC_GUIDE[0].xtyhxm).attr('data-dgdm',AC_GUIDE[0].kcdgdm);
            $('#dtl_createKehu').val(AC_HEAD[0].khhyxm).attr('data-hykh',AC_HEAD[0].khhykh);
            $('#pub_bottom_btn').html(botBtnHtml_dtl);

            console.log(data);
            var ksdmarr = [];
            for(var i = 0 ;i<AC_PRODUCT.length; i++){
                var objdata = {};
                objdata['ksdm'] = AC_PRODUCT[i].xtwpks;
                objdata['cont'] = [];
                objdata['ksmc'] = AC_PRODUCT[i].xtwpmc;
                var obj ={'color':'','price':'','num':'','style':'',"sku":'','ksmc':'','jldw':'','txhm':'','serialnum':'','wpdj':'','wppfdj':''};
                obj.color = AC_PRODUCT[i].xtysmc;
                obj.price = Math.abs(AC_PRODUCT[i].kcxsdj);//真正的价格
                obj.num = AC_PRODUCT[i].kcczsl;
                obj.style = AC_PRODUCT[i].xtwpxh;//
                obj.sku = AC_PRODUCT[i].xtwpdm;
                obj.ksmc = AC_PRODUCT[i].xtwpmc;
                obj.jldw = AC_PRODUCT[i].kcjldw;
                obj.txhm = '';
                obj.serialnum = '';
                obj.wpdj = AC_PRODUCT[i].kcxsje;//物品零售价
                obj.wppfdj = AC_PRODUCT[i].wppfjg;//物品批发价  201/-4-8 新增 批发价 ， 默认显示批发价

                if(i ==0){
                    objdata.cont.push(obj)
                    data.push(objdata);
                    ksdmarr.push(AC_PRODUCT[i].xtwpks);
                }else {
                    if(!ksdmarr.val_in_array(AC_PRODUCT[i].xtwpks)){
                        objdata.cont.push(obj)
                        data.push(objdata);
                        ksdmarr.push(AC_PRODUCT[i].xtwpks);
                    }else {
                        var index = ksdmarr.indexOf(AC_PRODUCT[i].xtwpks);
                        data[index].cont.push(obj);
                    }
                }
            }
            console.log(data)
            showDataDtl();
            if(ishykh){
                $('#pay_style li[data-type="fukuan"]').find('.billInput').val('');
                $('#pay_style li[data-type="fukuan"]').removeClass('none');//选中客户的时候，预付款方式出现
                $('#pay_style li[data-type="fukuan"]').removeClass('poschecked');//如果之前选了预付款，切换用户 清除选择
                $('#pay_style li').eq(1).find('i').html('可用：'+kyed);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage)
        }
    }) ;
}

function saveData() {
    var cont =[];
    for(var i = 0; i<data.length; i++){
        cont = cont.concat(data[i].cont);
    }
    if(cont.length ==0){
        wfy.alert('商品为零，保存失败！');
        return;
    }
    var vBiz = new FYBusiness("biz.pos.orde.wpdtl.save");

    var vOpr1 = vBiz.addCreateService("svc.pos.order.wpdtl.had.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.order.wpdtl.had.save");
    vOpr1Data.setValue("AS_KCCZHM", savedata.czhm);
    vOpr1Data.setValue("AS_KHHYKH", $('#dtl_createKehu').attr('data-hykh'));
    var vOpr2 = vBiz.addCreateService("svc.pos.order.wpdtl.delete", false);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.pos.order.wpdtl.delete");
    vOpr2Data.setValue("AS_KCCZHM", savedata.czhm);
    var vOpr3 = vBiz.addCreateService("svc.pos.orde.wpdtl.save", false);
    var vOpr3Data = [];
    for(var m = 0; m<cont.length; m++){
        var obj = {};
        obj.AS_USERID = LoginName;
        obj.AS_WLDM = DepartmentCode;
        obj.AS_FUNC = "svc.pos.order.wpdtl.delete";
        obj.AS_KCCZHM = savedata.czhm;
        obj.AS_XTWPDM = cont[m].sku;
        obj.AS_KCXSJE = $('#createLX').val() =="批发" ? cont[m].wppfdj :cont[m].wpdj;
        obj.AS_KCSSJE = cont[m].price;
        obj.AS_KCCZSL = cont[m].num;
        obj.AS_XTCXDM1 = '';
        obj.AS_XTCXDM2 = '';
        obj.AS_XTXSRY = $('#dtl_createGuide').attr('data-dgdm');
        obj.AS_XTZSYY = '';
        obj.AS_XTZPBZ = 'N';
        vOpr3Data.push(obj);
    }
    vOpr3.addDataArray(vOpr3Data)
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip));
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            console.log('成');
            wfy.alert('单据商品保存成功！',function () {
                window.location.reload()
            })
        } else {
            // todo...[d.errorMessage]
            wfy.alert('保存失败'+d.errorMessage)
        }
    }) ;
}























