/**
 * Created by WFY02 on 2017/11/21.
 */
var menuListArr=[
    {menucode:"msa010_0100",pagecode:"bill_entry"},//要货单
    {menucode:"msa010_0200",pagecode:""},//退货单
    {menucode:"msa010_0300",pagecode:"bill_entry"},//调出单
    {menucode:"msa010_0400",pagecode:"qry_attendance"},//考勤查询
    {menucode:"msa020_1700",pagecode:""},//库存操作查询
    {menucode:"msa020_0100",pagecode:"bill_receive"},//收货单
    {menucode:"msa020_1800",pagecode:"control"},//仓库监控
    {menucode:"msa020_0400",pagecode:"bill_receive"},//调入单
    {menucode:"msa020_0500",pagecode:"bill_entry"},//盘点单
    {menucode:"msa020_1600",pagecode:"bill_receive"},//	盘点单确认
    // {menucode:"msa020_0700",pagecode:""},//库存结账处理
    {menucode:"msa020_0900",pagecode:"qry_stock"},//库存查询
    {menucode:"msa020_1000",pagecode:""},//进出货查询
    {menucode:"msa020_1200",pagecode:"bill_entry"},//入库单
    {menucode:"msa020_1300",pagecode:"bill_entry"},//出库单
    {menucode:"msa020_1500",pagecode:"firmmgt"},//厂商管理
    {menucode:"msa030_0100",pagecode:"storeSale"},//销售收银  storeSale
    {menucode:"msa030_0200",pagecode:"storeSale"},//收款
    {menucode:"msa030_0300",pagecode:"print"},//单据补打
    {menucode:"msa030_0400",pagecode:"salerank"},//销售榜
    {menucode:"msa030_0500",pagecode:"qry_staff_performance"},//销售业绩
    {menucode:"msa030_0600",pagecode:"qry_pro_sales"},//商品信息查询
    {menucode:"msa030_0700",pagecode:"Attendance"},//员工考勤
    {menucode:"msa030_0800",pagecode:"storeSale"},//销售开单
    {menucode:"msa030_0900",pagecode:"bill_noend"},//未结订单
    {menucode:"msa030_1000",pagecode:"qry_sales"},//销售订单查询 qry_sales
    {menucode:"msa030_1100",pagecode:"qry_sales_dtl"},//销售明细查询
    {menucode:"msa030_1200",pagecode:"staffmgt"},//员工管理
    {menucode:"msa040_0100",pagecode:"qry_coutomer"},//客户维护   qry_coutomer_info
    {menucode:"msa040_0200",pagecode:"qry_arrears"},//客户欠款
    {menucode:"msa040_0300",pagecode:"qry_coutomer_consumption"},//会员消费统计
    {menucode:"msa040_0400",pagecode:"qry_costprofit"},//成本利润
    {menucode:"msa020_0700",pagecode:"exbressList"},//叫快递
];
var posarr=['msa010_0100','msa010_0300','msa010_0400','msa020_0100','msa020_1800','msa020_0400','msa020_0500','msa020_1600','msa020_0900','msa020_1200','msa020_1300',
    'msa020_1500','msa030_0100','msa030_0200','msa030_0300','msa030_0400','msa030_0500','msa030_0600','msa030_0700','msa030_0800','msa030_0900','msa030_1000','msa030_1100',
    'msa030_1200','msa040_0100','msa040_0200','msa040_0300','msa040_0400','msa020_0700'];
