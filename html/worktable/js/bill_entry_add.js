/**
 * Created by WFY02 on 2017/10/31.
 */
var pageName;//页面名 msa020_1200--入库单
var result; //承载结果集
var cangkuArr;//
var companyArr;//厂商结果集
var head ={};
var issave = false;//是否保存标识var
var ischanege = false;//保存后 是否修改过 数据 。保存成功后变true ！----这个没用 用的 proxy
var pdqy = wfy.getRnd('6',true);
window.uexOnload= function () {
    uexWindow.setReportKey(0, 1); // 物理返回键接管
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode === 0){
            wfy.pagegoto('bill_entry');
        }
    };
}
$(function () {
    wfy.tap('#back',function () {
        wfy.pagegoto('bill_entry');
    })
    pageinit(function (obj) {
        pageName = obj.page;//msa020_1200
    })

    switch (pageName){
        case 'msa020_1200'://入库单
            getorder('RK',function (res) {
                head.operid = res[0].operid;//操作号码
                head.orderid = res[0].orderid;//单号
                head.czdm ='030';//默认采购入库  -----操作类型
                head.djlx ='RK';//单据类型
            })
            break;
        case 'msa020_1300'://出库单
            getorder('HZRK',function (res) {
                head.operid = res[0].operid;//操作号码
                head.orderid = res[0].orderid;//单号
                head.czdm ='031';//操作类型
                head.djlx ='HZRK';//单据类型
            })
            break;
        case 'msa010_0100'://要货单
            getorder('YHS',function (res) {
                head.operid = res[0].operid;//操作号码
                head.orderid = res[0].orderid;//单号
            })
            break;
        case 'msa010_0300'://调出单
            getorder('DB',function (res) {
                head.operid = res[0].operid;//操作号码
                head.orderid = res[0].orderid;//单号
            })
            break;
        case 'msa020_0500'://盘点单
            getorder('PD',function (res) {
                head.operid = res[0].operid;//操作号码
                head.orderid = res[0].orderid;//单号
            })
            break;
    }
    switch (pageName){
        /*----------------------------------------------入库单------------------------------------*/
        case 'msa020_1200' :
            $("#pagename").html("入库单");
            $('#headlist li:eq(0) , #headlist li:eq(1), #headlist li:eq(3)').hide();
            //门店 默认一个 可选 （一个的话 不选）
            getcangku('RK',function (res) {
                cangkuArr = res || [];
                $('#createStore').val(cangkuArr[0].kcckmc);
                head.ckdm = cangkuArr[0].kcckdm;
            })
            //厂商 ：
            getCompany('RK',function (res) {
                companyArr = res || [];
                $('#createCompany').val(companyArr[0].xtwlmc);
                head.wldm = companyArr[0].xtwldm;
            })
            //点击 门店
            wfy.tap('#createStore',function (that) {
                $("#createStore").picker({
                    title: "请选择仓库",
                    cols: [
                        {
                            textAlign: 'center',
                            values: resToArr(cangkuArr,"仓库")
                        }
                    ],
                    onChange:function (p) {
                        ischanege = false;
                        $('#save').removeClass('cabsdot_bosdt');
                        var vue = p.value[0];
                        for(var i = 0; i<cangkuArr.length; i++){
                            if(vue == cangkuArr[i].kcckmc){
                                head.ckdm = cangkuArr[i].kcckdm;
                            }
                        }
                    }
                });
            })
            //点击 厂商
            wfy.tap('#createCompany',function (that) {
                $("#createCompany").picker({
                    title: "请选择厂商",
                    cols: [
                        {
                            textAlign: 'center',
                            values: resToArr(companyArr,"厂商")
                        }
                    ],
                    onChange:function (p) {
                        ischanege = false;
                        $('#save').removeClass('cabsdot_bosdt');
                        var vue = p.value[0];
                        for(var i = 0; i<companyArr.length; i++){
                            if(vue == companyArr[i].xtwlmc){
                                head.wldm = companyArr[i].xtwldm;
                            }
                        }
                    }
                });
            })
            break;
        /*----------------------------------------------出库单------------------------------------*/
        case 'msa020_1300' :
            $("#pagename").html("出库单");
            $('#headlist li:eq(0) , #headlist li:eq(1), #headlist li:eq(3)').hide();
            //门店 默认一个 可选 （一个的话 不选）
            getcangku('RK',function (res) {
                cangkuArr = res || [];
                $('#createStore').val(cangkuArr[0].kcckmc);
                head.ckdm = cangkuArr[0].kcckdm;
            })
            //厂商 ：
            getCompany('RK',function (res) {
                companyArr = res || [];
                $('#createCompany').val(companyArr[0].xtwlmc);
                head.wldm = companyArr[0].xtwldm;
            })
            //点击 门店
            wfy.tap('#createStore',function (that) {
                $("#createStore").picker({
                    title: "请选择仓库",
                    cols: [
                        {
                            textAlign: 'center',
                            values: resToArr(cangkuArr,"仓库")
                        }
                    ],
                    onChange:function (p) {
                        ischanege = false;
                        $('#save').removeClass('cabsdot_bosdt');
                        var vue = p.value[0];
                        for(var i = 0; i<cangkuArr.length; i++){
                            if(vue == cangkuArr[i].kcckmc){
                                head.ckdm = cangkuArr[i].kcckdm;
                            }
                        }
                    }
                });
            })
            //点击 厂商
            wfy.tap('#createCompany',function (that) {
                $("#createCompany").picker({
                    title: "请选择厂商",
                    cols: [
                        {
                            textAlign: 'center',
                            values: resToArr(companyArr,"厂商")
                        }
                    ],
                    onChange:function (p) {
                        ischanege = false;
                        $('#save').removeClass('cabsdot_bosdt');
                        var vue = p.value[0];
                        for(var i = 0; i<companyArr.length; i++){
                            if(vue == companyArr[i].xtwlmc){
                                head.wldm = companyArr[i].xtwldm;
                            }
                        }
                    }
                });
            })
            break;
        case 'msa010_0100':
            //---------------------------------------------要货单----------------------------------------
            $("#pagename").html("要货单");
            $('#headlist li:eq(0) , #headlist li:eq(1), #headlist li:eq(3), #headlist li:eq(4)').hide();
            getYAOHUOOrderShop(function (res) {
                head.wldm = res[0].xtwldm;//对应 订货客户
                getOrderStoreAndDepartData(head.wldm,function (res,dos) {
                    cangkuArr = res || [];
                    $('#createStore').val(res[0].kcckmc);
                    head.ckdm = res[0].kcckdm;
                    head.AS_KCCKGS = dos[0].xtwldm;
                })
            });
            //点击 门店
            wfy.tap('#createStore',function (that) {
                $("#createStore").picker({
                    title: "请选择仓库",
                    cols: [
                        {
                            textAlign: 'center',
                            values: resToArr(cangkuArr,"要货")
                        }
                    ],
                    onChange:function (p) {
                        ischanege = false;
                        $('#save').removeClass('cabsdot_bosdt');
                        var vue = p.value[0];
                        for(var i = 0; i<cangkuArr.length; i++){
                            if(vue == cangkuArr[i].kcckmc){
                                head.ckdm = cangkuArr[i].kcckdm;
                            }
                        }
                    }
                });
            })
            break;
        case 'msa010_0300':
            //---------------------------------------------调出单----------------------------------------
            $("#pagename").html("调出单");
            $('#headlist li:eq(2) , #headlist li:eq(3), #headlist li:eq(4)').hide();
            getDiaoChuOrder(function (res,dos) {
                cangkuArr = res || [];
                companyArr = dos || [];
                $('#createCallout').val(res[0].kcckmc);
                head.dcckdm = res[0].kcckdm;
                $('#createCallin').val(dos[0].xtwlmc);
                head.wldm = dos[0].xtwldm;//显示调出和调入。关于调入仓库 根据调入的往来获取，界面不显示
                //获取调入仓库
                getDiaoChuStore(head.wldm,function (res) {
                    head.drck = res[0].kcckdm;
                    head.xthysf = res[0].xthysf || '';
                    head.xthycs = res[0].xthycs || '';
                    head.xthydd = res[0].xthydd || '';
                    head.kcckdz = res[0].kcckdz || '';
                    head.kcyzbm = res[0].kcyzbm || '';
                    head.kcfhry = res[0].kcfhry || '';
                    head.kcyddh = res[0].kcyddh || '';
                    head.kcgddh = res[0].kcgddh || '';
                })
            })
            //点击 调出
            wfy.tap('#createCallout',function (that) {
                $("#createCallout").picker({
                    title: "请选择调出店",
                    cols: [
                        {
                            textAlign: 'center',
                            values: resToArr(cangkuArr,"调出")
                        }
                    ],
                    onChange:function (p) {
                        ischanege = false;
                        $('#save').removeClass('cabsdot_bosdt');
                        var vue = p.value[0];
                        for(var i = 0; i<cangkuArr.length; i++){
                            if(vue == cangkuArr[i].kcckmc){
                                head.dcckdm = cangkuArr[i].kcckdm;
                            }
                        }
                    }
                });
            })
            //点击 调入
            wfy.tap('#createCallin',function (that) {
                $("#createCallin").picker({
                    title: "请选择调入店",
                    cols: [
                        {
                            textAlign: 'center',
                            values: resToArr(companyArr,"调入")
                        }
                    ],
                    onChange:function (p) {
                        ischanege = false;
                        $('#save').removeClass('cabsdot_bosdt');
                        var vue = p.value[0];
                        for(var i = 0; i<companyArr.length; i++){
                            if(vue == companyArr[i].xtwlmc){
                                head.wldm = companyArr[i].xtwldm;
                            }
                        }
                        //切换了 往来代码（即调入店）。随之改变对应的调入仓库
                        getDiaoChuStore(head.wldm,function (res) {
                            head.drck = res[0].kcckdm;
                            head.xthysf = res[0].xthysf || '';
                            head.xthycs = res[0].xthycs || '';
                            head.xthydd = res[0].xthydd || '';
                            head.kcckdz = res[0].kcckdz || '';
                            head.kcyzbm = res[0].kcyzbm || '';
                            head.kcfhry = res[0].kcfhry || '';
                            head.kcyddh = res[0].kcyddh || '';
                            head.kcgddh = res[0].kcgddh || '';
                        })
                    }
                });
            })
            break;
        case 'msa020_0500':
        //---------------------------------------------盘点单----------------------------------------
            $("#pagename").html("盘点单");
            $('#sub').html('提交');
            $('#headlist li:eq(0) , #headlist li:eq(1), #headlist li:eq(4), #headlist li:eq(7)').hide();
            getPandianStore(function (res) {
                cangkuArr = res || [];
                $('#createStore').val(cangkuArr[0].kcckmc);
                head.ckdm = cangkuArr[0].kcckdm;
                //根据仓库 获取盘点方式
                getPandianType(head.ckdm,function (res) {
                    head.pdfs=res[0].pdlx || 0;
                    $('#createType').val(stocktaking[res[0].pdlx])
                })
            })
            //点击 门店
            wfy.tap('#createStore',function (that) {
                $("#createStore").picker({
                    title: "请选择仓库",
                    cols: [
                        {
                            textAlign: 'center',
                            values: resToArr(cangkuArr,"盘点")
                        }
                    ],
                    onChange:function (p) {
                        ischanege = false;
                        $('#save').removeClass('cabsdot_bosdt');
                        var vue = p.value[0];
                        for(var i = 0; i<cangkuArr.length; i++){
                            if(vue == cangkuArr[i].kcckmc){
                                head.ckdm = cangkuArr[i].kcckdm;
                            }
                        }
                        getPandianType(head.ckdm,function (res) {
                            head.pdfs=res[0].pdlx || 0;
                            $('#createType').val(stocktaking[res[0].pdlx])
                        })
                    }
                });
            })
            break;

    }
    //操作人员
    $("#createAdmin").val(localStorage.czry);
    //日期 默认当天
    $("#createTime").val(wfy.format('yyyy-MM-dd',new Date())).attr('data-trueTime',wfy.format('yyyy-MM-dd hh-mm-ss',new Date()));
    //保存
    $('body').hammer().on("tap",'#save',function (event) {
        event.stopPropagation();
        if(!$(this).hasClass('cabsdot_bosdt')){
            if($('#bill_sku_box .bill_sku').length == 0){
                wfy.alert("商品数量为空，请先添加商品");
            }else {
                //此处开始 区分哪种单据
                switch (pageName){
                    case 'msa020_1200'://入库单
                        save_ruku();
                        break;
                    case 'msa020_1300'://出库单
                        save_ruku();
                        break;
                    case 'msa010_0100'://要货单
                        saveYaoDingDan();
                        break;
                    case 'msa010_0300'://调出单
                        saveDiaoChu();
                        break;
                    case 'msa020_0500'://盘点单
                        savePanDian();
                        break;
                }

            }
        }
    })
    //审核
    $('body').hammer().on("tap",'#sub',function (event) {
        event.stopPropagation();
        if(issave == false){
            wfy.alert("单据未保存，不能进行审核！");
            return false;
        }
        //此处开始 区分哪种单据
        switch (pageName){
            case 'msa020_1200'://入库单
                changeStatus('RK',head.operid,"S",function () {
                    wfy.alert("审核成功");
                    setTimeout(function () {
                        wfy.pagegoto('bill_entry');
                    },1000)
                });
                break;
            case 'msa020_1300'://出库单
                changeStatus('HZRK',head.operid,"S",function () {
                    wfy.alert("审核成功");
                    setTimeout(function () {
                        wfy.pagegoto('bill_entry');
                    },1000)
                });
                break;
            case 'msa010_0100'://要货单
                subYaoDingDan(function () {
                    wfy.alert('审核成功');
                    setTimeout(function () {
                        wfy.pagegoto('bill_entry');
                    },1000)
                });
                break;
            case 'msa010_0300'://调出单
                subDiaoChu(head.operid,function () {
                    wfy.alert("审核成功");
                    setTimeout(function () {
                        wfy.pagegoto('bill_entry');
                    },1000)
                });
                break;
            case 'msa020_0500':
                subOrder();
                break;
        }
    })
    //监测input值得变化~~~
    $('#createBZ').bind('input propertychange', function() {
        $('#save').removeClass('cabsdot_bosdt');
    });
})


