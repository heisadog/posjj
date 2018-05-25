var pageIndex = 1 ;//页码
var loading = false;
var mddm=[];
var md="";
var ks='';
var mc='';
var par1 = 'KS',par2 ='SL',par3 = 'ASC';
wfy.opensearch = function (s) {
    $("#cover").removeClass("none");
    $("#" + s).removeClass("y_100"); 
}
wfy.closesearch = function () {
    $("#cover").addClass("none");
    $(".selectTopBox").addClass("y_100");
}
$(function () {
    wfy.init();

    list();

    //点击搜索
    wfy.tap('#modles',function (_this) {
        wfy.opensearch('search');
    });
    //  选择 门店
    $('body').hammer().on('tap','#md',function (event) {
        event.stopPropagation();
        getShopName();
    })
    //  x清除
    $('body').hammer().on('tap','.topSearchBox li .delethis',function (event) {
        event.stopPropagation();
        $(this).prev().val('');

        if(getValidStr($(this).prev().attr("id"))=="md"){
            md="";
        }
    })
    // 清除
    $('body').hammer().on('tap','#clear',function (event) {
        event.stopPropagation();
        $('.topSearchBox li input').val('');

        md="";
    })
    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();
        $("#searlist").html("");
        pageIndex=1;
        $("#scrollload").addClass("none");

        ks = $('#ks').val();
        mc = $('#mc').val();
        wfy.closesearch();
        $('#stock_head li').each(function (index) {
            var index = index;
            var span = $(this).find('span');
            if(span.hasClass('check')){
                if(index == 0 || index == 1){
                    par1 = $(this).attr('data-type');
                }
                if(index == 2 || index == 3){
                    par2 = $(this).attr('data-type');
                    var htm = $(this).find('i').html();
                    if(htm == '↓'){
                        par3 = 'ASC';
                    }else {
                        par3 = 'DESC';
                    }
                }
            }
        })
        list();
    })
    //排序
    $('body').hammer().on('tap','#stock_head li',function (event) {
        event.stopPropagation();

        $("#searlist").html("");
        pageIndex=1;
        $("#scrollload").addClass("none");

        var index = $(this).index();
        if(index == 0 || index ==1){
            $('#stock_head li').eq(0).find('span').removeClass('check');
            $('#stock_head li').eq(1).find('span').removeClass('check');
            $(this).find('span').addClass('check');
            par1 = $(this).attr('data-type');
        }
        if(index == 2 || index ==3){
            $('#stock_head li').eq(2).find('span').removeClass('check');
            $('#stock_head li').eq(3).find('span').removeClass('check');
            $(this).find('span').addClass('check');
            par2 = $(this).attr('data-type');
            
            var htm = $(this).find('i').html();
            if(htm == '↓'){
                $(this).find('i').html('↑');
                par3 = 'ASC';
            }else {
                $(this).find('i').html('↓');
                par3 = 'DESC';
            }
        }
        list();
    })

});

function list() {
    var vBiz = new FYBusiness("biz.invqry.stock.qry");
    var vOpr1 = vBiz.addCreateService("svc.invqry.stock.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID",LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invqry.stock.qry");
    vOpr1Data.setValue("AS_XTWPKS", ks);//款号
    vOpr1Data.setValue("AS_XTWPMC", mc);//品名
    vOpr1Data.setValue("AS_XSMDDM", md);//门店
    vOpr1Data.setValue("AS_XTWPPP", "");//品牌 ---暂时为空
    vOpr1Data.setValue("AS_XSCXFS", par1);//查询方式：按款式-'KS' | 按商品-'WP'
    vOpr1Data.setValue("AS_XSPXFS", par2);//排序方式：按库存数-'SL' | 按库存额-'JE'
    vOpr1Data.setValue("AS_XSPXLX", par3);//排序类型：升序-'ASC' | 降序-'DESC'
    vOpr1Data.setValue("AN_PAGE_NUM", pageIndex);//第几页
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");//每页条数
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.log(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var rows = vOpr1.getResult(d, "AC_LIST").rows || [];
            var toje = vOpr1.getResult(d, "AC_SUM").rows || [];
            console.log(rows)
            $('#tonum').html(toje[0].kczksl);
            $('#toje').html(wfy.setTwoNum(toje[0].kczkje,2));//(toje[0].kczkje).toFixed(2)
            var html ="";
            if( pageIndex == 1 && rows.length ==0){
                html = wfy.zero();
            }
            for(var i = 0; i<rows.length;i++){
                html +='<div class="wfyitem_list">' +
                            '<div class="wfyitem_line">'+
                             '<span class="black">'+rows[i].xtwpks+'</span> ' +
                            '</div> ' +
                            '<div class="wfyitem_line"> ' +
                                '<span class="" style="width: 10%">名称：'+wfy.cutstr(rows[i].xtwpmc,10)+'</span>' +
                                '<span class="fr" style="width: 50%;">上架日期：'+rows[i].xtlrrq+'</span>' +
                            '</div>' +
                            '<div class="wfyitem_line" style="color: red">' +
                                '<span class="fl" style="width: 50%;">库存数：'+(rows[i].kczksl || 0)+'</span>' +
                                '<span>库存额：'+(rows[i].kczkje || 0)+'</span>' +
                            ' </div> ' +
                        '</div>';
            }
            $('#searlist').append(html);

            if(rows.length ==20){
                $("#scrollload").removeClass("none");
            }
            if( pageIndex > 1 && rows.length ==0){
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
                            pageIndex ++;
                            list();
                            loading = false;
                        }
                    },1000);
                }

            });
        } else {
            wfy.alert(d.errorMessage)
        }
    }) ;
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
            // todo...
            //AC_RESULT_CORR
            var result = vOpr1.getResult(d, "AC_RESULT_CORR").rows || [];//获取公司名
            mddm = vOpr2.getResult(d, "AC_RESULT_SHOP").rows || [];//获取店铺名
            var html="";
            for(var i = 0 ;i < mddm.length; i++){
                html += '<div class="lilit" data-mddm="'+mddm[i].mddm+'" style="line-height: 40px;text-align: center;border-bottom: #d9d9d9 solid 1px">'+mddm[i].mdmc+'</div>';
            }
            wfy.ios_alert(html);
            wfy.tap('.lilit',function (that) {
                var mdmc = $(that).html();
                md = $(that).attr('data-mddm');
                $('#md').val(mdmc);
                wfy.ios_alert_close();
            })
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}
