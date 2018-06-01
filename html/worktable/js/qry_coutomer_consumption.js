
var pageSize = 5, pageNum = 1, loading = false;
var nowDate=new Date().format("yyyy-MM-dd");

var condition = {
    customer:"",
    begintime:nowDate,
    endtime:nowDate
};

wfy.opensearch = function (s) {
    $("#cover").removeClass("none");
    $("#" + s).removeClass("y_100");
}
wfy.closesearch = function () {
    $("#cover").addClass("none");
    $(".selectTopBox").addClass("y_100");
}

$(function () {
    //开始日期
    $("#begintime").val(nowDate);
    $("#begintime").datetimePicker({
        title: '开始日期',
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
        },
        onOpen:function (values) {
            $("#begintime").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });

    $("#endtime").val(nowDate);
    $("#endtime").datetimePicker({
        title: '截止日期',
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
        },
        onOpen:function (values) {
            $("#endtime").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });


    //点击搜索
    wfy.tap('#modles',function (_this) {
        wfy.opensearch('search');
    });

    //  x清除
    $('body').hammer().on('tap','.topSearchBox li .delethis',function (event) {
        event.stopPropagation();
        $(this).prev().val('');

        if(getValidStr($(this).prev().attr("id"))=="begintime"){
            $("#begintime").val(nowDate);
        }

        if(getValidStr($(this).prev().attr("id"))=="endtime"){
            $("#endtime").val(nowDate);
        }
    });

    // 清除
    $('body').hammer().on('tap','#clear',function (event) {
        event.stopPropagation();
        $('.topSearchBox li input').val('');
    });

    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();
        $('input').blur();
        wfy.closesearch();
        condition.begintime = $('#begintime').val() || '';
        condition.endtime = $('#endtime').val() || '';
        condition.customer = $('#customer').val() || '';

        pageNum=1;
        $("#searlist").html("");

        ajaxData();
    })
    //点击去 详情
    $('body').hammer().on('tap', '.list_2', function (event) {
        event.stopPropagation();
        var hykh = $(this).attr('data-hykh');
        //console.log(hykh)
        wfy.pagegoto('qry_coutomer_consumption_dtl',hykh)
    });

    ajaxData();
    $('#customer').focus();

});

function ajaxData() {
    wfy.showload();
    var vBiz = new FYBusiness('biz.crm.salesum.qry');
    var vOpr1 = vBiz.addCreateService('svc.crm.salesum.qry', false);
    var vOpr1Data = vOpr1.addCreateData();

    vOpr1Data.setValue('AS_USERID', LoginName);
    vOpr1Data.setValue('AS_WLDM', DepartmentCode);
    vOpr1Data.setValue('AS_FUNC', 'svc.crm.salesum.qry');
    vOpr1Data.setValue('AS_MDDM', getValidStr(localStorage.mddm));
    vOpr1Data.setValue('AS_KHHYXM', condition.customer);
    vOpr1Data.setValue('AS_BEGINDATE', condition.begintime);
    vOpr1Data.setValue("AS_ENDDATE", condition.endtime);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip))
    ip.invoke(function (d) {
        wfy.hideload();
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var num = vOpr1.getOutputPermeterMapValue(d, "AN_SL") || 0;
            var money = vOpr1.getOutputPermeterMapValue(d, "AN_JE") || 0;
            $('#tonum').html(num);
            $('#toje').html(wfy.setTwoNum(money));

            var res = vOpr1.getResult(d, 'AC_RESULT_SALESUM').rows || [];
            console.error(res)
            createShowList(res);
        } else {
            alert('没有查询到会员消费信息！' + (d.errorMessage || ''));
            $('#customer').focus();
        }
    });
}

function createShowList(record) {
    var htmlStr ="";
    if( pageNum == 1 && record.length ==0){
        htmlStr = wfy.zero();
        $(".coutomer input").val("");
    }
    for(var i=0;i<record.length;i++){
        var item=record[i];
        htmlStr +='<div class="list_2" data-hykh="'+item.khhykh+'">'+
            '<ul class="list_item_2">'+
            '<li class="w30 tl" style="text-indent: 12px">'+item.khhyxm+'</li>'+
            '<li class="w20" style="text-indent: 12px">'+item.orderqty+'</li>'+
            '<li class="w20" style="text-indent: 12px;">'+item.saleqty+'</li>' +
            '<li class="w30">'+(item.salemoney).toFixed(2)+'</li>'+
            '</ul>'+
            '</div>';
    }

    $("#searlist").append(htmlStr);
    if(record.length ==5){
        $("#scrollload").removeClass("none");
    }
    if( pageNum > 1 && record.length ==0){
        $("#scrollload span").html("没有更多了...");
        setTimeout(function () {
            $("#scrollload").addClass("none");
            $("#scrollload span").html("正在加载");
        },1000);
    }

    $(".wfyContList").scroll(function () {
        //loading 是根据 加载动画是否显示 判断
        if($("#cont").Scroll() < 10){
            if(!$("#scrollload").hasClass("none")){
                loading = true;
            }
            setTimeout(function () {
                if(loading ){
                    pageNum ++;
                    ajaxData();
                    loading = false;
                }
            },1000);
        }

    });
}