var canvasHeight = 0.35;
var client = document.body.clientWidth;
if(client == '375'){
    var canvasHeight = 0.35;
}
var storeArr=[];//门店 信息
var daySaleNum,weekSaleNum ;//日畅销数量 和 周畅销数量
var menuDom='';//添加的菜单 dom元素内容
var len;//已经存在的 添加按钮g个数
var strArr = [] ;//选中代码的集合
var footerIndex = 0;//底部按钮索引
var footerUrl ='home';//初始默认值为 home
var seararr=[];
var searhtml = '';
window.uexOnload= function () {
    uexWindow.setOrientation(1); // 设置不能横屏
    uexWindow.setReportKey(0, 1); // 物理返回键接管
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode === 0){
            if(localStorage.footerIndex == 2){
                localStorage.footerIndex == 0;
                $('#header').addClass('none');
                getMenuList('01',checkMenu);
                $('#storeName').removeClass('none');
                $('.charttab .charttab_btn').eq(1).removeClass('charttab_btn_check');
                $('.charttab .charttab_btn').eq(0).addClass('charttab_btn_check');
                getHomeHeadMes('');
                $('.main').addClass('none').eq(0).removeClass('none');
                $('.footer_div').removeClass('main_color').eq(0).addClass('main_color');
            }
            if(localStorage.footerIndex == 0 && localStorage.footerIndex == 1){
                if($('#tosttop').hasClass('y100')){
                    $('#tosttop').removeClass('y100')
                }else {
                    localStorage.footerIndex == 0;
                    $('#header').addClass('none');
                    getMenuList('01',checkMenu);
                    $('#storeName').removeClass('none');
                    $('.charttab .charttab_btn').eq(1).removeClass('charttab_btn_check');
                    $('.charttab .charttab_btn').eq(0).addClass('charttab_btn_check');
                    getHomeHeadMes('');
                    $('.main').addClass('none').eq(0).removeClass('none');
                    $('.footer_div').removeClass('main_color').eq(0).addClass('main_color');
                }
            }
        }
    };
}
$(function () {
    //日期
    $('.date_bottom').html(localStorage.date+"月"+localStorage.day+'日');
    //获取权限信息
    getMenuList('01',checkMenu);
    getMenuList("02",menuCreate);
    //我的 按钮 权限配置
    minemenu();
    //footer切换 worktable
    $('body').hammer().on('tap','.footer_div',function (event) {
        event.stopPropagation();
        footerIndex = $(this).index();
        localStorage.footerIndex = $(this).index();
        footerUrl = $(this).attr('data-url');
        if(localStorage.footerIndex == 0){
            $('#headerName').addClass('none');
            getMenuList('01',checkMenu);
            $('#storeName,#header').removeClass('none');
            //获取全部信息，调过程-------------解决 返回到首页其他模块的时候，切换到首页模块不显示柱状图问题。--直接重新执行一次
            $('.charttab .charttab_btn').eq(1).removeClass('charttab_btn_check');
            $('.charttab .charttab_btn').eq(0).addClass('charttab_btn_check');
            getHomeHeadMes('');//获取全部信息，调过程
        }
        if(localStorage.footerIndex == 1){
            $('#headerName').html('业务').removeClass('none');
            getMenuList("02",menuCreate);
            $('#storeName,#header').addClass('none');
        }
        if(localStorage.footerIndex == 2){
            $('#headerName').html('我的').removeClass('none');
            $('#storeName,#header').addClass('none');
        }
        $('.main').addClass('none').eq(footerIndex).removeClass('none');
        $('.footer_div').removeClass('main_color');
        $(this).addClass('main_color');
    })
    //获取 公司及网店 信息
    getShopName();
    getHomeHeadMes('');//获取全部信息，调过程
    //点击全部店铺，选择某个店铺
    $('body').hammer().on('tap','#storeName',function (event) {
        event.stopPropagation();
        if(storeArr.length != 1){//只有一个店铺不执行弹出
            doStore(storeArr);
        }
    })
    //点击选中某个 店铺
    $('body').hammer().on('tap','#storeBox .item',function (event) {
        event.stopPropagation();
        var that = $(this);
        localStorage.mddm = $(this).attr('data-wldm');
        DepartmentCode = $(this).attr('data-wldm');
        setTimeout(function () {
            var mddm = that.attr('data-wldm');
            var mdmc = that.html();
            localStorage.wldm = mddm;
            $('#storeName').html(wfy.cutstr(mdmc,4));
            getHomeHeadMes(mddm);
            //总店 是 和
            var index = that.index();
            if(index == 0){
                getPassengerFlow(localStorage.storeArrStr);
            }else {
                getPassengerFlow(mddm);
            }
            wfy.closeWin();
        },111)
    })
    //表格切换
    wfy.tap('.charttab_btn',function (s) {
        $('.charttab_btn').removeClass('charttab_btn_check');
        $(s).addClass('charttab_btn_check');
        var index = $(s).index();
        if(index == 1){
            $('#chart_day').addClass('none');
            $('#chart_week').removeClass('none');
            //doChartMess(weekSaleNum);
        }else {
            $('#chart_week').addClass('none');
            $('#chart_day').removeClass('none');
            //doChartMess(daySaleNum);
        }

    })


    /*--------------------------------------one--------------------------------*/
    //点击添加按钮---
    $('body').hammer().on('tap','.footTable_dvt',function (event) {
        event.stopPropagation();
        //通过是否能获取到 url 来区分 是页面跳转还是 弹出添加
        var url = $(this).parent('.footTable_dv').attr('data-url');
        var czmc = $(this).parent('.footTable_dv').attr('data-czmc');
        localStorage.page = $(this).parent('.footTable_dv').attr('data-xtgndm');
        if(czmc){
            if(url){
                //$('#storeName,#header,.headmissage').addClass('none');
                wfy.pagegoto('../worktable/'+url);
            }else {
                wfy.alert("功能正在开发，敬请期待");
            }
        }else {
            //加载所有的权限图标 ，区分当前页面是首页的还是业务
            if(localStorage.footerIndex == 0){
                getMenuList('01',allMenu);
            }
            if(localStorage.footerIndex == 1){
                getMenuList('02',allMenu);
            }
            $("#tosttop").removeClass('y100');
        }
    })

    //点击权限弹出层 关闭按钮
    $('body').hammer().on('tap','#tost_cancel',function (event) {
        event.stopPropagation();
        $("#tosttop").addClass('y100');
    })
    //点击某个 权限
    $('body').hammer().on('tap','.tost_title_list',function (event) {
        event.stopPropagation();
        if(!$(this).hasClass('addcheck')){
            $(this).addClass('addcheck');
        }else {
            $(this).removeClass('addcheck');
        }
    })

    //点击权限弹出层 确定按钮
    $('body').hammer().on('tap','#tost_true',function (event) {
        event.stopPropagation();
        var isaddlen = $("#tosttop_cont").find('.addcheck').length;
        //区分 首页 还是 业务的处理
        if(localStorage.footerIndex == 0){
            if(isaddlen == 0){
                $("#tosttop").addClass('y100');
            }else if(isaddlen> 4){
                wfy.alert("首页最多添加四个常用按钮");
            } else {
                strArr=[];
                $('#tosttop_cont .addcheck').each(function () {
                    var xtckdm = $(this).attr('data-xtckdm');
                    strArr.push(xtckdm);
                })
                menuAdd(strArr.toString(),'01',function () {
                    getMenuList('01',checkMenu)
                });
            }
        }
        if(localStorage.footerIndex == 1){
            strArr=[];
            $('#tosttop_cont .addcheck').each(function () {
                var xtckdm = $(this).attr('data-xtckdm');
                strArr.push(xtckdm);
            })
            menuAdd(strArr.toString(),'02',function () {
                getMenuList('02',menuCreate)
            });
        }

    })

    //点击销售额、销量跳转页面--销售业绩；点击欠款跳转页面--客户欠款
    $('body').hammer().on('tap','.tapskip',function (event) {
        event.stopPropagation();
        var url = $(this).attr('data-page');
        if(url=="qry_arrears"){
            localStorage.isSingleQry="Y";
        }
        wfy.pagegoto("../worktable/"+url);
    });

    /*-------------------------------------------------------three--------------------------------------*/
    //页面跳转
    $('body').hammer().on('tap','.node_tap',function (event) {
        event.stopPropagation();
        var url = $(this).attr('data-url');
        if(url){
            if(url=="accounts"||url=="setting"||url=="qry_bill"||url=="address"||url=="repairs"||url=="suggest" || url == "ServiceTracking" || url == 'tally'){
                localStorage.shitpage = url;
                wfy.pagegoto("../mine/"+url);
            }else if(url=="login"){
                wfy.confirm("是否退出登录？",function () {
                    localStorage.isquit='Y';
                    wfy.pagegoto("../home/"+url);
                },function () {
                });
            }else{
                wfy.alert("功能未开放");
            }

        }
    });
    getUserInfo();
    //----------------------搜索----------------
    //点击搜索
    $('body').hammer().on('tap','#search_head',function (event) {
        event.stopPropagation();
        $('#searchBox').removeClass('y100');
        if(localStorage.seararr){
            seararr = JSON.parse(localStorage.seararr);
        }else{
            seararr =[];
        }
        if(seararr.length !=0){
            if(seararr.length > 9){
                for(var i = 0; i<9;i++){
                    searhtml += '<li>'+seararr[i]+'</li>'
                }
            }else {
                for(var i = 0; i<seararr.length;i++){
                    searhtml += '<li>'+seararr[i]+'</li>'
                }
            }
        }
        $('#se_hislo').html(searhtml);
        $('#se_hislo,.se_coum').removeClass('none')
        $('#kehu_list').html('').addClass('none');
        setTimeout(function () {
            $('#search').focus();
        },200)
    })
    //关闭搜索
    $('body').hammer().on('tap','.header_search_right',function (event) {
        event.stopPropagation();
        searhtml = '';
        $('#search').val('').blur();
        $('#se_hislo').html("");
        $('#searchBox').addClass('y100');
    })
    //清除记录
    $('body').hammer().on('tap','#del_se_coum',function (event) {
        event.stopPropagation();
        $('#se_hislo').html("");
        localStorage.seararr = [];
    })
    //点击记录
    $('body').hammer().on('tap','#se_hislo li',function (event) {
        event.stopPropagation();
        $('#search').val($(this).html());
        indexSearch($(this).html(),function (res) {
            doProdList(res);
        });
    })
    //监控input的搜索
    $("#search").on('keypress',function(e) {
        var keycode = e.keyCode;
        var searchName = $(this).val();
        if(keycode=='13') {
            e.preventDefault();
            //请求搜索接口
            if(!seararr.val_in_array(searchName) && searchName != ''){
                seararr.unshift(searchName);
                localStorage.seararr = JSON.stringify(seararr);
            }
            indexSearch(searchName,function (res) {
                doProdList(res);
            });
        }
    });
    //监控input的输入
    $('#search').bind('input propertychange', function() {
        var searchName = $(this).val();
        if(searchName ==''){
            searhtml = '';
            if(seararr.length !=0){
                if(seararr.length > 9){
                    for(var i = 0; i<9;i++){
                        searhtml += '<li>'+seararr[i]+'</li>'
                    }
                }else {
                    for(var i = 0; i<seararr.length;i++){
                        searhtml += '<li>'+seararr[i]+'</li>'
                    }
                }
            }
            $('#se_hislo').html(searhtml);
            $('#se_hislo,.se_coum').removeClass('none')
            $('#kehu_list').html('').addClass('none');
        }else {
            indexSearch(searchName,function (res) {
                doProdList(res);
            });
        }
    });
    //点击搜索内容 区详细
    $('body').hammer().on('tap','#kehu_list li',function (event) {
        event.stopPropagation();
        var wpks = $(this).attr('data-ksdm');
        indexSearchDtl(wpks);
    })
    //点击搜索内容 详细的返回
    $('body').hammer().on('tap','#sear_back',function (event) {
        event.stopPropagation();
        $('#searchCont').addClass('x100');
    })
})
//处理上面过程 获取的 款式列表
var doProdList = function (res) {
    var html ='';
    if(res.length != 0){
        for(var i = 0; i<res.length;i++){
            html +=' <li data-ksdm="'+res[i].xtwpks+'">'+
                '<div class="gx_list_1_cont">'+
                '<div class="gx_list_1_cont_img">' +
                '<img src="'+wfy.loadingimg+'" alt="" id="td'+i+'"/>'+
                '</div>'+
                '<div class="gx_list_1_cont_item">'+
                '<div>'+res[i].xtwpks+'</div>'+
                '<div>'+res[i].xtwpmc+'</div>'+
                '<div class="checknum none">已选(<span>'+0+'</span>)件</div>'+
                '</div>'+
                '</div>'+
                '</li>';
            wfy.imgload(res[i].xtwplj,"#td"+i);
        }
    }else {
        html = wfy.zero('搜索结果为空');
    }
    $('#se_hislo,.se_coum').addClass('none')
    $('#kehu_list').html(html).removeClass('none');
}

