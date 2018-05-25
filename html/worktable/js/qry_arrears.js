var pageNum=1;
var loading = false;
var pageType = "Arrears";//页面类型
var nowDate= new Date().format("yyyy-MM-dd");
var initFlag=true;//页面初始化进入标志（点击查询之后为false）
//var isFlag=localStorage.isSingleQry;//是否直接查询交易流水（从首页点击进来的直接查询交易流水）

var total_money=0;
var pageName = 'msa040_0200';
var searchObj={
    cardid:'',
    customer:'',
    startdate:'',
    enddate:''
};
wfy.opensearch = function (s) {
    $("#cover").removeClass("none");
    $("#" + s).removeClass("y_100");
}
wfy.closesearch = function () {
    $("#cover").addClass("none");
    $(".selectTopBox").addClass("y_100");
}

var AppId = "201705041538001234567887654321";
var IsPrint = "true";
$(function () {

    if(localStorage.isSingleQry=="Y"){
        $('#stock_head li').removeClass('sale_che');
        $("#stock_head li").eq(1).addClass('sale_che');
        pageType = "Flow";

        $("#startdate").val(nowDate);
        $("#enddate").val(nowDate);
        searchObj.startdate=getValidStr($("#startdate").val());
        searchObj.enddate=getValidStr($("#enddate").val());

        localStorage.isSingleQry="N";
    }

    //查询类型切换
    $('body').hammer().on('tap','#stock_head li',function (event) {
        event.stopPropagation();
        $('#stock_head li').removeClass('sale_che');
        $(this).addClass('sale_che');
        pageType = $(this).attr("data-type");
        if(pageType=="Arrears"){
            searchObj.cardid="";

            searchObj.startdate="";
            searchObj.enddate="";
        }else {

            if (initFlag) {
                $("#startdate").val(nowDate);
                $("#enddate").val(nowDate);
            }/* else {

                $("#startdate").val(searchObj.startdate);
                $("#enddate").val(searchObj.enddate);
            }*/

            searchObj.startdate=getValidStr($("#startdate").val());
            searchObj.enddate=getValidStr($("#enddate").val());
        }



        pageNum=1;
        $('#searlist').html("");
        $("#scrollload").addClass("none");

        getDatalist();
    });
    //点击搜索
    wfy.tap('#modles',function (_this) {
        if(pageType == "Arrears"){
            $('.topSearchBox li').eq(0).addClass('nobor');
            $('.topSearchBox li.jq_time').addClass('none');
        }else {
            $('.topSearchBox li.jq_time').removeClass('none');
            $('.topSearchBox li').eq(0).removeClass('nobor');
        }
        wfy.opensearch('search');
    });
    //开始日期
    //$("#startdate").val('');
    // $('body').hammer().on('tap', '#startdate', function (event) {
    //     event.stopPropagation();
    //     $(this).val(nowDate);
    // });
    $("#startdate").datetimePicker({
        title: '开始日期',
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
            $("#startdate").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });

    //截止日期
    //$("#enddate").val('');
    // $('body').hammer().on('tap', '#enddate', function (event) {
    //     event.stopPropagation();
    //     $(this).val(nowDate);
    // });
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
                return !!date
            });
        },
        onOpen:function (values) {
            $("#enddate").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
        }
    });

    //  x清除
    $('body').hammer().on('tap','.topSearchBox li .delethis',function (event) {
        event.stopPropagation();
        $(this).prev().val('');
        if(getValidStr($(this).prev().attr("id"))=="startdate"){
            $("#startdate").val(nowDate);
        }

        if(getValidStr($(this).prev().attr("id"))=="enddate"){
            $("#enddate").val(nowDate);
        }
    });

    // 清除
    $('body').hammer().on('tap','#clear',function (event) {
        event.stopPropagation();
        $('.topSearchBox li input').val('');

        if(pageType!="Arrears"){
            $("#startdate").val(nowDate);
            $("#enddate").val(nowDate);
        }
        // $("#startdate").val(nowDate);
        // $("#enddate").val(nowDate);
    });

    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();
        initFlag=false;
        $('input').blur();
        pageNum=1;
        $('#searlist').html("");
        $("#scrollload").addClass("none");

        searchObj.customer=getValidStr($("#customer").val());
        searchObj.startdate=getValidStr($("#startdate").val());
        searchObj.enddate=getValidStr($("#enddate").val());

        wfy.closesearch();
        getDatalist();
    });

    //stock_head_sell
    $('body').hammer().on('tap','.stock_head_sell',function (event) {
        event.stopPropagation();

        if(pageType=="Arrears"){
            searchObj.cardid=$(this).attr("data-code");

            $('#stock_head li').removeClass('sale_che');
            $("#stock_head li").eq(1).addClass('sale_che');
            pageType = "Flow";

            pageNum=1;
            $('#searlist').html("");
            $("#scrollload").addClass("none");

            getDatalist();
        }
    });

    getDatalist();

    //退款
    // $('body').hammer().on('tap','.payBankOrder',function (event) {
    //     event.stopPropagation();
    //     var xphm = $(this).attr('data-xphm');
    //     var lshm = $(this).attr('data-lshm');
    //     var je = $(this).attr('data-je');
    //     //alert(xphm+'-'+lshm+'-'+je)
    //     refundOrder(lshm,xphm,je)
    // });

});

