localStorage.his = 'qry_coutomer_info';
localStorage.prev = 'worktable';
var vipSexArr=[{code: 'M', title: '男'}, {code: 'W', title: '女'}];
var nowDate=new Date().format("yyyy-MM-dd");
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
    })
    //会员性别
    $('body').hammer().on('tap', '#vipSex', function (event) {
        event.stopPropagation();
        var html = '';
        for(var i = 0; i <vipSexArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+vipSexArr[i].code+'" data-type="vipSex">'+vipSexArr[i].title+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });
    
    //出生年月
    $('body').hammer().on('tap', '#vipBrithday', function (event) {
        event.stopPropagation();
        $(this).val(nowDate);
    });

    $("#vipBrithday").datetimePicker({
        title: '请选择时间',
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
    $("#area").cityPicker({
        title: "区域",
    });
    //点击选择弹出的模式
    $('body').hammer().on('tap','#multi_box .item',function (event) {
        event.stopPropagation();
        var nodeId= $(this).attr('data-type');
        var selCode= $(this).attr('data-code');
        var selName= $(this).html();
        $("#"+nodeId).attr("data-code",selCode);
        $("#"+nodeId).val(selName);
        wfy.closeWin();
    });
    $('body').hammer().on('tap', '#bottom', function (event) {
        event.stopPropagation();
        saveData();
    });
    //机具 优化
    $('#viped').focus(function () {
        $('.cell_list_1').css({
            'padding-bottom':'400px'
        })
        setTimeout(function () {
            $(window).scrollTop(145);
        },50)
    })
    $('#vipbz').focus(function () {
        $('.cell_list_1').css({
            'padding-bottom':'400px'
        })
        setTimeout(function () {
            $(window).scrollTop(105);
        },50)
    })
    $('#vipAddress').focus(function () {
        $('.cell_list_1').css({
            'padding-bottom':'400px'
        })
        setTimeout(function () {
            $(window).scrollTop(55);
        },50)
    })
    $('#viped,#vipbz').blur(function () {
        $('.cell_list_1').css({
            'padding-bottom':'0px'
        })
    })
    $('#bri,#areas').tap(function () {
        $('input').blur();
    })

});


function saveData() {
    var data = {};
    data.vipname = $('#vipname').val() || '';
    if (!data.vipname) {
        wfy.alert('请输入会员姓名！');
        $('#vipname').focus();
        return;
    }
    data.vipsex = $('#vipSex').attr('data-code') || '';
    data.birthday = $('#vipBrithday').val() || '';
    data.mobile = $('#vipMobile').val() || '';
    if (!data.mobile) {
        wfy.alert('请输入手机号码！');
        $('#mobile').focus();
        return;
    }else{
        if(!(/^1[0-9]\d{9}$/).test(data.mobile)){
            wfy.alert('请输入11位手机号码！');
            $('#mobile').focus();
            return;
        }
    }
    data.wechat = $('#vipWX').val() || '';
    data.area = $('#area').val() || '';
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
    vOpr1Data.setValue("AS_KHHYKH", "");
    vOpr1Data.setValue("AS_KHHYXM", data.vipname);
    vOpr1Data.setValue("AS_KHHYSJ", data.mobile);//手机
    vOpr1Data.setValue("AS_KHHYXB", data.vipsex);
    vOpr1Data.setValue("AS_KHCSNY", data.birthday);
    vOpr1Data.setValue("AS_KHSFZH", "");//身份证号
    vOpr1Data.setValue("AN_KHXYED", data.viped);//额度
    vOpr1Data.setValue("AS_KHLXWX", data.wechat);
    vOpr1Data.setValue("AS_KHLXDZ", (data.area.replace(' ','')+'|'+data.address));
    vOpr1Data.setValue("AS_KHHYBZ", data.bz);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            wfy.alert("保存信息成功！",function () {
                wfy.pagegoto('qry_coutomer');
            });
            wfy.hideload();
        } else {
            // todo...[d.errorMessage]
            wfy.alert("保存信息失败！"+d.errorMessage);
            wfy.hideload();
        }
    }) ;
}
