// game.js -- the logic for the game objects

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


/* A hitbox that is something that can be collided with.
 * When a collision happens, it proxies the collision to the parent node.
 * This way any given node can have multiple boxes to collide with.
 */ 
class HitBox {
    constructor(parent, theta, width, height, offset) {
        if (parent instanceof Vector) { this.dead = true; this.position=ZERO; parent=this; theta=0; width=0; height=0; } // DEBUGONLY
        this.parent_obj = parent;
        this.solid = true;
        this.position = parent.position;
        this.theta = theta;
        this._width = width;
        this._height = height;
        this.parallel_dir = NewVector(-Math.sin(this.theta)*this._width,
                                      Math.cos(this.theta)*this._width,
                                      0)
        this.offset = offset || 0;
    }
    update() {
        this.position = this.parent_obj.position.add(Z_DIR.scalar_multiply(this.offset));
        this.dead = this.parent_obj.dead;
    }
    render() {}
    onhit(other) {
        return this.parent_obj.onhit(other);
    }
}

/* A wall is just a hitbox with a null parent.
 */ 
class Wall extends HitBox {
    constructor(position, theta, width, height) {
        if (height < 0) {
            height = -height;
            position.z -= height;
        }
        
        super({position: position,
               onhit: _=>{}}, theta, width, height);
    }
}

/* This is a locked door that needs a key.
 * Finding the key removes this door.
 */ 
class LockedDoor extends Wall {
    constructor(position, theta) {
        super(position, theta, 32, 30);
        this.uid = theta;

        this.sprite = theta == Math.PI/2 ? new Sprite(makecube(NewVector(1,64,40)),
                                              this.position,
                                              matrix_rotate_xy(theta),
                                              null, [1,1,1], [21,2])
            :
            merge_sprites(range(20).map(off=>new Sprite(make_cylinder(NewVector(1,1,40)),
                                                        position.add(mat_vector_product(matrix_rotate_xy(theta),
                                                                                        NewVector(0,off*4-40,0))),
                                                        matrix_rotate_xz(Math.PI/2),
                                                        1, pallet[theta*8/Math.PI])))

    }

    render() {
        this.sprite.render();
    }
}

/* Objects that respect physics: they have velocity and fall.
 * Also, when colliding with walls or floors, bounce off them.
 */ 
class PhysicsObject {
    constructor(sprite, position, velocity, ghost) {
        this.sprite = sprite;
        this.position = position;
        this.velocity = velocity;
        this.ghost = ghost;
        this.still = undefined;
        this.dead = undefined;
        this.dz = .003;
        this.slow = .999;
        this.floor_cache = {};
    }

    update(dt) {
        if (this.still) return true;
        this.velocity.z -= this.dz*dt;

        this.velocity = this.velocity.scalar_multiply(this.slow**dt);
        this.position = this.position.add(this.velocity.scalar_multiply(dt/16));

        var floor = map.get_floor_height(this.position, this.floor_cache)+.5;
        if (!this.ghost) {
            if (this.position.z < floor) {
                this.still = this.velocity.vector_length() < .1;
                this.position.z = floor;
                this.velocity.z = -this.velocity.z;
                this.velocity = this.velocity.scalar_multiply(.8);
            }
            var hits = detect_collision_positions(this.position, this.position.add(this.velocity.scalar_multiply(2)));

            hits.map(x=> {
                this.onhit && this.onhit(x[1]);
                x[1].onhit && x[1].onhit(this);
                var delta = x[0].subtract(this.position);
                // more correct would be to actually bounce off the right angle
                // but this is good enough if most walls are vertical or horizontal
                this.velocity.y *= (Math.abs(delta.y) > .1) ? -1 : 1;
                this.velocity.x *= (Math.abs(delta.x) > .1) ? -1 : 1;
                this.position = this.position.lerp(x[0], 1.3)
            });
        } else {
            if (this.position.z < floor) {
                this.die && this.die();
                this.dead = true;
            }
        }
    }

    render() {
        this.sprite.position = this.position;
        this.sprite.render();
    }
}

/* Part of an enemy that has exploded and will spin until it dies.
 */ 
class BodyPart extends PhysicsObject {
    constructor(sprite, position, velocity) {
        super(sprite, position, velocity)
        this.spins = urandom_vector();
    }