//获取所有的权限按钮
//其中 参数是y的表示已经 添加了
var getMenuList = function (para,callback) {
    var vBiz = new FYBusiness("biz.home.menubutton.qry");

    var vOpr1 = vBiz.addCreateService("svc.home.menubutton.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.home.menubutton.qry");
    vOpr1Data.setValue("AS_XTPTLB",para);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var menuRows=vOpr1.getResult(d,"AC_MENULIST").rows;
            //console.log(menuRows);
            var menu = [];
            for (var i = 0; i < menuRows.length; i++) {
                if( posarr.val_in_array(menuRows[i].xtckdm)){
                    menu.push(menuRows[i]);
                }
            }
            //console.log(menu);
            if(typeof callback === 'function'){
                callback(menu)
            }
        } else {
            $.alert("数据查询失败！");
        }
    }) ;
}
//获取对应的url 地址
function getMenuUrl(xtgndm) {
    for(var i = 0; i<menuListArr.length;i++){
        if(xtgndm == menuListArr[i].menucode){
            return menuListArr[i].pagecode
        }
    }
}

//当前用户删除按钮
var  menuDel= function (AS_XTGNDM,AS_XTPTLB,callback){
    var vBiz = new FYBusiness("biz.worktable.menu.del");
    var vOpr1 = vBiz.addCreateService("svc.worktable.menu.del", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.worktable.menu.del");
    vOpr1Data.setValue("AS_XTGNDM",AS_XTGNDM);
    vOpr1Data.setValue("AS_XTPTLB",AS_XTPTLB);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            //wfy.alert("删除成功！");
            setTimeout(function () {
                if(typeof callback === 'function'){
                    callback();
                }
            },100)
        } else {
            wfy.alert("删除失败！");
        }
    }) ;
}
//当前用户添加的按钮
var menuAdd = function(AS_XTGNDM,AS_XTPTLB,callback){
    var vBiz = new FYBusiness("biz.worktable.menu.add");

    var vOpr1 = vBiz.addCreateService("svc.worktable.menu.add", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.worktable.menu.add");
    vOpr1Data.setValue("AS_XTGNDM",AS_XTGNDM); //编码
    vOpr1Data.setValue("AS_XTPTLB",AS_XTPTLB);//类型 01 02
    vOpr1Data.setValue("AS_XTTBYS","");

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            //wfy.alert("添加成功！");
            $("#tosttop").addClass('y100');
            setTimeout(function () {
                if(typeof callback === 'function'){
                    callback();
                }
            },100)
        } else {
            wfy.alert("添加失败！");
        }
    }) ;
}
//处理所有的图标(弹出显示所有的有权限的)
function allMenu(m) {
    var menu = m || [];
    var html="";
    if(menu.length == 0){
        html= '该用户暂无权限功能';
    }else {
        html +='<div class="tost_title">【<span style="padding: 0 10px">'+menu[0].xtmkmc+'</span>】</div>';
        if(menu[0].addstatus =="Y"){
            html+= '<div class=" tost_title_list addcheck" data-xtckdm="'+menu[0].xtckdm+'"><div style="color:'+menu[0].xttbys+';"><svg class="symbol" aria-hidden="true"><use xlink:href="'+menu[0].xtcktb+'"></use></svg></div><p>'+menu[0].xtckmc+'</p></div>';
        }else {
            html+= '<div class="tost_title_list" data-xtckdm="'+menu[0].xtckdm+'"><div style="color:'+menu[0].xttbys+';"><svg class="symbol" aria-hidden="true"><use xlink:href="'+menu[0].xtcktb+'"></use></svg></div><p>'+menu[0].xtckmc+'</p></div>';
        }
        for(var i = 1;i<menu.length; i++){//先把第一个 加上，for循环从第二个开始
            if(menu[i].xtmkmc != menu[i-1].xtmkmc){
                html +='<div class="tost_title">【<span style="padding: 0 10px">'+menu[i].xtmkmc+'</span>】</div>';
                if(menu[i].addstatus =="Y"){
                    html+= '<div class=" tost_title_list addcheck" data-xtckdm="'+menu[i].xtckdm+'"><div style="color:'+menu[i].xttbys+';"><svg class="symbol" aria-hidden="true"><use xlink:href="'+menu[i].xtcktb+'"></use></svg></div><p>'+menu[i].xtckmc+'</p></div>';
                }else {
                    html+= '<div class="tost_title_list" data-xtckdm="'+menu[i].xtckdm+'"><div style="color:'+menu[i].xttbys+';"><svg class="symbol" aria-hidden="true"><use xlink:href="'+menu[i].xtcktb+'"></use></svg></div><p>'+menu[i].xtckmc+'</p></div>';
                }
            }else {
                if(menu[i].addstatus =="Y"){
                    html+= '<div class="tost_title_list addcheck" data-xtckdm="'+menu[i].xtckdm+'"><div style="color:'+menu[i].xttbys+';"><svg class="symbol" aria-hidden="true"><use xlink:href="'+menu[i].xtcktb+'"></use></svg></div><p>'+menu[i].xtckmc+'</p></div>';
                }else {
                    html+= '<div class="tost_title_list" data-xtckdm="'+menu[i].xtckdm+'"><div style="color:'+menu[i].xttbys+';"><svg class="symbol" aria-hidden="true"><use xlink:href="'+menu[i].xtcktb+'"></use></svg></div><p>'+menu[i].xtckmc+'</p></div>';
                }
            }
        }
    }
    //html +='<div class="tost_title_list">'+menu[menu.length].xtmkmc+'</div>';
    $("#tosttop_cont").html(html);
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
            var result = vOpr1.getResult(d, "AC_RESULT_CORR").rows || [];//获取公司名
            storeArr = vOpr2.getResult(d, "AC_RESULT_SHOP").rows || [];//获取店铺名
            $('#storeName').html(wfy.cutstr(storeArr[0].mdmc,4));
            if(storeArr.length == 1){
                localStorage.mddm=storeArr[0].mddm;
                $('#storeName').html(wfy.cutstr(storeArr[0].mdmc,4));
                $('#storeName').removeClass('daosji')
            }
            //所有店铺公司拼接字符串--在我的账单中使用
            var temparr=[];
            for(var i=0;i<storeArr.length;i++){
                temparr.push(storeArr[i].mddm);
            }
            localStorage.storeArrStr = temparr.join();
            //获取客流量
            getPassengerFlow(temparr.join());
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}

