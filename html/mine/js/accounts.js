$(function () {
   getDtlList();
});

//获取数据信息
function getDtlList() {
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
            var shopRows = vOpr1.getResult(d, 'AC_RESULT_SHOP').rows || [];
            var row=res[0];

            //$("#nickname").html(row.xtyhxm);
            $("#brand").html(getValidStr(row.brandname));
            $("#opertion").html(LoginName);
            $("#quarters").html(getValidStr(row.xtyzmc));
            //$("#shopcode").html(getValidStr(row.xtdpbh));
            $("#expirydate").html(getValidStr(row.enddate));

            //轮播显示店铺编号
            swiperShowShop(shopRows);

        }else{
            //$("#nickname").html("--");
            $("#brand").html("--");
            $("#opertion").html("--");
            $("#quarters").html("--");
            $("#shopcode").html("--");
            $("#expirydate").html("--");
        }
    });
}

function swiperShowShop(rows) {
    if(rows.length>0){
        var html='<div class="swiper-wrapper">';
        for(var i=0;i<rows.length;i++){
            html+='<div class="swiper-slide">'+rows[i].xtdpbh+'</div>'
        }
        html+='</div>';

        $(".swiper-container").html(html);

        var swiper = new Swiper('.swiper-container', {
            spaceBetween: 30,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            /*on: {
                tap : function (event) {
                    //点击显示具体信息



                }
            }*/
        });
    }



}