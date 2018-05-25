var opercode="";
var pageName="";
var checkFlag=false;//收货方式切换校验标志
var showFlag=localStorage.showflag;//页面是否显示可操作功能标志
var pdStatus="";//盘点单状态
var diaoru='<li><span>调出店</span><input class="createTime"  readonly="readonly"  id="operout" placeholder="-&#45;&#45;"></li>' +
        '<li><span>调入店</span><input class="createTime"  readonly="readonly"  id="operin" placeholder="-&#45;&#45;"></li>';
var diaochu='<li><span>仓/店</span><input class="createTime"  readonly="readonly"  id="operout" placeholder="---"></li>' +
        '<li><span>调入客户</span><input class="createTime"  readonly="readonly"  id="operin" placeholder="---"></li>';
var yaohuo='<li><span>仓/店</span><input class="createTime"  readonly="readonly"  id="operout" placeholder="---"></li>' +
        '<li><span>订货单位</span><input class="createTime"  readonly="readonly"  id="operin" placeholder="---"></li>';
var shouhuo='<li><span>发货</span><input class="createTime"  readonly="readonly"  id="operout" placeholder="---"></li>' +
        '<li><span>收货</span><input class="createTime"  readonly="readonly"  id="operin" placeholder="---"></li>';
var ruku='<li><span>仓/店</span><input class="createTime"  readonly="readonly"  id="operout" placeholder="---"></li>' +
        '<li><span>厂商</span><input class="createTime"  readonly="readonly"  id="operin" placeholder="---"></li>';
var pandian='<li><span>仓/店</span><input class="createTime"  readonly="readonly"  id="operout" placeholder="---"></li>' +
        '<li><span>盘点方式</span><input class="createTime"  readonly="readonly"  id="operin" placeholder="---"></li>';

var dateoper='<li><span>日期</span><input class="createTime" readonly="readonly" id="operdate" placeholder="-&#45;&#45;"></li>' +
        '<li><span>操作员</span><input class="createTime"  readonly="readonly"  id="opername" placeholder="-&#45;&#45;"></li>';
var ischeck= '<li><span>是否检验</span><div class="mui-switch" id="mui-switch"><div class="mui-switch-handle"></div></div></li>';
var remark='<li><span>备注</span><input class="createTime" type="text"  id="remark" placeholder=""></li>';

var save='<div class="pub_num pub_btn cabsdot_bosdt" id="oper_save">保存</div>';
var audit='<div class="pub_num pub_btn" id="oper_audit">审核</div>';
var submit='<div class="pub_num pub_btn" style="float:right;" id="oper_sub">提交</div>';
var confirm='<div class="pub_num pub_btn" style="float:right;" id="oper_confirm">确认</div>';

var pageCodeArr=[
    {"page":"msa020_0400","body":{"north":diaoru,"center_up":dateoper,"center_down":ischeck,"south":remark},"bottom":submit},//调入单明细--主数据显示
    {"page":"msa020_0100","body":{"north":shouhuo,"center_up":dateoper,"center_down":ischeck,"south":remark},"bottom":submit},//收货单明细--主数据显示
    {"page":"msa010_0100","body":{"north":yaohuo,"center_up":dateoper,"center_down":"","south":remark},"bottom":save+audit},//要货单明细--主数据显示
    {"page":"msa010_0300","body":{"north":diaochu,"center_up":dateoper,"center_down":"","south":remark},"bottom":save+audit},//调出单明细--主数据显示
    {"page":"msa020_1200","body":{"north":ruku,"center_up":dateoper,"center_down":"","south":remark},"bottom":save+audit},//入库单明细--主数据显示
    {"page":"msa020_1300","body":{"north":ruku,"center_up":dateoper,"center_down":"","south":remark},"bottom":save+audit},//出库单明细--主数据显示
    {"page":"msa020_0500","body":{"north":pandian,"center_up":dateoper,"center_down":"","south":""},"bottom":save+submit+"@@"+audit},//盘点单明细--主数据显示
    {"page":"msa020_1600","body":{"north":pandian,"center_up":dateoper,"center_down":"","south":remark},"bottom":confirm},//盘点单确认明细--主数据显示
];

var listObj={};//主表数据对象
var tempDtlArr=[];//生成明细页面数据

var dataArr=[];

var tempArr=[];//记录明细数据以便点击加号时做处理

var serialMax=0;//明细数据最大序列号
var auditflag=true;   //审核标志/盘点单提交标志

var scanflag=false;//条码扫描标志
var areacode="";//盘点单盘点区域
var auditnum="";//盘点单 仓库在途商品数量

var pd_operid="";//盘点确认 确认操作之操作代码
var pd_orderid="";//盘点确认 确认操作之凭单号


var scanObj ={};//扫描到的对象

var delArr=[];//删除商品数组
var insertArr=[];//插入商品数组
var updateArr=[];//更新商品数组

$(function () {
    wfy.showload();
    dtlFlag=true;
    //页面入口
    pageinit(function (obj) {
        pageName = obj.page;//msa020_1200
        switch (pageName){
            //------------------------msa020_1200入库单  msa020_1300出库单-------------------------
            case 'msa020_1200':case 'msa020_1300':
                if(pageName=="msa020_1200"){
                    $("#page").html("入库单");
                }else{
                    $("#page").html("出库单");
                }
                opercode=localStorage.entrycode;
                getRUKUdtl(opercode,function (resList,resDtl) {
                    createPage(pageName,resList,resDtl);
                });
                break;
            case 'msa010_0100'://------------------------要货单-------------------------
                $("#page").html("要货单");
                opercode=localStorage.entrycode;
                getYAOHUODtl(opercode,function (resList,resDtl) {
                    createPage(pageName,resList,resDtl);
                });
                break;
            case 'msa010_0300'://------------------------调出单-------------------------
                $("#page").html("调出单");
                opercode=localStorage.entrycode;
                getDIAOCHUDtl(opercode,function (resList,resDtl) {
                    createPage(pageName,resList,resDtl);
                })
                break;
            case 'msa020_0400'://------------------------调入单-------------------------
                $("#page").html("调入单");
                opercode=localStorage.opercode;
                getDIAORUDtl(opercode,function (resList,resDtl) {
                    createPage(pageName,resList,resDtl);
                });
                break;
            case 'msa020_0100'://------------------------收货单-------------------------
                $("#page").html("收货单");
                opercode=localStorage.opercode;
                getSHOUHUODtl(opercode,function (resList,resDtl) {
                    createPage(pageName,resList,resDtl);
                });
                break;
            case 'msa020_0500'://------------------------盘点单-------------------------
                $("#page").html("盘点单");
                opercode=localStorage.entrycode;
                pdStatus=localStorage.strcode.split(";")[1];//盘点单进入状态 00录入未提交 01录入已提交 10审核未审核 11审核已审核
                var type="";
                if(pdStatus.substring(0,1)=="0"){
                    areacode=localStorage.strcode.split(";")[0];
                    type="L";//录入
                }else{
                    type="S";//审核
                }
                getPandianDtl(opercode,areacode,type,function (resList,resDtl) {
                    createPage(pageName,resList,resDtl);
                });
                break;
            case 'msa020_1600'://------------------------盘点单确认-------------------------
                $("#page").html("盘点单确认");
                opercode=localStorage.opercode;
                pdStatus=localStorage.strcode;
                getPandianDtl(opercode,"","Q",function (resList,resDtl) {
                    if(pdStatus=="00"){
                        getorder("PD",function (res) {
                            pd_operid=res[0].operid;
                            pd_orderid=res[0].orderid;
                        });
                    }
                    createPage(pageName,resList,resDtl);
                });
                break;
        }
    });
    //返回
    $('body').hammer().on('tap','#back',function (event) {
        event.stopPropagation();
        localStorage.page=pageName;

        if(pageName=="msa020_1200"||pageName=="msa020_1300"||pageName=="msa010_0100"||pageName=="msa010_0300"||pageName=="msa020_0500"){
            wfy.goto("bill_entry");
        }else{
            wfy.goto("bill_receive");
        }

    });
    //收货单 调入单 检验方式切换
    $('body').hammer().on("tap",'#mui-switch',function( event){
        event.stopPropagation();
        var style=$(this).attr("class");
        if(style.indexOf("mui-active")<0){
            //不检验
            var num=0;
            $(".confirm_num").each(function () {
                var confirmNum=Number($(this)[0].innerText);
                if(confirmNum>0){
                    num++;
                }
            });
            if(checkFlag&&num>0){
                wfy.confirm("已扫码，是否确认切换收获方式？",function(){
                    $(".confirm_num").each(function () {
                        var send_node= $(this).parent().prev().children();
                        $(this).html(send_node[0].innerText);
                    });
                },function(){
                    $("#mui-switch").addClass('mui-active');
                    checkFlag=true;
                });
            }else{
                $(".confirm_num").each(function () {
                    var send_node= $(this).parent().prev().children();
                    $(this).html(send_node[0].innerText);
                });
            }
            checkFlag=false;
        }else{
            //检验
            $(".confirm_num").html(0);
            checkFlag=true;
        }
    });

    //扫码
    wfy.tap(".order_scanner", function (_this) {
        checkFlag=true;
        //大明细A0SEF080110 小明细A0SEF080112
        //scannerOper("msa010_0100","A0SEF090111");
        app.scanner(function (code) {
            scannerOper(pageName,code);
        });
    });

    //提交
    $('body').hammer().on("tap","#oper_sub",function () {
        event.stopPropagation();
        if(pageName!="msa020_0500"){
            $(".confirm_num").each(function () {
                var send_node= $(this).parent().prev().children();
                var confirm_num=Number($(this).html());
                var send_num=Number(send_node[0].innerText);
                if(confirm_num!=send_num){
                    wfy.alert("校验失败");
                    return;
                }
                if(pageName=="msa020_0100"){
                    recieveSubmit();//收货单提交
                }else if(pageName=="msa020_0400"){
                    callinSubmit();//调入单提交
                }
            });
        }else{
            if(auditflag){
                checkSubmit();
            }else{
                wfy.alert("单据未保存，不能进行提交！");
                return;
            }
        }
    });
    //保存
    $('body').hammer().on("tap","#oper_save",function () {
        event.stopPropagation();
        if(!auditflag){
            saveDataDeal();
        }
    });
    //审核
    $('body').hammer().on("tap","#oper_audit",function () {
        event.stopPropagation();
        if(pageName!="msa020_0500"){
            if(auditflag){
                if(pageName=="msa020_1200"){
                    storageAudit('RK');//入库单审核
                }else if(pageName=="msa020_1300"){
                    storageAudit('HZRK');//出库单审核
                }else if(pageName=="msa010_0100"){
                    requireAudit();//要货单审核
                }else if(pageName=="msa010_0300"){
                    //calloutAudit();//调出单审核
                    subDiaoChu(opercode,function () {
                        wfy.alert("审核成功");
                        setTimeout(function () {
                            wfy.pagegoto('bill_entry');
                        },1000);
                    });
                }
            }else{
                wfy.alert("单据未保存，不能进行审核！");
                return;
            }
        }else{
            if(auditnum>0){
                wfy.confirm("仓库尚有在途商品未到货，是否要做盘点操作？",function () {
                    checkAudit();
                });
            }else{
                checkAudit();
            }

        }

    });
    //盘点单确认 确认
    $('body').hammer().on("tap","#oper_confirm",function () {
        event.stopPropagation();
        checkConfirm();
    });

});

