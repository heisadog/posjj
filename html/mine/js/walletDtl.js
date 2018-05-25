var code = '';
var sjhm = '';
var kyje = '';
$(function(){
	code = localStorage.couponCode;
	sjhm = localStorage.couponSjhm;
	kyje = localStorage.couponKyje;
	$('#yue').html(kyje);
	getDtl(code);
	$("#barcode").barcode(sjhm, "code128",
            {barWidth:3,
                barHeight:60,
                showHRI:false,
                bgColor:"#fff",
                output:"css"})
	var wid = document.body.clientWidth;
	var w = $('#barcode').width();
	$('#barcode').css({
		'margin-left':(wid-w)/2
	})
	$('body').hammer().on('tap','.jq_coupondtl_name',function (event) {
		event.stopPropagation();
		var has = $(this).hasClass('coupondtl_jian');
		if(has){
			$(this).removeClass('coupondtl_jian');
			$(this).next().show();
		}else {
			$(this).addClass('coupondtl_jian');
			$(this).next().hide();
		}
	})

})
function tabs() {
	
}
function getDtl (code) {
	var vBiz = new FYBusiness("biz.emp.card.qry.dtl");
	var vOpr1 = vBiz.addCreateService("svc.emp.card.qry.dtl", false);
	var vOpr1Data = vOpr1.addCreateData();
	vOpr1Data.setValue("AS_USERID", LoginName);
	vOpr1Data.setValue("AS_WLDM", DepartmentCode);
	vOpr1Data.setValue("AS_FUNC", "svc.emp.card.qry.dtl");
	vOpr1Data.setValue("AS_DJDJQH", code);
	var ip = new InvokeProc();
	ip.addBusiness(vBiz);
	ip.invoke(function(d){
	    if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
	        // todo...
	        var AC_RESULT=vOpr1.getResult(d,"AC_RESULT").rows;
            console.log(AC_RESULT);
            var html='';
            if(AC_RESULT.length == 0){
            	html = wfy.zero();
            }
           for (var i = 0; i < AC_RESULT.length; i++) {
           	var temp = AC_RESULT[i];
           	html+='<div class="lis"><span>'+temp.khczmc+'</span>'+temp.khczje+'元<em>'+temp.khczrq+'</em></div>'
           }
           $('#czid').html(html);
	    } else {
	        // todo...[d.errorMessage]
	        $.alert('查询失败')
	    }
	}) ;
}
