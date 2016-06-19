"use strict"

class Trunk extends Object3D{
  constructor(GL, radiusTop, radiusBot, NB_FACES, height, r, g, b){
    super(GL)

    this.radiusTop = radiusTop
    this.radiusBot = radiusBot
    this.NB_FACES = NB_FACES
    this.height = height
    this.r = r
    this.g = g
    this.b = b

    this.generateTrunk()

    this.initBuffers()
  }

  generateTrunk(){
    var t = 2 * Math.PI / this.NB_FACES
    var i
    this.vertices = []
    var verticesUnique = [] // for performance reason they are not keep but could be just add to the super object
    this.faces = []
    for (i = 0; i < this.NB_FACES; ++i){
      let xTop = this.radiusTop * Math.cos(t * i)
      let yTop =  -this.radiusTop * Math.sin(t * i)

      verticesUnique.push(LIBS.Point(xTop,this.height,yTop))
      let xBot = this.radiusBot * Math.cos(t * i)
      let yBot = -this.radiusBot * Math.sin(t * i)
      verticesUnique.push(LIBS.Point(xBot,-10,yBot))
    }

    const DOUBLE_NB_FACES = this.NB_FACES*2
    for(i=0; i<DOUBLE_NB_FACES; ++i){
      let pt1=verticesUnique[(i)%DOUBLE_NB_FACES]
      let pt2=verticesUnique[(i+1)%DOUBLE_NB_FACES]
      let pt3=verticesUnique[(i+2)%DOUBLE_NB_FACES]

      let normal
      if(i%2){
        normal = LIBS.calculateSurfaceNormal(pt1.x,pt1.y,pt1.z,pt2.x,pt2.y,pt2.z,pt3.x,pt3.y,pt3.z)
      }else{
        normal = LIBS.calculateSurfaceNormal(pt3.x,pt3.y,pt3.z,pt2.x,pt2.y,pt2.z,pt1.x,pt1.y,pt1.z)
      }

      this.vertices.push(pt1.x,pt1.y,pt1.z,this.r,this.g,this.b,normal.x,normal.y,normal.z)
      this.vertices.push(pt2.x,pt2.y,pt2.z,this.r,this.g,this.b,normal.x,normal.y,normal.z)
      this.vertices.push(pt3.x,pt3.y,pt3.z,this.r,this.g,this.b,normal.x,normal.y,normal.z)
      this.faces.push(3*i,3*i+1,3*i+2)
    }
  }
}
