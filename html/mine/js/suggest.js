$(function () {

    //提交
    $('body').hammer().on('tap', '#pro_sub', function (event) {
        event.stopPropagation();

        wfy.alert("反馈成功",function () {
            history.back();
        });

    });
});
