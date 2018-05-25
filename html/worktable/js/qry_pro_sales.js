var pageNum = 1, loading = false;
var loadend = false;
var orderObj={
    content:"",
    isdisable:"N",//是否停用
    field:"",//排序字段--暂停使用
    order:""//排序方式--暂停使用
};

$(function () {
    getDataList();

    $('body').hammer().on('tap','#backBtn',function (event) {
        event.stopPropagation();

        wfy.pagegoto("../home/index");
    });

    wfy.tap('#sear',function () {
        $('header').addClass('none');
        $('.header_search').removeClass('none');
    })
    wfy.tap('.header_search_right',function () {
        $('header').removeClass('none');
        $('.header_search').addClass('none');
    });

    //监控 input 搜索事件
    $("#search").on('keypress',function(e) {
        var keycode = e.keyCode;
        orderObj.content = $(this).val();
        if(keycode=='13') {
            e.preventDefault();
            pageNum=1;
            $("#searlist").html("");
            if(loadend){
                getDataList();
            }
            $("#scrollload").addClass("none");
        }
    });

    //点击 去新增
    $('body').hammer().on('tap','#add',function (event) {
        event.stopPropagation();
        localStorage.recordcode="";
        wfy.pagegoto('qry_pro_salesdtl');
    });

    //点击 编辑
    $('body').hammer().on('tap','.list_item_1',function (event) {
        event.stopPropagation();
        localStorage.recordcode=getValidStr($(this).attr("data-code"));
        wfy.pagegoto('qry_pro_salesdtl');
    });

    //切换数据查询状态
    $('body').hammer().on("tap",'#mui-switch',function( event){
        event.stopPropagation();
        var style=$(this).attr("class");
        if(style.indexOf("mui-active")<0){
            //停用
           orderObj.isdisable="Y";
        }else{
            //启用
            orderObj.isdisable="N";
        }
        pageNum=1;
        $("#searlist").html("");
        getDataList();
        $("#scrollload").addClass("none");
    });

    //滑动 之 启用操作
    $('body').hammer().on('tap','.btnenable',function (event) {
        event.stopPropagation();
        var code = $(this).parents('.list_drap').attr('data-code');
        oper_changeStatus(code,"N");
    });

    //滑动 之 停用操作
    $('body').hammer().on('tap','.btndisable',function (event) {
        event.stopPropagation();
        var code = $(this).parents('.list_drap').attr('data-code');
        oper_changeStatus(code,"Y");
    });

    //点击 排序
    /*$('body').hammer().on('tap','#list_head li',function (event) {
        event.stopPropagation();

        var field=getValidStr($(this).attr("data-field"));
        var order=getValidStr($(this).attr("data-order"));

        if(field!=""){
            orderObj.field=field;
            orderObj.order=order;

            if(order=="ASC"){
                $(this).attr("data-order","DESC");
                $(this).find('i').html('▼');
            }else if(order=="DESC"){
                $(this).attr("data-order","ASC");
                $(this).find('i').html('▲');
            }
        }

        getDataList();
    });*/


});

//查询数据
function getDataList() {
    loadend = false;
    var vBiz = new FYBusiness("biz.ctlitem.itemlist.qry");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.itemlist.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.itemlist.qry");
    vOpr1Data.setValue("AS_SORTWAY", orderObj.field);
    vOpr1Data.setValue("AS_SORTRULE", orderObj.order);
    vOpr1Data.setValue("AS_XTTYBZ", orderObj.isdisable);
    vOpr1Data.setValue("AS_KEYWORD", orderObj.content);
    vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.log(JSON.stringify(ip));
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            var result = vOpr1.getResult(d, "AC_RESULT").rows || [];
            var num = vOpr1.getOutputPermeterMapValue(d, "AN_SL");
            var money = vOpr1.getOutputPermeterMapValue(d, "AN_JE");
            $("#tonum").html(num);
            $("#tomoney").html(wfy.setTwoNum(money));
            createPage(result)
        } else {
            wfy.alert("数据查询失败,"+d.errorMessage);
        }
    }) ;
}

//停用
function oper_changeStatus(record,status) {

    var title=""
    if(status=="Y"){
        title="停用";
    } else{
        title="启用";
    }

    var vBiz = new FYBusiness("biz.ctlitem.itemdisable.save");

    var vOpr1 = vBiz.addCreateService("svc.ctlitem.itemdisable.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.itemdisable.save");
    vOpr1Data.setValue("AS_XTWPKS", record);
    vOpr1Data.setValue("AS_XTTYBZ", status);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            wfy.alert(title+"成功",function () {
                pageNum=1;
                $("#searlist").html("");
                getDataList();
                $("#scrollload").addClass("none");
            });
        } else {
            wfy.alert(title+"失败,"+d.errorMessage);
        }
    }) ;

}

//生成列表页面
function createPage(rows){
    var htmlStr ="";

    if( pageNum == 1 && rows.length ==0){
        htmlStr = wfy.zero();
    }

    var btnStr=""
    if(orderObj.isdisable=="N"){
        btnStr='<div class="list_item_btn btndisable">停用</div>';
    }else{
        btnStr='<div class="list_item_btn btnenable">启用</div>';
    }

    for(var i=0;i<rows.length;i++){
        var temp=rows[i];

        htmlStr+='<div class="list_1 list_swiper" style="height:84px; font-size:13px;">' +
            '<div class="list_item_1 thd ts200" data-code="'+temp.xtwpks+'">' +
            '<div class="item_line">' +
            '<span class=""><span style="color:#000">'+temp.xtwpks+'</span></span>' +
            '</div>' +
            '<div class="item_line">' +
            '<span class="">名称：<span>'+temp.xtwpmc+'</span></span>' +
            '<span class="fr">操作时间：<span>'+temp.xtlrrq+'</span></span>' +
            '</div>' +
            '<div class="item_line">' +
            '<span class="">总库存：<span>'+temp.kczksl+'</span></span>' +
            '<span class="fr"><span style="color: red">￥'+temp.kczkje+'</span></span>' +
            '</div></div>' +
            '<div class="list_drap" data-code="'+temp.xtwpks+'">'+btnStr+'</div></div>';
    }
    loadend = true;
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
                    getDataList();
                    loading = false;
                }
            },1000);
        }

    });
}