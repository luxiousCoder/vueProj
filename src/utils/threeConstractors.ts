import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref } from 'vue'
import { GUI } from 'dat.gui'

export class threeScene {
  canvas: HTMLElement | null
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer
  entitiesCanBePicked: any = []
  pickedText: any = ''
  constructor(canvasId: string) {
    this.pickedText = ''
    this.canvas = document.getElementById(canvasId)
    // 创建3D场景对象Scene
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.clientWidth / this.canvas.clientHeight,
      1,
      1000
    )
    this.camera.position.z = 120
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
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.enabled = true
    const axesHelper = new THREE.AxesHelper(5)
    // this.scene.add(axesHelper)
    this.animate()
  }

  /**
   * three动画
   */
  animate = () => {
    requestAnimationFrame(this.animate)
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

  /**
   * 添加三角形
   * @param vertexPos 三角形底边顶点坐标
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
    const material1 = new THREE.MeshBasicMaterial({ color: 0x8300b5 })
    const triangleMesh = new THREE.Mesh(triangleGeometry, material1)
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
  }

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

  addPlaneGeometry = (points: any) => {
    //四个点的坐标（假设是共面的）
    // const points = [
    //   new THREE.Vector3(-1.0, -1.0, 0.0), // Point 1
    //   new THREE.Vector3(1.0, -1.0, 0.0), // Point 2
    //   new THREE.Vector3(1.5, 1.0, 0.0), // Point 3
    //   new THREE.Vector3(-1.5, 1.0, 0.0) // Point 4
    // ]

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
    // const vertices = new Float32Array([verticesInput])
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
    // const vertices = new Float32Array([verticesInput])
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
    lineSegments.geometry = new THREE.EdgesGeometry(geometry)
  }

  convertPos = (eventclientX: any, eventclientY: any) => {
    let localIntersection: any
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    let getBoundingClientRect = this.canvas.getBoundingClientRect()
    mouse.x = ((eventclientX - getBoundingClientRect.left) / this.canvas.clientWidth) * 2 - 1
    mouse.y = -((eventclientY - getBoundingClientRect.top) / this.canvas.clientHeight) * 2 + 1
    raycaster.setFromCamera(mouse, this.camera)
    // 计算射线与场景中物体的相交情况
    const intersects = raycaster.intersectObjects(this.entitiesCanBePicked, false)
    if (intersects.length > 0) {
      const intersection = intersects[0]
      const intersectedPoint = intersection.point.clone()
      localIntersection = intersectedPoint
    }
    return localIntersection
  }

  worldToLocal = (point: THREE.Vector3, plane: THREE.Object3D) => {
    const pointLocal = plane.worldToLocal(point)
    return pointLocal
  }

  addLine = (points: any) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: 0x155155 })
    const line = new THREE.Line(geometry, material)
    this.scene.add(line)
    return line
  }

  plot = () => {
    let startScreenPoint: any = []
    let startPoint: any = []
    let endPoint: any
    let line: any
    let plane: any
    let point11: any
    let point21: any
    // const box = this.addBox()  this.addPoint([this.worldToLocal(new THREE.Vector3(0, 10, 10), curve)])
    const curve = this.addEllipseCurve(20, 20)
    const testp = this.addPoint([new THREE.Vector3(0, 10, 10)])
    // curve.add(testp)
    curve.add(new THREE.AxesHelper(5))
    const gui = new GUI()
    const cubeFolder = gui.addFolder('Cube')
    let rotate = {
      x:0,
      y:0
    }
    cubeFolder
      .add(curve.rotation, 'x', 0, Math.PI * 2)
      .name('Rotation X')
      .onChange((value: any) => {
        testp.geometry = new THREE.BufferGeometry().setFromPoints([
          this.worldToLocal(new THREE.Vector3(0, 10, 10), curve)
        ])
        console.log(this.worldToLocal(new THREE.Vector3(0, 10, 10), curve));
        
      })
    cubeFolder
      .add(curve.rotation, 'y', 0, Math.PI * 2)
      .name('Rotation Y')
      .onChange((value: any) => {
        testp.geometry = new THREE.BufferGeometry().setFromPoints([
          this.worldToLocal(new THREE.Vector3(0, 10, 10), curve)
        ])
      })
    const onMouseDown = (event: any) => {
      if (event.button === 0) {
        const localIntersection = this.convertPos(event.clientX, event.clientY)
        if (localIntersection != null) {
          startPoint.push(localIntersection)
          startScreenPoint = [event.clientX, event.clientY]
          this.addPoint([localIntersection])
          window.addEventListener('mousemove', onMouseMove)
        }
      }
    }

    const onMouseMove = (event: any) => {
      window.removeEventListener('pointerdown', onMouseDown)
      const localIntersection = this.convertPos(event.clientX, event.clientY)
      if (localIntersection != null) {
        const point1 = this.convertPos(startScreenPoint[0], event.clientY)
        const point2 = this.convertPos(event.clientX, startScreenPoint[1])
        if (endPoint == null) {
          endPoint = this.addPoint([localIntersection])
          const local1 = this.worldToLocal(localIntersection, curve)
          const local2 = this.worldToLocal(startPoint[0], curve)
          // line = this.addLine([localIntersection, startPoint[0]])
          if (point1 != null && point2 != null) {
            const pointtestLocal = new THREE.Vector3(local1.x, local2.y, local1.z)
            const pointtestLocal2 = new THREE.Vector3(local2.x, local1.y, local2.z)
            // plane = this.addPlaneGeometry([localIntersection, point1, startPoint[0], point2])
            plane = this.addPlaneGeometry([
              localIntersection,
              pointtestLocal,
              startPoint[0],
              pointtestLocal2
            ])
          }
        } else {
          // line.geometry = new THREE.BufferGeometry().setFromPoints([
          //   localIntersection,
          //   startPoint[0]
          // ])
          endPoint.geometry = new THREE.BufferGeometry().setFromPoints([localIntersection])
          if (point1 != null && point2 != null) {
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
            const local1 = this.worldToLocal(pointtestLocal, curve)
            const local2 = this.worldToLocal(pointtestLocal2, curve)
            this.updatePlaneGeometry(plane, [localIntersection, local1, startPoint[0], local2])
            // this.updatePlaneGeometry(plane, [localIntersection, point1, startPoint[0], point2])
          }
        }
        window.addEventListener(
          'pointerdown',
          (event1) => {
            if (event1.button === 0) {
              startPoint = []
              endPoint = null
              window.removeEventListener('mousemove', onMouseMove)
              window.addEventListener('pointerdown', onMouseDown, false)
            }
            if (event1.button === 2) {
              startPoint = []
              endPoint = null
              window.removeEventListener('mousemove', onMouseMove)
              // window.addEventListener('pointerdown', onMouseDown, false)
            }
          },
          { once: true }
        )
      }
    }
    // window.addEventListener('mousemove', onMouseMove, false)
    window.addEventListener('pointerdown', onMouseDown, false)
  }
}
