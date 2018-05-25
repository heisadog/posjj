/**
 * Created by WFY02 on 2017/11/6.
 */
/**
 * Created by WFY02 on 2017/10/31.
 */
/*单据模块下公共内容
 * 1.单据（新增模式） 由bill_entry html统一入口进入。，依据 点击的入口的单据类型，读取对应的js
 * 2.
 * 3.关于选择商品，计算数量的思路规划
 *   定义data，所有的数据都存进这里， 提交保存的时候 滞空，
 *   进入一个商品 点击操作的时候，向data中 按照该商品的 款式代码 为标志，添加一条对象数据，（先判断之前存不存在！！！）
 *   然后 数量等操作！！将 数量 存入临时数据 tempdata 中。
 *   这里切换颜色，涉及到 数量切换，一个颜色值 对应一条数据。数据格式 参照 obj；
 *    执行 添加按钮 的时候将 tempdata 的数据加入data中，（需要做个验证，如有之前有数据，提示是否 覆盖或者累加之前的数据）并将tempdata数据清空
 *   关于切换颜色，
 *      这里注意几点。
 *      1.切换颜色，展示对应下的型号
 *      2、切换颜色。之前编辑过的数量依旧存在
 *      so。这个整个处理方式重新动态生成 html 进行展示
 *         第一次进来，默认展示第一个颜色下的型号，数量0. doProdDtl 函数处理的
 *         操作过好 重新从data中读取数据
 *
 * */
wfy.open = function(s) {// 重新依据需求 做一个弹窗，点击背景不能消失,只有点击添加的时候才消失
    $("#billcoverBack").removeClass("none");
    $("#" + s).removeClass("y100");
}
wfy.close = function() {
    $("#billcoverBack").addClass("none");
    $(".selectBox").addClass("y100");
}

