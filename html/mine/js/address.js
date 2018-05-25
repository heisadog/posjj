// 页面入口
var prepage = localStorage.shitpage;
var type = localStorage.type;
window.uexOnload= function () {
    uexWindow.setReportKey(0, 1); // 物理返回键接管
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode === 0){
            try {
                wfy.pagegoto('../home/index');
            }catch (err){
                alert(err)
            }
        }
    };
}
$(function () {
    getDataList('02');
    var cfg = {
        cont:["收货地址","发货地址"],
        data:["02","01"],
        callback:tabs
    };
    $("#tab").taber(cfg);
    if(prepage == 'exbress'){
        if(type == 'to'){
            $('#tab div.gx_taber').eq(0).addClass('gx_taberbox_check');
            $('#tab div.gx_taber').eq(1).removeClass('gx_taberbox_check');
            getDataList('02');
        }
        if(type == 'from'){
            $('#tab div.gx_taber').eq(0).removeClass('gx_taberbox_check');
            $('#tab div.gx_taber').eq(1).addClass('gx_taberbox_check');
            getDataList('01');
        }
    }else {
        getDataList('02');
    }
    //返回
    $('body').hammer().on('tap','#backBtn',function (event) {
        event.stopPropagation();
        if(localStorage.shitpage == 'exbress'){
            wfy.pagegoto("../worktable/exbress");
        }else {
            wfy.pagegoto("../home/index");
        }
    });
    //选中地址---如果是从 叫快递进来的页面 点击列表需要进行跳转
    $('body').hammer().on('tap','#searlist .wfyitem_list',function (event) {
        event.stopPropagation();
        if(prepage=="exbress"){
            var address_code = $(this).attr('data-code');
            localStorage.address_code = address_code;
            wfy.pagegoto("../worktable/exbress");
        }
    });
    //点击 去新增
    $('body').hammer().on('tap','#add',function (event) {
        event.stopPropagation();
        localStorage.addresscode="";
        wfy.pagegoto('address_dtl');
    });
    //点击 编辑
    $('body').hammer().on('tap','.btnres',function (event) {
        event.stopPropagation();
        localStorage.addresscode=getValidStr($(this).attr("data-code"));
        wfy.pagegoto('address_dtl');
    });
    //默认操作
    $('body').hammer().on('tap','.btndefault',function (event) {
        event.stopPropagation();
        var code = $(this).attr('data-code');
        oper_setDefault(code);
    });
    //删除操作
    $('body').hammer().on('tap','.btndel',function (event) {
        event.stopPropagation();
        var code = $(this).attr('data-code');
        wfy.confirm('确认删除？',function () {
            oper_delete(code);
        },function () {
            
        })
    });
});

//查询数据
function getDataList(type) {
    var vBiz = new FYBusiness("biz.emp.commonaddress.qry");
    var vOpr1 = vBiz.addCreateService("svc.emp.commonaddress.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.emp.commonaddress.qry");
    vOpr1Data.setValue("AS_XTDZID", "");
    vOpr1Data.setValue("AS_XTDZLX", type);//02 shou 01寄
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.log(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var result = vOpr1.getResult(d, "AC_RESULT").rows || [];
            console.log(result)
            createPage(result)
        } else {
            wfy.alert("数据查询失败,"+d.errorMessage);
        }
    }) ;
}
//生成列表页面
function createPage(rows){
    var htmlStr ="";
    var defal = '';
    if(rows.length ==0){
        htmlStr = wfy.zero();
    }
    for(var i=0;i<rows.length;i++){
        var temp=rows[i];
        if(temp.xtdzlx == '01'){//只有发货地址有 默认
            if (temp.xtqsbz == 'Y'){
                defal = '<div class="btndefault" data-code="'+temp.xtdzxh+'"><i class="dem ch">&#xe645</i><em>默认发货地址</em></div>';
            }else {
                defal = '<div class="btndefault" data-code="'+temp.xtdzxh+'"><i class="dem">&#xe645</i><em>设为默认发货地址</em></div>';
            }
        }else {
            defal = '<div class="btndefault none" data-code="'+temp.xtdzxh+'"><i class="dem ch">&#xe645</i><em>默认发货地址</em></div>';
        }

        htmlStr += '<div class="wfyitem_list" style="padding-bottom: 0"  data-code="'+temp.xtdzxh+'">' +
            '<div class="wfyitem_line" style="height: 32px;line-height: 32px;color: #1a1a1a">' +
            '<span class="">'+temp.xtlxry+'</span>' +
            '<span style="padding-left: 20px">'+temp.xtlxsj+'</span>' +
            '</div>'+
            '<div class="wfyitem_line kd02" style="height: 32px;line-height: 32px;border-bottom: #c8c7cc dashed 1px">' +
            '<span style="color: #999">'+temp.xtsfmc+temp.xtcsmc+temp.xtdqmc+temp.xtlxdz+'</span>' +
            '</div>'+
            '<div class="wfyitem_line address_dos" style="height: 36px;line-height: 36px;color: #999">' +defal+
                '<div class="btndel" data-code="'+temp.xtdzxh+'"><i>&#xe69d</i>删除</div>'+
                '<div class="btnres" data-code="'+temp.xtdzxh+'"><i>&#xe74e</i>编辑</div>'+
            '</div>'+
            '</div>'
    }
    $("#searlist").html(htmlStr);
}

function tabs(d) {
    var ty = $(d).attr('data-type');
    getDataList(ty);
}
//默认设置
function oper_setDefault(record) {
    wfy.showload();
    var vBiz = new FYBusiness("biz.emp.defaultaddress.update");
    var vOpr1 = vBiz.addCreateService("svc.emp.defaultaddress.update", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.emp.defaultaddress.update");
    vOpr1Data.setValue("AS_XTDZXH", record);
    vOpr1Data.setValue("AS_XTQSBZ", "");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            wfy.hideload();
            $('#searlist .wfyitem_list').find('.dem').removeClass('ch');
            $('#searlist .wfyitem_list').find('em').html('设为默认发货地址');
            $('#searlist .wfyitem_list').each(function () {
                var code = $(this).attr('data-code');
                if(record == code){
                    $(this).find('.dem').addClass('ch');
                    $(this).find('em').html('默认发货地址');
                }
            })
        } else {
            wfy.alert("默认设置失败,"+d.errorMessage);
        }
    }) ;
}

//删除操作
function oper_delete(record) {
    wfy.showload();
    var vBiz = new FYBusiness("biz.emp.commonaddress.del");
    var vOpr1 = vBiz.addCreateService("svc.emp.commonaddress.del", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.emp.commonaddress.del");
    vOpr1Data.setValue("AS_XTDZXH", record);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            wfy.hideload();
            $('#searlist .wfyitem_list').each(function () {
                var code = $(this).attr('data-code');
                if(record == code){
                    $(this).remove();
                    if($('#searlist .wfyitem_list').length == 0){
                        $('#searlist').html('<div class="selectNone">暂无查询数据</div>');
                    }
                }
            })
        } else {
            wfy.alert("删除失败,"+d.errorMessage);
        }
    }) ;
}
