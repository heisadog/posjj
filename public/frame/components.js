/**
 * 组件库（依赖jQuery、hammer）
 * @author Nie
 */
var Components = {};
Components._zzid = 10000; // 层次序列值
Components._uuid = function () {
    var uuid = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return uuid() + uuid() + uuid() + uuid() + uuid() + uuid() + uuid() + uuid();
}; // 生成UUID

/**
 * Loading层（不可叠加）
 * @param mask 是否遮罩（true/false）
 * @param text 提示文本
 * @param delay 延时关闭时间
 * @returns {string} Loading标记
 */
Components.loading = function (mask, text, delay) {
    if (mask === undefined) mask = true;
    var uuid = Components._uuid(), zzid = Components._zzid++;
    var page = $('body'), node = {}, elem = {};
    node.styl = uuid + '_styl';
    node.mask = uuid + '_mask';
    node.body = uuid + '_body';

    page.append('<style id="' + node.styl + '">' +
        '@keyframes loading {' +
        '0%{stroke-dasharray:0,250%;stroke-dashoffset:0;}' +
        '50%{stroke-dasharray:250%,250%;stroke-dashoffset:0;}' +
        '100%{stroke-dasharray:250%,250%;stroke-dashoffset:-250%;}}' +
        '@-webkit-keyframes loading {' +
        '0%{stroke-dasharray:0,250%;stroke-dashoffset:0;}' +
        '50%{stroke-dasharray:250%,250%;stroke-dashoffset:0;}' +
        '100%{stroke-dasharray:250%,250%;stroke-dashoffset:-250%;}}</style>' +
        '<div id="' + node.mask + '" ' +
        'style="position:fixed;top:0;bottom:0;left:0;right:0;' +
        'z-index:' + zzid + ';font-size:15px;' +
        'background:rgba(0,0,0,.6);color:#ffffff;display:none;"></div>' +
        '<div id="' + node.body + '" ' +
        'style="position:fixed;top:40%;left:50%;' +
        'z-index:' + zzid + ';font-size:15px;' +
        'width:200px;margin-left:-100px;text-align:center;overflow:hidden;' +
        'transform-style:preserve-3d;-webkit-transform-style:preserve-3d;' +
        'backface-visibility:hidden;-webkit-backface-visibility:hidden;' +
        'perspective:1000;-webkit-perspective:1000;' +
        'transition:all .2s;-webkit-transition:all .2s;' +
        'opacity:0;transform:scale(0);-webkit-transform:scale(0);">' +
        '<svg style="width:45px;height:45px;stroke-dasharray:2px,300%;' +
        'stroke:' + (mask ? '#ffffff' : '#8a8a8a') + ';' +
        'stroke-dashoffset:0;fill:none;transform:rotate(-90deg);-webkit-transform:rotate(-90deg);' +
        'animation:loading 1.5s linear infinite;-webkit-animation:loading 1.5s linear infinite;">' +
        '<circle cx="50%" cy="50%" r="40%" stroke-width="3px"></svg>' +
        '<p style="margin:10px 0;color:' + (mask ? '#ffffff' : '#8a8a8a') + ';">' +
        (text || 'loading') + '</p></div>');

    setTimeout(function () {
        elem.styl = $('#' + node.styl);
        elem.mask = $('#' + node.mask);
        elem.body = $('#' + node.body);

        var show = function () {
            if (mask) {
                elem.mask.css({
                    'display': 'block'
                });
            }
            elem.body.css({
                'opacity': '1',
                'transform': 'scale(1)',
                '-webkit-transform': 'scale(1)'
            });
        };
        show();
        delay = +delay >= 500 ? +delay : 0;
        if (delay) {
            setTimeout(function () {
                Components.unload(uuid);
            }, delay);
        }
    }, 0);
    return uuid;
};
/**
 * 关闭Loading层
 * @param uuid Loading标记
 */
Components.unload = function (uuid) {
    var page = $('body'), node = {}, elem = {};
    node.styl = uuid + '_styl';
    node.mask = uuid + '_mask';
    node.body = uuid + '_body';
    elem.styl = $('#' + node.styl);
    elem.mask = $('#' + node.mask);
    elem.body = $('#' + node.body);

    var hide = function () {
        elem.body.css({
            'opacity': '0',
            'transform': 'scale(0)',
            '-webkit-transform': 'scale(0)'
        });
        setTimeout(function () {
            elem.mask.css({
                'display': 'none'
            });
            elem.styl.remove();
            elem.body.remove();
            elem.mask.remove();
        }, 100);
    };
    hide();
};

/**
 * Prompt框
 * @param title 提示内容
 * @param callback 回调方法（参数：value，value为null表示点击了取消）
 * @param value 输入框缺省值
 * @param type 输入框类型
 */
Components.prompt = function (title, callback, value, type) {
    var uuid = Components._uuid(), zzid = Components._zzid++;
    var page = $('body'), node = {}, elem = {};
    node.mask = uuid + '_mask';
    node.body = uuid + '_body';
    node.input = uuid + '_input';
    node.confirm = uuid + '_confirm';
    node.cancel = uuid + '_cancel';

    page.append('<div id="' + node.mask + '" ' +
        'style="position:fixed;top:0;bottom:0;left:0;right:0;' +
        'z-index:' + zzid + ';font-size:15px;' +
        'background:rgba(0,0,0,.6);color:#ffffff;display:none;"></div>' +
        '<div id="' + node.body + '" ' +
        'style="position:fixed;top:20%;left:8%;right:8%;' +
        'z-index:' + zzid + ';font-size:15px;' +
        'border-radius:5px;background:#ffffff;text-align:center;overflow:hidden;' +
        'transform-style:preserve-3d;-webkit-transform-style:preserve-3d;' +
        'backface-visibility:hidden;-webkit-backface-visibility:hidden;' +
        'perspective:1000;-webkit-perspective:1000;' +
        'transition:all .2s;-webkit-transition:all .2s;' +
        'opacity:0;transform:scale(0);-webkit-transform:scale(0);">' +
        '<p style="margin:10px 0;color:#000000;">' + (title || '请输入') + '</p>' +
        '<div style="margin:10px 0 20px;">' +
        '<input id="' + node.input + '" type="' + (type || 'text') + '" value="' + (value || '') + '" ' +
        'style="width:80%;border:1px solid #d9d9d9;padding:8px;border-radius:5px;"></div>' +
        '<div style="line-height:45px;font-size:16px;border-top:1px solid #d9d9d9;overflow:hidden;">' +
        '<a id="' + node.confirm + '" style="float:left;width:50%;" class="main_color">' +
        '<b class="stdfont dialog_icon" style="line-height:0;">&#xe615</b>确定</a>' +
        '<a id="' + node.cancel + '" style="float:left;width:49%;border-left:solid 1px #d9d9d9;" class="main_color">' +
        '<b class="stdfont dialog_icon" style="line-height:0;">&#xe630</b>取消</a>' +
        '</div></div>');

    setTimeout(function () {
        elem.mask = $('#' + node.mask);
        elem.body = $('#' + node.body);
        elem.input = $('#' + node.input);

        var caret = function (elem, pos) {
            try {
                uexWindow.showSoftKeyboard();
                if (elem.setSelectionRange) {
                    elem.setSelectionRange(pos, pos);
                    elem.focus();
                } else if (elem.createTextRange) {
                    var range = elem.createTextRange();
                    range.move('character', pos);
                    range.select();
                } else {
                    elem.focus();
                }
            } catch (err) {
                elem.focus();
            }
        };
        var show = function () {
            elem.mask.css({
                'display': 'block'
            });
            setTimeout(function () {
                elem.body.css({
                    'opacity': '1',
                    'transform': 'scale(1)',
                    '-webkit-transform': 'scale(1)'
                });
                elem.input.off('blur').on('blur', function (event) {
                    event.stopPropagation();
                    try {
                        uexWindow.hideSoftKeyboard();
                    } catch (err) {
                    }
                });
            }, 50);
            setTimeout(function () {
                caret(elem.input[0], elem.input.val().length);
            }, 100);
        };
        var hide = function () {
            elem.body.css({
                'opacity': '0',
                'transform': 'scale(0)',
                '-webkit-transform': 'scale(0)'
            });
            setTimeout(function () {
                elem.mask.css({
                    'display': 'none'
                });
                page.hammer().off('tap', '#' + node.confirm);
                page.hammer().off('tap', '#' + node.cancel);
                page.hammer().off('keydown', '#' + node.input);
                elem.body.remove();
                elem.mask.remove();
            }, 100);
        };
        page.hammer().on('tap', '#' + node.confirm, function (event) {
            event.stopPropagation();
            if (typeof callback === 'function') callback(elem.input.val());
            hide();
        });
        page.hammer().on('tap', '#' + node.cancel, function (event) {
            event.stopPropagation();
            if (typeof callback === 'function') callback(null);
            hide();
        });
        page.hammer().on('keydown', '#' + node.input, function (event) {
            event.stopPropagation();
            if (event.keyCode === 13 || event.keyCode === 9) {
                if (typeof callback === 'function') callback(elem.input.val());
                hide();
            }
        });
        show();
    }, 0);
};
/**
 * Confirm框
 * @param title 提示内容
 * @param callback 回调方法（参数：value，value为false表示点击了取消，为true表示点击了确定）
 */
Components.confirm = function (title, callback) {
    var uuid = Components._uuid(), zzid = Components._zzid++;
    var page = $('body'), node = {}, elem = {};
    node.mask = uuid + '_mask';
    node.body = uuid + '_body';
    node.confirm = uuid + '_confirm';
    node.cancel = uuid + '_cancel';

    page.append('<div id="' + node.mask + '" ' +
        'style="position:fixed;top:0;bottom:0;left:0;right:0;' +
        'z-index:' + zzid + ';font-size:15px;' +
        'background:rgba(0,0,0,.6);color:#ffffff;display:none;"></div>' +
        '<div id="' + node.body + '" ' +
        'style="position:fixed;top:30%;left:8%;right:8%;' +
        'z-index:' + zzid + ';font-size:15px;' +
        'border-radius:5px;background:#ffffff;text-align:center;overflow:hidden;' +
        'transform-style:preserve-3d;-webkit-transform-style:preserve-3d;' +
        'backface-visibility:hidden;-webkit-backface-visibility:hidden;' +
        'perspective:1000;-webkit-perspective:1000;' +
        'transition:all .2s;-webkit-transition:all .2s;' +
        'opacity:0;transform:scale(0);-webkit-transform:scale(0);">' +
        '<p style="margin:10px 0;color:#000000;">' + '友情提示' + '</p>' +
        '<p style="margin:20px;text-align:left;">' + (title || '') + '</p>' +
        '<div style="line-height:45px;font-size:16px;border-top:1px solid #d9d9d9;overflow:hidden;">' +
        '<a id="' + node.confirm + '" style="float:left;width:50%;" class="main_color">' +
        '<b class="stdfont dialog_icon" style="line-height:0;"></b>确定</a>' +
        '<a id="' + node.cancel + '" style="float:left;width:49%;border-left:solid 1px #d9d9d9;" class="main_color">' +
        '<b class="stdfont dialog_icon" style="line-height:0;"></b>取消</a>' +
        '</div></div>');

    setTimeout(function () {
        elem.mask = $('#' + node.mask);
        elem.body = $('#' + node.body);

        var show = function () {
            elem.mask.css({
                'display': 'block'
            });
            setTimeout(function () {
                elem.body.css({
                    'opacity': '1',
                    'transform': 'scale(1)',
                    '-webkit-transform': 'scale(1)'
                });
            }, 50);
        };
        var hide = function () {
            elem.body.css({
                'opacity': '0',
                'transform': 'scale(0)',
                '-webkit-transform': 'scale(0)'
            });
            setTimeout(function () {
                elem.mask.css({
                    'display': 'none'
                });
                page.hammer().off('tap', '#' + node.confirm);
                page.hammer().off('tap', '#' + node.cancel);
                elem.body.remove();
                elem.mask.remove();
            }, 100);
        };
        page.hammer().on('tap', '#' + node.confirm, function (event) {
            event.stopPropagation();
            if (typeof callback === 'function') callback(true);
            hide();
        });
        page.hammer().on('tap', '#' + node.cancel, function (event) {
            event.stopPropagation();
            if (typeof callback === 'function') callback(false);
            hide();
        });
        show();
    }, 0);
};
/**
 * Alert框
 * @param title 提示内容
 * @param callback 回调方法（参数：无）
 */