    update(dt) {
        if (super.update(dt)) return;

        var speed = dt * this.velocity.vector_length() * .005;

        // TODO space make a function for doing this rotation-by-three
        this.sprite.rotation = multiply(this.sprite.rotation,
                                        [matrix_rotate_xy(this.spins.x*speed),
                                         matrix_rotate_yz(this.spins.y*speed),
                                         matrix_rotate_xz(this.spins.z*speed)].reduce(multiply));
        
    }
}

/* An enemy bullet flies straight until it hits something.
 */ 
class EnemyBullet extends PhysicsObject {
    constructor(position, direction) {
        position = position.add(direction);
        super(new Sprite(enemy_bullet, position,
                         matrix_rotate_xy(Math.atan2(direction.y,direction.x)), 1,
                         [5,0,0], [22,1]),
              position, direction);
        this.dz = 0;
        this.slow = 1;
        this.start = last_now
    }

    update(dt) {
        super.update(dt);
        if (this.position.distance_to(camera.position) < 5) {
            user_hit(this.position);
            this.dead = true;
        }
        this.dead |= last_now-this.start > 10000;
    }
    
    onhit() {
        range(30).map(_=> objects.push(new Hit(this.position,2)));
        this.dead = true;
    }
}

/* An enemy is the main opponent for the game.
 * They are a simple finite state machine that will either
 * pace back and forth until they see the player, and then will
 * forever after try to follow them and attack.
 */
var killed_enemies = 0;
class BaseEnemy {
    constructor(position, theta, height, size) {
        this.position = position.add(Z_DIR.scalar_multiply(5));

        this.theta = theta||0;
        //this.hp = 10;
        this.floor_cache = {};
        this.state = 0;
        this.timer = 0;
        this._height = height;

        objects.push(new HitBox(this, 0, size, size*2, -height));
        objects.push(new HitBox(this, Math.PI/2, size, size*2, -height));

        this.patrol = undefined;
        this.waypoint = position
        this.attacking = 0;
        this.time = urandom()*100;
        this.spin_rate = .1
        this.speedinv = 50
        this.grounded = 0
        this.dead = undefined;
    }

    gethelp() {
        objects.map(x=> {
            if (x instanceof BaseEnemy) {
                if (x.position.distance_to(this.position) < 100 &&
                    !detect_collision_positions(x.position,
                                                this.position,
                                                false, true).length) {
                    x.attacking = x.state = 1;
                }
            }
        })
    }
    
    /* Explode when hit by a bullet from the user
     */
    onhit(other) {
        if (other) return;
        this.dead = true;
        if (killed_enemies++%(5+DIFFICULTY*2) == 0) {
            objects.push(new Health(this.position.noz().add(Z_DIR.scalar_multiply(map.get_floor_height(this.position, this.floor_cache)))))
        }
        

        range(30).map(_=> objects.push(new Hit(this.position,4)));

        this.gethelp()
        
        play(sounds.boom)
        
        this.components.map(x=> {
            objects.push(new BodyPart(x,
                                      this.position.add(x.position),
                                      mat_vector_product(matrix_rotate_xy(-camera.theta),
                                                         NewVector(urandom(),
                                                                   3+urandom(),
                                                                   1+Math.random()))));
        })
    }
    
