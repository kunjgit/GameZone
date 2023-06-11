attribute vec2 P;
void main() {
  gl_Position = vec4(2.0*P-1.0, 0.0, 1.0);
}