Components.alert = function (title, callback) {
    var uuid = Components._uuid(), zzid = Components._zzid++;
    var page = $('body'), node = {}, elem = {};
    node.mask = uuid + '_mask';
    node.body = uuid + '_body';
    node.confirm = uuid + '_confirm';

    page.append('<div id="' + node.mask + '" ' +
        'style="position:fixed;top:0;bottom:0;left:0;right:0;' +
        'z-index:' + zzid + ';font-size:15px;' +
        'background:rgba(0,0,0,.6);color:#ffffff;display:none;"></div>' +
        '<div id="' + node.body + '" ' +
        'style="position:fixed;top:20%;left:8%;right:8%;' +
        'z-index:' + zzid + ';font-size:15px;' +
        'border-radius:5px;background:#ffffff;text-align:center;overflow:hidden;' +
        'transform-style:preserve-3d;-webkit-transform-style:preserve-3d;' +
        'backface-visibility:hidden;-webkit-backface-visibility:hidden;' +
        'perspective:1000;-webkit-perspective:1000;' +
        'transition:all .2s;-webkit-transition:all .2s;' +
        'opacity:0;transform:scale(0);-webkit-transform:scale(0);">' +
        '<p style="margin:10px 0;color:#000000;">' + '友情提示' + '</p>' +
        '<p style="margin:20px;color:#000000;text-align:center;">' + (title || '') + '</p>' +
        '<div style="line-height:45px;font-size:16px;border-top:1px solid #d9d9d9;overflow:hidden;">' +
        '<a id="' + node.confirm + '" style="float:left;width:100%;" class="main_color">' +
        '确定</a>' +
        '</div></div>');

    setTimeout(function () {
        elem.mask = $('#' + node.mask);
        elem.body = $('#' + node.body);

        var show = function () {
            elem.mask.css({
                'display': 'block'
            });
            setTimeout(function () {
                elem.body.css({
                    'opacity': '1',
                    'transform': 'scale(1)',
                    '-webkit-transform': 'scale(1)'
                });
            }, 50);
        };
        var hide = function () {
            elem.body.css({
                'opacity': '0',
                'transform': 'scale(0)',
                '-webkit-transform': 'scale(0)'
            });
            setTimeout(function () {
                elem.mask.css({
                    'display': 'none'
                });
                page.hammer().off('tap', '#' + node.confirm);
                elem.body.remove();
                elem.mask.remove();
            }, 100);
        };
        page.hammer().on('tap', '#' + node.confirm, function (event) {
            event.stopPropagation();
            if (typeof callback === 'function') callback();
            hide();
        });
        show();
    }, 0);
};
/**
 * Toast框
 * @param text 提示文本
 * @param delay 延时关闭时间
 */
Components.toast = function (text, delay) {
    var uuid = '63470937ea787bd086751488ba58603d', zzid = Components._zzid++;
    var page = $('body'), node = {}, elem = {};
    node.body = uuid + '_body';
    $('#' + node.body).remove();

    page.append('<div id="' + node.body + '" ' +
        'style="position:fixed;bottom:15%;left:50%;' +
        'z-index:' + zzid + ';font-size:15px;' +
        'width:200px;margin-left:-100px;text-align:center;overflow:hidden;' +
        'background:rgba(0,0,0,.6);color:#ffffff;padding:10px;border-radius:5px;' +
        'transform-style:preserve-3d;-webkit-transform-style:preserve-3d;' +
        'backface-visibility:hidden;-webkit-backface-visibility:hidden;' +
        'perspective:1000;-webkit-perspective:1000;' +
        'transition:all .2s;-webkit-transition:all .2s;' +
        'opacity:0;transform:scale(0);-webkit-transform:scale(0);">' +
        '<p style="word-wrap:break-word;">' + (text || 'Toast') + '</p></div>');

    setTimeout(function () {
        elem.body = $('#' + node.body);

        var show = function () {
            elem.body.css({
                'opacity': '1',
                'transform': 'scale(1)',
                '-webkit-transform': 'scale(1)'
            });
        };
        var hide = function () {
            elem.body.css({
                'opacity': '0',
                'transform': 'scale(0)',
                '-webkit-transform': 'scale(0)'
            });
            setTimeout(function () {
                elem.body.remove();
            }, 100);
        };
        show();
        delay = +delay >= 500 ? +delay : 3000;
        setTimeout(function () {
            hide();
        }, delay);
    }, 0);
};

/**
 * 单选框类
 * @param trig 触发元素
 * @param list 列表数组
 * @param itemTpl 模板方法（参数：index索引值，item列表项）
 * @param itemTapFunc 列表项点击回调（参数：src触发元素DOM，elem列表项DOM，item列表项）
 * @param maskTapFunc 遮罩层点击回调（参数：src触发元素DOM）
 * @constructor
 */
Components.SingleSelectBox = function (trig, list, itemTpl, itemTapFunc, maskTapFunc) {
    var _this = this, _page = $('body');
    _this._uuid = Components._uuid();
    _this._zzid = Components._zzid++;
    _this._node = {};
    _this._node.list = _this._uuid + '_list';
    _this._node.mask = _this._uuid + '_mask';
    _this._node.item = _this._uuid + '_item';

    _this._wrap = function (flag) {
        flag = flag === true || flag === undefined;
        var wrap = $('#' + _this._node.list);
        if (flag && !wrap.length) {
            _this._wrap(false);
            _page.append('<div id="' + _this._node.mask + '" ' +
                'style="position:fixed;top:0;bottom:0;left:0;right:0;' +
                'z-index:' + _this._zzid + ';font-size:15px;' +
                'background:rgba(0,0,0,.6);color:#ffffff;display:none;"></div>' +
                '<div id="' + _this._node.list + '" ' +
                'style="position:fixed;bottom:0;left:0;right:0;' +
                'z-index:' + _this._zzid + ';font-size:15px;' +
                'min-height:20%;max-height:70%;background:#ffffff;' +
                'overflow-y:scroll;-webkit-overflow-scrolling:touch;' +
                'transform-style:preserve-3d;-webkit-transform-style:preserve-3d;' +
                'backface-visibility:hidden;-webkit-backface-visibility:hidden;' +
                'perspective:1000;-webkit-perspective:1000;' +
                'transition:all .2s;-webkit-transition:all .2s;' +
                'opacity:0;transform:translate3d(0,100%,0);' +
                '-webkit-transform:translate3d(0,100%,0);"></div>');
        } else if (!flag && wrap.length) {
            wrap.remove().siblings('#' + _this._node.mask).remove();
        }
        return _this;
    };

    _this._trig = '';
    _this._setTrig = function (trig) {
        trig = trig + '' || '';
        _this._trig = trig;
        return _this;
    };
    /**
     * 设置触发元素
     * @param trig 触发元素
     */
    _this.setTrig = function (trig) {
        return _this._setTrig(trig)._onTrigTap();
    };
    _this._itemTpl = function (index, item) {
        return index;
    };
    _this._setItemTpl = function (func) {
        if (typeof func === 'function') _this._itemTpl = func;
        return _this;
    };
    /**
     * 设置模板方法
     * @param func 模板方法
     */
    _this.setItemTpl = function (func) {
        return _this._setItemTpl(func)._setList(_this._list);
    };
    _this._list = [];
    _this._setList = function (list) {
        list = list && list.length ? list : [];
        _this._list = list;
        var elem = '';
        for (var i = 0; i < _this._list.length; i++) {
            elem += '<div class="' + _this._node.item + '" ' +
                'style="display:block;overflow:hidden;">' +
                _this._itemTpl(i, _this._list[i]) + '</div>';
        }
        if (!_this._list.length) {
            elem = '<p style="padding:15% 0;text-align:center;">这里没有查到数据</p>';
        }
        $('#' + _this._node.list).empty().append(elem);
        return _this;
    };
    /**
     * 设置列表数组
     * @param list 列表数组
     */
    _this.setList = function (list) {
        return _this._setList(list);
    };
    /**
     * 追加列表数组
     * @param list 列表数组
     */
    _this.appendList = function (list) {
        list = list && list.length ? list : [];
        if (!list.length) return _this;
        var wrap = $('#' + _this._node.list);
        if (!_this._list.length) wrap.empty();
        var elem = '';
        for (var i = 0; i < list.length; i++) {
            elem += '<div class="' + _this._node.item + '" ' +
                'style="display:block;overflow:hidden;">' +
                _this._itemTpl(_this._list.length + i, list[i]) + '</div>';
        }
        wrap.append(elem);
        _this._list = _this._list.concat(list);
        return _this;
    };

    _this._customFunc = function (elem, list) {
    };
    _this._setCustomFunc = function (func) {
        if (typeof func === 'function') _this._customFunc = func;
        return _this;
    };
    /**
     * 设置显示单选框后要执行的自定义方法
     * @param func 自定义方法（参数：elem列表DOM，list列表）
     */
    _this.setCustomFunc = function (func) {
        return _this._setCustomFunc(func);
    };
    _this._maskTapFunc = function (src) {
    };
    _this._setMaskTapFunc = function (func) {
        if (typeof func === 'function') _this._maskTapFunc = func;
        return _this;
    };
    /**
     * 设置遮罩层点击回调
     * @param func 遮罩层点击回调
     */
    _this.setMaskTapFunc = function (func) {
        return _this._setMaskTapFunc(func);
    };
    _this._itemTapFunc = function (src, elem, item) {
    };
    _this._setItemTapFunc = function (func) {
        if (typeof func === 'function') _this._itemTapFunc = func;
        return _this;
    };
    /**
     * 设置列表项点击回调
     * @param func 列表项点击回调
     */
    _this.setItemTapFunc = function (func) {
        return _this._setItemTapFunc(func);
    };

    _this._onMaskTap = function (src) {
        _page.hammer().on('tap', '#' + _this._node.mask, function (event) {
            event.stopPropagation();
            _this._maskTapFunc(src);
            _this._hide();
        });
        return _this;
    };
    _this._onItemTap = function (src) {
        _page.hammer().on('tap', '.' + _this._node.item, function (event) {
            event.stopPropagation();
            _this._itemTapFunc(src, $(this), _this._list[$(this).index('.' + _this._node.item)]);
            _this._hide();
        });
        return _this;
    };
    _this._show = function () {
        $('#' + _this._node.mask).css({
            'display': 'block'
        });
        setTimeout(function () {
            $('#' + _this._node.list).css({
                'opacity': '1',
                'transform': 'translate3d(0,0,0)',
                '-webkit-transform': 'translate3d(0,0,0)'
            });
            _this._customFunc($('.' + _this._node.item), _this._list);
        }, 50);
        return _this;
    };
    _this._hide = function () {
        $('#' + _this._node.list).css({
            'opacity': '0',
            'transform': 'translate3d(0,100%,0)',
            '-webkit-transform': 'translate3d(0,100%,0)'
        });
        setTimeout(function () {
            $('#' + _this._node.mask).css({
                'display': 'none'
            });
            _page.hammer().off('tap', '#' + _this._node.mask);
            _page.hammer().off('tap', '.' + _this._node.item);
        }, 100);
        return _this;
    };
    _this._onTrigTap = function () {
        if (!_this._trig) return _this._hide();
        _page.hammer().off('tap', _this._trig);
        _page.hammer().on('tap', _this._trig, function (event) {
            event.stopPropagation();
            _this._onMaskTap($(this))._onItemTap($(this))._show();
        });
        return _this;
    };

    _this._onReachBottomFunc = function (elem, list) {
    };
    _this._onReachBottom = function () {
        $('#' + _this._node.list).hammer().off('scroll').on('scroll', function (event) {
            event.stopPropagation();
            var elem = $(this)[0] || {};
            var sh = elem.scrollHeight || 0;
            var ch = elem.clientHeight || 0;
            var st = elem.scrollTop || 0;
            if (sh && ch && st && (st + ch >= sh)) {
                _this._onReachBottomFunc($('.' + _this._node.item), _this._list);
            }
        });
        return _this;
    };
    /**
     * 设置触底事件监听
     * @param func
     */
    _this.onReachBottom = function (func) {
        if (typeof func === 'function') _this._onReachBottomFunc = func;
        return _this;
    };

    _this._init = function (trig, list, itemTpl, itemTapFunc, maskTapFunc) {
        return _this._wrap()._setTrig(trig)._onTrigTap()._setItemTpl(itemTpl)._setList(list)
            ._setItemTapFunc(itemTapFunc)._setMaskTapFunc(maskTapFunc)._onReachBottom();
    };
    /**
     * 初始化单选框
     * @param trig 同上
     * @param list 同上
     * @param itemTpl 同上
     * @param itemTapFunc 同上
     * @param maskTapFunc 同上
     */
    _this.init = function (trig, list, itemTpl, itemTapFunc, maskTapFunc) {
        return _this._init(trig, list, itemTpl, itemTapFunc, maskTapFunc);
    };
    /**
     * 显示单选框
     */
    _this.show = function () {
        return _this._onMaskTap($(_this._trig))._onItemTap($(_this._trig))._show();
    };
    /**
     * 通过子元素获取列表项
     * @param src 子元素DOM或索引值
     * @param type 0-返回列表项，1-返回列表项DOM，2-返回列表项索引值
     * @returns {*}
     */
    _this.item = function (src, type) {
        if (+src >= 0 && !type) return _this._list[+src];
        if (+src >= 0 && type) return $('.' + _this._node.item).eq(+src);
        if (src instanceof jQuery && !type) return _this._list[src.parents('.' + _this._node.item).index('.' + _this._node.item)];
        if (src instanceof jQuery && type === 2) return src.parents('.' + _this._node.item).index('.' + _this._node.item);
        if (src instanceof jQuery && type === 1) return src.parents('.' + _this._node.item);
    };
    /**
     * 获取列表
     * @param type 0-返回列表，1-返回列表DOM
     * @returns {*}
     */
    _this.list = function (type) {
        if (!type) return _this._list;
        if (type) return $('.' + _this._node.item);
    };
    _this._init(trig, list, itemTpl, itemTapFunc, maskTapFunc);
};
/**
 * 多选框类
 * @param trig 触发元素
 * @param list 列表数组
 * @param itemTpl 模板方法（参数：index索引值，item列表项）
 * @param confirmTapFunc 确认点击回调（参数：src触发元素DOM，elem列表项DOM，item列表项）
 * @param cancelTapFunc 取消点击回调（参数：src触发元素DOM）
 * @constructor
 */