//处理 选择店铺
function doStore(arr) {
    //var list = '<div class="item" style="text-align: center" data-wldm="">全部</div>';
    var list = "";
    for(var i = 0; i<arr.length; i++){
        list +='<div class="item" style="text-align: center" data-wldm="'+arr[i].mddm+'">'+arr[i].mdmc+'</div>';
    }
    $('#storeBox').html(list);
    wfy.openWin('storeBox');
}

//获取主页表头信息(数据)
function getHomeHeadMes(AS_MDDM) {
    wfy.showload();
    var vBiz = new FYBusiness("biz.home.businessinfo.qry");

    var vOpr1 = vBiz.addCreateService("svc.home.salesum.qry", false);//首页-销售额
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.home.salesum.qry");
    vOpr1Data.setValue("AS_MDDM", AS_MDDM);

    var vOpr2 = vBiz.addCreateService("svc.home.saleqty.qry", false);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.home.saleqty.qry");
    vOpr2Data.setValue("AS_MDDM",AS_MDDM);

    var vOpr3 = vBiz.addCreateService("svc.home.orderqty.qry", false);//订单数
    var vOpr3Data = vOpr3.addCreateData();
    vOpr3Data.setValue("AS_USERID", LoginName);
    vOpr3Data.setValue("AS_WLDM", DepartmentCode);
    vOpr3Data.setValue("AS_FUNC", "svc.home.orderqty.qry");
    vOpr3Data.setValue("AS_MDDM", AS_MDDM);

    var vOpr4 = vBiz.addCreateService("svc.home.stockqty.qry", false);//库存数
    var vOpr4Data = vOpr4.addCreateData();
    vOpr4Data.setValue("AS_USERID", LoginName);
    vOpr4Data.setValue("AS_WLDM", DepartmentCode);
    vOpr4Data.setValue("AS_FUNC", "svc.home.stockqty.qry");
    vOpr4Data.setValue("AS_MDDM", AS_MDDM);

    var vOpr5 = vBiz.addCreateService("svc.home.stockcost.qry", false);//库存成本
    var vOpr5Data = vOpr5.addCreateData();
    vOpr5Data.setValue("AS_USERID", LoginName);
    vOpr5Data.setValue("AS_WLDM", DepartmentCode);
    vOpr5Data.setValue("AS_FUNC", "svc.home.stockcost.qry");
    vOpr5Data.setValue("AS_MDDM", AS_MDDM);

    var vOpr6 = vBiz.addCreateService("svc.home.daysalableqty.qry", false);//首页-日畅销量
    var vOpr6Data = vOpr6.addCreateData();
    vOpr6Data.setValue("AS_USERID", LoginName);
    vOpr6Data.setValue("AS_WLDM", DepartmentCode);
    vOpr6Data.setValue("AS_FUNC", "svc.home.daysalableqty.qry");
    vOpr6Data.setValue("AS_MDDM", AS_MDDM);

    var vOpr7 = vBiz.addCreateService("svc.home.weeksalableqty.qry", false);//首页-周畅销量
    var vOpr7Data = vOpr7.addCreateData();
    vOpr7Data.setValue("AS_USERID", LoginName);
    vOpr7Data.setValue("AS_WLDM", DepartmentCode);
    vOpr7Data.setValue("AS_FUNC", "svc.home.weeksalableqty.qry");
    vOpr7Data.setValue("AS_MDDM", AS_MDDM);

    var vOpr8 = vBiz.addCreateService("svc.common.appnotice.qry", false);
    var vOpr8Data = vOpr8.addCreateData();
    vOpr8Data.setValue("AS_USERID", LoginName);
    vOpr8Data.setValue("AS_WLDM", DepartmentCode);
    vOpr8Data.setValue("AS_FUNC", "svc.common.appnotice.qry");

    var vOpr9 = vBiz.addCreateService("svc.home.cusarrears.qry", false);
    var vOpr9Data = vOpr9.addCreateData();
    vOpr9Data.setValue("AS_USERID", LoginName);
    vOpr9Data.setValue("AS_WLDM", DepartmentCode);
    vOpr9Data.setValue("AS_FUNC", "svc.home.cusarrears.qry");
    vOpr9Data.setValue("AS_MDDM", AS_MDDM);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.log(JSON.stringify(ip))
    console.log(DepartmentCode)
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            wfy.hideload();
            // todo...daySaleNum,weekSaleNum
            var res1 = vOpr1.getResult(d, "AC_RESULT_SALESUM").rows || [];//首页-销售额
            var res2 = vOpr2.getResult(d, "AC_RESULT_SALEQTY").rows || [];//首页-销量
            var res3 = vOpr3.getResult(d, "AC_RESULT_ORDERQTY").rows || [];//订单数
            var res4 = vOpr4.getResult(d, "AC_RESULT_STOCKQTY").rows || [];//库存数
            var res5 = vOpr5.getResult(d, "AC_RESULT_STOCKCOST").rows || [];//库存成本
            daySaleNum = vOpr6.getResult(d, "AC_RESULT_SALABLEQTY").rows || [];//首页-日畅销量
            weekSaleNum = vOpr7.getResult(d, "AC_RESULT_SALABLEQTY").rows || [];//首页-周畅销量
            var res8 = vOpr8.getResult(d, "AC_RESULT").rows || [];//首页-公告查询
            var res9 = vOpr9.getResult(d, "AC_RESULT_ORDERQTY").rows || [];//首页-欠款
            wfy.empty(daySaleNum) ? daySaleNum= [{'salableqty':0,'xtwpmc':'暂无数据'}] : daySaleNum;
            wfy.empty(weekSaleNum) ? weekSaleNum= [{'salableqty':0,'xtwpmc':'暂无数据'}] : weekSaleNum;
            $("#saleNum").html(wfy.setTwoNum(res1[0].summoney));
            $('#countSell').html(res2[0].sumqty);//销量
            //$('#orderAll').html(res3[0].orderqty);//订单数

            if(Number(res4[0].stockqty)<0){
                if(Number(res4[0].gszcsl)!=0){
                    //$('#stockCount').html('<span style="color:red">'+res4[0].stockqty+'</span><span style="font-size: 13px;">(含托管仓'+res4[0].gszcsl+')件</span>');//库存
                    $(".home_title_num").attr("style","height:70px;");
                    $('#stockCount').html('<span style="color:red">'+res4[0].stockqty+'</span>');//库存
                    $("#stockshow").html("含托管仓"+res4[0].gszcsl+"件");
                    $("#stockshow").removeClass("none");
                }else{
                    $(".home_title_num").attr("style","height:60px;");
                    $('#stockCount').html('<span style="color:red">'+res4[0].stockqty+'</span>');//库存
                    $("#stockshow").addClass("none");
                }

            }else{
                if(Number(res4[0].gszcsl)!=0) {
                    //$('#stockCount').html(res4[0].stockqty+'<span style="font-size: 13px;">(含托管仓'+res4[0].gszcsl+')件</span>');//库存
                    $(".home_title_num").attr("style","height:70px;");
                    $('#stockCount').html(res4[0].stockqty);//库存
                    $("#stockshow").html("含托管仓"+res4[0].gszcsl+"件");
                    $("#stockshow").removeClass("none");
                }else{
                    $(".home_title_num").attr("style","height:60px;");
                    $('#stockCount').html(res4[0].stockqty);//库存
                    $("#stockshow").addClass("none");
                }
            }
            $('#stockPrice').html(wfy.setTwoNum(res5[0].stockcost));//库存成本


            if(Number(res9[0].sumarrears)<0){
                $('#orderAll').html('<span style="color:red">'+res9[0].sumarrears+'</span>');//欠款
            }else{
                $('#orderAll').html(res9[0].sumarrears);//欠款
            }
            var tohtml='';
            //生成公告显示栏
            for(var i=0;i<res8.length;i++){
                tohtml+='<span data-code="'+res8[i].xtggxh+'" data-content="'+res8[i].ggnrxq+'">'+res8[i].xtggnr+'</span>'
            }

            $("#tip").html(tohtml);
            //处理表格信息

            doChartMess(daySaleNum,'chart_day');
            doChartMess(weekSaleNum,'chart_week');
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}