//生成页面 顶部信息
function createPage(page,rowsList,rowsDtl){
    wfy.hideload();
    var dtlArr=[];
    var htmlStr="";
    var bottom_oper="";
    for (var i=0;i<pageCodeArr.length;i++){
        if(page==pageCodeArr[i].page){
            var tempObj=pageCodeArr[i].body;
            if(getValidStr(tempObj.center_down)==""){
                htmlStr+=tempObj.north+tempObj.center_up+tempObj.south;
            }else{
                htmlStr+=tempObj.north+tempObj.center_up+tempObj.center_down+tempObj.south;
            }
            bottom_oper=pageCodeArr[i].bottom;
        }
    }
    switch (pageName){
        case 'msa020_1200':case 'msa020_1300'://------------------------入库单(出库单与入库单页面相同)-------------------------
            listObj.operout=rowsList[0].kcckmc;
            listObj.operin=rowsList[0].xtwlmc;
            listObj.operdate=rowsList[0].kcczrq;
            listObj.opername=rowsList[0].kcczry;
            listObj.remark=rowsList[0].kcdjbz;
            listObj.operoutcode=rowsList[0].kcckdm;
            listObj.operincode=rowsList[0].xtwldm;
            listObj.ordercode=rowsList[0].kcpdhm;
            listObj.ordertype=rowsList[0].kcczlx;
            listObj.contactcode=rowsList[0].xtwldm;
            for(var i=0;i<rowsDtl.length;i++){
                dtlArr.push({"productcode":rowsDtl[i].xtwpks,"productname":rowsDtl[i].xtksmc,"colorcode":rowsDtl[i].xtwpxh,"colorname":rowsDtl[i].xtysmc,"num":rowsDtl[i].kcczsl,"price":rowsDtl[i].kcxsdj,"money":rowsDtl[i].kcxsje,"unit":"",'sku':rowsDtl[i].xtwpdm,'barcode':rowsDtl[i].xttxhm,"serialnum":rowsDtl[i].kcczhh})
            }
            $("#scanner").addClass("none");
            if(showFlag=="Y"){
                $(".bill_part_butn").removeClass("none");
            }else{
                $(".bill_part_butn").addClass("none");
            }
            break;
        case 'msa010_0100'://------------------------要货单-------------------------
            listObj.operout=rowsList[0].kcckmc;
            listObj.operin=rowsList[0].dhdwmc;
            listObj.operdate=rowsList[0].xslrrq;
            listObj.opername=rowsList[0].xslrry;
            listObj.remark=rowsList[0].xsyhbz;
            listObj.operoutcode=rowsList[0].kcyhck;
            listObj.operincode=rowsList[0].xtdhdw;
            listObj.ordercode=rowsList[0].xsyhdh;
            listObj.ordertype=rowsList[0].xsyhlx;
            listObj.contactcode=rowsList[0].xtwldm;
            for(var i=0;i<rowsDtl.length;i++){
                dtlArr.push({"productcode":rowsDtl[i].xtwpks,"productname":rowsDtl[i].xtksmc,"colorcode":rowsDtl[i].xtwpxh,"colorname":rowsDtl[i].xtysmc,"num":rowsDtl[i].xsyhsl,"price":rowsDtl[i].xsyhdj,"money":rowsDtl[i].xsyhje,"unit":rowsDtl[i].xtjldw,'sku':rowsDtl[i].xtwpdm,'barcode':rowsDtl[i].xttxhm,"serialnum":rowsDtl[i].xsydhh})
            }
            $("#scanner").addClass("none");
            if(showFlag=="Y"){
                $(".bill_part_butn").removeClass("none");
            }else{
                $(".bill_part_butn").addClass("none");
            }

            break;
        case 'msa010_0300'://------------------------调出单-------------------------
            listObj.operout=rowsList[0].fhckmc;
            listObj.operin=rowsList[0].shckmc;
            listObj.operdate=rowsList[0].xslrrq;
            listObj.opername=rowsList[0].xslrry;
            listObj.remark=rowsList[0].xsphbz;
            listObj.operoutcode=rowsList[0].fhckdm;
            listObj.operincode=rowsList[0].shckdm;
            listObj.ordercode=rowsList[0].xsphdh;
            listObj.contactcode=rowsList[0].shwldm;
            listObj.province=rowsList[0].xtkhsf;//AS_XTKHSF  VARCHAR2, --收货省份
            listObj.city=rowsList[0].xtkhcs;//AS_XTKHCS  VARCHAR2, --收货城市
            listObj.area=rowsList[0].xskhdq;//AS_XSKHDQ  VARCHAR2, --收货地区
            listObj.address=rowsList[0].xtkhdz;//AS_XTKHDZ  VARCHAR2, --地址
            listObj.zipcode=rowsList[0].xtkhyb;//AS_XTKHYB  VARCHAR2, --收货邮编
            listObj.person=rowsList[0].xtshry;//AS_XTSHRY  VARCHAR2, --收货人员
            listObj.phone=rowsList[0].xssjhm;//AS_XSSJHM  VARCHAR2, --手机号码
            listObj.mobile=rowsList[0].xtdhhm;//AS_XTDHHM  VARCHAR2, --电话号
            for(var i=0;i<rowsDtl.length;i++){
                dtlArr.push({"productcode":rowsDtl[i].xtwpks,"productname":rowsDtl[i].xtksmc,"colorcode":rowsDtl[i].xtwpxh,"colorname":rowsDtl[i].xtysmc,"num":rowsDtl[i].xsphsl,"price":rowsDtl[i].xsphdj,"money":rowsDtl[i].xsphje,"unit":rowsDtl[i].xtjldw,'sku':rowsDtl[i].xtwpdm,'barcode':rowsDtl[i].xttxhm,"serialnum":rowsDtl[i].xsphhh})
            }
            $("#scanner").addClass("none");
            $(".bill_part_butn").removeClass("none");
            break;
        case 'msa020_0400'://------------------------调入单-------------------------
            listObj.operout=rowsList[0].fhckmc;
            listObj.operin=rowsList[0].shckmc;
            listObj.operdate=rowsList[0].xsfhrq;
            listObj.opername=rowsList[0].kcczry;
            listObj.remark="";
            for(var i=0;i<rowsDtl.length;i++){
                dtlArr.push({"productcode":rowsDtl[i].xtwpks,"productname":rowsDtl[i].xtksmc,"colorcode":rowsDtl[i].xtwpxh,"colorname":rowsDtl[i].xtysmc,"num":rowsDtl[i].sl,"price":rowsDtl[i].dj,"money":rowsDtl[i].je,"unit":rowsDtl[i].xtjldw,'sku':rowsDtl[i].xtwpdm,'barcode':rowsDtl[i].xttxhm,"serialnum":""})
            }
            $("#scanner").removeClass("none");
            $(".bill_part_butn").addClass("none");
            break;
        case 'msa020_0100'://------------------------收货单-------------------------
            listObj.operout=rowsList[0].fhckmc;
            listObj.operin=rowsList[0].shckmc;
            listObj.operdate=rowsList[0].xsczrq;
            listObj.opername=rowsList[0].kcczry;
            listObj.remark="";
            for(var i=0;i<rowsDtl.length;i++){
                dtlArr.push({"productcode":rowsDtl[i].xtwpks,"productname":rowsDtl[i].xtksmc,"colorcode":rowsDtl[i].xtwpxh,"colorname":rowsDtl[i].xtysmc,"num":rowsDtl[i].sl,"price":rowsDtl[i].dj,"money":rowsDtl[i].je,"unit":rowsDtl[i].xtjldw,'sku':rowsDtl[i].xtwpdm,'barcode':rowsDtl[i].xttxhm,"serialnum":""})
            }
            $("#scanner").removeClass("none");
            $(".bill_part_butn").addClass("none");

            break;
        case 'msa020_0500'://------------------------盘点单-------------------------
            listObj.operout=rowsList[0].kcckmc;
            listObj.operin=stocktaking[rowsList[0].kcpdfs];
            listObj.operdate=rowsList[0].kcczrq;
            listObj.opername=rowsList[0].kcczxm;
            listObj.remark="";
            listObj.operoutcode=rowsList[0].kcckdm;
            listObj.operincode=rowsList[0].kcpdfs;
            auditnum=rowsList[0].ztddsl;
            for(var i=0;i<rowsDtl.length;i++){
                dtlArr.push({"productcode":rowsDtl[i].xtwpks,"productname":rowsDtl[i].xtwpmc,"colorcode":rowsDtl[i].xtwpxh,"colorname":rowsDtl[i].xtysmc,"num":rowsDtl[i].kcspsl,"price":rowsDtl[i].wpxsdj,"money":rowsDtl[i].kcspje,"unit":rowsDtl[i].jldwmc,'sku':rowsDtl[i].xtwpdm,'barcode':rowsDtl[i].xttxhm,"serialnum":rowsDtl[i].kczmsl});//此处serialnum为账面数量
            }
            if(pdStatus=="00"){//录入待提交
                $("#scanner").addClass("none");
                $(".bill_part_butn").removeClass("none");
            }else{//审核已审核
                $("#scanner").addClass("none");
                $(".bill_part_butn").addClass("none");
            }
            break;
        case 'msa020_1600'://------------------------盘点单确认-------------------------
            listObj.operout=rowsList[0].kcckmc;
            listObj.operin=stocktaking[rowsList[0].kcpdfs];
            listObj.operdate=rowsList[0].kcczrq;
            listObj.opername=rowsList[0].kcczxm;
            listObj.remark="";
            listObj.operoutcode=rowsList[0].kcckdm;
            listObj.operincode=rowsList[0].kcpdfs;
            for(var i=0;i<rowsDtl.length;i++){
                dtlArr.push({"productcode":rowsDtl[i].xtwpks,"productname":rowsDtl[i].xtwpmc,"colorcode":rowsDtl[i].xtwpxh,"colorname":rowsDtl[i].xtysmc,"num":rowsDtl[i].kcspsl,"price":rowsDtl[i].wpxsdj,"money":rowsDtl[i].kcspje,"unit":rowsDtl[i].kcjldw,'sku':rowsDtl[i].xtwpdm,'barcode':"","serialnum":rowsDtl[i].kczmsl});//此处serialnum为账面数量
            }
            $("#scanner").addClass("none");
            $(".bill_part_butn").addClass("none");
            break;
    }

    $("#page_main").html(htmlStr);
    //监测input值得变化~~~
    $('#remark').bind('input propertychange', function() {
        auditflag=false;
        $("#oper_save").removeClass("cabsdot_bosdt");
    });

    if(pageName!="msa020_0500"&&pageName!="msa020_1600"){
        if(showFlag=="N"){
            $("#page_bottom div").attr("style","width:50%;");
            $("#remark").attr("readonly","readonly");
        }else{
            $("#page_bottom div").removeAttr("style");
            $("#page_bottom").append(bottom_oper);
            $("#remark").removeAttr("readonly");
        }
    }else{
        //盘点单 单独处理
        if(pdStatus=="00"){//录入待提交
            $("#page_bottom").append(bottom_oper.split("@@")[0]);
        }else if(pdStatus=="01"){//录入已提交
            $("#remark").attr("readonly","readonly");
            $("#page_bottom div").attr("style","width:50%;");
        }else if(pdStatus=="10"){//审核待审核
            $("#page_bottom").append(bottom_oper.split("@@")[1]);
            $("#oper_audit").attr("style","float:right;");
        }else if(pdStatus=="11"){//审核已审核
            $("#page_bottom div").attr("style","width:50%;");
        }
    }

    $("#operout").val(listObj.operout);
    $("#operin").val(listObj.operin);
    $("#operdate").val(listObj.operdate);
    $("#opername").val(listObj.opername);
    $("#remark").val(listObj.remark);

    orderCreateDtl("create",page,dtlArr);
}





