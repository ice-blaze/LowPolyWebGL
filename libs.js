"use strict"

class Point{
  static newPoint(){
    const [point] = arguments

    return new Point(point.x, point.y, point.z)
  }

  constructor(){
    const [x,y,z] = arguments
    this.x = x
    this.y = y
    this.z = z
  }

  deepCopy(){
    return new Point(this.x, this.y, this.z)
  }

  length(){
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  normalize(){
    const length = this.length()
    const resultPoint = this.deepCopy()

    resultPoint.x /= length
    resultPoint.y /= length
    resultPoint.z /= length

    return resultPoint
  }

  static calculateSurfaceNormal(){
    const [p1, p2, p3] = arguments
    const U = new Point(p2.x-p1.x, p2.y-p1.y, p2.z-p1.z)
    const V = new Point(p3.x-p1.x, p3.y-p1.y, p3.z-p1.z)

    // convert into cross product
    const normal = new Point(0,0,0)
    normal.x = (U.y*V.z)-(U.z*V.y)
    normal.y = (U.z*V.x)-(U.x*V.z)
    normal.z = (U.x*V.y)-(U.y*V.x)

    return normal.normalize()
  }
}

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
}
