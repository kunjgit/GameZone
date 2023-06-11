precision highp float;

uniform vec3 CL[9];

uniform vec2 WS;
uniform vec2 RES;

uniform float ZM;
uniform vec2 CM;
uniform bool DR;
uniform bool ST;
uniform bool GO;
uniform float score;

uniform float time;
uniform sampler2D state;
uniform float AN[7 * 30]; // array of [x, y, vx, vy, deathReason, deathTime, slope]
uniform int AL;
uniform float alive;
uniform float TR;
uniform sampler2D tiles;

uniform int DO;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

bool between (float p, float a, float b) {
  return a <= p && p <= b;
}
bool between (vec2 p, vec2 a, vec2 b) {
  return a.x <= p.x && p.x <= b.x &&
         a.y <= p.y && p.y <= b.y;
}

// Digits display source: http://glslsandbox.com/e#19207.5
float c_0 = 31599.0;
float c_1 = 9362.0;
float c_2 = 29671.0;
float c_3 = 29391.0;
float c_4 = 23497.0;
float c_5 = 31183.0;
float c_6 = 31215.0;
float c_7 = 29257.0;
float c_8 = 31727.0;
float c_9 = 31695.0;
float extract_bit(float n, float b) {
  n = floor(n);
  b = floor(b);
  b = floor(n/pow(2.,b));
  return float(mod(b,2.) == 1.);
}
float sprite(float n, float w, float h, vec2 p) {
  float bounds = float(all(lessThan(p,vec2(w,h))) && all(greaterThanEqual(p,vec2(0,0))));
  return extract_bit(n,(2.0 - p.x) + 3.0 * p.y) * bounds;
}
float digit(float num, vec2 p) {
  num = mod(floor(num),10.0);
  if(num == 0.0) return sprite(c_0, 3., 5., p);
  if(num == 1.0) return sprite(c_1, 3., 5., p);
  if(num == 2.0) return sprite(c_2, 3., 5., p);
  if(num == 3.0) return sprite(c_3, 3., 5., p);
  if(num == 4.0) return sprite(c_4, 3., 5., p);
  if(num == 5.0) return sprite(c_5, 3., 5., p);
  if(num == 6.0) return sprite(c_6, 3., 5., p);
  if(num == 7.0) return sprite(c_7, 3., 5., p);
  if(num == 8.0) return sprite(c_8, 3., 5., p);
  if(num == 9.0) return sprite(c_9, 3., 5., p);
  return 0.0;
}
float number6 (float n, vec2 p) {
  float c = 0.;
  vec2 cpos = vec2(1,1);
  c += digit(n/100000.,floor(p-cpos));
  cpos.x += 4.;
  c += digit(n/10000.,floor(p-cpos));
  cpos.x += 4.;
  c += digit(n/1000.,floor(p-cpos));
  cpos.x += 4.;
  c += digit(n/100.,floor(p-cpos));
  cpos.x += 4.;
  c += digit(n/10.,floor(p-cpos));
  cpos.x += 4.;
  c += digit(n,floor(p-cpos));
  return c;
}
float number2 (float n, vec2 p) {
  float c = 0.;
  vec2 cpos = vec2(-8,-6);
  c += digit(n/10.,floor(p-cpos));
  cpos.x += 4.;
  c += digit(n,floor(p-cpos));
  return c;
}


vec4 animal (vec2 p, vec2 pos, vec2 v, float d, float T, float s, float size) {
  // Died displacement
  vec2 disp = d>0.0 ?
    (1.0 + v - mix(vec2(0.0), v, pow(smoothstep(0.0, 0.5, T), 0.3))) +
    vec2(rand(gl_FragCoord.xy+time*0.03)-0.5, rand(gl_FragCoord.xy+time*0.1)-0.5) *
    mix(1., 8., pow(smoothstep(1.0, 6.0, T), 0.6))
    : vec2(0.0);

  float sleepCycle = step(0.5, fract(time / 2.0));

  // if (distance(p, pos) < 1.0) return vec4(1.0, 0.0, 0.0, 1.0); // DEBUG

  // The tile to use
  float tile = abs(v.x) < 0.1 ?
    (d<0.0 ? 5.0 + sleepCycle : 0.0)
    : 1.0 + floor(mod(pos.x / (2.0*size), 4.0));

  // pos: relative position & scaled to size
  pos = (disp + p - pos) / size;
  // Invert in X according to velocity
  if (v.x >= 0.0) pos.x = -pos.x;
  // Slope deform the animal
  float slope = clamp(s, -2., 2.) * smoothstep(0.0, 4.0, pos.x);
  // Translate to the pivot
  pos += vec2(3.5, slope);
  // Scale to the tile width (to match the same pixel world dimension)
  pos /= 8.0;

  vec4 clr = vec4(0.0);

  if (between(pos, vec2(0.0), vec2(1.0))) {
    // Compute the position from where to lookup in tiles
    clr += texture2D(tiles, mix(
        vec2(0.0, (1.0+tile) / 8.0), // uv to
        vec2(1.0, tile / 8.0), // uv from
        pos // the position
      ));
  }

  if (d<0.0) {
    tile = 7.0;
    vec2 p2 = pos * (sleepCycle+1.5) + vec2(0.8, -1.0);
    if (between(p2, vec2(0.0), vec2(1.0))) {
      clr += vec4(vec3(1.0), 0.7 + 0.3 * sleepCycle) * texture2D(tiles, mix(
        vec2(1.0, (1.0+tile) / 8.0), // uv to
        vec2(0.0, tile / 8.0), // uv from
        p2 // the position
      ));
    }
  }

  return d>0.0 ? vec4(vec3(0.3 + 1.2 * length(clr.rgb), 0.2, 0.1), smoothstep(3.0, 1.5, T) * clr.a) : clr;
}