//////////---------------------------------------------------生成页面 商品信息-----------------------------------------------
function orderCreateDtl(type,page,rows){
    if(rows.length==0){
        wfy.alert("未查询到明细数据");
        return;
    }
    //[{"ksdm":"A0SEF02","ksmc":"裤子","cont":[{"color":"白色","price":"266","num":2,"style":"M","sku":"A0SEF020110"},{"color":"白色","price":"266","num":2,"style":"S","sku":"A0SEF020111"}]}]
    if(type=="create"){
        dataArr=[];
        tempDtlArr=[];
    }
    outer:
        for(var i=0;i<rows.length;i++){
            if(serialMax<Number(rows[i].serialnum)){
                serialMax=Number(rows[i].serialnum);
            }
            if(dataArr.length==0){
                dataArr.push({"productcode":rows[i].productcode,"productname":rows[i].productname,"colorcodeDtl":[rows[i].colorcode],"colornameDtl":[rows[i].colorname],"numDtl":[rows[i].num],"priceDtl":[rows[i].price],"moneyDtl":[rows[i].money],"unitDtl":[rows[i].unit],'skuDtl':[rows[i].sku],'barcodeDtl':[rows[i].barcode],'serialnumDtl':[rows[i].serialnum]});
                tempDtlArr.push({"ksdm":rows[i].productcode,"ksmc":rows[i].productname,"cont":[{"color":rows[i].colorname,"price":rows[i].price,"num":rows[i].num,"style":rows[i].colorcode,"sku":rows[i].sku,"jldw":rows[i].unit,"txhm":rows[i].barcode,"serialnum":rows[i].serialnum}]});
                continue outer;
            }
            for(var j=0;j<dataArr.length;j++){
                if(rows[i].productcode==dataArr[j].productcode) {
                    for(var z=0;z<dataArr[j].skuDtl.length;z++){
                        if(rows[i].sku==dataArr[j].skuDtl[z]){
                            dataArr[j].numDtl[z]+=Number(rows[i].num);
                            dataArr[j].moneyDtl[z]+=Number(rows[i].money);

                            tempDtlArr[j].cont[z].num+=Number(rows[i].num);

                            continue outer;
                        }
                    }
                    dataArr[j].colorcodeDtl.push(rows[i].colorcode);
                    dataArr[j].colornameDtl.push(rows[i].colorname);
                    dataArr[j].numDtl.push(rows[i].num);
                    dataArr[j].priceDtl.push(rows[i].price);
                    dataArr[j].moneyDtl.push(rows[i].money);
                    dataArr[j].unitDtl.push(rows[i].unit);
                    dataArr[j].skuDtl.push(rows[i].sku);
                    dataArr[j].barcodeDtl.push(rows[i].barcode);
                    dataArr[j].serialnumDtl.push(rows[i].serialnum);
                    (tempDtlArr[j].cont).push({"color":rows[i].colorname,"price":rows[i].price,"num":rows[i].num,"style":rows[i].colorcode,"sku":rows[i].sku,"jldw":rows[i].unit,"txhm":rows[i].barcode,"serialnum":rows[i].serialnum});
                    continue outer;

                }
            }
            dataArr.push({"productcode":rows[i].productcode,"productname":rows[i].productname,"colorcodeDtl":[rows[i].colorcode],"colornameDtl":[rows[i].colorname],"numDtl":[rows[i].num],"priceDtl":[rows[i].price],"moneyDtl":[rows[i].money],"unitDtl":[rows[i].unit],'skuDtl':[rows[i].sku],'barcodeDtl':[rows[i].barcode],'serialnumDtl':[rows[i].serialnum]});
            tempDtlArr.push({"ksdm":rows[i].productcode,"ksmc":rows[i].productname,"cont":[{"color":rows[i].colorname,"price":rows[i].price,"num":rows[i].num,"style":rows[i].colorcode,"sku":rows[i].sku,"jldw":rows[i].unit,"txhm":rows[i].barcode,"serialnum":rows[i].serialnum}]});
        }

        if(type=="create"){
            orderDtlDataDeal("add");
            tempArr=deepClone(tempDtlArr);
        }
        var total_num=0;
        var total_money=0;
        var htmlStr="";
        for(var i=0;i<dataArr.length;i++){
            var temp=dataArr[i];
            htmlStr+='<div class="bill_sku" data-index ="'+i+'">' +
                '<div class="bill_sku_product">' +
                '<div class="bill_sku_product_name">'+(i+1)+'、'+temp.productcode;
            if(page=="msa020_0100"||page=="msa020_0400"){
                htmlStr+='</div>';
            }else{
                if(page!="msa020_0500"&&page!="msa020_1600"){
                    if(showFlag=="Y"){
                        htmlStr+='<span class="bill_sku_delete" data-code="'+temp.productcode+'"  data-ksdm="'+temp.productcode+'">&#xe69d</span></div>';
                    }else{
                        htmlStr+='</div>';
                    }
                }else{
                    if(page=="msa020_0500"){
                        //盘点单 单独处理
                        if(pdStatus=="00"){//录入待提交
                            htmlStr+='<span class="bill_sku_delete" data-code="'+temp.productcode+'"  data-ksdm="'+temp.productcode+'">&#xe69d</span></div>';
                        }else{
                            htmlStr+='</div>';
                        }
                    }else{
                        htmlStr+='</div>';
                    }

                }

            }

            htmlStr+='<p class="b001">'+temp.productname+'</p></div>' +
                '<ul class="bill_sku_dtl">' ;
            for(var j=0;j<temp.colorcodeDtl.length;j++) {
                if(page != "msa020_1600"){
                    total_num += Number(temp.numDtl[j]);
                    total_money = accAdd(total_money,Number(temp.moneyDtl[j]));
                }else{
                    total_num += Number(temp.numDtl[j])-Number(temp.serialnumDtl[j]);
                    total_money = accAdd(total_money,Components.sub(temp.numDtl[j], accMul(temp.serialnumDtl[j],temp.priceDtl[j])));
                }

                if (page != "msa020_0500" && page != "msa020_1600") {
                    if (showFlag == "Y") {
                        htmlStr += '<li class="list_swiper">';
                    } else {
                        htmlStr += '<li>';
                    }

                } else {
                    //盘点单 单独处理
                    if (pdStatus == "00") {//录入待提交
                        htmlStr += '<li class="list_swiper">';
                    } else {
                        htmlStr += '<li>';
                    }
                }

                htmlStr += '<div class="bill_item thd ts200" data-code="' + temp.skuDtl[j] + '" data-barcode="' + temp.barcodeDtl[j] + '" data-serial="' + temp.serialnumDtl[j] + '">' +
                    '<span>' + temp.colornameDtl[j] + '</span>' ;

                if (page == "msa020_0100" || page == "msa020_0400") {
                    htmlStr +='<span style="padding-left: 10px">' + temp.colorcodeDtl[j] + '</span>'+
                        '<span>' + temp.numDtl[j] + '*' + temp.priceDtl[j] + '=' + temp.moneyDtl[j] + '</span>'+
                        '<span style="padding-left: 10px;">发货数:<span class="send_num">' + temp.numDtl[j] + '</span></span>' +
                        '<span style="padding-left: 10px;">确认数:<span class="confirm_num">0</span></span></div></li>';
                }else if(page == "msa020_1600"){
                    htmlStr +='<span style="padding-left: 15px;">' + temp.colorcodeDtl[j] + '</span>'+
                        '<span>' + (Number(temp.numDtl[j])-Number(temp.serialnumDtl[j])) + '*' + temp.priceDtl[j] + '=' + (Number(temp.numDtl[j])-Number(temp.serialnumDtl[j]))*Number(temp.priceDtl[j]) + '</span>'+
                        '<span style="padding-left: 10px;">盘点数:<span>' + temp.numDtl[j] + '</span></span>' +
                        '<span style="padding-left: 10px;">账面数:<span>'+temp.serialnumDtl[j]+'</span></span>' +
                        //'<span style="padding-left: 30px;">差异数:<span class="confirm_num">'+(Number(temp.serialnumDtl[j])-Number(temp.numDtl[j]))+'</span></span>' +
                        '</div></li>';
                }else{
                    htmlStr+='<span>' + temp.colorcodeDtl[j] + '</span>'+
                        '<span>' + temp.numDtl[j] + '*' + temp.priceDtl[j] + '=' + temp.moneyDtl[j] + '</span>'+
                        '</div>' +
                        '<div class="bill_drop" data-index ="'+j+'">'+
                        '<span class="mxdtl_add">&#xe6b9</span>'+
                        '<span class="mxdtl_delete">&#xe69d</span>' +
                        '<span class="mxdtl_reduce">-</span>' +
                        '</div></li>';
                }

            }

            htmlStr+='</ul></div>';
        }

        $(".bill_sku_box").html(htmlStr);
        $("#totalNum").html(total_num);
        $("#totalMoney").html(total_money);

        $(".confirm_num").each(function () {
            var send_node= $(this).parent().prev().children();
            $(this).html(send_node[0].innerText);
        });

    //console.info(dataArr)
    //console.info(tempDtlArr)////////////////////////////////////////////////// **********tempDtlArr**********------------------------------- 页面的初始数据
}


