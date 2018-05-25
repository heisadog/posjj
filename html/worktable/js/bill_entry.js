/**
 * Created by WFY02 on 2017/10/31.
 */
var pageIndex=1,loading=false;
var pageName;//页面名 msa020_1200--入库单
var currentTab="L";
var result; //承载结果集
localStorage.showflag="Y";//是否显示审核保存按钮
window.uexOnload= function () {
    uexWindow.setReportKey(0, 1); // 物理返回键接管
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode === 0){
            wfy.pagegoto('../home/index');
        }
    };
}
$(function (){
    //定义表头
    pageinit(function (obj) {
        pageName = obj.page;//msa020_1200
        pageInit(pageName);
    });

    //点击 去新增
    $('body').hammer().on('tap','#add',function (event) {
        event.stopPropagation();
        wfy.pagegoto('bill_entry_add');
    });

    //滑动的 后续操作 依据 单据的类型 调用不同的过程，暂时一放。2017-11-4
    //滑动 之 删除操作
    $('body').hammer().on('tap','.btnde',function (event) {
        event.stopPropagation();
        var czhm = $(this).parents('.list_1').attr('data-kcczhm');//
        var wldm = $(this).parents('.list_1').attr('data-xtwldm');//xtwldm kcckdm
        var ckdm = $(this).parents('.list_1').attr('data-kcckdm');//

        var pdqy = $(this).parents('.list_1').attr('data-kcckqy');//盘点区域
        wfy.confirm("您确定要删除此单据吗？",function () {
            switch (pageName){
                case 'msa020_1200'://------------------------------------------入库单
                    listDel(czhm,'RK',function () {
                        getListRUKU(pageIndex,'RK','L',function (res) {
                            $("#searlist").html("");
                            pageIndex=1;
                            $("#scrollload").addClass("none");

                            localStorage.showflag="Y";
                            result = res;
                            doList(pageName,'L');
                        })
                    })
                    break;
                case 'msa020_1300'://------------------------------------------出库单
                    listDel(czhm,'HZRK',function () {
                        getListRUKU(pageIndex,'HZRK','L',function (res) {
                            $("#searlist").html("");
                            pageIndex=1;
                            $("#scrollload").addClass("none");

                            localStorage.showflag="Y";
                            result = res;
                            doList(pageName,'L');
                        })
                    })
                    break;
                case 'msa010_0100'://--------------------------------------------要货单
                    dolistYaoHuo(czhm,wldm,'delete',function () {
                        getListYAOHUO(pageIndex,'L',function (res) {
                            $("#searlist").html("");
                            pageIndex=1;
                            $("#scrollload").addClass("none");

                            localStorage.showflag="Y";
                            result = res;
                            doList(pageName,'L');
                        })
                    })
                    break;
                case 'msa010_0300'://--------------------------------------------调出单
                    dolistDiaoChu(czhm,wldm,ckdm,function () {
                        getListDIAOCHU(pageIndex,function (res) {
                            $("#searlist").html("");
                            pageIndex=1;
                            $("#scrollload").addClass("none");

                            result = res;
                            doListDiaochu(pageName,'L');
                        })
                    })
                    break;
                case 'msa020_0500':
                    //-------------------------------------盘点单-------------------------
                    doPanDianOrder(czhm,'L',pdqy,ckdm,'delete',function () {
                        getPandianList(pageIndex,'L','T',function (res) {
                            $("#searlist").html("");
                            pageIndex=1;
                            $("#scrollload").addClass("none");

                            result = res;
                            doListpandian(pageName,'L');
                        })
                    })
            }
        },function () {
            return false;
        });
    });

    //滑动 之 审核 操作
    $('body').hammer().on('tap','.btnsh',function (event) {
        event.stopPropagation();
        var czhm = $(this).parents('.list_1').attr('data-kcczhm');
        var wldm = $(this).parents('.list_1').attr('data-xtwldm');//xtwldm
        switch (pageName){
            case 'msa020_1200'://---------------------------入库单
                changeStatus('RK',czhm,"S",function () {
                    getListRUKU(pageIndex,'RK','L',function (res) {
                        $("#searlist").html("");
                        pageIndex=1;
                        $("#scrollload").addClass("none");

                        localStorage.showflag="Y";
                        result = res;
                        doList(pageName,'L');
                    })
                });
                break;
            case 'msa020_1300'://---------------------------出库单
                changeStatus('HZRK',czhm,"S",function () {
                    getListRUKU(pageIndex,'HZRK','L',function (res) {
                        $("#searlist").html("");
                        pageIndex=1;
                        $("#scrollload").addClass("none");

                        localStorage.showflag="Y";
                        result = res;
                        doList(pageName,'L');
                    })
                });
                break;
            case 'msa010_0100'://-------------------------------------要货单
                dolistYaoHuo(czhm,wldm,'confirm',function () {
                    getListYAOHUO(pageIndex,'L',function (res) {
                        $("#searlist").html("");
                        pageIndex=1;
                        $("#scrollload").addClass("none");

                        localStorage.showflag="Y";
                        result = res;
                        doList(pageName,'L');
                    })
                })
                break;
            case 'msa010_0300'://--------------------------------------------调出单
                //调出单的审核 是新写的过程
                subDiaoChu(czhm,function () {
                    getListDIAOCHU(pageIndex,function (res) {
                        $("#searlist").html("");
                        pageIndex=1;
                        $("#scrollload").addClass("none");

                        result = res;
                        doListDiaochu(pageName,'L');
                    })
                })
                break;
        }

    })

    //点击 显示详情
    $('body').hammer().on("tap",'.list_1',function( event){
        event.stopPropagation();
        localStorage.entrycode=$(this).attr("data-kcczhm");
        localStorage.strcode=getValidStr($(this).attr("data-str"));
        wfy.goto("bill_dtl");
    });

    //重新定义 返回功能
    wfy.tap('#backs',function () {
        wfy.pagegoto('../home/index');
    });

    //滑动 之  提交与取消提交 取消审核  -----针对 盘点单的操作
    $('body').hammer().on("tap",'.btsum',function( event){
        event.stopPropagation();
        var czhm = $(this).parents('.list_1').attr('data-kcczhm');//
        var ckdm = $(this).parents('.list_1').attr('data-kcckdm');//
        var pdqy = $(this).parents('.list_1').attr('data-kcckqy');//盘点区域
        var html = $(this).html();
        switch (html){
            case '提交':
                doPanDianOrder(czhm,'L',pdqy,ckdm,'confirm',function () {
                    getPandianList(pageIndex,'L','T',function (res) {
                        $("#searlist").html("");
                        pageIndex=1;
                        $("#scrollload").addClass("none");

                        result = res;
                        doListpandian(pageName,'L');
                    })
                })
                break;
            case '取消提交':
                doPanDianOrder(czhm,'L',pdqy,ckdm,'confirmcancle',function () {
                    getPandianList(pageIndex,'L','T',function (res) {
                        $("#searlist").html("");
                        pageIndex=1;
                        $("#scrollload").addClass("none");

                        result = res;
                        doListpandian(pageName,'L');
                    })
                })
                break;
            case '审核':
                localStorage.opercode=$(this).parents('.list_1').attr('data-kcczhm');
                localStorage.strcode=$(this).parents('.list_1').attr("data-str");
                wfy.goto("bill_dtl");
                break;
            case '取消审核':
                wfy.confirm('您确认要取消审核？',function () {
                    doCancelPanModify(czhm,function () {
                        getPandianList(pageIndex,'S','L',function (res) {
                            $("#searlist").html("");
                            pageIndex=1;
                            $("#scrollload").addClass("none");

                            result = res;
                            doListpandian(pageName,'S');
                        });
                    });
                },function () {
                    return false;
                });

                break;
        }

    });
})

