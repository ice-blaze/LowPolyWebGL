"use strict"

const main=function() {
  const CANVAS=document.getElementById("your_canvas")
  CANVAS.width=window.innerWidth
  CANVAS.height=window.innerHeight

  /*==================  EVENTS  ============================*/
  const viewer = {
    velocity:0.001,
    pos:LIBS.Point(0,0,0)
  }

  let movementSpeed = 1

  function eventKeypress(){
    const [e] = arguments
    const code = e.keyCode
    switch (code) {
      case 37:
        console.log("Left")
        LIBS.rotateY(VIEWMATRIX, -0.1)
        break
      case 38:
        console.log("Up")
        break
      case 39:
        console.log("Right")
        LIBS.rotateY(VIEWMATRIX, 0.1)
        break
      case 40:
        console.log("Down")
        break
      case 65:
        console.log("A")
        viewer.pos.x -= 0.001
        LIBS.translateX(VIEWMATRIX, movementSpeed)
        break
      case 87:
        console.log("W")
        viewer.pos.z -= 0.001
        LIBS.translateZ(VIEWMATRIX, movementSpeed)
        break
      case 68:
        console.log("D")
        LIBS.translateX(VIEWMATRIX, -movementSpeed)
        viewer.pos.x += 0.001
        break
      case 83:
        console.log("S")
        LIBS.translateZ(VIEWMATRIX, -movementSpeed)
        viewer.pos.z += 0.001
        break
      default:
        console.log(code)
        //Everything else
    }
    return false
  }
  document.addEventListener("keydown", eventKeypress, false)

  /*========================= GET WEBGL CONTEXT ========================= */
  let GL
  try {
    GL = CANVAS.getContext("experimental-webgl", {antialias: false})
  } catch (e) {
    alert("You are not webgl compatible :(") 
    return false
  }

  const trunk = new Trunk(GL, 1, 2, 6, 3, 0.5, 0.13, 0.)

  const trunk2 = new Trunk(GL, 1, 1, 7, 3, 0.5, 1., 0.)

  /*========================= MATRIX ========================= */

  const PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100)
  // let MOVEMATRIX=LIBS.get_I4()
  const VIEWMATRIX=LIBS.get_I4()

  LIBS.translateZ(VIEWMATRIX, -20)

  /*========================= DRAWING ========================= */
  GL.enable(GL.DEPTH_TEST)
  GL.depthFunc(GL.LEQUAL)
  GL.clearColor(0.0, 0.0, 0.0, 0.0)
  GL.clearDepth(1.0)

  let time_old=0
  const animate=function(time) {
    const dt=time-time_old
    // LIBS.rotateY(VIEWMATRIX, dt*0.001)
    // LIBS.rotateZ(MOVEMATRIX, dt*0.002)

    time_old=time

    // GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height)
    GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)

    trunk.rotateX(dt*0.0015)
    trunk.draw(PROJMATRIX, VIEWMATRIX)

    trunk2.draw(PROJMATRIX, VIEWMATRIX)

    GL.flush()

    window.requestAnimationFrame(animate)
  }
  animate(0)
}