//处理门店.厂商等结果集 变成  数组
function resToArr(res,type) {
    var arr= [];
    if(res.length == 0){
        arr = [];
    }else {
        if(type == '仓库'){
            for(var i = 0; i<res.length;i++){
                arr.push(res[i].kcckmc)
            }
        }
        if(type == '厂商'){
            for(var m = 0; m<res.length;m++){
                arr.push(res[m].xtwlmc)
            }
        }
        if(type == '要货'){
            for(var a = 0; a<res.length;a++){
                arr.push(res[a].kcckmc)
            }
        }
        if(type == '调出'){
            for(var b = 0; b<res.length;b++){
                arr.push(res[b].kcckmc)
            }
        }
        if(type == '调入'){
            for(var c = 0; c<res.length;c++){
                arr.push(res[c].xtwlmc)
            }
        }
        if(type == '盘点'){
            for(var c = 0; c<res.length;c++){
                arr.push(res[c].kcckmc)
            }
        }
    }
    return arr;
}

//入库单保存
function save_ruku() {
    //先获取保存的信息  直接从 data 中获取
    var dtl = {};
    dtl.AN_KCCZHH = [];
    dtl.AS_XTWPDM = [];
    dtl.AN_KCXSDJ = [];
    dtl.AN_KCCZSL = [];
    var cont =[];//不分款式，都处理到cont中统一计算
    for(var i = 0 ;i<data.length;i++){
        cont = cont.concat(data[i].cont);
    }
    for(var m=0;m<cont.length;m++){
        dtl.AN_KCCZHH.push(m);
        dtl.AS_XTWPDM.push(cont[m].sku);
        dtl.AN_KCXSDJ.push(cont[m].price);
        dtl.AN_KCCZSL.push(cont[m].num);
    }
    var vBiz = new FYBusiness("biz.invopr.invopr.save");
    var vOpr1 = vBiz.addCreateService("svc.invopr.invopr.save.head", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invopr.invopr.save.head");
    vOpr1Data.setValue("AS_KCCZHM", head.operid );//操作号码
    vOpr1Data.setValue("AS_KCPDHM", head.orderid);//单号
    vOpr1Data.setValue("AS_KCCZLX", head.czdm);//操作类型
    vOpr1Data.setValue("AS_KCCKDM", head.ckdm);//仓库代码 ---对应  仓/店
    vOpr1Data.setValue("AS_KCCZRQ", $('#createTime').attr('data-trueTime'));//操作日期
    vOpr1Data.setValue("AS_XTWLDM", (head.wldm ||""));//往来单位 ---对应厂商
    vOpr1Data.setValue("AS_KCDFCK", '');//对方仓库
    vOpr1Data.setValue("AS_KCYSPD", '');//原始单号
    vOpr1Data.setValue("AS_KCDJBZ",$('#createBZ').val() == '---' ? '': $('#createBZ').val());//备注-
    vOpr1Data.setValue("AS_DJLX", head.djlx);//单据类型 RK\HZRK
    vOpr1Data.setValue("AS_KCCZHM2", "");//对方操作号码---此处传空
    var vOpr2 = vBiz.addCreateService("svc.invopr.invopr.save.datail", false);
    var vOpr2Data =[];
    for(var i = 0 ; i<dtl.AN_KCCZHH.length; i++ ){
        var obj={};
        obj.AS_USERID = LoginName;
        obj.AS_WLDM = DepartmentCode;
        obj.AS_FUNC = "svc.invopr.invopr.save.datail";
        obj.AS_KCCZHM = head.operid;//操作号码
        obj.AS_KCCZHM2 = '';//对方操作号码
        obj.AS_KCPDHM = head.orderid;//单号
        obj.AN_KCCZHH = Number(dtl.AN_KCCZHH[i]);//行号------------------
        obj.AS_KCCZLX = head.czdm;//操作类型
        obj.AS_XTWPDM = dtl.AS_XTWPDM[i];//商品编码--------------------------------sku
        obj.AS_KCCKDM = head.ckdm;//仓库代码
        obj.AS_KCDFCK = '';//对方仓库
        obj.AS_KCCZRQ = $('#createTime').attr('data-trueTime');
        obj.AS_XTWLDM = head.wldm;//往来单位
        obj.AN_KCXSDJ = Number(dtl.AN_KCXSDJ[i]);//销售单价-------------------
        obj.AN_KCCZSL = Number(dtl.AN_KCCZSL[i]);//操作数量-----------------
        obj.AN_KCSSJE = '';//实收金额
        obj.AN_KCWPJE = '';//成本金额
        obj.AN_KCJSJE = '';//结算金额
        obj.AS_KCDJBZ = $('#createBZ').val() ;//备注
        obj.AS_DJLX = head.djlx;//单据类型
        vOpr2Data.push(obj);
    }
    vOpr2.addDataArray(vOpr2Data);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            wfy.alert("保存数据成功！");
            $('#save').addClass('cabsdot_bosdt');
            issave = true;
            ischanege = true;
        } else {
            // todo...[d.errorMessage]
            wfy.alert('保存失败'+d.errorMessage);
        }
    }) ;
}


