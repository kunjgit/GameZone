// graphics.js -- the core rendering engine

// Copyright (C) 2019, Nicholas Carlini <nicholas@carlini.com>.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


/*
TODO SPACE reuse u_which_shadow_light as u_texture_mux
*/
var fragmentShaderHeader = `#version 300 es
precision mediump float;

in vec4 v_normal,world_position,v_color,v_angle,v_project_onto_light[5];

uniform bool u_render_direct,u_is_light_shadow[5];
uniform int u_which_shadow_light,u_texture_mux,u_render_texture;
uniform vec4 u_shift_color,u_light_position[5];
uniform float u_ambient_light,u_light_brightness[5];
uniform sampler2D u_texture[9];

out vec4 out_color;

vec4 get_shader(int i, vec2 texpos) {
  switch(i) {
  ${range(9).map(x=>"case "+x+":return texture(u_texture["+x+"],texpos)").join(";")};
  }
}`


function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source); 
    gl.compileShader(shader);

    // Just assume success on the compiled version
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS); // DEBUGONLY
    if (success) { // DEBUGONLY
        return shader;
    } // DEBUGONLY

    // TODO SPACE
    console./*sdf*/log(source.split("\n").map((x,i)=>(i+1)+":" + x).join("\n")); // DEBUGONLY
    console./*sdf*/log(gl.getShaderInfoLog(shader)); // DEBUGONLY
    gl.deleteShader(shader); // DEBUGONLY
    return undefined; // DEBUGONLY
}

function createProgram(gl, fragmentShaderSource) {
    var program = gl.createProgram();
    var vertexShaderSource = `#version 300 es
precision mediump float;

in vec4 a_position,a_normal,a_color,a_angle;

out vec4 v_normal,world_position,v_color,v_angle;
out vec4 v_project_onto_light[5];

uniform vec4 u_world_position,u_light_position[5];
uniform mat4 u_world_rotation,u_light_matrix[5];


void main() {
  world_position = a_position * u_world_rotation - u_world_position;
  v_normal = a_normal * u_world_rotation;

  for (int i = 0; i < 5; i++) {
    gl_Position = v_project_onto_light[i] = u_light_matrix[i] * world_position;
  }
  v_color = a_color;
  v_angle = a_angle;
}
`;
    
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource));
    gl.linkProgram(program);

    // Again assume success on the compiled version
    var success = gl.getProgramParameter(program, gl.LINK_STATUS); // DEBUGONLY
    if (success) { // DEBUGONLY
        // TODO SPACE is it shorter to just inline all the assignments?
        var locations = {};
        var prev_in = true;
        (fragmentShaderHeader+vertexShaderSource).match(/[a-zA-Z_]+(\[[0-9]\])?/g).map(tok => {
            var toks = [tok];
            if (tok.indexOf("[") > 0) {
                toks = range(32).map(x=>tok.replace(/[0-9]/,x));
            }
            if (tok == "in") prev_in = true;
            if (tok == "uniform") prev_in = false;
            toks.map(tok => 
                     locations[tok] = locations[tok] || (prev_in ? gl.getAttribLocation(program, tok) :gl.getUniformLocation(program, tok))
                    )
        })
        
        return [program, locations];
    } // DEBUGONLY

    console.log(gl.getProgramInfoLog(program)); // DEBUGONLY
    gl.deleteProgram(program); // DEBUGONLY
    return undefined; // DEBUGONLY
}

function make_proj_matrix(fov, aspect, rotation, position) {
    var f = Math.tan(Math.PI/2 - fov/2);

    var matrices = [[
        f / aspect, 0, 0, 0,
        0, 0, f, 0,
        0, 1, 0, 0,
        0, 1, 0, 1
    ],
                    rotation,
                    matrix_translate(position.negate()._xyz())];
    return matrices.reduce(multiply);
}

class Camera {
    constructor(position, dimensions, fov, camera_is_light,
                texture_id, theta, theta2) {
        this.position = position;
        this.dimensions = dimensions;
        this.theta = theta||0;
        this.theta2 = theta2||0;
        this.theta3 = 0;
        this.cull = gl.FRONT;
        this.camera_is_light = camera_is_light;
        this.fov = fov
        this.aspect = dimensions[0]/dimensions[1];
        this.shadow_camera = this;
        this.texture_id = texture_id;

        [this._texture, this.framebuffer] = setup_framebuffer(texture_id,
                                                             camera_is_light,
                                                             ...dimensions);
    }

