localStorage.his = 'modify_pass';
localStorage.prev = 'setting';

var checkFlag="N";//当前密码校验成功标志
var pass_cur="";

$(function () {

    //确认
    $('body').hammer().on("tap",'#btn_confirm',function( event){
        event.stopPropagation();

        var curPass=getValidStr($("#curpass").val());
        var newPass=getValidStr($("#newpass").val());
        var confPass=getValidStr($("#confpass").val());

        if(curPass==""){
            wfy.alert("当前密码不能为空");
            return;
        }else{
            if(checkFlag=="N"){
                wfy.alert("当前密码校验错误，请重新输入");
                return;
            }else{
                if(newPass==""){
                    wfy.alert("新密码不能为空");
                    return;
                }else{
                    if(confPass==""){
                        wfy.alert("确认新密码不能为空");
                        return;
                    }else{
                        if(newPass!=confPass){
                            wfy.alert("两次输入的新密码不同，请重新输入");
                            return;
                        }else{
                            savePass(newPass);
                        }
                    }
                }
            }
        }
    });


});

//校验当前密码是否正确
function checkCurrentPass(pass) {
    pass_cur="";
    changePassStatus("encrypt",pass,function (record) {
        pass_cur=record;//密文
    });

    var vBiz = new FYBusiness("biz.emp.pwd.check");

    var vOpr1 = vBiz.addCreateService("svc.emp.pwd.check", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.emp.pwd.check");
    vOpr1Data.setValue("AS_OLDPWD", pass_cur);


    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            checkFlag="Y";
        } else {
            checkFlag="N";
            //wfy.alert("当前密码校验失败");
        }
    }) ;

}

//保存要修改的密码
function savePass(pass) {
    var encryptPass="";
    changePassStatus("encrypt",pass,function (record) {
        encryptPass=record;//密文
    });

    var vBiz = new FYBusiness("biz.emp.pwdmodify.save");

    var vOpr1 = vBiz.addCreateService("svc.emp.pwdmodify.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.emp.pwdmodify.save");
    vOpr1Data.setValue("AS_OLDPWD", pass_cur);
    vOpr1Data.setValue("AS_NEWPWD", encryptPass);


    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            wfy.alert("修改成功",function () {
                wfy.pagegoto("setting");
            });
        } else {
            wfy.alert("修改密码失败");
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
            console.error(msg);

            if (msg.errorCode=="0") {

                if(typeof callback==="function"){
                    var passcode="";
                    if(type=="decrypt"){
                        passcode=msg.sourcedata;
                        console.log(passcode)
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
changePassStatus('decrypt','Q1NxpOgrO0dM89aAZ2DWTA==',function () {
//92MnrBFYuhr9aZMISXzT1g==  777770
    //Q1NxpOgrO0dM89aAZ2DWTA== jiangjie1985
})