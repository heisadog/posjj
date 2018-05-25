localStorage.his = "bill_finish";
localStorage.prev = "home";

$(function () {

    $('body').hammer().on('tap','#back',function (event) {
        event.stopPropagation();

        wfy.goto("qry_noend");
    });

    wfy.tap("#continueBuy",function () {
        wfy.goto("storeSale");
    });

    wfy.tap(("#myOrder"),function () {
        wfy.goto("bill_noend");
    })

    $("#payordertid").html(localStorage.getItem("curpreordno") + "");
    $("#payorderway").html(localStorage.getItem("curPayType") + "")

});

