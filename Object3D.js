"use strict"

class Object3D {

  constructor() {
    const [GL, vertices, faces] = arguments
    this.GL = GL
    this.vertices = vertices
    this.faces = faces

    // Shader Management
    this.shader_vertex=this.get_shader(SHADERS.flat_vs, GL.VERTEX_SHADER, "VERTEX")
    this.shader_fragment=this.get_shader(SHADERS.flat_fs, GL.FRAGMENT_SHADER, "FRAGMENT")

    const SHADER_PROGRAM=GL.createProgram()
    GL.attachShader(SHADER_PROGRAM, this.shader_vertex)
    GL.attachShader(SHADER_PROGRAM, this.shader_fragment)

    GL.linkProgram(SHADER_PROGRAM)

    this._Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix")
    this._Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix")
    this._Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix")
    this.SHADER_PROGRAM = SHADER_PROGRAM

    // Matrix Management
    this.MOVEMATRIX=LIBS.get_I4()

    // Buffer Management
    this.VERTEX_BUFFER = GL.createBuffer ()
    GL.bindBuffer(GL.ARRAY_BUFFER, this.VERTEX_BUFFER)
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(vertices), GL.STATIC_DRAW)

    this.FACES_BUFFER = GL.createBuffer ()
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FACES_BUFFER)
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), GL.STATIC_DRAW)
  }

  rotateX(){
    const [angle] = arguments
    LIBS.rotateX(this.MOVEMATRIX, angle)
  }

  get_shader() {
    const [source, type, typeString] = arguments
    const GL = this.GL
    const shader = GL.createShader(type)
    GL.shaderSource(shader, source)
    GL.compileShader(shader)
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader))
      return false
    }
    return shader
  }

  initBuffers(){
    if(!this.vertices){
      console.error("Warning, trying to initBuffers without vertices");
      return
    }
    if(!this.faces){
      console.error("Warning, trying to initBuffers without faces");
      return
    }

    const GL = this.GL

    this.VERTEX_BUFFER = GL.createBuffer ()
    GL.bindBuffer(GL.ARRAY_BUFFER, this.VERTEX_BUFFER)
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertices), GL.STATIC_DRAW)

    this.FACES_BUFFER = GL.createBuffer ()
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FACES_BUFFER)
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), GL.STATIC_DRAW)
  }

  draw(){
    const GL = this.GL

    GL.bindBuffer(GL.ARRAY_BUFFER, this.VERTEX_BUFFER)
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FACES_BUFFER)
    GL.drawArrays(GL.POINTS, 0, this.vertices.length/9)
    GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0)
  }

  translateX(){

  }
}