function saveDataDeal(){
    // console.error(data)
    // console.error(tempArr)
    if(data.length==0){
        wfy.alert("商品信息为空！无法保存");
        return;
    }
    /*
    * 这三个变量(操作变化的sku)  目前  sku删除的 集合 insertArr sku增加的集合  updateArr 只要有变化 就往这里边放！！！
    * 目前修改bug，要沿用之前的代码 ----- 页面如何操作 data数据 是 最新的最全的  tempArr 是页面最初始的 数据
    * 比较 tempArr 和 打他  然后将 比较结果放入  delArr insertArr updateArr 三个中！！ 才能呢个
    * 看来 需要写个处理 两个数组对象的比较了
    *
     *                                               如果存在 则要遍历每条数据 是否相等 ，如果 不想等  ---进入   updateArr
     tempArr 中  没有被遍历的数据 则 进入  insertArr 中 -----
    *
    * */
    delArr=[];//删除商品数组
    insertArr=[];//插入商品数组
    updateArr=[];//更新商品数组

    auditflag=false;
    $("#oper_save").removeClass("cabsdot_bosdt");
    // 开始 比较 tempArr 和 data
    var tempArr_cont = [];
    var data_cont = [];
    for(var a = 0 ;a < tempArr.length;a++){
        tempArr_cont =tempArr_cont.concat(tempArr[a].cont);
    }
    for(var b = 0 ;b < data.length;b++){
        data_cont =data_cont.concat(data[b].cont);
    }
    // console.log(data_cont)
    // console.log(tempArr_cont)
    var tempArr_cont_sku = [];
    var data_cont_sku = [];
    for(var c =0; c<tempArr_cont.length;c++){
        tempArr_cont_sku.push(tempArr_cont[c].sku);
    }
    for(var d =0; d<data_cont.length;d++){
        data_cont_sku.push(data_cont[d].sku);
    }

    for(var m = 0; m < data_cont.length; m++){//遍历新数据
        var sku_data = data_cont[m].sku;
        if(!tempArr_cont_sku.val_in_array(sku_data)){
            // 新的数据  和 任意一条都不想等 那么 这个是 新增的
            insertArr.push(data_cont[m])
        }else {
            for(var n =0 ;n < tempArr_cont.length; n++){
                if(sku_data == tempArr_cont[n].sku){
                    //相等的话  判断两者是不是 一样
                    if( JSON.stringify(data_cont[m])!= JSON.stringify(tempArr_cont[n])){
                        updateArr.push(data_cont[m])
                    }
                }
            }
        }
    }
    for(var x = 0; x<tempArr_cont.length;x++ ){//遍历 旧数据 获取删除的
        if(!data_cont_sku.val_in_array(tempArr_cont[x].sku)){
            //原始数据中 有的 而没在新的 数据中 ，那么 就是呗删掉了
            delArr.push(tempArr_cont[x])
        }
    }

    // console.error(delArr)
    // console.error(insertArr)
    // console.error(updateArr)
    requireOper();
}

