var color = ['#abc327','#6eafff','#e08825','#01AAEF','#f8ebc8']
$(function(){
	getList();
	$('body').hammer().on('tap','#backBtn',function (event) {
		event.stopPropagation();
		wfy.pagegoto('../home/index');
	})
	$('body').hammer().on('tap','#searlist .coupon',function (event) {
        event.stopPropagation();
        var code = $(this).attr('data-code');
        var sjhm = $(this).attr('data-sjhm');
        var kyje = $(this).attr('data-kyje');
        localStorage.couponCode = code;
        localStorage.couponSjhm = sjhm;
        localStorage.couponKyje = kyje;
        wfy.pagegoto('../mine/walletDtl');
    })
})
function getList () {
	var vBiz = new FYBusiness("biz.emp.card.qry");
	var vOpr1 = vBiz.addCreateService("svc.emp.card.qry", false);
	var vOpr1Data = vOpr1.addCreateData();
	vOpr1Data.setValue("AS_USERID", LoginName);
	vOpr1Data.setValue("AS_WLDM", DepartmentCode);
	vOpr1Data.setValue("AS_FUNC", "svc.emp.card.qry");
	var ip = new InvokeProc();
	ip.addBusiness(vBiz);
	console.log(JSON.stringify(ip))
	ip.invoke(function(d){
	    if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
	        // todo...
	        var AC_RESULT=vOpr1.getResult(d,"AC_RESULT").rows;
            //console.log(AC_RESULT);
            var html = "";
            if(AC_RESULT.length == 0){
            	html = wfy.zero();
            }
            for (var i = 0; i < AC_RESULT.length; i++) {
            	var temp = AC_RESULT[i];
            	html+= '<div class="coupon" data-code="'+temp.djdjqh+'" data-sjhm="'+temp.djsjhm+'" data-kyje="'+temp.djkyje+'">'+
					'<div class="cou_top" style="background-color:'+color[i]+'">'+
						'<img src="../../public/img/coupon.png">'+
						'<span class="cou_name">'+temp.djdjje+'</span>'+
					'</div>'+
					'<div class="cou_time">'+
						'<span>'+temp.khlpmc+'</span>'+
						'<span>有效期至：'+temp.djyxrq+'</span>'+
					'</div>'+
				'</div>';
            }
            $('#searlist').html(html);
	    } else {
	        // todo...[d.errorMessage]
	        $.alert('查询失败')
	    }
	}) ;
}