Components.MultiSelectBox = function (trig, list, itemTpl, confirmTapFunc, cancelTapFunc) {
    var _this = this, _page = $('body');
    _this._uuid = Components._uuid();
    _this._zzid = Components._zzid++;
    _this._node = {};
    _this._node.mask = _this._uuid + '_mask';
    _this._node.body = _this._uuid + '_body';
    _this._node.list = _this._uuid + '_list';
    _this._node.item = _this._uuid + '_item';
    _this._node.selected = _this._uuid + '_selected';
    _this._node.confirm = _this._uuid + '_confirm';
    _this._node.cancel = _this._uuid + '_cancel';

    _this._wrap = function (flag) {
        flag = flag === true || flag === undefined;
        var wrap = $('#' + _this._node.body);
        if (flag && !wrap.length) {
            _this._wrap(false);
            _page.append('<div id="' + _this._node.mask + '" ' +
                'style="position:fixed;top:0;bottom:0;left:0;right:0;' +
                'z-index:' + _this._zzid + ';font-size:15px;' +
                'background:rgba(0,0,0,.6);color:#ffffff;display:none;"></div>' +
                '<div id="' + _this._node.body + '" ' +
                'style="position:fixed;bottom:0;left:0;right:0;' +
                'z-index:' + _this._zzid + ';font-size:15px;' +
                'height:70%;background:#ffffff;overflow:hidden;' +
                'transform-style:preserve-3d;-webkit-transform-style:preserve-3d;' +
                'backface-visibility:hidden;-webkit-backface-visibility:hidden;' +
                'perspective:1000;-webkit-perspective:1000;' +
                'transition:all .2s;-webkit-transition:all .2s;' +
                'opacity:0;transform:translate3d(0,100%,0);' +
                '-webkit-transform:translate3d(0,100%,0);">' +
                '<div id="' + _this._node.list + '" ' +
                'style="display:block;overflow-y:scroll;-webkit-overflow-scrolling:touch;' +
                'height:calc(100% - 51px);height:-webkit-calc(100% - 51px);"></div>' +
                '<div style="line-height:50px;font-size:16px;border-top:1px solid #d9d9d9;overflow:hidden;text-align:center;">' +
                '<a id="' + _this._node.confirm + '" style="float:left;width:50%;" class="main_color">' +
                '<b class="stdfont dialog_icon" style="line-height:0;">&#xe615</b>确定</a>' +
                '<a id="' + _this._node.cancel + '" style="float:left;width:49%;border-left:solid 1px #d9d9d9;" class="main_color">' +
                '<b class="stdfont dialog_icon" style="line-height:0;">&#xe630</b>取消</a>' +
                '</div></div>');
        } else if (!flag && wrap.length) {
            wrap.remove().siblings('#' + _this._node.mask).remove();
        }
        return _this;
    };

    _this._trig = '';
    _this._setTrig = function (trig) {
        trig = trig + '' || '';
        _this._trig = trig;
        return _this;
    };
    /**
     * 设置触发元素
     * @param trig 触发元素
     */
    _this.setTrig = function (trig) {
        return _this._setTrig(trig)._onTrigTap();
    };
    _this._itemTpl = function (index, item) {
        return index;
    };
    _this._setItemTpl = function (func) {
        if (typeof func === 'function') _this._itemTpl = func;
        return _this;
    };
    /**
     * 设置模板方法
     * @param func 模板方法
     */
    _this.setItemTpl = function (func) {
        return _this._setItemTpl(func)._setList(_this._list);
    };
    _this._list = [];
    _this._setList = function (list) {
        list = list && list.length ? list : [];
        _this._list = list;
        var elem = '';
        for (var i = 0; i < _this._list.length; i++) {
            elem += '<div class="' + _this._node.item + '" ' +
                'style="display:block;overflow:hidden;background:#ffffff;' +
                'transition:all .2s;-webkit-transition:all .2s;">' +
                _this._itemTpl(i, _this._list[i]) + '</div>';
        }
        if (!_this._list.length) {
            elem = '<p style="padding:15% 0;text-align:center;">这里没有查到数据</p>';
        }
        $('#' + _this._node.list).empty().append(elem);
        return _this;
    };
    /**
     * 设置列表数组
     * @param list 列表数组
     */
    _this.setList = function (list) {
        return _this._setList(list);
    };
    _this._getList = function () {
        var list = [];
        for (var i = 0; i < _this._list.length; i++) {
            if ($('.' + _this._node.item).eq(i).hasClass(_this._node.selected)) {
                list.push(_this._list[i]);
            }
        }
        return list;
    };
    /**
     * 追加列表数组
     * @param list 列表数组
     */
    _this.appendList = function (list) {
        list = list && list.length ? list : [];
        if (!list.length) return _this;
        var wrap = $('#' + _this._node.list);
        if (!_this._list.length) wrap.empty();
        var elem = '';
        for (var i = 0; i < list.length; i++) {
            elem += '<div class="' + _this._node.item + '" ' +
                'style="display:block;overflow:hidden;background:#ffffff;' +
                'transition:all .2s;-webkit-transition:all .2s;">' +
                _this._itemTpl(_this._list.length + i, list[i]) + '</div>';
        }
        wrap.append(elem);
        _this._list = _this._list.concat(list);
        return _this;
    };

    _this._customFunc = function (elem, list) {
    };
    _this._setCustomFunc = function (func) {
        if (typeof func === 'function') _this._customFunc = func;
        return _this;
    };
    /**
     * 设置显示多选框后要执行的自定义方法
     * @param func 自定义方法（参数：elem列表DOM，list列表）
     */
    _this.setCustomFunc = function (func) {
        return _this._setCustomFunc(func);
    };
    _this._cancelTapFunc = function (src) {
    };
    _this._setCancelTapFunc = function (func) {
        if (typeof func === 'function') _this._cancelTapFunc = func;
        return _this;
    };
    /**
     * 设置取消点击回调
     * @param func 取消点击回调
     */
    _this.setCancelTapFunc = function (func) {
        return _this._setCancelTapFunc(func);
    };
    _this._confirmTapFunc = function (src, elem, list) {
    };
    _this._setConfirmTapFunc = function (func) {
        if (typeof func === 'function') _this._confirmTapFunc = func;
        return _this;
    };
    /**
     * 设置确认点击回调
     * @param func 确认点击回调
     */
    _this.setConfirmTapFunc = function (func) {
        return _this._setConfirmTapFunc(func);
    };

    _this._onCancelTap = function (src) {
        _page.hammer().on('tap', '#' + _this._node.mask, function (event) {
            event.stopPropagation();
            _this._cancelTapFunc(src);
            _this._hide();
        });
        _page.hammer().on('tap', '#' + _this._node.cancel, function (event) {
            event.stopPropagation();
            _this._cancelTapFunc(src);
            _this._hide();
        });
        return _this;
    };
    _this._onConfirmTap = function (src) {
        _page.hammer().on('tap', '#' + _this._node.confirm, function (event) {
            event.stopPropagation();
            _this._confirmTapFunc(src, $('.' + _this._node.selected), _this._getList());
            _this._hide();
        });
        return _this;
    };
    _this._onItemTap = function () {
        _page.hammer().on('tap', '.' + _this._node.item, function (event) {
            event.stopPropagation();
            if ($(this).hasClass(_this._node.selected)) {
                $(this).css({'background': '#ffffff'}).removeClass(_this._node.selected);
            } else {
                $(this).css({'background': '#e5e5e5'}).addClass(_this._node.selected);
            }
        });
        return _this;
    };
    _this._show = function () {
        $('#' + _this._node.mask).css({
            'display': 'block'
        });
        setTimeout(function () {
            $('#' + _this._node.body).css({
                'opacity': '1',
                'transform': 'translate3d(0,0,0)',
                '-webkit-transform': 'translate3d(0,0,0)'
            });
            _this._customFunc($('.' + _this._node.item), _this._list);
        }, 50);
        return _this;
    };
    _this._hide = function () {
        $('#' + _this._node.body).css({
            'opacity': '0',
            'transform': 'translate3d(0,100%,0)',
            '-webkit-transform': 'translate3d(0,100%,0)'
        });
        setTimeout(function () {
            $('#' + _this._node.mask).css({
                'display': 'none'
            });
            _page.hammer().off('tap', '#' + _this._node.mask);
            _page.hammer().off('tap', '#' + _this._node.cancel);
            _page.hammer().off('tap', '#' + _this._node.confirm);
            _page.hammer().off('tap', '.' + _this._node.item);
            $('.' + _this._node.item).css({'background': '#ffffff'}).removeClass(_this._node.selected);
        }, 100);
        return _this;
    };
    _this._onTrigTap = function () {
        if (!_this._trig) return _this._hide();
        _page.hammer().off('tap', _this._trig);
        _page.hammer().on('tap', _this._trig, function (event) {
            event.stopPropagation();
            _this._onCancelTap($(this))._onConfirmTap($(this))._onItemTap()._show();
        });
        return _this;
    };

    _this._onReachBottomFunc = function (elem, list) {
    };
    _this._onReachBottom = function () {
        $('#' + _this._node.list).hammer().off('scroll').on('scroll', function (event) {
            event.stopPropagation();
            var elem = $(this)[0] || {};
            var sh = elem.scrollHeight || 0;
            var ch = elem.clientHeight || 0;
            var st = elem.scrollTop || 0;
            if (sh && ch && st && (st + ch >= sh)) {
                _this._onReachBottomFunc($('.' + _this._node.item), _this._list);
            }
        });
        return _this;
    };
    /**
     * 设置触底事件监听
     * @param func
     */
    _this.onReachBottom = function (func) {
        if (typeof func === 'function') _this._onReachBottomFunc = func;
        return _this;
    };

    _this._init = function (trig, list, itemTpl, confirmTapFunc, cancelTapFunc) {
        return _this._wrap()._setTrig(trig)._onTrigTap()._setItemTpl(itemTpl)._setList(list)
            ._setConfirmTapFunc(confirmTapFunc)._setCancelTapFunc(cancelTapFunc)._onReachBottom();
    };
    /**
     * 初始化多选框
     * @param trig 同上
     * @param list 同上
     * @param itemTpl 同上
     * @param confirmTapFunc 同上
     * @param cancelTapFunc 同上
     */
    _this.init = function (trig, list, itemTpl, confirmTapFunc, cancelTapFunc) {
        return _this._init(trig, list, itemTpl, confirmTapFunc, cancelTapFunc);
    };
    /**
     * 显示多选框
     */
    _this.show = function () {
        return _this._onCancelTap($(_this._trig))._onConfirmTap($(_this._trig))._onItemTap()._show();
    };
    /**
     * 通过子元素获取列表项
     * @param src 子元素DOM或索引值
     * @param type 0-返回列表项，1-返回列表项DOM，2-返回列表项索引值
     * @returns {*}
     */
    _this.item = function (src, type) {
        if (+src >= 0 && !type) return _this._list[+src];
        if (+src >= 0 && type) return $('.' + _this._node.item).eq(+src);
        if (src instanceof jQuery && !type) return _this._list[src.parents('.' + _this._node.item).index('.' + _this._node.item)];
        if (src instanceof jQuery && type === 2) return src.parents('.' + _this._node.item).index('.' + _this._node.item);
        if (src instanceof jQuery && type === 1) return src.parents('.' + _this._node.item);
    };
    /**
     * 获取列表
     * @param type 0-返回列表，1-返回列表DOM
     * @returns {*}
     */
    _this.list = function (type) {
        if (!type) return _this._list;
        if (type) return $('.' + _this._node.item);
    };
    /**
     * 通过子元素选择列表项
     * @param src src 子元素DOM
     * @returns {*}
     */
    _this.select = function (src) {
        src.parents('.' + _this._node.item).css({'background': '#e5e5e5'}).addClass(_this._node.selected);
    };
    _this._init(trig, list, itemTpl, confirmTapFunc, cancelTapFunc);
};
/**
 * 主列表类
 * @param elem 列表挂载元素
 * @param sort 排序方式（asc-正序，desc-倒序）
 * @param list 列表数组
 * @param itemTpl 模板方法（参数：index索引值，item列表项）
 * @param listInit 列表初始化方法（参数：elem列表DOM，list列表数组）
 * @constructor
 */
