localStorage.his = 'qry_pro_salesdtl';
localStorage.prev = 'qry_pro_sales';
//季节
var seasonArr=[{code: '01', title: '春'}, {code: '02', title: '夏'}, {code: '03', title: '秋'}, {code: '04', title: '冬'}, {code: '05', title: '春夏'}, {code: '06', title: '秋冬'}];
//计量单位
var unitArr=[{code: '01', title: '件'}, {code: '02', title: '双'}, {code: '03', title: '条'}, {code: '04', title: '个'}, {code: '05', title: '套'}];
//颜色
var colorArr=[];
//尺码
var sizeArr=[];
//品牌
var brandArr=[];
//厂商
var companyArr=[];
//类别
var categoryArr=[];
//入库仓库
var storeresurt = [];
var ckmcarr = [];
var ckdmarr = [];
var check_ckdm = '';
//物品代码
var recordcode = localStorage.recordcode;//判断 新增 还是 编辑

var saveObj={};//数据保存对象
var windowType="";//新增弹窗类型
var pageFlag="";//页面标识：新增/编辑
var colorgroup="";//颜色组
var sizegroup="";//尺码组

var data={};
var datas = [];//新增 库存 操作的数据

var flag="list";//颜色尺码新增点击页面的类型，默认为列表点击
var img = '';
var extname = '';

