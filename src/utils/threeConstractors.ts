import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref } from 'vue'
import { GUI } from 'dat.gui'
import { addEmitHelper } from 'typescript'
import helvetiker_regulartypeface from 'three/examples/fonts/helvetiker_regular.typeface.json'
export class threeScene {
  canvas: HTMLElement | null
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  entitiesCanBePicked: any = []
  pickedText: any = ''
  auxiliaryPlanes: any = null
  plotType: any = null
  gui: any = null
  constructor(canvasId: string) {
    this.pickedText = ''
    this.canvas = document.getElementById(canvasId)
    // 创建3D场景对象Scene
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.clientWidth / this.canvas.clientHeight,
      1,
      100000000000000
    )
    this.camera.position.set(0, 0, 600)
    // const width = 1000
    // const height = 1000
    // this.camera = new THREE.OrthographicCamera(
    //   width / -2,
    //   width / 2,
    //   height / 2,
    //   height / -2,
    //   1,
    //   1000
    // )
    // this.camera.position.set(0, 0, 20)
    // const cameraHelper = new THREE.CameraHelper(this.camera)
    // this.scene.add(cameraHelper)

    // // 定义threejs输出画布的尺寸(单位:像素px)
    // const width = this.canvas.clientWidth
    // const height = this.canvas.clientHeight
    // const aspect = width / height
    // // 定义相机视景体边界
    // const frustumSize = 80
    // const halfFrustumWidth = (frustumSize * aspect) / 2
    // const halfFrustumHeight = frustumSize / 2
    // // 创建场景、相机和渲染器
    // this.camera = new THREE.OrthographicCamera(
    //   -halfFrustumWidth,
    //   halfFrustumWidth, // left, right
    //   halfFrustumHeight,
    //   -halfFrustumHeight, // top, bottom
    //   0.1,
    //   1000 // near, far
    // )
    // this.camera.position.set(0, 0, 10)
    // this.camera.lookAt(0, 0, 10)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas, //渲染结果输出画布：canvas
      antialias: true,
      allowTaint: true,
      preserveDrawingBuffer: true,
      alpha: true // 是否可以设置背景色透明
    })
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight) //设置three.js渲染区域的尺寸(像素px)
    this.renderer.setClearColor(0x155155, 0.1)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enabled = true
    this.camera.lookAt(10, 10, 10)

    const axesHelper = new THREE.AxesHelper(5)
    this.scene.add(axesHelper)
    this.animate()
  }

  generateAuxiliaryPlanes = () => {
    const result = new THREE.Vector3()
    const ocPos = this.camera.position
    const c = new THREE.Vector3()
    this.camera.getWorldDirection(c)
    const dotRes = -(c.dot(ocPos) / c.dot(c))
    result.copy(ocPos.clone().add(c.clone().multiplyScalar(dotRes)))
    // 创建平面几何体
    const geometry = new THREE.PlaneGeometry(50, 50) // 平面的宽和高都是 5
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide }) // 创建一个绿色的材质，双面显示
    let plane = new THREE.Mesh(geometry, material) // 创建平面网格
    this.scene.add(plane) // 将平面添加到场景中
    plane.position.copy(result)
    plane.lookAt(this.camera.position)
    const plane2 = new THREE.Plane(result.sub(ocPos).normalize(), 0)
    var helper = new THREE.PlaneHelper(plane2, 500, 0xffff00)
    this.scene.add(helper)
    this.entitiesCanBePicked.push(plane2)
    return plane
  }

  /**
   * three动画
   */
  animate = () => {
    requestAnimationFrame(this.animate)
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * 窗口大小改变时重置相机与渲染器
   */
  resizeChange = () => {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight
    const aspectRatio = width / height
    const frustumSize = 47
    const halfFrustumWidth = (frustumSize * aspectRatio) / 2
    const halfFrustumHeight = frustumSize / 2
    // 更新相机的左、右、上、下平面
    this.camera.left = -halfFrustumWidth
    this.camera.right = halfFrustumWidth
    this.camera.top = halfFrustumHeight
    this.camera.bottom = -halfFrustumHeight
    this.renderer.setSize(width, height)
  }

  addSphere = (radius: any) => {
    // 创建球体的几何体 (参数分别是半径, 水平分段数, 垂直分段数)
    const geometry = new THREE.SphereGeometry(radius, 32, 32)

    // 创建基本材质，设置颜色为红色
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

    // 将几何体和材质组合成一个网格
    const sphere = new THREE.Mesh(geometry, material)

    // 将球体添加到场景中
    this.scene.add(sphere)
    return sphere
  }

  /**
   * 添加三角形
   * @param vertexPos
   * @returns triangle 三角形组
   */
  addTriangle = (vertexPos: any) => {
    // 添加三角形
    const triangle = new THREE.Group()
    triangle.name = 'triangleGroup'
    // 定义顶点以及颜色数据
    const vertices = [-0.01, vertexPos, 0, -0.01, -vertexPos, 0, 120, 0, 0]
    // 创建 BufferGeometry
    const triangleGeometry = new THREE.BufferGeometry()
    triangleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    )
    const triangleMeshMaterial = new THREE.MeshBasicMaterial({ color: 0x8300b5 })
    const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMeshMaterial)
    triangleMesh.name = 'triangleMesh'
    triangle.add(triangleMesh)
    //添加描边线
    const lineMaterial1 = new THREE.LineBasicMaterial({
      color: 0x8300b5
    })
    // 圆锥的轮廓线
    const triangleGeometryLine = new THREE.EdgesGeometry(triangleGeometry)
    const coneLine = new THREE.LineSegments(triangleGeometryLine, lineMaterial1)
    coneLine.name = 'coneLine'
    triangle.add(coneLine)
    this.scene.add(triangle)
    return triangle
  }

  /**
   * 添加简单长方体及边框
   * @returns 长方体对象
   */
  addBox = () => {
    const geometry = new THREE.BoxGeometry(10, 10, 10, 20, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const cube = new THREE.Mesh(geometry, material)
    this.scene.add(cube)
    const edges = new THREE.EdgesGeometry(geometry)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })
    const lineSegments = new THREE.LineSegments(edges, lineMaterial)
    this.scene.add(lineSegments)
    return cube
    // this.entitiesCanBePicked.push(cube)
  }

  /**
   * 添加点
   * @param vertices 点的坐标向量组成的数组 eg.[Vector3,Vector3 ...]
   * @returns 点对象THREE.Points
   */
  addPoint = (vertices: any) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices)
    // geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

    const material = new THREE.PointsMaterial({ color: 0x888888 })

    const points = new THREE.Points(geometry, material)

    this.scene.add(points)

    return points
  }

  /**
   * 更新三角形
   * @param length 三角形底边长度的一半
   */
  updateTriangle = (length: any) => {
    const newVertices = [-0.01, length, 0, -0.01, -length, 0, 120, 0, 0]
    const triangleGroup = this.scene.getObjectByName('triangleGroup')
    const triangleMesh = triangleGroup.getObjectByName('triangleMesh')
    const coneLine = triangleGroup.getObjectByName('coneLine')
    triangleMesh.geometry.dispose()
    coneLine.geometry.dispose()
    triangleMesh.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(newVertices), 3)
    )
    coneLine.geometry = new THREE.EdgesGeometry(triangleMesh.geometry)
    console.log('updatettt')
  }

  /**
   * 添加椭圆
   * @param xRadius 椭圆短半轴长度
   * @param yRadius 椭圆长半轴长度
   */
  addEllipseCurve = (xRadius: any, yRadius: any) => {
    const curveGroup = new THREE.Group()
    curveGroup.name = 'curveGroup'
    const curve = new THREE.EllipseCurve(
      0,
      0, // ax, aY
      xRadius,
      yRadius, // xRadius, yRadius
      0,
      0, // aStartAngle, aEndAngle
      true, // aClockwise
      0 // aRotation
    )
    // 将 EllipseCurve 转换为 Shape
    const path = new THREE.Path(curve.getPoints(64))
    const shape = new THREE.Shape(path.getPoints())
    // 创建 ShapeGeometry 并填充颜色
    const EllipseCurveShape = new THREE.ShapeGeometry(shape)
    const EllipseCurvematerial = new THREE.MeshBasicMaterial({
      color: 0xffdead,
      side: THREE.DoubleSide
    })
    const EllipseCurveLine = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64))
    const EllipseCurveLinematerial = new THREE.LineBasicMaterial({ color: 0x0000ff })

    const ellipse = new THREE.Mesh(EllipseCurveShape, EllipseCurvematerial)
    ellipse.name = 'ellipse'
    const ellipseLine = new THREE.Line(EllipseCurveLine, EllipseCurveLinematerial)
    ellipseLine.name = 'ellipseLine'
    curveGroup.add(ellipse)
    curveGroup.add(ellipseLine)
    this.scene.add(curveGroup)
    this.entitiesCanBePicked.push(ellipse, ellipseLine)
    return curveGroup
  }

  /**
   * 更新椭圆大小
   * @param xRadius 椭圆短半轴长度
   * @param yRadius 椭圆长半轴长度
   */
  updateCurve = (xRadius: any, yRadius: any) => {
    const curveGroup = this.scene.getObjectByName('curveGroup')
    const ellipse = curveGroup.getObjectByName('ellipse')
    const ellipseLine = curveGroup.getObjectByName('ellipseLine')
    ellipse.geometry.dispose()
    ellipseLine.geometry.dispose()
    const curve = new THREE.EllipseCurve(
      0,
      0, // ax, aY
      xRadius,
      yRadius, // xRadius, yRadius
      0,
      2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    )
    ellipse.geometry = new THREE.ShapeGeometry(
      new THREE.Shape(new THREE.Path(curve.getPoints(64)).getPoints())
    )
    ellipseLine.geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64))
  }

  /**
   * 绘制三维四边形面
   * @param points 四边形四个顶点数组[Vetor3,Vetor3 ...]
   * @returns
   */
  addPlaneGeometry = (points: any) => {
    // 计算中心点
    const center = new THREE.Vector3()
    points.forEach((point: any) => center.add(point))
    center.divideScalar(points.length)

    // 根据角度排序
    points.sort((a, b) => {
      const angleA = Math.atan2(a.y - center.y, a.x - center.x)
      const angleB = Math.atan2(b.y - center.y, b.x - center.x)
      return angleA - angleB
    })

    // 创建顶点数组
    const vertices = new Float32Array([
      points[0].x,
      points[0].y,
      points[0].z,
      points[1].x,
      points[1].y,
      points[1].z,
      points[2].x,
      points[2].y,
      points[2].z,
      points[3].x,
      points[3].y,
      points[3].z
    ])
    // const vertices = new Float32Array(points)
    // 定义顶点的索引 (两个三角形)
    const indices = new Uint16Array([
      0,
      1,
      2, // 第一个三角形
      0,
      2,
      3 // 第二个三角形
    ])

    // 创建几何体
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))
    const edges = new THREE.EdgesGeometry(geometry)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })
    const lineSegments = new THREE.LineSegments(edges, lineMaterial)
    this.scene.add(lineSegments)
    return lineSegments
    // // 创建材质
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })

    // // 创建网格对象
    // const plane = new THREE.Mesh(geometry, material)

    // // 将平面添加到场景中
    // this.scene.add(plane)
  }

  /**
   * 更新平面
   * @param lineSegments 要更新的平面对象
   * @param points 新对象的点坐标
   */
  updatePlaneGeometry = (lineSegments: THREE.LineSegments, points: any) => {
    // 计算中心点
    const center = new THREE.Vector3()
    points.forEach((point) => center.add(point))
    center.divideScalar(points.length)
    // 根据角度排序
    points.sort((a, b) => {
      const angleA = Math.atan2(a.y - center.y, a.x - center.x)
      const angleB = Math.atan2(b.y - center.y, b.x - center.x)
      return angleA - angleB
    })
    // 创建顶点数组
    const vertices = new Float32Array([
      points[0].x,
      points[0].y,
      points[0].z,
      points[1].x,
      points[1].y,
      points[1].z,
      points[2].x,
      points[2].y,
      points[2].z,
      points[3].x,
      points[3].y,
      points[3].z
    ])
    // const vertices = new Float32Array([points[0], points[1], points[2]])
    // 定义顶点的索引 (两个三角形)
    const indices = new Uint16Array([
      0,
      1,
      2, // 第一个三角形
      0,
      2,
      3 // 第二个三角形
    ])
    // 创建几何体
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))
    lineSegments.geometry.dispose()
    lineSegments.geometry = new THREE.EdgesGeometry(geometry)
  }

  /**
   * 计算屏幕上的点击的点与场景中物体的相交情况
   * @param eventclientX 鼠标位置x坐标
   * @param eventclientY 鼠标位置y坐标
   * @returns  交点坐标向量Vector3
   */
  convertPos = (eventclientX: any, eventclientY: any) => {
    let localIntersection: any
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    let getBoundingClientRect = this.canvas.getBoundingClientRect()
    mouse.x = ((eventclientX - getBoundingClientRect.left) / this.canvas.clientWidth) * 2 - 1
    mouse.y = -((eventclientY - getBoundingClientRect.top) / this.canvas.clientHeight) * 2 + 1
    raycaster.setFromCamera(mouse, this.camera)
    // // 计算射线与场景中物体的相交情况
    // console.log(this.entitiesCanBePicked)
    const intersects = new THREE.Vector3()
    raycaster.ray.intersectPlane(this.entitiesCanBePicked[0], intersects)
    // console.log(intersects)
    // this.addPoint([intersects])
    if (intersects) {
      // console.log(intersects.length)
      // const intersection = intersects[0]
      localIntersection = intersects
      // const vec1 = new THREE.Vector3()
      // this.entitiesCanBePicked[0].projectPoint(localIntersection, vec1)
      // this.addPoint([vec1])
      // // localIntersection = intersectedPoint
    }
    return localIntersection
  }

  /**
   * 绘制线
   * @param points 线上的端点
   * @returns 线对象THREE.Line
   */
  addLine = (points: any) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: 0x155155 })
    const line = new THREE.Line(geometry, material)
    this.scene.add(line)
    return line
  }

  /**
   * 绘制箭头
   * @param start 箭头起点坐标向量
   * @param end 箭头终点坐标向量
   * @returns THREE.ArrowHelper
   */
  addArrow = (start: any, end: any) => {
    // 计算方向向量
    const direction = new THREE.Vector3().subVectors(end, start).normalize()

    // 计算箭头长度
    const length = start.distanceTo(end)

    // 定义箭头的颜色
    const color = 0x00ff00 // 绿色

    // 创建箭头帮助器
    const arrowHelper = new THREE.ArrowHelper(direction, start, length, color)

    // 将箭头添加到场景中
    this.scene.add(arrowHelper)

    return arrowHelper
  }

  /**
   * 更新箭头位置
   * @param arrowHelper 箭头对象
   * @param start 箭头起点
   * @param end 箭头终点
   */
  updateArrow = (arrowHelper: THREE.ArrowHelper, start: any, end: any) => {
    // 计算方向向量
    const direction = new THREE.Vector3().subVectors(end, start).normalize()

    // 计算箭头长度
    const length = start.distanceTo(end)

    // 定义箭头的颜色
    const color = 0x00ff00 // 绿色

    arrowHelper.setDirection(direction)
    arrowHelper.setLength(length)
  }

  /**
   * 更新mesh的几何通用方法
   * @param mesh 要更新的mesh对象
   * @param geometry 更新的几何
   */
  updateGroupGeometry = (mesh: any, geometry: any) => {
    if (geometry.isGeometry) {
      geometry = new THREE.BufferGeometry().fromGeometry(geometry)
    }
    mesh.geometry.dispose()
    mesh.geometry = new THREE.WireframeGeometry(geometry)
    mesh.geometry = geometry
  }

  /**
   * 加载字体方法
   * @returns Promise对象，resolve值为加载的字体
   */
  loadFont = () => {
    return new Promise((resolve, reject) => {
      const loader = new THREE.FontLoader()
      loader.load('../src/assets/font/helvetiker_regular.typeface.json', resolve, undefined, reject)
    })
  }

  /**
   * 文字的绘制
   * @param pointA 绘制起点
   * @param pointB 绘制终点
   * @returns 绘制的文字对象THREE.Mesh
   */
  addText = async (pointA: any, pointB: any) => {
    // 0.121.1
    const direction = new THREE.Vector3().subVectors(pointB, pointA).normalize()
    const distance = pointA.distanceTo(pointB)
    const midpoint = new THREE.Vector3().addVectors(pointB, pointA).multiplyScalar(0.5)
    const font = await this.loadFont()
    var geometry = new THREE.TextGeometry(distance.toString() + 'mm', {
      font: font,
      size: distance / 30, // 根据点之间的距离调整字体大小
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelSegments: 3
    })
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const textMesh = new THREE.Mesh(geometry, material)
    textMesh.position.copy(midpoint)
    // const pos1 = pointA.clone().add(direction.multiplyScalar(distance / 4))
    // textMesh.position.copy(pointA.clone().add(direction.multiplyScalar(distance / 2)))
    const up = new THREE.Vector3(1, 0, 0) // 文本的向上方向
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction)
    textMesh.setRotationFromQuaternion(quaternion)
    textMesh.geometry.center()
    this.scene.add(textMesh)
    return textMesh
  }

  /**
   * 更新文字位置
   * @param textMesh 需要更新的文字对象
   * @param pointA 绘制起点
   * @param pointB 绘制终点
   */
  updateText = (textMesh: THREE.Mesh, pointA: any, pointB: any) => {
    const direction = new THREE.Vector3().subVectors(pointB, pointA).normalize()
    const distance = pointA.distanceTo(pointB)
    // postion && textMesh.position.set(5, 0, 0)
    const loader = new THREE.FontLoader()
    const updateGroupGeometry = this.updateGroupGeometry
    loader.load('../src/assets/font/helvetiker_regular.typeface.json', function (font) {
      var geometry = new THREE.TextGeometry('Hello three', {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      })
      geometry.center()

      updateGroupGeometry(textMesh, geometry)
    })
  }

  /**
   * 标绘方法
   */
  plot = (plotType: any) => {
    let startScreenPoint: any = [] //用于存储绘制屏幕起点
    let startPoint: any = [] //用于存储绘制起点
    let drawObjects: any
    this.plotType = plotType
    // const box = this.addBox()
    // const testp = this.addPoint([new THREE.Vector3(0, 10, 10)])
    if (this.auxiliaryPlanes == null) {
      this.auxiliaryPlanes = this.generateAuxiliaryPlanes()

      // this.auxiliaryPlanes = this.addEllipseCurve(20, 20) //绘制平面的添加
      // this.auxiliaryPlanes.add(new THREE.AxesHelper(5)) //辅助坐标系的添加
      // this.auxiliaryPlanes.lookAt(this.camera.position)
      // console.log(this.auxiliaryPlanes.rotation)
      // const test = {
      //   a: 0
      // }
      // this.gui = new GUI() //GUI调试窗口添加
      // const cubeFolder = this.gui.addFolder('Cube')
      // cubeFolder.add(this.auxiliaryPlanes.rotation, 'x', 0, Math.PI * 2).name('Rotation X')
      // // .onChange((value: any) => {
      // //   testp.geometry = new THREE.BufferGeometry().setFromPoints([
      // //     auxiliaryPlanes.worldToLocal(new THREE.Vector3(0, 10, 10))
      // //   ])
      // // })
      // cubeFolder.add(this.auxiliaryPlanes.rotation, 'y', 0, Math.PI * 2).name('Rotation Y')
      // // .onChange((value: any) => {
      // //   testp.geometry = new THREE.BufferGeometry().setFromPoints([
      // //     auxiliaryPlanes.worldToLocal(new THREE.Vector3(0, 10, 10))
      // //   ])
      // // })
      // cubeFolder.add(this.auxiliaryPlanes.rotation, 'z', 0, Math.PI * 2).name('Rotation Z')
      // cubeFolder
      //   .add(test, 'a', -100, 200)
      //   .name('Rotation c')
      //   .onChange((value: any) => {
      //     const dir = new THREE.Vector3()
      //     this.entitiesCanBePicked[0].getWorldDirection(dir)
      //     // dis向量表示相机沿着相机视线方向平移200的位移量
      //     const dis = dir.clone().multiplyScalar(value)
      //     // 相机沿着视线方向平移
      //     this.entitiesCanBePicked[0].position.add(dis)
      //   })
    }

    //监听左键单击事件
    const onMouseDown = (event: any) => {
      if (event.button === 0) {
        //计算屏幕上的点击的点与场景中物体的相交情况
        const localIntersection = this.convertPos(event.clientX, event.clientY)
        if (localIntersection != null) {
          startPoint.push(localIntersection)
          startScreenPoint = [event.clientX, event.clientY]
          // this.addPoint([localIntersection]) //绘制起点处添加点
          window.addEventListener('mousemove', onMouseMove)
          // console.log('onMouseDownadd!')
          // console.log(startPoint[0])
        }
      }
    }

    //用于判断鼠标移动事件中左键单击事件是否被添加，防止鼠标左键单击事件被多次添加
    let isEventListenerAdd = false

    //鼠标移动事件添加
    const onMouseMove = async (event: any) => {
      //移除初始监听事件避免与后续事件冲突
      window.removeEventListener('pointerdown', onMouseDown)
      //判断鼠标是否与辅助平面相交
      const localIntersection = this.convertPos(event.clientX, event.clientY)
      if (localIntersection != null) {
        const planePoint1 = this.convertPos(startScreenPoint[0], event.clientY)
        const planePoint2 = this.convertPos(event.clientX, startScreenPoint[1])
        if (drawObjects == null) {
          switch (this.plotType) {
            case 'point':
              drawObjects = this.addPoint([localIntersection]) //绘制终点添加点
              // drawObjects.rotation.clone(this.auxiliaryPlanes.rotation)
              break
            case 'line':
              drawObjects = this.addLine([localIntersection, startPoint[0]])
              break
            case 'polylines':
              drawObjects = this.addLine([localIntersection, startPoint[0]])
              console.log(drawObjects)

              break
            case 'arrow':
              drawObjects = this.addArrow(localIntersection, startPoint[0])
              break
            case 'plane':
              if (planePoint1 != null && planePoint2 != null) {
                const pointtestLocal = new THREE.Vector3(
                  localIntersection.x,
                  startPoint[0].y,
                  localIntersection.z
                )
                const pointtestLocal2 = new THREE.Vector3(
                  startPoint[0].x,
                  localIntersection.y,
                  startPoint[0].z
                )
                // plane = this.addPlaneGeometry([localIntersection, point1, startPoint[0], point2])
                drawObjects = this.addPlaneGeometry([
                  localIntersection,
                  pointtestLocal,
                  startPoint[0],
                  pointtestLocal2
                ])
              }
              break
            default:
              break
          }
        } else {
          //更新
          switch (this.plotType) {
            case 'point':
              drawObjects.geometry = new THREE.BufferGeometry().setFromPoints([localIntersection])
              break
            case 'line':
              drawObjects.geometry = new THREE.BufferGeometry().setFromPoints([
                localIntersection,
                startPoint[0]
              ])
              break
            case 'polylines':
              drawObjects.geometry = new THREE.BufferGeometry().setFromPoints([
                localIntersection,
                startPoint[0]
              ])
              break
            case 'arrow':
              this.updateArrow(drawObjects, startPoint[0], localIntersection)
              break
            case 'plane':
              if (planePoint1 != null && planePoint2 != null) {
                const pointtestLocal = new THREE.Vector3(
                  localIntersection.x,
                  startPoint[0].y,
                  localIntersection.z
                )
                const pointtestLocal2 = new THREE.Vector3(
                  startPoint[0].x,
                  localIntersection.y,
                  startPoint[0].z
                )
                this.updatePlaneGeometry(drawObjects, [
                  localIntersection,
                  pointtestLocal,
                  startPoint[0],
                  pointtestLocal2
                ])
                // this.updatePlaneGeometry(plane, [localIntersection, point1, startPoint[0], point2])
              }
              break
            default:
              break
          }
        }
      }
      //如果未添加过单机监听事件则添加
      if (!isEventListenerAdd) {
        // add = addOnce(localIntersection)
        window.addEventListener(
          'pointerdown',
          async (event1) => {
            if (event1.button === 0) {
              if (this.plotType == 'text') {
                const localIntersection = this.convertPos(event1.clientX, event1.clientY)
                drawObjects = await this.addText(startPoint[0], localIntersection)
              }
              // startPoint = []
              startPoint = this.plotType !== 'polylines' ? [] : [localIntersection]
              // drawObjects = this.plotType !== 'polylines' ? null : drawObjects
              drawObjects = null
              this.plotType !== 'point' &&
                this.plotType !== 'polyline' &&
                window.removeEventListener('mousemove', onMouseMove) //移除鼠标移动监听事件
              this.plotType !== 'point' &&
                this.plotType !== 'polyline' &&
                window.addEventListener('pointerdown', onMouseDown) //再次添加鼠标左键单击监听事件
              isEventListenerAdd = false
            }
            // //右键单击绘制结束
            // if (event1.button === 2) {
            //   startPoint = []
            //   drawObjects = null
            //   window.removeEventListener('mousemove', onMouseMove)
            // }
          },
          { once: true }
        )
        isEventListenerAdd = true
      }
    }
    //
    if (this.plotType == 'point') {
      window.addEventListener('mousemove', onMouseMove)
    } else {
      window.addEventListener('pointerdown', onMouseDown)
    }

    window.addEventListener(
      'pointerdown',
      (event) => {
        if (event.button === 2) {
          window.removeEventListener('pointerdown', onMouseDown)
          window.removeEventListener('mousemove', onMouseMove)
          if (this.auxiliaryPlanes !== null) {
            this.scene.remove(this.auxiliaryPlanes)
            this.auxiliaryPlanes = null
            this.entitiesCanBePicked = []
            // this.gui.destroy()
          }
        }
      },
      { once: false }
    )
  }
}
