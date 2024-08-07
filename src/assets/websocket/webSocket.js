/**
 * websocket接口相关的函数
 */
// import mainApi from 'dev/main-laser/mainApi'
import zipjs from './zipjs.js';
// sendMessage: { username: 'iscas_liangmingming', taskid: '191111', flag: '300' }

const logic = {
  _userName_: 'iscas_liangmingming',
  _taskId_: '191111',
  _currentStep_: '',
  totalStep: '',
  _currentState_: '',
  _showConfig_: '',
  initAnalyse: '',
  InitOneD_Data: '',
  DrawInitData: ''
};
// 指令执行的回复码
const websocket_recv_step_reply = '400'; //模型执行第几步
const websocket_recv_erro_reply = '401'; //模型错误状态反馈
const websocket_recv_status_reply = '402'; //状态标示（0，未执行；1，执行中；2，已停止；3，已取消；4，已完成）
const websocket_recv_result_reply = '403'; //结果反馈
const websocket_recv_realtime_reply = '404'; //实时结果反馈
const request_lightcount_reply = '405'; //请求波束总数返回
const websocket_real_result_reply_test = '406'; //实时结果反馈(调试用)
const websocketInterface = {
  // 发送操作指令
  send_construnction: '300',
  send_recover: '306', //恢复执行
  send_Subscribe: '308', //订阅 当前图像显示框的数据
  send_suspend: '303', //取消订阅
  send_cancel: '304', //取消当前
  send_firststep: '301', //执行第一步，未执行时才能发
  send_step: '302', //执行下一步
  request_lightcount: '310', //请求当前图像显示连接的数据输出端口有几条光线
  webSocketUrl: '', //TODO httpInterface.getWebSocket
  _webSocketConnected_: false,
  _webSocketObj_: null,
  /**
   * 连接webSocket
   * @param sucCb -必选（Function） 退出成功回调
   * @param errCb -可选（Function） 退出失败回调
   */
  startWebSocketServer: function (url = 'ws://39.171.245.106:9091/websocket') {
    // debugger;
    url = 'ws://39.171.245.106:9091/websocket'; //

    if (url == null) {
      console.error('_webSocketUrl_地址非法');
      return;
    }
    // 创建WebSocket实例，下面那个MozWebSocket是Firefox的实现
    if ('WebSocket' in window) {
      this._webSocketObj_ = new WebSocket(url);
    } else if ('MozWebSocket' in window) {
      this._webSocketObj_ = new MozWebSocket(url);
    } else {
      console.error('当前浏览器不支持webSocket');
      return;
    }
    // WebSocket握手完成，连接成功的回调
    // 有个疑问，按理说new WebSocket的时候就会开始连接了，如果在设置onopen以前连接成功，是否还会触发这个回调
    this._webSocketObj_.onopen = websocketInterface.websocketOpen;
    // 收到服务器发送的文本消息, event.data表示文本内容
    this._webSocketObj_.onmessage = websocketInterface.manageRecvMsg;
    // 关闭WebSocket的回调
    this._webSocketObj_.onclose = websocketInterface.websocketClose;
    // 关闭WebSocket的回调
    this._webSocketObj_.onerror = websocketInterface.websocketError;
  },
  websocketOpen: function () {
    console.log('🚀 ~ websocketOpen');
    websocketInterface._webSocketConnected_ = true;
  },
  websocketClose: function () {
    console.log('🚀 ~ websocketClose');
    websocketInterface._webSocketConnected_ = false;
  },
  websocketError: function () {
    console.log('🚀 ~ websocketError');
    websocketInterface._webSocketConnected_ = false;
  },
  /**
   * WebSocket发送无参数信息
   * @param flag -必选（字符串） 请求标识
   * @param sucCb -必选（Function） 退出成功回调
   * @param errCb -可选（Function） 退出失败回调
   */
  sendFlagMessage: function (flag, sucCb, errCb) {
    console.log('🚀 ~ sendFlagMessage', flag);
    console.log(websocketInterface._webSocketConnected_);
    if (websocketInterface._webSocketConnected_ == false) {
      errCb();
      return;
    }
    const param = { username: logic._userName_, taskid: logic._taskId_, flag: flag };
    const paramStr = JSON.stringify(param);
    if (websocketInterface._webSocketObj_ != null) {
      // 通过WebSocket向服务器发送一个文本信息
      websocketInterface._webSocketObj_.send(paramStr);
      sucCb();
    } else {
      errCb();
    }
  },
  /**
   * 连接webSocket
   * @param sucCb -必选（Function） 退出成功回调
   * @param errCb -可选（Function） 退出失败回调
   */
  manageRecvMsg: function (event) {
    console.log('🚀 ~ manageRecvMsg');
    if (event.data == 'open') {
      return 0;
    }
    if (event.data == '') {
      return 0;
    }
    //收到事件信息(有绑定预案，预案的唯一信息)
    const dataObj = JSON.parse(event.data);
    switch (dataObj.flag) {
      /*模型执行第几步*/
      case websocket_recv_step_reply: //400
        logic._currentStep_ = parseInt(dataObj.data, 10);
        break;
      /* 计算的中间状态,测试版调试用 */
      case websocket_real_result_reply_test: // 406
        break;
      /*模型错误状态反馈*/
      case websocket_recv_erro_reply: //401
        let errorMsg = dataObj.data;
        /*解析模式报错信息，并处理*/
        try {
          const eInfo = JSON.parse(dataObj.data);
          errorMsg = eInfo.errorMsg ? eInfo.errorMsg : '模型运行出错~';
        } catch (e) {
          console.error('后台模型报错数据不规范~', dataObj.data);
        }
        break;
      /*状态标示（0，执行；1，暂停；3，取消；4，结束）*/
      case websocket_recv_status_reply: // 402
        //消息窗口上提示模型状态
        const taskStatus = dataObj.data;
        logic._currentState_ = dataObj.data;
        switch (taskStatus) {
          case '4':
            break;
          default:
        }
        break;
      /*结果反馈, 实时结果反馈，需要解压缩*/
      case websocket_recv_result_reply: // 403
      case websocket_recv_realtime_reply: // 404
        /*兼容旧版，尝试解包，失败后直接调用*/
        try {
          /*尝试处理*/
          const tmp = atob(dataObj.data);
          /*解压数据*/
          zipjs(dataObj.data, function (res) {
            if (res.status == 1) {
              /*画图处理*/
              websocketInterface.drawTheResult(res.data);
            }
          });
        } catch (e) {
          /*直接原数据画图*/
          websocketInterface.drawTheResult(dataObj.data);
        }
        break;
      /*请求波束总数返回*/
      case request_lightcount_reply: //405
        break;
      /*非法数据*/
      default:
        break;
    }
  },
  /**
   * 根据websocket返回结果，绘图
   * @param data -返回结果
   */
  //element_id    //port_id    //state    //content    //layer    //function    //data(显示相关数据)
  drawTheResult: function (data) {
    let t = this;
    t = websocketInterface;
    const resultObj = JSON.parse(data);
    const drawFlag = resultObj.winId.split('_')[1];
    resultObj.winId = resultObj.winId.split('_')[0];
    const theShow = logic._showConfig_[resultObj.winId];
    if (theShow != null) {
      //界面存在
      if (theShow.show == 1) {
        //更新数据
        const index = resultObj.state + '' + theShow.light_id + theShow.content + theShow.layer + theShow.functionType;
        if (theShow.data[index] == null) theShow.data[index] = {}; //初始化收到的结果
        const options = theShow.data[index];
        //收到数据是否为空
        if (!resultObj.data) {
          options.dataState = 2; //数据状态，0下载中，1完成，2数据无法展示
          options.dataMsg = '没有数据';
          if (resultObj.errorMsg) return;
        }
        if (resultObj.data == '') {
          options.dataState = 2; //数据状态，0下载中，1完成，2数据无法展示
          options.dataMsg = '没有数据';
          return;
        }
        if (theShow.element_type == 'Bqc' || theShow.model_type == 'bpf') {
          const defaults = {
            maxData: 100, //数据最大值
            minData: 0, //数据最小值
            DATA_ARRAY: null, //数据数组
            picLeft: 20, //图片靠左距离（包括坐标轴）
            axisWidth: 15, //坐标轴宽度
            toolbarHeight: 15, //工具栏高度
            curveHeight: 35, //曲线宽度
            titleHeight: 15, //标题高度
            maxAxesTextWidth: 10, //坐标轴文字标记最大值
            nLevel: 64, //颜色级别
            clickX: -1, //选中的点在数据矩阵的X坐标
            clickY: -1, //选中的点在数据矩阵的Y坐标
            canvasId: '', //canvas的ID
            AXES_STYLE: '#000000', //坐标轴样式
            AXES_LINE_WIDTH: 0.5, //坐标轴线宽度
            VERTICAL_TICK_SPACING: 10,
            HORIZONTAL_TIKE_SPACING: 10,
            TICK_WIDTH: 6,
            fColorWidth: 20, //颜色条宽度
            fColor_pic: 30, //颜色条距离图片的距离
            title: '', //标题
            fTotalWidth: 800, //画布宽度
            fTotalHeight: 800, //画布高度
            freedomChoice: false, //是否为自由选择
            redraw: false, //是否为重绘
            topTitle: '', //窗口的标题
            freedomCanvas: null, //自由选择时候用到的几个参数
            freedomContext: null, //自由选择时候用到的几个参数
            freedomDATA: null, //自由选择时候用到的几个参数
            freedomDATA_SIZE: null, //自由选择时候用到的几个参数
            freedomClick: null, //自由选择时候单击函数
            picYGraduationMax: 0.5, //Y轴最大刻度
            picYGraduationMin: -0.5, //Y轴最小刻度
            picXGraduationMax: 0.5, //X轴最大刻度
            picXGraduationMin: -0.5, //X轴最小刻度
            picYGraduationSum: 8, //Y轴大刻度数目
            picXGraduationSum: 8, //X轴大刻度数目
            picYGraduationSmallSum: 10, //Y轴大刻度中的小刻度数
            picXGraduationSmallSum: 10, //X轴大刻度中的小刻度数
            picGraduationBigLength: 6, //大刻度长度
            picGraduationSmallLength: 3, //大刻度长度
            yInfo: '', //Y轴信息
            xInfo: '', //X轴信息
            yInfoMaxSize: 15, //Y轴信息最大值
            colorbarTitle: 'nm', //颜色条信息
            colorbarDataTitle: '', //颜色条数据倍数
            ifDrawFocus: false, //绘制重心
            dataSize: null,
            picAreaWidth: 300 - 30,
            picAreaHeight: 300 - 30,
            scaleSize: null
          };
        }
        options.content = resultObj.content;
        let dataCanDraw = true;
        if (theShow.model_type == 'analyse') {
          //对象
          const theObj = JSON.parse(resultObj.data);
          logic.initAnalyse(options);
          dataCanDraw = false;
        } else if (
          theShow.model_type == 'com' || //一维数据
          theShow.model_type == 'm2' ||
          theShow.model_type == 'stf'
        ) {
          logic.InitOneD_Data(
            theShow,
            options,
            resultObj.data,
            resultObj.addition,
            theShow.layer,
            theShow.model_type,
            theShow.element_type
          );
        } else {
          //二、三维矩阵
          //数据初步解析，得到数据及长度
          const dataArray = resultObj.data.split('[]');
          const DATA = dataArray[0];
          let DATA_SIZE = '';
          if (dataArray.length > 1) DATA_SIZE = dataArray[1];
          //收到数据是否为空
          if (DATA == '') {
            options.dataState = 2; //数据状态，0下载中，1完成，2数据无法展示
            options.dataMsg = '没有数据';
            dataCanDraw = false;
          }
          if (dataCanDraw == true) {
          }
          theShow.totallight = resultObj.totallight;
          logic.DrawInitData(
            theShow,
            options,
            DATA,
            DATA_SIZE,
            resultObj.addition,
            theShow.layer,
            theShow.model_type,
            theShow.element_type
          );
        }
        //收到的数据，存储起来
        theShow.data[index] = options; //resultData;
        if (resultObj.content) theShow.content = resultObj.content;
        if (resultObj.functionType) theShow.functionType = resultObj.functionType;
        theShow.state = parseInt(resultObj.state);
        if (resultObj.layer) theShow.layer = parseInt(resultObj.layer);
        if (resultObj.light_id) theShow.light_id = parseInt(resultObj.light_id);
        theShow.options = options;
        if (dataCanDraw == false) {
          return;
        }
        if (theShow.drawPic && drawFlag != '0') {
          //drawFlag==0为回放
          theShow.drawPic(theShow, options, true, theShow.initLight, theShow.showType); //DATA,DATA_SIZE
        }
        if (resultObj.addition) {
          const isMultiWvl = JSON.parse(resultObj.addition).isMultiWvl;
          theShow.isMultiWvl = isMultiWvl;
        }
      }
    }
  },
  /**
   * WebSocket发送有参数信息，类型信息已经在参数里
   * @param flag -必选（字符串） 请求标识
   * @param data -必选（Object） 请求数据
   * @param sucCb -必选（Function） 退出成功回调
   * @param errCb -可选（Function） 退出失败回调
   */
  sendDataMessage: function (flag, data, sucCb, errCb) {
    console.log('🚀 ~ sendDataMessage');
    if (websocketInterface._webSocketConnected_ == false) {
      return;
    }
    const param = { username: logic._userName_, taskid: logic._taskId_, flag: flag, data: JSON.stringify(data) };
    const paramStr = JSON.stringify(param);
    if (websocketInterface._webSocketObj_ != null) {
      // 通过WebSocket想向服务器发送一个文本信息
      websocketInterface._webSocketObj_.send(paramStr);
    } else {
      console.error('websocket出错');
    }
  },
  /**
   * WebSocket请求指定结果数据
   * @param flag -必选（字符串） 请求标识
   * @param theShow -必选（Object） 请求结果选项
   * @param step -必选（Object） 第几步结果
   * @param drawFlag -必选（字符串） 收到数据后是否直接显示，还是回放，1直接显示，0回放，2请求光束个数
   * @param task_id -必选（字符串） 任务id
   * @param username -必选（字符串） 任务所属用户名（登录名）
   * @param version -必选（字符串） 任务版本号
   * @param sucCb -必选（Function） 退出成功回调
   * @param errCb -可选（Function） 退出失败回调
   */
  requestTheData: function (flag, theShow, step, drawFlag, task_id, username, version, sucCb, errCb) {
    console.log('🚀 ~ requestTheData');
    const t = websocketInterface;
    const reqData = {};
    reqData.winId = theShow.winId + '_' + drawFlag;
    reqData.drawType = 1;
    reqData.task_id = task_id;
    reqData.version = version;
    reqData.missionType = 0; //wcf-2017.11.07--add--任务类型--激光
    reqData.username = username;
    reqData.element_name = theShow.element_name;
    reqData.element_id = theShow.element_id;
    reqData.element_id += '';
    while (reqData.element_id.length < 3) {
      reqData.element_id = '0' + reqData.element_id;
    }
    reqData.port_name = theShow.port_name;
    reqData.element_type = theShow.element_type;
    reqData.model_type = theShow.model_type;
    if (reqData.model_type == 'ray' && version == 1) {
      //ray与wfp数据一致
      reqData.model_type = 'wfp';
      reqData.port_name = '波束';
    }
    if (reqData.model_type == 'm2') reqData.model_type = 'm2appraise';
    reqData.port_id = theShow.port_id;
    reqData.light_id = theShow.light_id;
    reqData.state = step; //theShow.state;//第几步由服务器返回
    reqData.content = theShow.content;
    reqData.layer = theShow.layer;
    reqData.functionType = theShow.functionType;
    if (drawFlag == '2') {
    } else {
    }
    websocketInterface.sendDataMessage(
      flag,
      reqData,
      function () {
        // console.log("成功");
      },
      function () {
        // console.log("错误");
      }
    );
  }
};
export default websocketInterface;