    /* Logic to move around through a simple state machine.
     * State list:
     * 0: move towards the target location
     * 1: attack the enemy by either moving towards them or shooting
     * 2: nop
     * 3: shoot at the player
     */
    update(dt) {
        this.patrol = this.patrol || [detect_collision_positions(
            this.position,
            this.position.add(mat_vector_product(matrix_rotate_xy(this.theta),NewVector(1e5,0,0))), 0, 1)[0][0].subtract(
                mat_vector_product(matrix_rotate_xy(this.theta),NewVector(5,0,0))),
                                      this.position];
        var angle_to_me = -angle_between(this.position, camera.position);
        var r = Math.random() < 1/dt;

        // Look to see if I'm visible
        if (r && !this.attacking &&
            (Math.abs(angle_to_me-this.theta-Math.PI/2) < Math.PI/3 ||
             Math.abs(angle_to_me-this.theta-Math.PI/2) > 2*Math.PI-Math.PI/3) &&
            !detect_collision_positions(camera.position,
                                        this.position,
                                        false, true).length) {
            this.gethelp();
            this.attacking = this.state = 1;
        }

        if (this.state == 0) { // GOTO
            // WONTFIX clips through the corner of walls
            // Run the detection for x, x+width and x-width
            var next_pos = this.position.add(NewVector(Math.cos(this.theta)*dt/this.speedinv,
                                                       Math.sin(this.theta)*dt/this.speedinv,
                                                       0))

            var next_height = map.get_floor_height(next_pos, this.floor_cache);

            // If I can't go forward, pick a new random direction to walk in.
            var is_close = camera.position.subtract(this.position).vector_length() < 10
                && next_pos.distance_to(camera.position) < this.position.distance_to(camera.position);
            is_close && user_hit(this.position);

            if (detect_collision_positions(this.position, this.waypoint, false, true).length > 0
                || is_close
                || (Math.abs(next_height - this.position.z + this._height) > 5+this.grounded)) {

                this.waypoint = this.position.add(urandom_vector().scalar_multiply(20).noz());
                this.theta = Math.PI*urandom();
                //console.log("Pick new direction");
                this.state += (Math.random() < .1)
                return;
            }

            var delta_pos = this.waypoint.subtract(this.position).noz();
            var goal_angle = Math.atan2(delta_pos.y, delta_pos.x);

            // They sometimes spin in place.
            while (goal_angle - this.theta > Math.PI) this.theta += Math.PI*2;
            while (this.theta - goal_angle > Math.PI) this.theta -= Math.PI*2;
            
            // Face towards the waypoint
            this.theta += (goal_angle-this.theta)*this.spin_rate;

            // Move towards the waypoint
            this.position = next_pos;
            this.position.z = next_height*(this.grounded<10)+this._height;
            // If they go fast or spin slowly, then it's hard to reach the target exactly
            if (delta_pos.vector_length() < 30/this.spin_rate/this.speedinv) {
                if (this.attacking) {
                    this.state = 1;
                } else {
                    this.patrol.unshift(this.waypoint = this.patrol.pop());
                }
            }
        }

        if (this.state == 1) { // ATTACK
            var delta_pos = camera.position.subtract(this.position)._normalize();
            
            this.waypoint = this.position.add(delta_pos.scalar_multiply(10));
            if (Math.random() < .1 && !this.grounded) {
                objects.push(new EnemyBullet(this.position.add(Z_DIR.scalar_multiply(5)),
                                             camera.position.subtract(this.position.add(Z_DIR.scalar_multiply(8)))._normalize().scalar_multiply(2+DIFFICULTY)));
            } else {
                this.state = 0;
            }
        }
    }
    render(inner_multiply, outer_divide, N, which_rot) {
        this.sprites.map((x,i)=>x.rotation = multiply(matrix_rotate_xy(this.theta+Math.PI/2),
                                                      which_rot(Math.sin(inner_multiply[i]*this.time)/outer_divide[i])));
        this.sprites.map((x,i)=>x.position = this.position.add(Z_DIR.scalar_multiply(Math.cos(this.time*2)/3 + (i > N)*5)));
        this.sprites.map(x=>x.render());
    }
}

class Enemy extends BaseEnemy {
    constructor(position, theta) {
        super(position, theta, 5, 6);
        this.components = [
            [[2,3,5], [1.5,0,-5]], // leg1
            [[2,3,5], [-1.5,0,-5]], // leg2
            [[1.5,2,5], [-3.25,0,-5]], // arm1
            [[1.5,2,5], [3.25,0,-5]], // arm2
            [[5,2,5], [0,-.5,0], [.8,.8,.8]],
            [[4,5,4], [0,0,5], [.8, 0, 0]], // head
            [[.5,1.25,.5], [1,-2,7],  [5,0,0]], // eye
            [[.5,1.25,.5], [-1,-2,7], [5,0,0]], // eye
            [[5,1,5], [0,1,0], [.4, .4, .4]] // back
        ].map(x=>
              new Sprite(makecube(NewVectorFromList(x[0])),
                         NewVectorFromList(x[1]), null, false, x[2]))
        this.sprites = [merge_sprites(this.components.slice(4)),
                        ...this.components.slice(0,4).map(x=>merge_sprites([x])),
                       ]
        
    }
    update(dt) {
        super.update(dt);
        if (this.time < 100 && DIFFICULTY) {
            this.time += 100
            objects.push(new FlyingEnemy(this.position, this.theta))
        }
        this.time += dt/160;
    }

    /* Render and animate the sprite. 
     * Keep track of the current time and rotate the objects at a given rate.
     */
    render() {
        super.render([0, 1, -1, 1, -1], [1, 1, 1, 2, 2], 2, matrix_rotate_yz)
    }
}

