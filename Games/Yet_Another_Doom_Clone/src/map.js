// map.js -- store, uncompress, and load the game maps

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


/* The map is represented as a collection of n-sided non-convex polygons.
 * When two polygons share a complete edge then it is possible to move
 * from one polygonal map region to the other. 
 * Otherwise, there is a wall between them.
 *
 * Maps are stored compressed with a turtle-graphics like program,
 * implemented and documented below.
 */
class Map {
    constructor() {
        this.levels = [
            // Level 1
            "rgt413aHp9UFRwdXm2S6cGajdGc0csIDhMeKwQUngnOne8qtCa19bVwnkHBQZ2LYdcSzFERiVTdZmLd7N3NWfFtGTMrYttSyYil4xasKMDBwscKcTWx9vGJ5cMQDUslqsQiEm3iHe2d4RwnLt8RGZ3YXeGfCjgNz13uQB3OHdqd+RnbPkq0DeDd2ZZ10246xA7d7Nw==",

            // Level 2, lava
            "ISyRA4qoQGbRdGKrcGV7co0JrseGo4VBdwd3rAOEx4rBBSeCg4eLzAVL26uTRWYjcmQ2cGR6cMGMsgmu445716NQFAfEkQNKKJNiO37CCKSqvG45FHKzwqoC2ihlhnRpknDIjbQIGyc2Y7LEjIzEkQVUVVyquGdDdMONA7CMS2PScJEEo4mXPMEEV6PjTAWMjJNzYMcES2Vikw==",
            
            // jump down level
            "IcCVBWJhZ21sZqd0ZTRxZzpykbMVemdseVdemunnhCVUpppIyYWBcTYzZNxwzK4DB3nnYlF0Ytd8Yt1wkQMHeedmbXFjnnCRAwd555EDB3nnkbQIiIe16RsYJUPEkQcFYZJ2o56NYyV0wgM1bZdldXRkRHDBgIuqA4FHbcGnA6ehF2KJcGKWcJGwBWJAxa6ewpAEKRJT52J9cMGRsQWbKnw2cGK2cMGRA7iOJpG1BzyNq5B1l4LBlgNXeZdjfXBiKHBkTXAh7iGHA6ZUSA==",
            
            // First real keys level
            "Ia2OA7S3KmIKcAMsxsBk23DCjQPCRxtm63JlbXJifXCRBdO0KCpJjQdzoZS7uigqwpEFt1RDB7tmc3TBkKwDhMeKjLIGyLleC8BUwpGqECira1tLGorks6q6pEYThIDEkA1K59bJdCUYZkGzRyrOYppwwrQFMcHZfTtpUXDCAlU3ZalxZLpwy7EGoOXcPgklwZED5ZkKwQShkkk+aUJ1wQOlEklkenDCkasF2p44UzVmpXFlx3Bm6HPCA7aKJ2WWdNuLsQatKwcywOZnWXVmp3BpPnDCmAO8OjRip3BipXBl1HPThqwFJ4KDh4vQrQdsm6eVVlaD",

            // Mid level
            "IQQhZ5MCkqlmfXFlWnJm2HRnV3JkPHCLqwWZbFojhMKzC325p6aUclB3B3dsYo5wwawDhMeKwQUngoOHi8yasQNamIRlenRiVnhirHBiqHBjm3CMsAVqjOdgNmLbcGXtcQ64tMyOXhwbqdPhgHBABM2SrQOOh2CMsQTZfThlwQVLN5zTocK0CgcoNidxx6WnqchiSXjCqgNHdadjZnxiLXBjTXCNA0d1p40DR3WnjQNHdafPlQYbToy3YcNmHnLCBDeb5XO0CHvL6eWQRSQXaepw",
        ]
        this.all_levels=[...this.levels]
    }

    put_objects(which_objects,where) {
        which_objects.map(([a,b,c,d,e,f])=> {
            (where||a).push(new b(c.add(NewVector(0,0,this.get_floor_height(c.add(NewVector(2,2,0))))),d,e,f))
        });
    }
    
    /* Load the next map to play.
     * 
     */
    load_level() {
        var code = this.levels[0]; // DEBUGONLY
        if (!turtledisplay) {  // DEBUGONLY
            turtledisplay = new TurtleDisplay(this, uncompress(code));  // DEBUGONLY
        } // DEBUGONLY
        light_id = 0;
        objects = [];
        lights = range(4).map(_=>(new Light(NewVector(0,0,1e3), 0, 0)));
        lights[0].shadow = lights[0].dynamic_shadow = true;
        
        var objs_list = []; // DEBUGONLY
        [this.regions, this.remake] = run_turtle(uncompress(this.levels[0])
                                  , objs_list // DEBUGONLY
                                                );
        map.put_objects(this.remake)

        var to_render = range(32).map(_=>[[],[]]);

        var potential_walls = {};

        var angle;
        
        var add_and_reverse = (texture, coords) => {
            to_render[texture][0].push(range(6*(coords.length-2)).map(_=>[angle,0,0])); // angle
            to_render[texture][1].push(coords, [...coords].reverse()) // face
        }
        
        // For each potental wall, get the left and right side ceil and floor heights.
        this.regions.map(region => {
            region.lines.map(key => {
                key = key.map(p=>[p.x,p.y]).sort();
                potential_walls[key] = push(potential_walls[key] || [],[region.floor_height, region.ceil_height]);
            })

            // (Also add the floor and ceiling)
            // 22 is floor texture
            add_and_reverse(region.floor_height < 0 ? 20 : 22, region.vertices.map(p=>NewVector(p.x,p.y,region.floor_height)));
            // 21 is ceil texture TODOFIX
            add_and_reverse(21, region.vertices.map(p=>NewVector(p.x,p.y,region.ceil_height)));
                                                                      
        });

        // Now, add walls where the ceiling and floor heights are different.
        Object.keys(potential_walls).map(coord => {
            var [a,b,c,d] = coord.split(",").map(Number);
            var heights = transpose(potential_walls[coord]);

            // Heights is of the form [[floor1, floor2], [ceiling1, ceiling2]]
            // Here we draw the vertical walls
            // If we have it of the form [[floor], [ceiling]] then the ||0 will
            // put a wall from the top to the bottom
            heights.map(delta => {
                var coords = [NewVector(a,b, delta[0]),
                              NewVector(c,d, delta[0]),
                              NewVector(c,d, delta[1]||0),
                              NewVector(a,b, delta[1]||0)];

                var mid = coords[0].lerp(coords[1], .5);

                angle = -angle_between(coords[0], mid)

                objects.push(new Wall(mid,
                                      angle,
                                      coords[0].distance_to(mid),
                                      coords[2].z - coords[0].z));
                add_and_reverse(21,coords)
            });
        });

        // Actually add the walls to the list of objects so they show up
        to_render.map(([angles, faces], i) => {
            if (!angles.length) return;
            objects.unshift(new Sprite(make_output_from_faces(faces), ZERO, null, null, [1,1,1], [i, (21==i)+1]));
            objects[0].q=true; // mark this is a wall
            objects[0].aq_angle = new Float32Array(angles.flat(2));
            objects[0].rebuffer();
        });

        
        objects.push(chaingun);
        objects.push(my_body = merge_sprites(
            new Enemy(NewVector(-1e6,0,0)).sprites.map((x,i)=>{
                x.position = x.position.add(Z_DIR.scalar_multiply(5*(i==3 || i==4)));
                return x;
            })))

        lights.map(light =>
                   light.shadow && light.compute_shadowmap()
                  )


        music_timeouts.map(clearTimeout);
        music_timeouts=[];
        doplay();
        
    }

