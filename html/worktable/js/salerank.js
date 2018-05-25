var pageNum = 1 ;//页码
var loading = false;
var nowDate=new Date().format("yyyy-MM-dd");

var condition={
    girard : '',
    name : '',
    shop : '',
    orderfield : '0',
    ordertype : 'DESC',//升序降序
    begintime : nowDate,
    endtime : nowDate
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
                return !!date
            });
        },
        onOpen:function (values) {
            $("#begintime").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });

    $("#endtime").val(nowDate);
    /*$("#endtime").datetimePicker({
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
    });*/

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
        $("#begintime").val(nowDate);
        $("#endtime").val(nowDate);

    });

    //排序
    $('body').hammer().on('tap','#stock_head li',function (event) {
        event.stopPropagation();
        pageNum=1;
        $('#searlist').html("");
        $("#scrollload").addClass("none");


        var checkFiled="";
        $("#stock_head li").each(function () {
            var isCheck=$(this).children("span").hasClass("check");
            if(isCheck){
                checkFiled=$(this).attr("data-code");
            }

        });

        var sortcode=$(this).attr("data-code");

        if(checkFiled==sortcode){
            var sorttype=$(this).attr("data-sort");
            condition.orderfield = $(this).attr("data-field");

            if(sorttype=="DESC"){
                $(this).find('i').html('↑');
                $(this).attr("data-sort","ASC");
                condition.ordertype = 'ASC';
            }else{
                $(this).find('i').html('↓');
                $(this).attr("data-sort","DESC");
                condition.ordertype = 'DESC';
            }
        }else{
           $("#"+checkFiled).children("span").removeClass("check");
            $("#"+sortcode).children("span").addClass("check");

            condition.orderfield = $("#"+sortcode).attr("data-field");
            condition.ordertype = 'DESC';
        }

        getDatalist();
    });

    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();

        wfy.closesearch();
        condition.girard = $('#girard').val() || '';
        condition.name = $('#name').val() || '';
        condition.begintime = $('#begintime').val() || '';
        condition.endtime = $('#endtime').val() || '';

        $("#scrollload").addClass("none");
        $("#searlist").html("");
        pageNum=1;

        getDatalist();
    });

    getDatalist();

    $('#girard').focus();


});

//列表查询
function getDatalist() {
    wfy.showload();
    var vBiz = new FYBusiness("biz.sawork.unsalable_qry");

    var vOpr1 = vBiz.addCreateService("svc.sawork.unsalable_qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.sawork.unsalable_qry");
    vOpr1Data.setValue("AS_XTWPKS", condition.girard);
    vOpr1Data.setValue("AS_XTWPMC", condition.name);
    vOpr1Data.setValue("AS_QSRQ", condition.begintime);
    vOpr1Data.setValue("AS_JZRQ", condition.endtime);
    vOpr1Data.setValue("AS_XTWLDM", condition.shop);
    vOpr1Data.setValue("AS_SORTRULE", condition.ordertype);
    vOpr1Data.setValue("AS_SORTWAY", condition.orderfield);
    vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        wfy.hideload();
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
        //xtkcsl: 0xtlrrq: "2017-06-30"xtwpdm: "1640103620600S"xtwpks: "16401036"xtwpmc: "连帽羽绒大衣"xtwpxh: "00S"xtxssl: 0xtysmc: "深红色"xtzxts: "---"
        htmlStr+='<div class="list_1 list_swiper" style="height:84px; font-size:13px;">\
            <div class="list_item_1 thd ts200" data-code="'+temp.xtxphm+'" data-flag="'+temp.xsthbz+'">\
            <div class="item_line">\
            <span class="">货品：<span style="color:#000">'+temp.xtwpks+'/'+temp.xtysmc+'/'+temp.xtwpxh+'</span></span>\
        <span class="fr w30">销售数：<span style="color:#000">'+temp.xtxssl+'</span></span>\
        </div>\
        <div class="item_line">\
            <span class="">名称：<span>'+temp.xtwpmc+'</span></span>\
        <span class="fr w30">滞销天数：<span>'+temp.xtzxts+'</span></span>\
        </div>\
        <div class="item_line">\
            <span class="">最后销售日期：<span>'+temp.zhxsrq+'</span></span>\
            <span class="fr w30">库存数：<span>'+temp.xtkcsl+'</span></span>\
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
            //AC_RESULT_CORR
            var result = vOpr1.getResult(d, "AC_RESULT_CORR").rows || [];//获取公司名
            var mddm = vOpr2.getResult(d, "AC_RESULT_SHOP").rows || [];//获取店铺名
            var html="";
            for(var i = 0 ;i < mddm.length; i++){
                html += '<div class="lilit" data-mddm="'+mddm[i].mddm+'" style="line-height: 40px;text-align: center;border-bottom: #d9d9d9 solid 1px">'+mddm[i].mdmc+'</div>';
            }
            wfy.ios_alert(html);
            wfy.tap('.lilit',function (that) {
                var mdmc = $(that).html();
                condition.shop = $(that).attr('data-mddm');
                $('#shop').val(mdmc);
                wfy.ios_alert_close();
            })
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}
