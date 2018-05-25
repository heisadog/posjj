// 查询推送信息线程
var flag = false, count = 1;
var WebURL, LoginName, DepartmentCode;

onmessage = function (event) {
    var data = event.data;
    if (data === 'stop') {
        flag = false;
    } else if (data === 'start') {
        flag = true;
        getMessage();
    } else {
        try {
            data = JSON.parse(data);
        } catch (err) {
            data = {};
        }
        WebURL = data.WebURL || '';
        LoginName = data.LoginName || '';
        DepartmentCode = data.DepartmentCode || '';
    }
};

function getMessage() {
    if (!flag) return;
    ajax({
        method: 'POST',
        url: 'http://' + WebURL + '/FY_APP_SVR/WFY_UNI_SERVICE.json?method=callProcService',
        data: '&data=' + JSON.stringify([{
            "businessno": "biz.dbsy.qry",
            "exptype": "",
            "body": {
                "svc.dbsy.qry": {
                    "TemplateType": "",
                    "TemplateKind": "",
                    "data": [{"AS_USERID": LoginName, "AS_WLDM": DepartmentCode, "AS_FUNC": "svc.dbsy.qry"}],
                    "init": false
                }
            }
        }]),
        success: function (data, status, xhr) {
            var msg = '';
            try {
                msg = data.procExecResults['svc.dbsy.qry'].outputMap.AS_LIST;
            } catch (err) {
            }
            if (msg) postMessage(msg);
        },
        error: function (err, status, xhr) {
            console.log(err);
            console.log(status);
            console.log(xhr);
        },
        complete: function (xhr, status) {
            setTimeout(function () {
                getMessage();
            }, 600000);
        }
    });
}

// Web Worker中无法访问DOM，只能重新封装AJAX
function ajax(option) {
    option = option || {};
    option.method = option.method || 'GET';
    option.url = option.url || '';
    option.async = option.async !== false;
    option.username = option.username || '';
    option.password = option.password || '';
    option.data = option.data || null;
    option.contentType = option.contentType || 'application/x-www-form-urlencoded';
    option.withCredentials = option.withCredentials === true;
    option.before = typeof option.before === 'function' ? option.before : new Function();
    option.success = typeof option.success === 'function' ? option.success : new Function();
    option.error = typeof option.error === 'function' ? option.error : new Function();
    option.complete = typeof option.complete === 'function' ? option.complete : new Function();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = '';
                try {
                    response = JSON.parse(xhr.responseText);
                } catch (err) {
                    option.error(err.message, xhr.status, xhr);
                }
                if (response) {
                    option.success(response, xhr.status, xhr);
                }
            } else {
                option.error(xhr.statusText, xhr.status, xhr);
            }
            option.complete(xhr, xhr.status);
        }
    };
    xhr.ontimeout = function () {
        option.error(xhr.statusText, xhr.status, xhr);
        option.complete(xhr, xhr.status);
    };
    if (option.username && option.password) {
        xhr.open(option.method, option.url, option.async, option.username, option.password);
    } else {
        xhr.open(option.method, option.url, option.async);
    }
    xhr.withCredentials = option.withCredentials;
    xhr.setRequestHeader('Content-Type', option.contentType);
    option.before(xhr);
    xhr.send(option.data);
    return xhr;
}