function pageInit(pageName) {
    console.info(pageName);
    switch (pageName){
        case 'msa020_1200'://------------------------入库单-------------------------
            $("#pagename").html("入库单");
            var cfg = {
                cont:["维护","已审核"],
                data:["L","S"],
                callback:rukuTab
            };
            $("#tab").taber(cfg);
            getListRUKU(pageIndex,'RK',currentTab,function (res) {
                result = res;
                console.log(res)
                doList(pageName,currentTab);
            })
            break;
        case 'msa020_1300'://------------------------出库单-------------------------
            $("#pagename").html("出库单");
            var cfg = {
                cont:["维护","已审核"],
                data:["L","S"],
                callback:chukuTab
            };
            $("#tab").taber(cfg);
            getListRUKU(pageIndex,'HZRK',currentTab,function (res) {
                result = res;
                doList(pageName,currentTab);
            });
            break;
        case 'msa010_0100'://------------------------要货单-------------------------
            $("#pagename").html("要货单");
            var cfg = {
                cont:["维护","已审核"],
                data:["L","S"],
                callback:yaohuoTab
            };
            getListYAOHUO(pageIndex,currentTab,function (res) {
                result = res;
                doList(pageName,currentTab);
            })
            $("#tab").taber(cfg);
            break;
        case 'msa010_0300'://------------------------调出单-------------------------
            //调出 没有 维护 和 审核 tab 页
            $("#pagename").html("调出单");
            // var cfg = {
            //     cont:["维护","审核"],
            //     data:["L","S"],
            //     callback:diaochuTab
            // };
            getListDIAOCHU(pageIndex,function (res) {
                result = res;
                doListDiaochu(pageName,currentTab);
            })
            //$("#tab").taber(cfg);
            $('#tab').hide();
            break;
        case 'msa020_0500'://-----------------------------盘点单----------------------
            $("#pagename").html("盘点单");
            var cfg = {
                cont:["录入","审核"],
                data:["L","S"],
                para1:['T','L'],
                callback:pandianTab
            };
            $("#tab").taber(cfg);
            getPandianList(pageIndex,currentTab,'T',function (res) {
                result = res;
                doListpandian(pageName,currentTab);
            })
            break;
    }
}

