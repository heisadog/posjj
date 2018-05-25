var pageNum=1;
var loading = false;

var searchObj={
    staff:'',
    shop:'',
    startdate:wfy.getMonthStartDate(),
    enddate:wfy.getMonthEndDate()
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
    //点击搜索
    wfy.tap('#modles',function (_this) {
        wfy.opensearch('search');
    });

    // 选择 门店
    $('body').hammer().on('tap','#shop',function (event) {
        event.stopPropagation();
        getShopName();
    });

    //开始日期
    $("#startdate").val(searchObj.startdate);
    $("#startdate").datetimePicker({
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
                return !!t
            });
        }
    });

    //截止日期
    $("#enddate").val(searchObj.enddate);
    $("#enddate").datetimePicker({
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
                return !!t
            });
        }
    });


    //  x清除
    $('body').hammer().on('tap','.topSearchBox li .delethis',function (event) {
        event.stopPropagation();
        $(this).prev().val('');

        if(getValidStr($(this).prev().attr("id"))=="shop"){
            searchObj.shop="";
        }

        if(getValidStr($(this).prev().attr("id"))=="startdate"){
            $("#startdate").val(wfy.getMonthStartDate());
        }

        if(getValidStr($(this).prev().attr("id"))=="enddate"){
            $("#enddate").val(wfy.getMonthEndDate());
        }
    });

    // 清除
    $('body').hammer().on('tap','#clear',function (event) {
        event.stopPropagation();
        $('.topSearchBox li input').val('');

        searchObj.shop="";
        $("#startdate").val(wfy.getMonthStartDate());
        $("#enddate").val(wfy.getMonthEndDate());
    });

    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();
        initFlag=false;
        $('input').blur();
        pageNum=1;
        $('#searlist').html("");
        $("#scrollload").addClass("none");

        searchObj.staff=getValidStr($("#staff").val());
        searchObj.startdate=getValidStr($("#startdate").val())
        searchObj.enddate=getValidStr($("#enddate").val());

        wfy.closesearch();
        getDatalist();
    });

    //点击查看明细
    $('body').hammer().on('tap','.stock_head_sell',function (event) {
        event.stopPropagation();

        var staffcode=$(this).attr("data-code");
        var cqts=$(this).attr("data-cqts");
        var qkts=$(this).attr("data-qkts");

        if(Number(cqts)==0&&Number(qkts)==0){
        }else{
            var dtlObj={"staff":staffcode,"startdate":searchObj.startdate,"enddate":searchObj.enddate};
            localStorage.attenDtlObj=JSON.stringify(dtlObj);

            wfy.pagegoto("qry_attendance_dtl");
        }

    });

    getDatalist();

});

function getDatalist() {

    var vBiz = new FYBusiness("biz.emp.kaoqin.qry");

    var vOpr1 = vBiz.addCreateService("svc.emp.kaoqin.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.emp.kaoqin.qry");
    vOpr1Data.setValue("AS_XTWLDM", searchObj.shop);
    vOpr1Data.setValue("AS_XTYHXM", searchObj.staff);
    vOpr1Data.setValue("AS_STARTDATE", searchObj.startdate);
    vOpr1Data.setValue("AS_ENDDATE", searchObj.enddate);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var list = vOpr1.getResult(d, "AC_RESULT").rows || [];
            createPage(list);

        } else {
            wfy.alert(d.errorMessage)
        }
    }) ;
}

//处理数据
function createPage(result) {
    var html = "";
    if (result.length == 0) {
        html = wfy.zero();
    }

    for (var i = 0; i < result.length; i++) {
        html +=
            '<ul class="stock_head_sell" data-code="'+result[i].xtyhdm+'" data-cqts="'+(result[i].xtcqts||'0')+'" data-qkts="'+(result[i].xtqkts||'0') +'">' +
            '<li style="width: 30%;text-indent: 12px;">' + result[i].xtwlmc + '</li>' +
            '<li style="width: 24%">' + result[i].xtyhxm + '</li>' +
            '<li style="width: 23%;text-align: center;">' + (result[i].xtcqts||'0') + '</li>' +
            '<li style="width: 23%;text-align: center;">' + (result[i].xtqkts||'0') + '</li>' +
            '</ul>';
    }

    $("#searlist").append(html);

    if(result.length ==20){
        $("#scrollload").removeClass("none");
    }
    if( pageNum > 1 && result.length ==0){
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
                    getDataList();
                    loading = false;
                }
            },1000);
        }

    });

}

//获取 公司及网店 信息
function getShopName() {
    var vBiz = new FYBusiness("biz.home.corr.qry");
    var vOpr1 = vBiz.addCreateService("svc.home.corr.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.home.corr.qry");
    var vOpr2 = vBiz.addCreateService("svc.home.shop.qry", false);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.home.shop.qry");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            //AC_RESULT_CORR
            var result = vOpr1.getResult(d, "AC_RESULT_CORR").rows || [];//获取公司名
            var mddm = vOpr2.getResult(d, "AC_RESULT_SHOP").rows || [];//获取店铺名
            var html="";
            for(var i = 0 ;i < mddm.length; i++){
                html += '<div class="lilit" data-mddm="'+mddm[i].mddm+'" style="line-height: 40px;text-align: center;border-bottom: #d9d9d9 solid 1px">'+mddm[i].mdmc+'</div>';
            }
            wfy.ios_alert(html);
            wfy.tap('.lilit',function (that) {
                var mdmc = $(that).html();
                searchObj.shop = $(that).attr('data-mddm');
                $('#shop').val(mdmc);
                wfy.ios_alert_close();
            })
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}


