/**
 * Created by WFY2016 on 2018/1/24.
 */
var pageIndex=1,loading=false;
$(function () {
    //返回
    $('body').hammer().on('tap','#backBtn',function (event) {
        event.stopPropagation();
        wfy.pagegoto("exbressList");;
    });
    //alert(localStorage.sfcode)
    var datajson = {'mailNo':localStorage.sfcode}//'444032637687'
    $.ajax({
        type: 'POST',
        url: _wfy_ServiceTracking_url+'getSfOrderRoute',
        contentType: 'application/json',
        async: true,
        data: JSON.stringify(datajson),
        success: function (msg) {
            console.log(msg)
            if(msg.errorcode=="1"){
                var html = '<div style="padding: 100px 20px;">'+ msg.errmsg+'或者刷新尝试获取</div><div class="sfshuaxin" onclick="window.location.reload();">刷新</div>';
                $('#wfyContList').html(html);
            }
            if (msg.errorcode=="0") {
                var item = msg.items// []
                var html = '';
                if(item.length == 0){
                    html = '<p class="tc" style="height: 100px; line-height: 100px;font-size:16px;">暂无订单轨迹</p>';
                }
                for (var i = 0;i<item.length; i++){
                    var time_time = item[i].accept_time.split(' ')[1];
                    var time_day = item[i].accept_time.split(' ')[0];
                    var remark = item[i].remark.split(' ')[1];
                    console.log(time_time)
                    html += '<div class="sflist">'+
                                '<span class="sfxuhgao">'+(i+1)+'.</span>' +
                                '<span class="sflujing">'+time_day+'<br>'+time_time+'</span><span>'+item[i].remark+'</span>'+
                            '</div>'
                }
                $('#wfyContList').html(html);
            }
        },
        error: function (info) {
            wfy.hideload();
            wfy.alert("连接失败！\n" + "网络错误，请稍后再试。");
        }
    });
})