    /* Get the floor height at the position by looking the region.
     * If passing cache, then cache.o is the previous region that we were in
     * This way we can check if we're in the same region as last time.
     * Otherwise just scan every region by brute force.
     */
    get_floor_height(position, cache) {
        cache = cache || {}
        if (cache.o && this.is_in_region(cache.o, position)) return cache.o.floor_height;
        cache.o = this.get_region_at(position);
        return cache.o ? cache.o.floor_height : -100;
    }
    is_in_region(region, position) {
        position = position.add(urandom_vector().scalar_multiply(.01))
        return region.lines.filter(x=>ray_line_intersect(position, X_DIR, ...x)).length%2 == 1
    }
    get_region_at(position) {
        for (var i in this.regions) {
            if (this.is_in_region(this.regions[i], position)) return this.regions[i]
        }
    }

    
}


/* A MapPolygon stores the data for each polygon, and does nothing else.
 */
class MapPolygon {
    constructor(vertices, floor_height, ceil_height) {
        this.vertices = vertices;
        this.floor_height = floor_height;
        this.ceil_height = ceil_height;
        this.lines = pairs([...vertices,vertices[0]],(a,b)=>[a,b])
            .sort() // DEBUGONLY
    }
}

/* A small turtle-like language to create maps for the game.
 * Each command is one byte represented as a 3-bit opcode and 5-bit argument.
 *  - 000 arg: Create a new polygon with argument edges, to follow.
 *  - 001 arg: Move to a new position to start another polygon, arg moves.
 *  - 010 arg: unused
 *  - 011 arg: create an object indexed by arg.
 *  - 100 arg: adjust the floor height up (or down) by arg.
 *  - 101 arg: adjust the ceiling height up (or down) by arg.
 *  - 110 arg: move the turtle back to where it was arg steps ago.
 *  - 111 arg: unused
 */
function run_turtle(commands) {
} // DEBUGONLY
function run_turtle(commands, objs_list) { // DEBUGONLY
    var regions = []
    var turtle_location = [ZERO];
    var floor_height = 4;
    var ceil_height = 40;

    var do_later = [];
    for (var i = 0; i < commands.length; ) {
        var cmd = commands[i++];
        var [low, high] = [cmd&31, cmd>>5];
        if (high <= 1) { // make a region with [low] vertices
            // 0: connect short
            // 1: go short
            //console.log(i,"NEW REGION STARTING AT", turtle_location[0])
            regions.push(new MapPolygon([turtle_location[0],
                                          ...range(low).map(x=>
                                                            (turtle_location.unshift(turtle_location[0].add(NewVector(((commands[i]>>4)-7)*8, ((commands[i++]%16)-7)*8, 0))),turtle_location[0])
                                                           )
                                        ],
                                        floor_height, ceil_height))

            if (high == 1) { // goto, so delete the region
                regions.pop();
            }
        }
        if (high == 3) {
            // just 5 bytes to have the offset go here
            
            do_later.push([objects,
                           all_objects[low],
                           turtle_location[0].add(NewVector(((commands[i]>>4)-7)*8,
                                                            ((commands[i++]%16)-7)*8,
                                                            ((commands[i]>>4)-7)*2)),
                           (commands[i++]%16)/8*Math.PI,
                           0,
                           true]);
            var it = do_later[do_later.length-1]; // DEBUGONLY
            (objs_list||[]).push({class_idx: low, position: it[2].copy(), theta: it[3]})    // DEBUGONLY
            if (!low && objs_list && objs_list[0]) objs_list[0].theta2 = it[4] // DEBUGONLY
        }
        floor_height += 2*(low-15)*(high==4);
        ceil_height += 4*(low-15)*(high==5);
        turtle_location.splice(0,low*(high==6));
    }
    return [regions, do_later];
}


/* Display and create game maps for the turtle map.
 * This object is only used to create maps and not used into the real game.
 * As a result, this 1000-line object is some of the ugliest code ever known to exist.
 */