//var cbqx = 'Y';
$(function () {
    getqx(function (res) {
        cbqx = res[0].xtcbqx;
        syqx = res[0].xtsyqx;
        // console.log(cbqx);
        // console.log(syqx);
        if(cbqx == "N"){
            $('#inprice').addClass('none');
        }
    })
    //查询明细信息
    if(recordcode==""){
        pageFlag="add";
        $("#unit").val("件");
        $("#unit").attr("data-code","01");
        $("#girard").removeAttr("readonly");
        $("#name").removeAttr("readonly");
        $("#price").removeAttr("readonly");
        $("#saleprice").removeAttr("readonly");
        $("#wholesalePrice").removeAttr("readonly");
        //$("#storeNum").removeAttr("readonly");
    }else{
        pageFlag="edit";
        getDataDtl(recordcode);
        $("#name").removeAttr("readonly");
        $("#price").removeAttr("readonly");
        $("#saleprice").removeAttr("readonly");
        $("#wholesalePrice").removeAttr("readonly");
    }

    //库存数的 设定 默认执行了  由于 需要一个默认的 库存
    getcangku(function (res) {
        // console.error(res);
        storeresurt = res || [];
        for(var i = 0; i<storeresurt.length; i++){
            ckmcarr.push(storeresurt[i].kcckmc);
            ckdmarr.push(storeresurt[i].kcckdm);
        }
        check_ckdm = storeresurt[0].kcckdm;
    })


    //获取下拉、弹窗列表的数据
    getComboList();
    //点击图片查看大图
    $('body').hammer().on('tap','#check_img',function (event) {
        event.stopPropagation();
        var src = $(this).attr('src');
        if(!wfy.empty(src)){
            var clih = document.body.clientHeight;
            var cliw = document.body.clientWidth;
            var top = (clih-cliw)/2;
            console.error(top)
            $('.iosalert').removeClass('none');
            $('#iosImg').attr('src',src).css({
                'margin-top':top
            })
            setTimeout(function () {
                $('#iosImg').css({
                    'transform': 'scale(1)',
                    '-webkit-transform': 'scale(1)'
                });
            },0)
        }
    });

    //选择图片
    $('body').hammer().on('change','#uploadImage',function (event) {
        event.stopPropagation();
        // $(this).imgloadsize();
        // extname = $('#fileId').attr('extname');
        localStorage.isupdataImg = 'Y';//是否换过图片
    });

    //颜色
    $('body').hammer().on('tap', '#color', function (event) {
        event.stopPropagation();

        var code=$(this).attr("data-code");
        windowType="color";
        createWindow(windowType,code);
        $("#tosttop").removeClass('y100');
    });
    //尺码
    $('body').hammer().on('tap', '#size', function (event) {
        event.stopPropagation();
        var code=$(this).attr("data-code");
        windowType="size";
        createWindow(windowType,code);
        $("#tosttop").removeClass('y100');
    });

    //库存数
    $('body').hammer().on('tap', '#storeNum', function (event) {
        event.stopPropagation();
        //只在新增的时候有效果！
        if(pageFlag=="add"){
            creatstoreNum();
            windowType="store";
            $("#tosttop").removeClass('y100');
        }
    });


    //选择弹出层 点击关闭按钮
    $('body').hammer().on('tap','#tost_cancel',function (event) {
        event.stopPropagation();
        $("#tosttop").addClass('y100');
    });
    //选择弹出层 点击某个按钮
    $('body').hammer().on('tap','.tost_title_list',function (event) {
        event.stopPropagation();
        if(!$(this).hasClass('noedit')){
            if(!$(this).hasClass('addcheck')){
                $(this).addClass('addcheck');
            }else {
                $(this).removeClass('addcheck');
            }
        }
    });
    //选择弹出层 确定按钮
    $('body').hammer().on('tap','#tost_true',function (event) {
        event.stopPropagation();
        //x新增库存数的确定 if else
        if(windowType=="store"){
            //把总数拿过来。顺便 将具体数据记录！~~~ 一边再次点开的时候保存之前的数据，继续操作~~ 组一个大的数据，顺便在保存的时候也用！！
            var totalnum = 0;
            datas = [];
            $('#tosttop_cont .addstorenum').each(function (index) {
                var obj = {'colorstr':'',"colordm":'',"total":'','num':[]}
                obj.colorstr = $(this).children('dt').find('.addstorenum_name').html();
                obj.colordm = $(this).children('dt').find('.addstorenum_name').attr('data-colordm');
                obj.total = $(this).children('dt').find('.dt_num').val();
                $(this).children('dd').each(function () {
                    var numobj = {'sizestr':'','sizedm':'','sizenum':''}
                    numobj.sizestr = $(this).find('.addstorenum_name').html();
                    numobj.sizedm = $(this).find('.addstorenum_name').attr('data-code');
                    numobj.sizenum = $(this).find('.dd_num').val();
                    obj.num.push(numobj);
                })
                datas.push(obj);
                var num = Number($(this).children('dt').find('.dt_num').val());
                totalnum += num;
            })
            console.log(datas);
            $('#storeNum').val(totalnum);

        }else {
            //原先的 代码 执行
            var groupArr=[];
            var codeArr=[];
            var nameArr=[];
            var serialArr=[];
            $('#tosttop_cont .addcheck').each(function () {
                groupArr.push($(this).attr('data-group'));
                codeArr.push($(this).attr('data-code'));
                nameArr.push($(this).html());
                if(windowType=="size"){
                    serialArr.push($(this).attr('data-serial'));
                }
            });
            $("#"+windowType).attr("data-code",codeArr.join());
            $("#"+windowType).val(nameArr.join());
            if(windowType == 'color'){
                $('#color').val(nameArr.join())
            }
            if(windowType == 'color'){
                $('#color').val(nameArr.join())
            }
            if(windowType=="size"){
                $("#"+windowType).attr("data-serial",serialArr.join());
            }
        }
        $("#tosttop").addClass('y100');
    })
    $('body').hammer().on('tap', '#createStore', function (event) {
        event.stopPropagation();
        console.error(0)
        $("#createStore").picker({
            title: "请选择仓库",
            cols: [
                {
                    textAlign: 'center',
                    values:ckmcarr
                }
            ],
            onChange:function (p) {
                var vue = p.value[0];
                for(var m = 0; m<ckmcarr.length; m++){
                    if(vue == ckmcarr[m]){
                        check_ckdm = ckdmarr[m];
                    }
                }
            }
        });
    });
    //++
    $('body').hammer().on('tap', '.dt_add', function (event) {
        event.stopPropagation();
        var dom = $(this).parents('dl').find('dd');
        var total_num = 0;
        dom.each(function () {
            var this_dom = $(this).find('.dd_num').val();
            this_dom ++;
            total_num += Number(this_dom);
            $(this).find('.dd_num').val(this_dom);
        })
        $(this).prev().val(total_num);
    });
    //--
    $('body').hammer().on('tap', '.dt_redu', function (event) {
        event.stopPropagation();
        var dom = $(this).parents('dl').find('dd');
        var total_num = 0;
        dom.each(function () {
            var this_dom = $(this).find('.dd_num').val();
            if(this_dom>0){
                this_dom --;
            }
            total_num += Number(this_dom);
            $(this).find('.dd_num').val(this_dom);
        })
        $(this).next().val(total_num);
    });
    //+
    $('body').hammer().on('tap', '.dd_add', function (event) {
        event.stopPropagation();
        var num = $(this).prev().val();
        num ++;
        $(this).prev().val(num);
        var dom = $(this).parents('dl').find('dd');
        var total_num = 0;
        dom.each(function () {
            var this_dom = $(this).find('.dd_num').val();
            total_num += Number(this_dom);
        })
        $(this).parents('dl').find('.dt_num').val(total_num);
    });
    //-
    $('body').hammer().on('tap', '.dd_redu', function (event) {
        event.stopPropagation();
        var num = $(this).next().val();
        if(num>0){
            num --;
        }
        $(this).next().val(num);
        var dom = $(this).parents('dl').find('dd');
        var total_num = 0;
        dom.each(function () {
            var this_dom = $(this).find('.dd_num').val();
            total_num += Number(this_dom);
        })
        $(this).parents('dl').find('.dt_num').val(total_num);
    });
    //blur




    //品牌
    $('body').hammer().on('tap', '#brand', function (event) {
        event.stopPropagation();
        var html = '';
        for(var i = 0; i <brandArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+brandArr[i].xtwppp+'" data-type="brand">'+brandArr[i].xtppmc+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //厂商
    $('body').hammer().on('tap', '#company', function (event) {
        event.stopPropagation();

        var html = '';
        for(var i = 0; i <companyArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+companyArr[i].xtwldm+'" data-type="company">'+companyArr[i].xtwlmc+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //季节
    $('body').hammer().on('tap', '#season', function (event) {
        event.stopPropagation();
        var html = '';
        for(var i = 0; i <seasonArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+seasonArr[i].code+'" data-type="season">'+seasonArr[i].title+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //类别
    $('body').hammer().on('tap', '#category', function (event) {
        event.stopPropagation();
        var html = '';
        for(var i = 0; i <categoryArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+categoryArr[i].xtwplb+'" data-type="category">'+categoryArr[i].xtlbmc+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //计量单位
    $('body').hammer().on('tap', '#unit', function (event) {
        event.stopPropagation();
        var html = '';
        for(var i = 0; i <unitArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+unitArr[i].code+'" data-type="unit">'+unitArr[i].title+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //点击选择弹出的模式
    $('body').hammer().on('tap','#multi_box .item',function (event) {
        event.stopPropagation();
        var nodeId= $(this).attr('data-type');
        var selCode= $(this).attr('data-code');
        var selName= $(this).html();
        $("#"+nodeId).attr("data-code",selCode);
        $("#"+nodeId).val(selName);
        wfy.closeWin();
    });

    //点击 新增按钮 弹出窗口
    $('body').hammer().on('tap', '.comboadd', function (event) {
        event.stopPropagation();
        var typdcode=$(this).parent().find('input')[0].name;
        var typeid=$(this).parent().find('input')[0].id;

        var window_title="";
        var field_code_title="";
        var field_name_title="";

        if(typdcode=="color"){
            window_title="新增颜色";
            field_code_title="颜色代码";
            field_name_title="颜色";
            $("#code_div").addClass("none");
            $("#name_div").removeClass("none");
            $("#addwindow").attr("style","height:153px;");

        }else if(typdcode=="size"){
            window_title="新增尺码";
            field_code_title="尺码代码";
            field_name_title="尺码";
            $("#code_div").addClass("none");
            $("#name_div").removeClass("none");
            $("#addwindow").attr("style","height:153px;");

        }else if(typdcode=="brand"){
            window_title="新增品牌";
            field_code_title="品牌代码";
            field_name_title="品牌";
            $("#code_div").addClass("none");
            $("#name_div").removeClass("none");
            $("#addwindow").attr("style","height:153px;");

        }else if(typdcode=="category"){
            window_title="新增类别";
            field_code_title="类别代码";
            field_name_title="类别";
            $("#code_div").addClass("none");
            $("#name_div").removeClass("none");
            $("#addwindow").attr("style","height:153px;");
        }
        $("#window_title").html(window_title);
        $("#field_code_title").html(field_code_title);
        $("#field_name_title").html(field_name_title);
        wfy.openWin("addwindow");
        $('#addwindow').attr("data-type",typdcode);
        $('#addwindow').css("bottom","240px");

        if(typdcode!=typeid){
            flag="win";//弹窗点击
            $("#coverBack").attr("style","z-index:150;");
        }

        $("#field_name").focus();
    });

    //新增弹窗 确认按钮
    $('body').hammer().on('tap', '#btn_sure', function (event) {
        event.stopPropagation();
        var type=$("#addwindow").attr("data-type");
        var code=getValidStr($("#field_code").val());
        var name=getValidStr($("#field_name").val());
        if(name==""){
            wfy.alert("名称不能为空");
            return;
        }
        addData_save(type,code,name);
        addWindowReset();
        getComboList();
        wfy.closeWin("addwindow");
        $('#addwindow').css("bottom","-270px");

    });

    //新增弹窗 取消按钮
    $('body').hammer().on('tap', '#btn_cancel', function (event) {
        event.stopPropagation();
        addWindowReset();
        wfy.closeWin("addwindow");
        $('#addwindow').css("bottom","-270px");
    });

    //点击保存按钮
    //onkeyup="this.value=this.value.replace(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/g,'')"
    $('body').hammer().on('tap', '#pro_save', function (event) {
        event.stopPropagation();
        saveObj.girard=getValidStr($("#girard").val());
        saveObj.name=getValidStr($("#name").val());
        saveObj.productcode=getValidStr($("#productcode").attr("data-code")).split(";");
        saveObj.colorgroup=getValidStr($("#color").attr("data-group"));
        saveObj.color=getValidStr($("#color").attr("data-code")).split(",");
        saveObj.colorname=getValidStr($("#color").val()).split(",");
        saveObj.sizegroup=getValidStr($("#size").attr("data-group"));
        saveObj.size=getValidStr($("#size").attr("data-code")).split(",");
        saveObj.sizeserial=getValidStr($("#size").attr("data-serial")).split(",");
        saveObj.brand=getValidStr($("#brand").attr("data-code"));
        saveObj.company=getValidStr($("#company").attr("data-code"));
        saveObj.price = cbqx == 'Y' ? getValidStr($("#price").val()) : 0 ;
        saveObj.saleprice=getValidStr($("#saleprice").val());
        saveObj.wholesalePrice=getValidStr($("#wholesalePrice").val());
        saveObj.storeNum=getValidStr($("#storeNum").val());
        saveObj.season=getValidStr($("#season").attr("data-code"));
        saveObj.category=getValidStr($("#category").attr("data-code"));
        saveObj.unit=getValidStr($("#unit").attr("data-code"));

        if(saveObj.girard==""){
            wfy.alert("款号不能为空");
            return;
        }else {
            var flag=checkkshi(saveObj.girard);
            if(!flag){
                wfy.alert("只能输入字母和数字");
                return;
            }
        }
        if(saveObj.name==""){
            wfy.alert("名称不能为空");
            return;
        }else {
            var flag=saveObj.name.length;
            if(flag>10){
                wfy.alert("最多输入10位");
                return;
            }
        }

        if(cbqx == 'Y'){
            if(saveObj.price == ""){
                wfy.alert("进价不能为空");
                return;
            }else{
                var flag=priceVali(saveObj.price);
                if(!flag){
                    wfy.alert("请填写有效的进价");
                    return;
                }
            }
        }
        if(saveObj.wholesalePrice==""){
            wfy.alert("批发不能为空");
            return;
        }else{
            var flag=priceVali(saveObj.wholesalePrice);
            if(!flag){
                wfy.alert("请填写有效的批发价");
                return;
            }
        }
        if(saveObj.saleprice==""){
            wfy.alert("售价不能为空");
            return;
        }else{
            var flag=priceVali(saveObj.saleprice);
            if(!flag){
                wfy.alert("请填写有效的售价");
                return;
            }
        }
        if(pageFlag == "add"){
            checkKS(function (res) {
                console.log(res)
                if(res == 'N'){
                    wfy.alert('此款商品已存在,请通过原商品修改');
                    return;
                }
                if(localStorage.isupdataImg == 'Y'){
                    imgupdate();
                }else {
                    dataSave();
                }

            })
        }else {
            if(localStorage.isupdataImg == 'Y'){
                imgupdate();
            }else {
                dataSave();
            }

        }
        //如果 换过图片 就执行 图片上传
    })


});




//验证 款式是否存在
var checkKS = function (callback) {
    var vBiz = new FYBusiness("biz.ctlitem.item.save.kscheck");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.item.save.kscheck", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID",LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.item.save.kscheck");
    vOpr1Data.setValue("AS_XTWPKS", saveObj.girard);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.error(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getOutputPermeterMapValue(d, 'AS_CKRELT');
            //console.error(res)
            if(typeof callback === 'function'){
                callback(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
            return;
        }
    })
}

function imgname() {
    var time = new Date();
    var name = 'upload'+time.getTime();
    return name;
}
//获取下拉弹唱数据值
function getComboList() {
    var vBiz = new FYBusiness("biz.ctlitem.baseitem.list");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.baseitem.list", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.baseitem.list");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            colorArr = vOpr1.getResult(d, "AC_COLOR").rows || [];
            colorgroup=colorArr[0].wpyszb;
            sizeArr = vOpr1.getResult(d, "AC_SIZE").rows || [];
            sizegroup=sizeArr[0].wpxhzb;
            brandArr = vOpr1.getResult(d, "AC_BRAND").rows || [];
            categoryArr = vOpr1.getResult(d, "AC_CATEGORY").rows || [];
            companyArr = vOpr1.getResult(d, "AC_SUPPLIER").rows || [];

        } else {
            wfy.alert("获取数据失败,"+d.errorMessage);
        }
    }) ;
}

//生成颜色尺码弹窗数据
function createWindow(type,selData) {
    var selArr=selData.split(",");
    var html='<input type="hidden" id="win_type" name="'+type+'"/>';
    if(type=="color"){
        if(colorArr.length != 0){
            outer:
                for(var i = 0;i<colorArr.length; i++){
                    for(var j=0;j<selArr.length;j++){
                        if(colorArr[i].xtwpys==selArr[j]){
                            if(pageFlag=="edit"){
                                html+= '<div class="tost_title_list addcheck noedit" data-group="'+colorArr[i].wpyszb+'" data-code="'+colorArr[i].xtwpys+'">'+colorArr[i].xtysmc+'</div>';
                            } else{
                                html+= '<div class="tost_title_list addcheck" data-group="'+colorArr[i].wpyszb+'" data-code="'+colorArr[i].xtwpys+'">'+colorArr[i].xtysmc+'</div>';
                            }
                            continue outer;
                        }
                    }
                    html+= '<div class="tost_title_list" data-group="'+colorArr[i].wpyszb+'" data-code="'+colorArr[i].xtwpys+'">'+colorArr[i].xtysmc+'</div>';
                }
        }
        html+= '<div class="tost_title_list comboadd" style="border: dashed 1px #999;color: #999;">&#xe6b9;</div>';
    }else{
        //尺码
        if(sizeArr.length != 0){
            outer:
                for(var i = 0;i<sizeArr.length; i++){
                    for(var j=0;j<selArr.length;j++){
                        if(sizeArr[i].xtwpxh==selArr[j]){
                            if(pageFlag=="eidt"){
                                html+= '<div class="tost_title_list addcheck noedit" data-group="'+sizeArr[i].wpxhzb+'" data-code="'+sizeArr[i].xtwpxh+'" data-serial="'+sizeArr[i].xtxhxh+'">'+sizeArr[i].xtwpxh+'</div>';
                            } else{
                                html+= '<div class="tost_title_list addcheck" data-group="'+sizeArr[i].wpxhzb+'" data-code="'+sizeArr[i].xtwpxh+'" data-serial="'+sizeArr[i].xtxhxh+'">'+sizeArr[i].xtwpxh+'</div>';
                            }
                            continue outer;
                        }
                    }
                    html+= '<div class="tost_title_list" data-group="'+sizeArr[i].wpxhzb+'" data-code="'+sizeArr[i].xtwpxh+'" data-serial="'+sizeArr[i].xtxhxh+'">'+sizeArr[i].xtwpxh+'</div>';
                }
        }
        html+= '<div class="tost_title_list comboadd" style="border: dashed 1px #999;color: #999;">&#xe6b9;</div>';
    }
    $("#tosttop_cont").html(html);
}

function creatstoreNum() {
    var colorstr = wfy.empty($('#color').val()) ? '均色' : $('#color').val();
    var colorcode = wfy.empty($('#color').attr('data-code')) ? '01':$('#color').attr('data-code');//默认均色 01
    var sizestr = wfy.empty($('#size').val()) ? '均码' : $('#size').val();
    var sizecode = wfy.empty($('#size').attr('data-code')) ? 'F':$('#size').attr('data-code');//默认均码 F
    var colorstrarr = colorstr.split(',');
    var colorcodearr = colorcode.split(',');
    var sizestrarr = sizestr.split(',');
    var sizecodearr = sizecode.split(',');
    //如果 datas中有 数据 则说明 之前添加过！！！so 要浮现内容
    console.log(datas)

    var html = '';
    var a=b=c ='';
    html += ' <ul class="bill_head_cont thd ts200">' +
        '<li><span>仓/店</span><input class="createTime" value="'+storeresurt[0].kcckmc+'"  readonly="readonly"  id="createStore" placeholder="---"></li>' +
        '<li style="height: 0px"></li>' +
        '</ul>';
    for(var i = 0; i<colorstrarr.length; i++){
        try {
            var flg = wfy.empty(datas[i].total);
            flg ? a = 0  : a = datas[i].total;
            flg ? b = [] : b = datas[i].num;
        }
        catch (e){
            a = 0;
            b = []
        }

        html+='<dl class="addstorenum">'+
            '<dt>'+
            '<span class="addstorenum_name" data-colordm ="'+colorcodearr[i]+'">'+colorstrarr[i]+'</span>'+
            '<div class="addstorenum_n"><em class="dt_redu">&#xe66a</em><input class="dt_num" type="tel" value="'+a+'"><em class="dt_add">&#xe6b9</em></div>'+
            '</dt>';
        for(var m = 0; m<sizestrarr.length; m++){
            try{
                var flg = wfy.empty(b);
                flg ? c = 0 : c= b[m].sizenum;
            }catch (e){
                c = 0;
            }
            html+= '<dd>'+
                '<span class="addstorenum_name" data-code = "'+sizecodearr[m]+'">'+sizestrarr[m]+'</span>'+
                '<div class="addstorenum_n"><em class="dd_redu">&#xe66a</em><input class="dd_num" type="tel" value="'+c+'"><em class="dd_add">&#xe6b9</em></div>'+
                '</dd>';
        }
        html+= '</dl>';

    }
    $("#tosttop_cont").html(html);
    //用上边的try catch 一遍处理的数据 每个颜色的总数有点问题（加加减减型号的情况） 所以 每个款式的总数要从 对应的 型号中重新获取之和！！！!
    $('#tosttop_cont .addstorenum').each(function () {
        var dom = $(this).children('dd');
        var d = 0;
        dom.each(function () {
            var num = $(this).find('.dd_num').val();
            d += Number(num);
        })
        $(this).children('dt').find('.dt_num').val(d);
    })



    $('.dt_num').blur(function () {
        var value = $(this).val();
        $(this).parents('.addstorenum').find('.dd_num').val(value);
        var len = $(this).parents('.addstorenum').find('dd').length;
        $(this).val(value*len);
    })
    $('.dd_num').blur(function () {
        var dom = $(this).parents('.addstorenum').children('dd');
        var d = 0;
        dom.each(function () {
            var num = $(this).find('.dd_num').val();
            d += Number(num);
        })
        $(this).parents('.addstorenum').children('dt').find('.dt_num').val(d);
    })

    // $('.dt_num').on('input propertychange',function () {
    //     console.error(1)
    //     var value = $(this).val();
    //     console.error(value)
    //     $(this).parents('.addstorenum').find('.dd_num').val(value);
    //     var len = $(this).parents('.addstorenum').find('dd').length;
    //     $(this).val(value*len);
    // })
    // $('.dd_num').on('input propertychange',function () {
    //     var dom = $(this).parents('.addstorenum').children('dd');
    //     var d = 0;
    //     dom.each(function () {
    //         var num = $(this).val();
    //         d += Number(num);
    //     })
    //     $(this).parents('.addstorenum').children('dt').find('.dt_num').val(d);
    // })
}




//获取数据明细
function getDataDtl(record) {
    var vBiz = new FYBusiness("biz.ctlitem.itemdetail.qry");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.itemdetail.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.itemdetail.qry");
    vOpr1Data.setValue("AS_XTWPKS", record);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip));
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var result = vOpr1.getResult(d, "AC_RESULT").rows || [];
            console.log(result)
            queryDataDeal(result);
        } else {
            wfy.alert("数据查询失败,"+d.errorMessage);
        }
    }) ;
}
//查询数据处理
function queryDataDeal(rows) {
    //qsgymc: nullwpcbdj: 1wpqsgy: nullwpxhzb: "A0"wpxsdj: 1xtjldw: "01"xtjlmc: "件"xtlbmc: nullxtppmc: nullxtpzgg: "01"xtwpdm: "A011101L"xtwpjj: nullxtwpks: "111"xtwplb: nullxtwpmc: "111"xtwppp: nullxtwpxh: "L"xtxhxh: 12xtysmc: "白色"xtyszb: "A0"
    data={
        girard:rows[0].xtwpks,
        name:rows[0].xtwpmc,
        productcode:"",
        //colorgroup:colorgroup,
        color:[],
        colorname:[],
        //sizegroup:sizegroup,
        sizecode:[],
        size:[],
        brand:rows[0].xtwppp,
        brandname:rows[0].xtppmc,
        company:rows[0].wpqsgy,
        companyname:rows[0].qsgymc,
        price:rows[0].wpcbdj,
        saleprice:rows[0].wpxsdj,
        wholesalePrice:rows[0].wppfdj,
        season:rows[0].xtwpjj,
        seasonname:"",
        category:rows[0].xtwplb,
        categoryname:rows[0].xtlbmc,
        unit:rows[0].xtjldw,
        unitname:rows[0].xtjlmc,
        img:rows[0].xtwplj
    };

    for(var i=0;i<seasonArr.length;i++){
        if(data.season==seasonArr[i].code){
            data.seasonname=seasonArr[i].title;
        }
    }
    var productStr="";
    var code="";
    for(var i=0;i<rows.length;i++){
        var temp=rows[i];
        code=temp.xtpzgg;
        if($.inArray(temp.xtwpxh,data.size)<0){
            data.sizecode.push(temp.xtxhxh);
            data.size.push(temp.xtwpxh);
        }
        if($.inArray(temp.xtpzgg,data.color)<0){
            data.color.push(temp.xtpzgg);
            data.colorname.push(temp.xtysmc);
        }
        productStr+=temp.xtpzgg+","+temp.xtwpxh+","+temp.xtwpdm+";";

    }
    data.productcode=productStr.substring(0,productStr.length-1);

    $("#girard").val(data.girard);
    $("#name").val(data.name);
    $("#productcode").attr("data-code",data.productcode);
    $("#color").val(data.colorname.join(","));
    $("#color").attr("data-code",data.color.join(","));
    $("#color").attr("data-group",colorgroup);
    $("#size").val(data.size.join(","));
    $("#size").attr("data-code",data.size.join(","));
    $("#size").attr("data-group",sizegroup);//尺码组别
    $("#size").attr("data-serial",data.sizecode.join(","));//尺码序号
    $("#brand").val(data.brandname);
    $("#brand").attr("data-code",data.brand);
    $("#company").val(data.companyname);
    $("#company").attr("data-code",data.company);
    $("#price").val(data.price);
    $("#saleprice").val(data.saleprice);
    $("#wholesalePrice").val(data.wholesalePrice);
    $("#storeNum").val(localStorage.kczksl);
    $("#season").val(data.seasonname);
    $("#season").attr("data-code",data.season);
    $("#category").val(data.categoryname);
    $("#category").attr("data-code",data.category);
    $("#unit").val(data.unitname);
    $("#unit").attr("data-code",data.unit);
    //console.log($('#check_img').attr('src'))
    $('#check_img').attr('src',_wfy_pic_ip+data.img)

}

//清空新增弹窗页面的数据
function addWindowReset() {
    $("#window_title").html("");
    $("#field_code_title").html("");
    $("#field_name_title").html("");
    $("#field_code").val("");
    $("#field_name").val("");
}

//价格验证
function priceVali(price) {
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

    if (reg.test(price)) {
        return true;
    }else{
        return false;
    };
}
//  款式验证
function checkkshi(style) {
    //var reg = /^[A-Za-z0-9]+$/;
    var reg = /^[A-Za-z0-9\-]+$/;
    if (reg.test(style)) {
        return true;
    }else{
        return false;
    };
}

//新增保存
function addData_save(type,code,name) {
    if(type=="color"){
        save_color(code,name);
    }else if(type=="size"){
        save_size(code,name);
    }else if(type=="brand"){
        save_brand(code,name);
    }else if(type=="category"){
        save_category(code,name);
    }
}

//新增保存之 颜色
function save_color(code,name) {
    if(name.length>5){
        wfy.alert("颜色不宜超过5个汉字");
        return;
    }
    var vBiz = new FYBusiness("biz.ctlitem.color.save");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.color.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.color.save");
    vOpr1Data.setValue("AS_XTYSZB", colorgroup);
    vOpr1Data.setValue("AS_XTPZGG", code);
    vOpr1Data.setValue("AS_XTYSMC", name);
    vOpr1Data.setValue("AS_XTYSMS", "");
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            addWindowReset();
            wfy.closeWin("addwindow");
            $('#addwindow').css("bottom","-270px");
            getComboList();
            wfy.alert("新增成功",function () {
                if(flag=="win"){
                    var code=$("#"+windowType).attr("data-code");
                    $("#tosttop_cont").html("");
                    createWindow(windowType,code);

                    flag="list";
                }
            });

        } else {
            wfy.alert("新增失败,"+d.errorMessage);
        }
    }) ;
}

//新增保存之 尺码
function save_size(code,name) {
    var vBiz = new FYBusiness("biz.ctlitem.size.save");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.size.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.size.save");
    vOpr1Data.setValue("AS_WPXHZB", sizegroup);
    vOpr1Data.setValue("AS_XTWPXH", name);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            addWindowReset();
            wfy.closeWin("addwindow");
            $('#addwindow').css("bottom","-270px");
            getComboList();

            wfy.alert("新增成功",function () {
                if(flag=="win"){
                    var code=$("#"+windowType).attr("data-code");
                    $("#tosttop_cont").html("");
                    createWindow(windowType,code);

                    flag="list";
                }
            });

        } else {
            wfy.alert("新增失败,"+d.errorMessage);
        }
    }) ;
}

