/**
 * Created by WFY02 on 2017/11/10.
 */
/**
 * Created by WFY02 on 2017/11/9.
 */
wfy.opensearch = function (s) {
    $("#cover").removeClass("none");
    $("#" + s).removeClass("y_100");
}
wfy.closesearch = function () {
    $("#cover").addClass("none");
    $(".selectTopBox").addClass("y_100");
}
var pageIndex=1,loading=false;
var type = 0;//查询类型 默认为0 查询店员业绩
var begintime = new Date().format("yyyy-MM-dd") ;
var endtime = new Date().format("yyyy-MM-dd");
var mddm = "";
var sl='';
var je='';
var zt = 'table';//状态
$(function () {
    $("#begin").val(new Date().format("yyyy-MM-dd"));
    $("#end").val(new Date().format("yyyy-MM-dd"));
    wfy.init();
    if(document.getElementById("cover"))
    //查询类型切换
        $('body').hammer().on('tap','#stock_head li',function (event) {
            event.stopPropagation();

            $("#searlist").html("");
            pageIndex=1;
            $("#scrollload").addClass("none");

            $('#stock_head li').removeClass('sale_che');
            $(this).addClass('sale_che');
            type = $(this).index();
            list(mddm,type+1);
        })
    list(mddm,type+1);
    //点击搜索 stock_head
    wfy.tap('#modles',function (_this) {
        //依据 查询类型 展示不同的输入条件
        wfy.opensearch('search');
    });
    //  x清除
    $('body').hammer().on('tap','.topSearchBox li .delethis',function (event) {
        event.stopPropagation();
        $(this).prev().val('');

        if(getValidStr($(this).prev().attr("id"))=="md"){
            mddm="";
        }

    })
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

        mddm="";
    })
    //  选择 门店
    $('body').hammer().on('tap','#md',function (event) {
        event.stopPropagation();
        getShopName();
    })
    // 查询
    $('body').hammer().on('tap','#searbtn',function (event) {
        event.stopPropagation();
        $("#searlist").html("");
        pageIndex=1;
        $("#scrollload").addClass("none");

        begintime =  $("#begin").val();
        endtime = $("#end").val();
        $('input').blur();
        if(endtime < begintime){
            wfy.alert('开始时间不能晚于结束时间');
            return false;
        }
        wfy.closesearch();
        list(mddm,type+1)
    })
    //图表--切换
    $('body').hammer().on('tap','#table',function (event) {//表
        event.stopPropagation();

        $('#img').removeClass('color_red');
        $(this).addClass('color_red');
        zt = 'table';
        $('#cont').show();
        $('#canvasDiv').hide();
    })
    $('body').hammer().on('tap','#img',function (event) {//图
        event.stopPropagation();

        $('#table').removeClass('color_red');
        $(this).addClass('color_red');
        zt ='img';
        $('#cont').hide();
        $('#canvasDiv').show();
    })
})
function list(mddm,types) {
    var vBiz = new FYBusiness("biz.sawork.saleperformance.qry");
    var vOpr1 = vBiz.addCreateService("svc.sawork.saleperformance.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.sawork.saleperformance.qry");
    vOpr1Data.setValue("AS_XTWPKS", "");//款式
    vOpr1Data.setValue("AS_XTMDDM", mddm);// 门店代码
    vOpr1Data.setValue("AS_XTMDDY", "");//店员
    vOpr1Data.setValue("AS_QSRQ", begintime);
    vOpr1Data.setValue("AS_JZRQ", endtime);
    vOpr1Data.setValue("AS_TYPE", types);//查询类型 1店员 2店铺 3热销时段 4商品
    vOpr1Data.setValue("AN_PAGE_NUM", pageIndex);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var list = vOpr1.getResult(d, "AC_RESULT").rows || [];
            sl = vOpr1.getOutputPermeterMapValue(d, "AN_SL");
            je = vOpr1.getOutputPermeterMapValue(d, "AN_JE");
            dores(list);
            switch (type){
                case 0 :
                    chart(list,true);
                    break;
                case 1:
                    chart(list,false);
                    break;
                case 2://商品 没有图表
                    $('#canvasDiv').html('<div class="tc">商品信息暂无展示图表</div>')
                    break;
                case 3:
                    chart(list,false);
                    break;
            }
        } else {
            wfy.alert(d.errorMessage)
        }
    }) ;
}
//处理数据
function dores(result) {
    var html ="";
    if( pageIndex==1 && result.length ==0){
        html = wfy.zero();
    }
    var tab1 = ['店员','数量','业绩','贡献率'];
    var tab2 = ['店铺','数量','业绩','日期'];
    var tab3 = ['编码','数量','业绩'];
    var tab4 = ['时间','数量','业绩'];
    switch (type){
        case 0:
            $('#tablehead').html('<ul class="stock_head" id="cale_tab">\
                                     <li style="width: 25%">店<i style="visibility: hidden">大</i>员</li>\
                                     <li style="width: 30%">数<i style="visibility: hidden">大</i>量</li>\
                                     <li style="width: 25%">业<i style="visibility: hidden">大</i>绩</li>\
                                     <li>贡献率</li>\
                                 </ul>');
            for (var i = 0; i < result.length; i++) {
                if(je == 0){
                    bl = 0;
                }else {
                    var bl = Math.round(result[i].kcssje / je )* 10000 / 100.00;
                }
                html +='<div class="">'+
                    '<ul class="stock_head_sell">'+
                    '<li style="text-indent: 12px;">'+wfy.visiname(result[i].xtyhxm)+'</li>'+
                    '<li style="width: 30%;text-indent: 12px;">'+(result[i].kcczsl)+'</li>'+
                    '<li>'+wfy.setTwoNum(result[i].kcssje)+'</li>'+
                    '<li style="width: 20%"><span class="line"><a class="y main_bgcolor" style="width:' + bl*(0.4) + 'px;"></a>' +
                    '</span>' + bl + '%</li>'+
                    '</ul>'+
                    '</div>';
            }
            $("#total").html('数量：<span class="main_color" style="padding-right: 20px">'+sl+'</span>'+
            '合计：<span class="main_color">'+wfy.setTwoNum(je)+'</span>');
            break;
        case 1:
            $('#tablehead').html('<ul class="stock_head" id="cale_tab">\
                                     <li  style="width: 25%">店<i style="visibility: hidden">大</i>铺</li>\
                                     <li style="width: 30%">数<i style="visibility: hidden">大</i>量</li>\
                                     <li style="width: 25%">业<i style="visibility: hidden">大</i>绩</li>\
                                     <li>日期</li>\
                                 </ul>');
            for (var i = 0; i < result.length; i++) {
                html +='<div class="">'+
                    '<ul class="stock_head_sell">'+
                    '<li style="text-indent: 12px;">'+wfy.cutstr(result[i].xtwlmc,12)+'</li>'+
                    '<li style="width: 30%;text-indent: 12px">'+result[i].kcczsl+'</li>'+
                    '<li style="width: 25%">'+wfy.setTwoNum(result[i].kcssje)+'</li>'+
                    '<li style="width: 20%">'+result[i].kcczrq+'</li>'+
                    '</ul>'+
                    '</div>';
            }
            $("#total").html('数量：<span class="main_color" style="padding-right: 20px">'+sl+'</span>' +
                '业绩：<span class="main_color">'+wfy.setTwoNum(je,2)+'</span>');
            break;
        case 2:
            $('#tablehead').html('<ul class="stock_head" id="cale_tab">\
                                     <li style="width: 40%">商品编码</li>\
                                     <li style="width: 30%">数<i style="visibility: hidden">大</i>量</li>\
                                     <li style="width: 30%">业<i style="visibility: hidden">大</i>绩</li>\
                                 </ul>');
            for (var i = 0; i < result.length; i++) {
                html +='<div class="wfyitem ">'+
                    '<ul class="stock_head_sell stock_cont">'+
                    '<li style="line-height: 30px">'+result[i].xtwpdm+'<br>' +
                    '<span style="padding-left: 12px; color: #999">'+wfy.cutstr(result[i].xtwpmc,12)+'</span></li>'+
                    '<li style="text-indent: 12px;width: 30%">'+result[i].kcczsl+'</li>'+
                    '<li>'+wfy.setTwoNum(result[i].kcssje,2)+'</li>'+
                    '</ul>'+
                    '</div>'
            }
            $("#total").html('数量：<span class="main_color" style="padding-right: 20px">'+sl+'</span>' +
                '业绩：<span class="main_color">'+wfy.setTwoNum(je,2)+'</span>');
            break;
        case 3:
            $('#tablehead').html('<ul class="stock_head" id="cale_tab">\
                                     <li style="width: 40%">时间</li>\
                                     <li style="width: 30%">数<i style="visibility: hidden">大</i>量</li>\
                                     <li style="width: 30%">业<i style="visibility: hidden">大</i>绩</li>\
                                 </ul>');
            for (var i = 0; i < result.length; i++) {
                html +='<div class="">'+
                    '<ul class="stock_head_sell">'+
                    '<li style="width: 40%;text-indent: 12px;">'+result[i].kcczrq+'</li>'+
                    '<li style="width: 30%;text-indent: 12px;">'+result[i].kcczsl+'</li>'+
                    '<li style="width: 30%;">'+wfy.setTwoNum(result[i].kcssje,2)+'</li>'+
                    '</ul>'+
                    '</div>'
            }
            $("#total").html('数量：<span class="main_color" style="padding-right: 20px">'+(sl)+'</span>' +
                '业绩：<span class="main_color">'+wfy.setTwoNum(je,2)+'</span>');
            break;
    }
    // if(zt == 'img'){
    //     $('#tablehead').hide();
    // }
    $('#searlist').append(html);

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
                    list(mddm,type+1);
                    loading = false;
                }
            },1000);
        }

    });
}
//处理表格 之 店铺的业绩
function chart(re,falg) {  //je 总计 -------- falg 选 true 是饼图-----饼图用的 ichart 插件
    var piewidth = document.body.clientWidth;
    var pieheight = document.body.clientWidth;
    if(falg){
        //将返回的结果集按总额由大到小 排序
        var color = ['#f00','#4572a7','#aa4643','#89a54e','#80699b','#3d96ae','#f60'];
        if(re.length != 0){
            var resarr = re.sort(wfy.sortBy('kcssje',false));//从大大小排列
            var data = [];
            var tol = 0;
            if(resarr.length > 6){
                for (var i = 0; i<6;i++){
                    //多余4个的从第五个开始，以后的都统一变成其他。
                    //先处理前四个
                    var bl = Math.round(re[i].kcssje / je * 10000) / 100.00;
                    data.push({name :re[i].xtyhxm,value :bl,color:color[i]});
                    tol += bl;
                }
                //其他
                var otherTotal = 0;
                for(var k = 6; k <resarr.length; k++){
                    otherTotal += resarr[k].kcssje;
                }
                var otherTotalValue = Math.round(otherTotal / je * 10000) / 100.00;
                data.push({name :"其他",value :otherTotalValue,color:color[6]})
            }else {
                for (var i = 0; i<resarr.length;i++){
                    //不足6个。有几个就显示几个
                    var bl = Math.round(re[i].kcssje / je * 10000) / 100.00;
                    data.push({name :re[i].xtyhxm,value :bl,color:color[i]})
                }
            }
            // for(var i =0 ; i<re.length;i++){
            //     var bl = Math.round(re[i].kcssje / je * 10000) / 100.00;
            //     data.push({name :re[i].xtyhxm,value :bl,color:color[i]});
            // }

            var chart = new iChart.Pie3D({
                render : 'canvasDiv',
                data: data,
                title : {
                    text : '',//饼图的标题
                    height:40,
                    fontsize : 10,
                    color : '#282828'
                },
                footnote : {
                    text : '注：由大到小显示前6名',
                    color : localStorage.color,
                    fontsize : 12,
                    padding : '0 18'
                },
                sub_option : {
                    mini_label_threshold_angle : 0,//迷你label的阀值,单位:角度
                    mini_label:{//迷你label配置项
                        fontsize:10,
                        fontweight:500,
                        color : '#ffffff'
                    },
                    label : {
                        background_color:null,
                        sign:false,//设置禁用label的小图标
                        padding:'0 0',
                        border:{
                            enable:false,
                            color:'#666666'
                        },
                        fontsize:11,
                        fontweight:600,
                        color : '#4572a7'
                    },
                    border : {
                        width : 2,
                        color : '#ffffff'
                    },
                    listeners:{
                        parseText:function(d, t){
                            return d.get('value')+"%";//自定义label文本
                        }
                    }
                },
                legend:{
                    enable:true,
                    padding:0,
                    offsetx:0,
                    offsety:110,
                    color:localStorage.color,
                    fontsize:10,//文本大小
                    sign_size:15,//小图标大小
                    line_height:10,//设置行高
                    sign_space:10,//小图标与文本间距
                    border:false,
                    align:'left',
                    background_color : null//透明背景
                },
                shadow : true,
                shadow_blur : 6,
                shadow_color : '#f60',
                shadow_offsetx : 0,
                shadow_offsety : 0,
                background_color:'#f1f1f1',
                align:'center',//右对齐
                offsetx:0,//设置向x轴负方向偏移位置60px
                offset_angle:-90,//逆时针偏移120度
                width : piewidth,
                height : pieheight,
                radius:350
            });
            chart.draw();
        }else {
            var html = wfy.zero("查询数据为空，无法展示饼图信息");
            $("#canvasDiv").html(html);
        }
    }else {
        if(re.length != 0){
            //折线图
            //ind 时间模式
            //日 周  模式 x轴 显示ii全部日期。
            //月 只显示 x轴 只显示日
            //自定义，数据过多 x轴为 空
            var data = [
                {
                    name : '北京',
                    value:[],
                    color:'#4572a7',//localStorage.color,
                    line_width:1
                }
            ];
            var labels = [];
            //数据处理 按 ind 模式划分。当中检测数据数量，如果过多。x轴名为空
            if(re.length > 6){
                for(var i = 0; i < 6; i++){
                    data[0].value.push(wfy.setTwoNum(re[i].kcssje*100/1000000,2));
                    if(type ==3){
                        labels.push(re[i].kcczrq)
                    }else {
                        labels.push(re[i].kcczrq.substring(5,10).replace('-','-'))
                    }

                }
            }else {
                for(var i = 0; i < re.length; i++){
                    data[0].value.push(wfy.setTwoNum(re[i].kcssje*100/1000000,2));
                    if(type ==3){
                        labels.push(re[i].kcczrq)
                    }else {
                        labels.push(re[i].kcczrq.substring(5,10).replace('-','-'))
                    }

                }
            }

            var chart = new iChart.Area2D({
                render : 'canvasDiv',
                data: data,
                title : '',
                width : piewidth+10,
                height : piewidth+10,
                coordinate:{
                    height:'90%',
                    background_color:'#edf8fa',
                    scale:[{
                        position:'left',
                        label:{
                            color:localStorage.color,
                            fontsize:10,
                            fontweight:100
                        },

                    },{
                        position:'bottom',
                        label:{
                            color:localStorage.color,
                            fontweight:100
                        },
                        labels:labels
                    }]
                },
                sub_option:{
                    hollow_inside:false,//设置一个点的亮色在外环的效果
                    point_size:10
                },
                footnote : {
                    text : '单位：万元',
                    color : localStorage.color,
                    fontsize : 12,
                    padding : '5 18'
                },
            });

            chart.draw();
        }else {
            var html = wfy.zero("查询数据为空，无法展示折线信息");
            $("#canvasDiv").html(html);
        }
    }
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
            var mddmarr = vOpr2.getResult(d, "AC_RESULT_SHOP").rows || [];//获取店铺名
            var html="";
            for(var i = 0 ;i < mddmarr.length; i++){
                html += '<div class="lilit" data-mddm="'+mddmarr[i].mddm+'" style="line-height: 40px;text-align: center;border-bottom: #d9d9d9 solid 1px">'+mddmarr[i].mdmc+'</div>';
            }
            wfy.ios_alert(html);
            wfy.tap('.lilit',function (that) {
                var mdmc = $(that).html();
                mddm = $(that).attr('data-mddm');
                $('#md').val(mdmc);
                wfy.ios_alert_close();
            })
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}