    draw_scene() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

        all_textures.map((tex,i) => {
            gl.activeTexture(gl.TEXTURE19+i);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.uniform1i(locations[`u_texture[${i+4}]`], i+19);
        })

        push(lights.slice(0,4),this).map((light,i) => {
            gl.uniform4fv(locations[`u_light_position[${i}]`], light.position._xyzw());
            gl.uniformMatrix4fv(locations[`u_light_matrix[${i}]`], true,
                                make_proj_matrix(light.shadow_camera.fov,light.shadow_camera.aspect,
                                                 [matrix_rotate_xz(light.shadow_camera.theta3),
                                                  matrix_rotate_yz(light.shadow_camera.theta2),
                                                  matrix_rotate_xy(light.shadow_camera.theta)].reduce(multiply),
                                                 light.shadow_camera.position));

            // Don't push the shadow stuff for the real camera, which
            // we pass in u_light_xxx[4]
            if (i == 4) return;

            // don't cast shadows when rendering a light
            if (!this.camera_is_light) {
                gl.activeTexture(gl.TEXTURE0+light.id);
                gl.bindTexture(gl.TEXTURE_2D, light.filter._texture);
                gl.uniform1i(locations[`u_texture[${i}]`], light.id);
            }
            // todo shorten this is ugly and can probably be improved
            // todo replace gl.uniformXXX([location...]) with a new function

            gl.uniform1i(locations[`u_is_light_shadow[${i}]`], light.shadow)
            
            gl.uniform1f(locations[`u_light_brightness[${i}]`], light.brightness);
        })

        if (!going_back || framecount++%200 < 10) {
            gl.uniform1f(locations.u_ambient_light, .05);
            lights[0].brightness = 1.2; // flashlight
            lights[1].brightness = 1.2;
            lights[2].brightness = 1.5; // exit light
            lights[3].brightness = 4; // gun flash light
        } else {
            gl.uniform1f(locations.u_ambient_light, 1e-4);
            lights[0].brightness = 7; // flashlight
            lights[1].brightness = 0;
            lights[2].brightness = 8; // exit light
            lights[3].brightness = 30; // gun flash light
        }
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        if (this.cull) {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(this.cull);
        }

        gl.viewport(0, 0, this.dimensions[0], this.dimensions[1]);
        objects.map(obj=> {
            if (!this.camera_is_light || !obj.gc) obj.render()
        });
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}

var framecount = 0;

function Filter(code, W, H, type, extra_code) {

    var sprite = new Sprite(lathe([5,0],4,0,1), ZERO,
                             null, false);

    var [shaderProgram, prog_locations] = createProgram(gl,
                                                              fragmentShaderHeader + `//SHADER
vec4 get_tex(int i, vec2 xy_pos) {
  return get_shader(i, (world_position.xy*.5+.5) + xy_pos/vec2(${W|0}.,${H|0}.));
}

vec4 get_tex() {
  return get_tex(0, vec2(0));
}

void main(void) {
${code}
}`);

    [this._texture, this.framebuffer] = setup_framebuffer(31,
                                                         type==gl.RG,
                                                         W, H);
    this.post_filter =  (source_texture, other_texture) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.useProgram(shaderProgram);

        gl.uniform4fv(prog_locations.u_shift_color, global_screen_color);
        
        [[source_texture, 'u_texture[0]', 30],
         [other_texture, 'u_texture[1]', 29]].map(arg => {
             if (arg[0]) {
                 gl.activeTexture(gl.TEXTURE0+arg[2]);
                 gl.bindTexture(gl.TEXTURE_2D, arg[0]);
                 gl.uniform1i(prog_locations[arg[1]], arg[2]);
             }
         });
        
        gl.uniform4fv(prog_locations.u_world_position, 
                      [0,0,0,0]);
        gl.uniformMatrix4fv(prog_locations.u_world_rotation, false,
                            IDENTITY);
        gl.uniformMatrix4fv(prog_locations['u_light_matrix[4]'], false,
                            IDENTITY);        
            

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.viewport(0,0,W, H)
        locations = prog_locations;
        sprite.render();
        return this._texture;
    }
}

