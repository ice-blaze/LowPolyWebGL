"use strict"

class Object3D {

  constructor() {
    const [GL, vertices, faces, vertex_shader, fragment_shader, r, g, b] = arguments
    this.GL = GL
    this.vertices = vertices
    this.faces = faces

    this.shader_vertex=this.get_vertex_shader(vertex_shader)
    this.shader_fragment=this.get_fragment_shader(fragment_shader)

    const SHADER_PROGRAM=GL.createProgram()
    GL.attachShader(SHADER_PROGRAM, this.shader_vertex)
    GL.attachShader(SHADER_PROGRAM, this.shader_fragment)

    GL.linkProgram(SHADER_PROGRAM)

    this._Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix")
    this._Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix")
    this._Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix")
    this.SHADER_PROGRAM = SHADER_PROGRAM

    this.r = r
    this.g = g
    this.b = b

    this._color = GL.getAttribLocation(this.SHADER_PROGRAM, "color")
    this._normal = GL.getAttribLocation(this.SHADER_PROGRAM, "normal")
    this._position = GL.getAttribLocation(this.SHADER_PROGRAM, "position")

    GL.enableVertexAttribArray(this._color)
    GL.enableVertexAttribArray(this._normal)
    GL.enableVertexAttribArray(this._position)

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

  get_fragment_shader() {
    const [source, type] = arguments
    const GL = this.GL
    return this.get_shader(source, GL.FRAGMENT_SHADER, "FRAGMENT")
  }

  get_vertex_shader() {
    const [source, type] = arguments
    const GL = this.GL
    return this.get_shader(source, GL.VERTEX_SHADER, "VERTEX")
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
    this.FACES_BUFFER = GL.createBuffer ()

    this.bindBuffers()

    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), GL.STATIC_DRAW)
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertices), GL.STATIC_DRAW)
  }

  bindBuffers(){
    const GL = this.GL

    GL.bindBuffer(GL.ARRAY_BUFFER, this.VERTEX_BUFFER)
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FACES_BUFFER)
  }

  draw(){
    const GL = this.GL
    const [PROJMATRIX, VIEWMATRIX] = arguments

    this.bindBuffers()

    GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false,4*(3+3+3),0) // qu'est-ce qui se passe ici ?
    GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false,4*(3+3+3),3*4)
    GL.vertexAttribPointer(this._normal, 3, GL.FLOAT, false,4*(3+3+3),(3+3)*4)

    GL.useProgram(this.SHADER_PROGRAM)

    GL.uniformMatrix4fv(this._Pmatrix, false, PROJMATRIX)
    GL.uniformMatrix4fv(this._Vmatrix, false, VIEWMATRIX)
    GL.uniformMatrix4fv(this._Mmatrix, false, this.MOVEMATRIX)

    GL.bindBuffer(GL.ARRAY_BUFFER, this.VERTEX_BUFFER)
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FACES_BUFFER)
    GL.drawArrays(GL.POINTS, 0, this.vertices.length/9)
    GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0)
  }

  translateX(){
  }
}
