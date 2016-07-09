"use strict"

class Leaves extends FlatShadingObj{
  constructor(){
    const [GL, radiusTop, radiusBot, NB_FACES, height, r, g, b] = arguments
    const res = Leaves.generateTrunk(r, g, b)

    super(GL, res.vertices, res.faces, r, g, b)

    this.radiusTop = radiusTop
    this.radiusBot = radiusBot
    this.NB_FACES = NB_FACES
    this.height = height
  }

  static generate(){
    const [r, g, b] = arguments

    // let vertices[12][3]  /* 12 vertices with x, y, z coordinates */
    // let Pi = 3.141592653589793238462643383279502884197

    // let phiaa  = 26.56505  /* phi needed for generation */
    // r = 1.0  /* any radius in which the polyhedron is inscribed */
    // phia = Pi*phiaa/180.0  /* 2 sets of four points */
    // theb = Pi*36.0/180.0   /* offset second set 36 degrees */
    // the72 = Pi*72.0/180    /* step 72 degrees */
    // vertices[0][0]=0.0
    // vertices[0][1]=0.0
    // vertices[0][2]=r
    // vertices[11][0]=0.0
    // vertices[11][1]=0.0
    // vertices[11][2]=-r
    // the = 0.0
    // for(let i=1  i<6  i++)
    // {
      // vertices[i][0]=r*cos(the)*cos(phia)
      // vertices[i][1]=r*sin(the)*cos(phia)
      // vertices[i][2]=r*sin(phia)
      // the = the+the72
    // }
    // the=theb
    // for(let i=6  i<11  i++)
    // {
      // vertices[i][0]=r*cos(the)*cos(-phia)
      // vertices[i][1]=r*sin(the)*cos(-phia)
      // vertices[i][2]=r*sin(-phia)
      // the = the+the72
    // }

    // polygon(0,1,2)
    // polygon(0,2,3)
    // polygon(0,3,4)
    // polygon(0,4,5)
    // polygon(0,5,1)
    // polygon(11,6,7)
    // polygon(11,7,8)
    // polygon(11,8,9)
    // polygon(11,9,10)
    // polygon(11,10,6)
    // polygon(1,2,6)
    // polygon(2,3,7)
    // polygon(3,4,8)
    // polygon(4,5,9)
    // polygon(5,1,10)
    // polygon(6,7,2)
    // polygon(7,8,3)
    // polygon(8,9,4)
    // polygon(9,10,5)
    // polygon(10,6,1)
  }
}