function getDatalist() {
    if(pageType=="Arrears"){//客户欠款查询

        var vBiz = new FYBusiness("biz.crm.cusarrears.hz.qry");

        var vOpr1 = vBiz.addCreateService("svc.crm.cusarrears.hz.qry", false);
        var vOpr1Data = vOpr1.addCreateData();
        vOpr1Data.setValue("AS_USERID", LoginName);
        vOpr1Data.setValue("AS_WLDM", DepartmentCode);
        vOpr1Data.setValue("AS_FUNC", "svc.crm.cusarrears.hz.qry");
        vOpr1Data.setValue("AS_KEYWORDS", searchObj.customer);
        vOpr1Data.setValue("AS_STARTDATE", searchObj.startdate);
        vOpr1Data.setValue("AS_ENDDATE", searchObj.enddate);
        vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
        vOpr1Data.setValue("AN_PAGE_SIZE", "20");

        var ip = new InvokeProc();
        ip.addBusiness(vBiz);
        ip.invoke(function(d){
            if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                var list = vOpr1.getResult(d, "AC_RESULT").rows || [];
                total_money = vOpr1.getOutputPermeterMapValue(d, "AN_JE");
                if(Number(total_money)<0){
                    $("#total_money").attr("style","color:red;");
                }else{
                    $("#total_money").attr("style","");
                }
                $("#total_money").html(Number(total_money).toFixed(2));
                createPage(list);

            } else {
                wfy.alert(d.errorMessage)
            }
        }) ;
    }else{//交易流水查询

        var vBiz = new FYBusiness("biz.crm.cusarrears.dtl.qry");

        var vOpr1 = vBiz.addCreateService("svc.crm.cusarrears.dtl.qry", false);
        var vOpr1Data = vOpr1.addCreateData();
        vOpr1Data.setValue("AS_USERID", LoginName);
        vOpr1Data.setValue("AS_WLDM", DepartmentCode);
        vOpr1Data.setValue("AS_FUNC", "svc.crm.cusarrears.dtl.qry");
        vOpr1Data.setValue("AS_KHHYKH", searchObj.cardid);
        vOpr1Data.setValue("AS_KEYWORDS", searchObj.customer);
        vOpr1Data.setValue("AS_STARTDATE", searchObj.startdate);
        vOpr1Data.setValue("AS_ENDDATE", searchObj.enddate);
        vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
        vOpr1Data.setValue("AN_PAGE_SIZE", "20");

        var ip = new InvokeProc();
        ip.addBusiness(vBiz);
        ip.invoke(function(d){
            if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                var list = vOpr1.getResult(d, "AC_RESULT").rows || [];
                total_money = vOpr1.getOutputPermeterMapValue(d, "AN_JE");
                if(Number(total_money)<0){
                    $("#total_money").attr("style","color:red;");
                }else{
                    $("#total_money").attr("style","");
                }

                $("#total_money").html(Number(total_money).toFixed(2));
                createPage(list);

            } else {
                wfy.alert(d.errorMessage)
            }
        }) ;
    }


}
//处理数据
function createPage(result) {
    var html = "";
    if (pageNum==1 && result.length == 0) {
        html = wfy.zero();
    }

    if(pageType=="Arrears") {//生成客户欠款页面
        $('#tablehead').html('<ul class="stock_head" id="cale_tab">\
                                     <li style="width: 25%">客户</li>\
                                     <li style="width: 30%;text-indent:0px;">手机号</li>\
                                     <li style="width: 25%">授信额</li>\
                                     <li>欠款</li>\
                                 </ul>');
        for (var i = 0; i < result.length; i++) {
            html +=
                '<ul class="stock_head_sell" data-code="'+result[i].khhykh+'">' +
                '<li  style="width: 25%;text-indent: 12px;">' + result[i].khhyxm + '</li>' +
                '<li  style="width: 30%">' + result[i].khhysj + '</li>' +
                '<li  style="width: 25%">' + result[i].khxyed + '</li>';
            if(Number(result[i].sumarrears)<0){
                html+='<li style="width: 20%"><span style="color: red;">' + result[i].sumarrears + '</span></li>';
            }else{
                html+='<li style="width: 20%">' + result[i].sumarrears + '</li>';
            }

            html+= '</ul>';
        }

    }else{//生成交易流水页面
        $('#tablehead').html('<ul class="stock_head" id="cale_tab">\
                                     <li style="width: 25%">小票号</li>\
                                     <li style="width: 22%">客户</li>\
                                     <li style="width: 12%">类型</li>\
                                     <li style="width: 20%">金额</li>\
                                     <li style="width: 18%">日期</li>\
                                 </ul>');
        for (var i = 0; i < result.length; i++) {
            html += '<ul class="stock_head_sell payBankOrder" ' +
                'data-xphm="' + result[i].xtxphm +' "data-lshm="' + result[i].zflshm +'" data-je="'+result[i].khczje+'">' +
                        '<li style="width: 25%;text-indent: 6px;">' + result[i].xtxphm + '</li>' +
                        '<li style="width: 22%;text-indent: 10px;">' + result[i].khhyxm + '</li>' +
                        '<li style="width: 12%;">' + result[i].khczlx + '</li>';
                        if(Number(result[i].khczje)<0){
                            html+='<li style="width: 20%"><span style="color: red;">' + (result[i].khczje).toFixed(2) + '</span></li>';
                        }else{
                            html+='<li style="width: 20%">' + (result[i].khczje).toFixed(2) + '</li>';
                        }
                        html+= '<li style="width: 18%">' + result[i].khczrq + '</li></ul>';

        }
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
                    getDatalist();
                    loading = false;
                }
            },1000);
        }

    });

}
//退货
function refundOrder(_refNo, _date, _money) {
    uexMposUMS.payorder_callback = payOrder_callback;
    var _transData = {};
    _transData["appId"] = AppId;
    _transData["refNo"] = _refNo;  //支付流水号
    _transData["date"] = _date;  //小票号
    _transData["amt"] = _money;

    var _data = {};
    _data["appName"] = "公共资源";
    _data["transId"] = "退货";
    _data["transData"] = _transData;

    try {
        uexMposUMS.payOrder(_data["appName"],_data["transId"],_transData);
    } catch(e) {
        // statements
        alert(e.message);
    }

}

