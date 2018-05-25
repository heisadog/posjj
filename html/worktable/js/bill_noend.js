localStorage.his = "bill_noend";
localStorage.prev = "worktable";

var pageSize = 10,pageNum = 1,hasMore = false, isLoading = false;
var pageName = 'msa030_0900';
$(function () {
    getqx(function (res) {
        cbqx = res[0].xtcbqx;
        syqx = res[0].xtsyqx;
        console.log(cbqx);
        console.log(syqx);
    })
    getOrderList();
    //取消
    $("body").hammer().on("tap", ".btnde", function (event) {
        event.stopPropagation();
        var czhm = $(this).parent().attr("data-kcczhm");//操作号码
        wfy.confirm("是否取消预订单？",function () {
            cancelOrd(czhm);
        },function () {});
    });
    //支付
    $("body").hammer().on("tap", ".btnpay", function (event) {
        event.stopPropagation();
        $('#pay_style').html(payHtml).css({
            'padding-bottom':'70px'
        });
        $('#pub_bottom_btn').html(botBtnHtml_noend);

        if(syqx == 'N'){
            wfy.alert('抱歉，您未有收银权限！');
            return ;
        }
        orderAmount = $(this).parent().attr("data-ddyfje");//订单金额
        // if(orderAmount < 0){
        //     wfy.alert('此未结订单金额小于0，建议直接删除重新做单！')
        // }else {
        //     czhm = $(this).parent().attr("data-kcczhm");//操作号码
        //     var yhkh = $(this).parent().attr("data-khhyxm");//客户
        //     xtxphm = $(this).parent().attr("data-xtxphm");//
        //     kyed = wfy.empty($(this).parent().attr("data-hykyed")) ? 0 : Number($(this).parent().attr("data-hykyed"));//可用额度
        //     $('#pay_style li').eq(1).find('i').html('可用：'+kyed);
        //     ishykh = !wfy.empty(yhkh);
        //     if(ishykh){
        //         $('#pay_style li[data-type="fukuan"]').removeClass('none');
        //     }
        //     $('#totalMoney').html(orderAmount);
        //     wfy.openPay('pay_alert_box');
        // }
        czhm = $(this).parent().attr("data-kcczhm");//操作号码
        var yhkh = $(this).parent().attr("data-khhyxm");//客户
        xtxphm = $(this).parent().attr("data-xtxphm");//
        kyed = wfy.empty($(this).parent().attr("data-hykyed")) ? 0 : Number($(this).parent().attr("data-hykyed"));//可用额度
        $('#pay_style li').eq(1).find('i').html('可用：'+kyed);
        ishykh = !wfy.empty(yhkh);
        if(ishykh){
            $('#pay_style li[data-type="fukuan"]').removeClass('none');
        }
        $('#totalMoney').html(orderAmount);
        wfy.openPay('pay_alert_box');

    });
    //取消支付
    $("body").hammer().on("tap", "#cannoend", function (event) {
        event.stopPropagation();
        $('#wfyContList .list_item_1').removeClass('x_left_160');
        wfy.closePay();
    });
    //去 开单
    $("body").hammer().on("tap", "#modles", function (event) {
        event.stopPropagation();
        localStorage.page = 'msa030_0800';
        wfy.pagegoto('storeSale');
    });
    //点击选择 支付方式(当以预付款方式为主要支付方式的时候，需要验证 额度和商品金额)
    $('body').hammer().on('tap','#pay_style li .pay_inputandicon',function (event) {
        event.stopPropagation();
        var paytype = $(this).parent().attr('data-type');
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
    })
    //转单
    $("body").hammer().on("tap", ".btngo", function (event) {
        event.stopPropagation();
        var czhm = $(this).parent().attr("data-kcczhm");//操作号码
        saveFinalOrds(czhm);
    });
    //进入明细页
    $('body').hammer().on("tap",'#wfyContList .list_item_1',function (event) {
        event.stopPropagation();
        var clicked = $(event.target);//触发元素
        var czhm = $(this).attr('data-czhm');
        localStorage.yd_czhm = czhm;
        localStorage.page = 'msa030_0900';
        wfy.goto('bill_noend_dtl');
    })

});

function getOrderList(){//获取订单列表
    var vBiz = new FYBusiness("biz.pos.unfinishord.page.qry");
    var vOpr1 = vBiz.addCreateService("svc.pos.unfinishord.page.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.unfinishord.page.qry");
    vOpr1Data.setValue("AS_OPRER", LoginName);
    vOpr1Data.setValue("AN_PSIZE", pageSize);
    vOpr1Data.setValue("AN_PINDEX", pageNum);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var res = vOpr1.getResult(d, "AC_UNFINISHORD").rows;
            pageCreate(res);
        } else {
            wfy.alert("获取订单列表失败！");
        }
    }) ;
}

