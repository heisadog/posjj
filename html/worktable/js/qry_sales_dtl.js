var pageNum = 1 ;//页码
var loading = false;

var nowDate=new Date().format("yyyy-MM-dd");
var searchObj={
    girard:"",
    name:"",
    customer:"",
    staff:"",
    shop:"",
    startdate:nowDate,
    enddate:nowDate,
    querytype:"KS",//查询字段
    ordercode:"SL",//排序字段
    ordertype:"ASC",//排序方式
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

    getDataList();

    //点击搜索
    wfy.tap('#modles',function (_this) {
        wfy.opensearch('search');
    });

    //  选择 门店
    $('body').hammer().on('tap','#shop',function (event) {
        event.stopPropagation();
        getShopName();
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
    })
    // 清除
    $('body').hammer().on('tap','#clear',function (event) {
        event.stopPropagation();
        $('.topSearchBox li input').val('');
    })
    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();
        //机具优化 解决查询的时候，会弹出选择时间
        $(".weui-picker-container").removeClass("weui-picker-modal-visible");
        $('input').blur();
        
        pageNum=1;
        $('#searlist').html("");

        searchObj.girard=getValidStr($("#girard").val());
        searchObj.name=getValidStr($("#name").val());
        searchObj.customer=getValidStr($("#customer").val());
        searchObj.staff=getValidStr($("#staff").val());
        searchObj.startdate=getValidStr($("#startdate").val());
        searchObj.enddate=getValidStr($("#enddate").val());

        wfy.closesearch();
        getDataList();
    })
    //排序
    $('body').hammer().on('tap','#stock_head li',function (event) {
        event.stopPropagation();
        pageNum=1;
        $('#searlist').html("");

        var index = $(this).index();
        if(index == 0 || index ==1){

            $('#stock_head li').eq(0).find('span').removeClass('check');
            $('#stock_head li').eq(1).find('span').removeClass('check');
            $(this).find('span').addClass('check');

            searchObj.querytype = $(this).attr('data-type');
        }
        if(index == 2 || index ==3){
            $('#stock_head li').eq(2).find('span').removeClass('check');
            $('#stock_head li').eq(3).find('span').removeClass('check');
            $(this).find('span').addClass('check');

            searchObj.ordercode = $(this).attr('data-type');

            var htm = $(this).find('i').html();
            if(htm == '↓'){
                $(this).find('i').html('↑');
                searchObj.ordertype = 'ASC';
            }else {
                $(this).find('i').html('↓');
                searchObj.ordertype = 'DESC';
            }
        }

        getDataList();
    })

});

function getDataList() {

    var vBiz = new FYBusiness("biz.sawork.sale.qry");

    var vOpr1 = vBiz.addCreateService("svc.sawork.sale.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.sawork.sale.qry");
    vOpr1Data.setValue("AS_XTWPKS", searchObj.girard);
    vOpr1Data.setValue("AS_XTWPMC", searchObj.name);
    vOpr1Data.setValue("AS_XTKHHY", searchObj.customer);
    vOpr1Data.setValue("AS_XSMDDY", searchObj.staff);
    vOpr1Data.setValue("AS_XSQSRQ", searchObj.startdate);
    vOpr1Data.setValue("AS_XSJZRQ", searchObj.enddate);
    vOpr1Data.setValue("AS_XTWPPP", "");
    vOpr1Data.setValue("AS_XSCXFS", searchObj.querytype);//查询方式：按款式-'KS' | 按商品-'WP'
    vOpr1Data.setValue("AS_XSPXFS", searchObj.ordercode);//排序方式：按库存数-'SL' | 按库存额-'JE'
    vOpr1Data.setValue("AS_XSPXLX", searchObj.ordertype);//排序类型：升序-'ASC' | 降序-'DESC'
    vOpr1Data.setValue("AS_MDDM", searchObj.shop);//门店代码
    vOpr1Data.setValue("AN_PAGE_NUM", pageNum);//第几页
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");//每页条数

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var list = vOpr1.getResult(d, "AC_LIST").rows || [];
            var toje = vOpr1.getResult(d, "AC_SUM").rows || [];
            $('#tonum').html(toje[0].kcczsl);
            $('#toje').html(wfy.setTwoNum(toje[0].kcssje,2));
            createPage(list);

        } else {
            wfy.alert(d.errorMessage)
        }
    }) ;
}

function createPage(list) {
    var html ="";

    if( pageNum == 1 && list.length ==0){
        html = wfy.zero();
        $("#scrollload").addClass("none");
    }

    for(var i = 0; i<list.length;i++){
        html +='<div class="wfyitem_list">' +
                    '<div class="wfyitem_line">'+
                        '<span class="black">'+list[i].xtwpks+'</span> ' +
                    '</div> ' +
                    '<div class="wfyitem_line"> ' +
                        '<span>'+wfy.cutstr(list[i].xtwpmc,12)+'</span>' +
                        '<span class="fr" style="width: 50%;">上架日期：'+list[i].xtlrrq+'</span>' +
                    '</div>' +
                    '<div class="wfyitem_line" style="color: red";>' +
                        '<span class="fl" style="width: 50%;">实销数：'+(list[i].kcczsl || 0)+'</span>' +
                        '<span>实销额：'+(list[i].kcssje || 0)+'</span>' +
                    ' </div> ' +
                '</div>';
    }
    $('#searlist').append(html);
    if(list.length ==20){
        $("#scrollload").removeClass("none");
    }

    if( pageNum > 1 && list.length ==0){
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
                    getDataList();
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
                searchObj.shop = $(that).attr('data-mddm');
                $('#shop').val(mdmc);
                wfy.ios_alert_close();
            })
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}



