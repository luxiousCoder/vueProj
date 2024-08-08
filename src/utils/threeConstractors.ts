import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref } from 'vue'

export class threeScene {
  canvas: HTMLElement | null
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.WebGLRenderer
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
    this.scene.add(axesHelper)
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
  }

  addPoint = (vertices: any) => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

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
      2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    )
    // 将 EllipseCurve 转换为 Shape
    const path = new THREE.Path(curve.getPoints(64))
    const shape = new THREE.Shape(path.getPoints())
    // 创建 ShapeGeometry 并填充颜色
    const EllipseCurveShape = new THREE.ShapeGeometry(shape)
    const EllipseCurvematerial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
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

  onMouseDown = (event) => {
    if (event.button === 0) {
      console.log('down')

      // 将鼠标坐标转换到归一化设备坐标 (NDC) -1到1范围内
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()
      let getBoundingClientRect = this.canvas.getBoundingClientRect()
      mouse.x = ((event.clientX - getBoundingClientRect.left) / this.canvas.clientWidth) * 2 - 1
      mouse.y = -((event.clientY - getBoundingClientRect.top) / this.canvas.clientHeight) * 2 + 1
      // 更新射线投射器
      raycaster.setFromCamera(mouse, this.camera)

      // 计算射线与场景中物体的相交情况
      const intersects = raycaster.intersectObjects(this.scene.children, true)
      if (intersects.length > 0) {
        const intersection = intersects[0]
        const intersectedObject = intersection.object
        const intersectedPoint = intersection.point.clone()
        const localIntersection = intersection.object.worldToLocal(intersectedPoint)
        this.addPoint([localIntersection.x, localIntersection.y, localIntersection.z])
        this.pickedText = [intersectedObject, intersectedPoint]
        console.log(this.pickedText)
      }
    }
  }

  addPickListener = () => {
    // 监听鼠标移动事件
    window.addEventListener('pointerdown', this.onMouseDown, false)
  }

  removePickListener = () => {
    window.removeEventListener('pointerdown', this.onMouseDown)
  }

  convertPos = (eventclientX: any, eventclientY: any) => {
    const mouse = new THREE.Vector2()
    let getBoundingClientRect = this.canvas.getBoundingClientRect()
    mouse.x = ((eventclientX - getBoundingClientRect.left) / this.canvas.clientWidth) * 2 - 1
    mouse.y = -((eventclientY - getBoundingClientRect.top) / this.canvas.clientHeight) * 2 + 1
  }

  addLine = () => {
    let point = []
    let secondPoint: any
    this.addEllipseCurve(20, 20)

    const onMouseDown1 = (event) => {
      if (event.button === 0) {
        // 将鼠标坐标转换到归一化设备坐标 (NDC) -1到1范围内

        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()
        let getBoundingClientRect = this.canvas.getBoundingClientRect()
        mouse.x = ((event.clientX - getBoundingClientRect.left) / this.canvas.clientWidth) * 2 - 1
        mouse.y = -((event.clientY - getBoundingClientRect.top) / this.canvas.clientHeight) * 2 + 1

        // 更新射线投射器
        raycaster.setFromCamera(mouse, this.camera)

        // 计算射线与场景中物体的相交情况
        const intersects = raycaster.intersectObjects(this.scene.children, true)
        if (intersects.length > 0) {
          const intersection = intersects[0]
          const intersectedObject = intersection.object
          const intersectedPoint = intersection.point.clone()
          const localIntersection = intersection.object.worldToLocal(intersectedPoint)
          this.addPoint([localIntersection.x, localIntersection.y, localIntersection.z])
          point.push({ a: '' })
          console.log(point.length)
          window.addEventListener('mousemove', onMouseMove)
        }
      }
    }

    const onMouseMove = (event) => {
      window.removeEventListener('pointerdown', onMouseDown1)
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()
      let getBoundingClientRect = this.canvas.getBoundingClientRect()
      mouse.x = ((event.clientX - getBoundingClientRect.left) / this.canvas.clientWidth) * 2 - 1
      mouse.y = -((event.clientY - getBoundingClientRect.top) / this.canvas.clientHeight) * 2 + 1
      // 更新射线投射器
      raycaster.setFromCamera(mouse, this.camera)
      // 计算射线与场景中物体的相交情况
      const intersects = raycaster.intersectObjects(this.scene.children, false)
      if (intersects.length > 0) {
        const intersection = intersects[0]
        const intersectedObject = intersection.object
        const intersectedPoint = intersection.point.clone()
        const localIntersection = intersection.object.worldToLocal(intersectedPoint)
        if (secondPoint == null) {
          secondPoint = this.addPoint([
            localIntersection.x,
            localIntersection.y,
            localIntersection.z
          ])
        } else {
          const geometry = new THREE.BufferGeometry()
          geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(
              [localIntersection.x, localIntersection.y, localIntersection.z],
              3
            )
          )
          secondPoint.geometry = geometry
        }
        window.addEventListener('pointerdown', (event1) => {
          if (event1.button === 0) {
            point = []
            secondPoint = null
            window.removeEventListener('mousemove', onMouseMove)
            window.addEventListener('pointerdown', onMouseDown1, false)
          }
        })
      }
    }
    window.addEventListener('mousemove', onMouseMove, false)
    // window.addEventListener('pointerdown', onMouseDown1, false)
  }
}