var data=[
    // {"ksdm":"A0SEF02","name":"上衣",cont':[
    //     {'color':'白色',"price":"33",'num':'22','style':'M','sku':'DSDSDS'},
    // ]}
];//所有涉及到数量的操作
var tempdata = []//临时数据
var ksdm='';//点击商品的 款式代码，这是匹配查找数据的 依据
var ksmc ='';//商品的款式名称，后续添加，为做销售开单保存数据而添加的
var jldw = '';//计量单位
var cont =[];//读取data 中的cont内容的 容器
var objdemo ={'color':'','price':'','num':'','style':'',"sku":''}//基本数据格式
var dtlFlag=false;//明细页面标志
var wpdj = 0;//物品单价
var wppfdj = 0 ; //物品批发价格 后期新加
var proimg = '';
var salestyle = '批发';// 销售类型  新增的
var stocktaking = ["","全盘","按款抽盘","按款色抽盘",'按款色码抽盘'];
$(function () {
    //基本信息的伸缩功能   shang &#xe6a5  xia &#xe6a6
    wfy.tap('#slideup',function (that) {
        var dm = $(that).attr('data-win');
        if(dm == 'up'){
            $('#slideup').attr('data-win','down').children('i').html('&#xe6a6');
            $('.bill_head_cont').removeClass('bill_slideup').addClass('bill_slidedown');
        }
        if(dm == 'down'){
            $('#slideup').attr('data-win','up').children('i').html('&#xe6a5');
            $('.bill_head_cont').removeClass('bill_slidedown').addClass('bill_slideup');
        }
    })
    // 监测 输入框
    $("#searchpro").on('keypress',function(e) {
        var keycode = e.keyCode;
        var searchName = $(this).val();
        if(keycode=='13') {
            e.preventDefault();
            //请求搜索接口
            getProdList(searchName,function (res) {
                doProdList(res);
                $('#bill_bot_to_top').removeClass('y100');
            })
        }
    });
    //实时监测 input
    $('#searchpro').bind('input propertychange', function() {
        var searchName = $(this).val();
        getProdList(searchName,function (res) {
            doProdList(res);
            $('#bill_bot_to_top').removeClass('y100');
        })
    });
    //选择时间
    $("#createTime").datetimePicker({
        title: '请选择操作时间',
        min: "1990-12-12",
        max: "2222-12-12 12:12",
        monthNames:"",
        times:function(){
            var  year=[]
            return year;//可以实现 去掉 时分秒！
        },
        onChange: function (picker, values, displayValues) {
            ischanege = false;
            $('#save').removeClass('cabsdot_bosdt');
            //单据类操作 修改 添加默认的时分秒 。如果不是今天 则补充时间 00：00：00,是今天 就取当前时间！！
            var nowTime = wfy.format('yyyy-MM-dd hh-mm-ss',new Date());
            var checkTime = values[0]+'-'+values[1]+'-'+values[2];
            if(checkTime != nowTime.slice(0,10)){
                checkTime = checkTime+' 00-00-00';
            }else {
                checkTime = nowTime;
            }
            $('#createTime').attr('data-trueTime',checkTime)
        },
        parse: function(date) {
            return date.split(/\D/).filter(function(t) {
                return !!date
            });
        }
    });
    //点击加号 弹出 款式列表
    $('body').hammer().on('tap','#add_url',function (event) {
        event.stopPropagation();
        getProdList("",function (res) {
            doProdList(res);
            $('#bill_bot_to_top').removeClass('y100');
        })
    })
    //点击商品
    $('body').hammer().on('tap','#ks_list li',function (event) {
        event.stopPropagation();
        ksdm = $(this).attr('data-ksdm');
        ksmc = $(this).attr('data-ksmc');
        jldw = $(this).attr('data-jldw');
        proimg = $(this).attr('data-img');
        $('#b011_img').attr('src',(wfy.empty(proimg)? "../../public/img/onerror.png" : _wfy_pic_ip+proimg));
        $('#b011_mc').html(ksmc);
        getProdDtl(ksdm,function (res) {
            var objdata = {};
            objdata['ksdm'] = ksdm;
            objdata['cont'] = [];
            objdata['ksmc'] = ksmc;
            var arr = [];
            for(var i = 0; i< data.length; i++){
                arr.push(data[i].ksdm);
            }
            if(!arr.val_in_array(ksdm)){
                data.push(objdata)
            }
            doProdDtl(res);
            wfy.open('storeBox');
        })
    })
    //关闭 选择
    $('body').hammer().on('tap','#bill_close',function (event) {
        event.stopPropagation();
        tempdata=[];
        wfy.close();
    })
    //新增监控 input 值的变化
    $('#sku_price').on('input propertychange',function(){
        var pr_val = $(this).val();
        var cont = [];
        for(var i = 0; i<data.length;i++){
            if(ksdm == data[i].ksdm){
                cont = data[i].cont;
            }
        }
        var jage = 0;
        for(var x = 0; x<cont.length; x++){
            cont[x].price = pr_val;
            jage =accAdd(jage, accMul((cont[x].num),pr_val));
        }
        $('#sum_money').html('￥'+jage);
    });
    //新增 折扣 实时监控  只计算总额
    $('#createZK').on('input propertychange',function(){
        //操作方法你按照我的来，先把折扣改为7折，进入选择商品，出来再改一下销售类型，把折扣调完8折 上述的bug
        getTotalNumAndMoney();//修改后直接重新获取计算
    });
    // 新增 点击 选择销售类型
    $("#createLX").picker({
        title: "请选择销售类型",
        cols: [
            {
                textAlign: 'center',
                values:['批发','零售']
            }
        ],
        onChange:function (p) {
            $('#sub_save').removeClass('cabsdot_bosdt');
            $('#sub_sale').addClass('cabsdot_bosdt');
            var vue = p.value[0];
            if(vue == '零售'){
                salestyle = '零售';
                changeData('零售')
                showDataDtl();
                //起初想在 showDataDtl 中做改动 突然发现牵扯太多！！！ 换个思路：切换类型的时候 仅是对data中价格做改变，牵扯到 展示商品信息（doProdDtl）的改动
            }
            if(vue == '批发'){
                salestyle = '批发';
                changeData('批发');
                showDataDtl();
            }
        }
    });
    //数量+
    $('body').hammer().on("tap",'.b0061 .add',function( event){
        event.stopPropagation();
        ischanege = false;
        $('#save,#sub_save').removeClass('cabsdot_bosdt');
        $('#sub_sale').addClass('cabsdot_bosdt');
        var num=$(this).prev().html();
        var txhm = $(this).prev().attr('data-tm');
        var xthh = $(this).prev().attr('data-hh');
        var style = $(this).parents('li').find('.sku_style').html();
        num++;
        $(this).prev().html(num);
        countMoney(num,style,txhm,xthh);
        if(dtlFlag){
            auditflag=false;
            $("#oper_save").removeClass("cabsdot_bosdt");
        }
    });
    //数量 -
    $('body').hammer().on("tap",'.b0061 .reduce',function( event){
        event.stopPropagation();
        ischanege = false;
        $('#save,#sub_save').removeClass('cabsdot_bosdt');
        $('#sub_sale').addClass('cabsdot_bosdt');
        var num=$(this).next().html();
        var txhm = $(this).next().attr('data-tm');
        var xthh = $(this).next().attr('data-hh');
        var style = $(this).parents('li').find('.sku_style').html();//获取 型号 L M
        if(pageName == 'msa030_0100' || pageName == 'msa030_0800' || pageName == 'msa030_0900'){
            num --;
        }else{
            if(num>0){
                num --;
            }
        }
        $(this).next().html(num);
        countMoney(num,style,txhm,xthh);
        if(dtlFlag){
            auditflag=false;
            $("#oper_save").removeClass("cabsdot_bosdt");
        }
    });
    //直接编辑数量
    $('body').hammer().on("tap",'.b0061 .num',function( event){
        event.stopPropagation();
        ischanege = false;
        console.error(pageName)
        $('#save,#sub_save').removeClass('cabsdot_bosdt');
        $('#sub_sale').addClass('cabsdot_bosdt');
        var num = 0;
        var txhm = $(this).attr('data-tm');
        var xthh = $(this).attr('data-hh');
        var style = $(this).parents('li').find('.sku_style').html();//获取 型号 L M
        var _this = $(this);
        $.prompt({
            text: "",
            title: "请输入编辑数量",
            onOK: function(text) {
                num = parseInt(Number(text)) || 0;
                if(pageName != 'msa030_0100' && pageName != 'msa030_0800' && pageName != 'msa030_0900'){//销售收银
                    if(num < 0){
                        wfy.alert('不允许输入负数');
                        return false;
                    }
                }
                _this.html(num);
                countMoney(num,style,txhm,xthh);
            },
            onCancel: function() {
                console.log("取消了");
            },
            input: _this.html(),
            type:'tel'
        });
        if(dtlFlag){
            auditflag=false;
            $("#oper_save").removeClass("cabsdot_bosdt");
        }
    });
    function countMoney(num,style,txhm,xthh){//num 仅做生成一条数据用。计算总价需要计算 加值！！！
        //计算 金额 并 实时 统计sku 数据！
        var numtotal = 0;
        //先 通过颜色 和 型号 反推sku、
        var color = $("#sku_color li.colorcheck").html();//获取当前的颜色值
        var sku = getSku(color,style);
        var sku_price = $("#sku_price").val();
        var obj ={'color':'','price':'','num':'','style':'',"sku":'','ksmc':'','jldw':'','txhm':'','serialnum':'','wpdj':'','wppfdj':''};
        //生成一条数据
        obj.color = color;
        obj.price = sku_price;
        obj.num = num;
        obj.style = style;
        obj.sku = sku;
        obj.ksmc = ksmc;
        obj.jldw = jldw;
        obj.txhm = txhm;
        obj.serialnum = xthh;
        obj.wpdj = wpdj;
        obj.wppfdj = wppfdj;//物品批发价  201/-4-8 新增 批发价 ， 默认显示批发价
        //往 临时数据 tempdata 中添加数据，(需要验证sku 是不是已经存在，存在就覆盖，不存在就添加)
        for(var k = 0; k<data.length; k++){
            //关键点：将已经添加的数据从data中拿出来，放到临时数据中。。
            if(ksdm == data[k].ksdm){
                tempdata = data[k].cont;
            }
        }
        if(tempdata.length == 0){
            tempdata.push(obj);
        }else {
            var b= [];
            for(var i = 0;i<tempdata.length;i++){
                var shisku = tempdata[i].sku;
                b.push(shisku);
            }
            if(b.val_in_array(sku)){
                var c = b.indexOf(sku);
                tempdata[c] =  obj;
            }else {
                tempdata.push(obj)
            }
        }
        //这里计算价格 需要将当前 颜色下型号 所有的 数字相加 ，再与当前价格 做计算
        $('#sku_style li').each(function () {
            var m = Number($(this).find('.num').html());
            if(m !=0){
                numtotal += m;
            }
        })
        var newMoney=accMul(sku_price,numtotal);
        $("#sum_money").html("￥"+newMoney);
    }
    //切换颜色
    $('body').hammer().on('tap','#sku_color li',function (event) {
        event.stopPropagation();
        $('#sku_color li').removeClass('colorcheck');
        $(this).addClass('colorcheck');
        var index = $(this).index();
        $('#sku_style ul').addClass('none');
        $('#sku_style ul').eq(index).removeClass('none');
    })
    //点击添加 按钮 将临时数据添加到  对应的data中，依据 唯一值 sku判断。依据 ksdm 找位置进行添加
    //如果 ksdm 存在，则说明之前添加过商品。在此基础上，如果要 合并之前的数据，还要判断 sku是否添加过。
    $('body').hammer().on('tap','#add_btn',function (event) {
        event.stopPropagation();
        // if(data.length == 0){
        //     return false;//其实data 的长度在此时不可能为0；
        // }
        // var cont = [];
        // var index = 0 ;
        // for(var i = 0; i<data.length ;i++){
        //     if(ksdm == data[i].ksdm){
        //         cont =data[i].cont;
        //         index = i;
        //     }
        // }
        // //找出 cont中 的sku值 组成个数组
        // var cont_sku = [];
        // if(cont.length == 0){
        //     cont_sku = []
        // }else {
        //     for (var z =0;z<cont.length;z++){
        //         cont_sku.push(cont[z].sku);
        //     }
        // }
        // //将 临时数据中的sku 值依次跟 cont_sku 做比较
        // var temo_sku;
        // var temp_num;
        // for(var b = 0 ;b<tempdata.length;b++){
        //     temo_sku = tempdata[b].sku;
        //     temp_num = tempdata[b].num;
        //     if(!cont_sku.val_in_array(temo_sku)){
        //         //不存在
        //         cont.push(tempdata[b]);
        //     }else {
        //         //存在 找到是第几个
        //         var ins= cont_sku.indexOf(temo_sku);
        //         var cont_num = getcontNum(temo_sku,cont);
        //         cont_num = Number(cont_num) + Number(temp_num);
        //         cont[ins].num = cont_num;
        //     }
        // }
        // data[index].cont = cont;
        // tempdata = [];

        if(tempdata.length != 0){
            var cont = [];
            for(var a = 0 ;a < tempdata.length;a++){
                if(tempdata[a].num != 0){
                    cont.push(tempdata[a])
                }
            }
            for(var i = 0; i < data.length; i++){
                if(ksdm == data[i].ksdm){
                    data[i].cont = cont;
                }
            }
            tempdata= [];
            //计算 每个款式下 已选的 数量
            getTotalNum();
        }
        console.info(data)
        /*
         * b需求 搜索的商品添加数量后 清空搜索
         * */
        $('#searchpro').val('');
        getProdList("",function (res) {
            doProdList(res);
        })
        //b结束
        wfy.close();
    })

    //点击 完成！
    $('body').hammer().on('tap','#bill_slide_head_ok',function (event) {
        event.stopPropagation();
        //弹出层消失，在添加页面展示 选中的数据 处理 data
        showDataDtl();
        $('input').blur();
        $('#bill_bot_to_top').addClass('y100');
    })

    //滑动
    $("body").hammer().on("dragstart", ".list_swiper", function (event) {
        event.stopPropagation();
        var ind = $(this).find(".bill_drop span").length;
        var indclass = "x_left_160";
        if(ind == 3){
            indclass = "x_left_140";
        }
        if(ind == 0){//实现了取消 滑动
            indclass ='';
        }
        if (event.gesture.direction === "left") {
            $('.list_swiper .bill_item').removeClass(indclass);
            $(this).find(".bill_item").addClass(indclass);
        } else {
            $(this).find(".bill_item").removeClass(indclass);
        }
    });
    // 添加的商品进行删除 处理 ----整个款式的删除
    $('body').hammer().on('tap','.bill_sku_delete',function (event) {
        event.stopPropagation();
        ischanege = false;
        $('#save,#sub_save').removeClass('cabsdot_bosdt');
        $('#sub_sale').addClass('cabsdot_bosdt');
        $("#oper_save").removeClass("cabsdot_bosdt");
        var ksdm = $(this).attr('data-ksdm');
        var index = 0;
        for(var i = 0 ; i<data.length; i++){
            if(ksdm == data[i].ksdm){
                index = i;
            }
        }
        //console.log(data)
        data.splice(index,1);
        //console.log(data)
        if(dtlFlag){
            auditflag=false;
            $("#oper_save").removeClass("cabsdot_bosdt");
        }
        //显示内容
        showDataDtl();
    })
    // 滑动出现的 sku 删除 添加 减少-----换个思路，不遍历data，从dom中读取该款式的位置，变换成data的索引，然后找到要操作的数据，
    // 执行操作 是直接操作data的数据，showDataDtl()方法是显示全部的data数据，如果操作一次，执行一次showDataDtl的话，会慢。
    // 此处，只做局部数据处理。新的方法
        //增加
        $('body').hammer().on('tap','.mxdtl_add',function (event) {
            event.stopPropagation();
            ischanege = false;
            $('#save,#sub_save').removeClass('cabsdot_bosdt');
            $('#sub_sale').addClass('cabsdot_bosdt');
            var data_index = 0 ;//data的索引
            var cont_index = 0 ;//cont的索引
            data_index = $(this).parents('.bill_sku').attr('data-index');
            cont_index = $(this).parents('.bill_drop').attr('data-index');
            var cont = data[data_index].cont;
            if(Number(cont[cont_index].num) == -1){
                cont[cont_index].num = 1
            }else {
                cont[cont_index].num = Number(cont[cont_index].num) + 1;
            }
            showContDtl(data_index,cont,cont_index);

            if(dtlFlag){
                auditflag=false;
                $("#oper_save").removeClass("cabsdot_bosdt");
            }
        })
        //减少
        $('body').hammer().on('tap','.mxdtl_reduce',function (event) {
            event.stopPropagation();
            ischanege = false;
            $('#save,#sub_save').removeClass('cabsdot_bosdt');
            $('#sub_sale').addClass('cabsdot_bosdt');
            var data_index = 0 ;//data的索引
            var cont_index = 0 ;//cont的索引
            data_index = $(this).parents('.bill_sku').attr('data-index');
            cont_index = $(this).parents('.bill_drop').attr('data-index');
            var cont = data[data_index].cont;
            if(pageName == 'msa030_0100' || pageName == 'msa030_0800' || pageName == 'msa030_0900'){
                if(Number(cont[cont_index].num) == 1){
                    cont[cont_index].num = -1;
                }else {
                    cont[cont_index].num = cont[cont_index].num - 1;
                }
            }else {
                if(cont[cont_index].num > 1){
                    cont[cont_index].num = cont[cont_index].num - 1;
                }
            }
            showContDtl(data_index,cont,cont_index);

            if(dtlFlag){
                auditflag=false;
                $("#oper_save").removeClass("cabsdot_bosdt");
            }
        })
        //删除
        $('body').hammer().on('tap','.mxdtl_delete',function (event) {
            event.stopPropagation();
            ischanege = false;
            $('#save,#sub_save').removeClass('cabsdot_bosdt');
            $('#sub_sale').addClass('cabsdot_bosdt');
            var data_index = 0 ;//data的索引
            var cont_index = 0 ;//cont的索引
            data_index = $(this).parents('.bill_sku').attr('data-index');
            cont_index = $(this).parents('.bill_drop').attr('data-index');
            var cont = data[data_index].cont;
            cont.splice(cont_index,1);
            if(cont.length == 0){
                data.splice(data_index,1);
                showDataDtl();//如果明细全部删除，则直接在data中删除，此时执行 showDataDtl;
            }else {
                showContDtl(data_index,cont); //删除的时候，没有第三个参数。所有设置 -1
            }

            if(dtlFlag){
                auditflag=false;
                $("#oper_save").removeClass("cabsdot_bosdt");
            }
        })


    //扫描 点击
    $('body').hammer().on('tap','#scan',function (event) {
        event.stopPropagation();
        //checkCode('A0SEF060110');
        app.scanner(function (code) {
            if (code) {
                checkCode(code);
            } else {
                //wfy.playAudio();
                wfy.alert("扫描条码失败！");
            }
        })
    })

    //4.24 新增选择客户界面新增~~
    $('body').hammer().on('tap','#kehu_can_add',function (event) {
        event.stopPropagation();
        $('#addwindow').css("bottom","200px");
        wfy.openFream('addcoverBack',"addwindow");
    })
    //4.24 新增弹窗 取消按钮
    $('body').hammer().on('tap', '#btn_cancel', function (event) {
        event.stopPropagation();
        $("#field_tel").val("");
        $("#field_name").val("");
        wfy.closeFream('addcoverBack',"addwindow");
        $('#addwindow').css("bottom","-200px");
    });
    //4.24 新增弹窗 确定按钮
    $('body').hammer().on('tap', '#btn_sure', function (event) {
        event.stopPropagation();
        var name = $("#field_name").val();
        var tel = $("#field_tel").val();
        if(name =='' || tel == ''){
            wfy.alert('请输入姓名和手机号');
            return false;
        }
        wfy.closeFream('addcoverBack',"addwindow");
        $('#addwindow').css("bottom","-200px");
        vipAdd(name,tel);
    });
})
//会员新增
var vipAdd = function (name,tel) {
    var vBiz = new FYBusiness("biz.crm.crminfo.save");
    var vOpr1 = vBiz.addCreateService("svc.crm.crminfo.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.crm.crminfo.save");
    vOpr1Data.setValue("AS_KHHYKH", "");
    vOpr1Data.setValue("AS_KHHYXM", name);
    vOpr1Data.setValue("AS_KHHYSJ", tel);//手机
    vOpr1Data.setValue("AS_KHHYXB", '');
    vOpr1Data.setValue("AS_KHCSNY", '');
    vOpr1Data.setValue("AS_KHSFZH", "");//身份证号
    vOpr1Data.setValue("AN_KHXYED", '');//额度
    vOpr1Data.setValue("AS_KHLXWX",'');
    vOpr1Data.setValue("AS_KHLXDZ", '');
    vOpr1Data.setValue("AS_KHHYBZ", '');
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            wfy.alert("保存信息成功！",function () {
                //查寻所有的会员客户

                getKHList('');
            });

        } else {
            // todo...[d.errorMessage]
            wfy.alert("保存信息失败！"+d.errorMessage);
        }
    }) ;
}
//显示 data 的数据内容
function showDataDtl() {
    var html ="";
    if(data.length == 0){
        html = wfy.zero('暂无添加商品');
    }else {
        for(var i = 0 ; i< data.length; i++ ){
            var cont = data[i].cont;
            //排除cont 为空的情况
            if(cont.length != 0){
                html +=  '<div class="bill_sku" data-index ="'+i+'" data-ksdm="'+data[i].ksdm+'">' +
                    '<div class="bill_sku_product">'+
                    '<div class="bill_sku_product_name">'+(i+1)+'、'+data[i].ksdm+'' +
                    '<span class="bill_sku_delete" data-ksdm="'+data[i].ksdm+'">&#xe69d</span>' +
                    '</div>'+
                    '<p class="b001">'+data[i].ksmc+'</p>'+
                    '</div>' +
                    '<ul class="bill_sku_dtl">';
                for(var m = 0 ; m < cont.length; m++){
                    html+= '<li class="list_swiper">'+
                        '<div class="bill_item thd ts200" data-code="'+cont[m].sku+'" data-barcode="'+cont[m].txhm+'">'+
                        '<span>'+cont[m].color+'</span>'+
                        '<span>'+cont[m].style+'</span>'+
                        '<span>'+cont[m].num+'*'+cont[m].price+'='+accMul(cont[m].num,cont[m].price)+'</span>'+
                        '</div>'+
                        '<div class="bill_drop" data-index ="'+m+'">'+
                        '<span class="mxdtl_add">&#xe6b9</span>'+
                        '<span class="mxdtl_delete">&#xe69d</span>'+
                        '<span class="mxdtl_reduce">&#xe66a</span>'+
                        '</div>'+
                        '</li>'
                }
                html+='</ul>'+
                    '</div>';
            }
        }
    }

    $('#bill_sku_box').html(html);
    //计算总总金额 和总数量
    getTotalNumAndMoney();
}
//  显示cont的数据内容
function showContDtl(dataindex,cont,contindex) {
    contindex = contindex || -1;
    var div = '';
    var html ="";
    for(var m = 0 ; m < cont.length; m++){
        if(m == contindex){
            div = '<div class="bill_item thd ts200 x_left_140" data-code="'+cont[m].sku+'" data-barcode="'+cont[m].txhm+'">';
        }else {
            div = '<div class="bill_item thd ts200" data-code="'+cont[m].sku+'" data-barcode="'+cont[m].txhm+'">'
        }
        html+= '<li class="list_swiper">'+div+
                        '<span>'+cont[m].color+'</span>'+
                        '<span>'+cont[m].style+'</span>'+
                        '<span>'+cont[m].num+'*'+cont[m].price+'='+accMul(cont[m].num,cont[m].price)+'</span>'+
                    '</div>'+
                    '<div class="bill_drop" data-index ="'+m+'">'+
                        '<span class="mxdtl_add">&#xe6b9</span>'+
                        '<span class="mxdtl_delete">&#xe69d</span>'+
                        '<span class="mxdtl_reduce">&#xe66a</span>'+
                    '</div>'+
                '</li>'
    }
    $('#bill_sku_box .bill_sku').eq(dataindex).find('.bill_sku_dtl').html(html);
    //计算总总金额 和总数量
    getTotalNumAndMoney();
}

