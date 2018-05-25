var pageNum = 1 ;//页码
var loading = false;
var tabType = "0";//标签页类型 0 销售单、1 退货单
var nowDate=new Date().format("yyyy-MM-dd");

var condition={
    ordercode : '',
    customer : '',
    begintime : nowDate,
    endtime : nowDate,
    tabtype : '0'
};

var pagetype="list";

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

    $('body').hammer().on('tap','#back',function (event) {
        event.stopPropagation();

        localStorage.searchtype="list";
    });

    //查询类型切换
    $('body').hammer().on('tap','#stock_head li',function (event) {
        event.stopPropagation();

        $('#stock_head li').removeClass('sale_che');
        $(this).addClass('sale_che');

        tabType=$(this).attr("data-tab");
        condition.tabtype=tabType;

        pageNum=1;
        $("#scrollload").addClass("none");
        $('#searlist').html("");
        getDatalist();
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
                return !!date
            });
        },
        onOpen:function (values) {
            $("#begintime").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });

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
                return !!date
            });
        },
        onOpen:function (values) {
            $("#endtime").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });

    //点击搜索
    wfy.tap('#modles',function (_this) {
        wfy.opensearch('search');
    });

    //  x清除
    $('body').hammer().on('tap','.topSearchBox li .delethis',function (event) {
        event.stopPropagation();
        $(this).prev().val('');

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

    });

    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();

        wfy.closesearch();
        condition.ordercode = $('#ordercode').val() || '';
        condition.customer = $('#customer').val() || '';
        condition.begintime = $('#begintime').val() || '';
        condition.endtime = $('#endtime').val() || '';
        condition.tabtype = tabType;

        $("#scrollload").addClass("none");
        $("#searlist").html("");

        getDatalist();
    });

    //点击 明细查询
    $('body').hammer().on('tap','.list_item_1',function (event) {
        event.stopPropagation();
        localStorage.saleordercode=getValidStr($(this).attr("data-code"));
        //localStorage.saleordertype="show";
        localStorage.searchtype="dtl";
        localStorage.searchCondition=JSON.stringify(condition);

        localStorage.returnFlag=getValidStr($(this).attr("data-flag"))=="N"?"Y":"N";//允许退货标志

        if(tabType=="1") {
            localStorage.returnFlag="N";
        }

        wfy.pagegoto('qry_salesdtl');
    });

    //滑动 之 退货操作
    /*$('body').hammer().on('tap','.btnreturn',function (event) {
        event.stopPropagation();
        localStorage.saleordercode = $(this).parents('.list_drap').attr('data-code');
        localStorage.saleordertype="oper";
        localStorage.searchtype="dtl";
        localStorage.searchCondition=JSON.stringify(condition);
        wfy.pagegoto('qry_salesdtl');
    });*/

    getDatalist();

    $('#ordercode').focus();


});

//列表查询
function getDatalist() {
    var type=tabType;

    if(getValidStr(localStorage.searchtype)!=""&&localStorage.searchtype!=pagetype){
        var tempObj=JSON.parse(localStorage.searchCondition);
        condition.ordercode=tempObj.ordercode;
        condition.customer=tempObj.customer;
        condition.begintime=tempObj.begintime;
        condition.endtime=tempObj.endtime;

        $('#ordercode').val(condition.ordercode);
        $('#customer').val(condition.customer);
        $('#begintime').val(condition.begintime);
        $('#endtime').val(condition.endtime);

        if(tabType!=tempObj.tabtype){
            type=tempObj.tabtype;

            if(tempObj.tabtype=="0"){
                $('#stock_head li').eq(1).removeClass('sale_che');
                $('#stock_head li').eq(0).addClass('sale_che');
            }else{
                $('#stock_head li').eq(0).removeClass('sale_che');
                $('#stock_head li').eq(1).addClass('sale_che');
            }
        }

        localStorage.searchtype="list";
    }

    var vBiz = new FYBusiness("biz.pos.orderlist.qry");

    var vOpr1 = vBiz.addCreateService("svc.pos.orderlist.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.orderlist.qry");
    vOpr1Data.setValue("AS_XTXPHM", condition.ordercode);
    vOpr1Data.setValue("AS_KHHYXM", condition.customer);
    vOpr1Data.setValue("AS_BEGINDATE", condition.begintime);
    vOpr1Data.setValue("AS_ENDDATE", condition.endtime);
    vOpr1Data.setValue("AS_TYPE", type);
    vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var result = vOpr1.getResult(d, "AC_RESULT").rows || [];

            var num = vOpr1.getOutputPermeterMapValue(d, "AN_SL")||0;
            var money = vOpr1.getOutputPermeterMapValue(d, "AN_JE")||0;

            $("#ordernum").html(num);
            $("#money").html(money);

            createPage(result);
        }else{
            wfy.alert("查询失败");
        }
    }) ;
}

//构建页面
function createPage(rows) {
    var htmlStr ="";

    if( pageNum == 1 && rows.length ==0){
        htmlStr = wfy.zero();
    }


    for(var i=0;i<rows.length;i++){
        var temp=rows[i];
        //temp.xsthbz 已退货标志
        htmlStr+='<div class="list_1 list_swiper" style="height:84px; font-size:13px;">\
            <div class="list_item_1 thd ts200" data-code="'+temp.xtxphm+'" data-flag="'+temp.xsthbz+'">\
            <div class="item_line">\
            <span class="">小票号：<span style="color:#000">'+temp.xtxphm+'</span></span>\
        <span class="fr w30">客户：<span style="color:#000">'+(temp.khhyxm || '')+'</span></span>\
        </div>\
        <div class="item_line">\
            <span class="">数量：<span>'+temp.saleqty+'</span></span>\
        <span class="fr w30">金额：<span>'+temp.salemoney+'</span></span>\
        </div>\
        <div class="item_line">\
            <span class="">交易时间：<span>'+temp.kcczrq+'</span></span>\
        </div>\
        </div>\
        </div>';
    }

    $("#searlist").append(htmlStr);

    if(rows.length ==20){
        $("#scrollload").removeClass("none");
    }
    if( pageNum > 1 && rows.length ==0){
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
