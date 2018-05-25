/**
 * Created by WFY02 on 2018/1/4.
 */
var day1 = ['今天','明天'];
var day2 = ['明天'];
var data = new Date();
var time = ['08:00-09:00','09:00-10:00','10:00-11:00','11:00-12:00','12:00-13:00','13:00-14:00','14:00-15:00','15:00-16:00'];
var val_day =[];
var val_time =[];
var code = localStorage.address_code;
var orderid = '';
var params={"orderid": "SFB-20170614001",
    "express_type": "2",
    "j_province": "广东省",
    "j_city": "深圳市",
    "j_company": "",
    "j_contact": "丰哥",
    "j_county":'',
    "d_mobile": "15012345678",
    "j_address": "福田区新洲十一街万基商务大厦26楼",
    "d_province": "广东省",
    "d_city": "广州市",
    "d_county": "",
    "d_company": "",
    "d_contact": "风一样的旭哥",
    "d_mobile": "33992159",
    "d_address": "海珠区宝芝林大厦701室",
    "parcel_quantity": "1",
    "pay_method": "3",
    "custid": "7551234567",
    "customs_batchs": "",
    "cargo": "iphone 7 plus",
    "sendstarttime":"2017-12-27 15:38:53",
    "goods_name":"衣服",
    "order_create_person":LoginName,
    "order_create_company":DepartmentCode,
    "pay_method":""
};
$(function () {
    //返回
    $('body').hammer().on('tap','#backBtn',function (event) {
        event.stopPropagation();
        wfy.pagegoto("../home/index");
    });
    //发货地址
    $('body').hammer().on('tap','#from',function (event) {
        event.stopPropagation();
        localStorage.shitpage = 'exbress';
        localStorage.type = 'from';
        wfy.pagegoto('../mine/address');
    })
    //收货地址
    $('body').hammer().on('tap','#to',function (event) {
        event.stopPropagation();
        localStorage.shitpage = 'exbress';
        localStorage.type = 'to';
        wfy.pagegoto('../mine/address');
    })
    
    getAddressList();
    if(code != ''){
        getDataDtl(code);
    }
    // 选择日期
    wfy.tap('#makeDay',function (that) {
        var t = data.getHours()-8;// 8-15 对应 数组的0-7  所以减去8
        var a = wfy.formatDate(data);
        var b = wfy.getNextDay(a,1);
        if( 0 < t && t < 8 ){
            val_day = [a,b];
        }else {
            val_day = [b];
        }
        console.log(val_day);
        $("#makeDay").picker({
            title: "请选择日期",
            cols: [
                {
                    textAlign: 'center',
                    values: val_day
                },
            ],
            onChange:function (p) {//仅对天数
                var vue1 = p.value[0];
                console.log(vue1)
                if(vue1 == val_day[0]){
                    $("#makeTime").addClass('none').removeClass('deafshow');//用来 设置  取时间端
                    $("#makeTimes").removeClass('none').addClass('deafshow');
                }
                if(vue1 == val_day[1]){
                    $("#makeTimes").addClass('none').removeClass('deafshow');
                    $("#makeTime").removeClass('none').addClass('deafshow');
                }
            },
        });
    })
    ///选择时间-- 今天
    wfy.tap('#makeTime',function (that) {
        var val_time = time;
        $("#makeTime").picker({
            title: "请选择时间段",
            cols: [
                {
                    textAlign: 'center',
                    values: val_time
                }
            ]
        });
    })
    ///选择时间----明天的
    wfy.tap('#makeTimes',function (that) {
        console.log(val_day)
        var t = data.getHours()-8;// 8-15 对应 数组的0-7  所以减去8
        var times = [];
        if( 0 < t && t < 8 ){
            times = time.slice(t);

        }else {
            times = time;
        }
        $("#makeTimes").picker({
            title: "请选择时间段",
            cols: [
                {
                    textAlign: 'center',
                    values: times
                }
            ]
        });
    })


    $("#goods_pay").picker({
        title: "请选择付费方式",
        cols: [
            {
                textAlign: 'center',
                values: ['寄方付','收方付']
            },
        ],
        onChange:function (p) {//仅对天数
            var vue1 = p.value[0];
            if(vue1 == '寄方付'){
                params.pay_method = '1';
            }
            if(vue1 == '收方付'){
                params.pay_method = '2';
            }
        },
    });
    //下单
    $('body').hammer().on('tap','#save',function (event) {
        event.stopPropagation();
        if($('#fromaddress').html().indexOf('输入') > 0 || $('#toaddress').html().indexOf('输入') > 0){
            $.alert('请先选择地址');
            return;
        }
        if($('#makeDay').val()=='日期' || $('.deafshow').val()=='时间段'){
            $.alert('请先选择时间');
            return;
        }
        if($('#goods_name').val()==''){
            $.alert('请先填写货物名称');
            return;
        }
        if($('#goods_pay').val()==''){
            $.alert('请先选择付费方式');
            return;
        }
        params.sendstarttime =$('#makeDay').val()+' '+$('.deafshow').val().split('-')[1]+':00';
        params.goods_name = $('#goods_name').val();
        getorder('',function (res) {
            orderid = res[0].operid;
            params.orderid = 'SFB-'+orderid;
            console.log(JSON.stringify(params))
            $.ajax({
                type: 'POST',
                url: _wfy_ServiceTracking_url+'sendSfOrder',
                contentType: 'application/json',
                async: true,
                data: JSON.stringify(params),
                success: function (msg) {
                    console.log(msg)
                    wfy.hideload();
                    if (msg.errorcode=="0") {
                        $.alert('下单成功',function () {
                            wfy.pagegoto('exbressList');
                        })
                    }
                    if (msg.errorcode=="1") {
                        $.alert(msg.errmsg)
                    }
                },
                error: function (info) {
                    wfy.hideload();
                    wfy.alert("连接失败！\n" + "网络错误，请稍后再试。");
                }
            });
        })
    })

})
//获取默认地址
function getAddressList() {
    var vBiz = new FYBusiness("biz.emp.commonaddress.qry");
    var vOpr1 = vBiz.addCreateService("svc.emp.commonaddress.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.emp.commonaddress.qry");
    vOpr1Data.setValue("AS_XTDZID", "");
    vOpr1Data.setValue("AS_XTDZLX", "01");//02 shou 01寄
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var result = vOpr1.getResult(d, "AC_RESULT").rows;
            console.error(result)
            if(result.length == 0){
                result = [{'xtlxry':'用户','xtsfmc':'暂时','xtcsmc':'没有','xtdqmc':'默认','xtlxdz':'地址'}]
            }
            console.log(result)
            $('#fromaddress').html(result[0].xtlxry+' '+result[0].xtsfmc+result[0].xtcsmc+result[0].xtdqmc+result[0].xtlxdz);
            //console.log(result[0].xtsfmc+result[0].xtcsmc+result[0].xtdqmc+result[0].xtlxdz)
            params.j_province = result[0].xtsfmc;
            params.j_city = result[0].xtcsmc;
            params.j_contact = result[0].xtlxry;
            params.j_mobile = result[0].xtlxsj;
            params.j_address = result[0].xtlxdz;
            params.j_county = result[0].xtdqmc;
            $('#fromaddress').css('color','#000');
        } else {
            wfy.alert("数据查询失败,"+d.errorMessage);
        }
    }) ;
}
//获取明细地址
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
    console.log(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var result = vOpr1.getResult(d, "AC_RESULT").rows || [];
            console.error(result)
            if(localStorage.type == 'from'){
                $('#fromaddress').html(result[0].xtlxry+' '+result[0].xtsfmc+result[0].xtcsmc+result[0].xtdqmc+result[0].xtlxdz);
                params.j_province = result[0].xtsfmc;
                params.j_city = result[0].xtcsmc;
                params.j_contact = result[0].xtlxry;
                params.j_mobile = result[0].xtlxsj;
                params.j_address = result[0].xtlxdz;
                params.j_county = result[0].xtdqmc;
                $('#fromaddress').css('color','#000');
            }
            if(localStorage.type == 'to'){
                $('#toaddress').html(result[0].xtlxry+' '+result[0].xtsfmc+result[0].xtcsmc+result[0].xtdqmc+result[0].xtlxdz);
                params.d_province = result[0].xtsfmc;
                params.d_city = result[0].xtcsmc;
                params.d_contact = result[0].xtlxry;
                params.d_mobile = result[0].xtlxsj;
                params.d_address = result[0].xtlxdz;
                params.d_county = result[0].xtdqmc;
                $('#toaddress').css('color','#000');
            }
            localStorage.address_code='';
        } else {
            wfy.alert("数据查询失败,"+d.errorMessage);
        }
    }) ;
}
//生成列表页面
function createPage(rows){
    var htmlStr ="";
    if(rows.length ==0){
        htmlStr = wfy.zero();
    }
    for(var i=0;i<rows.length;i++){
        var temp=rows[i];
        htmlStr+='<div class="list_1 list_swiper" style="height:56px; font-size:13px;">' +
            '<div class="list_item_1 thd ts200" data-code="'+temp.xtdzxh+'">' +
            '<div class="item_line">' +
            '<span class="">联系人：<span>'+temp.xtlxry+'</span></span>' +
            '<span class="fr">手机：<span>'+temp.xtlxsj+'</span></span>' +
            '</div>' +
            '<div class="item_line">' +
            '<span class="">地址：<span>'+temp.xtsfmc+temp.xtcsmc+temp.xtdqmc+temp.xtlxdz+'</span></span>';
        htmlStr+='</div></div>' +
            '<div class="list_drap" data-code="'+temp.xtdzxh+'"><div class="list_item_btn btndel" style="line-height: 60px;">删除</div><div class="list_item_btn btndefault" style="background-color: #04BE02;line-height: 60px;">默认</div></div></div>';
    }
    $("#searlist").html(htmlStr);
}