vec2 dispPass (float intensity, float amp, float speed) {
  return intensity * vec2(
    cos(speed*1.1*time+amp*0.9*gl_FragCoord.x+0.5),
    sin(speed*time+amp*gl_FragCoord.y+0.1)
  );
}

vec3 colorFor (int e) {
  if(e==0) return CL[0];
  if(e==1) return CL[1];
  if(e==2) return CL[2];
  if(e==3) return CL[3];
  if(e==4) return CL[4];
  if(e==5) return CL[5];
  if(e==6) return CL[6];
  if(e==7) return CL[7];
  return CL[8];
}

int getState (vec2 pos) {
  vec2 uv = (floor(pos) + 0.5) / WS;
  bool outOfBound = uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0;
  if (outOfBound) return pos.y < 0.0 ? 1 : 0;
  float cel = texture2D(state, uv).r;
  return int(floor(.5 + 9. * cel));
}

vec3 stateColorPass (int e, vec2 pos) {
  return (
    mix(1.0, rand(pos), 0.05*float(e==1) + 0.2*float(e==8)) +
    float(e==8) * (
      step(0.97, rand(pos)) * vec3(3.0, 0.0, 0.0) +
      step(rand(pos), 0.02) * vec3(1.5, -0.5, 0.5)
    )
  ) * colorFor(e);
}


bool logo (vec2 p, vec2 pos, float size) {
  p = (p - pos) / size;

  return 0.0 < p.y && p.y < 1.0 && (
        
    0.8 < p.x && p.x < 1.0 ||

    1.2 < p.x && p.x < 1.4 ||
    1.2 < p.x && p.x < 2.0 && 0.0 < p.y && p.y < 0.2 ||
    1.2 < p.x && p.x < 2.0 && 0.4 < p.y && p.y < 0.6 ||
    1.2 < p.x && p.x < 1.8 && 0.8 < p.y && p.y < 1.0 ||
    1.6 < p.x && p.x < 1.8 && 0.6 < p.y && p.y < 1.0 ||
    1.8 < p.x && p.x < 2.0 && 0.0 < p.y && p.y < 0.4 ||

    2.2 < p.x && p.x < 2.4 ||
    2.2 < p.x && p.x < 3.0 && 0.0 < p.y && p.y < 0.2 ||
    2.2 < p.x && p.x < 2.8 && 0.4 < p.y && p.y < 0.6 ||
    2.2 < p.x && p.x < 3.0 && 0.8 < p.y && p.y < 1.0 ||

    3.2 < p.x && p.x < 3.4 && !(0.4 < p.y && p.y < 0.6) ||
    3.6 < p.x && p.x < 3.8 && !(0.4 < p.y && p.y < 0.6) ||
    3.4 < p.x && p.x < 3.6 && 0.4 < p.y && p.y < 0.6
  );
}

vec2 cursorCenter = RES / vec2(2.0, 2.0);

vec4 cursorUI (vec2 p, vec3 clr) {
  float radius = 6. * ZM;
  float dist = distance(p, cursorCenter);
  vec3 c = colorFor(DO);
  vec3 c2 = 1.2 * (0.1 + c);
  if (dist < radius - 4.0) {
    return vec4(1.2 * mix(clr * c2, c, 0.6 - 0.3 * float(DR)), 1.0);
  }
  else if (dist < radius) {
    return vec4(c2 - 0.6 * clr, 1.0);
  }
  return vec4(0.0);
}