/* Enemies that fly. They're just enemies on the ground except
 * (1) their position isn't offset from the ground and
 * (2) they turn slower and so look like they have momentum.
 */
class FlyingEnemy extends BaseEnemy {
    constructor(position, theta) {
        super(position.copy(), theta, 8, 6);
        this.components = this.sprites = [
            new Sprite(makecube_fn(x=>x.vector_multiply(NewVector(3,(.7-x.x)*3,.1)).subtract(X_DIR.scalar_multiply(1.5))),
                       ZERO, 0, 0, [.3, .3, .3]),
            new Sprite(makecube_fn(x=>mat_vector_product(matrix_rotate_xy(Math.PI), x.vector_multiply(NewVector(3,(.7-x.x)*3,.1)).subtract(X_DIR.scalar_multiply(1.5)))),
                       ZERO, 0, 0, [.3, .3, .3]),
            new Sprite(makecube(NewVector(.8,3,.4)),
                       ZERO, 0, 0, [.3, .3, .3]),
            new Sprite(makecube_fn(x=>x.vector_multiply(NewVector(.2,3.3,.2)).add(NewVector(0,0,.1))),
                       ZERO, 0, 1, [8,0,0]),

        ];
        this.height_offset = 5*urandom();
        this.spin_rate = .1;
        this.speedinv = 20
        this.grounded = 50
    }
    update(dt) {
        super.update(dt);
        if (this.floor_cache.o) this._height += .1*((this.floor_cache.o.floor_height + this.floor_cache.o.ceil_height)/2 + this.height_offset - this._height);
        var deltaz1 = Math.sin(this.time/5)*2 + Math.sin(this.time);
        this.time += dt*(2+Math.sin(this.time))/200;
        var deltaz2 = Math.sin(this.time/5)*2 + Math.sin(this.time);
        this.position.z += deltaz2- deltaz1;
        var alpha = 1-1.01**(-camera.position.subtract(this.position).noz().length_squared());
        
        this.position.z = this.position.z*alpha + (camera.position.z-10)*(1-alpha)
    }
    render() {
        super.render([1, -1, 0, 0], [1, 1, 1, 1], 9, matrix_rotate_xz)
    }
}

/*
 * Detect collisions with any objects between two points.
 * Normally only detects collisions for objects that are flat.
 * To do this, check line intersections in the direction with anything solid.
 * Optionally also detect collisions with floors and ceilings.
 * 
 * Returns [[position, object], ...]
 */
function detect_collision_positions(pos, them, do_floors, only_walls) {
    var delta = them.subtract(pos).noz()
    var len = delta.vector_length();
    
    return objects.map(x=> {
        // Optimize away when it's too far to possibly hit.
        if (!x.solid
            || (only_walls && !(x instanceof Wall))
            || len + x._width*2 <
            ((x.position.x-pos.x)**2+(x.position.y-pos.y)**2)**.5
           )
            return;
        // If there's a chance for a hit, figure out how far out it is
        var dist_to_and_along = ray_line_intersect(pos, delta, x.position.add(x.parallel_dir), x.position.subtract(x.parallel_dir));
        // Make sure (1) it's between [pos, them], and (2) it's at the right height
        if (dist_to_and_along && dist_to_and_along[0] <= 1 &&
            (x.position.z < pos.lerp(them, dist_to_and_along[0]).z &&
             pos.lerp(them, dist_to_and_along[0]).z < x.position.z+x._height)
            && (!do_floors || !(x instanceof LockedDoor) || x.uid == Math.PI/2 || dist_to_and_along[1]%.05 < .02)
           ) {
            return [pos.lerp(them, dist_to_and_along[0]), x];
        }
    }).concat(map.regions.map(region=> {
        if (!do_floors) return;
        var hit_pos;
        if (them.z < region.ceil_height) {
            hit_pos = pos.lerp(them,(region.floor_height-pos.z)/(them.z-pos.z))
        }
        if (region.ceil_height < them.z) {
            hit_pos = pos.lerp(them,(region.ceil_height-pos.z)/(them.z-pos.z))                
        }
        if (hit_pos && map.get_region_at(hit_pos) == region) {
            return [hit_pos, {}];
        }
    })).filter(x=>x).sort((x,y)=>x[0].distance_to(pos)-y[0].distance_to(pos));
}