/*------------------------要货单-------------------------*/
//界面显示一个 店仓，显示的是 订货库。对应标准版的订货库、
//先查 订货客户（隐藏）----通过 订货客户 查询 订货库和 订货单位
//订货客户 和 订货单位 ，隐藏不显示，保存的时候使用！！借用标准版的逻辑。订货库 可能是多个结果集

//要货单 获取订货客户
var getYAOHUOOrderShop = function (callback) {
    var bizOrderShop = new FYBusiness("biz.dsdmd.yaohuodanwl.qry");
    var svcOrderShop = bizOrderShop.addCreateService("svc.dsdmd.yaohuodanwl.qry", false);
    var dataOrderShop = svcOrderShop.addCreateData();
    dataOrderShop.setValue("AS_USERID", LoginName);
    dataOrderShop.setValue("AS_WLDM", DepartmentCode);
    dataOrderShop.setValue("AS_FUNC", "svc.yaohuodanwl.qry");
    var ip = new InvokeProc();
    ip.addBusiness(bizOrderShop);
    ip.invoke(function (res) {
        if (res && res.success) {
            var resOrderShop = svcOrderShop.getResult(res, "AC_RESULT").rows || [];//订货客户
            if(typeof callback === 'function'){
                callback(resOrderShop)
            }
        } else {
            wfy.alert("获取要货门店失败！");
        }
    });
}
// 要货单 获取订货仓库和 订货单位
var getOrderStoreAndDepartData =function (AS_YHWLDM,callback) {
    var bizOrderStore = new FYBusiness("biz.yaohuodan.input.ck");
    var svcOrderStore = bizOrderStore.addCreateService("svc.yaohuodan.input.ck", false);
    var dataOrderStore = svcOrderStore.addCreateData();
    dataOrderStore.setValue("AS_USERID", LoginName);
    dataOrderStore.setValue("AS_WLDM", DepartmentCode);
    dataOrderStore.setValue("AS_FUNC", "svc.yaohuodan.input.ck");
    dataOrderStore.setValue("AS_YHWLDM", AS_YHWLDM);
    var ip = new InvokeProc();
    ip.addBusiness(bizOrderStore);
    ip.invoke(function (res) {
        if (res && res.success) {
            var resOrderStore = svcOrderStore.getResult(res, "AC_DHKLIST").rows || [];//订货库
            var resOrderDepart = svcOrderStore.getResult(res, "AC_DHDW").rows || [];//订货单位
            //var sendDepart = svcOrderStore.getResult(res, "AC_ZJWL").rows || [];
            if(typeof callback === 'function'){
                callback(resOrderStore,resOrderDepart)
            }
        } else {
            wfy.alert("获取订货库或订货单位失败！");
        }
    });
}