vec4 elements (vec2 p, vec3 clr) {
  float radius = 4. * ZM;
  float margin = 8.;
  float s = 2.*radius+margin;
  vec2 center = cursorCenter - vec2(0.0, 14.0 * ZM);
  vec2 size = vec2(8.*radius + 3.*margin, 2.*radius);
  p = p - center + size / 2.0;
  if (p.x < 0.0 || p.x > size.x || p.y < 0.0 || p.y > size.y) return vec4(0.0);
  float i = floor(p.x / s);
  float d = float(int(i) == DO);
  center = vec2(s * i, 0.0) + vec2(radius);
  float dist = distance(p, center);
  vec3 c = colorFor(int(i));
  c = 1.1 * (c + mix(0.0, 0.1, d)) + 0.4 * c;
  if (dist < radius * mix(0.6, 1.0, d)) {
    return vec4(c, 0.5);
  }
  return vec4(0.0);
}

vec4 bounds (vec2 from, vec2 to) {
  float x1 = min(from.x, to.x);
  float x2 = max(from.x, to.x);
  float y1 = min(from.y, to.y);
  float y2 = max(from.y, to.y);
  return vec4(x1, y1, x2, y2);
}

bool inRect (vec2 p, vec2 a, vec2 b) {
  return a.x <= p.x && p.x <= b.x &&
         a.y <= p.y && p.y <= b.y;
}

float rect (vec2 p, float border, vec2 a, vec2 b) {
  return float(inRect(p, a, b) && !inRect(p, a+border, b-border));
}

vec4 radar (vec2 p, vec2 from, vec2 to) {
  vec4 boundsRes = bounds(from, to);
  from = boundsRes.xy;
  to = boundsRes.zw;
  if (!inRect(p, from, to)) return vec4(0.0);

  vec2 radarSize = to - from;
  vec2 uv = (p - from) / radarSize;
  vec2 statePos = WS * uv;
  int e = getState(statePos);
  vec3 pixel = colorFor(e);

  vec2 realSize = WS * ZM;
  vec4 CMBoundsRes = bounds(radarSize * CM / realSize, radarSize * (CM+RES) / realSize);
  vec2 CMA = from + CMBoundsRes.xy;
  vec2 CMB = from + CMBoundsRes.zw;

  float animalInGroup = 0.0;
  float animalToBeRescue = 0.0;
  float animalDead = 0.0;
  for (int i=0; i<30; ++i) { if (i >= AL) break;
    float dist = distance(vec2(AN[7*i+0], AN[7*i+1]), statePos);
    float status = AN[7*i+4];
    if (status < 0.0)
      animalToBeRescue += float(dist <= 6.0);
    else if (status == 0.0)
      animalInGroup += float(dist <= 4.0);
    else
      animalDead += float(dist <= 4.0);
  }

  vec4 bg =
    vec4(mix(CL[0], 1.2 * (0.1 + pixel.rgb), 0.7), 1.0);

  vec4 front =
    float(animalToBeRescue > 0.0) * vec4(0.2, 1.0, 0.2, 1.0)
    + float(animalDead > 0.0) * vec4(1.0, 0.2, 0.1, 1.0)
    + float(animalInGroup > 0.0) * vec4(1.0, 1.0, 0.3, 1.0)
    + rect(p, 2.0, from, to)
    + rect(p, 1.0, CMA, CMB);

  vec4 c = mix(bg, front, front.a);
  return vec4(c.rgb, c.a * 0.8);
}

float attenuation (float dist, float constantAttenuation, float linearAttenuation, float quadraticAttenuation) {
  return 1.0 / (constantAttenuation + linearAttenuation * dist + quadraticAttenuation * dist * dist);
}

