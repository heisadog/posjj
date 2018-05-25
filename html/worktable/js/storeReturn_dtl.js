var head =[];
localStorage.his = 'storeReturn_dtl';

$(function () {
    wfy.tap("#back",function () {
        wfy.goto("storeReturn_list");
    });

    //判断一下 上个页面 是不是从单据补打进来的
    if(localStorage.index){
        $("#foot").hide();
        $("#pos_dtl_foot").css({
            "padding-bottom":"0px"
        });

        localStorage.removeItem("index");
    }

    pos_dtl();

    //点击整单退货
    wfy.tap("#golist",function (_this) {
        wfy.confirm("您确认要执行整单退货吗？",function () {
            setTimeout(function () {
                posreturn(head[0].xtxphm);
            },300);
        },function () {

        });
    });
})
function pos_dtl() {
    var vBiz = new FYBusiness("biz.pos.salereturn.dtl");
    var vOpr1 = vBiz.addCreateService("svc.pos.salereturn.dtl", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.salereturn.dtl");
    vOpr1Data.setValue("AS_XTXPHM", localStorage.xtxphm);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            var dtl = vOpr1.getResult(d, "AC_DTL").rows;
            var res = vOpr1.getResult(d, "AC_FKFS").rows;//
            head = vOpr1.getResult(d, "AC_HEADER").rows;//
            var html = "";
            if(res.length ==0){
                html = wfy.zero();
            }
            for (var i = 0 ; i<dtl.length ; i++){
                html +='<div class="pos_list">\
                    <div class="pos_item_dtl">\
                    <div class="pos_item_dtl_img"><img src="'+dtl[i].xtwplj+'" alt=""></div>\
                    <div class="dsdsarig">\
                                <div class="wfyitem_line" style="height: 20px;line-height: 20px;font-size: 12px">\
                                    <span class="wfyitemTitle"><span class="black">'+(i+1)+'、'+dtl[i].xtwpdm+'</span></span>\
                                    <span class="wfyitemTitle fr"><span>'+Math.abs(dtl[i].kcczsl)+'</span></span>\
                                </div>\
                                <div class="wfyitem_line"  style="height: 20px;line-height: 20px;font-size: 12px">\
                                    <span class="wfyitemTitle"><span>'+dtl[i].xtwpmc+'</span></span>\
                                    <span class="wfyitemTitle fr"><span>'+wfy.setTwoNum(Math.abs(dtl[i].je,2))+'</span></span>\
                                </div>\
                                <div class="wfyitem_line"  style="height: 20px;line-height: 20px;font-size: 12px">\
                                    <span class="wfyitemTitle"><span>'+dtl[i].xtysmc+'</span></span>\
                                    <span class="wfyitemTitle"><span style="padding-left: 20px">'+dtl[i].xtwpxh+'</span></span>\
                                    <span class="wfyitemTitle fr">折扣：<span>'+Math.abs(dtl[i].zk)+'</span></span>\
                                </div>\
                                <div class="wfyitem_line"  style="height: 20px;line-height: 20px;font-size: 12px">\
                                    <span class="wfyitemTitle">促销原因：<span>'+dtl[i].cxyy+'</span></span>\
                                </div>\
                    </div>\
                    </div>\
                    </div>';
            }

            $("#pos_listbox").append(html);
            $("#xiaopiao").html(head[0].xtxphm);
            $("#time").html(head[0].kcskrq);

            //处理页脚
            var zffs ="";
            for (var k = 0; k<res.length; k++ ){
                zffs +='<span class="wfytle">'+res[k].xsjssm+'：<span>'+wfy.setTwoNum(Math.abs(res[k].kcxsje,2))+'</span></span>'
            }
            var vip ="";
            if(wfy.empty(head[0].khhy)){
                vip ="";
            }else {
                vip ='<div class="wfyitem_line"><span class="wfyitemTitle">vip号：<span>'+head[0].khhy+'</span></span></div>';
            }
            var dtlfoot = '<div class="wfyitem_line">\
                        <span class="wfytle">实收：<span>'+wfy.setTwoNum(head[0].xsskje,2)+'</span></span>\
                        <span class="wfytle">返券：<span>'+wfy.setTwoNum(Math.abs(head[0].kcfqje,2))+'</span></span>\
                       </div>\
                       <div class="wfyitem_line">\
                        '+zffs+'\
                       </div>\
                        '+vip;

            $("#pos_dtl_foot").html(dtlfoot);
            var height = $("#pos_dtl_foot").height();
            $("#pos_listbox").css("padding-bottom",height+56);
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}

function posreturn (str) {
    var vBiz = new FYBusiness("biz.pos.salereturn.save");
    var vOpr1 = vBiz.addCreateService("svc.pos.salereturn.save", true);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.salereturn.save");
    vOpr1Data.setValue("AS_XTXPHM",str);
    vOpr1Data.setValue("AS_DATE",new Date().format("yyyy-MM-dd") );
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            //AS_THXPHM,AS_RETCODE,AS_RETMSG
            var res = vOpr1.getOutputPermeterMap(d);
            var xtxphm = vOpr1.getOutputPermeterMapValue(d, "AS_THXPHM");
            var issuccess = vOpr1.getOutputPermeterMapValue(d, "AS_RETCODE");

            if(issuccess =="Y"){
                wfy.confirm("操作成功！是否执行打印单据？",function () {
                    //Components.bluetoothPrint.printSaleTicket(print_czhm, xtxphm,localStorage.printFormat);
                    alert("打印成功");
                    setTimeout(function () {
                        wfy.goto("storeReturn_list");
                    },500);
                },function () {});
            }

        } else {
            alert(d.errorMessage);
        }
    }) ;

}