//tab 切换 事件  之 入库单 
function rukuTab(d) {
    $("#searlist").html("");
    pageIndex=1;
    $("#scrollload").addClass("none");


    currentTab=$(d).attr("data-type");//
    if(currentTab=="L"){
        localStorage.showflag="Y";
    }else{
        localStorage.showflag="N";
    }
    getListRUKU(pageIndex,'RK',currentTab,function (res) {
        result = res;
        doList(pageName,currentTab);
    })
}
//tab 切换 事件  之 出库单
function chukuTab(d) {
    $("#searlist").html("");
    pageIndex=1;
    $("#scrollload").addClass("none");


    currentTab=$(d).attr("data-type");//
    if(currentTab=="L"){
        localStorage.showflag="Y";
    }else{
        localStorage.showflag="N";
    }
    getListRUKU(pageIndex,'HZRK',currentTab,function (res) {
        result = res;
        doList(pageName,currentTab);
    })
}
//tab 切换 事件  之 要货单
function yaohuoTab(d) {
    $("#searlist").html("");
    pageIndex=1;
    $("#scrollload").addClass("none");

    currentTab=$(d).attr("data-type");//
    if(currentTab=="L"){
        localStorage.showflag="Y";
    }else{
        localStorage.showflag="N";
    }
    getListYAOHUO(pageIndex,currentTab,function (res) {
        result = res;
        doList(pageName,currentTab);
    })
}
//tab 切换 事件  之 调出单
function diaochuTab(d) {
    $("#searlist").html("");
    pageIndex=1;
    $("#scrollload").addClass("none");

    currentTab=$(d).attr("data-type");//
    getListDIAOCHU(pageIndex,function (res) {
        result = res;
        doListDiaochu(pageName,currentTab);
    })
}
//tab 切换 事件  之 盘点单
function pandianTab(d) {
    $("#searlist").html("");
    pageIndex=1;
    $("#scrollload").addClass("none");

    currentTab=$(d).attr("data-type");//
    var para1 = $(d).attr("data-para1")
    getPandianList(pageIndex,currentTab,para1,function (res) {
        result = res;
        doListpandian(pageName,currentTab);
    })
}

