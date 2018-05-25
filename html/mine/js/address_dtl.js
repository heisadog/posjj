localStorage.his = 'qry_pro_salesdtl';
localStorage.prev = 'qry_pro_sales';
//地址代码
var code=localStorage.addresscode;
var saveObj={};//数据保存对象
var areaArr=[];
var type = ['收货地址','发货地址']
window.uexOnload= function () {
    uexWindow.setReportKey(0, 1); // 物理返回键接管
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode === 0){
            wfy.pagegoto('address');
        }
    };
}
$(function () {
    //区分 新增还是详情
    if(code!=""){
        getDataDtl(code);
        $('#pagename').html('编辑地址');
    }else{
        $('#pagename').html('新增地址');
        $("#area").cityPicker({
            title: "区域",
        });
    }
    wfy.tap('#type',function (that) {
        $("#type").picker({
            title: "请选择地址类型",
            cols: [
                {
                    textAlign: 'center',
                    values: type
                }
            ],
            onChange:function (p) {
                var vue = p.value[0];
                if(vue == '收货地址'){
                    $('#type').attr('data-type','02')
                }
                if(vue == '发货地址'){
                    $('#type').attr('data-type','01')
                }
            }
        });
    })
    //点击保存按钮
    //onkeyup="this.value=this.value.replace(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/g,'')"
    $('body').hammer().on('tap', '#pro_save', function (event) {
        event.stopPropagation();
        saveObj.code=getValidStr(code);
        saveObj.name=getValidStr($("#name").val());
        saveObj.mobile=getValidStr($("#mobile").val());
        saveObj.areacodes=getValidStr($("#area").attr("data-codes"));
        saveObj.address=getValidStr($("#address").val());
        saveObj.type=getValidStr($('#type').attr('data-type'));

        if(saveObj.name==""){
            wfy.alert("联系人不能为空");
            return;
        }
        if(saveObj.mobile==""){
            wfy.alert("手机不能为空");
            return;
        }else{
            if(!mobilephoneVali(saveObj.mobile)){
                wfy.alert("请输入正确的手机格式");
                return;
            }
        }
        if(saveObj.areacodes==""){
            wfy.alert("省市区不能为空");
            return;
        }else{
            saveObj.province=saveObj.areacodes.split(",")[0];
            saveObj.city=saveObj.areacodes.split(",")[1];
            saveObj.area=saveObj.areacodes.split(",")[2];
        }
        if(saveObj.address==""){
            wfy.alert("地址不能为空");
            return;
        }

        dataSave();
    });

    $("#area").on("tap",function () {
      $("input").blur();
    });



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
    var vBiz = new FYBusiness("biz.emp.commonaddress.qry");
    var vOpr1 = vBiz.addCreateService("svc.emp.commonaddress.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.emp.commonaddress.qry");
    vOpr1Data.setValue("AS_XTDZID", record);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var result = vOpr1.getResult(d, "AC_RESULT").rows || [];
            console.log(result);
            $("#type").val(result[0].xtdzlx == '01'? '发货地址':'收货地址').attr('data-type',result[0].xtdzlx);
            $("#name").val(result[0].xtlxry);
            $("#mobile").val(result[0].xtlxsj);
            $("#area").attr("data-codes",result[0].xtsfdm+","+result[0].xtcsdm+","+result[0].xtdqdm);
            $("#area").attr("data-code",result[0].xtdqdm);
            $("#area").attr("value",result[0].xtsfmc+" "+result[0].xtcsmc+" "+result[0].xtdqmc);
            $("#address").val(result[0].xtlxdz);
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
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (myreg.test(mobile)) {
        return true;
    }else{
        return false;
    };
}
//保存数据
function dataSave(){
    var vBiz = new FYBusiness("biz.emp.commonaddress.save");
    var vOpr1 = vBiz.addCreateService("svc.emp.commonaddress.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.emp.commonaddress.save");
    vOpr1Data.setValue("AS_XTDZXH", saveObj.code);
    vOpr1Data.setValue("AS_XTSFDM", saveObj.province);
    vOpr1Data.setValue("AS_XTCSDM", saveObj.city);
    vOpr1Data.setValue("AS_XTDQDM", saveObj.area);
    vOpr1Data.setValue("AS_XTLXDZ", saveObj.address);
    vOpr1Data.setValue("AS_XTLXRY", saveObj.name);
    vOpr1Data.setValue("AS_XTLXSJ", saveObj.mobile);
    vOpr1Data.setValue("AS_XTDZLX", saveObj.type);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            wfy.alert("保存成功",function () {
                wfy.pagegoto("address");
            });
        } else {
            wfy.alert("保存失败,"+d.errorMessage);
        }
    }) ;
}