var storeArr=[];//商铺信息
var repairTypeArr=[
    {mddm: '01', mdmc: '水管'},
    {mddm: '02', mdmc: '线路'},
    {mddm: '03', mdmc: '灯泡'},
    {mddm: '04', mdmc: '其他'}
];

$(function () {
    getShopName();

    //点击全部店铺，选择某个店铺
    $('body').hammer().on('tap','#shop',function (event) {
        event.stopPropagation();
        if(storeArr.length != 1){//只有一个店铺不执行弹出
            doComboList("shop",storeArr);
            $("#storeBox").attr("style","");
        }
    });

    $('body').hammer().on('tap','#repairtype',function (event) {
        event.stopPropagation();

        doComboList("repairtype",repairTypeArr);
        $("#storeBox").attr("style","height:20%;");
    });

    //点击选中某个下拉值
    $('body').hammer().on('tap','#storeBox .item',function (event) {
        event.stopPropagation();

        var mddm = $(this).attr('data-wldm');
        var mdmc = $(this).html();
        var field = $(this).attr('data-type');
        $('#'+field).val(mdmc);
        $('#'+field).attr("data-code",mddm);

        wfy.closeWin();
    });

    //提交
    $('body').hammer().on('tap', '#pro_sub', function (event) {
        event.stopPropagation();

        wfy.alert("报修成功",function () {
            history.back();
        });

    });
});

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
            storeArr = vOpr2.getResult(d, "AC_RESULT_SHOP").rows || [];//获取店铺名
            $('#shop').val(storeArr[0].mdmc);

        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}

//处理 选择店铺
function doComboList(type,arr) {
    //var list = '<div class="item" style="text-align: center" data-wldm="">全部</div>';
    var list = "";
    for(var i = 0; i<arr.length; i++){
        list +='<div class="item" style="text-align: center" data-type="'+type+'" data-wldm="'+arr[i].mddm+'">'+arr[i].mdmc+'</div>';
    }
    $('#storeBox').html(list);
    wfy.openWin('storeBox');
}