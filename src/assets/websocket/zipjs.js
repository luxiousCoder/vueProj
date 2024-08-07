import zip from './zip.js';

const utf8to16 = function (str) {
  let out, i, len, c;
  let char2, char3;
  out = '';
  len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        // 110x xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx 10xx xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0));
        break;
    }
  }
  return out;
};
const Zipjs = {
  /**
   * 回调结果
   *
   * @params { Number } 0：成功，1：失败
   * @params { String } 提示信息
   * @params { Object|String } 数据
   * @params { Function } 回调可选
   *
   */
  resultCallback(status, msg, data, callback) {
    if (status === 0) {
      console.error(msg);
    }

    if (callback) {
      callback({
        status: status,
        msg: msg || '',
        data: data
      });
    }
  },

  /**
   * 还原base64到字符串
   *
   * @params { String } 完整的base64码含头base:application/zip;base64,data
   * @params { Boolean } true 转换为字符串，false 尝试转换为 json，默认 false
   *
   */
  base64ToJSON(str, isJSON) {
    let base64, result;

    if (str === '') {
      return isJSON ? {} : '';
    }

    /*获取base64码*/
    base64 = str.split(',')[1];

    /*原生方法atob还原base64*/
    result = utf8to16(atob(base64));

    if (isJSON) {
      try {
        if (Object.prototype.toString.call(result) === '[object String]') {
          result = JSON.parse(result);
        }
      } catch (e) {
        console.error('data is not JSONStr.');
      }
    }

    return result;
  },

  /*解压主函数*/
  unzipDataURI(dataURI, callback, isJSON) {
    // console.time && console.time('解压用时');
    zip.createReader(
      new zip.Data64URIReader(dataURI),
      (zipReader) => {
        zipReader.getEntries((entries) => {
          /*输出日志*/
          if (window.ISDEV && entries[0].uncompressedSize > 0) {
            console.log('%c原始数据大小: %s', 'color:#FF6600', entries[0].uncompressedSize / 1024 / 1024 + 'Mb');
            console.log('%c压缩后数据大小: %s', 'color:#0000FF', entries[0].compressedSize / 1024 / 1024 + 'Mb');
            console.log(
              '%c压缩比: %s',
              'color:#336644',
              ((entries[0].uncompressedSize - entries[0].compressedSize) / entries[0].uncompressedSize).toFixed(4) *
                100 +
                '%'
            );
            console.timeEnd && console.timeEnd('解压用时');
            console.log('---------------------');
          }

          /*获取第一个文本文件*/
          entries[0].getData(new zip.Data64URIWriter('text/plain'), (data) => {
            zipReader.close();

            /*回调成功结果*/
            this.resultCallback(1, '', this.base64ToJSON(data, isJSON), callback);
          });
        });
      },
      (message) => {
        this.resultCallback(1, message, {}, callback);
      }
    );
  },

  /**
   * 解压缩入口
   *
   * @params { String } base64的zip
   * @params { Function } 结果回调为JSON{ status:1|0, msg:'', data:{} }
   */
  unzip(base64, callback, isJSON) {
    let dataURI = '';

    /*默认配置*/
    zip.useWebWorkers = true;
    zip.workerScriptsPath = '../../js/lib/zip.js/';

    /*判断base64是否存在*/
    if (!base64) {
      if (callback) {
        callback({
          status: 0,
          msg: 'base64 is empty.',
          data: {}
        });
      }
    }

    /* 拼接完整的zip base64码 */
    /* base64 -d foo.txt > foo.zip */
    dataURI = 'data:application/zip;base64,' + base64;

    /* 下载文件包 */
    /* location.href = dataURI; */

    /*解压开始*/
    this.unzipDataURI(dataURI, callback, isJSON);
  }
};
export default Zipjs;
