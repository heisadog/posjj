var pageNum = 1 ;//页码
var loading = false;
var pageType="Profit";
var nowDate=new Date().format("yyyy-MM-dd");
var initFlag=true;//页面初始化进入标志（点击查询之后为false）

var searchObj={
    girard:"",
    name:"",
    shop:"",
    begintime:nowDate,
    endtime:nowDate
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
    wfy.init();
    //查询类型切换
    $('body').hammer().on('tap','#stock_head li',function (event) {
        event.stopPropagation();
        $('#stock_head li').removeClass('sale_che');
        $(this).addClass('sale_che');
        pageType = $(this).attr("data-type");

        if(pageType=="Cost"){
            searchObj.begintime="";
            searchObj.endtime="";
        }else {
            if (initFlag) {
                $("#begintime").val(nowDate);
                $("#endtime").val(nowDate);
            }
            searchObj.begintime=getValidStr($("#begintime").val());
            searchObj.endtime=getValidStr($("#endtime").val());
        }
        pageNum=1;
        $('#searlist').html("");
        $("#scrollload").addClass("none");
        getDatalist();
    });

    //点击搜索
    wfy.tap('#modles',function (_this) {
        if(pageType == "Cost"){
            $('.topSearchBox li').eq(2).addClass('nobor');
            $('.topSearchBox li.jq_time').addClass('none');
        }else {
            $('.topSearchBox li.jq_time').removeClass('none');
            $('.topSearchBox li').eq(4).addClass('nobor');
        }

        wfy.opensearch('search');
    });
    //  选择 门店
    $('body').hammer().on('tap','#shop',function (event) {
        event.stopPropagation();
        getShopName();
    });

    //开始日期
    $("#begintime").val(nowDate);
    $("#begintime").datetimePicker({
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
                return !!t;
            });
        },
        onOpen:function (values) {
            $("#begintime").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });

    //截止日期
    $("#endtime").val(nowDate);
    $("#endtime").datetimePicker({
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
                return !!t;
            });
        },
        onOpen:function (values) {
            $("#endtime").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });

    //  x清除
    $('body').hammer().on('tap','.topSearchBox li .delethis',function (event) {
        event.stopPropagation();
        $(this).prev().val('');

        if(getValidStr($(this).prev().attr("id"))=="shop"){
            searchObj.shop="";
        }

        if(getValidStr($(this).prev().attr("id"))=="begintime"){
            $("#begintime").val(nowDate);
        }

        if(getValidStr($(this).prev().attr("id"))=="endtime"){
            $("#endtime").val(nowDate);
        }
    });

    // 清除
    $('body').hammer().on('tap','#clear',function (event) {
        event.stopPropagation();
        $('.topSearchBox li input').val('');

        searchObj.shop="";

        if(pageType!="Cost"){
            $("#begintime").val(nowDate);
            $("#endtime").val(nowDate);
        }
    });

    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();

        initFlag=false;
        $('input').blur();
        pageNum=1;
        $('#searlist').html("");
        $("#scrollload").addClass("none");

        searchObj.girard=getValidStr($("#girard").val());
        searchObj.name=getValidStr($("#name").val());
        searchObj.begintime=getValidStr($("#begintime").val());
        searchObj.endtime=getValidStr($("#endtime").val());

        wfy.closesearch();
        getDatalist();

    });
    getDatalist();
});

//获取 公司及网店 信息
function getShopName() {
    var vBiz = new FYBusiness("biz.home.corr.qry");
    var vOpr1 = vBiz.addCreateService("svc.home.corr.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.home.corr.qry");
    var vOpr2 = vBiz.addCreateService("svc.home.shop.qry", false);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.home.shop.qry");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var result = vOpr1.getResult(d, "AC_RESULT_CORR").rows || [];//获取公司名
            var mddm = vOpr2.getResult(d, "AC_RESULT_SHOP").rows || [];//获取店铺名
            var html="";
            for(var i = 0 ;i < mddm.length; i++){
                html += '<div class="lilit" data-mddm="'+mddm[i].mddm+'" style="line-height: 40px;text-align: center;border-bottom: #d9d9d9 solid 1px">'+mddm[i].mdmc+'</div>';
            }
            wfy.ios_alert(html);
            wfy.tap('.lilit',function (that) {
                var mdmc = $(that).html();
                searchObj.shop = $(that).attr('data-mddm');
                $('#shop').val(mdmc);
                wfy.ios_alert_close();
            })
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}


