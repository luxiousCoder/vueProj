import zipjs from '../assets/websocket/zipjs.js'
import { getOption } from '@/assets/hooks/wsOptions'

/**
 * 将base64格式数据解压
 * @param data base64信息
 * @param callback 回调方法，参数为解压结果
 */
const unzipData = (data: string, callback: Function) => {
  zipjs.unzip(data, (res: any) => {
    const resData = JSON.parse(res?.data)
    callback(resData)
  })
}

export class webSocketInstance extends WebSocket {
  constructor(options: any, onmessage: string, onopen: Function) {
    super(options.url)
    this.onopen = () => {
      onopen()
    }

    this.onmessage = function (evt) {
      const data = JSON.parse(evt?.data)
      const flag = data?.flag
      const dataObj = ''
      switch (flag) {
        case '400':
          console.log('模型执行中')
          break
        case '401':
          break
        case '402':
          console.log('模型执行开启成功')
          switch (data?.data) {
            case '0':
              console.log('未执行')
              break
            case '1':
              console.log('执行')
              break
            case '2':
              console.log('暂停')
              break
            case '3':
              console.log('取消')
              break
            case '4':
              console.log('结束')
              break
            case '5':
              console.log('执行出错')
              break
          }
          this.close()
          break
        case '403':
          unzipData(data?.data, (res: any) => {
            const dataObj = {
              data: res.data
            }
            window.dispatchEvent(
              new CustomEvent(onmessage, {
                detail: dataObj
              })
            )
          })
          break
        case '404':
          break
        case '405':
          break
        case '406':
          break
        case '407':
          break
        default:
          break
      }
    }

    this.onclose = function (evt) {
      console.log('WebSocketClosed!')
    }

    this.onerror = function (evt) {
      console.log('WebSocketError!')
      console.error(evt)
    }
  }
}
