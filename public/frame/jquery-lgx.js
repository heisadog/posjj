/*
 *基于jquery 格式的 插件封装
 * 2017.8.23
 * 分为必须要有的 插件 和 按需添加的插件
 * */
/*------------------------------几个必须要有的插件 ------------------------------*/
+(function ($) {
    /**
    * 判断css3动画是否执行完毕
    * @git http://blog.alexmaccaw.com/css-transitions
    * @param duration  时间
    */
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false,
            $el = this;

        $(this).one('webkitTransitionEnd', function () {
            called = true;
        });

        var callback = function () {
            if (!called) $($el).trigger('webkitTransitionEnd');
        };

        setTimeout(callback, duration);
    };

})(jQuery)
+(function ($) {
    /*
    * 重新封装 tap事件，形式趋向于jquery，习惯使用！
    * */
    $.fn.tap = function (call) {
        return this.each(function () {
            $(this).on("touchstart",function (e) {
                var touches = e.touches;
                startTx = e.originalEvent.targetTouches[0].pageX;
                startTy = e.originalEvent.targetTouches[0].pageY;
            })
            $(this).on("touchend",function (e) {
                var touches = e.changedTouches,
                    endTx = e.originalEvent.changedTouches[0].pageX,
                    endTy = e.originalEvent.changedTouches[0].pageY;
                if( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 ){//Math.abs 返回 绝对值
                    call(this);
                }
            })
        })
    }
    $.fn.longPress = function(fn) {
        return this.each(function () {
            var timeout ;
            var _this = this;
            $(this).on("touchstart",function (e) {
                timeout = setTimeout(function () {
                    fn(_this)
                }, 800);  //长按时间超过800ms，则执行传入的方法
            })
            $(this).on("touchend",function (e) {
                clearTimeout(timeout);
            })
        })
    }
})(jQuery)


/*----------------------------按需加载的 各个效果插件----------------*/

