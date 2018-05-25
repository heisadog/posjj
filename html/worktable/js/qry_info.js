var pageNum=1;
var loading = false;
var nowDate=new Date().format("yyyy-MM-dd");
var pageType = "Pay";//页面类型
var total_money=0;
var shopArr=[];

var searchObj={
    shop:'',
    startdate:nowDate,
    enddate:nowDate
};

wfy.opensearch = function (s) {
    $("#cover").removeClass("none");
    $("#" + s).removeClass("y_100");
}
wfy.closesearch = function () {
    $("#cover").addClass("none");
    $(".selectTopBox").addClass("y_100");
}

$(function () {
    getShopInfo();

    //查询类型切换
    $('body').hammer().on('tap','#stock_head li',function (event) {
        event.stopPropagation();

        $('#stock_head li').removeClass('sale_che');
        $(this).addClass('sale_che');
        pageType = $(this).attr("data-type");

        pageNum=1;
        $('#searlist').html("");
        getDatalist();
    });

    //点击搜索
    wfy.tap('#modles',function (_this) {

        wfy.opensearch('search');
    });

    //店铺
    $('body').hammer().on('tap','#shop',function (event) {
        event.stopPropagation();

        var list = "";
        for(var i = 0; i<shopArr.length; i++){
            list +='<div class="item" style="text-align: center" data-code="'+shopArr[i].kcckdm+'">'+shopArr[i].kcckmc+'</div>';
        }

        $('#comboBox').html(list);
        wfy.openWin('comboBox');
    });

    //点击选中某个下拉值
    $('body').hammer().on('tap','#comboBox .item',function (event) {
        event.stopPropagation();

        var mddm = $(this).attr('data-code');
        var mdmc = $(this).html();
        $('#shop').val(mdmc);
        $('#shop').attr("data-code",mddm);

        wfy.closeWin();
    });

    $('body').hammer().on('tap','#cover',function (event) {
        event.stopPropagation();

        wfy.closesearch();
        wfy.closeWin('comboBox');
    });

    //开始日期
    $("#startdate").val(nowDate);
    $("#startdate").datetimePicker({
        title: '开始日期',
        //min: "1990-12-12",
        //max: "2022-12-12",
        monthNames:"",
        times:function(){
            var  year=[];
            return year;//可以实现 去掉 时分秒！
        },
        parse: function(date) {
            return date.split(/\D/).filter(function(t) {
                return !!date
            });
        },
        onOpen:function (values) {
            $("#startdate").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });

    //截止日期
    $("#enddate").val(nowDate);
    $("#enddate").datetimePicker({
        title: '截止日期',
        //min: "1990-12-12",
        //max: "2022-12-12",
        monthNames:"",
        times:function(){
            var  year=[];
            return year;//可以实现 去掉 时分秒！
        },
        parse: function(date) {
            return date.split(/\D/).filter(function(t) {
                return !!date
            });
        },
        onOpen:function (values) {
            $("#enddate").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });

    //  x清除
    $('body').hammer().on('tap','.topSearchBox li .delethis',function (event) {
        event.stopPropagation();
        $(this).prev().val('');
        if(getValidStr($(this).prev().attr("id"))=="startdate"){
            $("#startdate").val(nowDate);
        }

        if(getValidStr($(this).prev().attr("id"))=="enddate"){
            $("#enddate").val(nowDate);
        }
    });

    // 清除
    $('body').hammer().on('tap','#clear',function (event) {
        event.stopPropagation();
        $('.topSearchBox li input').val('');
    });

    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();
        $('input').blur();
        pageNum=1;
        $('#searlist').html("");

        searchObj.shop=getValidStr($("#shop").attr("data-code"));
        searchObj.startdate=getValidStr($("#startdate").val());
        searchObj.enddate=getValidStr($("#enddate").val());

        wfy.closesearch();
        getDatalist();
    });

    getDatalist();

});

