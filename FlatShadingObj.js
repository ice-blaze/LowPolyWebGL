"use strict"

class FlatShadingObj extends Object3D{
  constructor(){
    const [GL, vertices, faces, r, g, b] = arguments

    super(GL, vertices, faces, SHADERS.flat_vs, SHADERS.flat_fs, r, g, b)
  }
}
