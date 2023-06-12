const program1Shader = `
float vsm(int which_texture, vec2 texpos) {
    vec4 coded_distance = get_shader(which_texture, texpos);
    float depth_mean = coded_distance.x, variance = max(coded_distance.y - depth_mean * depth_mean, .1), dist_to_camera = distance(u_light_position[which_texture], world_position);
    return clamp(max(clamp((variance / (variance + (dist_to_camera - depth_mean) * (dist_to_camera - depth_mean)) - .2) / .8, 0., 1.), smoothstep(dist_to_camera - .02, dist_to_camera, depth_mean)), 0., 1.);
}
void main() {
    if(u_render_direct) {
        out_color = v_color;
        return;
    }
    vec3 v_normal_ = normalize(v_normal.xyz);
    float light_add;
    light_add += clamp(dot(vec3(0, 0, -1), v_normal_), 0., 1.), light_add += clamp(dot(vec3(1, 0, .5), v_normal_), 0., 1.), light_add += clamp(dot(vec3(-.5, -.86, .5), v_normal_), 0., 1.), light_add += clamp(dot(vec3(-.5, .86, .5), v_normal_), 0., 1.), light_add *= u_ambient_light * (1. - smoothstep(0., 1., clamp(length(u_light_position[4] - world_position) / 150. - .3, 0., .9)));
        if(!u_is_light_shadow[0] || v_project_onto_light[0].z > 0.) {
            vec2 scaled = v_project_onto_light[0].xy / v_project_onto_light[0].w;
            float in_light_amt = u_is_light_shadow[0] ? vsm(0, scaled * .5 + .5) : 1.;
            if(in_light_amt > 0.) {
                vec4 v_to_light = u_light_position[0] - world_position;
                float fade_amt = u_is_light_shadow[0] ? clamp(.9 - dot(scaled, scaled), 0., .095) * 10. / .95 : 1., light_amt = dot(v_normal_, normalize(v_to_light.xyz)) + 1.;
                vec4 halfVector = normalize(normalize(v_to_light) + normalize(v_to_light));
                float specular = pow(abs(dot(v_normal_, halfVector.xyz)), 100.) * .1;
                light_amt += specular;
                float dist_to_light = distance(u_light_position[0], world_position);
                light_amt *= u_light_brightness[0] * fade_amt * fade_amt * in_light_amt / (u_is_light_shadow[0] ? 1. : sqrt(dist_to_light)), light_add += u_ambient_light * pow(light_amt, 3.);
            }
        }
        if(!u_is_light_shadow[1] || v_project_onto_light[1].z > 0.) {
            vec2 scaled = v_project_onto_light[1].xy / v_project_onto_light[1].w;
            float in_light_amt = u_is_light_shadow[1] ? vsm(1, scaled * .5 + .5) : 1.;
            if(in_light_amt > 0.) {
                vec4 v_to_light = u_light_position[1] - world_position;
                float fade_amt = u_is_light_shadow[1] ? clamp(.9 - dot(scaled, scaled), 0., .095) * 10. / .95 : 1., light_amt = dot(v_normal_, normalize(v_to_light.xyz)) + 1.;
                vec4 halfVector = normalize(normalize(v_to_light) + normalize(v_to_light));
                float specular = pow(abs(dot(v_normal_, halfVector.xyz)), 100.) * .1;
                light_amt += specular;
                float dist_to_light = distance(u_light_position[1], world_position);
                light_amt *= u_light_brightness[1] * fade_amt * fade_amt * in_light_amt / (u_is_light_shadow[1] ? 1. : sqrt(dist_to_light)), light_add += u_ambient_light * pow(light_amt, 3.);
            }
        }
        if(!u_is_light_shadow[2] || v_project_onto_light[2].z > 0.) {
            vec2 scaled = v_project_onto_light[2].xy / v_project_onto_light[2].w;
            float in_light_amt = u_is_light_shadow[2] ? vsm(2, scaled * .5 + .5) : 1.;
            if(in_light_amt > 0.) {
                vec4 v_to_light = u_light_position[2] - world_position;
                float fade_amt = u_is_light_shadow[2] ? clamp(.9 - dot(scaled, scaled), 0., .095) * 10. / .95 : 1., light_amt = dot(v_normal_, normalize(v_to_light.xyz)) + 1.;
                vec4 halfVector = normalize(normalize(v_to_light) + normalize(v_to_light));
                float specular = pow(abs(dot(v_normal_, halfVector.xyz)), 100.) * .1;
                light_amt += specular;
                float dist_to_light = distance(u_light_position[2], world_position);
                light_amt *= u_light_brightness[2] * fade_amt * fade_amt * in_light_amt / (u_is_light_shadow[2] ? 1. : sqrt(dist_to_light)), light_add += u_ambient_light * pow(light_amt, 3.);
            }
        }
        if(!u_is_light_shadow[3] || v_project_onto_light[3].z > 0.) {
            vec2 scaled = v_project_onto_light[3].xy / v_project_onto_light[3].w;
            float in_light_amt = u_is_light_shadow[3] ? vsm(3, scaled * .5 + .5) : 1.;
            if(in_light_amt > 0.) {
                vec4 v_to_light = u_light_position[3] - world_position;
                float fade_amt = u_is_light_shadow[3] ? clamp(.9 - dot(scaled, scaled), 0., .095) * 10. / .95 : 1., light_amt = dot(v_normal_, normalize(v_to_light.xyz)) + 1.;
                vec4 halfVector = normalize(normalize(v_to_light) + normalize(v_to_light));
                float specular = pow(abs(dot(v_normal_, halfVector.xyz)), 100.) * .1;
                light_amt += specular;
                float dist_to_light = distance(u_light_position[3], world_position);
                light_amt *= u_light_brightness[3] * fade_amt * fade_amt * in_light_amt / (u_is_light_shadow[3] ? 1. : sqrt(dist_to_light)), light_add += u_ambient_light * pow(light_amt, 3.);
            }
        }
    out_color.rgb += pow(light_add, .33), out_color *= v_color;
    if(u_render_texture > 0)
        out_color *= get_shader(u_texture_mux + 5, u_render_texture == 1 ? world_position.xy / 32. : vec2(dot(world_position.xy, vec2(sin(v_angle.x), -cos(v_angle.x))), world_position.z) / 16.);
    out_color.w = 1.;
}`;