////计算 每个款式下 已选的 数量
function getTotalNum() {
    for(var m = 0; m<data.length; m++){
        var ksdmid = data[m].ksdm;
        var contid = data[m].cont;
        var len = 0;
        for(var c = 0; c <contid.length;c++){
            if(contid[c].num < 0){
                len += Number(contid[c].num)*(-1);
            }else {
                len += Number(contid[c].num);
            }
        }
        $('#ks_list li').each(function () {
            var ksdmli = $(this).attr('data-ksdm');
            var that = $(this).find('.checknum');
            if(ksdmli == ksdmid){
                that.show();
                that.children('span').html(len).css('color','red');//每个款式下的数量
            }
        })
    }
    getTotalNumAndMoney();
}
//计算总金额和 总数量
function getTotalNumAndMoney() {
    var totalNum = 0,totalMoney = 0;
    var cont =[];//不分款式，都处理到cont中统一计算
    for(var i = 0 ;i<data.length;i++){
        cont = cont.concat(data[i].cont);
    }
    for(var m = 0; m<cont.length;m++){
        if(Number(cont[m].num) < 0){
            totalNum += Number(cont[m].num)*(-1);
        }else {
            totalNum += Number(cont[m].num);
        }
        totalMoney = accAdd(totalMoney,accMul(Number(cont[m].num),Number(cont[m].price)));
    }
    //新增 如果 有折扣 那么要重新 计算折扣后的价格
    //如果此时有折扣m 那么重新计算总价格
    var zk = $('#createZK').val()/100 || 1;
    totalMoney = accMul(totalMoney,zk);
    if(totalMoney.toString().length>6){
        $('#totalMoney,#totalNum').parent().css({
            'line-height':'25px'
        })
        $('#totalMoney,#totalNum').css({
            'display':'block'
        })
    }else {
        $('#totalMoney,#totalNum').parent().css({
            'line-height':'50px'
        })
        $('#totalMoney,#totalNum').css({
            'display':'inline'
        })
    }
    $('#totalMoney').html(totalMoney).attr('data-jige',totalMoney);
    $('#totalNum').html(totalNum);
    $('#numtotal').html(totalNum); //左上角 sku总数
}





