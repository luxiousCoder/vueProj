let isResizing = false

const resizeWindow = (elementId: any) => {
  const resizeElement = document.getElementById(elementId)
  const edgeThreshold = 5 // 距离边缘的阈值（像素）

  resizeElement?.addEventListener('mousemove', (event) => {
    if (isMouseNearEdge(event, resizeElement, edgeThreshold)) {
      resizeElement.style.cursor = 'se-resize'
      resizeElement?.addEventListener('mousedown', (event) => {
        isResizing = true
        document.addEventListener('mousemove', resizeresizeElement)
        document.addEventListener('mouseup', stopResizing)
      })
    } else {
      resizeElement.style.cursor = 'default'
      stopResizing()
    }
  })

  function resizeresizeElement(e) {
    if (isResizing) {
      const containerRect = resizeElement?.getBoundingClientRect()
      const newWidth = e.clientX - containerRect.left
      const newHeight = e.clientY - containerRect.top

      if (newWidth > 50 && newHeight > 50) {
        // 设置最小尺寸
        resizeElement.style.width = `${newWidth}px`
        resizeElement.style.height = `${newHeight}px`
      }
    }
  }

  function stopResizing() {
    isResizing = false
    document.removeEventListener('mousemove', resizeresizeElement)
    document.removeEventListener('mouseup', stopResizing)
  }
}

function isMouseNearEdge(event, resizeElement, threshold) {
  const rect = resizeElement.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  return (
    mouseX < threshold ||
    mouseX > rect.width - threshold ||
    mouseY < threshold ||
    mouseY > rect.height - threshold
  )
}

export { resizeWindow }
