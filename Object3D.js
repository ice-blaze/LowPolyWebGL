"use strict"

class Object3D {
  constructor(GL) {
    this.GL = GL
  }

  initBuffers(vertices, faces){
    let GL = this.GL

    this.vertices = vertices
    this.faces = faces

    this.initBuffers()
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

    let GL = this.GL

    this.VERTEX_BUFFER = GL.createBuffer ()
    GL.bindBuffer(GL.ARRAY_BUFFER, this.VERTEX_BUFFER)
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertices), GL.STATIC_DRAW)

    this.FACES_BUFFER = GL.createBuffer ()
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FACES_BUFFER)
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), GL.STATIC_DRAW)
  }

  draw(){
    let GL = this.GL

    GL.bindBuffer(GL.ARRAY_BUFFER, this.VERTEX_BUFFER)
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FACES_BUFFER)
    GL.drawArrays(GL.POINTS, 0, this.vertices.length/9)
    GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0)
  }

  translateX(){

  }
}
