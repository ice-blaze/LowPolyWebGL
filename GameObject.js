class GameObject {
  constructor(){
    this.position = new Point(0,0,0)
    this.rotation = new Point(0,0,0)
    this.size     = new Point(1,1,1)
    this.GOParent = null
    this.GOChildren = [] //GameObject children
    this.translateMatrix = new Mat4()
    this.movematrix = new Mat4()
    // this.translateMatrix = {'GameObject':Mat44.getEmpty()}
  }

  setPosition(position){
    this.movematrix.translate(position)
  }

  setParent(gameObject){
    this.GOParent = gameObject
  }

  addChildren(gameObject){
    this.GOChildren.push(gameObject)
    gameObject.setParent(this)
  }

  getAllTranslateMatrix(){
    let parentMat = Mat4.getEmpty()
    if(this.GOParent){
      parentMat = this.GOParent.getAllTranslateMatrix()
    }
    return Mat4.add(parentMat, this.movematrix)
  }

  // updateTranslateMatrix(position){
  //   this.translateMatrix.translate(position)
  // }
  //
  // updateRotationMatrix(){
  //
  // }
  //
  // updateSizeMatrix(){
  //
  // }

}