Components.MainListBox = function (elem, sort, list, itemTpl, listInit) {
    var _this = this, _page = $('body');
    _this._uuid = Components._uuid();
    _this._node = {};
    _this._node.item = _this._uuid + '_item';

    _this._elem = '';
    _this._setElem = function (elem) {
        elem = elem + '' || '';
        _this._elem = elem;
        $(_this._elem).css({
            'font-size': '15px',
            'display': 'block',
            'overflow-y': 'scroll',
            '-webkit-overflow-scrolling': 'touch'
        });
        return _this;
    };
    /**
     * 设置列表挂载元素
     * @param elem 列表挂载元素
     */
    _this.setElem = function (elem) {
        return _this._setElem(elem)._initList();
    };
    _this._sort = 'asc';
    _this._setSort = function (sort) {
        sort = sort === 'desc' ? 'desc' : 'asc';
        if (_this._sort !== sort) _this._list.reverse();
        _this._sort = sort;
        return _this;
    };
    /**
     * 设置排序方式
     * @param sort 排序方式
     */
    _this.setSort = function (sort) {
        return _this._setSort(sort)._initList();
    };
    _this._itemTpl = function (index, item) {
        return index;
    };
    _this._setItemTpl = function (func) {
        if (typeof func === 'function') _this._itemTpl = func;
        return _this;
    };
    /**
     * 设置模板方法
     * @param func 模板方法
     */
    _this.setItemTpl = function (func) {
        return _this._setItemTpl(func)._initList();
    };
    _this._list = [];
    _this._setList = function (list) {
        list = list && list.length ? list : [];
        _this._list = _this._sort === 'desc' ? list.reverse() : list;
        return _this;
    };
    /**
     * 设置列表数组
     * @param list 列表数组
     */
    _this.setList = function (list) {
        return _this._setList(list)._initList();
    };
    _this._listInit = function (elem, list) {
    };
    _this._setListInit = function (func) {
        if (typeof func === 'function') _this._listInit = func;
        return _this;
    };
    /**
     * 设置列表初始化方法
     * @param func 列表初始化方法
     */
    _this.setListInit = function (func) {
        return _this._setListInit(func)._initList();
    };

    _this._getList = function () {
        var list = [];
        if (_this._sort === 'desc') {
            for (var i = _this._list.length; i > 0; i--) {
                list.push(_this._list[i - 1]);
            }
        } else {
            for (var j = 0; j < _this._list.length; j++) {
                list.push(_this._list[j]);
            }
        }
        return list;
    };
    /**
     * 获取列表数组（按逻辑顺序、最终结果）
     * @returns {[]}
     */
    _this.getList = function () {
        return _this._getList();
    };
    _this._initList = function () {
        var elem = '';
        for (var i = 0; i < _this._list.length; i++) {
            elem += '<div class="' + _this._node.item + '" ' +
                'style="display:block;overflow:hidden;">' +
                _this._itemTpl(i, _this._list[i]) + '</div>';
        }
        if (!_this._list.length) {
            elem = '<p style="padding:15% 0;text-align:center;">这里没有查到数据</p>';
        }
        $(_this._elem).empty().append(elem);
        _this._listInit($('.' + _this._node.item), _this._list);
        return _this._onReachBottom();
    };

    _this._addItem = function (item) {
        var elem = '', wrap = $(_this._elem);
        if (!_this._list.length) wrap.empty();
        if (_this._sort === 'desc') {
            _this._list.unshift(item);
            elem = '<div class="' + _this._node.item + '" ' +
                'style="display:none;overflow:hidden;">' +
                _this._itemTpl(0, _this._list[0]) + '</div>';
            wrap.prepend(elem);
            _this._onItemAdd($('.' + _this._node.item).eq(0).fadeIn(), _this._list[0]);
        } else {
            _this._list.push(item);
            elem = '<div class="' + _this._node.item + '" ' +
                'style="display:none;overflow:hidden;">' +
                _this._itemTpl(_this._list.length - 1, _this._list[_this._list.length - 1]) + '</div>';
            wrap.append(elem);
            _this._onItemAdd($('.' + _this._node.item).eq(_this._list.length - 1).fadeIn(), _this._list[_this._list.length - 1]);
        }
        return _this;
    };
    /**
     * 添加列表项
     * @param item 列表项
     */
    _this.addItem = function (item) {
        return _this._addItem(item);
    };
    _this._removeItem = function (index) {
        index = +index || 0;
        var elem = $('.' + _this._node.item).eq(index).fadeOut(function () {
            $(this).remove();
        });
        var item = _this._list.splice(index, 1)[0];
        if (!_this._list.length) {
            $(_this._elem).empty().append('<p style="padding:15% 0;text-align:center;">这里没有查到数据</p>');
        }
        _this._onItemRemove(elem, item);
        return _this;
    };
    /**
     * 删除列表项
     * @param index 列表项索引（按页面显示顺序）
     */
    _this.removeItem = function (index) {
        return _this._removeItem(index);
    };
    _this._onItemAdd = function (elem, item) {
    };
    /**
     * 添加列表项回调
     * @param func 回调（参数：elem列表项DOM，item列表项）
     */
    _this.onItemAdd = function (func) {
        if (typeof func === 'function') _this._onItemAdd = func;
        return _this;
    };
    _this._onItemRemove = function (elem, item) {
    };
    /**
     * 删除列表项回调
     * @param func 回调（参数：elem列表项DOM，item列表项）
     */
    _this.onItemRemove = function (func) {
        if (typeof func === 'function') _this._onItemRemove = func;
        return _this;
    };

    _this._onReachBottomFunc = function (elem, list) {
    };
    _this._onReachBottom = function () {
        if (_this._sort !== 'asc') {
            $(_this._elem).hammer().off('scroll');
            return _this;
        }
        $(_this._elem).hammer().off('scroll').on('scroll', function (event) {
            event.stopPropagation();
            var elem = $(this)[0] || {};
            var sh = elem.scrollHeight || 0;
            var ch = elem.clientHeight || 0;
            var st = elem.scrollTop || 0;
            if (sh && ch && st && (st + ch >= sh)) {
                _this._onReachBottomFunc($('.' + _this._node.item), _this._list);
            }
        });
        return _this;
    };
    /**
     * 设置触底事件监听
     * @param func
     */
    _this.onReachBottom = function (func) {
        if (typeof func === 'function') _this._onReachBottomFunc = func;
        return _this;
    };

    _this._init = function (elem, sort, list, itemTpl, listInit) {
        return _this._setElem(elem)._setSort(sort)._setItemTpl(itemTpl)
            ._setList(list)._setListInit(listInit)._initList();
    };
    /**
     * 初始化
     * @param elem 同上
     * @param sort 同上
     * @param list 同上
     * @param itemTpl 同上
     * @param listInit 同上
     */
    _this.init = function (elem, sort, list, itemTpl, listInit) {
        return _this._init(elem, sort, list, itemTpl, listInit);
    };
    /**
     * 通过子元素获取列表项
     * @param src 子元素DOM或索引值
     * @param type 0-返回列表项，1-返回列表项DOM，2-返回列表项索引值
     * @returns {*}
     */
    _this.item = function (src, type) {
        if (+src >= 0 && !type) return _this._list[+src];
        if (+src >= 0 && type) return $('.' + _this._node.item).eq(+src);
        if (src instanceof jQuery && !type) return _this._list[src.parents('.' + _this._node.item).index('.' + _this._node.item)];
        if (src instanceof jQuery && type === 2) return src.parents('.' + _this._node.item).index('.' + _this._node.item);
        if (src instanceof jQuery && type === 1) return src.parents('.' + _this._node.item);
    };
    /**
     * 获取列表（按页面显示顺序）
     * @param type 0-返回列表，1-返回列表DOM
     * @returns {*}
     */
    _this.list = function (type) {
        if (!type) return _this._list;
        if (type) return $('.' + _this._node.item);
    };
    _this._init(elem, sort, list, itemTpl, listInit);
};

/**
 * 精确加
 * @param arg1
 * @param arg2
 * @returns {number}
 */
Components.add = function (arg1, arg2) {
    var r1 = 0, r2 = 0, r3 = 0;
    try {
        r1 = (arg1 + '').split('.')[1].length;
    } catch (err) {
        r1 = 0;
    }
    try {
        r2 = (arg2 + '').split('.')[1].length;
    } catch (err) {
        r2 = 0;
    }
    r3 = Math.pow(10, Math.max(r1, r2));
    return (Components.mul(arg1, r3) + Components.mul(arg2, r3)) / r3;
};
/**
 * 精确减
 * @param arg1
 * @param arg2
 * @returns {number}
 */
Components.sub = function (arg1, arg2) {
    var r1 = 0, r2 = 0, r3 = 0;
    try {
        r1 = (arg1 + '').split('.')[1].length;
    } catch (err) {
        r1 = 0;
    }
    try {
        r2 = (arg2 + '').split('.')[1].length;
    } catch (err) {
        r2 = 0;
    }
    r3 = Math.pow(10, Math.max(r1, r2));
    return (Components.mul(arg1, r3) - Components.mul(arg2, r3)) / r3;
};
/**
 * 精确乘
 * @param arg1
 * @param arg2
 * @returns {number}
 */
Components.mul = function (arg1, arg2) {
    var r1 = arg1 + '', r2 = arg2 + '', r3 = 0, r4 = 0;
    try {
        r3 = r1.split('.')[1].length;
    } catch (err) {
        r3 = 0;
    }
    try {
        r4 = r2.split('.')[1].length;
    } catch (err) {
        r4 = 0;
    }
    return Number(r1.replace('.', '')) * Number(r2.replace('.', '')) / Math.pow(10, r4 + r3);
};
/**
 * 精确除
 * @param arg1
 * @param arg2
 * @returns {number}
 */
Components.div = function (arg1, arg2) {
    var r1 = arg1 + '', r2 = arg2 + '', r3 = 0, r4 = 0;
    try {
        r3 = r1.split('.')[1].length;
    } catch (err) {
        r3 = 0;
    }
    try {
        r4 = r2.split('.')[1].length;
    } catch (err) {
        r4 = 0;
    }
    return Components.mul((Number(r1.replace('.', '')) / Number(r2.replace('.', ''))), Math.pow(10, r4 - r3));
};
/**
 * 精确取余
 * @param arg1
 * @param arg2
 * @returns {number}
 */
Components.rem = function (arg1, arg2) {
    var r1 = 0, r2 = 0, r3 = 0;
    try {
        r1 = (arg1 + '').split('.')[1].length;
    } catch (err) {
        r1 = 0;
    }
    try {
        r2 = (arg2 + '').split('.')[1].length;
    } catch (err) {
        r2 = 0;
    }
    r3 = Math.pow(10, Math.max(r1, r2));
    return Components.mul(arg1, r3) % Components.mul(arg2, r3) / r3;
};
/**
 * 精确乘方
 * @param arg1
 * @param arg2
 * @returns {number}
 */
Components.pow = function (arg1, arg2) {
    var r1 = 0, r2 = 0;
    try {
        r1 = (arg1 + '').split('.')[1].length;
    } catch (err) {
        r1 = 0;
    }
    r2 = Math.pow(10, r1);
    return Math.pow(Components.mul(arg1, r2), arg2) / Math.pow(r2, arg2);
};
/**
 * 精确保留小数
 * @param arg1
 * @param dig 小数位数
 * @param flag 保留方式（-1：去尾；0：四舍五入；1：上位）
 * @returns {string}
 */
Components.fix = function (arg1, dig, flag) {
    dig = +dig > 0 ? +dig : 0;
    flag = Math.abs(flag) === 1 ? flag : 0;
    var r1 = Math.pow(10, dig), r2 = 0;
    if (flag === -1) r2 = Math.floor(Components.mul(arg1, r1)) / r1;
    if (flag === 0) r2 = Math.round(Components.mul(arg1, r1)) / r1;
    if (flag === 1) r2 = Math.ceil(Components.mul(arg1, r1)) / r1;
    return r2.toFixed(dig);
};

/**
 * 产生随机文本
 * @param len 长度
 * @returns {string}
 */
Components.rand = function (len) {
    len = +len > 1 ? +len : 1;
    var seed = 'ab1cd2ef3gh4ij5kl6mn7opq8rst9uvw0xyz', text = '';
    for (var i = 0; i < len; i++) text += seed.charAt(parseInt(seed.length * Math.random()));
    return text;
};
/**
 * 格式化日期
 * @param fmt 日期格式（如：yyyy年MM月dd日 hh时mm分ss秒 SSS毫秒 周W q季度）
 * @param date 日期
 * @returns {string|*}
 */
Components.date = function (fmt, date) {
    fmt = (fmt || '') + '';
    date = new Date(date || new Date());
    var map = {};
    map['M+'] = date.getMonth() + 1;
    map['d+'] = date.getDate();
    map['h+'] = date.getHours();
    map['m+'] = date.getMinutes();
    map['s+'] = date.getSeconds();
    map['q+'] = Math.floor((date.getMonth() + 3) / 3);
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    if (/(W+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]);
    if (/(S+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, date.getMilliseconds() + '');
    for (var key in map)
        if (new RegExp('(' + key + ')').test(fmt))
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? map[key] : ('00' + map[key]).substr(('' + map[key]).length));
    return fmt;
};

/**
 * 页面跳转
 * @param page 页面名
 * @param param 传参
 */
Components.goto = function (page, param) {
    $('#top').addClass('y_100');
    $('#mid').addClass('opa');
    $('#foot').addClass('y100');
    Components.delay(function () {
        localStorage.setItem('PAGEPARAMS000000', JSON.stringify(param || ''));
        if (page === -1) {
            history.back();
        } else {
            location.href = (page || 'home') + '.html?rnd=' + Components.rand(4);
        }
    });
};
/**
 * 返回上一页（由localStorage.prev设置）
 * @param param 传参
 */
Components.back = function (param) {
    var page = localStorage.getItem('prev');
    Components.goto(page || -1, param);
};
/**
 * 获取当前页面名
 * @returns {string}
 */
Components.page = function () {
    var href = location.href.split('/');
    var page = href.slice(href.length - 1, href.length).toString().split('.');
    return page.slice(0, 1).toString();
};
/**
 * 获取当前页传参
 * @param type
 * @returns {string}
 */