//读取页面入口信息
var pageinit = function (callback) {
    var init = {};
    init.page = localStorage.page;
    if(typeof callback === 'function'){
        callback(init);
    }
}
//查询往来下款式列表
function getProdList(AS_XTKS,callback){
    var vBiz = new FYBusiness('biz.cqxyapp.common.xtwlksqry');
    var vOpr1 = vBiz.addCreateService('svc.cqxyapp.common.xtwlksqry', false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue('AS_USERID', LoginName);
    vOpr1Data.setValue('AS_WLDM', DepartmentCode);
    vOpr1Data.setValue('AS_FUNC', 'svc.cqxyapp.common.xtwlksqry');
    vOpr1Data.setValue("AS_XTKS", AS_XTKS);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var res = vOpr1.getResult(d, 'AC_RESULT').rows || [];
            if(typeof callback === 'function'){
                callback(res)
            }
        } else {
            wfy.alert('未查询到商品信息！' + (d.errorMessage || ''));
        }
    });
}
//处理上面过程 获取的 款式列表
var doProdList = function (res) {
    var html ='';
    if(res.length == 0){
        html = wfy.zero('暂无款式');
    }else {
        for(var i = 0; i<res.length;i++){
            html +=' <li data-ksdm="'+res[i].xtwpks+'" data-ksmc="'+res[i].xtwpmc+'" data-jldw = "'+res[i].xtjldw+'"' +
                'data-img="'+res[i].xtwplj+'">'+
                        '<div class="gx_list_1_cont">'+
                            '<div class="gx_list_1_cont_img">' +
                                '<img src="'+wfy.loadingimg+'" alt="" id="td'+i+'"/>'+
                            '</div>'+
                            '<div class="gx_list_1_cont_item">'+
                                '<div>'+res[i].xtwpks+'</div>'+
                                '<div>'+res[i].xtwpmc+'</div>'+
                                '<div>总库存数：'+(res[i].kczksl || 0)+'</div>'+
                                '<div class="checknum">已选(<span>'+0+'</span>)件</div>'+
                            '</div>'+
                        '</div>'+
                    '</li>';
            wfy.imgload(res[i].xtwplj,"#td"+i);
        }
    }
    $('#ks_list').html(html);

    //计算 每个款式下 已选的 数量
    getTotalNum();
}
//查询往来下款式商品明细 //A0SEF
function getProdDtl(xtwpks,callback){
    var vBiz = new FYBusiness('biz.cqxyapp.common.xtwlksqrydtl');
    var vOpr1 = vBiz.addCreateService('svc.cqxyapp.common.xtwlksqrydtl', false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue('AS_USERID', LoginName);
    vOpr1Data.setValue('AS_WLDM', DepartmentCode);
    vOpr1Data.setValue('AS_FUNC', 'svc.cqxyapp.common.xtwlksqrydtl');
    vOpr1Data.setValue('AS_XTWPKS', xtwpks);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var res = vOpr1.getResult(d, 'AC_RESULT').rows || [];
            result = res;
            //console.log(res)
            if(typeof callback === 'function'){
                callback(res)
            }
        } else {
            wfy.alert('未查询到商品明细！' + (d.errorMessage || ''));
        }
    });
}
/*
 * 处理过程 获取的 sku信息
 * 1、价格 可能随着颜色变化。所以，依据颜色 随时取价格
 * 2、取出来所有的颜色 ，尺寸。
 * 3、依据 选择的颜色 和 尺寸 反推该sku
 * */
