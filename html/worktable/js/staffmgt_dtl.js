localStorage.his = 'staffmgt_dtl';
localStorage.prev = 'staffmgt';

//员工代码
var code=localStorage.staffcode;
var operType="";

var saveObj={};//数据保存对象
var shopArr=[];//门店
var roleArr=[];//岗位
var roleArr_gs=[{xtyhzm: "M00", xtyzmc: "老板"}];//岗位
var roleArr_md=[{xtyhzm: "M01", xtyzmc: "店长"},{xtyhzm: "M02", xtyzmc: "导购"}];//岗位
window.uexOnload= function () {
    uexWindow.setReportKey(0, 1); // 物理返回键接管
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode === 0){
            wfy.pagegoto('staffmgt');
        }
    };
}
$(function () {
    //获取下拉显示数据
    getComboData();

    //门店
    $('body').hammer().on('tap', '#shop', function (event) {
        event.stopPropagation();
        if(operType == 'EDIT'){
            return false;
        }
        var html = '';
        for(var i = 0; i <shopArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+shopArr[i].xtwldm+'" data-type="shop" data-lx="'+shopArr[i].xtkhlx+'">'+shopArr[i].xtwlmc+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //岗位
    $('body').hammer().on('tap', '#quarters', function (event) {
        event.stopPropagation();

        var html = '';
        var roleArr = [];
        var lx = $('#shop').attr('data-lx');
        var gsmc = $('#shop').val();
        if(gsmc == ''){
            wfy.alert('请先选择门店');
            return ;
        }
        if(lx == 1){
            //公司
            roleArr = roleArr_gs;
        }else {
            roleArr = roleArr_md;
        }
        for(var i = 0; i <roleArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+roleArr[i].xtyhzm+'" data-type="quarters" data-lx="岗位">'+roleArr[i].xtyzmc+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //点击选择弹出的模式
    $('body').hammer().on('tap','#multi_box .item',function (event) {
        event.stopPropagation();
        event.stopPropagation();
        var selCode= $(this).attr('data-code');
        var selName= $(this).html();
        var nodeId= $(this).attr('data-type');
        $("#"+nodeId).attr("data-code",selCode);
        $("#"+nodeId).val(selName);
        if(nodeId =='shop'){
            var lx = $(this).attr('data-lx');
            $("#"+nodeId).attr("data-lx",lx);
            $('#quarters').val('').attr('data-code','');
        }
        wfy.closeWin();
    });

    //点击保存按钮
    //onkeyup="this.value=this.value.replace(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/g,'')"
    $('body').hammer().on('tap', '#pro_save', function (event) {
        event.stopPropagation();

        saveObj.name=getValidStr($("#name").val());
        saveObj.jobnum=getValidStr($("#jobnum").val());
        saveObj.original=$("#password").val();//原始输入密码
        saveObj.shop=getValidStr($("#shop").attr("data-code"));
        saveObj.quarters=getValidStr($("#quarters").attr("data-code"));
        saveObj.status=$("#mui-switch").hasClass("mui-active")?"N":"Y";//离职标志
        saveObj.cost=$("#cost").hasClass("mui-active")?"Y":"N";//成本
        saveObj.sale=$("#sale").hasClass("mui-active")?"Y":"N";//收银
        if(operType=="ADD"){
            if(getValidStr($("#mobile").val())=="") {
                wfy.alert("手机号不能为空");
                return;
            }else{
                if(!mobilephoneVali(getValidStr($("#mobile").val()))){
                    wfy.alert("请输入正确的手机号码");
                    return;
                }
                saveObj.mobile=getValidStr($("#mobile").val());
                saveObj.code=saveObj.mobile;
            }
        }else{
            saveObj.code=getValidStr(code);
            saveObj.mobile=getValidStr($("#mobile").attr("data-phone"));
        }

        if(saveObj.name==""){
            wfy.alert("姓名不能为空");
            return;
        }

        if(saveObj.original==""){
            wfy.alert("密码不能为空");
            return;
        }else {
            if(!checkPass(saveObj.original)){
                wfy.alert("密码6-8位数字和字母");
                return;
            }else {
                changePassStatus("encrypt",$("#password").val(),function (record) {
                    saveObj.password=record;//密文
                });
            }
        }

        if(saveObj.shop==""){
            wfy.alert("门店不能为空");
            return;
        }

        if(saveObj.quarters==""){
            wfy.alert("岗位不能为空");
            return;
        }

        dataSave();
    });



    //查询明细信息
    if(code!=""){
        operType="EDIT";
        $("#mobile").attr("readonly","readonly");
        getDataDtl(code);
    }else{
        operType="ADD";
        $("#mobile").removeAttr("readonly");
    }

});

//获取下拉显示数据
function getComboData() {
    var vBiz = new FYBusiness("biz.ctluser.baseitem.qry");
    var vOpr1 = vBiz.addCreateService("svc.ctluser.baseitem.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctluser.baseitem.qry");
    var ip = new InvokeProc(false);
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            roleArr=vOpr1.getResult(d, "AC_ROLE").rows||[];
            shopArr=vOpr1.getResult(d, "AC_SHOP").rows||[];

            if(shopArr.length==1){
                $("#shop").val(shopArr[0].xtwlmc);
                $("#shop").attr("data-code",shopArr[0].xtwldm);
            }

        } else {
            wfy.alert("获取数据失败");
        }
    }) ;
}

//获取数据明细
function getDataDtl(record) {
    var vBiz = new FYBusiness("biz.ctluser.userdefine.qry");

    var vOpr1 = vBiz.addCreateService("svc.ctluser.userdefine.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctluser.userdefine.qry");
    vOpr1Data.setValue("AS_KEYWORDS", "");
    vOpr1Data.setValue("AS_XTYHDM", record);
    vOpr1Data.setValue("AN_PAGE_NUM", "1");
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            var result = vOpr1.getResult(d, "AC_RESULT").rows || [];

            $("#name").val(result[0].xtyhxm);
            $("#jobnum").val(result[0].xtzgdm);
            $("#password").attr("data-code",result[0].xtyhmm);//密文
            changePassStatus("decrypt",result[0].xtyhmm,function (record) {
                $("#password").val(record);//明文
            });
            $("#shop").val(result[0].xtwlmc);
            $("#shop").attr("data-code",result[0].xtwldm);
            $("#quarters").val(result[0].xtyzmc);
            $("#quarters").attr("data-code",result[0].xtyhzm);
            $("#mobile").val(result[0].xtyhdm);
            $("#mobile").attr("data-phone",result[0].xtlxfs);

            if(result[0].xtlzbz=="Y"){//离职标志
                $("#mui-switch").removeClass("mui-active");
            }else{
                $("#mui-switch").addClass("mui-active");
            }
            if(result[0].xtcbqx=="N"){//成本
                $("#cost").removeClass("mui-active");
            }else{
                $("#cost").addClass("mui-active");
            }
            if(result[0].xtsyqx=="N"){//收银
                $("#sale").removeClass("mui-active");
            }else{
                $("#sale").addClass("mui-active");
            }

        } else {
            wfy.alert("数据查询失败,"+d.errorMessage);
        }
    }) ;
}