void main () {
  vec2 p = gl_FragCoord.xy;
  vec2 disp = vec2(0.0);

  bool lgo = false;
  float s;
  vec2 logoP;
  vec2 grad;
  vec4 clr;

  if (!ST || GO) {
    if (GO) {
      s = 64.0;
      logoP = vec2((RES.x - 4.0 * s)/2.0, RES.y - s * 1.4);
    }
    else {
      s = 140.0;
      logoP = (RES-vec2(4.4 * s, s))/2.0;
    }
    grad = vec2(3.0*s, 1.6 * s);
    if (logo(p, logoP, s)) {
      lgo = true;
    }
  }
  if (lgo) {
    disp += dispPass(1.0, 0.1, 2.0);
  }

  float uiMatchAlpha = 0.0;
  if (ST && !GO) {
    uiMatchAlpha = cursorUI(p, vec3(0.0)).a;
    if (uiMatchAlpha > 0.) {
      disp += dispPass(1.6, 0.08, 3.0);
    }
  }

  // Compute where the CM/ZM is in the state texture
  vec2 statePos = (p + disp + CM) / ZM;
  vec2 statePosFloor = floor(statePos);
  vec3 stateColor = stateColorPass(getState(statePosFloor), statePosFloor);

  vec2 pixelPos = fract(statePos);

  vec3 c = stateColor;

  vec3 noiseColor = vec3(0.02) * vec3(
    rand(ZM*floor(p/ZM)+time/31.0),
    rand(ZM*floor(p/ZM)+time/80.1),
    rand(ZM*floor(p/ZM)+time/13.2)
  );
  vec3 pixelColor = -vec3(0.03) * (pixelPos.x - pixelPos.y);

  vec4 animalsColor = vec4(0.0);

  float lightAttenuation = attenuation(distance(
    cursorCenter,
    p
  ), 0.00001, 0.003, 0.00001);

  for (int i=0; i<30; ++i) { if (i >= AL) break;
    vec2 animalPos = vec2(
        AN[7*i+0],
        AN[7*i+1]);
    float T = AN[7*i+5];
    float d = AN[7*i+4];
    vec4 c = animal(
        statePos,
        animalPos,
        vec2(
        AN[7*i+2],
        AN[7*i+3]),
        d,
        T,
        AN[7*i+6],
        1.0);

    float dist = distance(
      animalPos,
      statePos
    );
    lightAttenuation += smoothstep(2.0, 0.0, T) * attenuation(distance(
      animalPos,
      statePos
    ), 0.0, 0.05, 0.001);

    animalsColor = mix(animalsColor, c, c.a);
  }

  vec3 worldColor = c + noiseColor + pixelColor;
  c = animalsColor.a==0.0 ? worldColor : mix(worldColor, animalsColor.rgb, min(1.0, animalsColor.a));

  c = mix(CL[0], c, min(1.0, lightAttenuation)
    * smoothstep(WS.x, WS.x-100.0, statePos.x)
    * smoothstep(0.0, 50.0, statePos.x));

  if (uiMatchAlpha > 0.0) {
    clr = cursorUI(p, c);
    c = mix(c.rgb, clr.rgb, clr.a);
  }

  if (!ST || GO) {
    if (lgo) {
      c = 1.4 * (0.4 + 0.8*c);
    }
    else if (logo(gl_FragCoord.xy, logoP+vec2(8.0, -8.0), s)) {
      c = vec3(0.0);
    }
  }

  vec2 scorePos = p;
  if (GO) {
    scorePos -= (RES - RES / vec2(6.0, 36.0)) / 2.;
  }
  if (number6(score, (scorePos/RES) * 128. * vec2(1,RES.y/RES.x)) > 0.0) {
    c = mix(vec3(1.0, 0.5, 0.3), vec3(1.0, 0.3, 1.0), float(!ST)) + 0.3 * (1.0-c);
  }

  float divider = 150.0;
  float counterMult = 0.015 * RES.x;
  vec2 counterPos = p - RES + vec2(4.0 * counterMult, 2.5);
  if (!GO && ST) {
    clr = elements(p, c);
    c = mix(c.rgb, clr.rgb, clr.a);

    clr = animal(p, RES - vec2(2.0, 3.0) * counterMult, vec2(0.0), 0.0, 0.0, 0.0, 0.3 * counterMult);
    c = mix(c, clr.rgb + 0.2 - 0.3 * c, clr.a);

    if (number2(alive, (counterPos/RES) * divider * vec2(1,RES.y/RES.x)) > 0.0) {
      c = 0.5 + 0.5 * (1.0-c);
    }
  }

  if (ST) {
    if (GO || TR > 0.0) {
      counterPos += vec2(0.0, 4.0 * counterMult);
      clr = animal(p, RES - vec2(2.0, 7.0) * counterMult, vec2(0.0), -1.0, 0.0, 0.0, 0.3 * counterMult);
      c = mix(c, clr.rgb + 0.2 - 0.3 * c, clr.a);
      if (number2(TR, (counterPos/RES) * divider * vec2(1,RES.y/RES.x)) > 0.0) {
        c = vec3(0.0, 1.0, 0.0) + 0.5 * (1.0-c);
      }
    }
  }

  if (!GO && ST) {
    vec2 radarSize = vec2(RES.y / 6.0) * vec2(WS.x/WS.y, 1.0);
    vec2 radarFrom = vec2(10.0, RES.y - 10.0);
    clr = radar(p, radarFrom, radarFrom + radarSize * vec2(1.0, -1.0));
    c = mix(c, clr.rgb, clr.a);
  }
  
  gl_FragColor = vec4(c, 1.0);
}