var doProdDtl = function (res) {
    console.log(res)
    //取得该款式商品的 颜色 型号等信息，展示出来.型号 是依据 颜色而定的
    wpdj = res[0].wpxsdj || 0;//价格
    wppfdj = res[0].wppfj || 0;//价格
    var colorarr = [];//颜色
    var stylearr = [];//尺寸---------依据颜色 设定
    var skuarr = [];
    var colorstr='',stylestr='';
    if(res.length != 0){
        colorarr.push(res[0].xtysmc);
        skuarr.push(res[0].xtwpdm)
        for(var i = 1; i< res.length; i++){
            if(!colorarr.val_in_array(res[i].xtysmc)){
                colorarr.push(res[i].xtysmc);
            }
            skuarr.push(res[i].xtwpdm)
        }
        //默认 第一个 处于选中状态  colorcheck 表示选中~
        colorstr ='<li class="colorcheck">'+colorarr[0]+'</li>';
        for(var x = 1;x<colorarr.length;x++){
            colorstr +='<li>'+colorarr[x]+'</li>';
        }
        $('#sku_color').html(colorstr);//-----------------------颜色-----------------
        var domwidth = 0;
        $('#sku_color li').each(function () {
            domwidth += ($(this).width()+35);
        })
        $('#sku_color').width(domwidth);
        $('#sku_color').html(colorstr);

        //--------------价格-----------------------
        var oldprice = '';
        if(salestyle == '零售'){
            oldprice = wpdj;
        }else {
            oldprice = wppfdj;
        }
        //依据颜色 显示 型号。默认展示 第一个颜色 的型号 。（这里应该将颜色作为参数，封装成一个可以公用的。切换颜色也需要用）
        var cont = fromDataGetCont();
        // 新增 提示价格----------------------------18-2-5---------------------
        if(cont.length ==0){
            $('#sku_price').val(oldprice);
            $('#storeBox .b003').eq(1).html("价格")
        }else {
            for(var mm = 0; mm < cont.length ; mm++){
                if((cont[mm].price != cont[mm].wppfdj) && (cont[mm].price != cont[mm].wpdj)){
                    //既不等于批发价也不等于零售价 就是改过价格*（不考虑 改价格的时候正好等于 零售价或批发价）
                    $('#sku_price').val(cont[mm].price);
                    $('#storeBox .b003').eq(1).html("价格(<span style='font-size:11px;color: #f00'>原价"+oldprice+"</span>)")
                }else {
                    $('#sku_price').val(oldprice);
                    $('#storeBox .b003').eq(1).html("价格")
                }
            }
        }

        var html = '';
        for(var a = 0;a < colorarr.length;a++){
            stylearr = getStyle(colorarr[a]);
            html +='<ul class="b006 none" id="sku_style'+a+'">';
            var this_color = colorarr[a];
            for(var b = 0;b < stylearr.length;b++){
                var this_style = stylearr[b]; //这俩变量用于获取对应的 sku
                var this_sku = getSku(this_color,this_style);
                html +='<li><span class="sku_style">'+stylearr[b]+'</span><span class="sku_style_num">库存：('+getNum(this_color,this_style)+')</span> <div class="b0061">' +
                    '<em class="reduce">&#xe66a</em>' +
                    '<em class="num" ' +
                    'data-sku ="'+this_sku+' " ' +
                    'data-tm ="'+getcantm(this_color,this_style)+'" ' +
                    'data-hh="'+fromContGetSerial(cont,this_sku)+'">'+(fromContGetNum(cont,this_sku))+'</em>' +  //
                    '<em class="add">&#xe6b9</em>' +
                    '</div></li>';
            }
            html+='</ul>';
        }
        $('#sku_style').html(html);
        $('#sku_style0').removeClass('none');

        var s = 0
        var js = 0;
        for(var m = 0; m<cont.length;m++){
            if(Number(cont[m].num) < 0){
                s += Number(cont[m].num)*(-1);
            }else {
                s += Number(cont[m].num);
            }
            js = accAdd(js,accMul(Number(cont[m].num),Number(cont[m].price)));
        }
        $('#sum_money').html('￥'+js);
    }
}






//获取列表 之 入库单
var getListRUKU = function(pageNum,AS_DJLX,AS_DJZT,callback) {
    var vBiz = new FYBusiness("biz.invpor.instorelist.qry");
    var vOpr1 = vBiz.addCreateService("svc.invopr.instorelist.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invopr.instorelist.qry");
    vOpr1Data.setValue("AS_DJLX", AS_DJLX);//RK入库单 HZRH红字入库单 QTCK其它出库 QTTH其它退货
    vOpr1Data.setValue("AS_DJZT", AS_DJZT);// 维护 L ,审核 S
    vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getResult(d, 'AC_LIST').rows || [];
            if(typeof callback === 'function'){
                callback(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}
//获取详情 入库单详情
var getRUKUdtl = function (AS_KCCZHM,callback) {
    var vBiz = new FYBusiness("biz.invopr.inwh.detail.qry");

    var vOpr1 = vBiz.addCreateService("svc.invopr.inwh.header.qry", true);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invopr.inwh.header.qry");
    vOpr1Data.setValue("AS_KCCZHM", AS_KCCZHM);

    var vOpr2 = vBiz.addCreateService("svc.invopr.inwh.detail.qry", true);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.invopr.inwh.detail.qry");
    vOpr2Data.setValue("AS_KCCZHM", AS_KCCZHM);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var resMain = vOpr1.getResult(d, 'AC_RESULT').rows || [];
            var resDtl = vOpr2.getResult(d, 'AC_RESULT').rows || [];

            if(typeof callback === 'function'){
                callback(resMain,resDtl)
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}


//获取列表 之 要货单
var getListYAOHUO =function (pageNum,AS_DJZT,callback) {
    var vBiz = new FYBusiness("biz.dsdmd.veryorderlist.qry");
    var vOpr1 = vBiz.addCreateService("svc.dsdmd.veryorderlist.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invopr.instorelist.qry");
    vOpr1Data.setValue("AS_YHZT", AS_DJZT);// 维护 L ,审核 S
    vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getResult(d, 'AC_VERYLIST').rows || [];
            if(typeof callback === 'function'){
                callback(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}

//详情 要货单
function getYAOHUODtl(AS_KCCZHM,callback){
    var vBiz = new FYBusiness("biz.dsdmd.veryorder.qry");

    var vOpr1 = vBiz.addCreateService("svc.dsdmd.veryorder.header.qry", true);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.dsdmd.veryorder.header.qry");
    vOpr1Data.setValue("AS_KCCZHM", AS_KCCZHM);

    var vOpr2 = vBiz.addCreateService("svc.dsdmd.veryorder.detail.qry", true);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.dsdmd.veryorder.detail.qry");
    vOpr2Data.setValue("AS_KCCZHM", AS_KCCZHM);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var resMain = vOpr1.getResult(d, 'AC_RESULT').rows || [];
            var resDtl = vOpr2.getResult(d, 'AC_RESULT').rows || [];
            if(typeof callback === 'function'){
                callback(resMain,resDtl)
            }
        } else {
            wfy.alert('未查询到要货单明细信息！' + (d.errorMessage || ''));
        }
    });
}


//获取列表 之 收货单
var getListSHOUHUO = function (page,callback) {
    var vBiz = new FYBusiness("biz.dsds.phrklist.qry");
    var vOpr1 = vBiz.addCreateService("svc.dsds.phrklist.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.dsds.phrklist.qry");
    vOpr1Data.setValue("AN_PAGE_NUM", page);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getResult(d, 'AC_PHSHRK').rows || [];
            if(typeof callback === 'function'){
                callback(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}

//详情 收货单
function getSHOUHUODtl(AS_CZHM,callback) {
    var vBiz = new FYBusiness("biz.dsds.phrkdtl.qry");
    var vOpr1 = vBiz.addCreateService("svc.dsds.phrkdtl.head.qry", true);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.dsds.phrkdtl.head.qry");
    vOpr1Data.setValue("AS_CZHM", AS_CZHM);

    var vOpr2 = vBiz.addCreateService("svc.dsds.phrkdtl.detail.qty", true);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.dsds.phrkdtl.detail.qty");
    vOpr2Data.setValue("AS_CZHM", AS_CZHM);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var resMain = vOpr1.getResult(d, 'AC_HEADR').rows || [];
            var resDtl = vOpr2.getResult(d, 'AC_DETAIL').rows || [];
            if(typeof callback === 'function'){
                callback(resMain,resDtl)
            }
        } else {
            wfy.alert('未查询到收货单明细信息！' + (d.errorMessage || ''));
        }
    });
}


// 获取列表 之 调出单
var getListDIAOCHU = function (pageNum,callback) {
    var vBiz = new FYBusiness("biz.dsmove.movelist.qry");
    var vOpr1 = vBiz.addCreateService("svc.dsmove.movelist.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.dsmove.movelist.qry");
    vOpr1Data.setValue("AN_PAGE_NUM", pageNum);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getResult(d, 'AC_ZYDB').rows || [];
            if(typeof callback === 'function'){
                callback(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}

//详情 调出单
function getDIAOCHUDtl(AS_KCCZHM,callback){
    var vBiz = new FYBusiness("biz.dsmove.moveout.qry");

    var vOpr1 = vBiz.addCreateService("svc.dsmove.moveout.header.qry", true);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.dsmove.moveout.header.qry");
    vOpr1Data.setValue("AS_KCCZHM", AS_KCCZHM);

    var vOpr2 = vBiz.addCreateService("svc.dsmove.moveout.detail.qry", true);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.dsmove.moveout.detail.qry");
    vOpr2Data.setValue("AS_KCCZHM", AS_KCCZHM);


    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var resMain = vOpr1.getResult(d, 'AC_RESULT').rows || [];
            var resDtl = vOpr2.getResult(d, 'AC_RESULT').rows || [];

            if(typeof callback === 'function'){
                callback(resMain,resDtl)
            }
        } else {
            wfy.alert('未查询到调出单明细信息！' + (d.errorMessage || ''));
        }
    });
}