// Do the slow gaussian blur over the texture because it's shorter.
var gaussian_2d = `//SHADER
vec4 the_res;
for (float i = -6.; i < 7.; i++) {
for (float j = -6.; j < 7.; j++) {
  the_res += exp(-i*i/9.-j*j/9.)*get_tex(0,vec2(j,i));
}
}
out_color = the_res/28.17;`;

function DrawToScreen$() {
    var W=gl.canvas.width, H=gl.canvas.height;

    var filters = [
        // take the bright filter
        new Filter(`//SHADER
out_color = dot(get_tex(), vec4(21, 72, 7,0)) > 100. ? get_tex() : vec4(0,0,0,1);
`, W, H, gl.RGBA),

        // downsample filter
        new Filter('out_color = get_tex();', W/4, H/4, gl.RGBA),
        
        // blur filter
        new Filter(gaussian_2d,
                   W/4, H/4, gl.RGBA),

        // upsample filter
        new Filter('out_color = get_tex();', W, H),
        
        // merge filter
        new Filter('out_color = vec4(u_shift_color.rgb + u_shift_color.w*(get_tex(1,vec2(0)) + get_tex()).rgb, 1.);',
                   W, H, gl.RGBA),
        
        // real render filter
        new Filter('out_color = get_tex();',
                   W,H, gl.RGBA)
    ];

    filters[5].framebuffer = null;

    if (GRAPHICS > 3) {
        camera.framebuffer = null;
        return range;
    }

    return source_texture => filters.reduce((prev,cur)=>
                                            cur.post_filter(prev,source_texture),
                                            source_texture)
}

function make_gl_texture(texture_id,
                      texture_types,
                         H, W, data) {
    var texture = gl.createTexture();

    gl.activeTexture(gl.TEXTURE0 + texture_id);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, texture_types?gl.RG32F:gl.RGBA32F,
                  H, W, 0,
                  texture_types?gl.RG:gl.RGBA, gl.FLOAT, data);
    return texture;
}

function setup_framebuffer(texture_id,
                           texture_types,
                           H, W) {
    var texture = make_gl_texture(texture_id, texture_types, H, W)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    var depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, H, W);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    return [texture, framebuffer];
}

var light_id = 0;
class Light {
    constructor(position, theta, theta2, is_shadow) {
        var N = 1024>>GRAPHICS;
        
        this.position = position;
        this.shadow_camera = new Camera(position, [N, N], light_id?2.5:1, true, this.id = light_id++,
                                        theta, theta2);
        this.shadow = is_shadow
        //this.shadow_camera.cull = gl.FRONT;
        this._texture = this.shadow_camera._texture;
        this.brightness = 2;

        this.filter = new Filter(gaussian_2d,
                                  N/2, N/2, gl.RG);

    }

    compute_shadowmap() {
        this.shadow_camera.position = this.position;
        gl.useProgram(program2);
        locations = locations2;

        gl.activeTexture(gl.TEXTURE0 + this.id);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);

        gl.uniform1i(locations.u_which_shadow_light, this.id);
        
        this.shadow_camera.draw_scene();
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.filter.post_filter(this._texture);
    }
}


var all_textures = [];
function make_texture(arr) {
    all_textures.push(make_gl_texture(10, 0, 256, 256, new Float32Array(arr)));
    gl.generateMipmap(gl.TEXTURE_2D);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); 
}