Components.param = function (type) {
    type = type === 1 ? 1 : 0;
    if (type) return localStorage.removeItem('PAGEPARAMS000000');
    try {
        return JSON.parse(localStorage.getItem('PAGEPARAMS000000')) || '';
    } catch (err) {
        return localStorage.getItem('PAGEPARAMS000000') || '';
    }
};
/**
 * 延迟执行函数
 * @param func 待执行函数
 * @param delay 延迟时间
 */
Components.delay = function (func, delay) {
    if (typeof func !== 'function') return;
    setTimeout(function () {
        func();
    }, +delay >= 0 ? +delay : 200);
};

/**
 * 页面缓存
 * @type {{__init__: string}}
 * @private
 */
Components._cache = {__init__: 'PAGECACHE000000'};
Components.setItem = function (key, value) {
    Components._cache[key] = value;
};
Components.getItem = function (key) {
    return Components._cache[key];
};
Components.removeItem = function (key) {
    Components._cache[key] = undefined;
};

/**
 * 获取焦点
 * @param elem 表单元素
 * @param flag 是否隐藏软键盘
 */
Components.focus = function (elem, flag) {
    elem = elem || '';
    if (flag) {
        Components.delay(function () {
            $(elem).focus();
            try {
                uexWindow.hideSoftKeyboard();
            } catch (err) {
            }
        }, 100);
    } else {
        Components.delay(function () {
            $(elem).focus();
        }, 100);
    }
};
/**
 * 丢失焦点
 * @param elem 表单元素
 * @param flag 是否不强制隐藏软键盘（false强制）
 */
Components.blur = function (elem, flag) {
    elem = elem || '';
    if (flag) {
        Components.delay(function () {
            $(elem).blur();
        }, 100);
    } else {
        Components.delay(function () {
            try {
                uexWindow.hideSoftKeyboard();
            } catch (err) {
            }
            $(elem).blur();
        }, 100);
    }
};

/**
 * 打开日期选择器
 * @param func 回调方法
 * @param init 初始日期（'1999-1-1'）
 */
Components.openDatePicker = function (func, init) {
    try {
        uexControl.onError = function (data) {
        };
        var datetime = new Date(init + '');
        if (!datetime.getFullYear()) datetime = new Date();
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1;
        var date = datetime.getDate();
        uexControl.openDatePicker(year, month, date, function (data) {
            var result = new Date((+data.year || year) + '/' +
                (+data.month || month) + '/' + (+data.day || date));
            if (!result.getFullYear()) result = new Date();
            if (typeof func === 'function') func(result);
        });
    } catch (err) {
        if (typeof func === 'function') func(null);
    }
};
/**
 * 打开时间选择器
 * @param func 回调方法
 * @param init 初始时间（'8:00'）
 */
Components.openTimePicker = function (func, init) {
    try {
        uexControl.onError = function (data) {
        };
        var datetime = new Date('1970-1-1 ' + init);
        if (!datetime.getFullYear()) datetime = new Date();
        var hour = datetime.getHours();
        var minute = datetime.getMinutes();
        uexControl.openTimePicker(hour, minute, function (data) {
            var result = new Date('1970-1-1 ' + (+data.hour || hour)
                + ':' + (+data.minute || minute));
            if (!result.getFullYear()) result = new Date();
            if (typeof func === 'function') func(result);
        });
    } catch (err) {
        if (typeof func === 'function') func(null);
    }
};

/**
 * 打开扫描条码
 * @param func 回调方法（参数：code条码，type类型）
 */
Components.openScanner = function (func) {
    try {
        uexScanner.open(function (error, data) {
            if (error) data = {code: null, type: null};
            if (typeof func === 'function') func(data.code, data.type);
        });
    } catch (err) {
        if (typeof func === 'function') func(null, null);
    }
};

/**
 * 组件库初始化完成方法
 */
// (Components.ready = function () {
//     localStorage.removeItem('prev');
//     $('#top').removeClass('y_100');
//     $('#mid').removeClass('opa');
//     $('#foot').removeClass('y100');
//     Components.focus("input",true);
//     //$("body").themeinit(localStorage.color);//初始化  颜色
// })();

/**
 * 蓝牙打印(适用于ESC/POS指令集、串口连接)
 * @type {{}}
 */
Components.bluetoothPrint = {};
Components.bluetoothPrint._hasInit = false;
Components.bluetoothPrint.init = function (domid) {
    if (Components.bluetoothPrint._hasInit) return;
    domid = domid + '';
    var deviceListBox = new Components.SingleSelectBox('head');
    var deviceList = [], load = null;
    deviceListBox.setItemTpl(function (index, item) {
        return '<div style="line-height:35px;background:transparent;text-align:left;' +
            'padding:5px 12px;border-bottom:1px solid #d9d9d9;">' +
            '<p>' + (item.name || '') + (item.class ? '(' + item.class + ')' : '') + '</p>' +
            '<p>' + (item.address || '') + '</p></div>';
    });
    deviceListBox.setItemTapFunc(function (src, elem, item) {
        load = Components.loading(false, '连接蓝牙设备' + item.name + '中...');
        uexBluetoothSerial.connect(item.address || '');
    });
    uexBluetoothSerial.onIsEnabledCallback = function (opId, dataType, data) {
        data = JSON.parse(data || 'false');
        if (data) {
            Components.bluetoothPrint._hasInit = true;
            uexBluetoothSerial.isConnected();
        } else {
            if (Components.bluetoothPrint._hasInit) Components.alert('本机蓝牙不可用，请先打开蓝牙并与设备配对！');
            Components.bluetoothPrint._hasInit = true;
            $(domid).text('连接').hammer().off('tap').on('tap', function (event) {
                event.stopPropagation();
                uexBluetoothSerial.isEnabled();
            });
        }
    };
    uexBluetoothSerial.onIsConnectedCallback = function (opId, dataType, data) {
        data = JSON.parse(data || 'false');
        if (data) {
            $(domid).text('断开').hammer().off('tap').on('tap', function (event) {
                event.stopPropagation();
                load = Components.loading(false, '断开蓝牙设备中...');
                uexBluetoothSerial.disconnect();
            });
        } else {
            $(domid).text('连接').hammer().off('tap').on('tap', function (event) {
                event.stopPropagation();
                load = Components.loading(false, '搜索蓝牙设备中...');
                uexBluetoothSerial.listDevices();
            });
        }
    };
    uexBluetoothSerial.onlistDevicesCallback = function (opId, dataType, data) {
        Components.unload(load);
        deviceList = JSON.parse(data || '[]');
        deviceListBox.setList(deviceList).show();
    };
    uexBluetoothSerial.onConnectCallback = function (opId, dataType, data) {
        $(domid).text('连接中...').hammer().off('tap');
    };
    uexBluetoothSerial.onDisConnectCallback = function (opId, dataType, data) {
        $(domid).text('断开中...').hammer().off('tap');
    };
    uexBluetoothSerial.onConnectionSuccessEvent = function (opId, dataType, data) {
        Components.unload(load);
        Components.alert('蓝牙设备已连接');
        $(domid).text('断开').hammer().off('tap').on('tap', function (event) {
            event.stopPropagation();
            load = Components.loading(false, '断开蓝牙设备中...');
            uexBluetoothSerial.disconnect();
        });
    };
    uexBluetoothSerial.onConnectionLostEvent = function (opId, dataType, data) {
        Components.unload(load);
        Components.alert('蓝牙设备已断开');
        $(domid).text('连接').hammer().off('tap').on('tap', function (event) {
            event.stopPropagation();
            load = Components.loading(false, '搜索蓝牙设备中...');
            uexBluetoothSerial.listDevices();
        });
    };
    uexBluetoothSerial.onWriteCallback = function (opId, dataType, data) {
    };
    uexBluetoothSerial.isEnabled();
};
// 初始化蓝牙管理
Components.bluetoothPrint.onConnectionLost = function (fn) {
    uexBluetoothSerial.onConnectionLostEvent = function (opId, dataType, data) {
        Components.alert('蓝牙设备已断开');
        if (typeof fn === 'function') fn();
    };
};




Components.bluetoothPrint._printFormat = {}; // 打印格式设置
Components.bluetoothPrint._printFormat.PRINTLINE = ['0A'].join(''); // 打印一行
Components.bluetoothPrint._printFormat.RESET = ['1B', '40'].join(''); // 复位
Components.bluetoothPrint._printFormat.LINE_SPACING_DEFAULT = ['1B', '32'].join(''); // 默认行间距
Components.bluetoothPrint._printFormat.LINE_SPACING_DOUBLE = ['1B', '33', '40'].join(''); // 加倍行间距
Components.bluetoothPrint._printFormat.UNDERLINE = ['1B', '2D', '01'].join(''); // 下划线
Components.bluetoothPrint._printFormat.UNDERLINE_CANCEL = ['1B', '2D', '00'].join(''); // 取消下划线
Components.bluetoothPrint._printFormat.BOLD = ['1B', '45', '01'].join(''); // 加粗
Components.bluetoothPrint._printFormat.BOLD_CANCEL = ['1B', '45', '00'].join(''); // 取消加粗
Components.bluetoothPrint._printFormat.ROTATE = ['1B', '56', '01'].join(''); // 旋转90度
Components.bluetoothPrint._printFormat.ROTATE_CANCEL = ['1B', '56', '00'].join(''); // 取消旋转90度
Components.bluetoothPrint._printFormat.ALIGN_LEFT = ['1B', '61', '00'].join(''); // 左对齐
Components.bluetoothPrint._printFormat.ALIGN_CENTER = ['1B', '61', '01'].join(''); // 中间对齐
Components.bluetoothPrint._printFormat.ALIGN_RIGHT = ['1B', '61', '02'].join(''); // 右对齐
Components.bluetoothPrint._printFormat.INVERSION = ['1B', '7B', '01'].join(''); // 倒置
Components.bluetoothPrint._printFormat.INVERSION_CANCEL = ['1B', '7B', '00'].join(''); // 取消倒置
Components.bluetoothPrint._printFormat.DOUBLE_HEIGHT_WIDTH = ['1D', '21', '11'].join(''); // 宽高加倍
Components.bluetoothPrint._printFormat.DOUBLE_WIDTH = ['1D', '21', '10'].join(''); // 宽加倍
Components.bluetoothPrint._printFormat.DOUBLE_HEIGHT = ['1D', '21', '01'].join(''); // 高加倍
Components.bluetoothPrint._printFormat.NORMAL_HEIGHT_WIDTH = ['1D', '21', '00'].join(''); // 宽高正常
Components.bluetoothPrint._printFormat.REVERSE = ['1D', '42', '01'].join(''); // 反显
Components.bluetoothPrint._printFormat.REVERSE_CANCEL = ['1D', '42', '00'].join(''); // 取消反显
// 行宽 57mm是32.  80mm 是48  ---标识在打印纸上32个- 组成的横线
//Components.bluetoothPrint._printFormat.LINE_SIZE = localStorage.printFormat == "57" ? 100 : 100;
Components.bluetoothPrint._printFormat.LINE_SIZE =75;

Components.bluetoothPrint._printFormat.SIZE = function (text) {
    text = text + '';
    var char = text.replace(/[^\x00-\xff]/g, '**');
    return char.length;
};
Components.bluetoothPrint._printFormat.RESIZE = function (text, size) {
    text = text + '';
    size = +size || Components.bluetoothPrint._printFormat.SIZE(text);
    while (Components.bluetoothPrint._printFormat.SIZE(text) > size) text = text.slice(0, -1);
    return text;
};
Components.bluetoothPrint._printFormat.OMIT = function (text) {
    text = text + '';
    var char = text.charAt(text.length - 1);
    if (/[^\x00-\xff]/.test(char)) {
        text = text.slice(0, -1) + '..';
    } else {
        text = text.slice(0, -2) + '..';
    }
    return text;
};
// 打印分隔条----------------
Components.bluetoothPrint._printFormat.PRINTDASHLINE = function () {
    var main = [];
    var len = Components.bluetoothPrint._printFormat.LINE_SIZE-10;
    for (var i = 0; i < len; i++) main.push('-');
    main = main.join('');
    return main;
};


