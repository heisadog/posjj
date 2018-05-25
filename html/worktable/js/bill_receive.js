var pageIndex=1,loading=false,pageName="";

$(function () {
    //页面入口
    pageinit(function (obj) {
        pageName = obj.page;//msa020_1200
        pageInit(pageName);
    });

    $('body').hammer().on('tap','#backBtn',function (event) {
        event.stopPropagation();

        wfy.pagegoto("../home/index");
    });

    //盘点确认 确认操作
    $('body').hammer().on("tap",'#confirm',function( event){
        event.stopPropagation();

        localStorage.opercode=$(this).attr("data-code");
        localStorage.strcode=$(this).attr("data-str");
        wfy.goto("bill_dtl");
    });

    //盘点确认 取消确认操作
    $('body').hammer().on("tap",'#cancel_confirm',function( event){
        event.stopPropagation();

        var operid=$(this).parents('.list_1').children(".list_item_1").attr("data-code");
        checkCancelConfirm(operid);
    });

    $('body').hammer().on("tap",'.list_item_1',function( event){
        event.stopPropagation();

        localStorage.opercode=$(this).attr("data-code");

        if(pageName=="msa020_1600"){
            localStorage.strcode=$(this).attr("data-str");
        }

        wfy.goto("bill_dtl");
    });

});

function pageInit(pageName) {
    switch (pageName){
        case 'msa020_0400'://------------------------调入单-------------------------
            $("#page").html("调入单");

            getDIAORU(pageIndex,function (res) {
                createPage(pageName,res);
            });
            break;
        case 'msa020_0100'://------------------------收货单-------------------------
            $("#page").html("收货单");

            getListSHOUHUO(pageIndex,function (res) {
                createPage(pageName,res);
            })
            break;
        case 'msa020_1600'://------------------------盘点单确认-------------------------
            $("#page").html("盘点单确认");

            getPandianList(pageIndex,'Q','T',function (res) {
                createPage(pageName,res);
            })
            break;
    }
}

function createPage(page,rows) {
    var htmlStr="";

    if(pageIndex==1&&rows.length == 0){
        htmlStr= wfy.zero();
    }

    for(var i=0;i<rows.length;i++){
        var temp=rows[i];
        if(page=="msa020_0400"){
            htmlStr+='<div class="list_1 list_swiper" style="height:115px">' +
                '<div class="list_item_1 thd ts200" data-code="'+temp.kcczhm+'">' +
                '<div class="item_line">' +
                '<span class=""><span>'+temp.xsphdh+'</span></span>' +
                '</div>' +
                '<div class="item_line">' +
                '<span class="">操作员：<span>'+temp.xslrry+'</span></span>' +
                '<span class="fr"><span>'+temp.xsfhrq+'</span></span>' +
                '</div>' +
                '<div class="item_line">' +
                '<span class="">调出：<span>'+temp.kcckmc+'</span></span>' +
                '<span class="fr">调入：<span>'+temp.shckmc+'</span></span>' +
                '</div>'+
                '<div class="item_line">' +
                '<span class="">总数：<span>'+temp.sl+'</span></span>' +
                '<span class="fr">总额：<span>'+wfy.setTwoNum(temp.je,2)+'元</span></span></div></div>'+

                //'<div class="list_drap"><div class="list_item_btn">sds</div><div class="list_item_btn">sdd</div></div>&lt;!&ndash;<span>删除</span>&ndash;&gt;' +
                '</div>';
        }else if(page=="msa020_0100"){
            htmlStr+='<div class="list_1 list_swiper" style="height:85px">' +
                '<div class="list_item_1 thd ts200" data-code="'+temp.kcczhm+'">' +
                '<div class="item_line">' +
                '<span class=""><span>'+temp.xsphdh+'</span></span>' +
                '<span class="fr"><span>'+temp.xsfhrq+'</span></span>' +
                '</div>' +
                '<div class="item_line">' +
                '<span class="">操作员：<span>'+temp.xslrry+'</span></span>' +
                '<span class="fr">店/仓：<span>'+temp.kcckmc+'</span></span>' +
                '</div>' +
                '<div class="item_line">' +
                '<span class="">总数：<span>'+temp.sl+'</span></span>' +
                '<span class="fr">总额：<span>'+wfy.setTwoNum(temp.je,2)+'元</span></span></div></div>'+

                //'<div class="list_drap"><div class="list_item_btn">sds</div><div class="list_item_btn">sdd</div></div>&lt;!&ndash;<span>删除</span>&ndash;&gt;' +
                '</div>';
        }else if(page=="msa020_1600"){
            var btn="";
            if(temp.kcpdzt =="S"){
                btn="";
                //btn = '<div class="list_item_btn btsum" id="confirm">确认</div>';
            }else if(temp.kcpdzt =="Q"){
                btn="";
                //btn = '<div class="list_item_btn btsum" id="cancel_confirm">取消确认</div>';
            }

            htmlStr+='<div class="list_1 list_swiper" style="height:85px">' +
                '<div class="list_item_1 thd ts200 '+(temp.kcpdzt == "Q"?"listbgcor":"")+'" data-code="'+temp.kcczhm+'" data-str="'+(temp.kcpdzt=="S"?"00":"01")+'">' +
                '<div class="item_line">' +
                '<span class="">操作员：<span>'+getValidStr(temp.kcczxm)+'</span></span>' +
                '<span class="fr"><span>'+getValidStr(temp.kcczrq)+'</span></span>' +
                '</div>' +
                '<div class="item_line">' +
                '<span class="">店/仓：<span>'+temp.kcckmc+'</span></span>' +
                '<span class="fr"><span>'+(temp.kcpdzt=="Q"?"已确认":"未确认")+'</span></span>' +
                '</div>' +
                '<div class="item_line">' +
                '<span class="" style="color:red;">差异数：<span>'+temp.kccysl+'</span></span>' +
                '<span class="fr" style="color:red;">差异额：<span>'+Number(temp.kccyje).toFixed(2)+'元</span></span></div></div>';

            if(getValidStr(btn)!=""){
                htmlStr +='<div class="list_drap">' +btn+'</div>';
            }

            htmlStr+='</div>';
        }

    }

    $("#searlist").append(htmlStr);

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
                    pageInit(page);
                    loading = false;
                }
            },1000);
        }

    });
}

//盘点单 取消确认操作
function checkCancelConfirm(opercode) {
    var vBiz = new FYBusiness("biz.inv.st.confirm.cancel.modify");

    var vOpr1 = vBiz.addCreateService("svc.inv.st.confirm.cancel.modify", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.inv.st.confirm.cancel.modify");
    vOpr1Data.setValue("AS_CZHM", opercode);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            wfy.alert("取消确认成功");
            setTimeout(function () {
                $(".wfyContList").html("");
                pageNum=1;
                $("#scrollload").addClass("none");

                pageInit(pageName);
            },1000);

        } else {
            wfy.alert("取消确认失败！" + d.errorMessage);
        }
    }) ;
}