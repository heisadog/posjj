localStorage.his = 'qry_bill';
localStorage.prev = 'mine';

var currentTab="Rent";

if(!localStorage.printFormat){
    localStorage.printFormat = "57";
}

var index = 1 ;//页码
var loading = false;
var pageData={
    Rent:[],
    Property:[]
};

$(function () {
    var cfg = {
        cont:["租金","物业管理费"],
        data:["Rent","Property"],
        callback:dov
    };
    $("#cs").taber(cfg);

    //点击进入明细
    $("body").hammer().on("tap", ".list_1", function (event) {
        event.stopPropagation();

        localStorage.billcode = $(this).attr("data-code");
        wfy.goto("qry_bill_dtl");
    });

    //获取所有账单数据
    getDataList();

})
function dov(d) {
    $("#list").html("");
    currentTab=$(d).attr("data-type");
    getDataList();
}


function getDataList() {
    wfy.showload();
    var storeArrStr=localStorage.storeArrStr;
    var params={"stores":storeArrStr};
    console.log(params)
    $.ajax({
        type: 'POST',
        url: _wfy_bill_list_url,
        contentType: 'application/json',
        async: true,
        data: JSON.stringify(params),
        success: function (msg) {
            wfy.hideload();
            if (msg.errorcode=="0") {
                var rows=msg.items;
                pageDataDeal(rows);
                //创建显示页面
                createPage();
            }
        },
        error: function (info) {
            wfy.hideload();
            wfy.alert("连接失败！\n" + "网络错误，请稍后再试。");
        }
    });
}

//处理页面显示数据
function pageDataDeal(rows) {
    pageData.Rent = [];
    pageData.Property = [];
    for(var i=0;i<rows.length;i++){
        var tempObj=rows[i];
        if(tempObj.chargecode=="#3"){
            pageData.Rent.push(tempObj);
        }else{
            pageData.Property.push(tempObj);
        }
    }
}

function createPage() {
    var rows=eval("pageData."+currentTab);
    var html="";

    if(rows.length == 0){
        html = wfy.zero();
    }

    for(var i = 0; i< rows.length; i++){
        html+='<div class="list_1" style="height: 90px;" data-code="'+rows[i].settlememono+'">' +
            '<div class="list_item_1 thd ts200" >';

        if(currentTab === 'Rent'){
            html+='<div class="item_line">' +
                //'<span class="black">租金：</span>' +
                //'<span class="">'+(wfy.setTwoNum(rows[i].settlebaseamount) || '')+'元</span>' +
                '<span class="black">铺位号：<span class="">'+rows[i].propertycode+'</span></span>' +
                '<span class="fr">已出账：<span>'+(wfy.setTwoNum(rows[i].settlebaseamount) || '')+'元</span></span>' +
                '</div>'+
                '<div class="item_line">' +
                '<span>已缴费：<span>'+wfy.setTwoNum(rows[i].payedamount)+'元</span></span>' +
                '<span class="fr">未缴费：<span style="">'+wfy.setTwoNum(Number(rows[i].settlebaseamount)-Number(rows[i].payedamount))+'元</span></span>' +
                '</div>' +
                '<div class="item_line">' +
                '<span>账期：</span>'+
                '<span class="">'+rows[i].chargeperiod.substring(0,10)+"--"+rows[i].chargeperiod.substring(10)+'</span>' +
                '</div>' +
                '</div>';

        }else{
            html+='<div class="item_line">' +
                '<span class="black">物业管理费：</span>' +
                '<span class="">'+(wfy.setTwoNum(rows[i].settlebaseamount) || '')+'元</span>' +
                '</div>'+
                '<div class="item_line" style="font-size:12px;">' +
                '<span class="">'+rows[i].chargeperiod.substring(0,10)+"--"+rows[i].chargeperiod.substring(10)+'</span>' +
                '</div>' +
                '</div>';

        }

        html+='</div>';
    }

    $("#list").html(html);

}