// 一栏
Components.bluetoothPrint._printFormat.ONE_COLUMNS = function (text1) {
    text1 = text1 + '';
    var size1 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE);
    if (Components.bluetoothPrint._printFormat.SIZE(text1) > size1) text1 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text1, size1));
    return text1;
};
// 两栏
Components.bluetoothPrint._printFormat.TWO_COLUMNS = function (text1, text2) {
    text1 = text1 + '';
    text2 = text2 + '';
    var size1 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 2);
    var size2 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 2);
    if (Components.bluetoothPrint._printFormat.SIZE(text1) > size1) text1 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text1, size1));
    if (Components.bluetoothPrint._printFormat.SIZE(text2) > size2) text2 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text2, size2));
    var text1size = Components.bluetoothPrint._printFormat.SIZE(text1);
    var text2size = Components.bluetoothPrint._printFormat.SIZE(text2);
    var main = text1;
    var margin1 = size1 - text1size;
    for (var i = 0; i < margin1; i++) main += ' ';
    main += text2;
    var margin2 = size2 - text2size;
    for (var j = 0; j < margin2; j++) main += ' ';
    return main;
};
// 两栏 特殊化
Components.bluetoothPrint._printFormat.TWO_COLUMNS_SPEC = function (text1, text2) {
    text1 = text1 + '';
    text2 = text2 + '';
    var size1 = parseInt(30);
    var size2 = parseInt(50);
    if (Components.bluetoothPrint._printFormat.SIZE(text1) > size1) text1 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text1, size1));
    if (Components.bluetoothPrint._printFormat.SIZE(text2) > size2) text2 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text2, size2));
    var text1size = Components.bluetoothPrint._printFormat.SIZE(text1);
    var text2size = Components.bluetoothPrint._printFormat.SIZE(text2);
    var main = text1;
    var margin1 = size1 - text1size;
    for (var i = 0; i < margin1; i++) main += ' ';
    main += text2;
    var margin2 = size2 - text2size;
    for (var j = 0; j < margin2; j++) main += ' ';
    return main;
};
// 三栏
Components.bluetoothPrint._printFormat.THREE_COLUMNS = function (text1, text2, text3) {
    text1 = text1 + '';
    text2 = text2 + '';
    text3 = text3 + '';
    var size1 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 3);
    var size2 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 3);
    var size3 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 3);
    if (Components.bluetoothPrint._printFormat.SIZE(text1) > size1) text1 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text1, size1));
    if (Components.bluetoothPrint._printFormat.SIZE(text2) > size2) text2 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text2, size2));
    if (Components.bluetoothPrint._printFormat.SIZE(text3) > size3) text3 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text3, size3));
    var text1size = Components.bluetoothPrint._printFormat.SIZE(text1);
    var text2size = Components.bluetoothPrint._printFormat.SIZE(text2);
    var text3size = Components.bluetoothPrint._printFormat.SIZE(text3);
    var main = text1;
    var margin1 = size1 - text1size;
    for (var i = 0; i < margin1; i++) main += ' ';
    main += text2;
    var margin2 = size2 - text2size;
    for (var j = 0; j < margin2; j++) main += ' ';
    main += text3;
    var margin3 = size3 - text3size;
    for (var k = 0; k < margin3; k++) main += ' ';
    return main;
};

// 四栏
Components.bluetoothPrint._printFormat.FOUR_COLUMNS = function (text1, text2, text3, text4) {
    text1 = text1 + '';
    text2 = text2 + '';
    text3 = text3 + '';
    text4 = text4 + '';
    var size1 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 4);
    var size2 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 4);
    var size3 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 4);
    var size4 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 4);
    if (Components.bluetoothPrint._printFormat.SIZE(text1) > size1) text1 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text1, size1));
    if (Components.bluetoothPrint._printFormat.SIZE(text2) > size2) text2 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text2, size2));
    if (Components.bluetoothPrint._printFormat.SIZE(text3) > size3) text3 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text3, size3));
    if (Components.bluetoothPrint._printFormat.SIZE(text4) > size4) text4 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text4, size4));
    var text1size = Components.bluetoothPrint._printFormat.SIZE(text1);
    var text2size = Components.bluetoothPrint._printFormat.SIZE(text2);
    var text3size = Components.bluetoothPrint._printFormat.SIZE(text3);
    var text4size = Components.bluetoothPrint._printFormat.SIZE(text4);
    var main = text1;
    var margin1 = size1 - text1size;
    for (var i = 0; i < margin1; i++) main += ' ';
    main += text2;
    var margin2 = size2 - text2size;
    for (var j = 0; j < margin2; j++) main += ' ';
    main += text3;
    var margin3 = size3 - text3size;
    for (var k = 0; k < margin3; k++) main += ' ';
    main += text4;
    var margin4 = size4 - text4size;
    for (var l = 0; l < margin4; l++) main += ' ';
    return main;
};

/*
* 新增 5栏
*
* */
Components.bluetoothPrint._printFormat.FIVE_COLUMNS = function (text1, text2, text3, text4,text5) {
    text1 = text1 + '';
    text2 = text2 + '';
    text3 = text3 + '';
    text4 = text4 + '';
    text5 = text5 + '';
    var size1 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 5);
    var size2 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 5);
    var size3 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 5);
    var size4 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 5);
    var size5 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 5);
    if (Components.bluetoothPrint._printFormat.SIZE(text1) > size1) text1 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text1, size1));
    if (Components.bluetoothPrint._printFormat.SIZE(text2) > size2) text2 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text2, size2));
    if (Components.bluetoothPrint._printFormat.SIZE(text3) > size3) text3 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text3, size3));
    if (Components.bluetoothPrint._printFormat.SIZE(text4) > size4) text4 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text4, size4));
    if (Components.bluetoothPrint._printFormat.SIZE(text5) > size5) text5 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text5, size5));
    var text1size = Components.bluetoothPrint._printFormat.SIZE(text1);
    var text2size = Components.bluetoothPrint._printFormat.SIZE(text2);
    var text3size = Components.bluetoothPrint._printFormat.SIZE(text3);
    var text4size = Components.bluetoothPrint._printFormat.SIZE(text4);
    var text5size = Components.bluetoothPrint._printFormat.SIZE(text5);
    var main = text1;
    var margin1 = size1 - text1size;
    for (var i = 0; i < margin1; i++) main += ' ';
    main += text2;
    var margin2 = size2 - text2size;
    for (var j = 0; j < margin2; j++) main += ' ';
    main += text3;
    var margin3 = size3 - text3size;
    for (var k = 0; k < margin3; k++) main += ' ';
    main += text4;
    var margin4 = size4 - text4size;
    for (var l = 0; l < margin4; l++) main += ' ';
    main += text5;
    var margin5 = size5 - text5size;
    for (var x = 0; x < margin5; x++) main += ' ';
    return main;
};

//6 lan6 栏
Components.bluetoothPrint._printFormat.SIX_COLUMNS = function (text1, text2, text3, text4,text5,text6) {
    text1 = text1 + '';
    text2 = text2 + '';
    text3 = text3 + '';
    text4 = text4 + '';
    text5 = text5 + '';
    text6 = text6 + '';
    var size1 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 6);
    var size2 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 6);
    var size3 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 6);
    var size4 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 6);
    var size5 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 6);
    var size6 = parseInt(Components.bluetoothPrint._printFormat.LINE_SIZE / 6);
    if (Components.bluetoothPrint._printFormat.SIZE(text1) > size1) text1 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text1, size1));
    if (Components.bluetoothPrint._printFormat.SIZE(text2) > size2) text2 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text2, size2));
    if (Components.bluetoothPrint._printFormat.SIZE(text3) > size3) text3 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text3, size3));
    if (Components.bluetoothPrint._printFormat.SIZE(text4) > size4) text4 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text4, size4));
    if (Components.bluetoothPrint._printFormat.SIZE(text5) > size5) text5 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text5, size5));
    if (Components.bluetoothPrint._printFormat.SIZE(text6) > size6) text6 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text6, size6));
    var text1size = Components.bluetoothPrint._printFormat.SIZE(text1);
    var text2size = Components.bluetoothPrint._printFormat.SIZE(text2);
    var text3size = Components.bluetoothPrint._printFormat.SIZE(text3);
    var text4size = Components.bluetoothPrint._printFormat.SIZE(text4);
    var text5size = Components.bluetoothPrint._printFormat.SIZE(text5);
    var text6size = Components.bluetoothPrint._printFormat.SIZE(text6);
    var main = text1;
    var margin1 = size1 - text1size;
    for (var i = 0; i < margin1; i++) main += ' ';
    main += text2;
    var margin2 = size2 - text2size;
    for (var j = 0; j < margin2; j++) main += ' ';
    main += text3;
    var margin3 = size3 - text3size;
    for (var k = 0; k < margin3; k++) main += ' ';
    main += text4;
    var margin4 = size4 - text4size;
    for (var l = 0; l < margin4; l++) main += ' ';
    main += text5;
    var margin5 = size5 - text5size;
    for (var x = 0; x < margin5; x++) main += ' ';
    main += text6;
    var margin6 = size6 - text6size;
    for (var y = 0; y < margin6; y++) main += ' ';
    return main;
};
//7 栏
Components.bluetoothPrint._printFormat.SEVEN_COLUMNS = function (text1, text2, text3, text4,text5,text6,text7) {
    text1 = text1 + '';
    text2 = text2 + '';
    text3 = text3 + '';
    text4 = text4 + '';
    text5 = text5 + '';
    text6 = text6 + '';
    text7 = text7 + '';
    var size1 = parseInt(12);
    var size2 = parseInt(12);
    var size3 = parseInt(8);
    var size4 = parseInt(7);
    var size5 = parseInt(6);
    var size6 = parseInt(8);
    var size7 = parseInt(12);
    if (Components.bluetoothPrint._printFormat.SIZE(text1) > size1) text1 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text1, size1));
    if (Components.bluetoothPrint._printFormat.SIZE(text2) > size2) text2 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text2, size2));
    if (Components.bluetoothPrint._printFormat.SIZE(text3) > size3) text3 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text3, size3));
    if (Components.bluetoothPrint._printFormat.SIZE(text4) > size4) text4 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text4, size4));
    if (Components.bluetoothPrint._printFormat.SIZE(text5) > size5) text5 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text5, size5));
    if (Components.bluetoothPrint._printFormat.SIZE(text6) > size6) text6 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text6, size6));
    if (Components.bluetoothPrint._printFormat.SIZE(text7) > size6) text7 = Components.bluetoothPrint._printFormat.OMIT(Components.bluetoothPrint._printFormat.RESIZE(text7, size7));
    var text1size = Components.bluetoothPrint._printFormat.SIZE(text1);
    var text2size = Components.bluetoothPrint._printFormat.SIZE(text2);
    var text3size = Components.bluetoothPrint._printFormat.SIZE(text3);
    var text4size = Components.bluetoothPrint._printFormat.SIZE(text4);
    var text5size = Components.bluetoothPrint._printFormat.SIZE(text5);
    var text6size = Components.bluetoothPrint._printFormat.SIZE(text6);
    var text7size = Components.bluetoothPrint._printFormat.SIZE(text7);
    var main = text1;
    var margin1 = size1 - text1size;
    for (var i = 0; i < margin1; i++) main += ' ';
    main += text2;
    var margin2 = size2 - text2size;
    for (var j = 0; j < margin2; j++) main += ' ';
    main += text3;
    var margin3 = size3 - text3size;
    for (var k = 0; k < margin3; k++) main += ' ';
    main += text4;
    var margin4 = size4 - text4size;
    for (var l = 0; l < margin4; l++) main += ' ';
    main += text5;
    var margin5 = size5 - text5size;
    for (var x = 0; x < margin5; x++) main += ' ';
    main += text6;
    var margin6 = size6 - text6size;
    for (var y = 0; y < margin6; y++) main += ' ';
    main += text7;
    var margin7 = size7 - text7size;
    for (var z = 0; z < margin7; z++) main += ' ';
    return main;
};

// 打印条码(ITF)
Components.bluetoothPrint._printFormat.PRINTBARCODE = function (text) {
    text = (text + '').slice(0, 13);
    var map = ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39'];
    var main = ['1D', '48', '02', '1D', '6B', '46', '0E'];
    for (var i = 0; i < 13; i++) main.push(map[+text[i] || 0]);
    main.push('30');
    main = main.join('');
    return main;
};

// 打印小票
Components.bluetoothPrint._printTicket = function (ticketMain, ticketDetail, fn) {
    ticketMain = ticketMain || {};
    ticketDetail = ticketDetail && ticketDetail.length ? ticketDetail : [];
    for (var m = 0; m < 2; m++) {
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.RESET);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.LINE_SPACING_DEFAULT);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(ticketMain.xtwlmc || '')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD_CANCEL);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('（' + (ticketMain.ddlxmc || '') + '）')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_LEFT);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('购货单位：' + (ticketMain.xshkmc || '')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('日    期：' + Components.date('yyyy年MM月dd日 hh:mm:ss', ticketMain.kcczrq || '')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('联系电话：' + (ticketMain.xtwldh || '')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.FOUR_COLUMNS('商品', '数量', '单价', '金额')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        for (var i = 0; i < ticketDetail.length; i++) {
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(ticketDetail[i].xtwpmc || '')));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.FOUR_COLUMNS(' ', ticketDetail[i].kcczsl || 0, Components.fix(ticketDetail[i].kcsjdj || '', 2), Components.fix(ticketDetail[i].kcssje || '', 2))));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        }
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('支付方式：'));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('          ' + (ticketMain.xtjsmc || '') + '  ：  ' + '￥' + Components.fix(ticketMain.xsskje || '', 2)));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS('销售数量：' + ticketMain.kcczsl || 0, '付款金额：￥' + Components.fix(ticketMain.kcssje || '', 2))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS('实收金额：￥' + Components.fix(ticketMain.xsskje || '', 2), '找零金额：￥' + Components.fix(ticketMain.kczlje || '', 2))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('送 货 人：' + (ticketMain.xtlxry || '')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('联系电话：' + (ticketMain.xtlxdh || '')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('车    号：' + (ticketMain.xtzzsh || '')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('验收签字：'));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTBARCODE(ticketMain.xtxphm || ''));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('欢迎光临  谢谢惠顾'));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_LEFT);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
    }
    if (typeof fn === 'function') fn(true);
};

