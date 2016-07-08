"use strict"

class Trunk extends Object3D{
  constructor(){
    const [GL, radiusTop, radiusBot, NB_FACES, height, r, g, b] = arguments
    const res = Trunk.generateTrunk(radiusTop, radiusBot, NB_FACES, height, r, g, b)

    super(GL, res.vertices, res.faces)

    this.radiusTop = radiusTop
    this.radiusBot = radiusBot
    this.NB_FACES = NB_FACES
    this.height = height
    this.r = r
    this.g = g
    this.b = b

    this._color = GL.getAttribLocation(this.SHADER_PROGRAM, "color")
    this._normal = GL.getAttribLocation(this.SHADER_PROGRAM, "normal")
    this._position = GL.getAttribLocation(this.SHADER_PROGRAM, "position")

    GL.enableVertexAttribArray(this._color)
    GL.enableVertexAttribArray(this._normal)
    GL.enableVertexAttribArray(this._position)

    this.initBuffers()
  }

  draw(){
    const [PROJMATRIX, VIEWMATRIX, MOVEMATRIX] = arguments
    const GL = this.GL

    GL.bindBuffer(GL.ARRAY_BUFFER, this.VERTEX_BUFFER)
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FACES_BUFFER)

    GL.useProgram(this.SHADER_PROGRAM)

    GL.uniformMatrix4fv(this._Pmatrix, false, PROJMATRIX)
    GL.uniformMatrix4fv(this._Vmatrix, false, VIEWMATRIX)
    GL.uniformMatrix4fv(this._Mmatrix, false, this.MOVEMATRIX)

    GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false,4*(3+3+3),0) // qu'est-ce qui se passe ici ?
    GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false,4*(3+3+3),3*4)
    GL.vertexAttribPointer(this._normal, 3, GL.FLOAT, false,4*(3+3+3),(3+3)*4)

    GL.drawArrays(GL.POINTS, 0, this.vertices.length/9)
    GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0)
  }

  static generateTrunk(){
    const [radiusTop, radiusBot, NB_FACES, height, r, g, b] = arguments
    const t = 2 * Math.PI / NB_FACES
    let i
    const res = {
      'vertices':[],
      'faces':[],
    }

    const verticesUnique = [] // for performance reason they are not keep but could be just add to the super object
    for (i = 0; i < NB_FACES; ++i){
      const xTop = radiusTop * Math.cos(t * i)
      const yTop =  -radiusTop * Math.sin(t * i)
      verticesUnique.push(LIBS.Point(xTop, height, yTop))

      const xBot = radiusBot * Math.cos(t * i)
      const yBot = -radiusBot * Math.sin(t * i)
      verticesUnique.push(LIBS.Point(xBot,-10,yBot))
    }

    const DOUBLE_NB_FACES = NB_FACES*2
    for(i=0; i<DOUBLE_NB_FACES; ++i){
      const pt1=verticesUnique[(i)%DOUBLE_NB_FACES]
      const pt2=verticesUnique[(i+1)%DOUBLE_NB_FACES]
      const pt3=verticesUnique[(i+2)%DOUBLE_NB_FACES]

      let normal
      if(i%2){
        normal = LIBS.calculateSurfaceNormal(pt1.x,pt1.y,pt1.z,pt2.x,pt2.y,pt2.z,pt3.x,pt3.y,pt3.z)
      }else{
        normal = LIBS.calculateSurfaceNormal(pt3.x,pt3.y,pt3.z,pt2.x,pt2.y,pt2.z,pt1.x,pt1.y,pt1.z)
      }

      res.vertices.push(pt1.x,pt1.y,pt1.z,r,g,b,normal.x,normal.y,normal.z)
      res.vertices.push(pt2.x,pt2.y,pt2.z,r,g,b,normal.x,normal.y,normal.z)
      res.vertices.push(pt3.x,pt3.y,pt3.z,r,g,b,normal.x,normal.y,normal.z)
      res.faces.push(3*i,3*i+1,3*i+2)
    }
    return res
  }
}
