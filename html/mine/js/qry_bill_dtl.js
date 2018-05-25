localStorage.his = 'qry_bill_dtl';
localStorage.prev = 'qry_bill';

if(!localStorage.printFormat){
    localStorage.printFormat = "57";
}

var billcode=localStorage.billcode;

$(function () {

    $('body').hammer().on('tap','#back',function (event) {
        event.stopPropagation();

        wfy.goto("qry_bill");
    });

    //获取所有账单数据
    getDtlList();

})

function getDtlList() {

    wfy.showload();

    var params={"settlememoNo":billcode};

    $.ajax({
        type: 'POST',
        url: _wfy_bill_dtl_url,
        contentType: 'application/json',
        async: false,
        data: JSON.stringify(params),
        success: function (msg) {
            wfy.hideload();

            if (msg.errorcode=="0") {

                var rows=msg.items;
                createDtlPage(rows);
            }
        },
        error: function (info) {
            wfy.hideload();
            wfy.alert("连接失败！\n" + "网络错误，请稍后再试。");
        }
    });
}



function createDtlPage(rows) {
    var money=0;
    var html="";

    html='<div class="cell_list_3_head node_tap" style="height: auto;">\n' +
        '            <div class="mine_name">\n' +
        '                <div class="mine_line" style="text-align: center;width: 50%;float: left;">'+rows[0].description+'</div>\n' +
        '                <div class="mine_line" style="text-align: center;">已缴金额</div>\n' +
        //'                <div class="mine_line" style="text-align: center;">2017年12月31日前缴纳租金</div>\n' +
        '                <div class="mine_line" style="text-align: center;width: 50%;float: left;">'+wfy.setTwoNum(rows[0].invoiceamount)+'</div>\n' +
        '                <div class="mine_line" style="text-align: center;" id="money">--</div>\n' +
        //'                <div class="mine_line" style="text-align: center;">2017年12月31日前缴纳租金</div>\n' +
        '            </div>\n' +
        '\n' +
        '        </div>\n' +
        '\n' +
        '        <div class="cell_list_3_margin"></div>\n' +
        '\n' +
        '        <div class="cell_list_3_head node_tap" style="height: auto;">\n' +
        '            <div class="mine_name">\n' ;
    for(var i=0;i<rows.length;i++){
        money+=Number(rows[i].receiptamount);

        html+='                <div class="mine_line">缴款日期：'+rows[i].receiptdate+'</div>\n' +
        //'                <div class="mine_line">缴款人：张某</div>\n' +
        //'                <div class="mine_line">联系方式：13232323232</div>\n' +
        //'                <div class="mine_line">店铺号：CQ-F03-082</div>\n' +
        '                <div class="mine_line">缴款金额：'+wfy.setTwoNum(rows[i].receiptamount)+'元</div>\n' ;
        //'                <div class="mine_line">缴款方式：刷卡</div>\n' +
        //'                <div class="mine_line">收款人：李某</div>\n' +
        if(i!=rows.length-1){
            html+='        <div style="background-color: #F2F2F2;height: 5px;"></div>\n' ;
        }
    }

    html+='            </div>\n' +
        '\n' +
        '        </div>';

    $(".cell_list_3").html(html);
    $("#money").html(wfy.setTwoNum(money));

}