class TurtleDisplay {
    //////////////////////////////////////////////////////////////////////
    //////////////////////// <HEREBEDRAGONS> /////////////////////////////
    //////////////////////////////////////////////////////////////////////
    constructor(map, code) {
        this.map = map;
        this.code = code;

        this.objects = []
        this.regions = run_turtle(code, this.objects)[0];
        
        console.log("Turtle objects", this.objects);
        
        var parent = document.createElement("div")
        parent.style = "position: absolute; left: 850px; top: 20px";

        elt = document.createElement("input");
        elt.type = "button"
        elt.value = "+"
        elt.onclick = () => {
            this.zoom /= 2;
            this.x = this.x+100/this.zoom
            this.y = this.y+100/this.zoom
            this.render();
        }
        parent.appendChild(elt);

        elt = document.createElement("input");
        elt.type = "button"
        elt.value = "-"
        elt.onclick = () => {
            this.zoom *= 2;
            this.x = this.x-200/this.zoom
            this.y = this.y-200/this.zoom
            this.render();
        }
        parent.appendChild(elt);

        elt = document.createElement("span");
        elt.innerHTML = "&nbsp;&nbsp;pos:"
        parent.appendChild(elt);
        
        this.mapx = elt = document.createElement("input");
        elt.value = ""
        elt.style = "width: 4em"
        elt.id = "mapx";
        parent.appendChild(elt);

        this.mapy = elt = document.createElement("input");
        elt.value = ""
        elt.style = "width: 4em"
        elt.id = "mapy";
        parent.appendChild(elt);

        this.mapx.onchange = this.mapy.onchange = (w) => {
            this.regions.map(region => {
                region.vertices.map(pos => {
                    if (pos.distance_to(this.selectedv) < 1) {
                        if (w.target == this.mapx) {
                            pos.x = 0|this.mapx.value;
                        } else {
                            pos.y = 0|this.mapy.value;
                        }
                    }
                });
            });
            this.updatemap()
            this.get()
            this.setcode();
            this.render();
        }

        elt = document.createElement("span");
        elt.innerHTML = "&nbsp;&nbsp;height:"
        parent.appendChild(elt);
        

        this.mapf = elt = document.createElement("input");
        elt.value = ""
        elt.style = "width: 3em"
        elt.id = "mapf";
        parent.appendChild(elt);

        this.mapf.onchange = (w) => {
            if (this.selectedr) {
                this.selectedr.floor_height = 0|this.mapf.value
                this.updatemap()
                this.get()
                this.setcode();
                this.render();
            } else if (this.selectedo) {
                this.selectedo.zoff = 0|this.mapf.value;
            }
        }
        
        this.mapc = elt = document.createElement("input");
        elt.value = ""
        elt.style = "width: 3em"
        elt.id = "mapc";
        parent.appendChild(elt);

        this.mapc.onchange = (w) => {
            this.selectedr.ceil_height = 0|this.mapc.value
            this.updatemap()
            this.get()
            this.setcode();
            this.render();
        }

        elt = document.createElement("span");
        elt.innerHTML = "<br>light:"
        parent.appendChild(elt);
        

        this.lightf = elt = document.createElement("input");
        elt.value = ""
        elt.style = "width: 3em"
        parent.appendChild(elt);

        this.lightf.onchange = (w) => {
            this.selectedr.floor_light = (0|this.lightf.value)/15
            this.updatemap()
            this.get()
            this.setcode();
            this.render();
        }
        
        this.lightc = elt = document.createElement("input");
        elt.value = ""
        elt.style = "width: 3em"
        parent.appendChild(elt);

        this.lightc.onchange = (w) => {
            this.selectedr.ceil_light = (0|this.lightc.value)/15
            this.updatemap()
            this.get()
            this.setcode();
            this.render();
        }

        elt = document.createElement("span");
        elt.innerHTML = "loopid:"
        parent.appendChild(elt);
        

        this.loopid = elt = document.createElement("input");
        elt.value = ""
        elt.style = "width: 3em"
        parent.appendChild(elt);
        this.loopid.onchange = (w) => {
            this.selectedr.loopid = (0|this.loopid.value)
            this.updatemap()
            this.get()
            this.setcode();
            this.render();
        }
        
        
        elt = document.createElement("input");
        elt.type = "button"
        elt.value = "Begin"
        elt.onclick = () => {
            this.get();
            reset();
            this.updatemap();
        };
        parent.appendChild(elt);

        elt = document.createElement("input");
        elt.type = "button"
        elt.value = "Get"
        elt.onclick = () => {
            var options = range(100).map(_ => this.get(true));
            console.log("Lengths",options.map(x=>x.length).sort((x,y) => x-y));
            var out = options.map(x=>[x.length,x]).sort((x,y) => x[0]-y[0])[0][1];
            console.log(out.length, btoa(out.map(x=>String.fromCharCode(x)).join("")))
            this.lightf.value = btoa(out.map(x=>String.fromCharCode(x)).join(""));
        }
        this.get = (is_rand) => {
            //console.log("Start map get");

            var turtle_pos = [NewVector(0,0,0)];
            var floor_height = 4;
            var ceil_height = 40;
            var floor_light = 1;
            var ceil_light = 1;
            var out = [];
                             
            var uid = Math.random();

            // Make each region start with first coordinate in the
            // upper left position.
            var regions_ordered = this.regions.map(region => {
                var UL_idx = 0;
                region.vertices.map((p,i)=> {
                    if (p.x < region.vertices[UL_idx].x ||
                        (p.x == region.vertices[UL_idx].x &&
                         p.y > region.vertices[UL_idx].y)) {
                        UL_idx = i;
                    }
                })
                region.vertices = [...region.vertices.slice(UL_idx),
                                   ...region.vertices.slice(0,UL_idx)]
                if (region.vertices[0].y == region.vertices[1].y) {
                    //console.log("MOVE");
                    region.vertices.reverse()
                    region.vertices.unshift(region.vertices.pop())
                }
                
                return region;
            })

            var regions_deltaencode = regions_ordered.map(region=> {
                var prev = region.vertices[0];
                return region.vertices.slice(1).map(pos => {
                    var delta = pos.subtract(prev);
                    prev = pos;
                    return delta.id();
                }).join(";");
            })

            // Compute regions that are the same shape
            var equiv_class = [];
            regions_deltaencode.map((r1,i) => {
                var did = false;
                equiv_class.map((r2s, j) => {
                    if (regions_deltaencode[r2s[0]] == r1) {
                        did = true;
                        r2s.push(i);
                    }
                })
                if (!did) {
                    equiv_class.push([i]);
                }
            });

            //console.log('equiv',equiv_class);

            // And finally see if they're offset consistently
            var del = []
            equiv_class.map(region_idxs=> {
                if (region_idxs.length >= 3) {
                    region_idxs = region_idxs.sort((j,i) => (regions_ordered[i].vertices[0].x + regions_ordered[i].vertices[0].y/1000) - (regions_ordered[j].vertices[0].x + regions_ordered[j].vertices[0].y/1000))
                    //console.log(region_idxs);
                    //console.log(regions_ordered[region_idxs[0]]);
                    var positions = region_idxs.map(i=>regions_ordered[i].vertices[0]);
                    var offsets = pairs(positions, (prev,next) => {
                        return next.subtract(prev).id();
                    })
                    //console.log(offsets);
                    if ((new Set(offsets)).size == 1) {
                    }
                    del.push(...region_idxs.slice(1))
                }
            })

            /*del.sort((a,b)=>b-a).map(x=>
                                     regions_ordered.splice(x,1)
                                    )*/


            var bfs_order = [];
            var queue = [regions_ordered[is_rand ? Math.floor(Math.random()*regions_ordered.length) : 0]];
            while (queue.length > 0) {
                var region = queue.pop();
                if (bfs_order.some(x=>x==region)) continue;
                bfs_order.push(region);
                region.vertices.map(v=> {
                    queue.push(...regions_ordered.filter(other => other.vertices.some(x=>x.distance_to(v)<1)))
                })
            }

            if (bfs_order.length != regions_ordered.length) {
                console.log("BAD");
                //sdf;
            }

            if (is_rand) {
                var r = Math.random();
                if (r < .5) {
                    bfs_order = bfs_order.reverse()
                }
                r = Math.random();
                if (r < .5) {
                    bfs_order.map(region => {
                        var idx = Math.floor(Math.random()*region.vertices.length);
                        region.vertices.reverse()
                    })
                }
            }
            
            
            bfs_order.map(region => {
                var vertices = region.vertices.map(y=> {
                    return NewVector(Math.round(y.x/8),
                                     Math.round(y.y/8),
                                     y.z);
                })

                // Move to the new region
                // First: see if we can get there through backtracking
                var found = 1e9;
                var splitat;
                vertices.map((vert,at)=> {
                    turtle_pos.map((x,i)=> {
                        if (x.distance_to(vert)<1 && i < found) {
                            found = i;
                            splitat = at;
                        }
                    })
                })

                if (found <= 31) {
                    // We can get by backtracking
                    if (found > 0) {
                        turtle_pos.splice(0,found);
                        //console.log("Backtrack", found);
                        out.push((6<<5) + (found))
                    }
                    vertices = [...vertices.slice(splitat), ...vertices.slice(0,splitat)]
                } else {
                    // We can't. Instead move directly.
                    //console.log("HAVE TO MOVE!", found);
                    //console.log(turtle_pos[0], vertices)
                    //turtle_pos.unshift(vertices[0])

                    var closest = vertices[0];//vertices.map(x=>[x.distance_to(turtle_pos[0]),x]).sort((a,b)=>a-b)[0][1]
                    //console.log(closest);

                    while (closest.distance_to(turtle_pos[0]) > 0){
                        out.push((1<<5)+1)
                        var delta = closest.subtract(turtle_pos[0])
                        out.push(((clamp(delta.x,-7,7)+7)<<4) | (clamp(delta.y,-7,7)+7));
                        turtle_pos.unshift(turtle_pos[0].add(NewVector(((clamp(delta.x,-7,7))),
                                                                       (clamp(delta.y,-7,7)),
                                                                       0)));
                    }
                }
                // adjust the floor height
                while (Math.abs(floor_height-region.floor_height) >= 2) {
                    var delta = ((region.floor_height-floor_height)/2 | 0);
                    delta = Math.max(Math.min(delta, 15), -15);
                    floor_height += delta*2;
                    out.push((4<<5) + (delta+15));
                }

                // adjust the ceiling height
                while (Math.abs(ceil_height-region.ceil_height) >= 4) {
                    var delta = ((region.ceil_height-ceil_height)/4 | 0);
                    delta = Math.max(Math.min(delta, 15), -15);
                    ceil_height += delta*4;
                    out.push((5<<5) + (delta+15));
                }

                /*
                while (Math.abs(region.floor_light-floor_light) > .01) {
                    var delta = Math.min(Math.max((region.floor_light-floor_light)*15+7, 0), 15);
                    floor_light += (delta-7)/15;
                    out.push(0x50+(delta));
                }
                */
                
                if (vertices[0].distance_to(turtle_pos[0]) > 0){
                    sdf;
                }
                

                var allsmall = pairs(vertices, (b,a) =>
                                     a.subtract(b).x <= 8 &&
                                     a.subtract(b).x >= -7 &&
                                     a.subtract(b).y <= 8 &&
                                     a.subtract(b).y >= -7)
                    .every(x=>x)
                if (vertices.length > 31) {
                    sdf;
                }
                if (allsmall) {
                    out.push(vertices.length-1)
                    vertices.slice(1).map(pos=> {
                        var delta = pos.subtract(turtle_pos[0])
                        if (delta.x < -7 || delta.x > 8 ||
                            delta.y < -7 || delta.y > 8) {
                            console.log("FAILED TO SERIALIZE", region);
                            console.log(delta.x, delta.y)
                            sdf;
                        }
                        out.push(((delta.x+7)<<4) | (delta.y+7));
                        turtle_pos.unshift(pos);
                    })
                } else {
                    //sdf;
                    /*
                    out.push(vertices.length-1)
                    vertices.slice(1).map(pos=> {
                        var delta = pos.subtract(turtle_pos[0])
                        if (delta.x < -127 || delta.x > 127 ||
                            delta.y < -127 || delta.y > 127) {
                            console.log("FAILED TO SERIALIZE", region);
                        }
                        out.push((delta.x)+128, (delta.y)+128)
                        qq.push(delta.x, delta.y);
                        turtle_pos.unshift(pos);
                    })
                    */
                }


                this.objects.map(obj => {
                    if (obj.did != uid) {
                        var delta = obj.position.subtract(turtle_pos[0].scalar_multiply(8));
                        if (delta.x < -7*8 || delta.x > 7*8 ||
                            delta.y < -7*8 || delta.y > 7*8) {
                            // skip
                        } else {
                            //console.log("Do push an object", obj);
                            obj.did = uid;
                            /*
                            var best_rot = 0;
                            for (var i = 0; i < 255; i++) {
                                if (Math.abs((i%(Math.PI*2))-(obj.theta%(Math.PI*2))) < Math.abs((best_rot%(Math.PI*2))-(obj.theta%(Math.PI*2)))) {
                                    best_rot = i;
                                }
                            }
                            */
                            var best_rot = Math.round((obj.theta%(2*Math.PI))/Math.PI*8)%16
                            //console.log("PUSH OFFSET", (((((obj.zoff||floor_height))-floor_height)+7)))
                            out.push((3<<5) + obj.class_idx,
                                     (((delta.x/8|0)+7)<<4) | ((delta.y/8|0)+7),
                                     ((((obj.zoff||floor_height)-floor_height)/2+7)<<4) | (best_rot|0));
                               
                        }
                    }
                })
                
            });
            //console.log("Did objects?", this.objects.map(x=>x.did == uid));
            this.code = out;
            console.log(out.length, btoa(out.map(x=>String.fromCharCode(x)).join("")))
            return out;
        }
        
        parent.appendChild(elt);
        
        parent.appendChild(document.createElement("br"));

        
        var elt = document.createElement("canvas");
        elt.style = "border: 1px solid #000";
        elt.height = elt.width = "400";
        parent.appendChild(elt); // QQ
        document.body.appendChild(parent); // QQ
        this.ctx = elt.getContext("2d"); // QQ

        this.mapdrag = false;
        this.vertexdrag = false;
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
        this.downtime = 0;
        this.selectedv = undefined;
        this.selectedr = undefined;
        this.selectede = undefined;
        this.selectedo = undefined;

        var move_vertex = (from, to) => {
            to = NewVector(Math.round(to.x/8)*8,
                           Math.round(to.y/8)*8,
                           to.z)
            this.regions.map(region => {
                region.vertices = region.vertices.map(pos => {
                    if (pos.distance_to(from) < 1) {
                        return to
                    }
                    return pos;
                });
            });
            if (this.selectedv.distance_to(from) < 1) {
                this.selectedv = to;
            }

        }

        this.mousepos = undefined;
        
        elt.onmousemove = (e) => {
            this.mousepos = NewVector((this.x+e.offsetX)*this.zoom-200, (-this.y-e.offsetY)*this.zoom+400,0);
            
            if (this.mapdrag) {
                this.x -= e.movementX;
                this.y -= e.movementY;
            } else if (this.vertexdrag) {
                if (this.selectedv && this.initvertexpos) {
                    move_vertex(this.selectedv, this.initvertexpos.add(this.mousepos.subtract(this.mousedownpos).scalar_multiply(this.zoom)))
                } else if (this.selectedo) {
                    this.selectedo.position.x += e.movementX*this.zoom|0;
                    this.selectedo.position.y -= e.movementY*this.zoom|0;
                }
                this.updatemap()
            }
            this.render()
        };

        this.listen = (e) => {
            if (e.path[0] == this.mapx || e.path[0] == this.mapy) return;
            if (e.path[0] == this.mapc || e.path[0] == this.mapf) return;
            if (e.path[0] == this.lightc || e.path[0] == this.lightf) return;
            if (e.path[0] == this.loopid) return;
            if (e.path[0] == this.codearea) return;
            //if (pointer_lock) return;
            if (e.key == "q") {
                if (this.selectede) {
                    var adjacent = this.regions.filter(region => {
                        return region.vertices.filter(pos => 
                                                      pos.distance_to(this.selectede[0]) < 1
                                                     ).length > 0 &&
                            region.vertices.filter(pos => 
                                                      pos.distance_to(this.selectede[1]) < 1
                                                     ).length > 0
                    });
                    this.regions = this.regions.filter(region => region != adjacent[0] && region != adjacent[1]);

                    var new_region = []

                    adjacent = adjacent.map(x=>x.vertices);                    

                    range(2).map(i=> {
                        while (adjacent[i][1].distance_to(this.selectede[1]) > 1) {
                            adjacent[i].push(adjacent[i].shift())
                        }
                        if (adjacent[i][0].distance_to(this.selectede[0]) > 1) {
                            adjacent[i].reverse();
                            while (adjacent[i][1].distance_to(this.selectede[1]) > 1) {
                                adjacent[i].push(adjacent[i].shift())
                            }
                        }
                    });
                    var rev = adjacent[1].slice(2);
                    rev.reverse();
                    this.regions.push(new MapPolygon([...adjacent[0].slice(1),
                                                      adjacent[0][0],
                                                      ...rev],
                                                     this.selectedr.floor_height, this.selectedr.ceil_height,
                                                     this.selectedr.floor_light, this.selectedr.ceil_light,
                                                     this.selectedr.floor_texture, this.selectedr.ceil_texture,
                                                     this.selectedr.wall_texture));
                    
                    
                    this.selectede = undefined;
                    this.selectedv = undefined;
                    this.selectedr = undefined;

                } else if (this.selectedv) {
                    this.regions.map(region => {
                        region.vertices = region.vertices.filter(pos => 
                                                                 pos.distance_to(this.selectedv) > 1
                                                                )
                    })
                    this.selectede = undefined;
                    this.selectedv = undefined;
                    this.selectedr = undefined;
                } else if (this.selectedo) {
                    this.objects = this.objects.filter(x => x != this.selectedo);
                    this.selectedo = undefined;
                }
            } else if (e.key == "Q") {
                console.log('delete',this.selectedr);
                this.regions = this.regions.filter(r => r != this.selectedr)
                console.log("Now have", this.regions.length)
                this.selectede = undefined;
                this.selectedv = undefined;
                this.selectedr = undefined;
                this.updatemap();
            } else if (e.key == "A" || e.key == "D") { // connect the line
                if (this.selectedv) {
                    var idx;
                    this.selectedr.vertices.map((x,i) => {
                        if (x.distance_to(this.selectedv) < 1) {
                            idx = i;
                        }
                    });
                    if (e.key == "A") idx += 1;
                    if (e.key == "D") idx -= 1;
                    this.selectede = [this.selectedv,
                                      this.selectedr.vertices[(idx+this.selectedr.vertices.length)%this.selectedr.vertices.length]].sort();
                }
            } else if (e.key == "a" || e.key == "d") { // rotate around this poly
                this.selectede = undefined;
                if (this.selectedv) {
                    var idx;
                    this.selectedr.vertices.map((x,i) => {
                        if (x.distance_to(this.selectedv) < 1) {
                            idx = i;
                        }
                    });
                    if (e.key == "a") idx += 1;
                    if (e.key == "d") idx -= 1;
                    this.selectedv = this.selectedr.vertices[(idx+this.selectedr.vertices.length)%this.selectedr.vertices.length];
                }
            } else if (e.key == "r") { // rotate the object
                if (e.metaKey) return;
                this.selectedo.theta += Math.PI/8;
                this.updatemap();
            } else if (e.key == "e") { // make a new region
                var other = reduce_mean(this.selectede)
                other = other.add(reduce_mean(this.selectedr.vertices).subtract(other).normalize().scalar_multiply(-10))
                var vertices = [...this.selectede, other];
                this.regions.push(new MapPolygon(vertices,
                                                 this.selectedr.floor_height,
                                                 this.selectedr.ceil_height,
                                                 this.selectedr.floor_light, this.selectedr.ceil_light,
                                                 this.selectedr.floor_texture, this.selectedr.ceil_texture,
                                                 this.selectedr.wall_texture))
                this.selectedv = other;
                this.updatemap();
            } else if (e.key == "f") { // move to make this a box
                if (this.selectedv && this.selectedr && this.selectedr.vertices.length == 4) {
                    var others = this.selectedr.vertices.filter(x=>x.distance_to(this.selectedv) > 1);
                    var dist_to_others = others.map(x=> others.map(y=>x.distance_to(y)).reduce((a,b)=>a+b))
                    var argmin = range(3).filter(i=>dist_to_others[i] == Math.min(...dist_to_others))[0];
                    var target_pos = reduce_add(others).subtract(others[argmin].scalar_multiply(2));
                    this.selectedv.x = target_pos.x|0
                    this.selectedv.y = target_pos.y|0
                    this.selectedv.z = target_pos.z|0
                    this.updatemap();
                }
            } else if (e.key == "X") { // line up on x axis
                if (this.selectedv && this.selectede) {
                    var other = this.selectede.filter(x=>x.distance_to(this.selectedv) > 1)[0];

                    move_vertex(this.selectedv, NewVector(other.x,
                                                          this.selectedv.y,
                                                          this.selectedv.z))
                    
                    this.selectede = null;
                    this.updatemap();
                }
            } else if (e.key == "Y") { // line up on y axis
                if (this.selectedv && this.selectede) {
                    var other = this.selectede.filter(x=>x.distance_to(this.selectedv) > 1)[0];

                    move_vertex(this.selectedv, NewVector(this.selectedv.x,
                                                          other.y,
                                                          this.selectedv.z))
                    this.selectede = null;
                    this.updatemap();
                }
            } else if ((e.key|0) > 0 || e.key == "0") { // create a new object
                console.log("ADD");
                var obj = {class_idx: (e.key|0),
                           position:this.mousepos,
                           theta: 0}
                if (e.key == "0") {
                    obj.theta2 = 0;
                }
                this.objects.push(obj)
                this.updatemap();
            } else if (e.key == "s") { // split the line in half
                if (this.selectede) {
                    var adjacent = this.regions.filter(region => {
                        return region.vertices.filter(pos => 
                                                      pos.distance_to(this.selectede[0]) < 1
                                                     ).length > 0 &&
                            region.vertices.filter(pos => 
                                                      pos.distance_to(this.selectede[1]) < 1
                                                     ).length > 0
                    });
                    var middle = reduce_mean(this.selectede);
                    adjacent.map(region => {
                        var idx = 0;
                        for (var i in region.vertices) {
                            i = i|0;
                            if (region.vertices[i].distance_to(this.selectede[0]) < 1) {
                                if (region.vertices[(i+1)%region.vertices.length].distance_to(this.selectede[1]) < 1) {
                                    idx += i;
                                }
                                if (region.vertices[(i+region.vertices.length-1)%region.vertices.length].distance_to(this.selectede[1]) < 1) {
                                    idx += i - 1;
                                }
                            }
                        };
                        region.vertices.splice(idx+1, 0, middle);
                        region.lines = new MapPolygon(region.vertices, 0, 0).lines;
                        this.selectedv = middle;
                    });
                    this.selectede = undefined;
                    this.updatemap()
                }
            } else if (e.key == "w") {
                this.selectede = undefined;
                if (this.selectedv) {
                    var adjacent = this.regions.filter(region => {
                        return region.vertices.filter(pos => 
                                                      pos.distance_to(this.selectedv) < 1
                                                     ).length > 0
                    });
                    var nextr;
                    adjacent.map((x,i) => {
                        if (x === this.selectedr) {
                            nextr = adjacent[(i+1)%adjacent.length]
                        }
                    })
                    this.selectedr = nextr;
                    this.selectedr
                }
            } else if (e.key == "x") {
                this.mapx.select();
                this.updatemap()
                return false;
            }
            this.render();
            this.get();
            this.setcode();
        };
        window.addEventListener('keydown', this.listen);
        elt.onmousedown = (e) => {
            this.mousedownpos = NewVector((this.x+e.offsetX)*this.zoom-200, (-this.y-e.offsetY)*this.zoom+400,0);
            var dx = e.offsetX
            var dy = e.offsetY
            var p = NewVector((this.x+dx)*this.zoom-200, (-this.y-dy)*this.zoom+400,0);
            this.downtime = +new Date();
            if (this.selectedv && this.selectedv.distance_to(p) < 10*this.zoom) {
                this.vertexdrag = true;
                this.initvertexpos = this.selectedv;
            } else if (this.selectedo && this.selectedo.position.vector_multiply(NewVector(1,1,0)).distance_to(p) < 10*this.zoom) {
                this.vertexdrag = true;
            } else{
                this.mapdrag = true;
            }
        }
        elt.onmouseup = (e) => {
            var dx = e.offsetX;
            var dy = e.offsetY;
            this.mapdrag = false;
            this.vertexdrag = false;
            if (+new Date() - this.downtime < 500) {
                var p = NewVector((this.x+dx)*this.zoom-200, (-this.y-dy)*this.zoom+400,0);
                var prev_vertex = this.selectedv;
                this.selectedv = undefined;
                this.regions.map(region => {
                    region.vertices.map(pos => {
                        if (pos.distance_to(p) < 10*this.zoom) {
                            this.selectedv = pos;
                            this.selectedo = undefined;
                            this.selectedr = region;
                        }
                    })
                })

                if (this.selectedv == undefined) {
                    this.objects.map(obj=> {
                        p.z = obj.position.z;
                        if (obj.position.distance_to(p) < 10*this.zoom) {
                            this.selectedo = obj;
                            this.selectedr = undefined;
                            this.selectedv = undefined;
                        }
                    })
                }
                
                if (this.selectedv && e.shiftKey) {
                    var old_poly = this.regions.filter(region => {
                        return region.vertices.filter(pos => 
                                                      pos.distance_to(this.selectedv) < 1
                                                     ).length > 0 &&
                            region.vertices.filter(pos => 
                                                   pos.distance_to(prev_vertex) < 1
                                                  ).length > 0;
                    })[0];
                    
                    var new_poly_1 = [];
                    var new_poly_2 = [];
                    old_poly.vertices.map(x=> {
                        new_poly_1.push(x.copy())
                        if (x.distance_to(prev_vertex) < 1 ||
                            x.distance_to(this.selectedv) < 1) {
                            new_poly_2.push(x.copy());
                            [new_poly_1, new_poly_2] = [new_poly_2, new_poly_1]
                        }
                    })
                    this.regions = this.regions.filter(x=>x != old_poly)
                    this.regions.push(new MapPolygon(new_poly_1,
                                                     old_poly.floor_height,
                                                     old_poly.ceil_height,
                                                     old_poly.floor_light, old_poly.ceil_light,
                                                     old_poly.floor_texture, old_poly.ceil_texture,
                                                     old_poly.wall_texture));
                    this.regions.push(new MapPolygon(new_poly_2,
                                                     old_poly.floor_height,
                                                     old_poly.ceil_height,
                                                     old_poly.floor_light, old_poly.ceil_light,
                                                     old_poly.floor_texture, old_poly.ceil_texture,
                                                     old_poly.wall_texture));
                    this.selectedr = this.regions[this.regions.length-1]
                }

                this.updatemap();
                this.render();
                this.get();
                this.setcode();
            }
        }


        this.codearea = elt = document.createElement("textarea");
        elt.style = "font-family: mono; font-size: 14px"
        elt.rows = "20"
        elt.cols = "40"
        elt.onkeyup = () => {
            this.code = this.codearea.value.split("\n").map(line => {
                if (line[0] == '.') {
                    var cmds = line.split(" ").filter(x=>x.length);
                    //console.log(cmds);
                    if (cmds[0] == ".move") {
                        return [0x11, Number(cmds[1])+128, Number(cmds[2])+128];
                    } else if (cmds[0] == ".region" && cmds.length > 2 && cmds.length%2 == 1) {
                        //console.log([(cmds.length-1)/2, ...cmds.slice(1).map(x=>Number(x)+128)]);
                        return [(cmds.length-1)/2, ...cmds.slice(1).map(x=>Number(x)+128)];
                    } else if (cmds[0] == ".floor") {
                        return [0x30 + Number(cmds[1])+7];
                    } else if (cmds[0] == ".ceil") {
                        return [0x40 + Number(cmds[1])+7];
                    }
                } else {
                    return line.split(" ").filter(x=>x).map(x=>parseInt(x,16));
                }
            }).flat();
            //console.log(this.code);
            if (this.code.every(x=>x !== undefined) &&
                this.code.every(x=>!isNaN(x))) {
                console.log("RUN");
                this.updatemap();
                this.render();
                this.selectedr = undefined;
                this.selectedv = undefined;
                this.selectede = undefined;
            }
        }
        parent.appendChild(elt);
        this.get()
        this.setcode();
        
        this.render();
    }