//   要订单 保存~~~~~
function saveYaoDingDan() {
    var dtl = {};
    dtl.AS_WPDM = [];
    dtl.AN_YHSL = [];
    dtl.AN_YHDJ = [];
    var cont =[];//不分款式，都处理到cont中统一计算
    for(var i = 0 ;i<data.length;i++){
        cont = cont.concat(data[i].cont);
    }
    for(var m=0;m<cont.length;m++){
        dtl.AS_WPDM.push(cont[m].sku);
        dtl.AN_YHSL.push(cont[m].num);
        dtl.AN_YHDJ.push(cont[m].price)
    }
    var vBiz = new FYBusiness("biz.veorder.save");
    var vOpr1 = vBiz.addCreateService("svc.veorder.main.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.veorder.main.save");
    vOpr1Data.setValue("AS_XSCZHM", head.operid);
    vOpr1Data.setValue("AS_XSYHDH", head.orderid);
    vOpr1Data.setValue("AS_KCCKDM", head.ckdm);// 对应订货仓库
    vOpr1Data.setValue("AS_XTWLDM", head.wldm); // 对应 订货客户
    vOpr1Data.setValue("AS_XSXQRQ",  $('#createTime').attr('data-trueTime'));
    vOpr1Data.setValue("AS_YHLX", "1");//要货类型 固定
    vOpr1Data.setValue("AN_DJBL", "0");//定金比例 写个0
    vOpr1Data.setValue("AS_YHBZ", $('#createBZ').val() == '---' ? '': $('#createBZ').val());// 备注
    vOpr1Data.setValue("AS_KCCKGS", head.AS_KCCKGS);// 对应 订货单位

    var vOpr2 = vBiz.addCreateService("svc.veorder.dtl.save", false);
    var vOpr2Data =[];
    for(var i = 0 ; i<dtl.AS_WPDM.length; i++ ){
        var obj={};
        obj.AS_USERID = LoginName;
        obj.AS_WLDM = DepartmentCode;
        obj.AS_FUNC = "svc.veorder.dtl.save";
        obj.AS_XSCZHM = head.operid;//操作号码
        obj.AN_XSYDHH = i+1;
        obj.AS_WPDM = dtl.AS_WPDM[i];//商品编码--------------------------------sku
        obj.AN_YHSL = Number(dtl.AN_YHSL[i]);//操作数量-----------------
        obj.AS_XTWLDM = head.wldm;//往来单位
        obj.AS_XSXQRQ = $('#createTime').attr('data-trueTime');
        obj.AS_MXBZ = $('#createBZ').val() ;//备注
        obj.AS_YHLX = '1';//要货单据类型
        obj.AS_JLDW = '';//计量单位
        obj.AN_YHDJ = Number(dtl.AN_YHDJ[i]) ;//要货单价（零售价）
        obj.AN_PFJ = Number(dtl.AN_YHDJ[i]);// 本币单价  
        obj.AS_XSDW = '';//包装单位
        obj.AN_XSSL = 0;//包装数量
        obj.AN_XSYS = 0;//包装余数
        vOpr2Data.push(obj);
    }
    vOpr2.addDataArray(vOpr2Data);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip));
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            wfy.alert("保存数据成功！");
            $('#save').addClass('cabsdot_bosdt');
            issave = true;
            ischanege = true;
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}
//要订单 审核 
function subYaoDingDan(callback) {
    var biz = new FYBusiness("biz.veorder.main.modify");
    var svc = biz.addCreateService("svc.veorder.main.modify", false);
    var data = svc.addCreateData();
    data.setValue("AS_USERID", LoginName);
    data.setValue("AS_WLDM", DepartmentCode);
    data.setValue("AS_FUNC", "svc.veorder.main.modify");
    data.setValue("AS_CZHM", head.operid);
    data.setValue("AS_XTWLDM", head.wldm);
    data.setValue("AS_KCCKDM", "");
    data.setValue("AS_MODIFY_LX", "confirm");
    var ip = new InvokeProc();
    ip.addBusiness(biz);
    ip.invoke(function (res) {
        if (res && res.success) {
            if(typeof callback === 'function'){
                callback();
            }
        } else {
            wfy.alert("提交要货单失败！" + res.errorMessage);
        }
    });
}



