"use strict"

class Trunk extends FlatShadingObj{
  constructor(){
    const [GL, radiusTop, radiusBot, NB_FACES, height, r, g, b] = arguments
    const res = Trunk.generate(radiusTop, radiusBot, NB_FACES, height, r, g, b)

    super(GL, res.vertices, res.faces, r, g, b)

    this.radiusTop = radiusTop
    this.radiusBot = radiusBot
    this.NB_FACES = NB_FACES
    this.height = height
  }

  static generate(){
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
      verticesUnique.push(new Point(xTop, height, yTop))

      const xBot = radiusBot * Math.cos(t * i)
      const yBot = -radiusBot * Math.sin(t * i)
      verticesUnique.push(new Point(xBot,-10,yBot))
    }

    const DOUBLE_NB_FACES = NB_FACES*2
    for(i=0; i<DOUBLE_NB_FACES; ++i){
      const pt1=verticesUnique[(i)%DOUBLE_NB_FACES]
      const pt2=verticesUnique[(i+1)%DOUBLE_NB_FACES]
      const pt3=verticesUnique[(i+2)%DOUBLE_NB_FACES]

      let normal
      if(i%2){
        normal = Point.calculateSurfaceNormal(pt1, pt2, pt3)
      }else{
        normal = Point.calculateSurfaceNormal(pt3, pt2, pt1)
      }

      res.vertices.push(pt1.x,pt1.y,pt1.z,r,g,b,normal.x,normal.y,normal.z)
      res.vertices.push(pt2.x,pt2.y,pt2.z,r,g,b,normal.x,normal.y,normal.z)
      res.vertices.push(pt3.x,pt3.y,pt3.z,r,g,b,normal.x,normal.y,normal.z)
      res.faces.push(3*i,3*i+1,3*i+2)
    }
    return res
  }
}