//获取客流量
function getPassengerFlow(str) {
    var params={"stores": str};
    $.ajax({
        type: 'POST',
        url: _wfy_passenger_flow_url,
        contentType: 'application/json',
        async: true,
        data: JSON.stringify(params),
        success: function (msg) {
            if (msg.errorcode=="0") {
                $("#passenger").html(msg.keliuNum || 0);
            }
        },
        error: function (info) {
            wfy.alert("连接失败！\n" + "网络错误，请稍后再试。");
        }
    });
}

//处理 表格显示数据
function doChartMess(arr,id) {
    var xData = [];
    var yData = [];
    for(var i=0;i<arr.length;i++){
        xData.push(arr[i].xtwpmc);
        yData.push(arr[i].salableqty);
    }
    var labels = [];
    if(xData.length > 8){
        for (var i = 0; i < 8; i++) {
            labels.push(wfy.cutstr(xData[i],8));
        }
    }else {
        for (var i = 0; i < xData.length; i++) {
            labels.push(wfy.cutstr(xData[i],8));
        }
    }

    var datasets = [];
    for (var j = 0; j < yData.length; j++) {
        datasets.push(+yData[j] || 0);
    }
    var conf = {
        labels: labels,
        datasets: [{
            fillColor: 'rgba(255,185,0,1)',
            strokeColor: "rgba(255,185,0,1)",
            data: datasets
        }]
    };
    var dom = $("#chartBox");
    if(id == 'chart_day'){
        dom.children("#chart_day").remove();
        dom.append("<canvas class='' id=\"chart_day\" width=\"100%\"></canvas>");
        var ctx = dom.children("#chart_day")[0].getContext("2d");
    }
    if(id == 'chart_week'){
        dom.children("#chart_week").remove();
        dom.append("<canvas class='none' id=\"chart_week\" width=\"100%\"></canvas>");
        var ctx = dom.children("#chart_week")[0].getContext("2d");
    }
    new Chart(ctx).Bar(conf, {
        scaleFontSize: 12,
        barValueSpacing: 8,
        animationSteps: 8,
    });
}

