localStorage.his = 'qry_attendance_dtl';
localStorage.prev = 'qry_attendance';

var searchDtlObj=JSON.parse(localStorage.attenDtlObj);

$(function () {

    $('body').hammer().on('tap','#back',function (event) {
        event.stopPropagation();

        wfy.goto("qry_attendance");
    });

    //获取所有账单数据
    getDtlList();

})

function getDtlList() {

    var vBiz = new FYBusiness("biz.emp.kaoqindtl.qry");

    var vOpr1 = vBiz.addCreateService("svc.emp.kaoqindtl.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.emp.kaoqindtl.qry");
    vOpr1Data.setValue("AS_XTYHDM", searchDtlObj.staff);
    vOpr1Data.setValue("AS_STARTDATE", searchDtlObj.startdate);
    vOpr1Data.setValue("AS_ENDDATE", searchDtlObj.enddate);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var dtlList = vOpr1.getResult(d, "AC_RESULT").rows || [];
            createDtlPage(dtlList);

        } else {
            wfy.alert(d.errorMessage)
        }
    }) ;
}



function createDtlPage(rows) {
    var html = "";
    if (rows.length == 0) {
        html = wfy.zero();
    }

    for(var i=0;i<rows.length;i++){
        var html_div="";
        var html_up="";
        var html_down="";

        html_up=
            '<div class="list_item_1 thd ts200">' +
            '<div class="item_line">' +
            '<span class=""><span style="font-size: 17px;color: #000">'+rows[i].xtsbsj+'</span></span>' +
            '</div>' +
            '<div class="item_line">' +
            '<span class=""><span style="font-size: 12px;">'+rows[i].xtsbwz+'</span></span>' +
            '</div>';

        if(getValidStr(rows[i].xtxbsj)!=""){
            html_div='<div class="list_1 list_swiper" style="height:115px">';
            html_down='<div class="item_line">' +
                '<span class="" style="font-size: 17px;color: #000"><span>'+rows[i].xtxbsj+'</span></span>' +
                '</div>' +
                '<div class="item_line">' +
                '<span class=""><span style="font-size: 12px;">'+rows[i].xtxbwz+'</span></span>' +
                '</div>'+
                '</div></div>';
        }else{
            html_div='<div class="list_1 list_swiper" style="height:85px">';
            html_down='<div class="item_line">' +
                '<span class="" style="font-size: 17px;color: red"><span>缺卡</span></span>' +
                '</div>'+
                '</div></div>';
        }

        html+=html_div+html_up+html_down;
    }

    $(".cell_list_3").html(html);

}
