const draggable = (draggableElementId: any) => {
  //可拖动元素的关键在于position的值为absolute，同时可以调用css的cursor属性改变鼠标指针的样式
  const draggableElement = document.getElementById(draggableElementId)
  document.body.style.userSelect = 'none'
  draggableElement.draggable = true
  console.log(draggableElement)

  let offsetX = 0
  let offsetY = 0

  draggableElement?.addEventListener('dragstart', (event) => {
    offsetX = event.offsetX
    offsetY = event.offsetY
    event.dataTransfer.effectAllowed = 'copy'
    // draggableElement.style.display = 'none'
    draggableElement.style.cursor = 'move'
  })

  document.addEventListener('dragover', (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    draggableElement.style.display = 'none'
    draggableElement.style.cursor = 'move'
  })

  document.addEventListener('drop', (event) => {
    event.preventDefault()
    // draggableElement.style.display = 'none'
    const x = event.clientX - offsetX
    const y = event.clientY - offsetY
    draggableElement.style.display = 'unset'
    draggableElement.style.left = `${x}px`
    draggableElement.style.top = `${y}px`
  })
}

export { draggable }
