// utils.js -- a collection of short functions used throughout

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


var /* sdf */ LOCAL0, LOCAL1, LOCAL2;

// todo check which of these should be functions defined here

//var concat = (a,b) => [...a, ...(b||[])];

// todo used only once?
var pairs = (lst,fn) => lst.slice(0,-1).map((x,i)=>fn(x,lst[i+1],i))

var transpose = (mat) => mat[0].map((x,i) => mat.map(x => x[i]))

var range = (N,a) => Array(N).fill().map((_,x)=>x+(a||0));

var reshape = (A,m) => 
    range(A.length/m).map(x=>A.slice(x*m,(x+1)*m));

var urandom = _ => Math.random()*2 - 1;
var urandom_vector = _ => NewVector(urandom(),urandom(),urandom())


function uncompress(x) {
    return atob(x).split("").map(x=>x.charCodeAt(0));
}

var multiply, mat_vector_product;

var cartesian_product_map = (a,b,f) =>
    [].concat(...a.map(x=>b.map(y=>f(x,y))));

// todo should I create a sum function?
// todo uniq function that does list(set(x))?
// todo do(n,fn) function that is range(n).map(x=>x)

var normal_to_plane = (a,b,c) =>
    (a.subtract(b).cross(c.subtract(b)))._normalize();

var NewVector = (a,b,c) => new Vector(a,b,c);
var NewVectorFromList = (x) => NewVector(...x);

var reduce_add = (lst) => lst.reduce((a,b)=>a.add(b));
var reduce_mean = (lst) => reduce_add(lst).scalar_multiply(1/lst.length);

// todo make this a function on vectors
var angle_between = (a,b) => Math.atan2(a.subtract(b).x,
                                        a.subtract(b).y)


var push = (x,y) => (x.push(y), x);

var clamp = (x,low,high) => Math.min(Math.max(low, x), high)
var sum = (x) => x.reduce((a,b)=>a+b)

var matrix_rotate_yz = (theta) => 
    [1,0,0,0,
     0,Math.cos(theta), -Math.sin(theta), 0,
     0,Math.sin(theta), Math.cos(theta), 0,
     0, 0, 0, 1];

var matrix_rotate_xz = (theta) => 
    [Math.cos(theta),0,-Math.sin(theta),0,
     0, 1, 0, 0,
     Math.sin(theta),0, Math.cos(theta), 0,
     0, 0, 0, 1];

var matrix_rotate_xy = (theta) => 
    [Math.cos(theta), -Math.sin(theta), 0, 0,
     Math.sin(theta), Math.cos(theta), 0, 0,
     0, 0, 1, 0,
     0, 0, 0, 1];

var matrix_translate = (position) =>
     [1, 0, 0, position[0],
      0, 1, 0, position[1],
      0, 0, 1, position[2],
      0, 0, 0, 1];

var IDENTITY = matrix_translate([0,0,0]);

// todo space new method assign_* to do it with an assign
class Vector {
    constructor(x, y, z) {
        this.x = +x||0;
        this.y = +y||0;
        this.z = +z||0;
    };

    add(other) {
        return NewVector(this.x+other.x,
                         this.y+other.y,
                         this.z+other.z)
    }
    
    subtract(other) {
        return this.add(other.negate())
    }
    
    negate() {
        return this.scalar_multiply(-1);
    }
    
    scalar_multiply(c) {
        return NewVector(this.x * c,
                         this.y * c,
                         this.z * c)
    }

    vector_multiply(other) {
        return NewVector(this.x*other.x,
                         this.y*other.y,
                         this.z*other.z);
    }

    dot(other) {
        return this.x*other.x+this.y*other.y+this.z*other.z;
    }

    _xyz() {
        return [this.x,this.y,this.z]
    }

    _xyzw() {
        return push(this._xyz(),0);
    }

    lerp(other, frac) {
        return this.scalar_multiply(1-frac).add(other.scalar_multiply(frac));
    }

    cross(other) {
        return NewVector(this.y*other.z-this.z*other.y,
                          this.z*other.x-this.x*other.z,
                          this.x*other.y-this.y*other.x);
    }
    
    
    copy() {
        return NewVectorFromList(this._xyz());
    }

    length_squared() {
        return this.dot(this)
    }

    vector_length() {
        return this.length_squared()**.5;
    }

    distance_to(other) {
        return this.subtract(other).vector_length();
    }

    noz() {
        return NewVector(this.x,this.y,0);
    }