// 获取小票
Components.bluetoothPrint.printTicket = function (czhm, xphm, fn) {
    if (!czhm || !xphm) return;
    var load = Components.loading();
    var vBiz = new FYBusiness('biz.salprint.qry');
    var vOpr1 = vBiz.addCreateService('svc.salprint.qry', false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue('AS_USERID', LoginName);
    vOpr1Data.setValue('AS_WLDM', DepartmentCode);
    vOpr1Data.setValue('AS_FUNC', 'svc.salprint.qry');
    vOpr1Data.setValue('AS_XPHM', xphm + '');
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (res) {
        Components.unload(load);
        if ((res.iswholeSuccess === 'Y' || res.isAllBussSuccess === 'Y')) {
            var rsm = vOpr1.getResult(res, 'AC_SALMAIN').rows || [];
            var rsl = vOpr1.getResult(res, 'AC_SALDETAIL').rows || [];
            if (!rsm || !rsm.length || !rsl || !rsl.length) {
                Components.alert('无法获取小票详细信息！', function () {
                    if (typeof fn === 'function') fn(false);
                });
                return;
            }
            try {
                Components.bluetoothPrint._printTicket(rsm[0], rsl, fn);
            } catch (err) {
                Components.alert('打印小票' + xphm + '失败！请检查蓝牙打印机连接。', function () {
                    if (typeof fn === 'function') fn(false);
                });
            }
        } else {
            Components.alert('无法获取小票详细信息！' + (res.errorMessage || ''), function () {
                if (typeof fn === 'function') fn(false);
            });
        }
    });
};






/*
* 销售小票*/
// 销售小票 80 格式
Components.bluetoothPrint._printSaleTicket80 = function (head,pro,zhifu,huiyuan, fn) {
    for (var m = 0; m < 1; m++) {
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.RESET);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.LINE_SPACING_DEFAULT);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('销售单')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD_CANCEL);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_LEFT);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('单号：' + (head.xtxphm || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('店面：' + (head.xtwldm || '') + ' ' + (head.xtwlmc || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('日期：' + Components.date('yyyy-MM-dd hh:mm', head.kcczrq || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('备注：' + (head.kcczbz || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.FOUR_COLUMNS('商品', '数量', '单价', '金额')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        for (var i = 0; i < pro.length; i++) {
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(pro[i].xtwpmc || '')));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.FOUR_COLUMNS(' ', pro[i].kcczsl || 0, Components.fix(pro[i].kcxsdj || '', 2), Components.fix(pro[i].kcssje || '', 2))));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        }
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('支付方式：')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);

        for (var y = 0; y < zhifu.length; y++) {
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS( zhifu[y].xsjssm || '',  Components.fix(zhifu[y].kcxsje || '', 2))));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        }

        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD);

        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS('销售数量：' + (head.kcsl || 0), '付款金额：' + Components.fix(head.xsskje  || '', 2))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS('实收金额：' + Components.fix(head.kcssje || '', 2), '找零金额：' + Components.fix(head.kczlje || '', 2))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('会员卡号：' + (huiyuan.khhykh || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS('本次积分：' + (huiyuan.xsjf || 0), '累计积分：' + (huiyuan.zjf || 0))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('剩余储值金额：' + Components.fix(huiyuan.czkje || '', 2))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS('导购：' + (head.xsry || ''), '收银员：' + (head.xtyhxm || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('店面地址：' + (head.xtwldz || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('店面电话：' + (head.xtwldh || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('此小票为最终凭证，以此小票退换货，如商品'));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('变价，按现价执行。'));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTBARCODE(head.xtxphm || ''));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_LEFT);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
    }
    if (typeof fn === 'function') fn(true);
};

//销售小票--57格式
Components.bluetoothPrint._printSaleTicket57 = function (head,pro,zhifu,huiyuan, fn) {
    for (var m = 0; m < 1; m++) {
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.RESET);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.LINE_SPACING_DEFAULT);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('销售单')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD_CANCEL);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_LEFT);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('单号：' + (head.xtxphm || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('店面：' + (head.xtwldm || '') + ' ' + (head.xtwlmc || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('日期：' + Components.date('yyyy-MM-dd hh:mm', head.kcczrq || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('备注：' + (head.kcczbz || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.THREE_COLUMNS('商品', '数量', '金额')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        for (var i = 0; i < pro.length; i++) {
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(pro[i].xtwpmc || '')));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.THREE_COLUMNS(' ', pro[i].kcczsl || 0,  Components.fix(pro[i].kcssje || '', 2))));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        }
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('支付方式：')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);

        for (var y = 0; y < zhifu.length; y++) {
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS( zhifu[y].xsjssm || '',  Components.fix(zhifu[y].kcxsje || '', 2))));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        }

        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_LEFT);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('销售数量：' + (head.kcsl || 0))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('付款金额：' + Components.fix(head.xsskje || '', 2))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('实收金额：' + Components.fix(head.kcssje || '', 2))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('找零金额：' + Components.fix(head.kczlje || '', 2))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('会员卡号：' + (huiyuan.khhykh || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS('本次积分：' + (huiyuan.xsjf || 0), '累计积分：' + (huiyuan.zjf || 0))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('剩余储值金额：' + Components.fix(huiyuan.czkje || '', 2))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('导购：' + (head.xsry || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('收银员：' + (head.xtyhxm || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('店面地址：' + (head.xtwldz || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('店面电话：' + (head.xtwldh || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('此小票为最终凭证，以此小票退换货'));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex('如商品变价，按现价执行。'));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTBARCODE(head.xtxphm || ''));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_LEFT);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
    }
    if (typeof fn === 'function') fn(true);
};
// 其他小票80 格式
Components.bluetoothPrint._printOtherTicket80 = function (ticketMain, ticketDetail, fn) {
    ticketMain = ticketMain || {};
    ticketDetail = ticketDetail && ticketDetail.length ? ticketDetail : [];
    ticketMain.slhj = 0;
    ticketMain.jehj = 0;
    var startname = '发货仓库：';
    var endname = '收货仓库：';
    if(ticketMain.djmc =="发货单"){
        startname = '发货仓库：';
        endname = '收货客户：';
    }
    if(ticketMain.djmc =="退货单"){
        startname = '退入仓库：';
        endname = '退货客户：';
    }
    if(ticketMain.djmc =="退货出库处理"){
        startname = '退货仓库：';
        endname = '收货仓库：';
    }
    if(ticketMain.djmc =="零售单"){
        startname = '店面：';
        endname = '';
    }
    if(ticketMain.djmc =="盘点单"){
        startname = '仓库：';
        endname = '';
    }
    if(ticketMain.djmc.substr(0,1)=='*'){
    	ticketMain.djmc = ticketMain.djmc.substr(1);
        startname = '仓库名称：';
        endname = '往来客户：';
    }
    for (var m = 0; m < 1; m++) {
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.RESET);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.LINE_SPACING_DEFAULT);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(ticketMain.djmc || '未知单据')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD_CANCEL);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_LEFT);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('单号：' + (ticketMain.djhm || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(startname+'' + (ticketMain.kcckdm || '') + ' ' + (ticketMain.kcckmc || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        if(ticketMain.djmc =="零售单" || ticketMain.djmc =="盘点单"){
	        
	    }else{
	    	uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(endname+'' + (ticketMain.dfckdm || '') + ' ' + (ticketMain.dfckmc || ''))));
        	uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
	    }
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('日期：' + Components.date('yyyy-MM-dd hh:mm', ticketMain.djrq || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('备注：' + (ticketMain.djbz || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.FOUR_COLUMNS('商品', '数量', '单价', '金额')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        for (var i = 0; i < ticketDetail.length; i++) {
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(ticketDetail[i].xtwpmc || '')));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.FOUR_COLUMNS(' ', ticketDetail[i].xtwpsl || 0, Components.fix(ticketDetail[i].wpje || '', 2), Components.fix(ticketDetail[i].wpje || '', 2))));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
            ticketMain.slhj += +ticketDetail[i].xtwpsl || 0;
            ticketMain.jehj += +ticketDetail[i].wpje || 0;
        }
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS('数量合计：' + (ticketMain.slhj || 0), '金额合计：' + Components.fix(ticketMain.jehj || '', 2))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('操作人员：' + (ticketMain.lrrydm || '') + ' ' + (ticketMain.lrry || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('操作日期：' + (ticketMain.kclrrq || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
    }
    if (typeof fn === 'function') fn(true);
};
// 其他小票57 格式
Components.bluetoothPrint._printOtherTicket57 = function (ticketMain, ticketDetail, fn) {
    ticketMain = ticketMain || {};
    ticketDetail = ticketDetail && ticketDetail.length ? ticketDetail : [];
    ticketMain.slhj = 0;
    ticketMain.jehj = 0;
    var startname = '发货仓库：';
    var endname = '收货仓库：';
    if(ticketMain.djmc =="发货单"){
        startname = '发货仓库：';
        endname = '收货客户：';
    }
    if(ticketMain.djmc =="退货单"){
        startname = '退入仓库：';
        endname = '退货客户：';
    }
    if(ticketMain.djmc =="退货出库处理"){
        startname = '退货仓库：';
        endname = '收货仓库：';
    }
    if(ticketMain.djmc =="零售单"){
        startname = '店面：';
        endname = '';
    }
    if(ticketMain.djmc =="盘点单"){
        startname = '仓库：';
        endname = '';
    }
    if(ticketMain.djmc.substr(0,1)=='*'){
    	ticketMain.djmc = ticketMain.djmc.substr(1);
        startname = '仓库名称：';
        endname = '往来客户：';
    }
    for (var m = 0; m < 1; m++) {
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.RESET);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.LINE_SPACING_DEFAULT);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(ticketMain.djmc || '未知单据')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD_CANCEL);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_LEFT);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('单号：' + (ticketMain.djhm || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(startname+'' + (ticketMain.kcckdm || '') + ' ' + (ticketMain.kcckmc || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        if(ticketMain.djmc =="零售单" || ticketMain.djmc =="盘点单"){
	        
	    }else{
	    	uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(endname+'' + (ticketMain.dfckdm || '') + ' ' + (ticketMain.dfckmc || ''))));
        	uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
	    }
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('日期：' + Components.date('yyyy-MM-dd hh:mm', ticketMain.djrq || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('备注：' + (ticketMain.djbz || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.THREE_COLUMNS('商品', '数量', '金额')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        for (var i = 0; i < ticketDetail.length; i++) {
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(ticketDetail[i].xtwpmc || '')));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.THREE_COLUMNS(' ', ticketDetail[i].xtwpsl || 0, Components.fix(ticketDetail[i].wpje || '', 2))));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
            ticketMain.slhj += +ticketDetail[i].xtwpsl || 0;
            ticketMain.jehj += +ticketDetail[i].wpje || 0;
        }
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('数量合计：' + (ticketMain.slhj || 0))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS( '金额合计：' + Components.fix(ticketMain.jehj || '', 2))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('操作人员：' + (ticketMain.lrrydm || '') + ' ' + (ticketMain.lrry || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('操作日期：' + (ticketMain.kclrrq || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
    }
    if (typeof fn === 'function') fn(true);
};
// 打印销售小票
Components.bluetoothPrint.printSaleTicket = function (czhm, xphm,format, fn) {
    if (!czhm || !xphm) return;
    var load = Components.loading(false,"正在打印...");
    var vBiz = new FYBusiness('biz.sa.work.pos.print');
    var vOpr1 = vBiz.addCreateService('svc.sa.work.pos.print', false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue('AS_XPHM', xphm + '');
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (res) {
        if ((res.iswholeSuccess === 'Y' || res.isAllBussSuccess === 'Y')) {//CA_HEADER,CURSOR_4,CURSOR_5,CURSOR_6
            var head = vOpr1.getResult(res, 'CA_HEADER').rows || [];
            var pro = vOpr1.getResult(res, 'CURSOR_4').rows || [];//商品
            var zhifu = vOpr1.getResult(res, 'CURSOR_5').rows || [];//支付方式
            var huiyuan = vOpr1.getResult(res, 'CURSOR_6').rows || [];//会员
            if (!head || !head.length || !pro || !pro.length || !zhifu || !zhifu.length || !huiyuan || !huiyuan.length) {
                Components.alert('无法获取小票详细信息！', function () {
                    if (typeof fn === 'function') fn(false);
                });
                return;
            }
            if(format =="80"){
                try {
                    Components.bluetoothPrint._printSaleTicket80(head[0], pro,zhifu,huiyuan[0], Components.unload(load));
                } catch (err) {
                    Components.alert('打印小票' + xphm + '失败！请检查蓝牙打印机连接。', function () {
                        if (typeof fn === 'function') fn(false);
                    });
                }
            }
            if(format =="57"){
                try {
                    Components.bluetoothPrint._printSaleTicket57(head[0], pro,zhifu,huiyuan[0], Components.unload(load));
                } catch (err) {
                    Components.alert('打印小票' + xphm + '失败！请检查蓝牙打印机连接。', function () {
                        if (typeof fn === 'function') fn(false);
                    });
                }
            }
        } else {
            Components.alert('无法获取小票详细信息！' + (res.errorMessage || ''), function () {
                if (typeof fn === 'function') fn(false);
            });
        }
    });
};
// 打印其他小票
Components.bluetoothPrint.printOtherTicket = function (code, czhm,format, fn) {
    if (!code || !czhm) return;
    var load = Components.loading(false,'正在打印...');
    var vBiz1 = new FYBusiness('biz.print.biz.qry');
    var vOpr1 = vBiz1.addCreateService('svc.print.biz.qry', false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue('AS_CODE', code + '');
    var ip1 = new InvokeProc();
    ip1.addBusiness(vBiz1);
    ip1.invoke(function (res1) {
        if ((res1.iswholeSuccess === 'Y' || res1.isAllBussSuccess === 'Y')) {
            var biz = vOpr1.getOutputPermeterMapValue(res1, 'AS_BIZNAME') || '';
            var svc = vOpr1.getOutputPermeterMapValue(res1, 'AS_OPRNAME') || '';
            var type = vOpr1.getOutputPermeterMapValue(res1, 'AS_DJNAME') || '';
            var vBiz2 = new FYBusiness(biz);
            var vOpr2 = vBiz2.addCreateService(svc, false);
            var vOpr2Data = vOpr2.addCreateData();
            vOpr2Data.setValue('AS_CZHM', czhm + '');
            var ip2 = new InvokeProc();
            ip2.addBusiness(vBiz2);
            ip2.invoke(function (res2) {
                
                if ((res2.iswholeSuccess === 'Y' || res2.isAllBussSuccess === 'Y')) {
                    var rsm = vOpr2.getResult(res2, 'CA_RESULT').rows || [];
                    var rsl = vOpr2.getResult(res2, 'CA_RESULT').rows || [];
                    if (!rsm || !rsm.length || !rsl || !rsl.length) {
                        Components.alert('无法获取小票详细信息！', function () {
                            if (typeof fn === 'function') fn(false);
                        });
                        return;
                    }
                    rsm[0].djmc = type;
                    rsm[0].czry = localStorage.getItem('uid') || '';
                    rsm[0].czrymc = localStorage.getItem('uname') || '';
                    if(format =="57"){
                        try {
                            Components.bluetoothPrint._printOtherTicket57(rsm[0], rsl, Components.unload(load));
                        } catch (err) {
                            Components.alert('打印小票失败！请检查蓝牙打印机连接。', function () {
                                if (typeof fn === 'function') fn(false);
                            });
                        }
                    }
                    if(format =="80"){
                        try {
                            Components.bluetoothPrint._printOtherTicket80(rsm[0], rsl, Components.unload(load));
                        } catch (err) {
                            Components.alert('打印小票失败！请检查蓝牙打印机连接。', function () {
                                if (typeof fn === 'function') fn(false);
                            });
                        }
                    }
                    
                } else {
                    Components.alert('无法获取小票详细信息！' + (res2.errorMessage || ''), function () {
                        if (typeof fn === 'function') fn(false);
                    });
                }
            });
        } else {
            Components.unload(load);
            Components.alert('无法获取小票详细信息！' + (res1.errorMessage || ''), function () {
                if (typeof fn === 'function') fn(false);
            });
        }
    });
};





/*
* 2018-1-30
* 新增
* 重庆 项目 打印模版 100 mm宽度
* */
Components.bluetoothPrint._printMould100 = function (head,pro,total,zhifu,str) {
    var printFormatNum = wfy.empty(localStorage.printFormatNum) ? 1 : localStorage.printFormatNum;
    for (var m = 0; m < printFormatNum; m++) {
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.RESET);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.LINE_SPACING_DEFAULT);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.DOUBLE_HEIGHT_WIDTH)
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS(head.xtwlmc)));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD_CANCEL);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.NORMAL_HEIGHT_WIDTH);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_LEFT);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS_SPEC('小票号：' + (head.xtxphm || ''),'交易日期：'+(head.kcskrq || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS_SPEC('客户：' + (head.xtkhxm || '') ,'店员：'+(head.xsry || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.SEVEN_COLUMNS('货号', '货品名称', '颜色','尺码','数量','单价', '金额')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        for (var i = 0; i < pro.length; i++) {
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.SEVEN_COLUMNS(pro[i].xtwpdm ||'' , pro[i].xtwpmc || '', pro[i].xtysmc || '',pro[i].xtwpxh ||'',pro[i].kcczsl ||'',pro[i].kcxsdj ||'',pro[i].kcssje ||'')));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        }
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('合计：   销售 '+total.sl+' 件'+'     退货 '+total.tuihuo+' 件'+'    金额 '+total.je+' 元')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('支付方式：')));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        for (var y = 0; y < zhifu.length; y++) {
            uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.TWO_COLUMNS( '   '+zhifu[y].xsjssm || '',  Components.fix(zhifu[y].kcxsje || '', 2))));
            uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        }
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.PRINTDASHLINE()));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_LEFT);

        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.LINE_SPACING_DOUBLE = ['1B', '33', '40'].join('')); // 加倍行间距
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('备注：' + (head.kcczbz || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('户名账号：' + (head.khzhxx || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('联系方式：' + (head.xtlxsj || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(Components.bluetoothPrint._printFormat.ONE_COLUMNS('门店地址：' + (head.xtwldz || ''))));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.LINE_SPACING_DEFAULT = ['1B', '32'].join('')); // 默认行间距
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.ALIGN_CENTER);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.BOLD);
        // var str = wfy.empty(head.xtzzsh) ? '祝您购物愉快，谢谢光临！' : head.xtzzsh;
        // var len = str.length;
        // if(len > 25){
        //     var flo = parseInt(len/25)+1;
        //     for(var z = 0; z < flo; z++){
        //         if(z == 0){
        //             uexBluetoothSerial.writeHexString(GBK.toGBKHex(str.substr(0,25)));
        //             uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        //         }else {
        //             uexBluetoothSerial.writeHexString(GBK.toGBKHex(str.substr(z*25,(z+1)*25)));
        //             uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        //         }
        //     }
        // }else {
        //     uexBluetoothSerial.writeHexString(GBK.toGBKHex(str));
        //     uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        // }
        // uexBluetoothSerial.writeHexString(GBK.toGBKHex('此小票为最终凭证，以此小票退换货，如商品变价，按现价执行。'));
        // uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        //uexBluetoothSerial.writeHexString(GBK.toGBKHex('祝您购物愉快，谢谢光临！'));
        uexBluetoothSerial.writeHexString(GBK.toGBKHex(str));
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
        uexBluetoothSerial.writeHexString(Components.bluetoothPrint._printFormat.PRINTLINE);
    }
    if (typeof fn === 'function') fn(true);
}
//打印 100mm
Components.bluetoothPrint.printTicket100 = function (xphm,fn) {
    var format = '80';
    var vBiz = new FYBusiness('biz.sa.work.pos.print');
    var vOpr1 = vBiz.addCreateService('svc.sa.work.pos.print', false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue('AS_XPHM', xphm+'');
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (res) {
        if ((res.iswholeSuccess === 'Y' || res.isAllBussSuccess === 'Y')) {//CA_HEADER,CURSOR_4,CURSOR_5,CURSOR_6
            var head = vOpr1.getResult(res, 'CA_HEADER').rows || [];
            var pro = vOpr1.getResult(res, 'CURSOR_4').rows || [];//商品
            var zhifu = vOpr1.getResult(res, 'CURSOR_5').rows || [];//支付方式
            var huiyuan = vOpr1.getResult(res, 'CURSOR_6').rows || [];//会员
            var total_sl = 0;
            var total_je = 0;
            var total_tui = 0 ;
            for (var i = 0;i <pro.length;i++){
                if(pro[i].kcczsl > 0){
                    total_sl += pro[i].kcczsl;
                }else {
                    total_tui += (pro[i].kcczsl)*(-1);
                }

                total_je = Components.add(total_je,pro[i].kcssje);
            }
            var total =[{'sl':total_sl,'tuihuo':total_tui,'je':total_je}]
            var str = wfy.empty(head[0].xtzzsh) ? '' : head[0].xtzzsh;
            console.log(head[0])
            console.log(head)
            console.log(pro)
            console.log(zhifu)
            console.log(huiyuan)
            console.log(total[0])
            // var s = []
            // var str = wfy.empty(head[0].xtzzsh) ? '祝您购物愉快，谢谢光临！' : head[0].xtzzsh;
            // var len = str.length;
            // if(len > 25){
            //     var flo = parseInt(len/25)+1;
            //     console.error(flo)
            //     for(var z = 0; z < flo; z++){
            //         if(z == 0){
            //             s.push(str.substr(0,25))
            //         }else {
            //             s.push(str.substr(z*25,(z+1)*25))
            //         }
            //     }
            // }else {
            //     s.push(str)
            // }
            // console.error(s)
            if (!head || !head.length || !pro || !pro.length || !zhifu || !zhifu.length || !huiyuan || !huiyuan.length) {
                Components.alert('无法获取小票详细信息！', function () {
                    if (typeof fn === 'function') fn(false);
                });
                return;
            }
            if(format =="80"){
                // Components.bluetoothPrint._printMould100(head[0],pro,total[0],zhifu,str);
                try {
                    // alert(xphm)
                    // alert(JSON.stringify(head[0]))
                    // alert(JSON.stringify(pro))
                    // alert(JSON.stringify(total[0]))
                    // alert(JSON.stringify(zhifu))
                    // alert(JSON.stringify(str))
                    Components.bluetoothPrint._printMould100(head[0],pro,total[0],zhifu,str);
                } catch (err) {
                    //alert(err)
                    //未接订单中，打印失败 通过这里alert（err）提示 GBK is 未定义 好家伙
                    Components.alert('打印小票' + xphm + '失败！请检查蓝牙打印机连接。', function () {
                        if (typeof fn === 'function') fn(false);
                    });
                }
            }
            // if(format =="57"){
            //     try {
            //         Components.bluetoothPrint._printMould100(head[0], pro,zhifu,huiyuan[0], Components.unload(load));
            //     } catch (err) {
            //         Components.alert('打印小票' + xphm + '失败！请检查蓝牙打印机连接。', function () {
            //             if (typeof fn === 'function') fn(false);
            //         });
            //     }
            // }
        } else {
            Components.alert('无法获取小票详细信息！' + (res.errorMessage || ''), function () {
                if (typeof fn === 'function') fn(false);
            });
        }
    });
    // var head = {'xtxphm':'2015451587','timess':'2018-01-30','xtwldm':'陈泽','dianyuan':'杜','kcsl':'我是备注','zhanghu':'工行 622848**********1957','tel':'18754213498','khhykh':'山东青岛崂山区财富大厦1707'};
    // var pro = [{'a':'FD111111111','b':'男神瘦身大衣','c':'白色','d':'L','e':'1','f':'500','g':'500'},{'a':'FD111111111','b':'男神瘦身大衣','c':'白色','d':'L','e':'1','f':'500','g':'500'},
    //     {'a':'FD111111111','b':'男神瘦身大衣','c':'白色','d':'L','e':'1','f':'500','g':'500'}];
    // var dtl = {'a':1,'b':0,'c':5000};
    // var zhifu = [{'xsjssm':'微信','kcxsje':'500'},{'xsjssm':'支付宝','kcxsje':'500'},{'xsjssm':'现金','kcxsje':'500'},{'xsjssm':'满减券','kcxsje':'500'}];
    // try {
    //     Components.bluetoothPrint._printMould100(head,pro,dtl,zhifu);
    // } catch (err) {
    //     Components.alert('打印小票' + xphm + '失败！请检查蓝牙打印机连接。', function () {
    //         if (typeof fn === 'function') fn(false);
    //     });
    // }
}