// 保存 调出单
function saveDiaoChu() {
    var dtl = {};
    dtl.AS_WPDM = [];
    dtl.AS_JLDW = [];
    dtl.AN_DCSL = [];
    dtl.AN_XSDJ = [];
    var cont =[];//不分款式，都处理到cont中统一计算
    for(var i = 0 ;i<data.length;i++){
        cont = cont.concat(data[i].cont);
    }
    for(var m=0;m<cont.length;m++){
        dtl.AS_WPDM.push(cont[m].sku);
        dtl.AS_JLDW.push(cont[m].jldw);
        dtl.AN_DCSL.push(cont[m].num);
        dtl.AN_XSDJ.push(cont[m].price);
    }
    var biz = new FYBusiness("biz.ds.move.detail.save");
    var svcMain = biz.addCreateService("svc.ds.move.header.save", false);
    var dataMain = svcMain.addCreateData();
    dataMain.setValue("AS_USERID", LoginName);
    dataMain.setValue("AS_WLDM", DepartmentCode);
    dataMain.setValue("AS_FUNC", "svc.ds.move.header.save");
    dataMain.setValue("AS_CZHM", head.operid);
    dataMain.setValue("AS_PHDH", head.orderid);
    dataMain.setValue("AS_DCCK", head.dcckdm);//调出仓库
    dataMain.setValue("AS_DRWL", head.wldm);//调入客户
    dataMain.setValue("AS_DRCK", head.drck);//调入仓库
    dataMain.setValue("AS_DJBZ", $('#createBZ').val() == '---' ? '': $('#createBZ').val());//备注
    dataMain.setValue("AS_YSFS", '');//运输方式
    dataMain.setValue("AS_XTKHSF", head.xthysf);
    dataMain.setValue("AS_XTKHCS", head.xthycs);
    dataMain.setValue("AS_XSKHDQ", head.xthydd);
    dataMain.setValue("AS_XTKHDZ", head.kcckdz);
    dataMain.setValue("AS_XTKHYB", head.kcyzbm);
    dataMain.setValue("AS_XTSHRY", head.kcfhry);
    dataMain.setValue("AS_XSSJHM", head.kcyddh);
    dataMain.setValue("AS_XTDHHM", head.kcgddh);

    var svcDetail = biz.addCreateService("svc.ds.move.detail.save", false);
    var svcDetaildata = [];
    for (var i = 0; i < dtl.AS_WPDM.length; i++) {
        var a = {};
        a.AS_USERID = LoginName;
        a.AS_WLDM = DepartmentCode;
        a.AS_FUNC = "svc.ds.move.detail.save";
        a.AS_CZHM = head.operid;
        a.AS_DCCK = head.dcckdm;
        a.AS_DRWL = head.wldm;
        a.AS_DRCK = head.drck;
        a.AS_WPDM = dtl.AS_WPDM[i];
        a.AS_JLDW = dtl.AS_JLDW[i];
        a.AN_DCSL = dtl.AN_DCSL[i];
        a.AN_XSDJ = dtl.AN_XSDJ[i];
        a.AN_DCJE = (dtl.AN_XSDJ[i])*(dtl.AN_DCSL[i]);//调出金额
        a.AS_DJBZ = $('#createBZ').val() == '---' ? "":$('#createBZ').val();
        a.AN_PHHHI = i+1 ;//行号
        svcDetaildata.push(a);
    }
    svcDetail.addDataArray(svcDetaildata)
    var ip = new InvokeProc();
    ip.addBusiness(biz);
    //console.log(JSON.stringify(ip))
    ip.invoke(function (res) {
        if (res && res.success) {
            wfy.alert("保存数据成功！");
            $('#save').addClass('cabsdot_bosdt');
            issave = true;
            ischanege = true;
        } else {
            wfy.alert(res.errorMessage);
        }
    });
}

