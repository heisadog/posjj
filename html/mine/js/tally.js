var AS_QSRQ = '';
var AS_JZRQ = '';
var style = 'day';
$(function(){
	getList();
	$('body').hammer().on('tap','#backBtn',function (event) {
		event.stopPropagation();
		wfy.pagegoto('../home/index');
	})
	//选择时间
	$('body').hammer().on('tap','#tallyTime',function (event) {
        event.stopPropagation();
       $('#kehu').removeClass('y100');
    })
	//选择时间 取消
	$('body').hammer().on('tap','#kehu_can',function (event) {
		event.stopPropagation();
		$('#kehu').addClass('y100');
	})
	//记录 新增
	$('body').hammer().on('tap','#add',function (event) {
		event.stopPropagation();
		$('#addwindow').css("bottom","200px");
		wfy.openFream('addcoverBack',"addwindow");
	})
	//新增取消
	$('body').hammer().on('tap', '#btn_cancel', function (event) {
		event.stopPropagation();
		$("#field_tel").val("");
		$("#field_name").val("");
		wfy.closeFream('addcoverBack',"addwindow");
		$('#addwindow').css("bottom","-200px");
	});
	//新增按钮
	$('body').hammer().on('tap', '#btn_sure', function (event) {
		event.stopPropagation();
		var name = $("#field_name").val();
		var tel = $("#field_tel").val();
		if(name =='' || tel == ''){
			wfy.alert('请输入标题和支出内容');
			return false;
		}
		wfy.closeFream('addcoverBack',"addwindow");
		$('#addwindow').css("bottom","-200px");
		vipAdd(name,tel);
	});
	//时间方式
	$('body').hammer().on('tap','#tallsytle',function (event) {
		event.stopPropagation();
		style = $(this).attr('data-style');
		if(style =='mouth'){
			$(this).html('按日选择');
			$(this).attr('data-style','day');
			$('#style_day').removeClass('none');
			$('#style_mouth').addClass('none');
		}
		if(style =='day') {
			$(this).html('按月选择');
			$(this).attr('data-style','mouth');
			$('#style_mouth').removeClass('none');
			$('#style_day').addClass('none');
		}
	})
	//清楚时间
	$('body').hammer().on('tap','.talldele',function (event) {
		event.stopPropagation();
		$(this).parent('.talltime').find('input').val('');
	})
	// 完成
	$('body').hammer().on('tap','#kehu_can_add',function (event) {
		event.stopPropagation();
		style = $('#tallsytle').attr('data-style');
		console.log(style)
		if(style =='mouth'){
			var year = $('#mouth').attr('year')
			var mouth = $('#mouth').attr('mouth').replace('月','')
			var now = new Date(year,mouth, 0);
			var dayCount = now.getDate();//某个月的天数
			AS_QSRQ = year+'-'+mouth+'-01';
			AS_JZRQ = year+'-'+mouth+'-'+dayCount;
		}else {
			AS_QSRQ = $('#state').val();
			AS_JZRQ = $('#end').val();
		}
		$('#kehu').addClass('y100');
		// console.log(AS_QSRQ)
		// console.log(AS_JZRQ)
		getList()
	})
	$("#state").datetimePicker({
		title: '请选择时间',
		min: "1990-12-12",
		max: "2222-12-12 12:12",
		monthNames:"",
		times:function(){
		},
		parse: function(date) {
			return date.split(/\D/).filter(function(t) {
				return !!date
			});
		},
		onOpen:function (values) {
			$("#state").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
		}
	});
	$("#end").datetimePicker({
		title: '请选择时间',
		min: "1990-12-12",
		max: "2222-12-12 12:12",
		monthNames:"",
		times:function(){
		},
		parse: function(date) {
			return date.split(/\D/).filter(function(t) {
				return !!date
			});
		},
		onOpen:function (values) {
			$("#state").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
		}
	});
	$('#mouth').picker({
		setValue:["2012", "12", "12"],
		title: "请选择时间",
		cols:[{
			textAlign: 'center',
			values: (function () {
				var nowYear = (new Date).getFullYear();
				var year = [];
				for (var i =2018;i<nowYear+1;i++){
					year.push(i)
				}
				return year;
			})()
		},{
			divider: true,  // 这是一个分隔符
			content: '-'
		},{
			textAlign: 'center',
			values: (function () {
				var mouth = [];
				for(var i =1; i<13;i++){
					mouth.push(i+'月')
				}
				return mouth;
			})()
		}],
		onOpen:function (values) {
			console.log(values)
			$("#mouth").val(values.value[0]+'-'+values.value[1])
		},
		onChange:function (res) {
			console.log(res)
			$('#mouth').attr('mouth',res.displayValue[1])
			$('#mouth').attr('year',res.displayValue[0])
		}
	})
})
function getList () {
	var vBiz = new FYBusiness("biz.sawork.wljz.qry");
	var vOpr1 = vBiz.addCreateService("svc.sawork.wljz.qry", false);
	var vOpr1Data = vOpr1.addCreateData();
	vOpr1Data.setValue("AS_USERID", LoginName);
	vOpr1Data.setValue("AS_WLDM", DepartmentCode);
	vOpr1Data.setValue("AS_FUNC", "svc.sawork.wljz.qry");
	vOpr1Data.setValue("AS_QSRQ", AS_QSRQ);
	vOpr1Data.setValue("AS_JZRQ", AS_JZRQ);
	var ip = new InvokeProc();
	ip.addBusiness(vBiz);
	console.log(JSON.stringify(ip))
	ip.invoke(function(d){
		if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
			var res=vOpr1.getResult(d,"AC_ZDDTL").rows;
			console.log(res)
			var je = 0;
			var html ='';
			if(res.length == 0){
				html = wfy.zero('暂无记账记录');
			}
			for(var i = 0; i<res.length; i++){
				//html+='<div class="item">'+res[i].jzje+res[i].jzsm+'</div>';
				html+='<div class="tallitem">'+res[i].jzsm+'<span style="float: right;font-size:14px;color: #1a1a1a">'+res[i].jzje+'</span>' +
					'<p style="font-size:12px; color:#999">'+res[i].jzdate.slice(0,10)+'</p>' +
					'</div>';
				je = Components.add(je,res[i].jzje)
			}
			$('#list').html(html);
			$('#zhichu').html(je)
			if(style =='mouth'){
				var year = $('#mouth').attr('year')
				var mouth = $('#mouth').attr('mouth').replace('月','');
				var nowyear = (new Date().getFullYear());
				var nowmonth = (new Date().getMonth()+1);
				if(AS_QSRQ == '' && AS_JZRQ == ""){
					$('#cht').html('全部');
				}else {
					if(year == nowyear && mouth == nowmonth){
						$('#cht').html('本月');
					}else {
						$('#cht').html(year+'年'+mouth);
					}
				}
			}
			if(style == 'day'){
				console.info(AS_QSRQ.toLowerCase() == AS_JZRQ.toLowerCase())
				if(AS_QSRQ == '' && AS_JZRQ == ""){
					$('#cht').html('全部');
				}else {
					if(AS_QSRQ != '' && AS_JZRQ != ''){
						if(AS_QSRQ.toLowerCase() == AS_JZRQ.toLowerCase()){
							$('#cht').html(AS_JZRQ);
							console.error(0)
						}else {
							$('#cht').html(AS_QSRQ+'至'+AS_JZRQ);
							console.error(1)
						}
					}else {
						$('#cht').html(AS_QSRQ+AS_JZRQ);
					}
				}
			}
			$('#cht').html()
			// todo...
		} else {
			// todo...[d.errorMessage]
			wfy.alert(d.errorMessage)
		}
	}) ;

}
var vipAdd = function (name,tel) {
	var vBiz = new FYBusiness("biz.sawork.wljz.save");
	var vOpr1 = vBiz.addCreateService("svc.sawork.wljz.save", false);
	var vOpr1Data = vOpr1.addCreateData();
	vOpr1Data.setValue("AS_USERID", LoginName);
	vOpr1Data.setValue("AS_WLDM", DepartmentCode);
	vOpr1Data.setValue("AS_FUNC", "svc.sawork.wljz.save");
	vOpr1Data.setValue("AS_JZJE", (name));
	vOpr1Data.setValue("AS_JZSM", tel);
	var ip = new InvokeProc();
	ip.addBusiness(vBiz);
	console.log(JSON.stringify(ip))
	ip.invoke(function(d){
		if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
			// todo...
			console.log('cheng')
			$("#field_tel").val("");
			$("#field_name").val("");
			getList();
		} else {
			// todo...[d.errorMessage]
			wfy.alert(d.errorMessage)
		}
	}) ;
}
