/**
 * Created by WFY02 on 2017/11/16.
 */
localStorage.his = 'qry_coutomer_dtl';
localStorage.prev = 'qry_coutomer';
var sex = '';
var viewTop = $(window).scrollTop();            // 可视区域顶部
var viewBottom = viewTop + window.innerHeight;  // 可视区域底部
var h = $('#viped').offset().top
var areaArr=[];
window.uexOnload= function () {
    uexWindow.setReportKey(0, 1); // 物理返回键接管
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode === 0){
            wfy.pagegoto('qry_coutomer');
        }
    };
}
$(function () {
    $('#backs').tap(function () {
        wfy.pagegoto('qry_coutomer');
    });

    var hykh = localStorage.wdhykh;

    if(getValidStr(hykh)!=""){
        getList(hykh);
    }/*else{
        //获取省市区数据
        //getAreaData();

        //省市区(为了提高页面体验，使用本地数据)
        $("#areas").cityPicker({
            title: "请选择区域",
            //data:areaArr
        });
    }*/

    $("#areas,.jq_qy").cityPicker({
        title: "请选择区域",
        //data:areaArr
    });

    $('body').hammer().on('tap','#add',function (event) {
        event.stopPropagation();
        var type = $(this).attr('data-type');
        if(type == 'revise'){//修改状态点击
            $('.comboadd').removeClass('none');
            $(this).html('保存').attr('data-type','save');
            $('input[data-type="word"]').attr('readOnly',false);
            $('[data-type="select"]').addClass('none');
            $('[data-type="select_show"]').removeClass('none');
        }
        if(type == 'save'){
            // $('.comboadd').addClass('none');
            // $(this).html('修改').attr('data-type','revise');
            // $('input[data-type="word"]').attr('readOnly',true);
            // $('[data-type="select"]').removeClass('none');
            // $('[data-type="select_show"]').addClass('none');
            saveData();
        }
    })
    $('body').hammer().on('tap','.removcom',function (event) {
        event.stopPropagation();
        $(this).prev().val("");
    });
    $("#areas").on("tap",function(){
        $("input").blur();
    });

    $("#bri,.jq_bri").datetimePicker({
        title: '出生年月',
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
    $("#xb,.jq_xb").picker({
        title: "请选择性别",
        cols: [
            {
                textAlign: 'center',
                values: ['男','女']
            }
        ],
        onChange:function (p) {
            var vue = p.value[0];
            if(vue =="男"){
                sex = 'M'
            }
            if(vue =="女"){
                sex = 'W'
            }
            $('#vipsex').attr('data-code',sex)
        }
    });
    //机具 优化
    $('#viped').focus(function () {
        $('.bill_basic').css({
            'padding-bottom':'400px'
        })
        setTimeout(function () {
            $(window).scrollTop(120);
        },50)
    })
    $('#vipbz').focus(function () {
        $('.bill_basic').css({
            'padding-bottom':'400px'
        })
        setTimeout(function () {
            $(window).scrollTop(80);
        },50)
    })
    $('#vipAddress').focus(function () {
        $('.bill_basic').css({
            'padding-bottom':'400px'
        })
        setTimeout(function () {
            $(window).scrollTop(30);
        },50)
    })
    $('#viped,#vipbz').blur(function () {
        $('.bill_basic').css({
            'padding-bottom':'0px'
        })
    })
    $('#bri,#areas').tap(function () {
        $('input').blur();
    })
})



function getList(AS_KEYWORD) {
    var vBiz = new FYBusiness("biz.crm.crminfo.list");
    var vOpr1 = vBiz.addCreateService("svc.crm.crminfo.list", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID",LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.crm.crminfo.list");
    vOpr1Data.setValue("AS_CXCS", '');
    vOpr1Data.setValue("AS_KHHYKH",AS_KEYWORD);
    vOpr1Data.setValue("AN_PSIZ", 20);
    vOpr1Data.setValue("AN_PINDEX",1);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getResult(d, 'AC_RESULT').rows || [];
            $('#vipname').val(res[0].khhyxm);
            $('#vipMobile').val(res[0].khhysj);
            $('#vipBrithday input').val(res[0].khcsny || " ");
            $('#vipsex input').val((wfy.empty(res[0].khhyxb) ? " ":(res[0].khhyxb == 'M' ? "男":"女")));
            $('#vipsex').attr('data-code',(res[0].khhyxb || ''));
            $('#viped').val(res[0].khxyed);
            $('#wechat').val(res[0].khlxwx || " ");
            $('#area input').val((res[0].khlxdz).split('|')[0] || ' ');//地址由于用|连接，默认不填的时候就返回 |。
            $('#vipAddress').val((res[0].khlxdz).split('|')[1] || ' ');
            $('#vipbz').val(res[0].khhybz || " ");

            //获取省市区数据
            //getAreaData();

            //省市区(为了提高页面体验，使用本地数据)
            /*$("#areas").cityPicker({
                title: "请选择区域",
                //data:areaArr
            });*/
        } else {
            // todo...[d.errorMessage]
            wfy.alert('没有查询到会员信息！' + (d.errorMessage || ''));
        }
    }) ;
}

