export const getOption = (state: number, type: string) => {
  const url = 'ws://39.171.245.106:9081/websocket'
  const task_id = '187430'
  let data
  switch (type) {
    case 'coordinate':
      data = {
        winId: 'seelightWindow4_1',
        task_id: task_id,
        drawType: 1,
        version: 1,
        missionType: 0,
        username: 'iscas_pengjun',
        element_name: '多通道大气传输',
        element_id: '032',
        port_name: '上行波束',
        element_type: 'DifPropg',
        model_type: 'SceneMod',
        port_id: 1,
        light_id: 0,
        content: 'target',
        //content: 'Mod', //装备到靶光斑能量分布
        layer: 0,
        functionType: '2d',
        state: state
      }
      break
    case 'img':
      data = {
        winId: 'seelightWindow4_1',
        task_id: task_id,
        drawType: 1,
        version: 1,
        missionType: 0,
        username: 'iscas_pengjun',
        element_name: '多通道大气传输',
        element_id: '032',
        port_name: '上行波束',
        element_type: 'DifPropg',
        model_type: 'SceneMod',
        port_id: 1,
        light_id: 0,
        // content: 'target',
        content: 'Mod', //装备到靶光斑能量分布
        layer: 0,
        functionType: '2d',
        state: state
      }
      break
    default:
      break
  }

  return {
    url: url,
    // 获取坐标信息
    sendMessage: {
      username: 'iscas_pengjun',
      taskid: task_id,
      flag: '307',
      data: JSON.stringify(data)
    }
  }
}