/* Flash a light by the gun for a few frames, then go away.
 */
class Flash {
    constructor(pos, forward, dist) {
        this.sprite = new Sprite(sphere(5),
                                 pos.add(NewVector(0, 0, -1.5))
                                 .add(forward.scalar_multiply(2)),
                                 0, 1,
                                 [10,10,10]);

        this.dead = undefined;
        this.c = 0;
    }

    render() {
        this.sprite.render();
        //this.sprite2.render();
        this.dead = (this.c++ > 2);
    }
}

// TODO space make this a setTimeout also?
/* Put a light at the collision position for a few frames.
 */
class LightFlash {
    constructor(pos, c) {
        this.dead = undefined;
        this.c = c;
        lights[3].position = pos.copy();
    }

    render() {
        if (!this.c--) {
            lights[3].position.z = 1e9;
            this.dead = true;
        }
    }
}

/* Sprite for sparks after a collision.
 * To be efficient create a cache where we store past sprites.
 */
var hit_sprite_pool = [];
class Hit extends PhysicsObject {
    constructor(position, r) {
        var x = Math.random()*.8;
        var sprite = hit_sprite_pool.pop() ||
            new Sprite(explosion,
                       position.add(urandom_vector().scalar_multiply(r)),
                       0, 1,
                       [10*Math.cos(x),10*Math.sin(x),0])
        super(sprite,
              position, new Vector(urandom()/2, urandom()/2, (1.5+urandom())),
              true);
        this.dz = .01;
    }
    die() {
        // Put it off-screen so when we pop from the cache it doesn't
        // flicker for one frame in its old position
        this.sprite.position.z = 1e5
        hit_sprite_pool.push(this.sprite);
    }
}

class Shell extends BodyPart {
    constructor(position, right) {
        super(new Sprite(shell, position,
                         multiply(chaingun.rotation,
                                  matrix_rotate_xz(Math.PI/2)), 0,
                         [.4, .4, .4]),
              position, NewVector(urandom(), urandom(), 3.5+urandom()/2).subtract(right).scalar_multiply(.2));
    }
}

/* We can pick up collectable object by walking close to them.
 */
class Collectable {
    constructor(position, sprite) {
        this.sprite = sprite
        this.sprite.position = (this.position = position.add(Z_DIR.scalar_multiply(2))).copy();
        //if (this.position.z < -50) sdf;
        this.dead = undefined;
        this.time = 0;
        this.collect_dist = 10
    }

    collect() {
        play(sounds.collect)
        setTimeout(() => play(sounds.collect2), 150)
    }

    update(dt) {
        if (this.position.noz().distance_to(camera.position.noz()) < this.collect_dist*(1+going_back/2)) {
            this.collect()
            this.dead = true;
        }
    }
    
    render() {
        this.sprite.render()
    }
}

/* Give the user health back when picked up.
 */
class Health extends Collectable {
    constructor(position) {
        var sprite = lathe([.5,-.5,
                            .6,.5,
                            .3,.5,
                            .3,.8,
                            0, .5,
                            -.2, .3,
                            -.3, .3,
                            -.4, .3,
                            -.3, .3,
                            -.1, .3,
                            0, .5,
                            -.2, .8],
                           16, 0, true)
        super(position, new Sprite(sprite, null, IDENTITY,
                                   false,
                                   [.1,.1,1]));
    }
    
    collect() {
        super.collect()
        update_health(1)
        fade_to([0,0,1,.5])
    }
}

/* Give the user the flashlight when picked up.
 */
class Flashlight extends Collectable {
    constructor(position, theta) {
        position = position.add(NewVector(4,0,0))
        var sprite = lathe([.9, 0,
                            .1, .1,
                            0, 4,
                            .5, 1,
                            0, 1,
                            -.1, 0,
                            -.4, -1],
                           32, 0, true)
        
        var rot = multiply(
            matrix_rotate_xy(-theta),
            matrix_rotate_yz(-1.4));
        super(position,
              [new Sprite(sprite, null, rot,
                          false,
                          [.4,.4,.4]),
               new Sprite(sphere(2),
                          null,
                          0, 1,
                          [5,5,5])])
        this.collect_dist = 15;
        this.sprite[1].position = (this.sprite[0].position=this.position).add(mat_vector_product(rot, Z_DIR.scalar_multiply(5.8)))
        lights[0].position = position.add(mat_vector_product(rot, Z_DIR.scalar_multiply(8)));
        lights[0].shadow_camera.theta = theta
    }
    

