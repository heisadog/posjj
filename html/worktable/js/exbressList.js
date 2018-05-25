/**
 * Created by WFY2016 on 2018/1/24.
 */
var pageIndex=1,loading=false;
wfy.opensearch = function (s) {
    $("#cover").removeClass("none");
    $("#" + s).removeClass("y_100");
}
wfy.closesearch = function () {
    $("#cover").addClass("none");
    $(".selectTopBox").addClass("y_100");
}
$(function () {
    //返回
    $('body').hammer().on('tap','#backBtn',function (event) {
        event.stopPropagation();
        wfy.pagegoto("../home/index");
    });
    //去添加
    $('body').hammer().on('tap','#add',function (event) {
        event.stopPropagation();
        wfy.pagegoto('exbress');
    })
    getlist('');
    //去详情
    $('body').hammer().on('tap','#wfyContList .list_swiper',function (event) {
        event.stopPropagation();
        var code = $(this).attr('data-code');
        localStorage.sfcode = code;
        wfy.pagegoto('exbressListDtl');
    })
    //点击搜索
    wfy.tap('#modles',function (_this) {
        wfy.opensearch('search');
    });
    // 清除
    $('body').hammer().on('tap','#clear',function (event) {
        event.stopPropagation();
        $('.topSearchBox li input').val('');
    })
    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();
        $("#wfyContList").html("");
        pageIndex=1;
        $("#scrollload").addClass("none");
        var mail = $('#ks').val();
        wfy.closesearch();
        getlist(mail)

    })
})
var getlist = function (mailno) {
    var vBiz = new FYBusiness("biz.logisticstracking.list.qry");
    var vOpr1 = vBiz.addCreateService("svc.logisticstracking.list.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.logisticstracking.list.qry");
    vOpr1Data.setValue("AS_MAILNO", mailno);
    vOpr1Data.setValue("AN_PAGE_NUM",pageIndex);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var menuRows=vOpr1.getResult(d,"AC_RESULT").rows;
            console.log(menuRows);
            var html = '';
            if (pageIndex ==1 && menuRows.length == 0){
                html = wfy.zero('暂无快速数据！');
            }
            for (var i = 0; i<menuRows.length; i++){
                var temp = menuRows[i];
                var fh = temp.xtfhsf+temp.xtfhcs+temp.xtfhdq+temp.xtfhdz;
                var sh = temp.xtfhsf+temp.xtshcs+temp.xtshdq+temp.xtshdz;
                var zt = '';
                if(temp.xtddzt == "00"){
                    zt = '配送中';
                }else if(temp.xtddzt == "10"){
                    zt = '已签收';
                } else {
                    zt = '状态不明';
                }
                html+= '<div class="list_1 list_swiper" style="height:180px" data-code="'+temp.xtyddh+'">'+
                            '<div class="list_item_1 thd ts200">'+
                                    '<div class="item_line">'+
                                    '<span class="">操作员：<span>'+temp.xtyhxm+'</span></span>'+
                                '<span class="fr">单号：<span>'+temp.xtyddh+'</span></span>'+
                                '</div>'+
                                '<div class="item_line">'+
                                    '<span class="">寄：<span>'+temp.xtfhsf+temp.xtfhcs+temp.xtfhdq+'</span></span>'+
                                '</div>'+
                                '<div class="item_line">'+
                                '<span><span class="" style="padding-left: 27px">'+temp.xtfhdz+'</span></span>'+
                                '</div>'+
                                '<div class="item_line">'+
                                    '<span class="">收：<span>'+temp.xtfhsf+temp.xtshcs+temp.xtshdq+'</span></span>'+
                                '</div>'+
                                '<div class="item_line">'+
                                '<span><span class="" style="padding-left: 27px">'+temp.xtshdz+'</span></span>'+
                                '</div>'+
                                '<div class="item_line">'+
                                    '<span class="">日期：<span>'+temp.xtczrq+'</span></span>'+
                                    '<span class="fr" style="color: #f00">'+zt+'</span>'+
                                '</div>'+
                                '</div>'+
                            '<div class="list_drap">'+
                            '</div>'+
                         '</div>';
            }
            $('#wfyContList').append(html);
            if(menuRows.length ==20){
                $("#scrollload").removeClass("none");
            }
            if( pageIndex > 1 && menuRows.length ==0){
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
                            pageIndex ++;
                            getlist('');
                            loading = false;
                        }
                    },1000);
                }

            });
        } else {
            // todo...[d.errorMessage]
            $.alert("数据查询失败！"+d.errorMessage);
        }
    }) ;
}
