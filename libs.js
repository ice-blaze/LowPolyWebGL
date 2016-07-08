"use strict"

let LIBS={

  degToRad: function(){
    const [angle] = arguments
    return(angle*Math.PI/180)
  },

  get_projection: function() {
    const [angle, a, zMin, zMax] = arguments
    const tan=Math.tan(LIBS.degToRad(0.5*angle))
    const A=-(zMax+zMin)/(zMax-zMin)
    const B=(-2*zMax*zMin)/(zMax-zMin)

    return [
      0.5/tan, 0 ,   0, 0,
      0, 0.5*a/tan,  0, 0,
      0, 0,         A, -1,
      0, 0,         B, 0
    ]
  },

  get_I4: function() {
    return [1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1]
  },

  rotateX: function() {
    const [m, angle] = arguments
    const c=Math.cos(angle)
    const s=Math.sin(angle)
    const mv1=m[1], mv5=m[5], mv9=m[9]
    m[1]=m[1]*c-m[2]*s
    m[5]=m[5]*c-m[6]*s
    m[9]=m[9]*c-m[10]*s

    m[2]=m[2]*c+mv1*s
    m[6]=m[6]*c+mv5*s
    m[10]=m[10]*c+mv9*s
  },

  rotateY: function() {
    const [m, angle] = arguments
    const c=Math.cos(angle)
    const s=Math.sin(angle)
    const mv0=m[0], mv4=m[4], mv8=m[8]
    m[0]=c*m[0]+s*m[2]
    m[4]=c*m[4]+s*m[6]
    m[8]=c*m[8]+s*m[10]

    m[2]=c*m[2]-s*mv0
    m[6]=c*m[6]-s*mv4
    m[10]=c*m[10]-s*mv8
  },

  rotateZ: function() {
    const [m, angle] = arguments
    const c=Math.cos(angle)
    const s=Math.sin(angle)
    const mv0=m[0], mv4=m[4], mv8=m[8]
    m[0]=c*m[0]-s*m[1]
    m[4]=c*m[4]-s*m[5]
    m[8]=c*m[8]-s*m[9]

    m[1]=c*m[1]+s*mv0
    m[5]=c*m[5]+s*mv4
    m[9]=c*m[9]+s*mv8
  },

  translateX: function(){
    const [m, t] = arguments
    m[12]+=t
  },

  translateY: function(){
    const [m, t] = arguments
    m[13]+=t
  },

  translateZ: function(){
    const [m, t] = arguments
    m[14]+=t
  },

  //TODO CREATE A CLASSE YOU SHITTY
  Point: function(){
    const [x,y,z] = arguments
    return {
      "x":x,
      "y":y,
      "z":z
    }
  },

  pointLength:function(){
    const [point] = arguments
    return Math.sqrt(point.x*point.x+point.y*point.y+point.z*point.z)
  },

  normalize:function(point){
    const length = this.pointLength(point)

    point.x /= length
    point.y /= length
    point.z /= length

    return point
  },

  calculateSurfaceNormal: function(){
    const [p1x,p1y,p1z,p2x,p2y,p2z,p3x,p3y,p3z] = arguments
    const U = this.Point(p2x-p1x,p2y-p1y,p2z-p1z)
    const V = this.Point(p3x-p1x,p3y-p1y,p3z-p1z)

    // convert into cross product
    const normal = this.Point(0,0,0)
    normal.x = (U.y*V.z)-(U.z*V.y)
    normal.y = (U.z*V.x)-(U.x*V.z)
    normal.z = (U.x*V.y)-(U.y*V.x)

    return this.normalize(normal)
  },

  drawLeaves: function (){
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
