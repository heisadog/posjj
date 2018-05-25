var i = 0,count = 0;
var SS = 60;  // 秒 90s
var MS = 0;//秒数减一需要的间隔
var totle = 600;
var gameTime = 60;

var showTime = function(callback){
    totle = totle - 1;
    if (totle == 0) {
        clearInterval(s);
        clearInterval(t1);
        /*$(".pie2").css("-o-transform", "rotate(180deg)");
        $(".pie2").css("-moz-transform", "rotate(180deg)");
        $(".pie2").css("-webkit-transform", "rotate(180deg)");*/
    } else {
        if (totle > 0 && MS > 0) {
            MS = MS - 1;
            if (MS < 10) {
                MS = "0" + MS
            }
        }

        if (MS == 0 && SS >= 0) {
            MS = 10;

            if (SS < 10) {
                SS = "0" + SS
            }

            $(".time").html(" <span style='height: 100%;vertical-align:middle; display:inline-block;'></span><span style='font-size: 14px;vertical-align:middle; display:inline-block;'><div>"+SS+"</div><span style='display: block;'>跳过</span></span>");

            SS--
        }
    }

    if(totle==0){
        if(typeof callback==="function"){
            callback();
        }
    }
};

var start = function(){
	//i = i + 0.6;

	i = i + 360/((gameTime)*10);  //旋转的角度  90s 为 0.4  60s为0.6
	count = count + 1;
	if(count <= (gameTime/2*10)){  // 一半的角度  90s 为 450
		$(".pie1").css("-o-transform","rotate(" + i + "deg)");
		$(".pie1").css("-moz-transform","rotate(" + i + "deg)");
		$(".pie1").css("-webkit-transform","rotate(" + i + "deg)");
	}else{
		$(".pie2").css("backgroundColor", "#d13c36");
		$(".pie2").css("-o-transform","rotate(" + i + "deg)");
		$(".pie2").css("-moz-transform","rotate(" + i + "deg)");
		$(".pie2").css("-webkit-transform","rotate(" + i + "deg)");
	}
};

var countDown = function(timelength,callback) {
    gameTime=Number(timelength);
    SS = Number(timelength);
    totle = gameTime * 10;

    showTime();

    s = setInterval("showTime("+callback+")", 100);
    start();

    t1 = setInterval("start()", 100);
}