//扫码校验
function scannerOper(page,record){
    var vali_num=0;
    var marry_num=0;
    var returnFlag=false;
    $(".bill_item").each(function () {
        var code=$(this).attr("data-barcode");
        var sku=$(this).attr("data-code");
        if(code==record){
            if(page=="msa020_0400"||page=="msa020_0100"){
                var confirm_node=$(this).children().eq(4).children();
                var send_num=Number($(this).children().eq(3).children()[0].innerText);
                var confirm_num=Number(confirm_node[0].innerText);
                var new_confirm=confirm_num+1;
                if(new_confirm>send_num){
                    wfy.alert("扫码数量超过发货数");
                    return false;
                }else{
                    confirm_node[0].innerText=new_confirm;
                    return false;
                }
            }else{
                var confirm_node=$(this).children().eq(2);
                var calStr=confirm_node[0].innerText;
                var old_num=Number(calStr.split("*")[0]);
                var price=Number((calStr.split("*")[1]).split("=")[0]);
                var new_num=old_num+1;
                var def=price*new_num;
                var old_total_num=Number($("#totalNum").html());
                var old_total_money=Number($("#totalMoney").html());
                var new_total_num=old_total_num+1;
                var new_total_money=old_total_money+price;
                confirm_node[0].innerText=new_num+"*"+price+"="+def;
                $("#totalNum").html(new_total_num);
                $("#totalMoney").html(new_total_money);

                for(var i=0;i<tempDtlArr.length;i++){
                    for(var j=0;j<tempDtlArr[i].cont.length;j++){
                        if(sku==tempDtlArr[i].cont[j].sku){
                            tempDtlArr[i].cont[j].num++;
                        }
                    }
                }
                orderDtlDataDeal("scan");
                scanflag=true;
                auditflag=false;
                $("#oper_save").removeClass("cabsdot_bosdt");
                returnFlag=true;
                return false;
            }

        }else{
            if(page=="msa020_0400"||page=="msa020_0100"){
                vali_num++;
            }else{
                //调用过程根据查到的条码直接查询商品信息添加到商品信息中
                marry_num++;
            }
        }
    });

    if(page=="msa020_0400"||page=="msa020_0100"){
        if(vali_num>0){
            wfy.alert("未匹配到商品信息");
            return;
        }
    }else{
        if(!returnFlag&&marry_num>0){

            auditflag=false;
            $("#oper_save").removeClass("cabsdot_bosdt");

            tmGetProDtl(record,function (res) {
                if(res.length>0){

                    scanflag=true;

                    scanObj ={};
                    scanObj.ksdm = res[0].xtwpks;
                    scanObj.ksmc = res[0].xtwpmc;
                    scanObj.cont =[{'color':res[0].xtysmc,'price':res[0].wpxsdj,'num':1,'style':res[0].xtwpxh,'sku':res[0].xtwpdm,'ksmc':res[0].xtwpmc,'jldw':res[0].xtjldw,'txhm':res[0].xttxhm}];

                    var rows=[];
                    rows.push({"productcode":res[0].xtwpks,"productname":res[0].xtwpmc,"colorcode":res[0].xtwpxh,"colorname":res[0].xtysmc,"num":1,"price":res[0].wpxsdj,"money":res[0].wpxsdj,"unit":res[0].xtjldw,'sku':res[0].xtwpdm,'barcode':res[0].xttxhm,"serialnum":0})


                    orderDtlDataDeal("scan");

                    orderCreateDtl("scan",pageName,rows);
                }else{
                    scanflag=false;
                    wfy.alert('未查询到条码对应的商品信息');
                    return;
                }

            });
        }
    }
}


function requireOper() {
    var remark=getValidStr($("#remark").val());
    // if(delArr.length>0 && insertArr.length==0 && updateArr.length==0){//只做删除操作
    //     if(pageName=="msa020_1200"){
    //         storageDel(false,'RK');//入库单删除
    //     }else if(pageName=="msa020_1300"){
    //         storageDel(false, 'HZRK');//出库单删除
    //     }else if(pageName=="msa010_0100"){
    //         requireDel(false);//要货单删除
    //     }else if(pageName=="msa010_0300"){
    //         calloutDel(false);//调出单删除
    //     }else if(pageName=="msa020_0500"){
    //         checkDel(false);//盘点单删除
    //     }
    // }
    //
    // if(delArr.length==0 &&(remark!=""||insertArr.length>0||updateArr.length>0)){//只做保存操作
    //     if(pageName=="msa020_1200") {
    //         storageSave('RK');//入库单保存
    //     }else if(pageName=="msa020_1300"){
    //         storageSave('HZRK');//出库单保存
    //     }else if(pageName=="msa010_0100"){
    //         requireSave();//要货单保存
    //     }else if(pageName=="msa010_0300"){
    //         calloutSave();//调出单保存
    //     }else if(pageName=="msa020_0500"){
    //         checkSave();//盘点单保存
    //     }
    // }
    // if(delArr.length>0&&(remark!=""||insertArr.length>0||updateArr.length>0)){//删除保存操作
    //     if(pageName=="msa020_1200") {
    //         storageDel(true, 'RK');//入库单删除
    //     }else if(pageName=="msa020_1300"){
    //         storageDel(true, 'HZRK');//出库单删除
    //     }else if(pageName=="msa010_0100"){
    //         requireDel(true);//要货单删除
    //     }else if(pageName=="msa010_0300"){
    //         calloutDel(true);//调出单删除
    //     }else if(pageName=="msa020_0500"){
    //         checkDel(true);//盘点单删除
    //     }
    // }
    if(pageName=="msa020_1200") {
        storageDel(true, 'RK');//入库单删除
    }else if(pageName=="msa020_1300"){
        storageDel(true, 'HZRK');//出库单删除
    }else if(pageName=="msa010_0100"){
        requireDel(true);//要货单删除
    }else if(pageName=="msa010_0300"){
        calloutDel(true);//调出单删除
    }else if(pageName=="msa020_0500"){
        checkDel(true);//盘点单删除
    }
}

//收货单提交
function recieveSubmit() {
    var vBiz = new FYBusiness("biz.dsds.phrk.save");

    var vOpr1 = vBiz.addCreateService("svc.dsds.phrk.save", true);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.dsds.phrk.save");
    vOpr1Data.setValue("AS_KCCZHM", opercode);
    vOpr1Data.setValue("AS_KCCZBZ", getValidStr($("#remark").val()));


    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            wfy.alert('提交成功！', function () {
                wfy.goto("bill_receive");
            });
        } else {
            wfy.alert('提交失败！' + (d.errorMessage || ''));
        }
    });

}

//调入单提交
function callinSubmit(){
    var vBiz = new FYBusiness("biz.dsmove.movein.save");

    var vOpr1 = vBiz.addCreateService("svc.dsmove.movein.save", true);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.dsmove.movein.save");
    vOpr1Data.setValue("AS_KCCZHM", opercode);
    vOpr1Data.setValue("AS_KCCZBZ", getValidStr($("#remark").val()));


    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            wfy.alert('提交成功！',function(){
                wfy.goto("bill_receive");
            });

        } else {
            wfy.alert('提交失败！' + (d.errorMessage || ''));
        }
    }) ;
}

//要货单删除
function requireDel(flag) {
    var vBiz = new FYBusiness("biz.veorder.detail.del");
    var vOpr1 = vBiz.addCreateService("svc.veorder.detail.del", false);
    for (var i = 0; i < delArr.length; i++) {

        var delData = vOpr1.addCreateData();
        delData.setValue("AS_USERID", LoginName);
        delData.setValue("AS_WLDM", DepartmentCode);
        delData.setValue("AS_FUNC", "svc.veorder.detail.del");
        delData.setValue("AS_XSCZHM", opercode);
        delData.setValue("AN_XSYDHH", delArr[i].serialnum);
    }

    var ipDel = new InvokeProc();
    ipDel.addBusiness(vBiz);
    ipDel.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            if(flag){
                requireSave();
            }else{
                auditflag = true;
                $("#oper_save").addClass("cabsdot_bosdt");

                wfy.alert('保存成功');
            }

        } else {
            wfy.alert("保存失败");
        }
    }) ;
}

