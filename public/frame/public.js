/**
 * Created by WFY2016 on 2017/10/19.
 */
/*
* 项目全局性 的公共方法；
* 与basis的区别
* basic的是基础的方法，其他项目通用，
* public的方法是针对 本项目的通用方法，不一定适应于其他项目
* */
$(function () {
	//FastClick.attach(document.body);
	wfy.init();
	//实现点击背景区域 谭窗消失
    if(document.getElementById("coverBack"))
    {
        wfy.tap("#coverBack", function(_this){
            if(event.target == _this)
                wfy.closeWin();
        });
    }
    if(document.getElementById("coverBackt"))
    {
        wfy.tap("#coverBackt", function(_this){
            if(event.target == _this)
                wfy.closeWint();
        });
    }
	if(document.getElementById("cover"))
	{
		wfy.tap("#cover", function(_this){
			if(event.target == _this)
				$("#cover").addClass("none");
			    $(".selectTopBox").addClass("y_100");
		});
	}
	//支付方式的谭窗
	// if(document.getElementById("paycoverBack"))
	// {
	// 	wfy.tap("#paycoverBack", function(_this){
	// 		if(event.target == _this)
	// 			$("#paycoverBack").addClass("none");
	// 		$(".pay_alert_box").addClass("y200");
	// 	});
	// }
    wfy.tap("#mid [data-window]", function(_this){
		if($(_this).hasClass('nothing')){
			
		}else{
			wfy.openWin($(_this).attr("data-window"));
		}
	});
	//返回
	wfy.tap("#back",function () {
		//wfy.pageBack();
		//location.href=document.referrer;
		history.back();
	})
	// 滑动 效果 通用 类名  list_swiper
	//滑动
	$("body").hammer().on("dragstart", ".list_swiper", function (event) {
		event.stopPropagation();
		var ind = $(this).find(".list_drap div").length;
		var indclass = "x_left_160";
		if(ind == 3){
			indclass = 'x_left_240';//
		}
		if(ind == 1){
			indclass = "x_left_80";
		}
		if(ind == 0){//实现了取消 滑动
			indclass ='';
		}
		if (event.gesture.direction === "left") {
			$('.list_swiper .list_item_1').removeClass(indclass);
			$(this).find(".list_item_1").addClass(indclass);
		} else {
			$(this).find(".list_item_1").removeClass(indclass);
		}
	});
	//开关事件，
	$('body').hammer().on('tap','#mui-switch',function (event) {
		event.stopPropagation();
		if($(this).hasClass('mui-active')){
			$(this).removeClass('mui-active');
		}else {
			$(this).addClass('mui-active');
		}
	})
	//开关事件，(后期追加 同一个页面多个~~)
	$('body').hammer().on('tap','div[data-style="switch"]',function (event) {
		event.stopPropagation();
		if($(this).hasClass('mui-active')){
			$(this).removeClass('mui-active');
		}else {
			$(this).addClass('mui-active');
		}
	})
	//点击图片关闭 大图
	$('body').hammer().on('tap','#iosImg',function (event) {
		event.stopPropagation();
		setTimeout(function () {
			$('#iosImg').css({
				'transform': 'scale(0.7)',
				'-webkit-transform': 'scale(0.7)'
			});
			$('.iosalert').addClass('none');
		},0)

	});
	
})

//-------  获取操作号码 、小票号码
function getorder(AS_TYPE,call) {
	var vBiz = new FYBusiness("biz.order.no.get");
	var vOpr1 = vBiz.addCreateService("svc.order.no.get", false);
	var vOpr1Data = vOpr1.addCreateData();
	vOpr1Data.setValue("AS_USERID", LoginName);
	vOpr1Data.setValue("AS_WLDM", DepartmentCode);
	vOpr1Data.setValue("AS_FUNC", "svc.order.no.get");
	vOpr1Data.setValue("AS_TYPE", AS_TYPE);//RK
	vOpr1Data.setValue("AN_COUNT", 1);
	var ip = new InvokeProc();
	ip.addBusiness(vBiz);
	ip.invoke(function(d){
		if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
			// todo...
			var res = vOpr1.getResult(d, "AC_VERYNO").rows;
			if(typeof call === 'function'){
				call(res);
			}
		} else {
			// todo...[d.errorMessage]
			wfy.alert(d.errorMessage);
		}
	}) ;
}
//获取权限
function getqx(call) {
	var vBiz = new FYBusiness("biz.ctluser.qx.qry");
	var vOpr1 = vBiz.addCreateService("svc.ctluser.qx.qry", false);
	var vOpr1Data = vOpr1.addCreateData();
	vOpr1Data.setValue("AS_USERID", LoginName);
	vOpr1Data.setValue("AS_WLDM", DepartmentCode);
	vOpr1Data.setValue("AS_FUNC", "svc.ctluser.qx.qry");
	var ip = new InvokeProc();
	ip.addBusiness(vBiz);
	ip.invoke(function(d){
		if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
			// todo...svc.ctluser.qx.qry AC_USERINFO
			var res = vOpr1.getResult(d, "AC_USERINFO").rows;
			//console.error(res);
			if(typeof call === 'function'){
				call(res);
			}
		} else {
			// todo...[d.errorMessage]
			wfy.alert(d.errorMessage)
		}
	}) ;
}






