function saveData() {
    var data = {};
    data.vipname = $('#vipname').val() || '';
    if (!data.vipname) {
        wfy.alert('请输入会员姓名！');
        return;
    }
    data.vipsex = $('#vipsex').attr('data-code') || '';
    data.birthday = $('#vipBrithday input').eq(1).val();
    data.mobile = $('#vipMobile').val() || '';
    if (!data.mobile) {
        wfy.alert('请输入手机号码！');
        return;
    }else{
        if(!(/^1[0-9]\d{9}$/).test(data.mobile)){
            wfy.alert('请输入11位手机号码！');
            return;
        }
    }
    data.wechat = $('#wechat').val() || '';
    data.area = $('#area input').eq(1).val() || '';
    data.address = $('#vipAddress').val() || '';
    data.bz = $('#vipbz').val() || '';
    data.viped = $('#viped').val() || 0;
    if(data.viped){
        if(!(/^[0-9]*$/).test(data.viped)){
            wfy.alert('授信额度请输入数字');
            $('#viped').focus();
            return;
        }
    }
    wfy.showload();
    var vBiz = new FYBusiness("biz.crm.crminfo.save");
    var vOpr1 = vBiz.addCreateService("svc.crm.crminfo.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.crm.crminfo.save");
    vOpr1Data.setValue("AS_KHHYKH", localStorage.wdhykh);
    vOpr1Data.setValue("AS_KHHYXM", data.vipname);
    vOpr1Data.setValue("AS_KHHYSJ", data.mobile);//手机
    vOpr1Data.setValue("AS_KHHYXB", data.vipsex);
    vOpr1Data.setValue("AS_KHCSNY", data.birthday);
    vOpr1Data.setValue("AS_KHSFZH", "");//身份证号
    vOpr1Data.setValue("AN_KHXYED", data.viped);//额度
    vOpr1Data.setValue("AS_KHLXWX", data.wechat);
    vOpr1Data.setValue("AS_KHLXDZ", (data.area+'|'+data.address));
    vOpr1Data.setValue("AS_KHHYBZ", data.bz);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            wfy.hideload();
            wfy.alert("保存信息成功！",function () {
                window.location.reload();
            });
            // $('.comboadd').addClass('none');
            // $(this).html('修改').attr('data-type','revise');
            // $('input[data-type="word"]').attr('readOnly',true);
            // $('[data-type="select"]').removeClass('none');
            // $('[data-type="select_show"]').addClass('none');    //
            // var hykh = localStorage.wdhykh;
            // getList(hykh);

        } else {
            // todo...[d.errorMessage]
            wfy.alert("保存信息失败！"+d.errorMessage);
            wfy.hideload();
        }
    }) ;
}

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