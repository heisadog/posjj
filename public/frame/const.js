/**
 * Created by Administrator on 2016-06-15.
 */
// http://192.168.1.140:8080/FY_APP_SVR 宋哥地址
var _wfy_host = "";
var _wfy_url = 'http://202.98.38.50:18088';//http://202.98.38.52:18006 xiaoju.theimixplus.com 202.98.38.50:18088
//var _wfy_uni_url = localStorage.url;//中间层服务地'http://wfyerpqd.6655.la:63343/FY_APP_SVR/WFY_UNI_SERVICE.json'
var _wfy_uni_url =  _wfy_url+"/FY_APP_SVR/WFY_UNI_SERVICE.json";
var _wfy_order_svr = _wfy_url+"/FY_APP_SVR/FY_POS_SAVE.json";//单据保存服务
//var _wfy_uni_url = localStorage.url;//中间层服务地'http://27.219.59.162:63343/FY_APP_SVR/WFY_UNI_SERVICE.json'
var _wfy_uni_url =  _wfy_url+"/FY_APP_SVR/WFY_UNI_SERVICE.json";
var _wfy_order_svr = _wfy_url+"/FY_APP_SVR/FY_POS_SAVE.json";
var _wfy_login_url = _wfy_url+"/FY_APP_SVR/loginCheckFordrp.json";//登录获取门店往来等
var _wfy_login_check_url = _wfy_url+"/FY_APP_SVR/reg.json";//登录验证
var _wfy_uni_proc_url = _wfy_uni_url + "?method=callProcService"; // 中间供调用过程的服务
var _wfy_uni_treegrid_url = _wfy_uni_url + "?method=genTreegridService"; // 中间供获取TreeGrid数据对象的服
var _wfy_uni_export_url = _wfy_uni_url + "?method=expXlsService"; // 中间供获取导出Excel文件的服
var _wfy_mobile_api_url = "";
var _wfy_openid_url = _wfy_uni_url + "";
var _wfy_auth20_url = "" ;
var _wfy_proc_default_param_user = "AS_USER_ID"; // WFY 调用过程时的 默认参数：AS_USER_ID
var _wfy_proc_default_param_dept = "AS_DEPT_ID"; // WFY 调用过程时的 默认参数：AS_DEPT_ID
var _wfy_proc_default_param_func = "AS_FUNC_NAME"; // WFY 调用过程时的 默认参数：AS_FUNC_NAME
var _wfy_pic_ip = _wfy_url+"/picture/commodity/"; //图片地址
var _wfy_prod_pic_url = "";
var _wfy_bill_list_url= _wfy_url+"/CQ_SERVICE/api/getShopSettlement";//获取门店结算单信息
var _wfy_bill_dtl_url= _wfy_url+"/CQ_SERVICE/api/getReceiptMemoInfo";//获取结算单收款数据
var _wfy_passenger_flow_url= _wfy_url+"/CQ_SERVICE/api/getShopKeliuNum";//获取首页客流量
var _wfy_encrypt_url= _wfy_url+"/FY_APP_SVR/encryptSvr.json";//密码加密服务
var _wfy_decrypt_url= _wfy_url+"/FY_APP_SVR/decryptSvr.json";//密码解密服务

var _wfy_ServiceTracking_url = _wfy_url+'/CQ_SERVICE/api/';//快递信息
// 登录用户
var LoginName = localStorage.uid || '';
var DepartmentCode = localStorage.wldm || '';