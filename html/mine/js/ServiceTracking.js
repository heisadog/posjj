/**
 * Created by WFY02 on 2018/1/3.
 */
var index = 1;
$(function () {
    getlist(index);
    $('body').hammer().on('tap','#searlist .list_item_1',function (event) {
        event.stopPropagation();
        var code = $(this).attr('data-code');
        wfy.pagegoto('../mine/ServiceTrackingDtl');
    })
})
function getlist(page) {
    var vBiz = new FYBusiness("biz.logisticstracking.list.qry");
    var vOpr1 = vBiz.addCreateService("svc.logisticstracking.list.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.logisticstracking.list.qry");
    vOpr1Data.setValue("AN_PAGE_NUM", page);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var AC_RESULT=vOpr1.getResult(d,"AC_RESULT").rows;
            console.log(AC_RESULT)
            dores(AC_RESULT);
        } else {
            // todo...[d.errorMessage]
            $.alert("数据查询失败！");
        }
    }) ;
}
function dores(result) {
    var html = '';
    for (var i = 0; i<result.length; i++){
        html+='<div class="list_1 list_swiper" style="height:120px; font-size:13px;">'+
            '<div class="list_item_1 thd ts200" data-code="'+result[i].xtyddh+'">'+
                '<div class="item_line">'+
                '<span class="">操作员：<span style="color:#000">'+result[i].xtczry+'</span></span>'+
                '<span class="fr">订单号：<span>'+result[i].xtyddh+'</span></span>'+
                '</div>'+
                '<div class="item_line">'+
                '<span class="">寄：<span>'+result[i].xtfhsf+result[i].xtfhcs+result[i].xtfhdq+result[i].xtfhdz+'</span></span>'+
                '</div>'+
                '<div class="item_line">'+
                '<span class="">收：<span>'+result[i].xtshsf+result[i].xtshcs+result[i].xtshdq+result[i].xtshdz+'</span></span>'+
                '</div>'+
                '<div class="item_line">'+
                '<span class="">日期：<span style="color: #999">'+result[i].xtczrq+'</span></span>'+
                '</div>'+
            '</div>'+
            '<div class="list_drap"></div>'+
            '</div>';
    }
    $("#searlist").append(html);
}