    setcode() {
        //console.log("CODE is", this.code);
        var txt = "";
        var numberlen = 0;
        var howprint = 1;
        this.code.map((x,i)=> {
            if (numberlen > 0) {
                if (howprint == 0) {
                    txt += (x-128) + " ";
                } else if (howprint == 1) {
                    txt += ((x>>4)-7)*8 + " " + ((x&15)-7)*8 + " ";
                } else if (howprint == 2) {
                    txt += ((x>>4)-7) + " " + ((x&15)-7) + " ";
                }
                numberlen -= 1;
            } else if ((x>>5) == 0) {
                txt += "\n.region ";
                numberlen = x;
                howprint = 1;
            } else if ((x>>5) == 1) {
                txt += "\n.goto ";
                numberlen = (x%32);
                howprint = 1;
            } else if ((x>>5) == 3) {
                txt += "\n.object "
                numberlen = 2;
                howprint = 2;
            } else if ((x>>5) == 4) {
                txt += "\n.floor " + ((x%32)-15);
            } else if ((x>>5) == 5) {
                txt += "\n.ceil " + ((x%32)-15);
            } else if ((x>>5) == 6) {
                txt += "\n.backtrack " + ((x%32));
            } else {
                txt += "\n"+x.toString(16).padStart(2,'0');
            }
                
        })
        this.codearea.value = txt;
    }

