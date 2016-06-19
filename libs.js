"use strict"

let LIBS={
  degToRad: function(angle){
    return(angle*Math.PI/180)
  },

  get_projection: function(angle, a, zMin, zMax) {
    var tan=Math.tan(LIBS.degToRad(0.5*angle)),
        A=-(zMax+zMin)/(zMax-zMin),
          B=(-2*zMax*zMin)/(zMax-zMin)

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

  rotateX: function(m, angle) {
    var c=Math.cos(angle)
    var s=Math.sin(angle)
    var mv1=m[1], mv5=m[5], mv9=m[9]
    m[1]=m[1]*c-m[2]*s
    m[5]=m[5]*c-m[6]*s
    m[9]=m[9]*c-m[10]*s

    m[2]=m[2]*c+mv1*s
    m[6]=m[6]*c+mv5*s
    m[10]=m[10]*c+mv9*s
  },

  rotateY: function(m, angle) {
    var c=Math.cos(angle)
    var s=Math.sin(angle)
    var mv0=m[0], mv4=m[4], mv8=m[8]
    m[0]=c*m[0]+s*m[2]
    m[4]=c*m[4]+s*m[6]
    m[8]=c*m[8]+s*m[10]

    m[2]=c*m[2]-s*mv0
    m[6]=c*m[6]-s*mv4
    m[10]=c*m[10]-s*mv8
  },

  rotateZ: function(m, angle) {
    var c=Math.cos(angle)
    var s=Math.sin(angle)
    var mv0=m[0], mv4=m[4], mv8=m[8]
    m[0]=c*m[0]-s*m[1]
    m[4]=c*m[4]-s*m[5]
    m[8]=c*m[8]-s*m[9]

    m[1]=c*m[1]+s*mv0
    m[5]=c*m[5]+s*mv4
    m[9]=c*m[9]+s*mv8
  },

  translateX: function(m, t){
    m[12]+=t
  },

  translateY: function(m, t){
    m[13]+=t
  },

  translateZ: function(m, t){
    m[14]+=t
  },

  Point: function(x,y,z){
    return {
      "x":x,
      "y":y,
      "z":z
    }
  },

  pointLength:function(point){
    return Math.sqrt(point.x*point.x+point.y*point.y+point.z*point.z)
  },

  normalize:function(point){
    var length = this.pointLength(point)

    point.x /= length
    point.y /= length
    point.z /= length

    return point
  },

  calculateSurfaceNormal: function(p1x,p1y,p1z,p2x,p2y,p2z,p3x,p3y,p3z){
    var U = this.Point(p2x-p1x,p2y-p1y,p2z-p1z)
    var V = this.Point(p3x-p1x,p3y-p1y,p3z-p1z)

    // convert into cross product
    var normal = this.Point(0,0,0)
    normal.x = (U.y*V.z)-(U.z*V.y)
    normal.y = (U.z*V.x)-(U.x*V.z)
    normal.z = (U.x*V.y)-(U.y*V.x)

    normal = this.normalize(normal)

    return normal
  },

  drawTrunk: function (radiusTop,radiusBot,NB_FACES,height,r,g,b){
    var t = 2 * Math.PI / NB_FACES
    var i
    var result = {}
    result.vertices = []
    var verticesUnique = [] // for performance reason they are not keep but could be just add to the result object
    result.faces = []
    for (i = 0; i < NB_FACES; ++i){
      var xTop = radiusTop * Math.cos(t * i)
      var yTop =  -radiusTop * Math.sin(t * i)

      verticesUnique.push(this.Point(xTop,height,yTop))
      var xBot = radiusBot * Math.cos(t * i)
      var yBot = -radiusBot * Math.sin(t * i)
      verticesUnique.push(this.Point(xBot,-10,yBot))
    }

    var DOUBLE_NB_FACES = NB_FACES*2
    for(i=0; i<DOUBLE_NB_FACES; ++i){
      var pt1=verticesUnique[(i)%DOUBLE_NB_FACES]
      var pt2=verticesUnique[(i+1)%DOUBLE_NB_FACES]
      var pt3=verticesUnique[(i+2)%DOUBLE_NB_FACES]

      var normal
      if(i%2){
        normal = this.calculateSurfaceNormal(pt1.x,pt1.y,pt1.z,pt2.x,pt2.y,pt2.z,pt3.x,pt3.y,pt3.z)
      }else{
        normal = this.calculateSurfaceNormal(pt3.x,pt3.y,pt3.z,pt2.x,pt2.y,pt2.z,pt1.x,pt1.y,pt1.z)
      }

      result.vertices.push(pt1.x,pt1.y,pt1.z,r,g,b,normal.x,normal.y,normal.z)
      result.vertices.push(pt2.x,pt2.y,pt2.z,r,g,b,normal.x,normal.y,normal.z)
      result.vertices.push(pt3.x,pt3.y,pt3.z,r,g,b,normal.x,normal.y,normal.z)
      result.faces.push(3*i,3*i+1,3*i+2)
    }

    return result
  },

  drawLeaves: function (){
    // var vertices[12][3]  /* 12 vertices with x, y, z coordinates */
    // var Pi = 3.141592653589793238462643383279502884197

	  // var phiaa  = 26.56505  /* phi needed for generation */
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
	  // for(var i=1  i<6  i++)
	  // {
      // vertices[i][0]=r*cos(the)*cos(phia)
      // vertices[i][1]=r*sin(the)*cos(phia)
      // vertices[i][2]=r*sin(phia)
      // the = the+the72
	  // }
	  // the=theb
	  // for(var i=6  i<11  i++)
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
