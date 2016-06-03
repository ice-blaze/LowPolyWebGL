var main=function() {
  var CANVAS=document.getElementById("your_canvas");
  CANVAS.width=window.innerWidth;
  CANVAS.height=window.innerHeight;

  /*==================  EVENTS  ============================*/
  var viewer = {
    velocity:0.001,
    pos:LIBS.Point(0,0,0)
  };

  function eventKeypress(e){
    var code = e.keyCode;
    switch (code) {
        case 37:
          console.log("Left");
          break;
        case 38:
          console.log("Up");
          break;
        case 39:
          console.log("Right");
          break;
        case 40:
          console.log("Down");
          break;
        case 65:
          console.log("A");
          viewer.pos.x -= 0.001;
          break;
        case 87:
          console.log("W");
          viewer.pos.z -= 0.001;
          break;
        case 68:
          console.log("D");
          viewer.pos.x += 0.001;
          break;
        case 83:
          console.log("S");
          viewer.pos.z += 0.001;
          break;
        default:
          console.log(code);
          //Everything else
    }
    return false;
  }
  document.addEventListener("keydown", eventKeypress, false);

  /*========================= GET WEBGL CONTEXT ========================= */
  var GL;
  try {
    GL = CANVAS.getContext("experimental-webgl", {antialias: false});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  }

  var get_shader=function(source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };

  var shader_vertex=get_shader(flat_vs, GL.VERTEX_SHADER, "VERTEX");
  var shader_fragment=get_shader(flat_fs, GL.FRAGMENT_SHADER, "FRAGMENT");

  var SHADER_PROGRAM=GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);

  GL.linkProgram(SHADER_PROGRAM);

  var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
  var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
  var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");

  var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
  var _normal = GL.getAttribLocation(SHADER_PROGRAM, "normal");
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

  GL.enableVertexAttribArray(_color);
  GL.enableVertexAttribArray(_normal);
  GL.enableVertexAttribArray(_position);

  GL.useProgram(SHADER_PROGRAM);

  /*========================= THE TRUNK ========================= */
  var tree = LIBS.drawCylinder(1,2,6,3,0.5,0.13,0.);
  var cube_vertex = tree.vertices;

  var CUBE_VERTEX= GL.createBuffer ();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cube_vertex), GL.STATIC_DRAW);

  //FACES :
  var cube_faces = tree.faces;
  var CUBE_FACES= GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube_faces), GL.STATIC_DRAW);

  /*========================= MATRIX ========================= */

  var PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100);
  var MOVEMATRIX=LIBS.get_I4();
  var VIEWMATRIX=LIBS.get_I4();

  LIBS.translateZ(VIEWMATRIX, -20);

  /*========================= DRAWING ========================= */
  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);
  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  GL.clearDepth(1.0);

  var time_old=0;
  var animate=function(time) {
    var dt=time-time_old;
    // LIBS.rotateY(VIEWMATRIX, dt*0.001);
    // LIBS.rotateZ(MOVEMATRIX, dt*0.002);
    // LIBS.rotateX(MOVEMATRIX, dt*0.0015);

    LIBS.translateX(VIEWMATRIX,dt*0.001);
    time_old=time;

    GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
    GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
    GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false,4*(3+3+3),0);// qu'est-ce qui se passe ici ?
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false,4*(3+3+3),3*4);
    GL.vertexAttribPointer(_normal, 3, GL.FLOAT, false,4*(3+3+3),(3+3)*4);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
    GL.drawElements(GL.TRIANGLES, cube_faces.length, GL.UNSIGNED_SHORT, 0);
    GL.drawArrays(GL.POINTS, 0, cube_vertex.length/9);

    GL.flush();

    window.requestAnimationFrame(animate);
  };
  animate(0);
};
