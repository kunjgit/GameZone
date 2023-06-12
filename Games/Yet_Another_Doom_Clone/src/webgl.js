// main.js -- the main init and game loop

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


var gl;

var map;

var objects = [];
var camera, real_camera, lights = [];

var camera_shake = 0;
var program, program1, program2;
var locations, locations1, locations2;

var keys = {};


var can_play_music = false;
var page_has_focus = true;
var end_screen = false;

/* Main game setup.
 * When the game loads, hook the keybindings and start the game loop.
 */
function main_run() {
    setup_utils()
    setup_graphics()
    setup_game()
    setup_audio();
}

function main_go() {
    
    window.onkeydown = e => {
        keys[e.key] = true;
    };
    window.onkeyup = e => {
        delete keys[e.key];
    }

    gl.canvas.onclick = _ => {
        gl.canvas.requestPointerLock();
    };

    document.onpointerlockchange = _ => {
        can_play_music = true;
        doplay();
        gl.canvas.onmousemove = (document.pointerLockElement == gl.canvas) && (e => {
            if (!player_dead) {
                // Adjust the view, but don't look too far up or down
                camera.theta += e.movementX/200;
                camera.theta2 = clamp(camera.theta2+e.movementY/200, -1.3, 1.3)
            }
        });
        gl.canvas.onmousedown = _ => {
            keys._ = true;
        }
        gl.canvas.onmouseup = _ => {
            delete keys._;
        }
    }

    reset();
    setup_map();
    fade_to([0,0,0,0])
    game_step(1);
    
}

/* Reset the level and start up a new camera.
 */
function reset() {
    hQ.style.display="block";
    qQ.style.top="5vh";
    qQ.style.left="45vw";
    hE.innerHTML=""
    
    camera = new Camera(NewVector(24, -16, 10 + (map && map.levels.length == 3)*10), [gl.canvas.width, gl.canvas.height],
                        1.22, false, 28);
    global_screen_color = [0,0,0,1]
    player_dead = 0;
    light_is_held = 0;
    going_back = 0;
    lights = [];
    objects = [];
    if (!DIFFICULTY) health = 5
    update_health(0);
    
    real_camera = new DrawToScreen$();
}

var DIFFICULTY = 0;
var GRAPHICS = 0;

class RunningAverage { // DEBUGONLY
    constructor(n) { // DEBUGONLY
        this.count = 0; // DEBUGONLY
        this.n = n; // DEBUGONLY
    } // DEBUGONLY
    update(val) { // DEBUGONLY
        this.count = this.count * (1 - 1./this.n) + val; // DEBUGONLY
        return Math.round(this.count/this.n*100)/100; // DEBUGONLY
    } // DEBUGONLY
} // DEBUGONLY

var fps = new RunningAverage(10); // DEBUGONLY
var actual_fps = new RunningAverage(10); // DEBUGONLY
var running_sprites = new RunningAverage(10); // DEBUGONLY
var running_verts = new RunningAverage(10); // DEBUGONLY
var last_now = 0;
var moved = 0;
var last_gunshot = 0;
var speed = 0;
var global_screen_color = [0,0,0,1];
var spin_speed = 0;
var player_dead = false;
var health=5;

// Have we picked up the key and are we supposed to now go back?
var going_back = false;

var gunswap = 0;
var minor_badness = 0;
var total_badness = 0;

// Are we holding the flashlight?
// If so, move it to our location
var light_is_held = false;

var frame;

/* Main game loop.
 * This is quite ugly in order to be nicely compressable, 
 * as we do all of the work right in this loop top-to-bottom.
 * (Insetad of just a simple update-render loop.)
 */