    collect() {
        super.collect()
        fade_to([.4,.4,.4,1])
        light_is_held = true;
    }

    render() {
        this.sprite.map(x=>x.render())
    }
}

var pallet = [[.47, .74, .6],
              [.12, .4, .6],
              [.95, .85, .35],
              [.95, .33, .22],
              [0,1,0]];

/* Reach the end goal before saying we need to get back
 */
class Goal extends Collectable {
    constructor(position, rotation) {
        var color = pallet[rotation*8/Math.PI]
        var sprite = rotation == Math.PI/2 ? new Sprite(lathe([0, 0,
                                                       2, 2,
                                                       0, .1,
                                                       -1, .6,
                                                      ],
                                                      8, 0, true), position, IDENTITY,
                                                        true,
                                                        color)
            :
            sprite = merge_sprites([
                new Sprite(lathe([1.3,0,
                                  .8,0,
                                  0,.8,
                                  -.8,0,
                                  0,-.8],
                                 16, 0, false),
                           NewVector(-3,0,0), matrix_rotate_yz(Math.PI/2),
                           true,
                           color),
                new Sprite(make_cylinder(NewVector(.6,.6,9)),
                           NewVector(-1,0,0), null, false, color),
                new Sprite(makecube(NewVector(2,1,1.5)),
                           NewVector(6,0,-1.5), null, false, color),
                new Sprite(makecube(NewVector(.6,1,.5)),
                           NewVector(5.25,0,-2), null, false, color),
                new Sprite(makecube(NewVector(.6,1,.5)),
                           NewVector(6.75,0,-2), null, false, color),
                
            ]);
        sprite.rotation = matrix_rotate_xy(rotation);
        position.z += 6*(map.levels.length == 1 && !color[4])

        super(position,
              sprite
             );
        this.collect_dist = 15;
        this.uid = rotation;
    }

    update(dt) {
        super.update(dt);
        this.sprite.rotation = multiply(matrix_rotate_xy(dt/400),this.sprite.rotation);
        this.sprite.position.z = this.position.z + Math.sin(this.time += dt/300)*4 + 4;
    }
    
    collect() {
        var exitdoors = objects.filter(x=>x instanceof LockedDoor && this.uid == x.uid)
        exitdoors[0].parent_obj.dead = true;

        // The last door is the final exit.
        // Open the passage way to the next level.
        if (this.uid == Math.PI/2) {
            play(sounds.clock)
            fade_to([1,1,1,1])
            objects.push(new RealDoor(exitdoors[0].position.subtract(NewVector(0,40,-10))));
            map.put_objects(map.remake.filter(obj=>BaseEnemy.isPrototypeOf(obj[1]) || obj[1] == ManyEnemies), objects)
            objects.map(x=>x.attacking = 1)
            going_back = true;
            music_timeouts.map(clearTimeout);
            music_timeouts=[];
        } else {
            super.collect();
            fade_to([0,.5,0,.5]);
        }
    }
}

class RealDoor extends Collectable {
    constructor(position) {
        super(position.subtract(Z_DIR.scalar_multiply(20)),
              new Sprite(makecube(NewVector(1,40,40)),
                         position,
                         matrix_rotate_xy(Math.PI/2),
                         1, [10,10,10])
             )
        lights[2].position = position.add(NewVector(0,-20,0));
        lights[2].shadow_camera.theta = 0;
        lights[2].shadow = true;
        this.count = 0;
    }
    update(dt) {
        super.update(dt);
        if ((this.count+=dt) > 200 && !this.w) {
            this.w=1;
            var orig = objects;
            objects = objects.filter(x=>x.q); // keep only the walls
            lights[2].compute_shadowmap()
            objects = orig;
        }
    }
    collect() {
        fade_to([1,1,1,1])
        if (map.levels.length>1) {
            keys = {}
            setTimeout(_=>{
                set_resolution(-1);
                reset();
                map.levels.shift();
                map.load_level();
            }, 200)
        } else {
            hQ.style.display="none";
            qQ.style.top="40vh";
            setTimeout(_ => {
                end_screen = true;
                document.exitPointerLock()
                global_screen_color = [1,1,1,0];
                cancelAnimationFrame(frame);
                hE.innerHTML=`You got back in ${last_now/60000|0}m ${last_now/1000%60|0}s.<br><br>`
                if (DIFFICULTY) {
                    setTimeout(_=>hE.innerHTML+="Congratulations.<br><br>Developer Par: 9m 00s<br><br>Reload to play again.",2000);
                    DIFFICULTY=1;
                } else {
                    setTimeout(_=>hE.innerHTML+="Get ready for hard difficulty.",2000);
                    DIFFICULTY=1;
                    setTimeout(_=>{
                        global_screen_color = [0,0,0,1];
                        end_screen=false;
                        health=5;
                        reset();
                        map.levels = [...map.all_levels];
                        map.load_level();
                        requestAnimationFrame(game_step);
                    },5000)
                }
            }, 200)
                       
        }
         
    }
}