//要货单保存
function requireSave(){
    var biz = new FYBusiness("biz.veorder.save");
    var svcMain = biz.addCreateService("svc.veorder.main.save", false);
    var dataMain = svcMain.addCreateData();
    dataMain.setValue("AS_USERID", LoginName);
    dataMain.setValue("AS_WLDM", DepartmentCode);
    dataMain.setValue("AS_FUNC", "svc.veorder.main.save");
    dataMain.setValue("AS_XSCZHM", opercode);//操作号码
    dataMain.setValue("AS_XSYHDH", listObj.ordercode);//要货单据号
    dataMain.setValue("AS_KCCKDM", listObj.operoutcode);//仓库代码（订货仓）
    dataMain.setValue("AS_XTWLDM", listObj.contactcode);//往来客户代码（订货客户）
    dataMain.setValue("AS_XSXQRQ", new Date().format("yyyy-MM-dd hh:mm:ss"));//需求日期
    dataMain.setValue("AS_YHLX", listObj.ordertype);//单据类型
    dataMain.setValue("AN_DJBL", 0);//定金比例
    dataMain.setValue("AS_YHBZ", getValidStr($("#remark").val()));//要货备注
    dataMain.setValue("AS_KCCKGS", listObj.operincode);//要货公司（订货单位）

    var svcDetail = biz.addCreateService("svc.veorder.dtl.save", false);
    for (var i = 0; i < insertArr.length; i++) {
        var dataDetail = svcDetail.addCreateData();
        dataDetail.setValue("AS_USERID", LoginName);
        dataDetail.setValue("AS_WLDM", DepartmentCode);
        dataDetail.setValue("AS_FUNC", "svc.veorder.dtl.save");
        dataDetail.setValue("AS_XSCZHM", opercode);//操作号码
        dataDetail.setValue("AN_XSYDHH", serialMax+i+1);//序号
        dataDetail.setValue("AS_WPDM", insertArr[i].sku);//产品编码
        dataDetail.setValue("AN_YHSL", insertArr[i].num);//要货数量
        dataDetail.setValue("AS_XTWLDM", listObj.contactcode);//系统往来代码
        dataDetail.setValue("AS_XSXQRQ", new Date().format("yyyy-MM-dd hh:mm:ss"));//需求日期
        dataDetail.setValue("AS_MXBZ", "");//备注
        dataDetail.setValue("AS_YHLX", listObj.ordertype);//要货单据类型
        dataDetail.setValue("AS_JLDW", insertArr[i].unit);//计量单位
        dataDetail.setValue("AN_YHDJ", insertArr[i].price);//要货单价（零售价）
        dataDetail.setValue("AN_PFJ", insertArr[i].price);//本币单价
        dataDetail.setValue("AS_XSDW", "");//单位
        dataDetail.setValue("AN_XSSL", 0);//数量
        dataDetail.setValue("AN_XSYS", 0);//余数
    }

    for (var i = 0; i < updateArr.length; i++) {
        var dataDetail = svcDetail.addCreateData();
        dataDetail.setValue("AS_USERID", LoginName);
        dataDetail.setValue("AS_WLDM", DepartmentCode);
        dataDetail.setValue("AS_FUNC", "svc.veorder.dtl.save");
        dataDetail.setValue("AS_XSCZHM", opercode);//操作号码
        dataDetail.setValue("AN_XSYDHH", updateArr[i].serialnum);//序号
        dataDetail.setValue("AS_WPDM", updateArr[i].sku);//产品编码
        dataDetail.setValue("AN_YHSL", updateArr[i].num);//要货数量
        dataDetail.setValue("AS_XTWLDM", listObj.contactcode);//系统往来代码
        dataDetail.setValue("AS_XSXQRQ", new Date().format("yyyy-MM-dd hh:mm:ss"));//需求日期
        dataDetail.setValue("AS_MXBZ", "");//备注
        dataDetail.setValue("AS_YHLX", listObj.ordertype);//要货单据类型
        dataDetail.setValue("AS_JLDW", updateArr[i].unit);//计量单位
        dataDetail.setValue("AN_YHDJ", updateArr[i].price);//要货单价（零售价）
        dataDetail.setValue("AN_PFJ", updateArr[i].price);//本币单价
        dataDetail.setValue("AS_XSDW", "");//单位
        dataDetail.setValue("AN_XSSL", 0);//数量
        dataDetail.setValue("AN_XSYS", 0);//余数
    }

    var ip = new InvokeProc();
    ip.addBusiness(biz);
    ip.invoke(function (d) {
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            auditflag=true;
            $("#oper_save").addClass("cabsdot_bosdt");

            window.setTimeout(function(){
                wfy.alert("保存要货单成功！");
            },500);
        } else {
            window.setTimeout(function(){
                wfy.alert("保存要货单败！");
            },500);
        }
    });
}

//要货单审核
function requireAudit() {
    var biz = new FYBusiness("biz.veorder.main.modify");
    var svc = biz.addCreateService("svc.veorder.main.modify", false);
    var data = svc.addCreateData();
    data.setValue("AS_USERID", LoginName);
    data.setValue("AS_WLDM", DepartmentCode);
    data.setValue("AS_FUNC", "svc.veorder.main.modify");
    data.setValue("AS_CZHM", opercode);
    data.setValue("AS_XTWLDM", listObj.contactcode);
    data.setValue("AS_KCCKDM", "");
    data.setValue("AS_MODIFY_LX", "confirm");

    var ip = new InvokeProc();
    ip.addBusiness(biz);
    ip.invoke(function (res) {
        if (res && res.success) {
            wfy.alert("审核成功");
            setTimeout(function () {
                wfy.pagegoto('bill_entry');
            },1000);
        } else {
            wfy.alert("审核要货单失败！" + res.errorMessage);
        }
    });
}

//调出单删除
function calloutDel(flag) {
    var vBizDel = new FYBusiness("biz.ds.move.detail.delete");
    var vOpr1Del = vBizDel.addCreateService("svc.ds.move.detail.delete", true);
    for (var i = 0; i < delArr.length; i++) {
        var delData = vOpr1Del.addCreateData();
        delData.setValue("AS_USERID", LoginName);
        delData.setValue("AS_WLDM", DepartmentCode);
        delData.setValue("AS_FUNC", "svc.ds.move.detail.delete");
        delData.setValue("AS_CZHM", opercode);
        delData.setValue("AS_PHHH", delArr[i].serialnum);
        delData.setValue("AS_WPDM", delArr[i].sku);
    }
    var ipDel = new InvokeProc();
    ipDel.addBusiness(vBizDel);
    ipDel.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            if(flag){
                calloutSave();
            }else{
                auditflag = true;
                $("#oper_save").addClass("cabsdot_bosdt");

                wfy.alert('保存成功');
            }
        } else {
            wfy.alert("保存失败");
        }
    }) ;
}

//调出单保存
function calloutSave(){
    var biz = new FYBusiness("biz.ds.move.detail.save");
    var svcMain = biz.addCreateService("svc.ds.move.header.save", false);
    var dataMain = svcMain.addCreateData();
    dataMain.setValue("AS_USERID", LoginName);
    dataMain.setValue("AS_WLDM", DepartmentCode);
    dataMain.setValue("AS_FUNC", "svc.ds.move.header.save");
    dataMain.setValue("AS_CZHM", opercode);
    dataMain.setValue("AS_PHDH", listObj.ordercode);//单号
    dataMain.setValue("AS_DCCK", listObj.operoutcode);//调出仓库
    dataMain.setValue("AS_DRWL", listObj.contactcode);//调入客户
    dataMain.setValue("AS_DRCK", listObj.operincode);//调入仓库
    dataMain.setValue("AS_DJBZ", getValidStr($("#remark").val()));//备注
    dataMain.setValue("AS_YSFS", '');//运输方式
    dataMain.setValue("AS_XTKHSF", listObj.province);//收货省份
    dataMain.setValue("AS_XTKHCS", listObj.city);//收货城市
    dataMain.setValue("AS_XSKHDQ", listObj.area);//收货地区
    dataMain.setValue("AS_XTKHDZ", listObj.address);//地址
    dataMain.setValue("AS_XTKHYB", listObj.zipcode);//收货邮编
    dataMain.setValue("AS_XTSHRY", listObj.person);//收货人员
    dataMain.setValue("AS_XSSJHM", listObj.mobile);//手机号码
    dataMain.setValue("AS_XTDHHM", listObj.kcgddh);//电话号

    var svcDetail = biz.addCreateService("svc.ds.move.detail.save", false);
    for(var i=0;i<insertArr.length;i++){
        var dataDetail = svcDetail.addCreateData();
        dataDetail.setValue("AS_USERID", LoginName);
        dataDetail.setValue("AS_WLDM", DepartmentCode);
        dataDetail.setValue("AS_FUNC", "svc.ds.move.detail.save");
        dataDetail.setValue("AS_CZHM", opercode);//操作号码
        dataDetail.setValue("AS_DCCK", listObj.operoutcode);//调出库存
        dataDetail.setValue("AS_DRWL", listObj.contactcode);//调入往来
        dataDetail.setValue("AS_DRCK", listObj.operincode);//调入仓库
        dataDetail.setValue("AS_WPDM", insertArr[i].sku);//商品编码
        dataDetail.setValue("AS_JLDW", insertArr[i].unit);//计量单位
        dataDetail.setValue("AN_DCSL", insertArr[i].num);//调出数量
        dataDetail.setValue("AN_XSDJ", insertArr[i].price);//单价
        dataDetail.setValue("AN_DCJE", insertArr[i].money);//调出金额
        dataDetail.setValue("AS_DJBZ", "");//备注
        dataDetail.setValue("AN_PHHHI", serialMax+i+1);//行号
    }
    for(var i=0;i<updateArr.length;i++){
        var dataDetail = svcDetail.addCreateData();
        dataDetail.setValue("AS_USERID", LoginName);
        dataDetail.setValue("AS_WLDM", DepartmentCode);
        dataDetail.setValue("AS_FUNC", "svc.ds.move.detail.save");
        dataDetail.setValue("AS_CZHM", opercode);//操作号码
        dataDetail.setValue("AS_DCCK", listObj.operoutcode);//调出库存
        dataDetail.setValue("AS_DRWL", listObj.contactcode);//调入往来
        dataDetail.setValue("AS_DRCK", listObj.operincode);//调入仓库
        dataDetail.setValue("AS_WPDM", updateArr[i].sku);//商品编码
        dataDetail.setValue("AS_JLDW", updateArr[i].unit);//计量单位
        dataDetail.setValue("AN_DCSL", updateArr[i].num);//调出数量
        dataDetail.setValue("AN_XSDJ", updateArr[i].price);//单价
        dataDetail.setValue("AN_DCJE", updateArr[i].money);//调出金额
        dataDetail.setValue("AS_DJBZ", "");//备注
        dataDetail.setValue("AN_PHHHI", updateArr[i].serialnum);//行号
    }

    var ip = new InvokeProc();
    ip.addBusiness(biz);
    ip.invoke(function (res) {
        if (res && res.success) {
            wfy.alert("保存成功");
            auditflag = true;
            $("#oper_save").addClass("cabsdot_bosdt");
        } else {
            wfy.alert(res.errorMessage);
        }
    });
}

