localStorage.his = 'print';
localStorage.prev = 'index';
var currentTab="POSS";
if(!localStorage.printFormat){
    localStorage.printFormat = "57";
}
var index = 1 ;//页码
var loading = false;
wfy.opensearch = function (s) {
    $("#cover").removeClass("none");
    $("#" + s).removeClass("y_100");
}
wfy.closesearch = function () {
    $("#cover").addClass("none");
    $(".selectTopBox").addClass("y_100");
}
var end_date='';
var start_date='';
$(function () {
    var cfg = {
        cont:["POS销售","POS退货"/*,"发货单","退货单"*/],
        data:["POSS","POST"/*,"FHD","THD"*/],
        callback:dov
    };
    $("#cs").taber(cfg);
    //滑动
    ajaxListData(currentTab);

    //点击搜索 stock_head
    wfy.tap('#modles',function (_this) {
        //依据 查询类型 展示不同的输入条件
        wfy.opensearch('search');
    });
    //选择时间
    $("#begin").datetimePicker({
        title: '请选择操作时间',
        min: "1990-12-12",
        max: "2222-12-12 12:12",
        monthNames:"",
        times:function(){
            var  year=[]
            return year;//可以实现 去掉 时分秒！
        },
        parse: function(date) {
            return date.split(/\D/).filter(function(t) {
                return !!date
            });
        },
        onOpen:function (values) {
            $("#begin").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });
    $("#end").datetimePicker({
        title: '请选择操作时间',
        min: "1990-12-12",
        max: "2222-12-12 12:12",
        monthNames:"",
        times:function(){
            var  year=[]
            return year;//可以实现 去掉 时分秒！
        },
        parse: function(date) {
            return date.split(/\D/).filter(function(t) {
                return !!date
            });
        },
        onOpen:function (values) {
            $("#end").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });
    // 清除
    $('body').hammer().on('tap','#clear',function (event) {
        event.stopPropagation();
        $('.topSearchBox li input').val('');
        end_date='';
        start_date='';
    })
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();
        $("#wfyContList").html("");
        pageIndex=1;
        $("#scrollload").addClass("none");

        start_date =  $("#begin").val();
        end_date = $("#end").val();
        $('input').blur();
        if(start_date && end_date){
            if(end_date < start_date){
                wfy.alert('开始时间不能晚于结束时间');
                return false;
            }
        }
        wfy.closesearch();
        ajaxListData(currentTab);
    })























    //打印
    $('body').hammer().on('tap','#wfyContList .list_item_btn',function (event) {
        event.stopPropagation();
        var czhm = $(this).parents('.list_1').attr('data-czhm');
        var xphm = $(this).parents('.list_1').attr('data-xphm');
        var sl = $(this).parents('.list_1').attr('data-sl');
        uexBluetoothSerial.isEnabled();
        uexBluetoothSerial.onIsEnabledCallback = function (opId, dataType, datable) {
            datable = JSON.parse(datable || 'false');
            if(datable){
                uexBluetoothSerial.isConnected();
                uexBluetoothSerial.onIsConnectedCallback = function(opId,dataType,data){
                    data = JSON.parse(data || 'false');
                    if(data){
                        Components.bluetoothPrint.printTicket100(xphm);
                    }else{
                        var deviceListBox = new Components.SingleSelectBox('head');
                        var deviceList = [], load = null;
                        deviceListBox.setItemTpl(function (index, item) {
                            return '<div style="line-height:35px;background:transparent;text-align:left;' +
                                'padding:5px 12px;border-bottom:1px solid #d9d9d9;">' +
                                '<p>' + (item.name || '') + (item.class ? '(' + item.class + ')' : '') + '</p>' +
                                '<p>' + (item.address || '') + '</p></div>';
                        });
                        deviceListBox.setItemTapFunc(function (src, elem, item) {
                            load = Components.loading(false, '连接蓝牙设备' + item.name + '中...');
                            uexBluetoothSerial.connect(item.address || '');
                        });
                        load = Components.loading(false, '搜索蓝牙设备中...');
                        uexBluetoothSerial.listDevices();
                        uexBluetoothSerial.onlistDevicesCallback = function (opId, dataType, data) {
                            Components.unload(load);
                            deviceList = JSON.parse(data || '[]');
                            deviceListBox.setList(deviceList).show();
                        };
                        uexBluetoothSerial.onConnectionSuccessEvent = function (opId, dataType, data) {
                            Components.unload(load);
//					        Components.alert('蓝牙设备已连接');
                            //应海涛要求，去掉连接成功的提示，改为直接打印。
                            Components.bluetoothPrint.printTicket100(xphm);
                        };
                        uexBluetoothSerial.onConnectionLostEvent = function (opId, dataType, data) {
                            Components.unload(load);
                            Components.alert('蓝牙设备已断开');
                        };
                    }
                }
            }else{
                Components.alert('本机蓝牙不可用，请先打开蓝牙并与设备配对！');
            }
        }
    })

    //打印测试
    $('body').hammer().on('tap','#print',function (event) {
        event.stopPropagation();
        uexBluetoothSerial.isEnabled();
        uexBluetoothSerial.onIsEnabledCallback = function (opId, dataType, datable) {
            datable = JSON.parse(datable || 'false');
            if(datable){
                uexBluetoothSerial.isConnected();
                uexBluetoothSerial.onIsConnectedCallback = function(opId,dataType,data){
                    data = JSON.parse(data || 'false');
                    if(data){
                        Components.bluetoothPrint.printSaleTicket(czhm, xphm,localStorage.printFormat);
                    }else{
                        var deviceListBox = new Components.SingleSelectBox('head');
                        var deviceList = [], load = null;
                        deviceListBox.setItemTpl(function (index, item) {
                            return '<div style="line-height:35px;background:transparent;text-align:left;' +
                                'padding:5px 12px;border-bottom:1px solid #d9d9d9;">' +
                                '<p>' + (item.name || '') + (item.class ? '(' + item.class + ')' : '') + '</p>' +
                                '<p>' + (item.address || '') + '</p></div>';
                        });
                        deviceListBox.setItemTapFunc(function (src, elem, item) {
                            load = Components.loading(false, '连接蓝牙设备' + item.name + '中...');
                            uexBluetoothSerial.connect(item.address || '');
                        });
                        load = Components.loading(false, '搜索蓝牙设备中...');
                        uexBluetoothSerial.listDevices();
                        uexBluetoothSerial.onlistDevicesCallback = function (opId, dataType, data) {
                            Components.unload(load);
                            deviceList = JSON.parse(data || '[]');
                            deviceListBox.setList(deviceList).show();
                        };
                        uexBluetoothSerial.onConnectionSuccessEvent = function (opId, dataType, data) {
                            Components.unload(load);
//					        Components.alert('蓝牙设备已连接');
                            //应海涛要求，去掉连接成功的提示，改为直接打印。
                            //Components.bluetoothPrint.printtest();
                        };
                        uexBluetoothSerial.onConnectionLostEvent = function (opId, dataType, data) {
                            Components.unload(load);
                            Components.alert('蓝牙设备已断开');
                        };
                    }
                }
            }else{
                Components.alert('本机蓝牙不可用，请先打开蓝牙并与设备配对！');
            }
        }
    })
})
function dov(d) {
    $("#wfyContList").html("");
    $("#scrollload").addClass("none");
    currentTab=$(d).attr("data-type");
    ajaxListData(currentTab);
}
function ajaxListData(record) {
    wfy.showload();
    var vBiz = new FYBusiness('biz.sa.work.djbd.qry');
    var vOpr1 = vBiz.addCreateService('svc.sa.work.djbd.qry', false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue('AS_USERID', LoginName);
    vOpr1Data.setValue('AS_WLDM', DepartmentCode);
    vOpr1Data.setValue('AS_FUNC', 'svc.sa.work.djbd.qry');
    vOpr1Data.setValue('AS_XTWLDM', "");
    vOpr1Data.setValue('ADT_CZRQQS', start_date);//searchCondition['start_date']
    vOpr1Data.setValue('ADT_CZRQJZ', end_date);//searchCondition['end_date']
    vOpr1Data.setValue('AS_ZFFS', "");
    vOpr1Data.setValue('AS_TYPE', record);
    vOpr1Data.setValue("AN_PSIZE", "10");
    vOpr1Data.setValue("AN_PINDEX", index);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip))
    ip.invoke(function (d) {
        wfy.hideload();
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var res = vOpr1.getResult(d, 'AC_DJBD').rows || [];
            var html = '';
            if(res.length == 0 && index == 1){
                html = wfy.zero();
            }
            for(var i = 0; i< res.length; i++){
                html+='<div class="list_1 list_swiper" style="height: 60px;" data-czhm="'+res[i].kcczhm+'" data-xphm="'+res[i].xtxphm+'" data-sl="'+res[i].kcczsl+'">' +
                            '<div class="list_item_1 thd ts200" >'+
                                '<div class="item_line">' +
                                    '<span class="black">'+(res[i].kcckmc || '')+'</span>' +
                                    '<span class="fr">'+(res[i].xtxphm || '')+'</span>' +
                                '</div>'+
                                '<div class="item_line" style="font-size:12px;">' +
                                    '<span class="">数量：'+(res[i].kcczsl || 0) +'</span>' +
                                    '<span class="" style="padding-left: 40px;">金额：'+wfy.setTwoNum(res[i].kcssje || 0, 2) +'</span>' +
                                    '<span class="fr">'+(res[i].kcczrq || '') +'</span>' +
                                '</div>' +
                            '</div>'+
                            '<div class="list_drap">' +
                                '<div class="list_item_btn" style="height: 60px;line-height: 60px;">打印小票</div>' +
                            '</div>' +
                        '</div>';
            }

            $("#wfyContList").append(html);
            if(res.length ==10){//一次性取10个，达到10个的时候，显示 加载动画
                $("#scrollload").removeClass("none");
            }
            if( index > 1 && res.length ==0){
                $("#scrollload span").html("没有更多了...");
                setTimeout(function () {
                    $("#scrollload").addClass("none");
                    $("#scrollload span").html("正在加载");
                },1000);
            }


            $("#wfyCont").scroll(function () {
                //loading 是根据 加载动画是否显示 判断
                if($("#wfyContList").Scroll() < 0){
                    if(!$("#scrollload").hasClass("none")){
                        loading = true;
                    }
                    setTimeout(function () {
                        if(loading ){
                            index ++;
                            ajaxListData(currentTab);
                            loading = false;
                        }
                    },1000);
                }

            });
        } else {
            wfy.alert(d.errorMessage);
        }
    });
}






