//获取列表 之 调入单 svc.dsmove.movein.qry
var getDIAORU = function (pageIndex,callback) {
    var vBiz = new FYBusiness('biz.dsmove.movein.qry');
    var vOpr1 = vBiz.addCreateService('svc.dsmove.movein.qry', false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue('AS_USERID', LoginName);
    vOpr1Data.setValue('AS_WLDM', DepartmentCode);
    vOpr1Data.setValue('AS_FUNC', 'svc.dsmove.movein.qry');
    vOpr1Data.setValue("AN_PAGE_NUM", pageIndex);
    vOpr1Data.setValue("AN_PAGE_SIZE", 20);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.log(JSON.stringify(ip))
    ip.invoke(function (d) {
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var res = vOpr1.getResult(d, 'AC_ZYDBR').rows || [];
            if(typeof callback === 'function'){
                callback(res)
            }
        } else {
            wfy.alert('未查询到调入单信息！' + (d.errorMessage || ''));
        }
    });
}

//详情  调入单
function getDIAORUDtl(AS_KCCZHM,callback) {
    var vBiz = new FYBusiness("biz.dsmove.moveindtl.qry");

    var vOpr1 = vBiz.addCreateService("svc.dsmove.moveindtl.head.qry", true);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.dsmove.moveindtl.head.qry");
    vOpr1Data.setValue("AS_KCCZHM", AS_KCCZHM);

    var vOpr2 = vBiz.addCreateService("svc.dsmove.moveindtl.detail.qry", true);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.dsmove.moveindtl.detail.qry");
    vOpr2Data.setValue("AS_KCCZHM", AS_KCCZHM);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);

    ip.invoke(function (d) {
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var resMain = vOpr1.getResult(d, 'AC_HEADER').rows || [];
            var resDtl = vOpr2.getResult(d, 'AC_DTL').rows || [];

            if(typeof callback === 'function'){
                callback(resMain,resDtl)
            }
        } else {
            wfy.alert('未查询到调入单明细信息！' + (d.errorMessage || ''));
        }
    });
}





// 审核状态 之 入库单 （借用原先的过程。）
/*
 * S审核  E二审   U反审（取消审核.包括取消二审 ）
 * */
var changeStatus = function (AS_DJLX,AS_KCCZHM,AS_STATUS,call) {
    var vBiz = new FYBusiness("biz.invopr.invopr.status");
    var vOpr1 = vBiz.addCreateService("svc.invopr.invopr.status", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invopr.invopr.status");
    vOpr1Data.setValue("AS_DJLX", AS_DJLX);
    vOpr1Data.setValue("AS_KCCZHM", AS_KCCZHM);
    vOpr1Data.setValue("AS_STATUS", AS_STATUS);//S审核  E二审   U反审（取消审核.包括取消二审 ）
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            if(typeof call === 'function'){
                call();
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}

//删除操作 之 入库单 列表删除（借用之前的过程）
var listDel = function (AS_KCCZHM,AS_DJLX,call) {
    var vBiz = new FYBusiness("biz.invopr.list.delete");
    var vOpr1 = vBiz.addCreateService("svc.invopr.list.delete", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invopr.list.delete");
    vOpr1Data.setValue("AS_KCCZHM", AS_KCCZHM);
    vOpr1Data.setValue("AS_DJLX", AS_DJLX);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            if(typeof call === 'function'){
                call();
            }
        } else {
            // todo...[d.errorMessage]
            //wfy.alert(d.errorMessage);
            wfy.alert('操作失败：'+d.errorMessage)
        }
    }) ;
}

//  要货单 --列表操作 审核或删除
var dolistYaoHuo = function (AS_CZHM,AS_XTWLDM,type,callback) {
    var vBiz = new FYBusiness("biz.veorder.main.modify");
    var vOpr1 = vBiz.addCreateService("svc.veorder.main.modify", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM",DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.veorder.main.modify");
    vOpr1Data.setValue("AS_CZHM", AS_CZHM);
    vOpr1Data.setValue("AS_XTWLDM", AS_XTWLDM);
    vOpr1Data.setValue("AS_KCCKDM", "");
    vOpr1Data.setValue("AS_MODIFY_LX", type); //删除：delete、提交：confirm
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            if(typeof callback === 'function'){
                callback();
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert('操作失败：'+d.errorMessage);
        }
    }) ;
}

// 调出单  列表操作 删除（只用标准版的删除功能）
var dolistDiaoChu = function (AS_CZHM,AS_XTWLDM,AS_KCCKDM,callback) {
    var vBiz = new FYBusiness("biz.ds.move.list.modify");
    var vOpr1 = vBiz.addCreateService("svc.ds.move.list.modify", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ds.move.list.modify");
    vOpr1Data.setValue("AS_CZHM", AS_CZHM);
    vOpr1Data.setValue("AS_XTWLDM", AS_XTWLDM);
    vOpr1Data.setValue("AS_KCCKDM", AS_KCCKDM);
    vOpr1Data.setValue("AS_MODIFY_LX", 'delete');//删除：delete、提交：confirm
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            if(typeof callback === 'function'){
                callback();
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert('操作失败：'+d.errorMessage);
        }
    }) ;
}
// 调出单  列表操作 审核(新 过程)
var subDiaoChu = function (AS_XSCZHM,callback) {
    var vBiz = new FYBusiness("biz.dsmove.moveout.save");
    var vOpr1 = vBiz.addCreateService("svc.dsmove.moveout.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.dsmove.moveout.save");
    vOpr1Data.setValue("AS_XSCZHM", AS_XSCZHM);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.log(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            if(typeof callback === 'function'){
                callback();
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert('提交审核失败！'+ d.errorMessage);
        }
    }) ;
}


// 获取仓库  入库单
var getcangku = function (AS_DJLX,call) {
    var vBiz = new FYBusiness("biz.invopr.warehouse.qry");
    var vOpr1 = vBiz.addCreateService("svc.invopr.warehouse.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invopr.warehouse.qry");
    vOpr1Data.setValue("AS_DJLX", AS_DJLX);// 例如RK
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getResult(d, "AC_KCCKDM").rows;
            if(typeof call === 'function'){
                call(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}
//库存操作往来下拉选择-获取厂商
var getCompany = function (AS_DJLX,callback) {
    var vBiz = new FYBusiness("biz.invopr.xtwldm.qry");
    var vOpr1 = vBiz.addCreateService("svc.invopr.xtwldm.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invopr.xtwldm.qry");
    vOpr1Data.setValue("AS_DJLX", AS_DJLX);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getResult(d, 'AC_RESULT').rows || [];
            if(typeof callback === 'function'){
                callback(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}

/*
 * -------------------------调出单---------------------
 * */
// 获取调出客户、调入客户
var getDiaoChuOrder = function (callback) {
    var bizOrderShop = new FYBusiness("biz.dsmove.outckandinwl.qry");
    var svcOrderShop = bizOrderShop.addCreateService("svc.dsmove.outckandinwl.qry", false);
    var dataOrderShop = svcOrderShop.addCreateData();
    dataOrderShop.setValue("AS_USERID", LoginName);
    dataOrderShop.setValue("AS_WLDM", DepartmentCode);
    dataOrderShop.setValue("AS_FUNC", "svc.ds.move.ckwl.qry");
    var ip = new InvokeProc();
    ip.addBusiness(bizOrderShop);
    ip.invoke(function (res) {
        if (res && res.success) {//AC_DCCK,AC_DRKH
            var resOrderShop = svcOrderShop.getResult(res, "AC_DCCK").rows || [];//调出仓库选择
            var resSendStore = svcOrderShop.getResult(res, "AC_DRKH").rows || [];//调入客户选择
            if(typeof callback === 'function'){
                callback(resOrderShop,resSendStore);
            }
        } else {
            wfy.alert("获取调出仓库或者调入客户列表失败！");
        }
    });
}
var getDiaoChuStore=function (AS_XTWLDM,callback) {//获取调入仓库列表
    var bizOrderStore = new FYBusiness("biz.dsmove.inck.qry");
    var svcOrderStore = bizOrderStore.addCreateService("svc.dsmove.inck.qry", false);
    var dataOrderStore = svcOrderStore.addCreateData();
    dataOrderStore.setValue("AS_USERID", LoginName);
    dataOrderStore.setValue("AS_WLDM", DepartmentCode);
    dataOrderStore.setValue("AS_FUNC", "svc.ds.move.dcck.qry");
    dataOrderStore.setValue("AS_XTWLDM", AS_XTWLDM);
    var ip = new InvokeProc();
    ip.addBusiness(bizOrderStore);
    ip.invoke(function (res) {
        if (res && res.success) {
            var resOrderStore = svcOrderStore.getResult(res, "AC_DRCK").rows || [];
            if(typeof callback === 'function'){
                callback(resOrderStore);
            }
        } else {
            wfy.alert("获取调入仓库失败！");
        }
    });
}

/*
* 盘点单 获取 列表
* */
var getPandianList = function (pageNum,AS_TYPE,AS_ZT,callback) {
    var vBiz = new FYBusiness("biz.invst.input.list.qry");

    var vOpr1 = vBiz.addCreateService("svc.invst.input.list.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invst.input.list.qry");
    vOpr1Data.setValue("AS_TYPE", AS_TYPE);
    vOpr1Data.setValue("AS_ZT",AS_ZT);
    vOpr1Data.setValue("AN_PAGE_NUM",pageNum);
    vOpr1Data.setValue("AN_PAGE_SIZE", "20");

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var resOrderList = vOpr1.getResult(d, "AC_RESULT").rows || [];
            if(typeof callback === 'function'){
                callback(resOrderList);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert("获取列表失败！"+d.errorMessage);
        }
    }) ;
}

/**
 * 盘点单 详情
 */
var getPandianDtl = function (AS_KCCZHM,AS_PDQY,AS_TYPE,callback) {
    var vBiz = new FYBusiness("biz.invst.input.dtl.dtl.qry");

    var vOpr1 = vBiz.addCreateService("svc.invst.input.dtl.header.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invst.input.dtl.header.qry");
    vOpr1Data.setValue("AS_KCCZHM", AS_KCCZHM);
    vOpr1Data.setValue("AS_PDQY", AS_PDQY);
    vOpr1Data.setValue("AS_TYPE", AS_TYPE);

    var vOpr2 = vBiz.addCreateService("svc.invst.input.dtl.dtl.qry", false
    );
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.invst.input.dtl.dtl.qry");
    vOpr2Data.setValue("AS_KCCZHM", AS_KCCZHM);
    vOpr2Data.setValue("AS_PDQY", AS_PDQY);
    vOpr2Data.setValue("AS_TYPE", AS_TYPE);


    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var resHeaderList = vOpr1.getResult(d, "AC_RESULT").rows || [];
            var resDList = vOpr2.getResult(d, "AC_RESULT").rows || [];
            if(typeof callback === 'function'){
                callback(resHeaderList,resDList);
            }
        } else {
            wfy.alert("获取数据失败！" + d.errorMessage);
        }
    }) ;
}