function game_step(now) {
    if (end_screen) return;
    frame = requestAnimationFrame(game_step);

    var current_pos = camera.position;

    //createImageFromTexture(gl, all_textures[1], 256, 256, "depth");

    // When the player dies, do a little animation.
    // We've already set a timeout to reset, so it'll go back to normal.
    if (player_dead) {
        var rate = ((now-player_dead)**.8 - (last_now-player_dead)**.8)/400;
        global_screen_color[3] -= .01 * (global_screen_color[3] > 0) ;

        camera.theta += rate;
        camera.theta3 += rate
        camera.theta2 -= rate/3;

        // TODO space better to assign program1 to the camera and have it call use?
        gl.useProgram(program1);
        locations = locations1;
        camera.draw_scene();
        
        real_camera(camera._texture);
        last_now = now;
        return;
    }
    var dt = Math.min(now-last_now,50)//*.1

    // Figure out how the player wants to move.
    var move_dir = [];
    for (var key in keys) {
        var godir = "sawd".indexOf(key);
        if (godir != -1) {
            speed += (speed < 1)*.1;
            move_dir.push(mat_vector_product(matrix_rotate_xy(-camera.theta-Math.PI/2*godir),Y_DIR.scalar_multiply(-dt/12)));
        }
    }

    // Matrix rotation for the forward direction
    var screen_forward_dir = multiply(matrix_rotate_xy(-camera.theta), matrix_rotate_yz(-camera.theta2))
    // Right correponds to moving along the x axis
    var screen_right_pos = mat_vector_product(screen_forward_dir, X_DIR.scalar_multiply(-3));
    // Forward corresopnds to moving along the  y axis
    var screen_forward_pos = mat_vector_product(screen_forward_dir, Y_DIR);

    // The offset of the gun on the screen
    var offset = NewVector(.2 + Math.sin(moved)*.2,
                           1,
                           -.3-Math.abs(moved%Math.PI-Math.PI/2)/20);
    
    if (keys._) {
        camera_shake += .15*(camera_shake < 1.5);
        if (now-last_gunshot > 100) {
            last_gunshot = now;
            play(sounds.gun)
            
            var hits = detect_collision_positions(camera.position,
                                                  camera.position.add(
                                                      screen_forward_pos.scalar_multiply(1e4)).add(
                                                          urandom_vector().scalar_multiply(320*camera_shake)), true);
            
            // Render the bullet somewhere between the gun and the hit
            var dist_to_hit = 100;
            if (hits.length > 0) {
                hits = hits[0]
                dist_to_hit = hits[0].distance_to(chaingun.position)
                objects.push(new LightFlash(hits[0].lerp(camera.position,0.2),
                                            3))
                range(30).map(_=> objects.push(new Hit(hits[0],2)));
                hits[1].onhit && hits[1].onhit()
            }
            objects.push(new Flash(chaingun.position, screen_forward_pos, dist_to_hit))
            objects.push(new Shell(chaingun.position, screen_right_pos));
            chaingun.recoil = NewVector(0,-.2,0);
        }
        
        camera.position = camera.position.subtract(screen_forward_pos.scalar_multiply(.1));
        speed *= .8;
    }

    // Actually move the camera if we're moving
    if (move_dir.length) {
        camera.position = camera.position.add(reduce_mean(move_dir).scalar_multiply(speed));
        moved += dt/180;
    } else {
        // Slow down in order to return to a stop
        speed -= (speed > 0)*dt/160;
        // keep it positive though
        speed *= speed>0;

        // Want to return to a resting position
        // So slowly move so that moved%Math.PI==0
        moved -= (moved%Math.PI - Math.PI*(moved%Math.PI > Math.PI/2))*dt/160;
    }

    // lava hurts you
    if (camera.position.z < 10 && map.get_floor_height(camera.position) < 0 && last_now-last_user_hit > 500) {
        user_hit(NewVector(0,0,-1e9))
    }

    // Here we check collisions with walls so we don't clip through.
    // The logic here is somewhat ugly.
    // We cast out 8 rays for 4 units in each direction
    // If a ray hits an object, then push the camera back
    // this makes sure we're exactly 4 units from the nearest wall
    range(8).map(alpha=> {
        var hits = detect_collision_positions(camera.position.subtract(Z_DIR.scalar_multiply(5)),
                                              camera.position.add(NewVector(6*Math.sin(alpha/4*Math.PI),
                                                                            6*Math.cos(alpha/4*Math.PI),
                                                                            -5)));
        // Clip direction vector for each hit
        hits.filter(x=>x[1] instanceof Wall).map(hit => {
            var obj_perp = mat_vector_product(matrix_rotate_xy(hit[1].theta), X_DIR);
            var obj_parallel = mat_vector_product(matrix_rotate_xy(hit[1].theta), Y_DIR);
            // Figure out where we are projected onto the surface we've hit
            var where = hit[1].position.add(obj_parallel.scalar_multiply(obj_parallel.dot(camera.position.subtract(hit[1].position))))
            // Project us 6 units away from that position.
            camera.position = where.add(obj_perp.scalar_multiply(
                6*(where.add(obj_perp).distance_to(current_pos) < where.distance_to(current_pos) ? 1 : -1)));
            camera.position.z = current_pos.z;
        })
    })

    // Fall or rise up or down to be at ground level
    var fall_rate = map.get_floor_height(camera.position)+10-camera.position.z;
    camera.position.z += clamp(fall_rate*dt/30,-2,3);
    // Shake the camera if we fall fast
    camera_shake = clamp(camera_shake-fall_rate*.15*(fall_rate<0)-.1, 0, 4);

    // If we've picked up the flashlight, then move it to us
    if (light_is_held) {
        lights[0].position = lights[0].position.lerp(camera.position.subtract(screen_right_pos),.2);

        // todo space make shadowcamera extend vector so I can use lerp here?
        lights[0].shadow_camera.theta += (camera.theta-lights[0].shadow_camera.theta)/2
        lights[0].shadow_camera.theta2 += (camera.theta2-lights[0].shadow_camera.theta2)/2
    }

    // save camera
    var [camera_theta, camera_theta2, camera_z, light_z] = [camera.theta, camera.theta2, camera.position.z, lights[0].position.z];

    // Do the doom-style up-and-down movement when walking
    camera.position.z += Math.cos(moved*2)*2 + (speed-1)*4;
    lights[0].position.z += light_is_held && Math.cos(moved*2)*2 + (speed-1)*4;
    camera.theta3 = Math.sin(moved)/50;

    // Spin the chaingun to make it look like it's doing something
    var spinning = keys._ ? matrix_rotate_yz(now/100) : IDENTITY;

    chaingun.position = camera.position.add(mat_vector_product(screen_forward_dir, offset.add(chaingun.recoil)).scalar_multiply(8));
    chaingun.recoil = chaingun.recoil.lerp(ZERO, .1)
    chaingun.rotation = multiply(multiply(screen_forward_dir, matrix_rotate_xy(-Math.PI/2)), spinning);
    my_body.position = camera.position.subtract(mat_vector_product(my_body.rotation=matrix_rotate_xy(-camera.theta), NewVector(0,4+light_is_held*10,5)))

    // And shake the camera
    var amt = Math.min(camera_shake,2)**2/200;
    camera.theta += (urandom())*amt;
    camera.theta2 += (urandom())*amt;
    camera.theta3 += (urandom())*amt;

    // Cast light shadows now
    lights.map(light =>
               light.dynamic_shadow && light.compute_shadowmap()
              )

    // And finally render the scene 
    gl.useProgram(program1);
    locations = locations1;
    camera.draw_scene();
    
    real_camera(camera._texture);

    if (health < 0 && !player_dead) {
        setTimeout(_ => {
            set_resolution(-1);
            health=5;
            reset();
            if (DIFFICULTY) {
                map.levels = [...map.all_levels];
            }
            map.load_level();
        },3000)
        last_now = player_dead = now;
        return;
    }
    
    // restore camera
    [camera.theta, camera.theta2, camera.position.z, lights[0].position.z] = [camera_theta, camera_theta2, camera_z, light_z];

    // todo space can cut the x.update && if all classes have an update method
    objects.map(x=>x.update && x.update(dt));

    // If we have a bunch of still objects, garbage collect them.
    // This lets us call render once to draw them all
    var still_objects = objects.filter(x=>x.still);
    if (still_objects.length > 30) {
        // garbage collect
        // todo if I need to can merge the merged objects
        objects = objects.filter(x=>!x.still || x.gc);
        still_objects = merge_sprites(still_objects.map(x=>x.sprite).filter(x=>x))
        still_objects.still = still_objects.gc = true;
        objects.push(still_objects);
    }

    // Keep track of how slow we're going
    minor_badness = minor_badness*.9 + (dt > 30)
    total_badness = total_badness*.99 + (dt > 30) + 5*(dt > 100);
    if (minor_badness > 8) {
        // If it's bad, clean up and remove the gc'd objects
        objects = objects.filter(x=>!x.gc);
    }
    if (total_badness*page_has_focus > 30 && GRAPHICS<2) {
        total_badness = 0;
        set_resolution(1);
        var fake_camera = {shadow_camera: camera};
        [fake_camera, ...lights].map((light,i)=>{
            if (i == 0 && camera.dimensions[0] > 400 ||
                i > 0 && camera.dimensions[0] > 100) {
                light.shadow_camera = new Camera(light.shadow_camera.position, light.shadow_camera.dimensions.map(x=>x/2),
                                                 light.shadow_camera.fov, light.shadow_camera.camera_is_light,
                                                 light.shadow_camera.texture_id,
                                                 light.shadow_camera.theta, light.shadow_camera.theta2);
                light._texture = light.shadow_camera._texture;
            }
        });
        camera = fake_camera.shadow_camera;
        real_camera = new DrawToScreen$();
        
    }

    objects = objects.filter(x=>!x.dead);
    
    document.getElementById("fps").innerText = "ms/frame: " + fps.update(performance.now()-now) + "\nFPS: " + actual_fps.update(1000./(now-last_now)) + "\nminor badness: " + Math.round(minor_badness*100)/100 + "\ntotal badness: "+(Math.round(total_badness*100)/100); // DEBUGONLY
    last_now = now;
}

function set_resolution(j) {
    cQ.height = (cQ.width = 1600>>((GRAPHICS=clamp(GRAPHICS+j,0,2))))/window.innerWidth*window.innerHeight;
}

function setup() {
    gl = cQ.getContext("webgl2"); // QQ
    [gl, gl.canvas, window, document, document.body].map(obj => { // QQ
        for (var k in obj) {
            try{
                obj[(k[k.length-8]||"_")+k[k.length-2]+k[3]] = obj[k]
            }catch(q){}
        };
    });
    set_resolution(1);
    global_screen_color=[0,0,0,0];
    main_run();
}

window.onload = _=>setTimeout(setup, 1)
