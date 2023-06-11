#define RAND (S_=vec2(rand(S_), rand(S_+9.))).x
#define AnyADJ(e) (NW==e||SE==e||NE==e||SW==e||NN==e||SS==e||EE==e||WW==e)

precision highp float;

/**
  * Game Rule Interactions.
  *
  * Each interaction use various probability. Some are very rare, some frequent.
  /!\ here air means wind /!\ it is different of empty, the empty space is called "Nothing" aka N)
  *
  * Primary elements: Water, Fire, Earth, Air
  * =======
  * Water + Nothing => fall / slide
  * Fire + Nothing => grow
  * Air + Nothing => move (directional wind)
  * Water + Air => Water is deviated (wind)
  * Fire + Air => Fire decrease
  * Earth + Water => rarely creates Water Source (water infiltration)
  * Earth + Fire => rarely creates Volcano (fire melt ground into lava)
  *
  * Secondary elements: Source, Volcano
  * =========
  * Source + Nothing => creates Water (on bottom).
  * Volcano + Nothing => creates Fire (on top)
  * Volcano + Source => IF source on top of volcano: sometimes creates Ground. OTHERWISE: sometimes creates volcano.
  * Volcano + Water => rarely creates Source.
  * Earth + Volcano => rarely Volcano expand / grow up in the Earth.
  * Earth + Source => rarely Source expand / infiltrate in the Earth.
  * Source + Fire => Source die.
  *
  * Cases where nothing happens:
  * Water + Fire
  * Earth + Nothing
  * Volcano + Fire
  * Volcano + Air
  * Earth + Air
  * Source + Air
  * Source + Water
  */

// Elements
int A  = 0;
int E  = 1;
int F  = 2;
int W  = 3;
int V  = 4;
int S  = 5;
int Al = 6;
int Ar = 7;
int G  = 8;

uniform vec2 SZ;
uniform float SD;
uniform float TI;
uniform float TS;
uniform float ST;
uniform sampler2D state;
uniform bool RU;

uniform bool draw;
uniform ivec2 DP;
uniform float DR;
uniform int DO;

int get (int x_, int y_) {
  vec2 uv = (gl_FragCoord.xy + vec2(x_, y_)) / SZ;
  return (uv.x < 0.0 || uv.x >= 1.0 || uv.y < 0.0 || uv.y >= 1.0) ? 0 : 
    int(floor(.5 + 9. * texture2D(state, uv).r));
}

bool between (float f, float a, float b) {
  return a <= f && f <= b;
}

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float grassDistrib (vec2 p) {
  return mix(
  rand(vec2(p.x)),
  0.5*(1.0+(cos(sin(p.y*0.01 + p.x * 0.05) + (1.0 + 0.3*sin(p.x*0.01)) * p.y * 0.08))),
  0.6
  );
}

bool hellTriggerPosition (vec2 p) {
  if (TS==0.0) return false;
  float hellTickStart = 800.0;
  float hellTickInterv = 70.0;
  float hellSize = 5.0;
  float dt = TI - TS - hellTickStart;
  float x = floor(dt / hellTickInterv);
  float y = (dt - x * hellTickInterv);
  return distance(vec2(2.0 * (hellSize * x - ST), hellSize * y), p) <= hellSize;
}

