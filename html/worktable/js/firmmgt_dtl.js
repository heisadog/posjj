localStorage.his = 'firmmgt_dtl';
localStorage.prev = 'firmmgt';

//地址代码
var code=localStorage.firmcode;

var saveObj={};//数据保存对象
var areaArr=[];
window.uexOnload= function () {
    uexWindow.setReportKey(0, 1); // 物理返回键接管
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode === 0){
            wfy.pagegoto('firmmgt');
        }
    };
}
$(function () {

    //点击保存按钮
    //onkeyup="this.value=this.value.replace(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/g,'')"
    $('body').hammer().on('tap', '#pro_save', function (event) {
        event.stopPropagation();

        saveObj.code=getValidStr(code);
        saveObj.firmname=getValidStr($("#firmname").val());
        saveObj.name=getValidStr($("#name").val());
        saveObj.mobile=getValidStr($("#mobile").val());
        saveObj.phone=getValidStr($("#phone").val());
        saveObj.areacodes=getValidStr($("#area").attr("data-codes"));
        saveObj.address=getValidStr($("#address").val());
        saveObj.remark=getValidStr($("#remark").val());


        if(saveObj.firmname==""){
            wfy.alert("厂商名称不能为空");
            return;
        }

        if(saveObj.name==""){
            wfy.alert("联系人不能为空");
            return;
        }

        if(saveObj.mobile==""){
            wfy.alert("手机号不能为空");
            return;
        }else{
            if(!mobilephoneVali(saveObj.mobile)){
                wfy.alert("请输入11位的手机号");
                return;
            }

        }

        if(saveObj.areacodes!=""){
            saveObj.province=saveObj.areacodes.split(",")[0];
            saveObj.city=saveObj.areacodes.split(",")[1];
            saveObj.area=saveObj.areacodes.split(",")[2];
        }

        /*if(saveObj.address==""){
            wfy.alert("地址不能为空");
            return;
        }*/

        dataSave();
    });

    $("#area").on("tap",function(){
        $("input").blur();
    });

    //查询明细信息
    if(code!=""){
        getDataDtl(code);
    }else{
        //获取省市区数据
        //getAreaData();


        //省市区(为了提高页面体验，使用本地数据)
        $("#area").cityPicker({
            title: "区域",
            //data:areaArr
        });
    }

});

//获取省市区数据
function getAreaData() {
    var vBiz = new FYBusiness("biz.common.getarea.qry");

    var vOpr1 = vBiz.addCreateService("svc.common.getarea.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.common.getarea.qry");


    var ip = new InvokeProc(false);
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var provinceRows=vOpr1.getResult(d, "AC_SF").rows;
            var cityRows=vOpr1.getResult(d, "AC_CS").rows;
            var areaRows=vOpr1.getResult(d, "AC_DQ").rows;

            areaDataFormat(provinceRows,cityRows,areaRows);
        } else {
            wfy.alert("获取省市区数据失败");
        }
    }) ;
}

//省市区数据格式构建
function areaDataFormat(prorows,cityrows,arearows) {
    var cityArr=[];

    for(var i=0;i<cityrows.length;i++){
        cityArr.push({"parent":cityrows[i].sjdqdm,"name":cityrows[i].xtdqmc,"code":cityrows[i].xtdqdm,"sub":[],});
        for(var j=0;j<arearows.length;j++){
            if(cityrows[i].xtdqdm==arearows[j].sjdqdm) {
                cityArr[i].sub.push({"name":arearows[j].xtdqmc,"code":arearows[j].xtdqdm});
            }
        }
    }

    for(var i=0;i<prorows.length;i++){
        areaArr.push({"name":prorows[i].xtdqmc,"code":prorows[i].xtdqdm,"sub":[]});

        for(var j=0;j<cityArr.length;j++){
            if(prorows[i].xtdqdm==cityArr[j].parent){
                areaArr[i].sub.push({"name":cityArr[j].name,"code":cityArr[j].code,"sub":cityArr[j].sub});

            }
        }
    }
}

//获取数据明细
function getDataDtl(record) {
    var vBiz = new FYBusiness("biz.ctlcode.supplier.qry");

    var vOpr1 = vBiz.addCreateService("svc.ctlcode.supplier.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlcode.supplier.qry");
    vOpr1Data.setValue("AS_XTWLDM", record);
    vOpr1Data.setValue("AS_KEYWORDS", "");
    vOpr1Data.setValue("AN_PAGE_NUM", "1");
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            var result = vOpr1.getResult(d, "AC_RESULT").rows || [];

            $("#firmname").val(result[0].xtwlmc);
            $("#name").val(result[0].xtlxry);
            $("#mobile").val(result[0].xtlxsj);
            $("#phone").val(result[0].xtlxdh);

            if(getValidStr(result[0].xtdqsf)!=""){
                $("#area").attr("data-codes",result[0].xtdqsf+","+result[0].xtdqcs+","+result[0].xtdqdm);
                $("#area").attr("data-code",result[0].xtdqdm);
                $("#area").attr("value",result[0].xtsfmc+" "+result[0].xtcsmc+" "+result[0].xtdqmc);
            }

            $("#address").val(result[0].xtwldz);
            $("#remark").val(result[0].xtwlbz);

            //获取省市区数据
            //getAreaData();

            //省市区(为了提高页面体验，使用本地数据)
            $("#area").cityPicker({
                title: "区域",
                //data:areaArr
            });

        } else {
            wfy.alert("数据查询失败,"+d.errorMessage);
        }
    }) ;
}

//手机位数验证（11位数字）
function mobilephoneVali(mobile) {
    var reg = /^1[0-9]\d{9}$/;

    if (reg.test(mobile)) {
        return true;
    }else{
        return false;
    };
}



//保存数据
function dataSave(){

    var vBiz = new FYBusiness("biz.ctlcode.supplier.save");

    var vOpr1 = vBiz.addCreateService("svc.ctlcode.supplier.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlcode.supplier.save");
    vOpr1Data.setValue("AS_XTWLDM", saveObj.code);
    vOpr1Data.setValue("AS_XTWLMC", saveObj.firmname);
    vOpr1Data.setValue("AS_XTLXRY", saveObj.name);
    vOpr1Data.setValue("AS_XTLXDH", saveObj.phone);
    vOpr1Data.setValue("AS_XTLXSJ", saveObj.mobile);
    vOpr1Data.setValue("AS_XTLXDZ", saveObj.address);
    vOpr1Data.setValue("AS_XTLXSF", saveObj.province);
    vOpr1Data.setValue("AS_XTLXCS", saveObj.city);
    vOpr1Data.setValue("AS_XTLXDQ", saveObj.area);
    vOpr1Data.setValue("AS_XTWLBZ", saveObj.remark);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            wfy.alert("保存成功",function () {
                wfy.pagegoto("firmmgt");
            });

        } else {
            wfy.alert("保存失败,"+d.errorMessage);
        }
    }) ;
}