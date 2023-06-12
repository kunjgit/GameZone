// objects.js -- create 3d objects through lathing

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

function lathe(points, num_steps, subdivisions, has_cap, post_proc) {
    var prev = ZERO;
    points = reshape(points,2).map(x=>(prev=NewVector(0,...x).add(prev)))
    var all_points = range(num_steps).map(i=>{
        return points.map(x=>mat_vector_product(matrix_rotate_xy(2*Math.PI/num_steps*i), x));
    }).flat();
    var N = points.length;

    var faces = cartesian_product_map(range(N-1), range(num_steps),
                                      (z_step, theta_step) => 
                                      [(0+z_step+theta_step*N),
                                       (1+z_step+theta_step*N),
                                       (N+1+z_step+theta_step*N),
                                       (N+z_step+theta_step*N),
                                      ]
                                     );
    if (has_cap) {
        faces.push(range(num_steps).map(x=>x*N));
        faces.push(range(num_steps).reverse().map(x=>x*N+N-1));
    }
    all_points = all_points.map(post_proc || (x=>x));
    faces = faces.map(x=>x.map(y=>all_points[y%all_points.length]))

    return make_output_from_faces(faces);
}

function make_output_from_faces(faces) {
    var out_vertices = [];
    var out_normals = [];
    var vert_to_normal = {};

    var triangles = faces.map(face => 
                              pairs(face, (x,y) => [face[0], x, y]).slice(1)
                             ).flat(1);
    triangles.map(triangle => {
        // todo space is this called anywhere else?
        var normal = normal_to_plane(...triangle);
        triangle.map((x,i) =>
                     vert_to_normal[x.id()] = push(vert_to_normal[x.id()] || [],out_normals.length+i));
        out_vertices.push(...triangle);
        out_normals.push(normal,normal,normal);
    })

    // todo space big I can remove the mean if necessary
    out_vertices.map(vert => {
        var idxs = vert_to_normal[vert.id()]
        var idxs_normals = idxs.map(x=>out_normals[x])
        var mean_normal = reduce_mean(idxs_normals)
        if (idxs_normals.every(x=>mean_normal.dot(x) > .8)) {
            idxs.map(x=> out_normals[x] = mean_normal);
        }
    })

    
    return [out_vertices.map(x=>x._xyz()).flat(),
            out_normals.map(x=>x._xyz()).flat()]
}