/*
 * 获取盘点仓库
 * */
var getPandianStore = function (callback) {
    var bizOrderShop = new FYBusiness("biz.inv.st.ipt.dtl.hd.wl.qry");
    var svcOrderShop = bizOrderShop.addCreateService("svc.inv.st.ipt.dtl.hd.wl.qry", false);
    var dataOrderShop = svcOrderShop.addCreateData();
    dataOrderShop.setValue("AS_USERID", LoginName);
    dataOrderShop.setValue("AS_WLDM", DepartmentCode);
    dataOrderShop.setValue("AS_FUNC", "svc.inv.st.ipt.dtl.hd.wl.qry");
    var ip = new InvokeProc();
    ip.addBusiness(bizOrderShop);
    ip.invoke(function (res) {
        if (res && res.success) {
            var resOrderShop = svcOrderShop.getResult(res, "AC_XTCK").rows || [];
            var resSendStore = svcOrderShop.getResult(res, "AC_PDRY").rows || [];
            if(typeof callback === 'function'){
                callback(resOrderShop);
            }
        } else {
            wfy.alert("获取盘点仓库失败！");
        }
    });
}
/*
* 获取盘点方式 
* */
var getPandianType = function (AS_KCCKDM,callback) {
    var bizOrderStore = new FYBusiness("biz.inv.st.input.dtl.pdxg");
    var svcOrderStore = bizOrderStore.addCreateService("svc.inv.st.input.dtl.pdxg", false);
    var dataOrderStore = svcOrderStore.addCreateData();
    dataOrderStore.setValue("AS_USERID", LoginName);
    dataOrderStore.setValue("AS_WLDM", DepartmentCode);
    dataOrderStore.setValue("AS_FUNC", "svc.inv.st.input.dtl.pdxg");
    dataOrderStore.setValue("AS_KCCKDM", AS_KCCKDM);
    var ip = new InvokeProc();
    ip.addBusiness(bizOrderStore);
    ip.invoke(function (res) {
        if (res && res.success) {
            var resSendStore = svcOrderStore.getResult(res, "CA_PDFS").rows || [];
            if(typeof callback === 'function'){
                callback(resSendStore);
            }
        } else {
            wfy.alert("获取盘点方式失败！");
        }
    });
}

/*
* 盘点单提交、删除、取消提交
*
*
* */

var doPanDianOrder = function (AS_CZHM,AS_CZZT,AS_PDQY,AS_KCCKDM,MODIFY_LX,callback) {
    var vBiz = new FYBusiness("biz.inv.st.ipt.mod");
    var vOpr1 = vBiz.addCreateService("svc.inv.st.ipt.mod", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.inv.st.ipt.mod");
    vOpr1Data.setValue("AS_CZHM", AS_CZHM);
    vOpr1Data.setValue("AS_CZZT", AS_CZZT);
    vOpr1Data.setValue("AS_PDQY", AS_PDQY);
    vOpr1Data.setValue("AS_KCCKDM", AS_KCCKDM);
    vOpr1Data.setValue("MODIFY_LX", MODIFY_LX);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            if(typeof callback === 'function'){
                callback();
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert("操作失败！");
        }
    }) ;
}

/*
* 盘点单  取消审核
* */
var doCancelPanModify= function (AS_CZHM,callback) {
    var vBiz = new FYBusiness("biz.inv.st.cancel.modify");
    var vOpr1 = vBiz.addCreateService("svc.inv.st.cancel.modify", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.inv.st.cancel.modify");
    vOpr1Data.setValue("AS_CZHM", AS_CZHM);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            if(typeof callback === 'function'){
                callback();
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert("操作失败！");
        }
    }) ;
}

//通过 颜色 和 型号 反推 扫描条码函数
function getcantm(color,style) {
    var xttxhm;
    for(var i = 0; i < result.length; i++){
        if(result[i].xtysmc == color && result[i].xtwpxh == style){
            xttxhm = result[i].xttxhm;
        }
    }
    return xttxhm;
}
//通过 颜色 和 型号 反推 sku的函数
function getSku(color,style) {
    var sku;
    for(var i = 0; i < result.length; i++){
        if(result[i].xtysmc == color && result[i].xtwpxh == style){
            sku = result[i].xtwpdm;
        }
    }
    return sku;
}
//依据颜色 获取 该颜色下所有的型号
function getStyle(color) {
    var arr =[];
    for(var i = 0 ;i<result.length;i++){
        if(color == result[i].xtysmc){
            arr.push(result[i].xtwpxh)
        }
    }
    return arr;
}
//通过 颜色+型号（即sku） 从 临时数据中获取 数量
function getNum(color,style) {
    var num;
    for(var i = 0;i<result.length;i++){
        if(color == result[i].xtysmc && style ==result[i].xtwpxh){
            num = result[i].kczksl || '0';
        }
    }
    return num;
}
//通过 sku值 查 数量
function getcontNum(sku,arr) {
    var num;
    for(var i = 0;i<arr.length;i++){
        if(sku == arr[i].sku ){
            num = arr[i].num;
        }
    }
    return num;
}

//明细页面数据处理
function dtlPageDeal() {

    // var tempinsertArr=[];
    // var tempupdateArr=[];
    // updOuter:
    //     for(var i=0;i<data.length;i++){
    //         for(var j=0;j<tempArr.length;j++){
    //             if(data[i].ksdm==tempArr[j].ksdm){
    //                 dealArr(data[i].cont,tempArr[j].cont);
    //                 continue updOuter;
    //             }
    //         }
    //
    //         for(var m=0;m<data[i].cont.length;m++){
    //             tempinsertArr.push(data[i].cont[m]);
    //         }
    //     }
    //
    // function dealArr(outArr,inArr) {
    //     outer:
    //         for(var i=0;i<outArr.length;i++){
    //             var flag=false;
    //             var calnum=0;
    //             var outSku=outArr[i].sku;
    //             for(var j=0;j<inArr.length;j++){
    //
    //                 if(outSku==inArr[j].sku){
    //                     flag=true;
    //                     if(outArr[i].num!=inArr[j].num){
    //                         tempupdateArr.push(outArr[i]);
    //
    //                         continue;
    //                     }
    //
    //                 }
    //                 calnum++;
    //             }
    //
    //             if(!flag&&calnum==inArr.length){
    //                 tempinsertArr.push(outArr[i]);
    //             }
    //         }
    // }
    //
    // if(tempinsertArr.length>0||tempupdateArr.length>0){
    //
    // }else{
    //     auditflag=true;
    //     $("#oper_save").addClass("cabsdot_bosdt");
    // }

}