/*-------------------插件化的 顶部   和  插件化的页脚------------------*/
+(function ($) {
	$.fn.header = function(options){
		var defaults = {
			title:"主题展示",
		}
		var opt = $.extend({},defaults,options);
		return this.each(function(){
			var but1 = '<div id="back" class="head_back">&#xe607</div>';
			var title = '<span id="headtitle">'+opt.title+'</span>';
			var but2 = '<div id="more" class="head_more">&#xe602</div>';
			var html = but1+title+but2;
			$(this).append(html);
		})
	}
	$.fn.footer = function (options) {
	    var defaults = {
	        butName:["首页",'物流','库存','销售','会员'],
	        butIcon:['&#xe778','&#xe633','&#xe636','&#xe60a','&#xe664'],
	        butUrl:['','','','',''],
	        butCheck:0,
	        butCss:{
	            color:"#666",
	            backgroundColor:"#FFF",
	        },
            callback:''
	    };
	    var opt = $.extend({},defaults,options);
        // var callback = opt.callback;
	    return this.each(function () {
	        var forhtml ='';
	        for(var i = 0; i<opt.butName.length; i++){
	            forhtml+='<div data-url="'+opt.butUrl[i]+'" class="footer_div"><div class="footer_icon_div"><i>'+opt.butIcon[i]+'</i><p>'+opt.butName[i]+'</p></div></div>';
	        }
	        var html = '<footer class="">'+forhtml+'</footer>';
	        $(this).append(html);
	        $(this).find("footer").css('background-color',opt.butCss.backgroundColor).css('color',opt.butCss.color);
	        $(this).find("footer div.footer_div").eq(opt.butCheck).addClass("main_color");
	        $(this).find("footer div.footer_div").css('width',100/opt.butName.length+"%");
            $(this).find("footer div.footer_div").on('click',function () {
                wfy.showload("页面加载中...")
                if ( typeof opt.callback === 'function') {
                    opt.callback(this);
                }
            })
	    })
	}
    $.fn.taber = function (cfg) {
        this.tabcfg = {
            cont:cfg.cont || [],
            data:cfg.data || [],
            para1:cfg.para1 ||[],//需求特地加的参数~~
            callback:cfg && cfg.callback ? cfg.callback : null,
        }
        var $this = $(this);
        var chileLen = this.tabcfg.cont.length;
        var cont = this.tabcfg.cont;
        var data = this.tabcfg.data;
        var para1 = this.tabcfg.para1;
        var callback = this.tabcfg.callback;
        var chileDom = '';
        for(var i = 0; i < chileLen; i++){
            chileDom +='<div class="gx_taber" data-type = "'+data[i]+'" data-para1="'+para1[i]+'">'+cont[i]+'</div>';
        }
        $this.html('');
        $this.html(chileDom);
        $this.find('div.gx_taber').eq(0).addClass('gx_taberbox_check');
        $this.find('div.gx_taber').css('width',100/chileLen+"%");
        $this.find('div.gx_taber').on('click',function () {
            $this.find('div.gx_taber').removeClass('gx_taberbox_check');
            $(this).addClass('gx_taberbox_check');
            console.log(0);
            if ( typeof callback === 'function') {
                callback(this);
            }
        })
    }
})(jQuery)
+(function ($) {
    var Scroll = function (el) {
        this.container = $(el);
    }
    Scroll.prototype.isScrollLoad = function () {
        var container = this.container;
        var scrollHeight = container[0].scrollHeight;
        var height = $(window).height();
        var offsettop = container.offset().top > 0 ? container.offset().top : container.offset().top*(-1);
        //var offsettop = container.offset().top ;
        return scrollHeight -(height+offsettop);
    }
    $.fn.Scroll = function () {
        var ss = new Scroll(this);
        return ss.isScrollLoad();
    }
})(jQuery)
+(function ($) {
    //实现对滑动控件属性的设置、事件的监听、以及设置回调函数
    $.fn.RangeSlider = function(cfg){
        this.sliderCfg = {
            min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
            max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
            step: cfg && Number(cfg.step) ? cfg.step : 1,
            callback: cfg && cfg.callback ? cfg.callback : null
        };

        var $input = $(this);
        var min = this.sliderCfg.min;
        var max = this.sliderCfg.max;
        var step = this.sliderCfg.step;
        var callback = this.sliderCfg.callback;

        $input.attr('min', min)
            .attr('max', max)
            .attr('step', step);

        $input.on("input", function(e){
            $input.attr('value', this.value);
            //$input.css( 'background', 'linear-gradient(to right, #059CFA, white ' + (this.value/255) + '%, white)' );
            //Math.round(result[i].kcssje / je * 10000) / 100.00
            $input.css( 'background-size', (Math.round(this.value / max * 10000) / 100.00) + '% 100%' );

            if ( typeof callback === 'function') {
                callback(this);
            }
        });
        //用法：$(this).RangeSlider({ min: 0,   max: 255,  step: 1,  callback: change});
        // var change = function(input){...}  change作为 回调 ，input参数即整个节点。
    };
})(jQuery)
//换肤 出现一个问题：起初border 设置的时候带有 1px solid 这是多余的。直接设置bordercolor
+(function ($) {
    var Theme = function (ele,opt) {
        this.$elem = ele,
            this.defaults ={
                'color': '',
                'bgcolor': '',
                'borcolor':'',
                'borbot':''
            },
            this.options =$.extend({},this.defaults,opt)
    };
    Theme.prototype.setCss = function () {
        var cssste = {'color':this.options.color,'backgroundColor': this.options.bgcolor,'borderColor': ''+this.options.borcolor+'','borderBottomColor': ''+this.options.borbot+''};
        this.$elem.css(cssste);
    }
    $.fn.theme = function (options) {
        var t = new Theme(this,options);
        return t.setCss()
    }
    $.fn.themeinit = function (str) {
        return this.each(function () {
            $(this).find('.themeTextColor').theme({"color":str});
            $(this).find('.themeBgColor').theme({"bgcolor":str});
            $(this).find('.themeBorderColor').theme({"borcolor":str,"borbot":str});//边框 需要带底边
            $(this).find('.themeBorderBotColor').theme({"borbot":str});//
        })
    }
    /*
     * 使用方法：
     * 1.defaults设值都是空，保证了theme()函数没有参数不会起作用。并且实现传入哪个参数，相对应的参数起作用！
     * 2.themeinit()函数 对应的 四个类名。在html中添加即可 （一一对应）
     * 3.themeinit()函数设置后，可以用theme()函数单独再次设置
     * 4.theme()参数为对象格式 如$("#tab").theme({"color":"#f00"});
     * 5.themeinit() 参数为 字符串（颜色值） 如 $("body").themeinit("#000"); 全局换肤给body添加事件，亦可单独页面换肤
     * */
})(jQuery)
+(function($){
	/*-------------------------------------dialog 大合集    --------*/
	/*
	 *总结 项目中常用的 几种 弹窗 需求
	 * slide 滑动 shade 遮罩 confirm
	 * */
	var Dialog = function(ele,opt){
		this.$element = ele,
	    this.defaults = {
	        title: '请确认您要这样操作',
            callback: opt && opt.callback ? opt.callback : null
	    },
	    this.options = $.extend({}, this.defaults, opt)
	}
	Dialog.prototype = {
		shade:'<div class="dia_shade"></div>',    //遮罩层 shade  动画效果：先添加dom节点，然后透明度有0 变0.6，执行透明度动画效果
        showShade:function () {
            var $shade = $(''+this.shade);
            if($(".dia_shade").length == 0){
                $("body").append($shade);
            }
            //$shade.addClass("op");
        },
        hideShade:function () {
            $(".dia_shade").addClass("dia_shade_hide");
            setTimeout(function () {
                $(".dia_shade").remove();
            },200)
        },
        clickHideShade:function () {
            //点击遮罩层 隐藏
            $(".shade").on("click",function () {
                this.hideShade();
            })
        },
        slideModle:function (html) {
            //弹出层 div结构,原理是先y轴位移。需要显示的时候 清除位移，达到动画效果
            //return '<div class="dia_slideModle">'+html+'</div>';
            return $(''+'<div class="dia_slideModle y100">'+html+'</div>');//改进一下 直接返回 dom节点。删除的时候 直接移除
        },
        slideTopConfirm:function () {
            //仿微信效果，删除的时候，底部弹出一个 选项，删除或者取消。类似confirm效果
            var callback = this.options.callback;
            var html = '<div class="dia_cont">' +
                            '<div class="dia_cont_tip borbot">'+this.options.title +'</div>'+
                            '<div class="dia_cont_tip dia_cont_delete">删除</div>'+
                            '<div class="dia_line_10"></div>'+
                            '<div class="dia_cont_tip dia_cont_cancle">取消</div>'+
                       '</div>';

            this.showShade();
            var $dom = this.slideModle(html);
            if($(".dia_slideModle").length ==0){
                $("body").append($dom);
            }
            setTimeout(function () {
                $dom.removeClass('y100');
            },100)

            $(".shade").on("click",function () {
                alert(00)
                $(".dia_shade").addClass("dia_shade_hide");
                setTimeout(function () {
                    $(".dia_shade").remove();
                },200)
            })
            $('.dia_cont_delete').on("click",function () {
                console.log($(this).html())
                // if ( typeof this.options.callback === 'function') {
                //     this.options.callback(this);
                // }这样写 就不行
                $dom.addClass("y100");
                setTimeout(function () {
                    $dom.remove();
                },100)
                if ( typeof callback === 'function') {
                    callback(this);
                }
            })
            $(".dia_cont_cancle").on("click",function(){
                $dom.addClass("y100");
                setTimeout(function () {
                    $dom.remove();
                },100)
                // this.hideShade(); //this 报错！！console.log(this)
                $(".dia_shade").addClass("dia_shade_hide");
                setTimeout(function () {
                    $(".dia_shade").remove();
                },200)
            })
        }
	}
    //遮罩层 隐藏 效果
    $.fn.hideShade = function (options) {
        var hide = new Dialog(this, options);
        return hide.hideShade();
    }
    $.fn.slideTopConfirm = function(options){
        var slideTopConfirm = new Dialog(this, options);
        return slideTopConfirm.slideTopConfirm(); //这种返回的方式 类似 jQuery的函数用法
    }
})(jQuery)








