void main () {
  vec2 p = gl_FragCoord.xy;
  vec2 S_ = p + 0.001 * TI;
  
  int NW = get(-1, 1);
  int NN = get( 0, 1);
  int NE = get( 1, 1);
  int WW = get(-1, 0);
  int CC = get( 0, 0);
  int EE = get( 1, 0);
  int SW = get(-1,-1);
  int SS = get( 0,-1);
  int SE = get( 1,-1);

  bool prevIsSolid = CC==E||CC==G||CC==V||CC==S;

  int r = A;

  int grassMaxHeight = int(20.0 * pow(grassDistrib(p), 1.3));
  float rainRelativeTime = mod(TI, 300.0);
  float volcRelativeTime = mod(TI, 25.0);

  //////// FIRE RULES ///////

  // Fire grow / Fire + Water
  if (
    -0.05 * float(NW==W) + -0.40 * float(NN==W) + -0.05 * float(NE==W) + // If water drop...
    -0.50 * float(WW==W) + -0.50 * float(CC==W) + -0.50 * float(EE==W) + // ...or water nearby.
     0.35 * float(SW==F) +  0.90 * float(SS==F) +  0.35 * float(SE==F)   // Fire will move up and expand a bit.
   >= 0.9 - 0.6 * RAND // The sum of matched weights must be enough important, also with some randomness
   
   ||  // Fire propagation: When fire met grass, fire can stay to continue to consume it

   CC == F && RAND < 0.9 && AnyADJ(G)
  ) {
    r = F;
  }


  ////// WATER RULES ///////

  if (
  // Water drop / Water + Fire
    between(
      0.3 * float(NW==W) +  0.9 * float(NN==W) +  0.3 * float(NE==W) +
      0.1 * float(WW==W) + -0.3 * float(CC==F) +  0.1 * float(EE==W) +
                           -0.3 * float(SS==F)  
      ,
      0.9 - 0.6 * RAND,
      1.4 + 0.3 * RAND
    )

    || // Water flow on earth rules

    !prevIsSolid &&
    RAND < 0.98 &&
    ( (WW==W||NW==W) && SW==E || (EE==W||NE==W) && SE==E )

    || // Occasional rain
    !prevIsSolid &&
    p.y >= SZ.y-1.0 &&
    rainRelativeTime < 100.0 &&
    between(
      p.x - 
      (rand(vec2(SD*0.7 + TI - rainRelativeTime)) * SZ.x) // Rain Start
      ,
      0.0, 
      100.0 * rand(vec2(SD + TI - rainRelativeTime)) // Rain Length
    )
    
    || // Source creates water
    !prevIsSolid && (
      0.9 * float(NW==S) +  1.0 * float(NN==S) +  0.9 * float(NE==S) +
      0.7 * float(WW==S) +                        0.7 * float(EE==S)
      >= 1.0 - 0.3 * RAND
    )
  ) {
    r = W;
  }

  ////// EARTH RULES ////

  if (CC == E) {
    // Hack to workaround with the bug in the terrain seamless
    if (!(WW==A && EE==A)) r = E;

    // Earth -> Source
    if (
      // water sometimes create sources
      RAND < 0.3 && (
        1.0 * float(NW==W) + 1.2 * float(NN==W) + 1.0 * float(NE==W) +
        0.5 * float(WW==W) +                      0.5 * float(EE==W) +
        0.3 * float(SW==W) + 0.2 * float(SS==W) + 0.3 * float(SE==W)  
        >= 3.0 - 2.5 * RAND
      )

      ||

      // Source is going down
      RAND < 0.01 && ( WW==S || NN==S || EE==S )
    ) {
      r = S;
    }

    // Earth -> Volcano
    if (
    RAND < 0.006 + 0.02 * smoothstep(0.0, 10000.0, ST + p.x) && (
      0.3 * float(NW==F) + 0.2 * float(SS==F) + 0.3 * float(NE==F) +
      0.5 * float(WW==F) +                      0.5 * float(EE==F) +
      1.0 * float(SW==F) + 1.2 * float(NN==F) + 1.0 * float(SE==F)
      >= 3.0 - 2.1 * RAND
    )

    ||

    // Volcano is going up
    RAND < 0.01 + 0.02 * smoothstep(500.0, 5000.0, ST + p.x) && ( int(WW==V) + int(SS==V) + int(EE==V) + int(SE==V) + int(SW==V) > 1 )
    ) {
      r = V;
    }
  }
  
  ////// Grass RULES ////
  if (grassMaxHeight > 0) {
    if (CC == G) {
      r = G;
      if (
      CC == G &&
      RAND < 0.9 && (
        AnyADJ(F) ||
        AnyADJ(V)
      )) {
        r = F;
      }
    }
    else if (!prevIsSolid && (AnyADJ(E) || AnyADJ(G) || AnyADJ(S))) {
      if (RAND < 0.03 &&
        get(0, -grassMaxHeight) != G && (
          SS==G && RAND < 0.07 || // The grass sometimes grow
          SS==E && RAND < 0.02 || // The grass rarely spawn by itself
          AnyADJ(W) ||
          AnyADJ(S)
        )
      ) {
        r = G;
      }
    }
  }


  ////// VOLCANO RULES /////
  
  // Volcano creates fire
  if ((!prevIsSolid || CC==F) && SS==V) {
    r = F;
  }

  if (CC == V) {
    r = V;

    // if Water: Volcano -> Earth
    if (
      NW==W || NN==W || NE==W || EE==W || WW==W
    ) {
      r = RAND < 0.8 ? S : E;
    }

    // cool down: Volcano -> Earth
    if (
      RAND<0.005 &&
      ( int(SW==F||SW==V) + int(SS==F||SS==V) + int(SE==F||SE==V) < 2 )
    ) {
      r = E;
    }

    // Volcano <-> Source : A volcano can disappear near source
    if (
      int(NW==S) + int(SE==S) + int(NE==S) + int(SW==S) + int(NN==S) + int(SS==S) + int(EE==S) + int(WW==S)
      > 1
    ) {
      r = RAND < 0.2 ? V : (RAND < 0.8 ? S : E);
    }
  }

  // Occasional volcano
  if (prevIsSolid &&
    p.y <= 2.0 &&
    volcRelativeTime <= 1.0 &&
    RAND < 0.3 &&
    between(
      p.x -
      rand(vec2(SD*0.01 + TI - volcRelativeTime)) * SZ.x // Volc start
      ,
      0.0,
      10.0 * rand(vec2(SD*0.07 + TI - volcRelativeTime)) // Volc length
    )
  ) {
    r = V;
  }

  ////// SOURCE RULES /////

  if (CC == S) {
    r = S;

    // Dry: Source -> Earth
    if (
      RAND<0.06 &&
      ( int(NW==W||NW==S) + int(NN==W||NN==S) + int(NE==W||NE==S) < 1 )

      || // if Fire: Source -> Earth
      ( EE==F || WW==F || SS==F || SW==F || SE==F )
    ) {
      r = E;
    }

    // Volcano <-> Source : A source can disappear near volcano
    if (AnyADJ(V)) {
      r = RAND < 0.15 ? V : (RAND < 0.6 ? S : E);
    }
  }

  ////// AIR RULES //////
  if (r == A) {
    if (RAND < 0.00001) r = Al;
    if (RAND < 0.00001) r = Ar;
  }

  int wind = r==Al ? Al : r == Ar ? Ar : 0;
  float f =
    (-0.1+0.05*(RAND-0.5)) * float(NW==Ar) +     0.12                  * float(NE==Al) +
    -0.65                  * float(WW==Ar) +     0.65                  * float(EE==Al) +
    -0.1                   * float(SW==Ar) +     (0.2+0.05*(RAND-0.5)) * float(SE==Al) ;

  if (between(f, 0.4 * RAND, 0.95)) {
    wind = Al;
  }
  else if (between(f, -0.95, -0.4 * RAND)) {
    wind = Ar;
  }

  if (wind != 0) {
    if (r == A) {
      r = wind;
    }
    else if(r == F) {
      if (RAND < 0.4) r = wind;
    }
    else if (r == W) {
      if (RAND < 0.1) r = wind;
    }
  }

  //// DRAW //////

  if (draw) {
    vec2 pos = floor(p);
    if (distance(pos, vec2(DP)) <= DR) {
      if (DO == W) {
        if (prevIsSolid && CC!=G) {
          r = S;
        }
        else if (!prevIsSolid && mod(pos.x + pos.y, 2.0)==0.0) {
          r = W;
        }
      }
      else if (DO == F) {
        r = prevIsSolid ? V : F;
      }
      else {
        r = DO;
      }
    }
  }

  //// Hell /////

  if (hellTriggerPosition(p)) {
    r = prevIsSolid ? V : F;
  }

  ///// keep only simple elements when not RU /////
  if (!RU) {
    if (r == F || r == W|| r == G) r = A;
    if (r == V || r == S) r = E;
  }

  ///// Return the color result /////

  gl_FragColor = vec4(float(r) / 9.0,  0.0, 0.0, 1.0);
}