function drawChart(xData, yData,id) {//根据信息画出图表
    xData = xData || [];
    yData = yData || [];
    var colorData =[]
    var labels = [];
    if(xData.length > 8){
        for (var i = 0; i < 8; i++) {
            labels.push(wfy.cutstr(xData[i],8));
        }
    }else {
        for (var i = 0; i < xData.length; i++) {
            labels.push(wfy.cutstr(xData[i],8));
        }
    }

    var datasets = [];
    for (var j = 0; j < yData.length; j++) {
        datasets.push(+yData[j] || 0);
    }
    var conf = {
        labels: labels,
        datasets: [{
            fillColor: 'rgba(255,185,0,1)',
            strokeColor: "rgba(255,185,0,1)",
            data: datasets
        }]
    };
    var dom = $("#chartBox");
    // dom.children("#chart").remove();
    // dom.append("<canvas id=\"chart\" width=\"100%\"></canvas>");
    if(id == 'chart_day'){
        var ctx = dom.children("#chart_day")[0].getContext("2d");
    }
    if(id == 'chart_week'){
        var ctx = dom.children("#chart_week")[0].getContext("2d");
    }
    new Chart(ctx).Bar(conf, {
        scaleFontSize: 12,
        barValueSpacing: 8,
        animationSteps: 8,
    });

}