function getDatalist() {
    if(pageType=="Pay"){//客户欠款查询

        var vBiz = new FYBusiness("biz.sawork.salepay.qry");

        var vOpr1 = vBiz.addCreateService("svc.sawork.salepay.qry", false);
        var vOpr1Data = vOpr1.addCreateData();
        vOpr1Data.setValue("AS_USERID", LoginName);
        vOpr1Data.setValue("AS_WLDM", DepartmentCode);
        vOpr1Data.setValue("AS_FUNC", "svc.sawork.salepay.qry");
        vOpr1Data.setValue("AS_QSRQ", searchObj.startdate);
        vOpr1Data.setValue("AS_JZRQ", searchObj.enddate);
        vOpr1Data.setValue("AS_XTWLDM", searchObj.shop);

        var ip = new InvokeProc();
        ip.addBusiness(vBiz);
        ip.invoke(function(d){
            if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                var list = vOpr1.getResult(d, "AC_RESULT").rows || [];
                total_money = vOpr1.getOutputPermeterMapValue(d, "AN_JE");

                if(Number(total_money)<0){
                    $("#total_money").attr("style","color:red;");
                }else{
                    $("#total_money").attr("style","");
                }

                $("#total_money").html(Number(total_money).toFixed(2));
                createPage(list);

            } else {
                wfy.alert(d.errorMessage)
            }
        }) ;
    }else{//交易流水查询

        var vBiz = new FYBusiness("biz.sawork.saledetail.qry");

        var vOpr1 = vBiz.addCreateService("svc.sawork.saledetail.qry", false);
        var vOpr1Data = vOpr1.addCreateData();
        vOpr1Data.setValue("AS_USERID", LoginName);
        vOpr1Data.setValue("AS_WLDM", DepartmentCode);
        vOpr1Data.setValue("AS_FUNC", "svc.sawork.saledetail.qry");
        vOpr1Data.setValue("AS_QSRQ", searchObj.startdate);
        vOpr1Data.setValue("AS_JZRQ", searchObj.enddate);
        vOpr1Data.setValue("AS_XTWLDM", searchObj.shop);
        vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
        vOpr1Data.setValue("AN_PAGE_SIZE", "20");

        var ip = new InvokeProc();
        ip.addBusiness(vBiz);
        ip.invoke(function(d){
            if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                var list = vOpr1.getResult(d, "AC_RESULT").rows || [];
                total_money = vOpr1.getOutputPermeterMapValue(d, "AN_JE");

                if(Number(total_money)<0){
                    $("#total_money").attr("style","color:red;");
                }else{
                    $("#total_money").attr("style","");
                }

                $("#total_money").html(Number(total_money).toFixed(2));
                createPage(list);

            } else {
                wfy.alert(d.errorMessage)
            }
        }) ;
    }


}
//处理数据
function createPage(result) {

    if(pageType=="Pay") {//生成客户欠款页面
        var html = "";
        if (result.length == 0) {
            html = wfy.zero();
        }


        $('#tablehead').html('<ul class="stock_head" id="cale_tab" style="text-align: center;">\
                                     <li style="width: 30%">交易类型</li>\
                                     <li style="width: 30%">支付方式</li>\
                                     <li style="width: 40%">支付金额</li>\
                                 </ul>');

        for (var i = 0; i < result.length; i++) {
            if(result[i].kcfkfs!="08"){//预付款 不显示
                html += '<div class="">' +
                    '<ul class="stock_head_sell">' +
                    '<li style="width: 30%;text-align: center;">' + result[i].xsxflx + '</li>'+
                    '<li style="width: 30%;text-align: center;">' + result[i].xsjssm + '</li>'+
                    '<li style="width: 40%;text-align: center;">' + Number(result[i].kcxsje).toFixed(2) + '</li>' +
                    '</ul>' +
                    '</div>';
            }

        }

        $("#scrollload").addClass("none");
        $("#searlist").html(html);

    }else{//生成交易流水页面

        var html = "";
        if (pageNum == 1 && result.length == 0) {
            html = wfy.zero();
        }


        $('#tablehead').html('<ul class="stock_head" id="cale_tab" style="text-align: center;">\
                                     <li style="width: 30%">小票号</li>\
                                     <li style="width: 25%">支付方式</li>\
                                     <li style="width: 20%">金额</li>\
                                     <li style="width: 25%">日期</li>\
                                 </ul>');
        for (var i = 0; i < result.length; i++) {
            html += '<div class="">' +
                '<ul class="stock_head_sell">' +
                '<li style="width: 30%;text-indent: 12px;text-align: center;">' +
                '<span>' + result[i].xtxphm + '</span><br>' +
                '</li>' +
                '<li style="width: 25%;text-indent: 12px;text-align: center;">' + result[i].xsjssm + '</li>' +
                '<li style="width: 20%;text-align: center;">' + (result[i].kcxsje).toFixed(2) + '</li>' +
                '<li style="width: 25%;text-align: center;"><span style="color: #999">' + result[i].kcczrq + '</span></li>' +
                  '</ul>' +
                  '</div>';
        }

        $("#searlist").append(html);

        if(result.length ==20){
            $("#scrollload").removeClass("none");
        }
        if( pageNum > 1 && result.length ==0){
            $("#scrollload span").html("没有更多了...");
            setTimeout(function () {
                $("#scrollload").addClass("none");
                $("#scrollload span").html("正在加载");
            },1000);
        }

        $(".wfyContList").scroll(function () {
            //loading 是根据 加载动画是否显示 判断
            if($("#cont").Scroll() < 10){
                if(!$("#scrollload").hasClass("none")){
                    loading = true;
                }
                setTimeout(function () {
                    if(loading ){
                        pageNum ++;
                        getDatalist();
                        loading = false;
                    }
                },1000);
            }

        });
    }
}

//获取搜索条件中的店铺信息
function getShopInfo() {
    var bizOrderStore = new FYBusiness("biz.yaohuodan.input.ck");
    var svcOrderStore = bizOrderStore.addCreateService("svc.yaohuodan.input.ck", false);
    var dataOrderStore = svcOrderStore.addCreateData();
    dataOrderStore.setValue("AS_USERID", LoginName);
    dataOrderStore.setValue("AS_WLDM", DepartmentCode);
    dataOrderStore.setValue("AS_FUNC", "svc.yaohuodan.input.ck");
    dataOrderStore.setValue("AS_YHWLDM", DepartmentCode);
    var ip = new InvokeProc();
    ip.addBusiness(bizOrderStore);
    ip.invoke(function (res) {
        if (res && res.success) {
            var resOrderStore = svcOrderStore.getResult(res, "AC_DHKLIST").rows || [];//订货库
            var resOrderDepart = svcOrderStore.getResult(res, "AC_DHDW").rows || [];//订货单位

            shopArr=resOrderStore;
        } else {
            wfy.alert("获取店铺信息失败！");
        }
    });
}