var last_user_hit = 0;
function update_health(amt) {
    hW.style.width=(health=Math.min(health+amt,9))+1+"vw";
    hW.className="b"[health>2|0]
}
function user_hit(where) {
    if (last_now-last_user_hit > 450-DIFFICULTY*200) {
        play(sounds.hit)
        last_user_hit = last_now;
        objects.push(new LightFlash(where));
        range(15).map(_=> objects.push(new Hit(where,4)));
        camera_shake++;
        fade_to([.3,0,0,.7]);
        update_health(-1)
    }
}

/* Fade the screen to a given color for effect.
 */
var last_fades= [];
function fade_to(color) {
    global_screen_color = color.map(x=>x)
    last_fades.map(clearTimeout);
    last_fades = range(20).map(i=>
                   ((r) =>
                    setTimeout(_ => global_screen_color = [color[0]*r,color[1]*r,color[2]*r,color[3]*r + (1-r)],
                               (1-r)*400+200)
                   )(i/20)
                 )
}

// Better would be to rewrite the object code. Just add bytes to add enemies.
function ManyEnemies(position, count) {
    range(DIFFICULTY*5+5+count*Math.PI|0).map(_=> objects.push(new ([Enemy,FlyingEnemy][_%2])(position.add(urandom_vector().noz().scalar_multiply(20)),
                                                  urandom()*10)));
    return {render: range, dead:1}
}

var make_cylinder = dims => lathe([1, 0,
                                   0, .001,
                                   0, 1,
                                   0, .001,
                                  ], 32, 0, true,
                                  x => (mat_vector_product(matrix_rotate_xz(-Math.PI/2),x.vector_multiply(dims))));
var makecube_fn = fn => lathe([.71, 0,
                                  0, 1], 4, 0, true,
                                 x => fn(mat_vector_product(matrix_rotate_xy(-Math.PI/4),x)));

var makecube = dims => makecube_fn(x=> x.vector_multiply(dims));

var all_objects = [
    /*0*/null, null,
    /*2*/Enemy, FlyingEnemy,
    /*4*/Health, Goal,
    /*6*/LockedDoor, Flashlight,
    /*8*/null, ManyEnemies]

var explosion;
var sphere;
var shell;
var enemy_bullet;
var my_body;
function setup_game() {
    sphere = m => lathe([0, -.5,
                             .35, .15,
                             .15, .35,
                             -.15, .35,
                             -.35, .15,
                            ].map(x=>x*m),
                            8, 0, false)
    explosion = sphere(1)

    shell = lathe([.5, 0,
                   0, .05,
                   -.1, 0,
                   0, .01,
                   0, 1.5,
                   0, .01,
                   -.05, 0,
                   0, -1.4
                  ],
                  8, 0, true);

    enemy_bullet = lathe([.2, 0,
                          .2, 2,
                          .4, 1,
                          .4, .4,
                          0, .6,
                          -.4, .4,
                          -.4, .2]
                        , 32, 0, true,
                         x => mat_vector_product(matrix_rotate_xz(-Math.PI/2),x));

    
    [2,5,6].map(x=>
                chaingun.push(new Sprite(make_cylinder(NewVector(1.8,1.8,.5)),
                                         NewVector(x,0,0),
                                         null, false, [.7, .7, .7])));
    
    range(8).map(x=> {
        chaingun.push(new Sprite(make_cylinder(NewVector(.5,.5,8.5)),
                                 mat_vector_product(matrix_rotate_yz(x*Math.PI/4),Y_DIR), null, false))
    });
    
    chaingun = merge_sprites(chaingun)
    chaingun.recoil = ZERO;
}