function setup_graphics() {
    gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("OES_texture_float_linear");

/*
var fragmentShaderSource = fragmentShaderHeader + `//SHADER

float vsm(int which_texture, vec2 texpos) {
  vec4 coded_distance = get_shader(which_texture, texpos);
  float depth_mean = coded_distance.x;

  float variance = max(coded_distance.y - depth_mean*depth_mean, 0.1);

  float dist_to_camera = distance(u_light_position[which_texture], world_position);

  return clamp(max(clamp((variance / (variance + (dist_to_camera-depth_mean)*(dist_to_camera-depth_mean))-.2)/.8, 0., 1.), 
                   smoothstep(dist_to_camera-0.02, dist_to_camera, depth_mean)), 0., 1.);
}

void main() {
  if (u_render_direct) {
    out_color = v_color;
    return;
  }

  vec3 v_normal_ = normalize(v_normal.xyz);
  float light_add;

  light_add += clamp(dot(vec3(0, 0, -1), v_normal_),0.,1.);
  light_add += clamp(dot(vec3(1, 0, .5), v_normal_),0.,1.);
  light_add += clamp(dot(vec3(-.5, -.86, .5), v_normal_),0.,1.);
  light_add += clamp(dot(vec3(-.5, .86, .5), v_normal_),0.,1.);

  light_add *= u_ambient_light*(1.-smoothstep(0.,1.,clamp(length(u_light_position[4] - world_position)/150.-.3,0.,.9)));

  for (int i = 0; i < 4; i++) {
  if (!u_is_light_shadow[i] || v_project_onto_light[i].z > 0.) {

    vec2 scaled = v_project_onto_light[i].xy/v_project_onto_light[i].w;
    float in_light_amt = u_is_light_shadow[i] ? vsm(i, scaled*.5+.5) : 1.;
    if (in_light_amt > 0.) {
      vec4 v_to_light = u_light_position[i] - world_position;
      float fade_amt = u_is_light_shadow[i] ? clamp(.9-dot(scaled, scaled), .0, .095)*10.0/.95 : 1.;
  
      float light_amt = dot(v_normal_, normalize(v_to_light.xyz))+1.;
  
      vec4 halfVector = normalize(normalize(v_to_light) + normalize(v_to_light));
      float specular = pow(abs(dot(v_normal_, halfVector.xyz)), 1e2) * .1;
      light_amt += specular;
  
      float dist_to_light = distance(u_light_position[i], world_position);
      light_amt *= u_light_brightness[i]*fade_amt*fade_amt*in_light_amt/(u_is_light_shadow[i] ?1.:sqrt(dist_to_light));

      light_add += u_ambient_light*pow(light_amt,3.);
    }
  }}
  out_color.rgb += pow(light_add,.33);

  out_color *= v_color;
  if (u_render_texture > 0) {
      out_color *= get_shader(u_texture_mux+5, u_render_texture == 1 ? world_position.xy/32. : vec2(dot(world_position.xy,vec2(sin(v_angle.x), -cos(v_angle.x))),world_position.z)/16.);
  }
  out_color.w = 1.;
}
`;
//*/
    
    [program1, locations1] = createProgram(gl, fragmentShaderHeader + program1Shader);
    [program2, locations2] = createProgram(gl, fragmentShaderHeader + `//SHADER

void main() {
    out_color.r = distance(u_light_position[u_which_shadow_light], world_position);
    out_color.g = out_color.r*out_color.r;
}
`);

    var lerp = (x,y,r) => (r= r*r*(3-2*r), x * (1-r) + y * r);
    var random_points = range(16).map(_=>range(16).map(_=>NewVector(urandom(), urandom(),0)._normalize()))

    var perlin_noise = cartesian_product_map(range(256),range(256),(y,x) => {
        y /= 16;
        x /= 16;
        var up_left = NewVector(x|0, y|0, 0)
        var out = cartesian_product_map(range(2),range(2),(dy,dx) => 
                                        random_points[y+dy&15][x+dx&15].dot(up_left.add(NewVector(dx-x,dy-y,0)))
                                       )
        out = lerp(lerp(out[0], out[1], x-up_left.x),
                   lerp(out[2], out[3], x-up_left.x),
                   y-up_left.y)
        return 2*out+.2
            
    })

    // ceil texture
    make_texture(perlin_noise.map(x=>[x,x,x,1]).flat())
    make_texture(perlin_noise.map(x=>[x,0,0,1]).flat())
    
    // Make the brick texture for the walls
    make_texture(cartesian_product_map(range(256),range(256),(y,x) => {
        if ((y%64) <= 2 || Math.abs(x-(((y/64)|0)%2)*128) <= 2) {
            return [0,0,0,1];
        } else {
            var r = .9-perlin_noise[x*256+y]/20;
            return [r,r,r,1];
        }
    }).flat())
    
    var r = cartesian_product_map(range(16),range(8),(y,x) => 
                                  [32*y, 64*(x + (y%2)/2), 1 + y%2]
                                 )
    
    make_texture(cartesian_product_map(range(256),range(256),(y,x) => {
        var tmp = r.map(p=>[p[2]*(Math.abs(p[0]-x)+Math.abs(p[1]-y)),p[2]]).sort((a,b)=>a[0]-b[0])

        if (Math.abs(tmp[0][0]-tmp[1][0]) < 4) {
            return [1,1,1,1];
        }
        return [.1,.1,.1,1];
    }).flat())

    // Noise texture
    make_texture(perlin_noise.map(x=>[x,0,0,1]).flat())    
    
}