//密码状态转换
function changePassStatus(type,record,callback) {
    var url="";

    if(type=="decrypt"){//转为明文
        url=_wfy_decrypt_url+"?data="+record;
    }else if(type=="encrypt"){//转为密文
        url=_wfy_encrypt_url+"?data="+record;
    }
    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        success: function (msg) {
            console.log(JSON.stringify(msg))
            if (msg.errorCode=="0") {
                if(typeof callback==="function"){
                    var passcode="";
                    if(type=="decrypt"){
                        passcode=msg.sourcedata;
                    }else if(type=="encrypt"){
                        passcode=msg.encrycode;
                    }
                    callback(passcode);
                }
            }
        },
        error: function (info) {
            wfy.alert("连接失败！\n" + "网络错误，请稍后再试。");
        }
    });
}

//手机位数验证（11位数字）
function mobilephoneVali(mobile) {
    var reg = /^1[0-9]\d{9}$/;
    //var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (myreg.test(mobile)) {
        return true;
    }else{
        return false;
    };
}
//验证密码长度
function checkPass(pass) {
    var reg = /^\S{6,8}$/;
    var reg = /^[A-Za-z0-9]{6,8}$/;
    if (reg.test(pass)) {
        return true;
    }else{
        return false;
    };
}


//保存数据
function dataSave(){

    var vBiz = new FYBusiness("biz.ctluser.userdefine.save");

    var vOpr1 = vBiz.addCreateService("svc.ctluser.userdefine.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctluser.userdefine.save");
    vOpr1Data.setValue("AS_XTYHDM", saveObj.code);
    vOpr1Data.setValue("AS_XTZGDM", saveObj.jobnum);
    vOpr1Data.setValue("AS_XTYHXM", saveObj.name);
    vOpr1Data.setValue("AS_XTWLDM", saveObj.shop);
    vOpr1Data.setValue("AS_XTYHZM", saveObj.quarters);
    vOpr1Data.setValue("AS_XTYHMM", saveObj.password);
    vOpr1Data.setValue("AS_XTLXFS", saveObj.mobile);
    vOpr1Data.setValue("AS_XTLZBZ", saveObj.status);
    vOpr1Data.setValue("AS_STATUS", operType);
    vOpr1Data.setValue("AS_CBQX", saveObj.cost);
    vOpr1Data.setValue("AS_SYQX", saveObj.sale);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            wfy.alert("保存成功",function () {
                wfy.pagegoto("staffmgt");
            });

        } else {
            wfy.alert("保存失败,"+d.errorMessage);
        }
    }) ;
}