//新增保存之 品牌
function save_brand(code,name) {
    var vBiz = new FYBusiness("biz.ctlitem.brand.save");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.brand.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.brand.save");
    vOpr1Data.setValue("AS_XTWPPP", code);
    vOpr1Data.setValue("AS_XTPPMC", name);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            addWindowReset();
            wfy.closeWin("addwindow");
            $('#addwindow').css("bottom","-270px");
            getComboList();

            wfy.alert("新增成功");

        } else {
            wfy.alert("新增失败,"+d.errorMessage);
        }
    }) ;
}

//新增保存之 类别
function save_category(code,name) {
    var vBiz = new FYBusiness("biz.ctlitem.category.save");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.category.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.category.save");
    vOpr1Data.setValue("AS_XTWPLB", code);
    vOpr1Data.setValue("AS_XTLBMC", name);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            addWindowReset();
            wfy.closeWin("addwindow");
            $('#addwindow').css("bottom","-270px");
            getComboList();

            wfy.alert("新增成功");

        } else {
            wfy.alert("新增失败,"+d.errorMessage);
        }
    }) ;
}

//图片上传
function imgupdate() {
    img = imgname();
    wfy.showload("正在上传图片");
    formData = new FormData();
    formData.append("src",$('#check_img').attr('src'));
    //console.log(formData.get("src"))
    $.ajax({
        url: _wfy_mobile_api_url+"?filename="+img+ "&extname="+extname,
        type: "POST",
        data: formData,
        processData: false,  // 告诉jQuery不要去处理发送的数据
        contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
        success: function(xhr){
            //console.log(xhr);
            console.log('上传成');
            dataSave();
            wfy.hideload();
        }
    });
}
//保存数据
function dataSave(){
    wfy.showload("正在保存");

    var proArr=[];
    console.log(img)
    for(var i=0;i<saveObj.productcode.length;i++){
        var temp=saveObj.productcode[i];
        if(getValidStr(temp)!=""){
            var arr=temp.split(",");
            proArr.push([arr[0],arr[1],arr[2]]);
        }
    }
    var vBiz = new FYBusiness("biz.ctlitem.item.save");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.item.save", false);
    for(var i=0;i<saveObj.color.length;i++){
        for(var j=0;j<saveObj.size.length;j++){
            var temppro="";
            for(var k=0;k<proArr.length;k++){
                if(saveObj.color[i]==proArr[k][0]&&saveObj.size[j]==proArr[k][1]){
                    temppro=proArr[k][2];
                }
            }
            var vOpr1Data = vOpr1.addCreateData();
            vOpr1Data.setValue("AS_USERID", LoginName);
            vOpr1Data.setValue("AS_WLDM", DepartmentCode);
            vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.item.save");
            vOpr1Data.setValue("AS_XTWPKS", saveObj.girard);//款式
            vOpr1Data.setValue("AS_XTWPMC", saveObj.name);//品名
            vOpr1Data.setValue("AS_XTYSZB", colorgroup);//颜色组
            vOpr1Data.setValue("AS_XTPZGG", saveObj.color[i]);//颜色
            vOpr1Data.setValue("AS_XTYSMC", saveObj.colorname[i]);//颜色名称
            vOpr1Data.setValue("AS_WPXHZB", sizegroup);//尺码组
            vOpr1Data.setValue("AS_XTWPXH", saveObj.size[j]);//尺码
            vOpr1Data.setValue("AN_XTXHXH", saveObj.sizeserial[j]);//尺码序号
            vOpr1Data.setValue("AS_XTWPPP", saveObj.brand);//品牌
            vOpr1Data.setValue("AS_WPQSGY", saveObj.company);//厂商
            vOpr1Data.setValue("AN_WPCBDJ", saveObj.price);//进价(成本价)
            vOpr1Data.setValue("AN_WPXSDJ", saveObj.saleprice);//售价
            vOpr1Data.setValue("AN_WPPFDJ", saveObj.wholesalePrice);//批发价
            vOpr1Data.setValue("AN_QCKCSL", saveObj.storeNum);//库存数量
            vOpr1Data.setValue("AS_XTWPJJ", saveObj.season);//季节
            vOpr1Data.setValue("AS_XTWPLB", saveObj.category);//类别
            vOpr1Data.setValue("AS_XTJLDW", saveObj.unit);//计量单位
            vOpr1Data.setValue("AS_XTWPLJ",'');//图片路径
            vOpr1Data.setValue("AS_XTWPDM", temppro);//物品代码
        }
    }
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            wfy.hideload();
            localStorage.isupdataImg = 'N';
            console.error(pageFlag)
            //修改 新增的时候  自动升成入库单！！
            if(pageFlag=="add" && datas.length != 0){
                getorder('RK',function (res) {
                    var czhm = res[0].operid;//操作号码
                    var xphm = res[0].orderid;//单号
                    var vBiz = new FYBusiness("biz.ctl.item.rkd.save");
                    var vOpr1 = vBiz.addCreateService("svc.ctl.item.rkd.head.save", false);
                    var vOpr1Data = vOpr1.addCreateData();
                    vOpr1Data.setValue("AS_USERID", LoginName);
                    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
                    vOpr1Data.setValue("AS_FUNC", "svc.ctl.item.rkd.head.save");
                    vOpr1Data.setValue("AS_OPERID", czhm);
                    vOpr1Data.setValue("AS_ORDERID", xphm);
                    vOpr1Data.setValue("AS_WPCKDM", check_ckdm);
                    var vOpr2 = vBiz.addCreateService("svc.ctl.item.rkd.dtl.save", false);
                    var vOpr2Data = [];
                    for(var i = 0; i<datas.length; i++){
                        var cont = datas[i].num;
                        for(var m = 0; m<cont.length;m++ ){
                            var obj = {};
                            obj.AS_USERID = LoginName;
                            obj.AS_WLDM = DepartmentCode;
                            obj.AS_FUNC = "svc.ctl.item.rkd.dtl.save";
                            obj.AS_OPERID = czhm;
                            obj.AS_ORDERID = xphm;
                            obj.AS_XTWPKS = getValidStr($("#girard").val());//款式
                            obj.AS_XTPZGG = datas[i].colordm;//颜色代码
                            obj.AS_XTWPXH = cont[m].sizedm ;//尺码序号（代码）
                            obj.AN_WPCBDJ = saveObj.price;//进价成本
                            obj.AN_QCKCSL = cont[m].sizenum //库存数量
                            obj.AS_XTJLDW = getValidStr($("#unit").attr("data-code"));//计量单位
                            obj.AS_WPCKDM = check_ckdm;
                            vOpr2Data.push(obj);
                        }
                    }
                    vOpr2.addDataArray(vOpr2Data)
                    var ip = new InvokeProc();
                    ip.addBusiness(vBiz);
                    console.log(JSON.stringify(ip));
                    ip.invoke(function(d){
                        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                            // todo...
                            wfy.alert("保存成功",function () {
                                wfy.goto("qry_pro_sales");
                            });
                        } else {
                            // todo...[d.errorMessage]
                            wfy.alert('入库单生成失败'+d.errorMessage,function () {
                                wfy.goto("qry_pro_sales");
                            });
                        }
                    }) ;
                })
            }
            if(pageFlag=="edit" || (pageFlag=="add" && datas.length == 0)){
                wfy.alert("保存成功",function () {
                    wfy.goto("qry_pro_sales");
                });
            }

        } else {
            wfy.alert("保存失败,"+d.errorMessage);
        }
    }) ;
}