//要货单、调入单、调出单、收货单、入库单 明细页面添加明细数据处理
function orderDtlDataDeal(type){
    try{
        //var cloneData=deepClone(data);
        if(type=="scan"){
            outOuter:
                for(var i=0;i<data.length;i++){
                    if(data[i].ksdm==scanObj.ksdm) {

                        for (var j = 0; j < data[i].cont.length; j++) {

                            if (scanObj.cont[0].sku == data[i].cont[j].sku) {
                                data[i].cont[j].num += scanObj.cont[0].num;

                                break outOuter;
                            }

                            data[i].cont.push(scanObj.cont[0]);
                            //data[i].cont.pop();//data.cont数组中会出现一个重复的元素（未找到原因，先手动删除）
                            break outOuter;

                        }


                        data.push(scanObj);
                        break outOuter;
                    }
                }

        }else{
            if(data.length==0){
                for(var i=0;i<tempDtlArr.length;i++){
                    data.push(tempDtlArr[i]);
                }
            }
        }

    }catch (e){
        console.error(e);
    }
}

//深度克隆
function deepClone(obj){
    var result,oClass=isClass(obj);
    //确定result的类型
    if(oClass==="Object"){
        result={};
    }else if(oClass==="Array"){
        result=[];
    }else{
        return obj;
    }
    for(key in obj){
        var copy=obj[key];
        if(isClass(copy)=="Object"){
            result[key]=arguments.callee(copy);//递归调用
        }else if(isClass(copy)=="Array"){
            result[key]=arguments.callee(copy);
        }else{
            result[key]=obj[key];
        }
    }
    return result;
}
//返回传递给他的任意对象的类
function isClass(o){
    if(o===null) return "Null";
    if(o===undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}

// 根据扫描的内容 判断是不是之前添加过或者需要重新查询过程添加
function checkCode(code) {
    var txhm = code ||"";
    var cont = [];
    var num = 0;
    for(var a = 0; a<data.length;a++){
        cont = cont.concat(data[a].cont);
    }
    if(cont.length == 0){
        tmGetProDtl(txhm,function (res) {
            doSanMess(res);
        });
    }else {
        for(var b = 0;b<cont.length;b++){
            if(txhm == cont[b].txhm){
                num = cont[b].num;
                cont[b].num = num+1;
                showDataDtl();
            }else {
                tmGetProDtl(txhm,function (res) {
                    doSanMess(res);
                });
            }
        }
    }
}
function doSanMess(res) {
    //处理 结果集 向着数据要求的格式，处理并添加到data中
    var obj ={};
    obj.ksdm = res[0].xtwpks;
    obj.ksmc = res[0].xtwpmc;
    obj.cont =[{'color':res[0].xtysmc,'price':res[0].wpxsdj,'num':1,'style':res[0].xtwpxh,'sku':res[0].xtwpdm,'ksmc':res[0].xtwpmc,'jldw':res[0].xtjldw,'txhm':res[0].xttxhm}];
    data.push(obj);
    showDataDtl();
}
// 通过 扫描的条形码 获取商品信息
function tmGetProDtl(code,callback) {
    var vBiz = new FYBusiness("biz.cqxyapp.common.xtwltxm.qry");
    var vOpr1 = vBiz.addCreateService("svc.cqxyapp.common.xtwltxm.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.cqxyapp.common.xtwltxm.qry");
    vOpr1Data.setValue("AS_XTTXHM", code);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getResult(d, "AC_RESULT").rows || [];
            if(typeof callback === 'function'){
                callback(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}

/*
 * 11.6
 * 关于销售的过程
 * */
//销售 获取销售门店
var getPosStore = function(callback) {
    var vBiz = new FYBusiness("biz.possale.ckwl.qry");
    var vOpr1 = vBiz.addCreateService("svc.possale.ckwl.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID",LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.possale.ckwl.qry");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getResult(d, "AC_RESULT").rows || [];
            if(typeof callback === 'function'){
                callback(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}
//根据 门店 选择 店员（导购）
function getGuide(storedm,callback) {
    var vBiz = new FYBusiness("biz.pos.sale.daogou");
    var vOpr1 = vBiz.addCreateService("svc.pos.sale.daogou", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.sale.daogou");
    vOpr1Data.setValue("AS_KCCKDM", storedm);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getResult(d, "AC_DAOGOU").rows || [];
            if(typeof callback === 'function'){
                callback(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
        }
    }) ;
}

//获取 日期
var getHandDate = function (AS_KCCKDM,callback) {
    var vBiz = new FYBusiness("biz.pos.sale.kcczrq");
    var vOpr1 = vBiz.addCreateService("svc.pos.sale.kcczrq", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.sale.kcczrq");
    vOpr1Data.setValue("AS_KCCKDM", AS_KCCKDM);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var resRqmes = vOpr1.getResult(d, "AC_KCCZRQ").rows || [];
            if(typeof callback === 'function'){
                callback(resRqmes);
            }
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}

//获取POS机列表
function getMachine(AS_KCCKDM,callback){
    var vBiz = new FYBusiness("biz.pos.sale.pos");
    var vOpr1 = vBiz.addCreateService("svc.pos.sale.pos", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.sale.pos");
    vOpr1Data.setValue("AS_KCCKDM", AS_KCCKDM);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var resMachine = vOpr1.getResult(d, "AC_POS").rows || [];
            if(typeof callback === 'function'){
                callback(resMachine);
            }
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}



/*处理  data数据的 公用方法*/
//通过 ksdm 找到 对应的cont
function fromDataGetCont() {
    var cont = [];
    for(var i = 0; i<data.length; i++){
        if(ksdm == data[i].ksdm){
            cont = data[i].cont;
        }
    }
    return cont;
}
function fromTempdataGetCont() {
    var cont = [];
    for(var i = 0; i<data.length; i++){
        if(ksdm == data[i].ksdm){
            cont = data[i].cont;
        }
    }
    return cont;
}
// 通过sku 获取cont 中的数量
function fromContGetNum(cont,sku) {
    var num = 0;
    var arr =[];
    if(cont.length == 0){
        num = 0;
    }else {
        // sku 不一定存在 cont中。先验证
        for(var i =0; i<cont.length;i++){
            arr.push(cont[i].sku);
        }
        if(arr.val_in_array(sku)){
            var i = arr.indexOf(sku);
            num = cont[i].num;
        }else {
            num = 0;
        }
    }
    return num;
}

// 通过sku 获取cont 中的行号
function fromContGetSerial(cont,sku) {
    var num = 0;

    if(dtlFlag){
        var arr =[];
        if(cont.length == 0){
            num = 0;
        }else {
            // sku 不一定存在 cont中。先验证
            for(var i =0; i<cont.length;i++){
                arr.push(cont[i].sku);
            }
            if(arr.val_in_array(sku)){
                var i = arr.indexOf(sku);
                num = cont[i].serialnum;
            }else {
                num = 0;
            }
        }

    }

    return num;
}

//切换 销售类型
function changeData(sytle) {
    /*
     * 18-4-8 新需求 加了 批发价（商品默认显示批发价！）  和 选择零售类型
     * 由于 存在切换 销售类型 ，所以 数据展示也跟着类型不同 展示不同的价格！！
     * 注意一点;对于 改过价格 的 不受 销售类型的 影响 ！！！都显示 改后的价格
     * */
    if(data.length ==0){
        return;
    }
    for(var i = 0; i<data.length; i++){
        var cont =  data[i].cont;
        for(var m = 0; m< cont.length;m++){
            if((Number(cont[m].price) == cont[m].wpdj) || (Number(cont[m].price) == cont[m].wppfdj)){
                if(sytle == '零售'){
                    cont[m].price = cont[m].wpdj;
                }
                if(sytle == '批发'){
                    cont[m].price = cont[m].wppfdj;
                }
            }
        }
    }
}


//精确 加法
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

// 精确 乘法
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