//支付回调
var payOrder_callback = function (opCode, dataType, data){
    //dataType 为1
    //alert(dataType+" 我是dataType和 data"+data);
    var datastr = data.replace(/"{/g, "{").replace(/}"/g, "}");
    eval("var _jsoninfo_ = "+datastr);
    //_jsoninfo_ 相当于data
    //判断调用接口是否成功
    var resultCode = _jsoninfo_["resultCode"]+"";//接口调用成功，业务判断
    var resultMsg = _jsoninfo_["resultMsg"];//接口调用成功，业务判断
    var appName = _jsoninfo_["appName"];// 银行卡收款
    var transId = _jsoninfo_["transId"];//消费------交易类型

    var _jsondata_ = _jsoninfo_["transData"];//承载交易信息

    //alert(resultCode+","+resultMsg+","+appName+","+transId);
    //接口调用成功，业务判断
    if(resultCode=="0")
    {
        if(_jsondata_["resCode"]=="00")// 00表示交易成功！
        {
            //业务返回正确,建议返回完整的transData
            //关键和都有的数据如下：
            /*
             merchantName:商户名
             merchantNo:商户编号
             terminalNo:终端编号
             operNo:操作员号
             amt:交易金额
             batchNo:批次号
             traceNo:凭证号
             refNo:参考号   XXXXXXXXXXXXXXXXXXXX 极其重要 退款需要 XXXXXXXXXXXXXXXXXXXXXX
             date:日期
             time:时间
             memInfo:备注
             */
            if(transId=="退货")
            {
                //退货成功回调
                /**************************************************************************
                 * refundSuccessCallBack(_jsondata_);
                 ***************************************************************************/
            }
            else
            {
                //支付成功回调
                /**************************************************************************
                 * paySuccessCallBack(_jsondata_);
                 ***************************************************************************/
            }
        }
        else
        {
            //报错回调,参数建议使用 _jsondata_["resCode"]   _jsondata_["resDesc"]，也可以直接使用transData
            if(transId=="退货")
            {
                //退货失败回调
                /**************************************************************************
                 * refundErrorCallBack(rcode, rmsg)
                 ***************************************************************************/
            }
            else
            {
                //支付失败回调
                /**************************************************************************
                 * payErrorCallBack(rcode, rmsg)
                 ***************************************************************************/
            }
        }
    }
    else
    {
        //报错回调,参数建议使用 resultCode， resultMsg，也可以直接使用transData
        if(transId=="退货")
        {
            //退货失败回调
            /**************************************************************************
             * refundErrorCallBack(rcode, rmsg)
             ***************************************************************************/
        }
        else
        {
            //支付失败回调
            /**************************************************************************
             * payErrorCallBack(rcode, rmsg)
             ***************************************************************************/
        }
    }
};