//新增的时候默认生成 入库单
function addrukulist() {
    getorder('RK',function (res) {
        var czhm = res[0].operid;//操作号码
        var xphm = res[0].orderid;//单号
        var vBiz = new FYBusiness("biz.ctl.item.rkd.save");
        var vOpr1 = vBiz.addCreateService("svc.ctl.item.rkd.head.save", false);
        var vOpr1Data = vOpr1.addCreateData();
        vOpr1Data.setValue("AS_USERID", LoginName);
        vOpr1Data.setValue("AS_WLDM", DepartmentCode);
        vOpr1Data.setValue("AS_FUNC", "svc.ctl.item.rkd.head.save");
        vOpr1Data.setValue("AS_OPERID", czhm);
        vOpr1Data.setValue("AS_ORDERID", xphm);
        vOpr1Data.setValue("AS_WPCKDM", check_ckdm);
        var vOpr2 = vBiz.addCreateService("svc.ctl.item.rkd.dtl.save", false);
        var vOpr2Data = [];
        for(var i = 0; i<datas.length; i++){
            var cont = datas[i].num;
            for(var m = 0; m<cont.length;m++ ){
                var obj = {};
                obj.AS_USERID = LoginName;
                obj.AS_WLDM = DepartmentCode;
                obj.AS_FUNC = "svc.ctl.item.rkd.dtl.save";
                obj.AS_OPERID = czhm;
                obj.AS_ORDERID = xphm;
                obj.AS_XTWPKS = getValidStr($("#girard").val());//款式
                obj.AS_XTPZGG = datas[i].colordm;//颜色代码
                obj.AS_XTWPXH = cont[m].sizedm ;//尺码序号（代码）
                obj.AN_WPCBDJ = saveObj.price;//进价成本
                obj.AN_QCKCSL = cont[m].sizenum //库存数量
                obj.AS_XTJLDW = getValidStr($("#unit").attr("data-code"));//计量单位
                obj.AS_WPCKDM = check_ckdm;
            }
            vOpr2Data.push(obj);
        }
        vOpr2.addDataArray(vOpr2Data)
        var ip = new InvokeProc();
        ip.addBusiness(vBiz);
        console.log(JSON.stringify(ip));
        ip.invoke(function(d){
            if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                // todo...
                console.log('cheng')
            } else {
                // todo...[d.errorMessage]
                wfy.alert(d.errorMessage);
            }
        }) ;
    })
}

