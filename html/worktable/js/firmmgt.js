var pageNum=1;
var loading = false;
var searchContent="";
window.uexOnload= function () {
    uexWindow.setReportKey(0, 1); // 物理返回键接管
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode === 0){
            wfy.pagegoto('../home/index');
        }
    };
}
$(function () {
    getDataList();

    $('body').hammer().on('tap','#backBtn',function (event) {
        event.stopPropagation();

        wfy.pagegoto("../home/index");
    });

    $('body').hammer().on('tap', '#sear',function () {
        $('header').addClass('none');
        $('.header_search').removeClass('none');
    });

    $('body').hammer().on('tap', '.header_search_right',function () {
        $('header').removeClass('none');
        $('.header_search').addClass('none');
    });


    //监控 input 搜索事件
    $("#search").on('keypress',function(e) {
        var keycode = e.keyCode;
        searchContent = $(this).val();
        if(keycode=='13') {
            e.preventDefault();
            //请求搜索接口
            pageNum=1;
            $("#searlist").html("");
            $("#scrollload").addClass("none");
            getDataList();
        }
    });

    //点击 去新增
    $('body').hammer().on('tap','#add',function (event) {
        event.stopPropagation();
        localStorage.firmcode="";
        wfy.pagegoto('firmmgt_dtl');
    });

    //点击 编辑
    $('body').hammer().on('tap','.list_item_1',function (event) {
        event.stopPropagation();
        localStorage.firmcode=getValidStr($(this).attr("data-code"));
        wfy.pagegoto('firmmgt_dtl');
    });

});

//查询数据
function getDataList() {
    var vBiz = new FYBusiness("biz.ctlcode.supplier.qry");

    var vOpr1 = vBiz.addCreateService("svc.ctlcode.supplier.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlcode.supplier.qry");
    vOpr1Data.setValue("AS_XTWLDM", "");
    vOpr1Data.setValue("AS_KEYWORDS", searchContent);
    vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            var result = vOpr1.getResult(d, "AC_RESULT").rows || [];
            createPage(result)
        } else {
            wfy.alert("数据查询失败,"+d.errorMessage);
        }
    }) ;
}

//生成列表页面
function createPage(rows){
    var htmlStr ="";

    if (pageNum == 1 && rows.length == 0) {
        htmlStr = wfy.zero();
    }

    for(var i=0;i<rows.length;i++){
        var temp=rows[i];

        htmlStr+='<div class="list_1 list_swiper" style="height:84px; font-size:13px;">' +
            '<div class="list_item_1 thd ts200" data-code="'+temp.xtwldm+'">' +
            '<div class="item_line">' +
            '<span class="">'+temp.xtwlmc+'</span>' +
            '</div>' +
            '<div class="item_line">' +
            '<span class="">姓名：<span>'+temp.xtlxry+'</span></span>' +
            '<span class="fr">联系方式：<span>'+(getValidStr(temp.xtlxsj)==""?getValidStr(temp.xtlxdh):getValidStr(temp.xtlxsj))+'</span></span>' +
            '</div>' +
            '<div class="item_line">' +
            '<span class="">地址：<span>'+getValidStr(temp.xtsfmc)+getValidStr(temp.xtcsmc)+getValidStr(temp.xtdqmc)+getValidStr(temp.xtwldz)+'</span></span>' +
            '</div></div></div>';
    }

    $("#searlist").append(htmlStr);

    if(rows.length ==20){
        $("#scrollload").removeClass("none");
    }
    if( pageNum > 1 && rows.length ==0){
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