//调出单审核
function calloutAudit() {
    var biz = new FYBusiness("biz.ds.move.list.modify");
    var svc = biz.addCreateService("svc.ds.move.list.modify", false);
    var data = svc.addCreateData();
    data.setValue("AS_USERID", LoginName);
    data.setValue("AS_WLDM", DepartmentCode);
    data.setValue("AS_FUNC", "svc.ds.move.list.modify");
    data.setValue("AS_CZHM", opercode);
    data.setValue("AS_XTWLDM", listObj.contactcode);
    data.setValue("AS_KCCKDM", listObj.operoutcode);
    data.setValue("AS_MODIFY_LX", "confirm");
    var ip = new InvokeProc();
    ip.addBusiness(biz);
    console.log(JSON.stringify(ip))
    ip.invoke(function (res) {
        if (res && res.success) {
            wfy.alert("审核成功");
            // setTimeout(function () {
            //     wfy.pagegoto('bill_entry');
            // },1000);
        } else {
            wfy.alert("审核调出单失败！" + res.errorMessage);
        }
    });
}

//入库单删除
function storageDel(flag,orderType) {
    var vBizDel = new FYBusiness("biz.invopr.mx.del");
    var vOpr1Del = vBizDel.addCreateService("svc.invopr.mx.del", false);
    for (var i = 0; i < delArr.length; i++) {
        var delData = vOpr1Del.addCreateData();
        delData.setValue("AS_USERID", LoginName);
        delData.setValue("AS_WLDM", DepartmentCode);
        delData.setValue("AS_FUNC", "svc.invopr.mx.del");
        delData.setValue("AS_KCCZHM", opercode);
        delData.setValue("AN_KCCZHH", delArr[i].serialnum);
        delData.setValue("AS_DJLX", orderType);
    }

    var ipDel = new InvokeProc();
    ipDel.addBusiness(vBizDel);
    console.log(JSON.stringify(ipDel))
    ipDel.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            if(flag){
                storageSave(orderType);
            }else{
                auditflag = true;
                $("#oper_save").addClass("cabsdot_bosdt");

                wfy.alert('保存成功');
            }

        } else {
            wfy.alert("保存失败");
        }
    }) ;
}

//入库单保存
function storageSave(orderType) {
    var vBiz = new FYBusiness("biz.invopr.invopr.save.head");
    var vOpr1 = vBiz.addCreateService("svc.invopr.invopr.save.head", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invopr.invopr.save.head");
    vOpr1Data.setValue("AS_KCCZHM", opercode );//操作号码
    vOpr1Data.setValue("AS_KCPDHM", listObj.ordercode);//单号
    vOpr1Data.setValue("AS_KCCZLX", listObj.ordertype);//操作类型
    vOpr1Data.setValue("AS_KCCKDM", listObj.operoutcode);//仓库代码 ---对应  仓/店
    vOpr1Data.setValue("AS_KCCZRQ", new Date().format("yyyy-MM-dd hh:mm:ss"));//操作日期
    vOpr1Data.setValue("AS_XTWLDM", listObj.operincode);//往来单位 ---对应厂商
    vOpr1Data.setValue("AS_KCDFCK", '');//对方仓库
    vOpr1Data.setValue("AS_KCYSPD", '');//原始单号
    vOpr1Data.setValue("AS_KCDJBZ",getValidStr($("#remark").val()));//备注-
    vOpr1Data.setValue("AS_DJLX", orderType);//单据类型 RK
    vOpr1Data.setValue("AS_KCCZHM2", "");//对方操作号码---此处传空
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.info(JSON.stringify(ip));
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            storageDtlSave(orderType)
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}

function storageDtlSave(orderType) {
    var vBiz = new FYBusiness("biz.invopr.invopr.save.detail");
    var svcDetail = vBiz.addCreateService("svc.invopr.invopr.save.datail", false);
    for (var i = 0; i < insertArr.length; i++) {
        var dataDetail = svcDetail.addCreateData();
        dataDetail.setValue("AS_USERID", LoginName);
        dataDetail.setValue("AS_WLDM", DepartmentCode);
        dataDetail.setValue("AS_FUNC", "svc.invopr.invopr.save.datail");
        dataDetail.setValue("AS_KCCZHM", opercode);//操作号码
        dataDetail.setValue("AS_KCCZHM2", "");//对方操作号码
        dataDetail.setValue("AS_KCPDHM",listObj.ordercode);//单号
        dataDetail.setValue("AN_KCCZHH",serialMax+i+1);//行号
        dataDetail.setValue("AS_KCCZLX",listObj.ordertype);//操作类型
        dataDetail.setValue("AS_XTWPDM", insertArr[i].sku);//产品编码
        dataDetail.setValue("AS_KCCKDM", listObj.operoutcode);//仓库代码
        dataDetail.setValue("AS_KCDFCK", "");//对方仓库
        dataDetail.setValue("AS_KCCZRQ", new Date().format("yyyy-MM-dd hh:mm:ss"));//需求日期
        dataDetail.setValue("AS_XTWLDM", listObj.contactcode);//往来单位
        dataDetail.setValue("AN_KCXSDJ", insertArr[i].price);//销售单价
        dataDetail.setValue("AN_KCCZSL", insertArr[i].num);//操作数量
        dataDetail.setValue("AN_KCSSJE", "");//实收金额
        dataDetail.setValue("AN_KCWPJE", "");//成本金额
        dataDetail.setValue("AN_KCJSJE", "");//结算金额
        dataDetail.setValue("AS_KCDJBZ", "");//备注
        dataDetail.setValue("AS_DJLX", orderType);//单据类型
    }
    for (var i = 0; i < updateArr.length; i++) {
        var dataDetail = svcDetail.addCreateData();
        dataDetail.setValue("AS_USERID", LoginName);
        dataDetail.setValue("AS_WLDM", DepartmentCode);
        dataDetail.setValue("AS_FUNC", "svc.invopr.invopr.save.datail");
        dataDetail.setValue("AS_KCCZHM", opercode);//操作号码
        dataDetail.setValue("AS_KCCZHM2", "");//对方操作号码
        dataDetail.setValue("AS_KCPDHM",listObj.ordercode);//单号
        dataDetail.setValue("AN_KCCZHH",updateArr[i].serialnum);//行号
        dataDetail.setValue("AS_KCCZLX",listObj.ordertype);//操作类型
        dataDetail.setValue("AS_XTWPDM", updateArr[i].sku);//产品编码
        dataDetail.setValue("AS_KCCKDM", listObj.operoutcode);//仓库代码
        dataDetail.setValue("AS_KCDFCK", "");//对方仓库
        dataDetail.setValue("AS_KCCZRQ", new Date().format("yyyy-MM-dd hh:mm:ss"));//需求日期
        dataDetail.setValue("AS_XTWLDM", listObj.contactcode);//往来单位
        dataDetail.setValue("AN_KCXSDJ", updateArr[i].price);//销售单价
        dataDetail.setValue("AN_KCCZSL", updateArr[i].num);//操作数量
        dataDetail.setValue("AN_KCSSJE", "");//实收金额
        dataDetail.setValue("AN_KCWPJE", "");//成本金额
        dataDetail.setValue("AN_KCJSJE", "");//结算金额
        dataDetail.setValue("AS_KCDJBZ", "");//备注
        dataDetail.setValue("AS_DJLX", orderType);//单据类型
    }

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.info(JSON.stringify(ip));
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            auditflag = true;
            $("#oper_save").addClass("cabsdot_bosdt");

            wfy.alert('保存成功');
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}

//入库单审核
function storageAudit(orderType) {
    changeStatus(orderType,opercode,"S",function () {
        wfy.alert("审核成功");
        wfy.pagegoto('bill_entry');
    });
}

//盘点单 删除
function checkDel(flag) {

    var vBizDel = new FYBusiness("biz.inv.st.ipt.dtl.del");
    var vOpr1Del = vBizDel.addCreateService("svc.inv.st.ipt.dtl.del", false);
    for (var i = 0; i < delArr.length; i++) {

        var delData = vOpr1Del.addCreateData();
        delData.setValue("AS_USERID", LoginName);
        delData.setValue("AS_WLDM", DepartmentCode);
        delData.setValue("AS_FUNC", "svc.inv.st.ipt.dtl.del");
        delData.setValue("AS_KCCZHM", opercode);
        delData.setValue("AS_PDQY", areacode);
        delData.setValue("AS_WPDM", delArr[i].sku);
        delData.setValue("AN_SPSL", 0);
    }

    var ipDel = new InvokeProc();
    ipDel.addBusiness(vBizDel);
    ipDel.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            if(flag){
                checkSave();
            }else{
                auditflag = true;
                $("#oper_save").addClass("cabsdot_bosdt");

                wfy.alert('保存成功');
            }

        } else {
            wfy.alert("保存失败");
        }
    }) ;
}