//选择图片并处理
function selectFileImage(fileObj) {
    var file = fileObj.files['0'];
    var Orientation = null;
    if (file) {
        var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
        if (!rFilter.test(file.type)) {
            wfy.alert("请选择jpeg、png格式的图片");
            return;
        }
        //获取照片方向角属性，用户旋转控制
        EXIF.getData(file, function() {
            EXIF.getAllTags(this);
            Orientation = EXIF.getTag(this, 'Orientation');
        });
        var oReader = new FileReader();
        oReader.onload = function(e) {
            var image = new Image();
            image.src = e.target.result;
            image.onload = function() {
                var expectWidth = this.naturalWidth;
                var expectHeight = this.naturalHeight;
                var calc = expectWidth / expectHeight;
                var canvas = document.getElementById('myCanvas');
                var ctx = canvas.getContext("2d");
                canvas.width = 1200;
                canvas.height = (canvas.width)/calc;
                console.log('canvas数据'+canvas.width)
                var base64 = null;
                //修复ios
                if (Orientation == 6) {
                    //alert('需要顺时针（向左）90度旋转');
                    ctx.save(); //保存状态
                    ctx.translate(canvas.width/2, canvas.height/2); //设置画布上的(0,0)位置，也就是旋转的中心点
                    ctx.rotate(90 * Math.PI / 180); //把画布旋转90度
                    // 执行Canvas的drawImage语句
                    ctx.drawImage(image, -(canvas.width/2), -(canvas.height/2), canvas.width, canvas.height); //把图片绘制在画布translate之前的中心点，
                    ctx.restore(); //恢复状态
                }else {
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                }
                base64 = canvas.toDataURL("image/jpeg", 0.92);
                $("#check_img").attr("src", base64);
            };
        };
        oReader.readAsDataURL(file);
    }
    //$('#uploadImage').imgloadsize();
}


// 获取仓库  入库单
var getcangku = function (call) {
    var vBiz = new FYBusiness("biz.invopr.warehouse.qry");
    var vOpr1 = vBiz.addCreateService("svc.invopr.warehouse.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.invopr.warehouse.qry");
    vOpr1Data.setValue("AS_DJLX", 'RK');// 例如RK
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.log(JSON.stringify(ip));
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
















































