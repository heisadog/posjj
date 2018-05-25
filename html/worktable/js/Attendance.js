localStorage.his = "Attendance";
localStorage.prev = "worktable";
$(function(){
    $('#portrait').html(localStorage.czry);
    $('#sign_name').html(LoginName);
    $('#sign_depart').html(localStorage.wlmc);

    
    //上班签到
    wfy.tap('#registration',function(){
        var addre = $('#signgo_adrs').html();
        if(addre.indexOf('---') > 0){
            wfy.alert('定位失败，不允许打卡！');
        }else {
            signGo(addre,"SB");
        }
    })
    //下班签到
    wfy.tap('#backration',function(){
        var addre = $('#signback_adrs').html();
        if(addre.indexOf('---') > 0){
            wfy.alert('定位失败，不允许打卡！');
        }else {
            signBack(addre,"XB");
        }
    });

    getSignMes();
    getTime();//进入页面就要获取一下当前时间啊，要不然定时器还得一秒才执行呢
    window.setInterval(function(){
        getTime();
    },1000);

})


function getTime(){
    var date = new Date();
    this.year = date.getFullYear();
    this.month = (date.getMonth() + 1)< 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    this.date = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    this.day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date.getDay()];
    this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    var date = this.year+"."+this.month+"."+this.date;
    $('#sign_time').val(date);
    $('#signgo_time').html(this.hour+":"+this.minute+":"+this.second);
    $('#signback_time').html(this.hour+":"+this.minute+":"+this.second);
}

app.gpsfun = function () {//获取地理位置
    var address = getValidStr(gps.csmc) || "---";
    var district = getValidStr(gps.district) || "---";
    var street = getValidStr(gps.street) || "---";
    var street_number = getValidStr(gps.street_number) || "---";
    $("#signgo_adrs").html(address+district+street+street_number);
    $("#signback_adrs").html(address+district+street+street_number);
};


//上班签到
function signGo(addr,dklx){
    var vBiz = new FYBusiness("biz.wfyapp.kaoqin.save");
    var vOpr1 = vBiz.addCreateService("svc.wfyapp.kaoqin.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.wfyapp.kaoqin.save");
    vOpr1Data.setValue("AS_XTCZRQ", wfy.format('yyyy-MM-dd hh:mm:ss'));
    vOpr1Data.setValue("AS_XTDKSJ", wfy.format('yyyy-MM-dd hh:mm:ss'));
    vOpr1Data.setValue("AS_XTDKWZ", addr);
    vOpr1Data.setValue("AS_XTDKLX", dklx);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            $('#registration').removeClass('block').addClass("none");//上班打卡按钮隐藏
            $('#go_address').addClass('block').removeClass("none");//上班签到地址显示
            $('#go_address').html($('#signgo_adrs').html());//上班签到地址显示
            
            $('#signgo_title').html("打卡时间："+$('#signgo_time').html());//上班打卡时间信息
            $('#signgo_foot').removeClass('block').addClass("none");//定位信息隐藏

            $('#backration').addClass('block').removeClass("none");//下班打卡按钮显示
            $('#signback_foot').addClass('block').removeClass("none");//下班签到定位信息显示

        } else {
            wfy.alert("上班签到失败！");
        }
    }) ;

}


function signBack(addr,dklx){
    var vBiz = new FYBusiness("biz.wfyapp.kaoqin.save");
    var vOpr1 = vBiz.addCreateService("svc.wfyapp.kaoqin.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.wfyapp.kaoqin.save");
    vOpr1Data.setValue("AS_XTCZRQ", wfy.format('yyyy-MM-dd hh:mm:ss'));
    vOpr1Data.setValue("AS_XTDKSJ", wfy.format('yyyy-MM-dd hh:mm:ss'));
    vOpr1Data.setValue("AS_XTDKWZ", addr);
    vOpr1Data.setValue("AS_XTDKLX", dklx);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            $('#backration').removeClass('block').addClass("none");//下班打卡按钮隐藏
            $('#back_address').addClass('block').removeClass("none");//下班签到地址显示
            $('#back_address').html($('#signback_adrs').html());//下班签到地址显示
            //$('#back_pun').addClass('block').removeClass("none");//下班早退或准时显示
            // if(Number(wfy.format('hh')) < 18){
            //     $('#back_pun').html("早退").addClass("pun").removeClass("main_bgcolor");
            // }
            $('#signback_title').html("打卡时间："+$('#signback_time').html()+"（下班时间：18:00）");//下班打卡时间信息
            $('#signback_foot').removeClass('block').addClass("none");//定位信息隐藏

        } else {
            wfy.alert("下班签到失败！");
        }
    }) ;

}

function signGoMes(){
    $('#registration').removeClass('block').addClass("none");//上班打卡按钮隐藏
    $('#go_address').addClass('block').removeClass("none");//上班签到地址显示
    $('#go_address').html(localStorage.signGoaddr);//上班签到地址显示
    //$('#go_pun').addClass('block').removeClass("none");//上班迟到或准时显示

    // if(Number(localStorage.signGotime.substring(11,13)) >= 9){
    //     $('#go_pun').html("迟到").addClass("pun").removeClass("main_bgcolor");
    // }
    $('#signgo_title').html("打卡时间："+localStorage.signGotime.substring(11,19));//上班打卡时间信息
    $('#signgo_foot').removeClass('block').addClass("none");//定位信息隐藏
    $('#backration').addClass('block').removeClass("none");//下班打卡按钮显示
    $('#signback_foot').addClass('block').removeClass("none");//下班签到定位信息显示
}
function signBackMes(){
    $('#backration').removeClass('block').addClass("none");//下班打卡按钮隐藏
    $('#back_address').addClass('block').removeClass("none");//下班签到地址显示
    $('#back_address').html(localStorage.signBackaddr);//下班签到地址显示
    //$('#back_pun').addClass('block').removeClass("none");//下班早退或准时显示
    // if(Number(localStorage.signBacktime.substring(11,13))<18){
    //     $('#back_pun').html("早退").addClass("pun").removeClass("main_bgcolor");
    // }
    $('#signback_title').html("打卡时间："+localStorage.signBacktime.substring(11,19));//下班打卡时间信息
    $('#signback_foot').removeClass('block').addClass("none");//定位信息隐藏
}
function getSignMes(){
    var vBiz = new FYBusiness("biz.wfyapp.kaoqin.qry");

    var vOpr1 = vBiz.addCreateService("svc.wfyapp.kaoqin.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.wfyapp.kaoqin.qry");
    vOpr1Data.setValue("AS_XTCZRQ", wfy.format('yyyy-MM-dd'));


    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            var signMes = vOpr1.getResult(d, "AC_KAOQIN").rows || [];

            localStorage.signGotime = signMes[0].xtsbsj;
            localStorage.signBacktime = signMes[0].xtxbsj;
            localStorage.signGoaddr = signMes[0].xtsbwz;
            localStorage.signBackaddr = signMes[0].xtxbwz;
            //进入页面之后判断  是否 已经进行过 上班签到 或者已经 进行过 下班签到
            if(signMes[0].qdzt && signMes[0].qdzt == "SB"){
                signGoMes();
            }
            if(signMes[0].qdzt && signMes[0].qdzt == "XB"){
                signGoMes();
                signBackMes();
            }
            if(signMes[0].qdzt && signMes[0].qdzt == "QD"){

            }
        } else {
            wfy.alert("获取用户签到信息失败！");
        }
    }) ;
}












