localStorage.his = 'qry_coutomer_consumption_dtl';
localStorage.prev = 'qry_coutomer_consumption';
$(function () {
    var hykh = localStorage.pageprev.replace('"','').replace('"','');
    console.error(hykh)
    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();
        $('input').blur();
        wfy.closesearch();
        condition.begintime = $('#begintime').val() || '';
        condition.endtime = $('#endtime').val() || '';
        condition.customer = $('#customer').val() || '';

        pageNum=1;
        $("#searlist").html("");
    })
    ajaxData(hykh);


});
var ajaxData = function (hykh) {
    var vBiz = new FYBusiness("biz.crm.sale.vip.qry");
    var vOpr1 = vBiz.addCreateService("svc.crm.sale.vip.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.crm.sale.vip.qry");
    vOpr1Data.setValue("AS_MDDM", getValidStr(localStorage.mddm));
    vOpr1Data.setValue("AS_KHHYKH",hykh);
    vOpr1Data.setValue("AS_BEGINDATE", "");
    vOpr1Data.setValue("AS_ENDDATE", "");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.error(JSON.stringify(ip));
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getResult(d, 'AC_RESULT_SALESUM').rows || [];
            console.error(res);
            var html = '';
            if(res.length == 0){
                html= wfy.zero('暂无详细信息');
            }
            for(var i = 0; i<res.length;i++){
                html+='<div class="tallitem">'+res[i].xtwpmc+'<span style="float: right;font-size:14px;color: #1a1a1a">'+res[i].saleqty+'</span>' +
                    '<p style="font-size:12px; color:#999">'+res[i].xtwpdm+'<span style="float: right;font-size:14px;color: #1a1a1a">'+res[i].salemoney+'</span></p>' +
                    '</div>';
            }
            $('#searlist').html(html);
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage)
        }
    }) ;
}