//处理 回调获取的菜单
function checkMenu(m) {
    $("#footTable").html("");
    var menu = m || [];
    menuDom ='';
    for (var i = 0; i < menu.length; i++){
        if(menu[i].addstatus =="Y"){
            menuDom +='<div class="footTable_dv" data-czmc ="'+menu[i].xtckmc+'" data-icon="'+menu[i].xtcktb+'" ' +
                'data-xtgndm="'+menu[i].xtckdm+'" data-url="'+getMenuUrl(menu[i].xtckdm)+'">'+
                '<div class="footTable_dvt" style="background-color:'+menu[i].xttbys_a+'">'+
                '<span><svg class="symbol" aria-hidden="true">'+
                '<use xlink:href="'+menu[i].xtcktb+'"></use>'+
                '</svg>'+
                '</span>'+
                '</div>'+
                '<div class="footTable_dvb">'+menu[i].xtckmc+' </div>'+
                '</div>';
        }
    }
    $("#footTable").html(menuDom);
    //补齐剩余的
    len = $("#footTable .footTable_dv").length;//已经存在的个数
    var addLen = 4 -len;
    var addHtml ='';
    for(var x = 0; x < addLen; x++){
        addHtml +='<div class="footTable_dv index_footTable_dv" data-i="'+x+'">'+
            '<div class="footTable_dvt bor">'+
            '<span>&#xe6b9</span>'+
            '</div>'+
            '<div class="footTable_dvb">'+
            '添加功能'+
            '</div>'+
            '</div>'
    }
    $("#footTable").html(menuDom + addHtml);

    //长按 删除(验证只有在 有按钮的时候才能删除)
    $('.footTable_dvt').longPress(function(s){
        //do something...
        var xtgndm = $(s).parent('.footTable_dv').attr('data-xtgndm');
        if(xtgndm){
            wfy.confirm("您确定要删除",function () {
                menuDel(xtgndm,"01",function () {
                    getMenuList('01',checkMenu)
                });
            },function () {

            })
        }
    });
}
//生成页面
function menuCreate(menuArr){
    $("#tap_table").html('');
    var htmlStr="";
    var menu = menuArr || [];
    for (var i = 0; i < menu.length; i++){
        if(menu[i].addstatus =="Y"){
            htmlStr +='<div class="footTable_dv" data-czmc ="'+menu[i].xtckmc+'" data-icon="'+menu[i].xtcktb+'" ' +
                'data-xtgndm="'+menu[i].xtckdm+'" data-url="'+getMenuUrl(menu[i].xtckdm)+'">'+
                '<div class="footTable_dvt" style="background-color:'+menu[i].xttbys_a+'">'+
                '<span><svg class="symbol" aria-hidden="true">'+
                '<use xlink:href="'+menu[i].xtcktb+'"></use>'+
                '</svg>'+
                '</span>'+
                '</div>'+
                '<div class="footTable_dvb">'+menu[i].xtckmc+' </div>'+
                '</div>';
        }
    }
    var addHtml ='';
    addHtml +='<div class="footTable_dv" data-i="'+1+'">'+
        '<div class="footTable_dvt bor">'+
        '<span>&#xe6b9</span>'+
        '</div>'+
        '<div class="footTable_dvb do_footTable_dvb">'+
        '添加功能'+
        '</div>'+
        '</div>';
    $("#tap_table").html(htmlStr+addHtml);

    wfy.tap(".menu_btn",function (d) {
        var pagename=$(d).attr("data-url");
        if(!wfy.empty(pagename)){
            wfy.goto("../worktable/"+pagename);
        }else{
            alert("功能正在开发，敬请期待");
        }

    });
}
function getUserInfo() {
    var vBiz = new FYBusiness('biz.emp.empwithcorr.qry');
    var vOpr1 = vBiz.addCreateService('svc.emp.empwithcorr.qry', true);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue('AS_USERID', LoginName);
    vOpr1Data.setValue('AS_WLDM', DepartmentCode);
    vOpr1Data.setValue('AS_FUNC', 'svc.emp.empwithcorr.qry');

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {

        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var res = vOpr1.getResult(d, 'AC_RESULT_CORR').rows || [];
            var row=res[0];
            //createShowList(res);
            var htmlStr='<div class="mine_name">'+row.xtwlmc+'</div><div class="mine_line"><p>账号：<i>'+row.xtyhdm+'</i></p><p>有效天数：<i>'+(wfy.empty(row.xtsyts)?'':row.xtsyts)+'</i></p></div>'+
                '<div class="mine_line"><p>岗位：<i>'+getValidStr(row.xtyzmc)+'</i></p><p>品牌：<i>'+getValidStr(row.brandname)+'</i></p></div>';

            $("#userInfo").html(htmlStr);

        }else{
            var htmlStr='<div class="mine_name">--</div><div class="mine_line"><p>账号：<i>--</i></p><p>有效天数：<i>--</i></p></div>'+
                '<div class="mine_line"><p>岗位：<i>--</i></p><p>品牌：<i>--</i></p></div>';

            $("#userInfo").html(htmlStr);
        }
    });
}