/*
* 保存 盘点单
* 
* */
function savePanDian() {
    var dtl = {};
    var str='';
    var cont =[];//不分款式，都处理到cont中统一计算
    for(var i = 0 ;i<data.length;i++){
        cont = cont.concat(data[i].cont);
    }
    for(var m=0;m<cont.length;m++){
        str +=cont[m].sku + "," + cont[m].num + ";";
    }
    var vBiz = new FYBusiness("biz.inv.st.input.dtl.save");
    var vOpr1 = vBiz.addCreateService("svc.inv.st.input.header.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.inv.st.input.header.save");
    vOpr1Data.setValue("AS_KCCZHM", head.operid);
    vOpr1Data.setValue("AS_KCCKDM", head.ckdm);//仓库代码
    vOpr1Data.setValue("AS_PDQY", pdqy);//盘点区域
    vOpr1Data.setValue("AS_PDRY", localStorage.czry);//盘点人员
    vOpr1Data.setValue("AS_PDFS", head.pdfs);//盘点方式
    vOpr1Data.setValue("ADT_PDZT", "");////新增传空，维护 传 单据状态

    var vOpr2 = vBiz.addCreateService("svc.inv.st.input.detail.save", false);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);//
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);//
    vOpr2Data.setValue("AS_FUNC", "svc.inv.st.input.detail.save");//
    vOpr2Data.setValue("AS_KCCZHM", head.operid);
    vOpr2Data.setValue("AS_KCCKDM", head.ckdm);//仓库代码
    vOpr2Data.setValue("AS_PDQY", pdqy);//盘点区域
    vOpr2Data.setValue("AS_TOKEN", str);//25FA0071033XL,1;25FA007-020-XL,2;25FA007-020-L,3;格式的数据

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...AS_KCCZHMO
            var res = vOpr1.getOutputPermeterMap(d, 'AS_KCCZHMO');
            head.operid = res.AS_KCCZHMO;
            wfy.alert("保存数据成功！");
            $('#save').addClass('cabsdot_bosdt');
            issave = true;
            ischanege = true;
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}
/*
* 盘点单 提交
*
* */
function subOrder() {
    if(issave == false){
        wfy.alert("请先保存单据！");
        issave = false;
    }else{
        var biz = new FYBusiness("biz.inv.st.ipt.mod");
        var svc = biz.addCreateService("svc.inv.st.ipt.mod", false);
        var data = svc.addCreateData();
        data.setValue("AS_USERID", LoginName);
        data.setValue("AS_WLDM", DepartmentCode);
        data.setValue("AS_FUNC", "svc.inv.st.ipt.mod");
        data.setValue("AS_CZHM", head.operid);
        data.setValue("AS_CZZT", "L");
        data.setValue("AS_PDQY",pdqy);
        data.setValue("AS_KCCKDM", head.ckdm || "");
        data.setValue("MODIFY_LX", "confirm");
        var ip = new InvokeProc();
        ip.addBusiness(biz);
        ip.invoke(function (res) {
            if (res && res.success) {
                wfy.alert("提交成功");
                setTimeout(function () {
                    wfy.pagegoto('bill_entry');
                },1000);
            } else {
                wfy.alert("提交盘点单失败！" + res.errorMessage);
            }
        });
    }


}