//生成页面
function pageCreate(rows) {
    var html = "";
    var result = rows;
    var b = '';
    if(pageNum == 1 && rows.length == 0){
        html= wfy.zero();
    }
    for (var i = 0; i<result.length; i++){
        if(result[i].kcczzt == '20'){
            b = '<div class="list_item_btn btngo">转单</div>';
        }else {
            b = '<div class="list_item_btn btnde">取消</div>' +
                '<div class="list_item_btn btnpay" style="background-color:#04BE02;">收银</div>';
        }
        html+='<div class="list_1 list_swiper" style="height:90px; font-size:13px;" ' +
            'data-hykyed="'+result[i].hykyed+'" ' +
            'data-khhyxm="'+result[i].khhyxm+'" ' +
            'data-kcczhm="'+result[i].kcczhm+'" ' +
            'data-ddyfje="'+result[i].ddyfje+'" ' +
            'data-xtwldm="'+result[i].xtwldm+'">'+
                '<div class="list_item_1 thd ts200" data-czhm="'+result[i].kcczhm+'">'+
                    '<div class="item_line">'+
                        '<span class="">小票号码：<span style="color:#000">'+result[i].xtxphm+'</span></span>'+
                         '<span class="fr">客户：' +
             '<span>'+(result[i].khhyxm || '<i style="visibility: hidden">刘光祥</i>')+'</span></span>'+
                    '</div>'+
                    '<div class="item_line">'+
                        '<span class="">支付状态：<span>'+result[i].czztmc+'</span></span>'+
                         '<span class="fr">开单人：<span>'+result[i].lrrymc+'</span></span>'+
                    '</div>'+
                    '<div class="item_line">'+
                        '<span class="">商品数量：<span>'+result[i].kcczsl+'</span></span>'+
                        '<span class="fr">应付金额：<span>'+wfy.setTwoNum(result[i].ddyfje,2)+'</span></span>'+
                    '</div>'+
                '</div>'+
                '<div class="list_drap"' +
                    'data-hykyed="'+result[i].hykyed+'" ' +
                    'data-khhyxm="'+result[i].khhyxm+'" ' +
                    'data-kcczhm="'+result[i].kcczhm+'" ' +
                    'data-ddyfje="'+result[i].ddyfje+'" ' +
                    'data-xtxphm="'+result[i].xtxphm+'" ' +
                    'data-xtwldm="'+result[i].xtwldm+'">'+b+
                '</div>'+
             '</div>';
    }
    $('#wfyContList').append(html);
    //分页 10个一组 ，加载动画初始化 不显示。带有none
    if(rows.length ==10){//一次性取10个，达到10个的时候，显示 加载动画
        $("#scrollload").removeClass("none");
    }
    if( pageNum > 1 && rows.length ==0){
        $("#scrollload span").html("没有更多了...");
        setTimeout(function () {
            $("#scrollload").addClass("none");
            $("#scrollload span").html("正在加载");
        },1000);
    }
    
    $("#wfyCont").scroll(function () {
        //loading 是根据 加载动画是否显示 判断
        if($("#wfyContList").Scroll() < 10){
            if(!$("#scrollload").hasClass("none")){
                isLoading = true;
            }
            setTimeout(function () {
                if(isLoading ){
                    pageNum ++;
                    getOrderList();
                    isLoading = false;
                }
            },1000);
        }

    });
}

//================================================================================


//将预订单转换为最终的订单保存最终的订单信息
function saveFinalOrds(czhm) {
    wfy.showload();
    var biz = new FYBusiness("biz.pos.preposexec.save");
    var svc = biz.addCreateService("svc.pos.preposexec.save", false);
    var data = svc.addCreateData();
    data.setValue("AS_USERID", LoginName);
    data.setValue("AS_WLDM", DepartmentCode);
    data.setValue("AS_FUNC", "svc.pos.preposexec.save");
    data.setValue("AS_PRECZHM", czhm);
    data.setValue("AS_KCCZHM","");
    data.setValue("AS_KCPDHM","");
    data.setValue("AS_THCZHM","");
    data.setValue("AS_THXPHM","");
    var ip = new InvokeProc("ture","proc");
    ip.addBusiness(biz);
    console.log(JSON.stringify(ip))
    ip.invoke(function (res) {
        wfy.hideload();
        console.log(res)
        if (res && res.success) {
            wfy.hideload();
            wfy.alert("订单生成成功",function () {
                $('#wfyContList').html("");
                pageNum=1;
                getOrderList();
            });
        } else {
            wfy.hideload();
            wfy.alert("预订单转换为正式订单失败！");
        }
    });
}

function cancelOrd(czhm){//取消预订单
    var vBiz = new FYBusiness("biz.pos.preposord.cancle");
    var vOpr1 = vBiz.addCreateService("svc.pos.preposord.cancle", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.preposord.cancle");
    vOpr1Data.setValue("AS_PRE_OPRER_NO", czhm);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            $('#wfyContList').html("");
            pageNum=1;
            getOrderList();
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}






