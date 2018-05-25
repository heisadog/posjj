var head ={};
$(function () {
    wfy.tap("#back",function () {
        wfy.goto("home");
    });

    //默认时间
    $('#begintime').val(wfy.getPreDay(new Date().format("yyyy-MM-dd"),15));
    $('#endtime').val(new Date().format("yyyy-MM-dd"));

    //时间 控件
    $("#begintime").datetimePicker({
            title: '起始日期',
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
            }
    });

    $("#endtime").datetimePicker({
        title: '截止日期',
        min: "1990-12-12",
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
        }
    });

    //扫码
    wfy.tap("#scanner", function (_this) { //列表的扫码
        app.scanner(function (code) {
            if (code) {
                $("#scanner").val(code)
            } else {
                wfy.alert("扫描条码失败！");
            }
        });
    });

    wfy.tap("#dianmian",function () {
        pos_xtwldm();
        wfy.openWin("dianmiansel");
    });

    //去详情
    wfy.tap("#bottom",function () {
        // if($("#dianmian").val() ==""){
        //     dialog.alert("请先选择销售店面");
        //     return false;
        // }
        // if($("#xiaopiao").val() ==""){
        //     dialog.alert("请先输入小票号码");
        //     return false;
        // }
        // if($("#tiaoma").val() ==""){
        //     dialog.alert("请先输入条形码");
        //     return false;
        // }
        head.dianmian = $("#dianmian").attr("data-xtwldm");
        head.xiaopiao = $("#xiaopiao").val();
        head.tiaoma = $("#tiaoma").val();
        head.begintime= $("#begintime").val();
        head.endtime = $("#endtime").val();
        localStorage.head = JSON.stringify(head);

        wfy.goto("storeReturn_list");
    })
})

//销售门店下拉查询
function pos_xtwldm() {
    var vBiz = new FYBusiness("biz.pos.salereturn.xtwldm");
    var vOpr1 = vBiz.addCreateService("svc.pos.salereturn.xtwldm", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.salereturn.xtwldm");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            var res = vOpr1.getResult(d, "AC_XTWLDM").rows;
            var html = "";
            if(res.length ==0){
                html = wfy.zero();
            }
            for (var i = 0; i<res.length; i++){
                html +='<div class="item" data-xtwldm="'+res[i].xtwldm+'">'+res[i].xtwlmc+'</div>';
            }
            $("#dianmiansel").html(html);

            wfy.tap("#dianmiansel .item",function (_this) {
                var xtwldm = $(_this).attr("data-xtwldm");
                var xtwlmc = $(_this).html();
                $("#dianmian").val(xtwlmc);
                $("#dianmian").attr("data-xtwldm",xtwldm);
                wfy.closeWin();
            });
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}



























