var headmess = {};
var dtl ={};
var print_czhm,print_xphm ;

$(function () {
    wfy.tap("#back",function () {
        wfy.goto("storeReturn_qry");
    });

    headmess = JSON.parse(localStorage.head);
    pos_list();

    //滑动
    $("body").hammer().on("dragstart", ".list_1", function (event) {
        event.stopPropagation();
        var ind = $(this).find(".list_drap div").length;
        var indclass = "x_left_160";
        if(ind == 1){
            indclass = "x_left_80";
        }
        if(ind == 0){//实现了取消 滑动
            indclass ='';
        }
        if (event.gesture.direction === "left") {
            $(this).find(".list_item_1").addClass(indclass);
        } else {
            $(this).find(".list_item_1").removeClass(indclass);
        }
    });
});


function pos_list() {
    var vBiz = new FYBusiness("biz.pos.salereturn.list");
    var vOpr1 = vBiz.addCreateService("svc.pos.salereturn.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.salereturn.qry");
    vOpr1Data.setValue("AS_XTWLDM", headmess.dianmian);
    vOpr1Data.setValue("AS_XTXPHM", headmess.xiaopiao);
    vOpr1Data.setValue("AS_XTTXHM", headmess.tiaoma);
    vOpr1Data.setValue("AS_QSRQ", headmess.begintime);
    vOpr1Data.setValue("AS_JZRQ", headmess.endtime);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var res = vOpr1.getResult(d, "AC_RESULT").rows;
            var AC_HJ = vOpr1.getResult(d, "AC_HJ").rows;
            var html = "";
            if(res.length ==0){
                html = wfy.zero();
            }
            var vip ="";
            var boxheight = "";//由于定位的关系，导致无法自动冲起来高度！！！需要手动添加高度
            var sl = 0;
            var je = 0;
            for (var i = 0; i<res.length; i++){
                if(wfy.empty(res[i].khhy)){
                    vip ="</div>";

                    boxheight = '<div class="list_1" style="height: 105px;">';
                }else {
                    vip = '<div class="item_line"><span class="viph">vip号：<span>'+ res[i].khhy +'</span></span></div></div>';

                    boxheight = '<div class="list_1" style="height: 140px;">';
                }
                html += boxheight+'<div class="list_item_1 thd ts200" data-xtxphm="'+res[i].xtxphm+'" data-kcskrq="'+res[i].kcskrq+'">'+
                    '<div class="item_line"><span class="black">'+res[i].xtwlmc+'</span><span class="fr">'+res[i].kcskrq+'</span></div>'+
                    '<div class="item_line"><span class="black">小票号：<span>'+res[i].xtxphm+'</span></span><span class="fr">数量：<span>'+res[i].sl+'</span></span></div>'+
                    '<div class="item_line"><span class="black">实收：<span class="shishou">'+wfy.setTwoNum(res[i].xsskje,2)+'</span></span><span class="fr fanquan">返券：<span>'+wfy.setTwoNum(res[i].kcfqje,2)+'</span></span></div>'+
                    vip+
                    '<div class="list_drap" data-xtxphm="'+res[i].xtxphm+'" data-kcczhm="'+res[i].kcczhm+'"><div class="list_item_btn">整单退货</div></div></div>';

                sl += res[i].sl*1;
                je = res[i].xsskje*1;
            }
            $("#pos_listbox").html(html);
            $("#sl").html(AC_HJ[0].slhj);
            $("#je").html(wfy.setTwoNum(AC_HJ[0].sshj,2));

            wfy.tap("#pos_listbox .list_item_1",function (_this) {
                var xtxphm = $(_this).attr("data-xtxphm");
                var kcskrq = $(_this).attr("data-kcskrq");
                dtl.xtxphm = xtxphm;
                dtl.kcskrq = $(_this).attr("data-kcskrq");
                dtl.shishou = $(_this).find(".shishou").html();
                dtl.fanquan = $(_this).find(".fanquan").html();
                dtl.viph = wfy.empty($(_this).find(".viph").html()) ? "":$(_this).find(".viph").html();
                localStorage.dtl = JSON.stringify(dtl);
                localStorage.xtxphm = xtxphm;
                wfy.goto("storeReturn_dtl");
            });

            //点击整单退货
            wfy.tap("#pos_listbox .list_drap",function (_this) {
                var xtxphm = $(_this).attr("data-xtxphm");
                var kcczhm = $(_this).attr("data-kcczhm");
                print_xphm = xtxphm;
                print_czhm = kcczhm;
                wfy.confirm("您确认要执行整单退货吗？",function () {
                    setTimeout(function () {
                        posreturn(xtxphm);
                    },300)
                },function () {
                    setTimeout(function () {
                        $(_this).parents().find(".list_item_1").removeClass("x_left");
                    },300)
                });
            })
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
                        pos_list();
                    },500);
                },function () {
                    pos_list();
                });
            }

        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}