function indexSearch(AS_KEYWORD,callback) {
    var vBiz = new FYBusiness("biz.common.keywordsearch.list.qry");
    var vOpr1 = vBiz.addCreateService("svc.common.keywordsearch.list.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID",LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.common.keywordsearch.list.qry");
    vOpr1Data.setValue("AS_KEYWORD", AS_KEYWORD);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo... AC_RESULT
            var res = vOpr1.getResult(d, 'AC_RESULT').rows || [];
            if(typeof callback === 'function'){
                callback(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    })
}
function indexSearchDtl(AS_XTWPKS) {
    var vBiz = new FYBusiness("biz.common.keywordsearch.dtl.qry");
    var vOpr1 = vBiz.addCreateService("svc.common.keywordsearch.dtl.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.common.keywordsearch.dtl.qry");
    vOpr1Data.setValue("AS_XTWPKS", AS_XTWPKS);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo... AC_RESULT
            var res = vOpr1.getResult(d, 'AC_RESULT').rows || [];
            var res_stock=vOpr1.getResult(d, 'AC_STOCK').rows || [];

            var html ='';
            var url = wfy.empty(res[0].xtwplj) ? "../../public/img/onerror.png":_wfy_pic_ip+res[0].xtwplj;
            html +='<div class="gx_list_1_cont_another">'+
                        '<div class="gx_list_1_cont_img">' +
                          '<img src="'+url+'" alt=""/>'+
                        '</div>'
            html +='</div>';
            html +='<div style="line-height: 34px;text-align: left;text-indent: 12px;font-size:15px;color: blue;">商品信息</div> ';
            html +='<div class="wfyitem_list">' +
                        '<div class="wfyitem_line">'+
                           '<span class="fl tl">商品款式：'+res[0].xtwpks+'</span> ' +
                        '</div> ' +
                        '<div class="wfyitem_line tl"> ' +
                            '<span>名称：'+wfy.cutstr(res[0].xtwpmc,50)+'</span>' +
                        '</div>' +
                        '<div class="wfyitem_line tl"> ' +
                            '<span>零售价：￥'+res[0].wpxsdj+'</span>' +
                        '</div>' +
                    '</div>';


            html +='<div style="line-height: 34px;text-align: left;text-indent: 12px;font-size:15px;color: blue;">销售明细</div> ';
            html +='<div class="wfyitem_list">' +
                '<div class="wfyitem_line tl">'+
                '<span class="fl" style="width: 50%;">库存数：'+getValidStr(res[0].kckcsl)+'</span> ' +
                '</div> ' +
                '<div class="wfyitem_line tl"> ' +
                '<span class="" style="width: 10%">进货数：'+getValidStr(res[0].kcjhsl)+'</span>' +
                '<span class="fr" style="width: 50%;">销售数：'+getValidStr(res[0].kcxssl)+'</span>' +
                '</div>' +
                '</div>';

            if(res_stock.length>0){
                html +='<div style="background-color: #f2f2f2;height: 5px;"></div> ';
                html +='<div style="line-height: 34px;text-align: left;text-indent: 12px;font-size:15px;color: blue;border-bottom: #d9d9d9 solid 1px">库存明细</div> ';

                var preShop="";
                var calnum=0;
                for(var i=0;i<res_stock.length;i++){
                    var nowShop=res_stock[i].xtwldm;

                    if(preShop!=nowShop){
                        if(preShop!=""){
                            html +='</div>';
                        }

                        preShop=nowShop;

                        html +='<div style="line-height: 34px;text-align: left;text-indent: 12px;color: #000">'+res_stock[i].xtwlmc+'</div> ';
                        html +='<div class="wfyitem_list">'+
                            '<div class="wfyitem_line tl">'+
                            '<span class="fl" style="width: 35%;">颜色：'+res_stock[i].xtysmc+'</span> ' +
                            '<span class="" style="width: 30%;">尺码：'+res_stock[i].xtwpxh+'</span> ' +
                            '<span class="fr" style="width: 30%;">库存：'+res_stock[i].kckcsl+'</span> ' +
                            '</div> ';
                    }else{
                        html +='<div class="wfyitem_line tl">'+
                            '<span class="fl" style="width: 35%;">颜色：'+res_stock[i].xtysmc+'</span> ' +
                            '<span class="" style="width: 30%;">尺码：'+res_stock[i].xtwpxh+'</span> ' +
                            '<span class="fr" style="width: 30%;">库存：'+res_stock[i].kckcsl+'</span> ' +
                            '</div> ';
                    }


                }

                html+='</div>';

            }

            $('#seadtl').html(html);
            $('#searchCont').removeClass('x100');
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    })
}
//我的钱包 和 我的账单 权限判断 是否显示
var minemenu= function() {
    var vBiz = new FYBusiness("biz.mine.menubutton.qry");
    var vOpr1 = vBiz.addCreateService("svc.mine.menubutton.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID",LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.mine.menubutton.qry");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo... AC_MENULIST
            var res = vOpr1.getResult(d, 'AC_MENULIST').rows || [];
            console.log(res)
            for(var i=0;i<res.length;i++){
                if(res[i].xtckmc == "我的钱包"){
                    $('.cell_list_3_item[data-url="wallet"]').removeClass('none');
                }
                if(res[i].xtckmc == "我的账单"){
                    $('.cell_list_3_item[data-url="qry_bill"]').removeClass('none');
                }
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}