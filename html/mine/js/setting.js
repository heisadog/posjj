/**
 * Created by WFY2016 on 2017/10/19.
 */
$(function () {
    $('body').hammer().on('tap','#backBtn',function (event) {
        event.stopPropagation();

        wfy.pagegoto("../home/index");
    });
    //页面 跳转
    $('body').hammer().on("tap",'.cell_list_2 li[data-url]',function( event){
        event.stopPropagation();
        var url = $(this).attr('data-url');
        var type = $(this).attr('data-type');
        var title = $(this).attr('data-title');
        var obj ={'type':type,'title':title};
        localStorage.setting = JSON.stringify(obj);
        wfy.pagegoto(url);
    });

})
window.uexOnload =function () {
    $('body').hammer().on('tap','#bluetooth',function () {
        Components.bluetoothPrint.init('#bluetooth');
    })
}