localStorage.his = "login";
localStorage.prev = "";
/*
 获取设备相关的信息
 @param Int infoId 设备信息Id
 @param Function callback 获取信息成功后的回调

 */
var falg = true;
var data = [];
$(function () {
    // if(localStorage.isquit=="N"){
    //     //获取引导页图片
    //     getGuideImg();
    // }else{
    //     $("#guide").hide();
    //     $("#context").removeClass("none");
    // }
    //
    // localStorage.isquit='N';



    if(localStorage.isquit=="N"){
        //获取引导页图片
        getGuideImg();
    }else{
        localStorage.isquit='N';

        $("#guide").addClass("none");
        $("#context").removeClass("none");
    }
    
    if(localStorage.data){
        data = JSON.parse(localStorage.data);
    }else{
        data =[];
    }
    //监控input的输入
    $('#uid,#pwd').bind('input propertychange', function() {
        var val = $(this).val();
        if(val != ''){
            $(this).next().removeClass('none');
        }else {
            $(this).next().addClass('none');
        }
    });
    //检测 账号 和 密码 输入的时候，登陆按钮高亮
    $('#uid,#pwd').keyup(function () {
        var u = $("#uid").val();
        var p = $("#pwd").val();
        if(u != "" && p != ''){
            $('#login').addClass('loginactive')
        }
    })
    //差号
    wfy.tap('.logdel',function (_this) {
        $(_this).prev().val('');
        $(_this).addClass('none');
        $('#login').removeClass('loginactive');
    })
    //
    wfy.tap('#oldid',function () {
        var html = "";
        if (data.length>0){
            if(falg){
                for(var i = 0; i <data.length;i++){
                    html += '<li>'+data[i]+'</li>';
                }
                $('#oldid').html('&#xe6a5');
                $('#jizhu').html(html).removeClass('none');   //&#xe6a5; shang
                falg = false;
            }else {
                $('#oldid').html('&#xe6a6');
                $('#jizhu').addClass('none');
                falg = true;
            }
        }
    })
    wfy.tap('#are',function (_this) {
        var ishas = $(_this).hasClass('color00qe');
        if(ishas){
            $('#are').removeClass('color00qe');
            $('#pwd').attr('type','password');
        }else {
            $('#are').addClass('color00qe');
            $('#pwd').attr('type','text');
        }
    })
    //点击 出现的账号
    $('body').hammer().on('tap','#jizhu li',function (event) {
        event.stopPropagation();
        var tom = $(this).html();
        $('#uid').val(tom);
        $('#oldid').html('&#xe6a6');
        $('#jizhu').addClass('none');
        $('#uid').next().removeClass('none');
        falg = true;
    })
    wfy.tap("#login", function (_this) {
        if($('#login').hasClass('loginactive')){
            localStorage.uid = $('#uid').val();
            localStorage.pwd = $('#pwd').val();
            localStorage.login = "Y";
            getShop();
        }

    });
});

//获取引导页图片
function getGuideImg() {
    localStorage.isquit='N';

    var vBiz = new FYBusiness("biz.common.guidepage.qry");

    var vOpr1 = vBiz.addCreateService("svc.common.guidepage.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.common.guidepage.qry");


    var ip = new InvokeProc(true);
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var rows=vOpr1.getResult(d,"AC_RESULT").rows||[];
            var timelength=vOpr1.getOutputPermeterMapValue(d,"AS_COUNT");

            if(rows.length>0){
                $("#guide").removeClass("none");

                //带圆形倒计时
                /*countDown(timelength,function () {
                    $("#guide").addClass("none");
                    $("#context").removeClass("none");
                });*/

                setInterval(function (args) {
                    $("#guide").addClass("none");
                    $("#context").removeClass("none");
                }, timelength*1000);

                for(var i=0;i<rows.length;i++){
                    var picpath=_wfy_pic_ip+rows[i].xttplj;
                    if(i==0){
                        $(".guide_img").attr("src",picpath);
                    }else{
                        setTimeout(function () {
                            $(".guide_img").attr("src",picpath);
                        },Number(rows[i-1].xtsjsz)*1000);
                    }

                }

                $('body').hammer().on('tap','.guide_time',function (event) {
                    event.stopPropagation();

                    $("#guide").addClass("none");
                    $("#context").removeClass("none");
                });
            }else{
                $("#guide").addClass("none");
                $("#context").removeClass("none");
            }
        } else {
            $("#guide").addClass("none");
            $("#context").removeClass("none");
        }
    }) ;
}

function getShop(uid, pwd, init) {
    if(!window.navigator.onLine){
        wfy.alert("网络连接失败，获取信息失败！");
        return;
    }
    wfy.showload();
    var params = {
        userName: $('#uid').val(),
        password: $('#pwd').val()
    };
    $.ajax({
        type: 'POST',
        url: _wfy_login_url+'?data=' + JSON.stringify(params),
        data: '',
        success: function (msg) {
            if (msg && msg.success) {
                localStorage.wldm = msg.userInfo[0].XTWLDM;
                localStorage.wlmc = msg.userInfo[0].XTWLMC;
                //localStorage.url = msg.authServiceUrl[0].APPDZ;
                localStorage.czry = msg.userInfo[0].XTYHXM;//操作人员
                checkLogin();
            } else {
                wfy.hideload();
                wfy.alert(msg.errorMessage);
            }
        },
        error: function (info) {
            wfy.alert("连接失败！\n" + "网络错误，请稍后再试。");
        }
    });
}
function checkLogin(){
    var params = {
        mac_address:localStorage.golbalMac,//'30:74:96:b6:1d:70',
        user_id: $('#uid').val(),
        pwd: $('#pwd').val(),
        type: 'MSA',
        account_id: '05',
        comment: "",
        xtxtlx: "Z",
        xtxtdm: "msa",
        force_same_user_conn_close:false
    };
    $.ajax({
        type: 'POST',
        url: _wfy_login_check_url+'?data=' + JSON.stringify(params),
        data: '',
        success: function (msg) {
            wfy.hideload();
            if(msg.success == false){
                if(msg.errorMessage == "-8"){
                    wfy.alert("登录失败，不允许重复用户登录！");
                    return;
                }
                if(msg.errorMessage == "-2"){
                    wfy.alert("登录失败，超出最大用户数据！");
                    return;
                }
                if(msg.errorMessage == "-1"){
                    wfy.alert("登录失败，没有获取到对应的操作权限！");
                    return;
                }
                if(msg.errorMessage == "-4"){
                    wfy.alert("登录失败，超过最大用户数！");
                    return;
                }
                if(msg.errorMessage == "-5"){
                    wfy.alert("登录失败，授权已过期！");
                    return;
                }
                if(msg.errorMessage == "-9"){
                    wfy.alert("该设备不允许登陆，请联系管理员！");
                    return;
                }
            }else{
                localStorage.yhczqx = JSON.stringify(msg.funcs);//保存用户权限列表
                localStorage.ztID = $('#ip_addr').attr("data-xtztdm");//保存账套ID
                localStorage.ztMc = $('#ip_addr').attr("data-xtdbmc");//保存账套名称
                localStorage.yhGuid = msg.guid;//保存返回的guid，注销时使用
                localStorage.footerIndex = 0;
                //登陆成功 将输入的账号 添加到data中
                var uid = $('#uid').val();
                if(!data.val_in_array(uid)){
                    data.push(uid);
                    localStorage.data = JSON.stringify(data);
                }
                wfy.goto("index");
            }
        },
        error: function (info) {
            alert("登录失败！\n" + "网络错误，请稍后再试。");
            wfy.hideload();
        }
    });
}