    updatemap() {
        /// needs to be this hacky way so object can spawn sub-objects
        //objects.push(...this.objects.map(x=>new x.constructor(x.position.copy(), x.theta)))
        //console.log('here',this.objects);
        this.get();
        var code = btoa(this.code.map(x=>String.fromCharCode(x)).join(""));
        map.levels.unshift(code)
        map.load_level()
    }

    fill_poly(vertices) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgb("+(255*Math.random())+","+(255*Math.random())+","+(255*Math.random())+")"
        this.ctx.moveTo(0|((vertices[0].x+200)/this.zoom)-this.x, 0|((-vertices[0].y+400)/this.zoom)-this.y); // QQ
        vertices.map(pos => this.ctx.lineTo(0|((pos.x+200)/this.zoom)-this.x, 0|((-pos.y+400)/this.zoom)-this.y));
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    
    render() {
        var regions = this.regions;
        this.regions.map(x=> {
            x.lines = x.vertices.map((coord,i) =>
                                  [coord,x.vertices[(i+1)%x.vertices.length]].sort()
                                 );
        });

        
        this.ctx.fillStyle = "#000000";
        this.ctx.clearRect(0, 0, 400, 400);
        this.ctx.fillStyle = "#888";
        this.ctx.fillRect(0, 0, 400, 400);
        this.ctx.beginPath();

        
        regions.map(region => {
            var vertices = region.vertices;

            this.ctx.lineWidth = 2;
            this.ctx.moveTo(0|((vertices[0].x+200)/this.zoom)-this.x, 0|((-vertices[0].y+400)/this.zoom)-this.y); // QQ
            vertices.map(pos => this.ctx.lineTo(0|((pos.x+200)/this.zoom)-this.x, 0|((-pos.y+400)/this.zoom)-this.y));
            this.ctx.closePath();

            
        });

        this.ctx.strokeStyle = "#000000";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fill();
        this.ctx.stroke();

        if (this.selectedr) {
            this.ctx.beginPath();
            this.ctx.fillStyle = "#FFFF80";
            var vertices = this.selectedr.vertices;
            this.ctx.moveTo(0|((vertices[0].x+200)/this.zoom)-this.x, 0|((-vertices[0].y+400)/this.zoom)-this.y); // QQ
            vertices.map(pos => this.ctx.lineTo(0|((pos.x+200)/this.zoom)-this.x, 0|((-pos.y+400)/this.zoom)-this.y));
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }

        this.ctx.fillStyle = "#0000FF";
        regions.map(region=> {
            region.vertices.map(pos => this.ctx.fillRect(0|((pos.x+200)/this.zoom)-this.x-2, 0|((-pos.y+400)/this.zoom)-this.y-2, 4, 4))
            if (Math.max(...region.vertices.map(x=>x.x)) - Math.min(...region.vertices.map(x=>x.x)) > 20) {
                var middle = reduce_mean(region.vertices);
                this.ctx.fillStyle = "#0000FF";
                this.ctx.fillText(region.floor_height, (middle.x+200)/this.zoom-this.x, (-middle.y+400)/this.zoom-this.y);
            }
        })

        this.objects.map(obj=> {
            this.ctx.fillStyle = "#00AA00";
            this.ctx.fillRect(0|((obj.position.x+200)/this.zoom)-this.x-3,
                              0|((-obj.position.y+400)/this.zoom)-this.y-3, 6, 6); // QQ
        });
        if (this.selectedo) {
            this.ctx.fillStyle = "#00FFFF";
            this.ctx.fillRect(0|((this.selectedo.position.x+200)/this.zoom)-this.x-3,
                              0|((-this.selectedo.position.y+400)/this.zoom)-this.y-3, 6, 6); // QQ
        }

        regions.map(region => {
            var vertices = region.vertices;

            this.ctx.beginPath();
            this.ctx.strokeStyle = "#00FF00";
            this.ctx.lineWidth = 3;
            pairs([...vertices,vertices[0]], (a,b) => {
                if (a.subtract(b).x > 7*8 ||
                    a.subtract(b).x < -7*8 ||
                    a.subtract(b).y > 7*8 ||
                    a.subtract(b).y < -7*8) {
                    this.ctx.moveTo(0|((a.x+200)/this.zoom)-this.x, 0|((-a.y+400)/this.zoom)-this.y);
                    this.ctx.lineTo(0|((b.x+200)/this.zoom)-this.x, 0|((-b.y+400)/this.zoom)-this.y);
                }
            });
            this.ctx.stroke();

                    
        });
        
        if (this.selectedv) {
            //console.log(this.selectedr);
            this.mapx.value = this.selectedv.x;
            this.mapy.value = this.selectedv.y;
            this.mapc.value = this.selectedr.ceil_height;
            this.mapf.value = this.selectedr.floor_height;
            this.lightc.value = this.selectedr.ceil_light*15;
            this.lightf.value = this.selectedr.floor_light*15;
            this.loopid.value = this.selectedr.loopid|0;
            this.ctx.fillStyle = "#FF0000";
            this.ctx.fillRect(0|((this.selectedv.x+200)/this.zoom)-this.x-3, 0|((-this.selectedv.y+400)/this.zoom)-this.y-3, 6, 6); // QQ
        }
        
        if (this.selectede) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#FF0000";
            this.ctx.moveTo(0|((this.selectede[0].x+200)/this.zoom)-this.x,
                            0|((-this.selectede[0].y+400)/this.zoom)-this.y); // QQ
            this.ctx.lineTo(0|((this.selectede[1].x+200)/this.zoom)-this.x,
                            0|((-this.selectede[1].y+400)/this.zoom)-this.y); // QQ
            this.ctx.stroke();
        }

    }
    //////////////////////////////////////////////////////////////////////
    //////////////////////// </HEREBEDRAGONS> ////////////////////////////
    //////////////////////////////////////////////////////////////////////
}

var turtledisplay;

var chaingun=[];

function setup_map() {
    map = new Map();
    map.load_level();
}
