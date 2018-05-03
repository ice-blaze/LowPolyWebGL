"use strict"

class Leaves extends FlatShadingObj{
  constructor(){
    const [GL, NB_FACES, NB_SLICES, r, g, b] = arguments
    const res = Leaves.generate(NB_FACES, NB_SLICES, r, g, b)

    super(GL, res.vertices, res.faces, r, g, b)

    this.NB_FACES = NB_FACES
    this.NB_SLICES = NB_SLICES
  }

  static generate(){
    const [_NB_FACES, _NB_SLICES, r, g, b] = arguments
    const color = new Point(r, g, b)
    const NB_FACES = _NB_FACES
    const NB_SLICES = _NB_SLICES

    const verticesUnique = []
    const res = {
      'vertices':[],
      'faces':[],
    }

    let i = 0
    let j = 0

    // draw cercle de points
    const t = 2 * Math.PI / NB_FACES
    const HALF_PI = 3.14159265359/2
    for (i = 0; i < NB_SLICES; ++i){
      const height = ((2 / (NB_SLICES + 1)) * (i + 1))-1
      const radius = Math.cos(height * HALF_PI)
      // console.log(height);
      for (j = 0; j < NB_FACES; ++j){
        const xTop = radius * Math.cos(t * j)
        const yTop =  -radius * Math.sin(t * j)
        verticesUnique.push(new Point(xTop, height, yTop))
      }
    }

    let idx=0
    //top
    for(i=0; i<NB_FACES; i+=1){
      let pt1 = verticesUnique[i]
      let pt2 = verticesUnique[(i+1)%NB_FACES]
      const pt3 = new Point(0, -1, 0)
      const normal = Point.calculateSurfaceNormal(pt1, pt2, pt3)

      idx = Object3D.addFace(res.vertices, res.faces, pt2, pt1, pt3, color, normal, idx)
    }

    const LAST_SLICE = NB_FACES*(NB_SLICES-1)

    for(i=0; i<LAST_SLICE; i+=1){
      const face = i%NB_FACES
      let level = Math.floor(i/NB_FACES)
      const pt1 = verticesUnique[face+NB_FACES*level]
      const pt2 = verticesUnique[((face+1)%NB_FACES)+NB_FACES*level]
      const pt3 = verticesUnique[face+NB_FACES*(level+1)]
      const pt4 = verticesUnique[((face+1)%NB_FACES)+NB_FACES*(level+1)]

      const normal1 = Point.calculateSurfaceNormal(pt3, pt2, pt1)
      const normal2 = Point.calculateSurfaceNormal(pt2, pt3, pt4)
      idx = Object3D.addFace(res.vertices, res.faces, pt1, pt2, pt3, color, normal1, idx)
      idx = Object3D.addFace(res.vertices, res.faces, pt2, pt3, pt4, color, normal2, idx)
    }

    //bottom
    for(i=0; i<NB_FACES; i+=1){
      let pt1 = verticesUnique[LAST_SLICE+i]
      let pt2 = verticesUnique[LAST_SLICE+(i+1)%NB_FACES]
      const pt3 = new Point(0, 1, 0)
      const normal = Point.calculateSurfaceNormal(pt2, pt1, pt3)

      idx = Object3D.addFace(res.vertices, res.faces, pt2, pt1, pt3, color, normal, idx)
    }

    return res
  }
}