    _normalize() {
        return this.scalar_multiply(1.0/(this.vector_length()+1e-30))
    }

    id() {
        return ""+this._xyz().map(x=>x.toFixed(4));
    }
}

function ray_line_intersect(o, dir, p1, p2) {
    var v1 = o.subtract(p1);
    var v2 = p2.subtract(p1);
    var v3 = NewVector(-dir.y, dir.x, 0);

    p1 = (v2.x*v1.y - v2.y*v1.x) / v2.dot(v3);
    p2 = v1.dot(v3) / v2.dot(v3);

    if (p1 >= 0 && p2 >= 0 && p2 <= 1)
        return [p1,p2];
}

var ZERO = new Vector(0, 0, 0); // TODO keep it like this to stop the optimizer from inlining the class definition and making things 10x slower
var X_DIR = NewVector(1, 0, 0);
var Y_DIR = NewVector(0, 1, 0);
var Z_DIR = NewVector(0, 0, 1);

var X_AXIS = 1;
var Y_AXIS = 2;
var Z_AXIS = 4;

function merge_sprites(sprites) {
    var pos = []
    var norm = []
    var color = []
    
    sprites.map(sprite=> {
        pos.push(reshape(Array.from(sprite.a_positions),3).map(x=>mat_vector_product(sprite.rotation, NewVectorFromList(x)).add(sprite.position)._xyz()))
        norm.push(reshape(Array.from(sprite.a_normals),3).map(x=>mat_vector_product(sprite.rotation, NewVectorFromList(x))._normalize()._xyz()))
        color.push(Array.from(sprite.a_colors));
    })
    return new Sprite([pos.flat(2), norm.flat(2)], ZERO, IDENTITY, false, color.flat());
}

class Sprite {
    constructor(pos_and_normal, position, rotation, transparent, colors, texture) {
        this.a_positions = new Float32Array(pos_and_normal[0]);
        this.a_normals = new Float32Array(pos_and_normal[1]);
        this.aq_angle = new Float32Array(pos_and_normal[0].map(x=>Math.PI/2));
        this.position = position;
        this.buffers = [gl.createBuffer(),gl.createBuffer(),gl.createBuffer(),gl.createBuffer()];
        this.rotation = rotation||IDENTITY;
        this.transparent = transparent;

        colors = colors || [1,1,1]

        this.a_colors = new Float32Array(colors.length == pos_and_normal[0].length ? colors : Array(pos_and_normal[0].length/3).fill(colors).flat());

        [this._texture, this.texture_direction] = texture || [0,0];
        
        this.rebuffer();
    }

    rebuffer() {
        [this.a_positions, this.a_normals, this.a_colors, this.aq_angle].map((which, i) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[i]);
            gl.bufferData(gl.ARRAY_BUFFER, which, gl.DYNAMIC_DRAW);
        });
    }

    render() {
        if (this.transparent && locations == locations2) {
            // If we're running the shadowmapping, and this object is transparent
            // don't cast its shadow.
            return;
        }
        gl.uniform4fv(locations.u_world_position, this.position.negate()._xyzw());
        gl.uniformMatrix4fv(locations.u_world_rotation, false, this.rotation);

        [locations.a_position,
         locations.a_normal,
         locations.a_color,
         locations.a_angle].map((location,i) => {
             if (location === undefined || location === -1) {
                 return;
             }

             gl.enableVertexAttribArray(location);
             gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[i]);
             gl.vertexAttribPointer(
                 location, 3, gl.FLOAT, false, 0, 0);
         });
        gl.uniform1i(locations.u_render_texture, this.texture_direction)

        gl.uniform1i(locations.u_texture_mux, this._texture-20);
        
        gl.uniform1i(locations.u_render_direct, this.transparent);
        
        gl.drawArrays(gl.TRIANGLES, 0, this.a_positions.length/3);
    }
}

var setup_utils = () => {
    var mat_product_symbolic = B =>
        `(a,b)=>[${reshape(range(16),4).map(c=>B[0].map((_,i)=>B.reduce((s,d,j)=>`${s}+b[${d[i]}]*a[${c[j]}]`,0))).flat()}]`;

    
    multiply = eval/*HACK*/(mat_product_symbolic(reshape(range(16),4))
                           )    
    var mat_vector_product_q = eval/*HACK*/(mat_product_symbolic(reshape(range(4),1))
                                       )

    mat_vector_product = (m,x) => NewVectorFromList(mat_vector_product_q(m,x._xyzw()));
};