// Components.bluetoothPrint.printTicket100('M180400105821')
//Components.bluetoothPrint.printTicket100('M180400116501')


























/**
 * 本地通知
 * @type {{}}
 */
Components.localNotification = {};
Components.localNotification.init = function (onMessage, onActive) {
    try {
        /**
         * 处于前台的通知监听
         * @param notificationID 通知的唯一标示符,取值范围[alarm_1,…,alarm_10].
         * @param message 通知内容,message为json字符串
         * @param extras 额外的数据信息,extras为json字符串
         */
        uexLocalNotification.onMessage = function (notificationID, message, extras) {
            if (typeof onMessage === 'function') onMessage(notificationID, message, extras);
        };
        /**
         * 处于后台的通知监听
         * @param notificationID 通知的唯一标示符,取值范围[alarm_1,…,alarm_10].
         * @param message 通知内容,message为json字符串
         * @param extras 额外的数据信息,extras为json字符串
         */
        uexLocalNotification.onActive = function (notificationID, message, extras) {
            if (typeof onActive === 'function') onActive(notificationID, message, extras);
        };
    } catch (err) {
    }
};
Components.localNotification.add = function (id, time, mode, message, buttonTitle, ringPath, cycle, notifyCount, extras) {
    try {
        /**
         * 注册通知
         * @param id 通知的唯一标示符,取值范围[alarm_1,…,alarm_10].
         * @param time 首次提醒的时间(距离1970年的毫秒数)
         * @param mode 黑屏时是否提示,0:不提示,1:提示.
         * @param message 通知内容
         * @param buttonTitle 按钮标题
         * @param ringPath 当前使用系统默认铃声,声音提示必须传"default"或者"system".
         * @param cycle 循环周期,值:[daily,weekly,monthly,yearly,once].
         * @param notifyCount 应用图标上显示的通知数
         * @param extras 额外的数据信息,extras为json字符串
         */
        uexLocalNotification.add(id, time, mode, message, buttonTitle, ringPath, cycle, notifyCount, extras);
    } catch (err) {
    }
};
Components.localNotification.remove = function (id) {
    try {
        /**
         * 移除指定唯一标示符的通知
         * @param id 通知的唯一标示符,取值范围[alarm_1,…,alarm_10].
         */
        uexLocalNotification.remove(id);
    } catch (err) {
    }
};
Components.localNotification.removeAll = function () {
    try {
        /**
         * 移除所有通知
         */
        uexLocalNotification.removeAll();
    } catch (err) {
    }
};