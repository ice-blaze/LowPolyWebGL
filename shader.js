/*========================= SHADERS ========================= */

class SHADERS {
  static get flat_vs(){
    return `
      attribute vec3 position;
      attribute vec3 color;
      attribute vec3 normal;
      uniform mat4 Pmatrix;
      uniform mat4 Vmatrix;
      uniform mat4 Mmatrix;
      varying vec3 vColor;
      varying vec3 vNormal;
      varying vec3 vView;
      void main(void) { //pre-built function
        gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);
        gl_PointSize=1.;
        vColor=color;
        vNormal = vec3(Mmatrix * vec4(normal, 0.));
      }`
  }

  static get flat_fs(){
    return `
      precision mediump float;
      varying vec3 vColor;
      varying vec3 vNormal;

      const vec3 source_ambient_color=vec3(1.,1.,1.);
      const vec3 source_diffuse_color=vec3(1.,2.,4.);
      const vec3 source_specular_color=vec3(1.,1.,1.);
      const vec3 source_direction=vec3(0.,0.,-1.);

      const vec3 mat_ambient_color=vec3(0.3,0.3,0.3);
      const vec3 mat_diffuse_color=vec3(1.,1.,1.);
      const vec3 mat_specular_color=vec3(1.,1.,1.);
      const float mat_shininess=10.;

      void main(void) {
        // gl_FragColor = vec4(vColor, 1.);
        vec3 color=vec3(vColor);
        vec3 I_ambient=source_ambient_color*mat_ambient_color;
        vec3 I_diffuse=source_diffuse_color*mat_diffuse_color*max(0., dot(vNormal, source_direction));
        vec3 I=I_ambient+I_diffuse;
        gl_FragColor = vec4(I*color, 1.);
      }`
  }
}