//构建页面
function createPage(result,num,money) {
    var html = "";
    if (result.length == 0 && pageNum == 1) {
        html = wfy.zero();
    }

    if(pageType=="Profit") {//生成销售利润页面
        for (var i = 0; i < result.length; i++) {
            html +='<div class="wfyitem_list">' +
                '<div class="wfyitem_line"> ' +
                '<span class="black" style="width: 60%">编码：'+result[i].xtwpdm+'/'+result[i].xtysmc+'/'+result[i].xtwpxh+'</span>' +
                '<span class="fr"  style="color: red;width: 40%;">销售利润：'+wfy.setTwoNum(result[i].kcxslr)+'</span>' +
                '</div>' +
                '<div class="wfyitem_line">' +
                '<span class="fl" style="width: 60%;">名称：'+(result[i].xtwpmc || " ")+'</span>' +
                '<span class="fr" style="width: 40%;">销售成本：'+wfy.setTwoNum(result[i].kcxscb || 0)+'</span>' +
                ' </div> ' +
                '<div class="wfyitem_line">' +
                '<span class="fl" style="width: 60%;">销售数：'+(result[i].kcczsl || 0)+'</span>' +
                '<span class="fr" style="width: 40%;">销售额：'+wfy.setTwoNum(result[i].kcssje || 0)+'</span>' +
                ' </div> ' +
                '</div>';
        }

        $("#num").html('销售数：<span style="color:red;">'+num||0+'</span>');
        $("#money").html('利润数：<span style="color:red;">'+wfy.setTwoNum(money)+'</span>');

    }else{//生成库存成本页面
        for (var i = 0; i < result.length; i++) {
            html +='<div class="wfyitem_list">' +
                '<div class="wfyitem_line"> ' +
                '<span class="black" style="width: 60%">编码：'+result[i].xtwpks+'/'+result[i].xtysmc+'/'+result[i].xtwpxh+'</span>' +
                '<span class="fr" style="width: 40%;">名称：'+result[i].xtwpmc+'</span>' +
                '</div>' +
                '<div class="wfyitem_line">' +
                '<span class="fl" style="width: 60%;">库存数：'+(result[i].kczksl || 0)+'</span>' +
                '<span class="fr" style="width: 40%;">库存成本：'+wfy.setTwoNum(result[i].kckccb)+'</span>' +
                ' </div> ' +
                '</div>';
        }

        $("#num").html('库存数：<span style="color:red;">'+num||0+'</span>');
        $("#money").html('库存成本：<span style="color:red;">'+wfy.setTwoNum(money)+'</span>');
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
                if(loading){
                    pageNum ++;
                    console.log(pageNum)
                    loading = false;
                    getDatalist();
                }
            },1000);
        }

    });
}

var getDatalist = function () {
    if(pageType=="Profit"){
        var vBiz = new FYBusiness("biz.invqry.saleprofit.qry");

        var vOpr1 = vBiz.addCreateService("svc.invqry.saleprofit.qry", false);
        var vOpr1Data = vOpr1.addCreateData();
        vOpr1Data.setValue("AS_USERID", LoginName);
        vOpr1Data.setValue("AS_WLDM", DepartmentCode);
        vOpr1Data.setValue("AS_FUNC", "svc.invqry.saleprofit.qry");
        vOpr1Data.setValue("AS_XTWPKS", searchObj.girard);
        vOpr1Data.setValue("AS_XTWPMC", searchObj.name);
        vOpr1Data.setValue("AS_XTMDDM", searchObj.shop);
        vOpr1Data.setValue("AS_QSRQ", searchObj.begintime);
        vOpr1Data.setValue("AS_JZRQ", searchObj.endtime);
        vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
        vOpr1Data.setValue("AN_PAGE_SIZE", "20");

        var ip = new InvokeProc();
        ip.addBusiness(vBiz);
        console.log(JSON.stringify(ip));
        ip.invoke(function(d){
            if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

                var list = vOpr1.getResult(d, "AC_RESULT").rows || [];
                var num = vOpr1.getOutputPermeterMapValue(d, "AN_SL");
                var money = vOpr1.getOutputPermeterMapValue(d, "AN_JE");
                console.log(list)
                createPage(list,num,money);
            } else {
                wfy.alert(d.errorMessage);
            }
        }) ;
    }else{
        var vBiz = new FYBusiness("biz.invqry.stockcost.qry");

        var vOpr1 = vBiz.addCreateService("svc.invqry.stockcost.qry", false);
        var vOpr1Data = vOpr1.addCreateData();
        vOpr1Data.setValue("AS_USERID", LoginName);
        vOpr1Data.setValue("AS_WLDM", DepartmentCode);
        vOpr1Data.setValue("AS_FUNC", "svc.invqry.stockcost.qry");
        vOpr1Data.setValue("AS_XTWPKS", searchObj.girard);
        vOpr1Data.setValue("AS_XTWPMC", searchObj.name);
        vOpr1Data.setValue("AS_XTMDDM", searchObj.shop);
        vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
        vOpr1Data.setValue("AN_PAGE_SIZE", '20');
        var ip = new InvokeProc();
        ip.addBusiness(vBiz);
        console.log(JSON.stringify(ip));
        ip.invoke(function(d){
            if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                var list = vOpr1.getResult(d, "AC_RESULT").rows || [];
                console.log(list)
                var num = vOpr1.getOutputPermeterMapValue(d, "AN_SL");
                var money = vOpr1.getOutputPermeterMapValue(d, "AN_JE");

                createPage(list,num,money);
            } else {
                wfy.alert(d.errorMessage);
            }
        }) ;
    }

}

