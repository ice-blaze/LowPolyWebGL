"use strict"

function bindObjectToGL(vertices, faces, GL){

}

var main=function() {
  var CANVAS=document.getElementById("your_canvas")
  CANVAS.width=window.innerWidth
  CANVAS.height=window.innerHeight

  /*==================  EVENTS  ============================*/
  var viewer = {
    velocity:0.001,
    pos:LIBS.Point(0,0,0)
  }

  var movementSpeed = 1

  function eventKeypress(e){
    var code = e.keyCode
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
  var GL
  try {
    GL = CANVAS.getContext("experimental-webgl", {antialias: false})
  } catch (e) {
    alert("You are not webgl compatible :(") 
    return false
  }

  var get_shader=function(source, type, typeString) {
    var shader = GL.createShader(type)
    GL.shaderSource(shader, source)
    GL.compileShader(shader)
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader))
      return false
    }
    return shader
  }

  var shader_vertex=get_shader(flat_vs, GL.VERTEX_SHADER, "VERTEX")
  var shader_fragment=get_shader(flat_fs, GL.FRAGMENT_SHADER, "FRAGMENT")

  var SHADER_PROGRAM=GL.createProgram()
  GL.attachShader(SHADER_PROGRAM, shader_vertex)
  GL.attachShader(SHADER_PROGRAM, shader_fragment)

  GL.linkProgram(SHADER_PROGRAM)

  var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix")
  var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix")
  var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix")

  GL.useProgram(SHADER_PROGRAM)
  // var tree = LIBS.drawTrunk(1,2,6,3,0.5,0.13,0.)
  // var tree2 = LIBS.drawTrunk(1,2,12,3,0.5,0.13,0.)
  var trunk = new Trunk(GL, SHADER_PROGRAM, 1, 2, 6, 3, 0.5, 0.13, 0.)
  var trunk2 = new Trunk(GL, SHADER_PROGRAM, 1, 1, 6, 3, 0.5, 1., 0.)


  /*========================= MATRIX ========================= */

  var PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100)
  var MOVEMATRIX=LIBS.get_I4()
  var VIEWMATRIX=LIBS.get_I4()

  LIBS.translateZ(VIEWMATRIX, -20)

  /*========================= DRAWING ========================= */
  GL.enable(GL.DEPTH_TEST)
  GL.depthFunc(GL.LEQUAL)
  GL.clearColor(0.0, 0.0, 0.0, 0.0)
  GL.clearDepth(1.0)

  var time_old=0
  var animate=function(time) {
    var dt=time-time_old
    // LIBS.rotateY(VIEWMATRIX, dt*0.001)
    // LIBS.rotateZ(MOVEMATRIX, dt*0.002)
    LIBS.rotateX(MOVEMATRIX, dt*0.0015)

    time_old=time

    // GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height)
    GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
    GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX)
    GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX)
    GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX)

    trunk.draw()

    trunk2.draw()

    GL.flush()

    window.requestAnimationFrame(animate)
  }
  animate(0)
}
