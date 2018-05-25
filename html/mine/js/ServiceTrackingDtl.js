/**
 * Created by WFY02 on 2018/1/3.
 */
var index = 1;
$(function () {
    var params={"mailNo":"111"};
    $.ajax({
        type: 'POST',
        url: _wfy_ServiceTracking_url+'getSfOrderRoute',
        contentType: 'application/json',
        async: true,
        data: JSON.stringify(params),
        success: function (msg) {
            console.log(msg)
            wfy.hideload();
            $.alert('接口调通')
            if (msg.errorcode=="0") {

            }
        },
        error: function (info) {
            wfy.hideload();
            wfy.alert("连接失败！\n" + "网络错误，请稍后再试。");
        }
    });

})