//盘点单 保存
function checkSave() {
    var str="";
    for(var i=0;i<insertArr.length;i++){
        str +=insertArr[i].sku + "," + insertArr[i].num + ";";
    }
    for(var i=0;i<updateArr.length;i++){
        str +=updateArr[i].sku + "," + updateArr[i].num + ";";
    }

    var biz = new FYBusiness("biz.inv.st.input.dtl.save");

    var svcMain = biz.addCreateService("svc.inv.st.input.header.save", false);
    var dataMain = svcMain.addCreateData();
    dataMain.setValue("AS_USERID", LoginName);
    dataMain.setValue("AS_WLDM", DepartmentCode);
    dataMain.setValue("AS_FUNC", "svc.inv.st.input.header.save");
    dataMain.setValue("AS_KCCZHM", opercode);//操作号
    dataMain.setValue("AS_KCCKDM", listObj.operoutcode);//仓库代码
    dataMain.setValue("AS_PDQY", areacode);//盘点区域
    dataMain.setValue("AS_PDRY", listObj.opername);//盘点人员
    dataMain.setValue("AS_PDFS", listObj.operincode);//盘点方式
    dataMain.setValue("ADT_PDZT", "L");//盘点状态

    var svcDetail = biz.addCreateService("svc.inv.st.input.detail.save", false);
    var dataDetail = svcDetail.addCreateData();
    dataDetail.setValue("AS_USERID", LoginName);
    dataDetail.setValue("AS_WLDM", DepartmentCode);
    dataDetail.setValue("AS_FUNC", "svc.inv.st.input.detail.save");
    dataDetail.setValue("AS_KCCZHM", opercode);//操作号码
    dataDetail.setValue("AS_KCCKDM", listObj.operoutcode);//仓库代码
    dataDetail.setValue("AS_PDQY", areacode);//盘点区域
    dataDetail.setValue("AS_TOKEN", str);//商品明细

    var ip = new InvokeProc();
    ip.addBusiness(biz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var res = svcMain.getOutputPermeterMap(d, 'AS_KCCZHMO');
            opercode = res.AS_KCCZHMO;

            auditflag = true;
            $("#oper_save").addClass("cabsdot_bosdt");

            wfy.alert('保存成功');
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}

//盘点单 提交
function checkSubmit() {
    var vBiz = new FYBusiness("biz.inv.st.ipt.mod");

    var vOpr1 = vBiz.addCreateService("svc.inv.st.ipt.mod", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.inv.st.ipt.mod");
    vOpr1Data.setValue("AS_CZHM", opercode);
    vOpr1Data.setValue("AS_CZZT", "L");
    vOpr1Data.setValue("AS_PDQY", areacode);
    vOpr1Data.setValue("AS_KCCKDM", listObj.operoutcode);
    vOpr1Data.setValue("MODIFY_LX", "confirm");

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {
        if (d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y") {
            wfy.alert("提交成功");
            setTimeout(function () {
                wfy.pagegoto('bill_entry');
            },1000);
        } else {
            wfy.alert("提交盘点单失败！" + d.errorMessage);
        }
    });
}

//盘点单 审核
function checkAudit() {

    var vBiz = new FYBusiness("biz.invst.checkbill.header.audit");

    var vOpr1 = vBiz.addCreateService("svc.invst.checkbill.header.audit", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invst.checkbill.header.audit");
    vOpr1Data.setValue("AS_KCCKDM", listObj.operoutcode);
    vOpr1Data.setValue("AS_PDRQ", listObj.operdate);
    vOpr1Data.setValue("AS_CZHM", opercode);

    var vOpr2 = vBiz.addCreateService("svc.inv.st.one.detail.sh", false);
    var cou = 0;//单据数量，等于一百的时候置零
    var str = "";

    for (var i = 0; i < dataArr.length; i++) {
        for(var j=0; j< dataArr[i].skuDtl.length; j++){
            cou++;
            str = str + dataArr[i].skuDtl[j] + "," + dataArr[i].numDtl[j] + "," + dataArr[i].serialnumDtl[j] + ";";
            if(cou == 100 || i==dataArr.length-1){

                var vOpr2Data = vOpr2.addCreateData();
                vOpr2Data.setValue("AS_USERID", LoginName);
                vOpr2Data.setValue("AS_WLDM", DepartmentCode);
                vOpr2Data.setValue("AS_FUNC", "svc.inv.st.one.detail.sh");
                vOpr2Data.setValue("AS_KCCKDM", listObj.operoutcode);
                vOpr2Data.setValue("AS_PDRQ", listObj.operdate);
                vOpr2Data.setValue("AS_CZHM", opercode);
                vOpr2Data.setValue("AS_TOKEN_IN", str);
                cou = 0;
                str = "";
            }
        }

    }

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {
        if (d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y") {

            wfy.alert("审核成功");
            setTimeout(function () {
                wfy.pagegoto('bill_entry');
            },1000);

        } else {
            wfy.alert("审核失败！" + d.errorMessage);
        }
    });

}

//盘点单 确认
function checkConfirm() {

    var vBiz = new FYBusiness("biz.inv.st.detail.confirm");

    var vOpr1 = vBiz.addCreateService("svc.inv.st.detail.confirm", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.inv.st.detail.confirm");
    vOpr1Data.setValue("AS_YSPD", opercode);
    vOpr1Data.setValue("AS_CZBZ", listObj.remark);
    vOpr1Data.setValue("AS_PDCZHM", opercode);
    vOpr1Data.setValue("AS_CZHM", pd_operid);
    vOpr1Data.setValue("AS_PDHM", pd_orderid);
    vOpr1Data.setValue("AS_WPDM", "");
    vOpr1Data.setValue("AS_JLDW", "");
    vOpr1Data.setValue("AN_SPSL", "");
    vOpr1Data.setValue("AN_ZMSL", "");
    vOpr1Data.setValue("AN_XSDJ", "");
    var vOpr2 = vBiz.addCreateService("svc.inv.st.confirm.header", false);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.inv.st.confirm.header");
    vOpr2Data.setValue("AS_YSPD", opercode);//原始凭单 传入操作号码
    vOpr2Data.setValue("AS_CZBZ", listObj.remark);//备注
    vOpr2Data.setValue("AS_PDCZHM", opercode);//操作号码
    vOpr2Data.setValue("AS_CZHM", pd_operid);//新增操作号码
    vOpr2Data.setValue("AS_PDHM", pd_orderid);//新增凭单号

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            wfy.alert("确认成功");
            setTimeout(function () {
                wfy.pagegoto('bill_receive');
            },1000);
        } else {
            wfy.alert("确认失败！" + d.errorMessage);
        }
    }) ;
}

//精确 加法
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

// 精确 乘法
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
