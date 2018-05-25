
var ordercode=localStorage.saleordercode;
var returnFlag=localStorage.returnFlag;
var pagetype=localStorage.saleordertype;

$(function () {

    if(returnFlag=="Y"){
        /*$(".dtloper").removeClass("none");
        $(".dtlshow").addClass("none");*/

        //退货先隐藏
        $(".dtlshow").removeClass("none");
        $(".dtloper").addClass("none");
    }else{
        $(".dtlshow").removeClass("none");
        $(".dtloper").addClass("none");
    }

    $('body').hammer().on('tap','#back',function (event) {
        event.stopPropagation();

        wfy.pagegoto("qry_sales");
    });

    //退货
    $('body').hammer().on('tap','.dtloper',function (event) {
        event.stopPropagation();

        orderReturn();
    });

   getDtlList();

});

function getDtlList() {

    wfy.showload();

    var vBiz = new FYBusiness("biz.pos.orderdtl.qry");

    var vOpr1 = vBiz.addCreateService("svc.pos.orderdtl.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.orderdtl.qry");
    vOpr1Data.setValue("AS_XTXPHM", ordercode);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {
        wfy.hideload();
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var num = vOpr1.getOutputPermeterMapValue(d, "AN_SL") || 0;
            var money = vOpr1.getOutputPermeterMapValue(d, "AN_JE") || 0;
            $('#totalnum').html(num);
            $('#totalmoney').html(money);

            var res = vOpr1.getResult(d, 'AC_RESULT').rows || [];

            createDtlPage(res);
        } else {
            wfy.alert('获取数据失败！' + (d.errorMessage || ''));
        }
    });
}

function createDtlPage(record) {
    var htmlStr ="";

    if(record.length ==0){
        htmlStr = wfy.zero();
    }

    for(var i=0;i<record.length;i++){
        var item=record[i];

        htmlStr +='<div class="list_2">'+
            '<ul class="list_item_2" style="margin: 0; width: 100%">'+
            '<li class="tl" style="width: 32%;text-indent: 12px">'+item.xtwpks+'</li>'+
            '<li class="" style="width: 18%">'+item.xtysmc+'</li>'+
            '<li class="" style="width: 15%">'+item.xtwpxh+'</li>' +
            '<li class="" style="width: 15%">'+item.kcczsl+'</li>'+
            '<li class="" style="width: 20%">'+item.kcssje+'</li>'+
            '</ul>'+
            '</div>';
    }

    $("#searlist").html(htmlStr);

}

//退货
function orderReturn() {
    var vBiz = new FYBusiness("biz.pos.salereturn.save");

    var vOpr1 = vBiz.addCreateService("svc.pos.salereturn.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.salereturn.save");
    vOpr1Data.setValue("AS_XTXPHM", ordercode);
    vOpr1Data.setValue("AS_DATE", new Date().format("yyyy-MM-dd hh:mm:ss"));

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            wfy.alert('退货成功！',function () {
                wfy.goto("qry_sales");
            });
        } else {
            wfy.alert('退货失败！' + (d.errorMessage || ''));
        }
    });
}