//处理结果集
function doList(page,status) {

    var btn ='<div class="list_item_btn btnde">删除</div><div class="list_item_btn btnsh">审核</div>';
    if(status =="L"){
        btn ='<div class="list_item_btn btnde">删除</div><div class="list_item_btn btnsh">审核</div>';
    }
    if(status =="S"){
        btn = '';
    }
    var html='';
    if(pageIndex == 1 && result.length == 0){
        html= wfy.zero();
    }
    for (var i = 0; i<result.length; i++){
        html+='<div class="list_1 list_swiper" style="height:90px; font-size:13px;" data-kcczhm="'+result[i].kcczhm+'" data-xtwldm="'+result[i].xtwldm+'">'+
                '<div class="list_item_1 thd ts200" data-code="'+result[i].kcczhm+'">'+
                    '<div class="item_line">'+
                        '<span class=""><span style="color:#000">'+result[i].kcpdhm+'</span></span>'+
                        '<span class="fr"><span>'+result[i].kcczrq+'</span></span>'+
                    '</div>'+
                    '<div class="item_line">'+
                        '<span class="">操作员：<span>'+result[i].zdry+'</span></span>'+
                        '<span class="fr">店/仓：<span>'+result[i].kcckmc+'</span></span>'+
                    '</div>'+
                    '<div class="item_line">'+
                        '<span class="">数量：<span style="color: red">'+result[i].sl+'</span></span>'+
                        '<span class="fr">总额：<span style="color: red">'+wfy.setTwoNum(result[i].je,2)+'</span></span>'+
                    '</div>'+
                 '</div>'+
                 '<div class="list_drap">' + btn + '</div>'+
              '</div>';
    }
    $("#searlist").append(html);

    if(result.length ==20){
        $("#scrollload").removeClass("none");
    }
    if( pageIndex > 1 && result.length ==0){
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


//处理结果集 ---调出----
function doListDiaochu(page,status) {

    var btn ='<div class="list_item_btn btnde">删除</div><div class="list_item_btn btnsh">审核</div>';
    if(status =="L"){
        btn ='<div class="list_item_btn btnde">删除</div><div class="list_item_btn btnsh">审核</div>';
    }
    if(status =="S"){
        btn = '';
    }
    var html='';
    if(pageIndex == 1 && result.length == 0){
        html= wfy.zero();
    }
    for (var i = 0; i<result.length; i++){
        html+='<div class="list_1 list_swiper" style="height:84px; font-size:13px;" data-kcczhm="'+result[i].xsczhm+'" data-kcckdm="'+result[i].kcckdm+'" data-xtwldm="'+result[i].xtwldm+'">'+
            '<div class="list_item_1 thd ts200" data-code="'+result[i].xsczhm+'">'+
            '<div class="item_line">'+
            '<span class=""><span style="color:#000">'+result[i].lrrymc+'</span></span>'+
            '<span class="fr"><span>'+result[i].xslrrq+'</span></span>'+
            '</div>'+
            '<div class="item_line">'+
            '<span class="">调出：<span>'+result[i].kcckmc+'</span></span>'+
            '<span class="fr">调入：<span>'+result[i].shckmc+'</span></span>'+
            '</div>'+
            '<div class="item_line">'+
            '<span class="">数量：<span style="color: red">'+result[i].xsphsl+'</span></span>'+
            '<span class="fr">总额：<span style="color: red">'+wfy.setTwoNum(result[i].xsphje,2)+'</span></span>'+
            '</div>'+
            '</div>'+
            '<div class="list_drap">' + btn + '</div>'+
            '</div>';
    }
    $("#searlist").append(html);

    if(result.length ==20){
        $("#scrollload").removeClass("none");
    }
    if( pageIndex > 1 && result.length ==0){
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
//处理结果集-----盘点----
function doListpandian(page,type) {
    var html='';
    if(pageIndex == 1 && result.length == 0){
        html= wfy.zero();
    }
    for (var i = 0; i<result.length; i++){
        var status="";
        var statusCode="";

        var btn ='<div class="list_item_btn btnde">删除</div><div class="list_item_btn btnsh">审核</div>';
        if(type =='L'){
            if(result[i].kcpdzt =="L"){
                status="未提交";
                statusCode="00";
                btn ='<div class="list_item_btn btnde">删除</div><div class="list_item_btn btsum">提交</div>';
            }else if(result[i].kcpdzt =="T"){
                status="已提交";
                statusCode="01";
                btn ='<div class="list_item_btn btsum">取消提交</div>';
            }

            html+='<div class="list_1 list_swiper" style="height:90px; font-size:13px;" ' +
                'data-kcczhm="'+result[i].kcczhm+'" ' +
                'data-xtwldm="'+result[i].kcckdm+'" ' +
                'data-kcpdzt="'+result[i].kcpdzt+'" ' +
                'data-kcckqy="'+result[i].kcckqy+'" '+
                'data-kcckdm="'+result[i].kcckdm+'" data-str="'+result[i].kcckqy+';'+statusCode+'">';
                /*'<div class="list_item_1 thd ts200 '+ (result[i].kcpdzt == "L"?"":"listbgcor") +'">'+
                '<div class="item_line">'+
                '<span class=""><span style="color:#000">操作员:'+result[i].kclrxm+'</span></span>'+
                '<span class="fr"><span>'+result[i].kclrrq+'</span></span>'+
                '</div>'+
                '<div class="item_line">'+
                '<span class="">店/仓：<span>'+result[i].kcckmc+'</span></span>'+
                '<span class="fr"><span>' + status /!*(result[i].kcpdzt=="L"?"未提交":"已提交")*!/ + '</span></span>'+
                '</div>'+
                '<div class="item_line">'+
                '<span class="">数量：<span style="color: red">'+result[i].spsl+'</span></span>'+
                '<span class="fr">总额：<span style="color: red">'+wfy.setTwoNum(result[i].kcspje)+'</span></span>'+
                '</div>'+
                '</div>'+
                '<div class="list_drap">' + btn + '</div>'+
                '</div>';*/
        }else if(type =='S'){
            if(result[i].kcpdzt =="L"){
                status="未审核";
                statusCode="10";
                //btn = '<div class="list_item_btn btsum">审核</div>';
                btn = '';
            }else if(result[i].kcpdzt =="S"){
                status="已审核";
                statusCode="11";
                btn = '<div class="list_item_btn btsum">取消审核</div>';
            }

            html+='<div class="list_1 list_swiper" style="height:90px; font-size:13px;"' +
                'data-kcczhm="'+result[i].kcczhm+'" ' +
                'data-xtwldm="'+result[i].kcckdm+'" data-str="'+result[i].kcckqy+';'+statusCode+'">';

        }

        html+='<div class="list_item_1 thd ts200 '+ (result[i].kcpdzt == "L"?"":"listbgcor") +'">'+
            '<div class="item_line">'+
            '<span class=""><span style="color:#000">操作员:'+(result[i].kcczxm || "")+'</span></span>'+
            '<span class="fr"><span>'+getValidStr(result[i].kcczrq)+'</span></span>'+
            '</div>'+
            '<div class="item_line">'+
            '<span class="">店/仓：<span>'+result[i].kcckmc+'</span></span>'+
            '<span class="fr"><span>' + status /*(result[i].kcpdzt=="L"?"未提交":"已提交")*/ + '</span></span>'+
            '</div>'+
            '<div class="item_line">'+
            '<span class="">数量：<span style="color: red">'+result[i].kcspsl+'</span></span>'+
            '<span class="fr">总额：<span style="color: red">'+wfy.setTwoNum(result[i].kcspje)+'</span></span>'+
            '</div>'+
            '</div>';

        if(getValidStr(btn)!=""){
            html+='<div class="list_drap">' + btn + '</div>';
        }

        html+='</div>';


    }
    $("#searlist").append(html);

    if(result.length ==20){
        $("#scrollload").removeClass("none");
    }
    if( pageIndex > 1 && result.length ==0){
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