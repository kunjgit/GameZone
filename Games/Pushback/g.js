!(function () {
  const e = [];
  (e[0] = {
    sF: "void title(vec2 u,inout float r){float w=0.05;dL(r,u,vec2(-0.5,0.73),vec2(-0.5,0.51),w);dL(r,u,vec2(-0.21,0.6),vec2(-0.21,0.72),w);dL(r,u,vec2(-0.09,0.6),vec2(-0.09,0.72),w);dL(r,u,vec2(0.37,0.71),vec2(0.37,0.51),w);dL(r,u,vec2(0.38,0.61),vec2(0.48,0.61),w);dL(r,u,vec2(0.49,0.71),vec2(0.49,0.51),w);dL(r,u,vec2(-0.5,0.38),vec2(-0.5,0.14),w);dL(r,u,vec2(-0.22,0.15),vec2(-0.16,0.37),w);dL(r,u,vec2(-0.16,0.37),vec2(-0.08,0.15),w);dL(r,u,vec2(-0.19,0.26),vec2(-0.12,0.26),w);dL(r,u,vec2(0.37,0.37),vec2(0.37,0.14),w);dL(r,u,vec2(0.42,0.25),vec2(0.49,0.37),w);dL(r,u,vec2(0.42,0.25),vec2(0.49,0.14),w);w=1.5;dD(r,u,vec2(-0.42,0.67),0.06,0.5,0.64,w);dD(r,u,vec2(-0.15,0.57),0.06,0.75,0.52,w);dD(r,u,vec2(0.15,0.66),0.06,0.11,0.64,w);dD(r,u,vec2(0.15,0.55),0.06,0.63,0.64,w);dD(r,u,vec2(-0.42,0.21),0.06,0.5,0.64,w);dD(r,u,vec2(-0.43,0.33),0.05,0.5,0.64,w);w=1.0;dD(r,u,vec2(0.17,0.25),0.11,0.,0.56,w);}float tH(vec2 u){float r=-1.;title(u,r);fT(u,r);return r;}vec2 wC(vec2 u){return vec2(fn(u*4.-99.,6.3,6.),fn(u*4.+99.,6.3,6.))*.5-.25;}vec4 oS(vec2 u){vec4 r=vec4(0.);float a=0.;title(u+vec2(.0,.6),a);r+= float(a>.2)*vec4(.4,.6,.4,1.);return r;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
    wQ: 0.5,
    bC: [100, 170, 100, 1],
    dC: [1, 1],
  }),
    (e[1] = {
      sF: "float tH(vec2 u){float r=-1.;float w=0.05;dL(r,u,-vec2(0.85,0.38),-vec2(0.38,0.85),w);dL(r,u,-vec2(0.85,0.38),vec2(0.38,0.85),w);dL(r,u,-vec2(0.38,0.85),vec2(0.85,0.38),w);fT(u,r);return r;}vec2 wC(vec2 u){return vec2(0.);}vec4 oS(vec2 u){vec4 r=vec4(0.);vec2 a;float angle=0.78;vec2 dir=sin(angle+vec2(0.,1.57));a=(u+vec2(.4,.4))*12.;a=a*mat2(dir,dir.yx*vec2(-1.,1.));a=vec2(max(abs(a.x)-1.,0.),a.y);a=abs(a);r+= float(1.-a.y-a.x>=0.)*bC();return r;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 0.5,
      bC: [100, 170, 100, 1],
      dC: [1, 1],
    }),
    (e[2] = {
      sF: "float tH(vec2 u){float r=-1.;float w=0.3;dD(r,u,vec2(-0.59,-0.05),0.35,0.08,0.76,w);dD(r,u,vec2(0.05,0.58),0.35,0.91,0.34,w);dD(r,u,vec2(0.06,0.59),0.35,0.34,0.34,w);fT(u,r);return r;}vec2 wC(vec2 u){vec2 v=vec2(.0);drawCurrent(v,u,vec2(-0.28,-0.35),vec2(2.1,2.1),vec2(-0.69,0.72));return v;}vec4 oS(vec2 u){vec4 r=vec4(0.);vec2 a;float angle=-.78;vec2 dir=sin(angle+vec2(0.,1.57));a=(u+vec2(.0,-.6))*12.;a=a*mat2(dir,dir.yx*vec2(-1.,1.));a=vec2(max(abs(a.x)-1.,0.),a.y);a=abs(a);r+= float(1.-a.y-a.x>=0.)*bC();dir=sin(angle+vec2(0.,1.57));a=(u+vec2(.6,.0))*12.;a=a*mat2(dir,dir.yx*vec2(-1.,1.));a=vec2(max(abs(a.x)-1.,0.),a.y);a=abs(a);r+= float(1.-a.y-a.x>=0.)*bC();a=(u+vec2(-.35,-.25))*12.;r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);return r;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 0.5,
      bC: [100, 170, 100, 1],
      dC: [1, -1],
    }),
    (e[3] = {
      sF: "float tH(vec2 u){float r=-1.;float w=0.05;dL(r,u,vec2(0.96,0.92),vec2(0.26,0.92),w);dL(r,u,vec2(0.26,0.92),vec2(0.26,0.31),w);dL(r,u,vec2(0.26,0.31),vec2(0.96,0.31),w);dL(r,u,vec2(-0.99,0.92),vec2(-0.26,0.92),w);dL(r,u,vec2(-0.26,0.92),vec2(-0.24,-0.98),w);fT(u,r);return r;}vec2 wC(vec2 u){vec2 v=vec2(.0);drawCurrent(v,u,vec2(0.63,0.01),vec2(2.53,1.33),vec2(0.,-1.)*.3);drawCurrent(v,u,vec2(-0.63,-0.61),vec2(2.64,2.94),vec2(1.,0.03)*.3);return v;}vec4 oS(vec2 u){vec4 r=vec4(0.);vec2 a;float w=0.05;float angle=-.78*2.;vec2 dir=sin(angle+vec2(0.,1.57));a=(u+vec2(-.6,-.6))*12.;a=a*mat2(dir,dir.yx*vec2(-1.,1.));a=vec2(max(abs(a.x)-1.,0.),a.y);a=abs(a);r+= float(1.-a.y-a.x>=0.)*bC();a=(u+vec2(.6,.2))*10.;r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);return r;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 0.5,
      bC: [100, 170, 100, 1],
      dC: [-1, -1],
    }),
    (e[4] = {
      sF: "float tH(vec2 u){float r=-1.;float w=0.05;dL(r,u,vec2(-0.98,-0.55),vec2(0.,-0.32),w);dL(r,u,vec2(-0.69,-0.97),vec2(0.31,-0.74),w);dL(r,u,vec2(0.98,-0.43),vec2(0.64,-0.43),w);dL(r,u,vec2(0.64,-0.43),vec2(-0.04,0.23),w);dL(r,u,vec2(-0.04,0.23),vec2(-0.94,0.02),w);dL(r,u,vec2(0.97,0.06),vec2(0.97,0.97),w);dL(r,u,vec2(0.97,0.97),vec2(0.42,0.97),w);dL(r,u,vec2(0.42,0.97),vec2(0.44,0.24),w);dL(r,u,vec2(0.44,0.25),vec2(-0.13,0.84),w);fT(u,r);return r;}vec2 wC(vec2 u){vec2 v=vec2(.0);drawCurrent(v,u,vec2(0.63,0.01),vec2(2.53,1.33),vec2(0.,-1.)*.3);drawCurrent(v,u,vec2(-0.63,-0.61),vec2(2.64,2.94),vec2(1.,0.03)*.3);return v;}vec4 oS(vec2 u){vec4 r=vec4(0.);vec2 a;float w=0.05;r+= drawBoat(r,u,vec2(0.75,0.76),7.68)*bC();a=(u+vec2(0.04,-0.46))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(0.15,-0.33))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(-0.13,-0.24))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(-0.38,-0.3))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(-0.68,-0.31))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(-0.55,-0.1))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(-0.19,-0.01))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(0.17,-0.13))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(0.3,-0.59))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(0.44,-0.47))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(-0.59,0.27))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(-0.65,0.48))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(-0.34,0.67))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(-0.16,0.67))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(-0.21,0.39))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(0.12,0.31))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(0.26,0.07))*(1./0.03);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);return r;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 0.5,
      bC: [100, 170, 100, 1],
      dC: [-1, 1],
    }),
    (e[5] = {
      sF: "float tH(vec2 u){float r=-1.;float w=0.24;dD(r,u,vec2(0.33,-0.34),0.25,0.63,0.24,w);w=0.1;dD(r,u,vec2(0.31,-0.33),0.6,0.63,0.24,w);w=0.03;dL(r,u,vec2(0.32,-0.93),vec2(-0.75,-0.93),w);dL(r,u,vec2(-0.75,-0.59),vec2(0.34,-0.59),w);dL(r,u,vec2(0.91,-0.37),vec2(0.98,0.7),w);dL(r,u,vec2(0.58,-0.36),vec2(0.65,0.7),w);fT(u,r);return r;}vec2 wC(vec2 u){vec2 v=vec2(0.);return v;}vec4 oS(vec2 u){vec4 r=vec4(0.);vec2 a;a=(u+vec2(0.6,0.4))/0.1;r+= float(1.-length(a)>=0.)*vec4(.7,.4,.4,1.);a=(u+vec2(0.8,0.75))/0.1;r+= float(1.-length(a)>=0.)*bC();a=(u+vec2(0.5,0.75))/0.1;r+= float(1.-length(a)>=0.)*vec4(.6,.3,.6,1.);a=(u+vec2(0.2,0.75))/0.1;r+= float(1.-length(a)>=0.)*vec4(.8,.8,.4,1.);a=(u+vec2(-0.1,0.75))/0.1;r+= float(1.-length(a)>=0.)*bC();a=(u+vec2(-0.4,0.75))/0.1;r+= float(1.-length(a)>=0.)*vec4(.4,.4,.7,1.);r+= float(abs(u.y+.1)<.05)*vec4(.6,.3,.6,1.);r+= float(abs(u.y-.2)<.05)*vec4(.8,.8,.4,1.);r+= float(abs(u.y-.5)<.05)*vec4(.7,.4,.4,1.);return r;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 0.8,
      bC: [100, 170, 100, 1],
      dC: [1, 1],
      bL: [{ w: 100, h: 80, l: 0, t: 0 }],
    }),
    (e[6] = {
      sF: "float tH(vec2 u){float r=-1.;float w=0.15;dD(r,u,vec2(-0.13,0.09),0.69,0.14,0.24,w);dD(r,u,vec2(-0.14,0.1),0.68,0.39,0.24,w);w=0.24;dD(r,u,vec2(-0.09,0.12),0.42,0.14,0.24,w);dD(r,u,vec2(-0.1,0.13),0.41,0.40,0.26,w);w=0.05;dL(r,u,vec2(-0.81,0.2),vec2(-0.81,-0.3),w);dL(r,u,vec2(-0.51,0.19),vec2(-0.52,-0.3),w);dL(r,u,vec2(0.3,0.12),vec2(0.3,-0.29),w);dL(r,u,vec2(0.54,0.06),vec2(0.53,-0.29),w);fT(u,r);return r;}vec4 oS(vec2 u){vec4 r=vec4(0.);float w=0.05;vec4 color=vec4(.8,.8,.1,1.);vec2 a=(u+vec2(0.14,-0.65))*(1./0.09);r+= float(1.-length(a)>=0.)*vec4(.8,.8,.1,1.);a=(u+vec2(-0.42,0.13))*(1./0.08);r+= float(1.-length(a)>=0.)*vec4(.6,.4,.4,1.);a=(u+vec2(-0.41,-0.22))*(1./0.06);r+= float(1.-length(a)>=0.)*bC();float t=.0;dL(t,u,vec2(0.3,-0.28),vec2(0.53,-0.29),w);r=max(r,float(t>.8)*vec4(.1,.1,.8,.5));dL(t,u,vec2(-0.81,0.12),vec2(-0.51,0.12),w);r=max(r,float(t>.8)*vec4(.1,.1,.8,.5));dL(t,u,vec2(-0.81,-0.29),vec2(-0.52,-0.29),w);r=max(r,float(t>.8)*vec4(.1,.1,.8,.5));return r;}vec2 wC(vec2 u){vec2 v=vec2(.0);return v;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 0.8,
      bC: [100, 170, 100, 1],
      dC: [-1, -1],
      bL: [
        { w: 100, h: 50, l: 0, t: 0 },
        { w: 50, h: 50, l: 50, t: 50 },
      ],
    }),
    (e[7] = {
      sF: "float tH(vec2 u){float r=-1.;float a=.02;dL(r,u,vec2(.63,.5),vec2(.75,.63),a);dL(r,u,vec2(.75,.63),vec2(.88,.5),a);dL(r,u,vec2(.63,.75),vec2(.38,1.),a);dL(r,u,vec2(.88,.25),vec2(1.,.38),a);dL(r,u,vec2(.75,.38),vec2(.63,.25),a);dL(r,u,vec2(.63,.25),vec2(.88,0.),a);dL(r,u,vec2(.88,-.25),vec2(1.,-.12),a);dL(r,u,vec2(.5,.13),vec2(.63,0.),a);dL(r,u,vec2(.5,.13),vec2(.38,0.),a);dL(r,u,vec2(.38,0.),vec2(.5,-.12),a);dL(r,u,vec2(.75,-.12),vec2(.63,-.25),a);dL(r,u,vec2(.88,-.25),vec2(1.,-.37),a);dL(r,u,vec2(1.,-.62),vec2(1.,-.62),a);dL(r,u,vec2(.75,-.37),vec2(1.,-.62),a);dL(r,u,vec2(.75,-.37),vec2(.38,-.75),a);dL(r,u,vec2(.5,-.37),vec2(0.,.13),a);dL(r,u,vec2(-.12,0.),vec2(0.,.13),a);dL(r,u,vec2(-.12,-.25),vec2(0.,-.12),a);dL(r,u,vec2(0.,-.12),vec2(.13,-.25),a);dL(r,u,vec2(-.12,-.25),vec2(0.,-.37),a);dL(r,u,vec2(.13,-.5),vec2(.25,-.37),a);dL(r,u,vec2(.25,-.37),vec2(.38,-.5),a);dL(r,u,vec2(-.12,-.5),vec2(-.25,-.37),a);dL(r,u,vec2(-.25,-.37),vec2(-.37,-.5),a);dL(r,u,vec2(-.37,-.5),vec2(-.25,-.62),a);dL(r,u,vec2(-.5,-.37),vec2(-.62,-.5),a);dL(r,u,vec2(-.62,-.5),vec2(-.25,-.87),a);dL(r,u,vec2(-.12,-.75),vec2(0.,-.62),a);dL(r,u,vec2(.25,-.62),vec2(.13,-.75),a);dL(r,u,vec2(.13,-.75),vec2(.38,-1.),a);dL(r,u,vec2(.38,-.75),vec2(.5,-.87),a);dL(r,u,vec2(.75,-.87),vec2(.63,-1.),a);dL(r,u,vec2(.75,-.87),vec2(.88,-1.),a);dL(r,u,vec2(0.,-.87),vec2(.13,-1.),a);dL(r,u,vec2(-.5,-.87),vec2(-.37,-1.),a);dL(r,u,vec2(-.5,-.87),vec2(-.62,-1.),a);dL(r,u,vec2(-.87,-1.),vec2(-.87,-1.),a);dL(r,u,vec2(-.75,-.87),vec2(-.87,-1.),a);dL(r,u,vec2(-.87,-.75),vec2(-1.,-.62),a);dL(r,u,vec2(-.87,-.5),vec2(-.62,-.75),a);dL(r,u,vec2(-.87,-.5),vec2(-.75,-.37),a);dL(r,u,vec2(-.87,-.25),vec2(-.75,-.12),a);dL(r,u,vec2(-.75,-.12),vec2(-.62,-.25),a);dL(r,u,vec2(-.87,0.),vec2(-1.,.13),a);dL(r,u,vec2(-.5,.88),vec2(-.62,.75),a);dL(r,u,vec2(-.87,.75),vec2(-1.,.88),a);dL(r,u,vec2(-.75,.88),vec2(-.87,1.),a);dL(r,u,vec2(-.75,.63),vec2(-.87,.5),a);dL(r,u,vec2(0.,-.87),vec2(-.12,-1.),a);dL(r,u,vec2(-.12,1.),vec2(-.12,1.),a);dL(r,u,vec2(0.,.88),vec2(-.12,1.),a);dL(r,u,vec2(-.12,.75),vec2(-.25,.88),a);dL(r,u,vec2(-.25,.88),vec2(-.37,.75),a);dL(r,u,vec2(-.37,.75),vec2(-.25,.63),a);dL(r,u,vec2(.25,.88),vec2(-.12,.5),a);dL(r,u,vec2(-.5,.63),vec2(-.12,.25),a);dL(r,u,vec2(-.5,.63),vec2(-.87,.25),a);dL(r,u,vec2(-.62,0.),vec2(-.5,.13),a);dL(r,u,vec2(-.5,.13),vec2(-.25,-.12),a);dL(r,u,vec2(-.62,0.),vec2(-.37,-.25),a);dL(r,u,vec2(-.87,.25),vec2(-.75,.13),a);dL(r,u,vec2(-.75,.13),vec2(-.5,.38),a);dL(r,u,vec2(.38,.75),vec2(.38,.75),a);dL(r,u,vec2(.25,.63),vec2(.38,.75),a);dL(r,u,vec2(.38,.75),vec2(.5,.63),a);dL(r,u,vec2(.13,.5),vec2(0.,.38),a);dL(r,u,vec2(.13,.5),vec2(.38,.25),a);dL(r,u,vec2(.25,.63),vec2(.38,.5),a);dL(r,u,vec2(0.,.38),vec2(.13,.25),a);fT(u,r);return r;}vec2 wC(vec2 u){return vec2(.0,-.5);}vec4 oS(vec2 u){vec4 r=vec4(0.);vec2 a;a=(u-vec2(.5,-.25))*mat2(-1.,1.,1.,1.)*12.;a=vec2(max(abs(a.x)-2.,0.),a.y);r+= float(1.-dot(a,a)>=0.)*vec4(.8,.5,.3,1.);a=(u-vec2(-.25,-.25))*mat2(1.,1.,-1.,1.)*20.;a=vec2(max(abs(a.x)-6.,0.),a.y);r+= float(1.-dot(a,a)>=0.)*bC();a=(u-vec2(.5,.5))*16.;a=abs(a)-6.;r+= float(1.-dot(a,a)>=0.)*vec4(.9,.4,.4,1.);a=(u-vec2(-.5,.5))*16.;a=abs(a)-6.;r+= float(1.-dot(a,a)>=0.)*vec4(.9,.4,.4,1.);return r;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 1,
      bC: [100, 170, 100, 1],
      dC: [1, 1],
    }),
    (e[8] = {
      sF: "float tH(vec2 u){float r=-1.;vec2 w=u+sin(u.yx*60.)*.02;w=w*3.-vec2(.5,.1);vec2 s=vec2(1.,1.732);vec2 a=mod(w,s)*2.-s;vec2 b=mod(w+s*.5,s)*2.-s;r=1.-min(dot(a,a),dot(b,b))*4.;a=(u-vec2(.49,.04))*9.;if(dot(a,a)<1.){r=max(1.-dot(a,a),0.)*.8-max(1.-dot(a,a)*2.,0.)*.5;}a=(u-vec2(.16,.04))*9.;if(dot(a,a)<1.){r=max(1.-dot(a,a),0.)*.8-max(1.-dot(a,a)*2.,0.)*.5;}fT(u,r);return r;}vec2 wC(vec2 u){return vec2(.0,-.5);}vec4 oS(vec2 u){vec4 r=vec4(0.);vec2 a;a=(u-vec2(.0,.0))*24.;a=abs(a)-12.;a=abs(a)-6.;a.x=max(abs(a.x)-1.,0.);r+= float(1.-dot(a,a)>=0.)*vec4(.9,.2,.2,1.);a=(u-vec2(.49,.04))*20.;r+= float(1.-dot(a,a)>=0.)*bC();a=(u-vec2(.16,.04))*20.;r+= float(1.-dot(a,a)>=0.)*vec4(.5,.2,.5,1.);return r;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 1,
      bC: [100, 170, 100, 1],
      dC: [-1, 1],
    }),
    (e[9] = {
      sF: "float tH(vec2 u){float r=-1.;float w=0.03;dL(r,u,vec2(-0.6,-0.6),vec2(-0.6,0.6),w);dL(r,u,vec2(0.6,-0.6),vec2(0.6,0.6),w);dL(r,u,vec2(-0.6,0.6),vec2(0.6,0.6),w);dL(r,u,vec2(-0.6,-0.6),vec2(-0.1,-0.6),w);dL(r,u,vec2(0.1,-0.6),vec2(0.6,-0.6),w);fT(u,r);return r;}vec4 oS(vec2 u){vec4 r=vec4(0.);vec2 a;a=u*6.;a=abs(a)-1.1;a=abs(a)-1.1;a=abs(a);r+= float(1.-max(a.x,a.y)>=0.)*vec4(.6,.4,.4,1.);a=u*vec2(5.8,2.8)-vec2(0.,.5);a=abs(a);r=max(r-float(1.-max(a.x,a.y)>=0.),vec4(0.));a=(u+vec2(0.,-0.4))/0.05;r+= float(1.-length(a)>=0.)*bC();return r;}vec2 wC(vec2 u){vec2 v=vec2(.0);return v;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 0.8,
      bC: [100, 170, 100, 1],
      dC: [-1, -1],
    }),
    (e[10] = {
      sF: "float tH(vec2 u){vec2 a=(u-vec2(.8,.8))*3.;float r=fn(u*9.-88.,6.3,4.)*5.-4.-max(1.-dot(a,a),0.);fT(u,r);return r;}vec2 wC(vec2 u){return vec2(fn(u*9.+44.,6.3,4.)-.5,fn(u*9.+99.,6.3,4.)-.5)*4.;}vec4 oS(vec2 u){vec4 r=vec4(0.);vec2 a;a=(u-vec2(.5,.5))*32.;a=abs(a)-4.;a=abs(a)-2.;r+= float(1.-dot(a,a)>=0.)*vec4(.9,.2,.2,1.);a=(u+vec2(.2,.2))*24.;a=abs(a)-2.5;r+= float(1.-dot(a,a)>=0.)*bC();return r;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 1,
      bC: [100, 170, 100, 1],
      dC: [1, 1],
    }),
    (e[11] = {
      sF: "float tH(vec2 u){float r=0.;vec2 a;r=max(hex(u*1.8)*10.-max(hex(u*2.)*16.,0.),r);a=(u+vec2(.0,.25))*16.;r=r-max(2.-dot(a,a),0.);fT(u,r);return r;}vec2 wC(vec2 u){return vec2(0.);}vec4 oS(vec2 u){vec4 r=vec4(0.);vec2 a;a=(u+vec2(.0,-.0))*8.;if(r.x==0.)r=float(hex(a)>0.)*vec4(.4,.7,.4,0.);a=(u+vec2(.0,-.0))*4.;if(r.x==0.)r=float(hex(a)>0.)*vec4(.6,.3,.6,1.);a=(u+vec2(.0,-.0))*2.5;if(r.x==0.)r=float(hex(a)>0.)*vec4(.4,.6,.4,1.);a=(u+vec2(.0,-.0))*1.5;r+=float(abs(hex(a)-.0)-.2<0.)*vec4(.4,.4,.6,1.);a=(u+vec2(.0,-.0))*1.5;r+=float(abs(hex(a)+.5)-.2<0.)*vec4(.6,.4,.4,1.);a=(u+vec2(.6,.8))*8.;r+=float(hex(a)>0.)*vec4(.7,.4,.4,0.);a=(u+vec2(.2,.8))*8.;r+=float(hex(a)>0.)*vec4(.4,.4,.7,0.);a=(u+vec2(-.2,.8))*8.;r+=float(hex(a)>0.)*vec4(.8,.8,.4,0.);a=(u+vec2(-.6,.8))*8.;r+=float(hex(a)>0.)*vec4(.6,.3,.6,0.);return r;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 1,
      bC: [100, 170, 100, 1],
      dC: [-1, 1],
    }),
    (e[12] = {
      sF: "float tH(vec2 u){float r=-1.;float w=0.03;dL(r,u,vec2(.35,-.8),vec2(.35,-1.),w);dL(r,u,vec2(.6,-.8),vec2(.6,-1.),w);dL(r,u,vec2(.6,1.),vec2(.6,.55),w);dL(r,u,vec2(.35,1.),vec2(.35,.55),w);dL(r,u,vec2(-.5,.55),vec2(.35,.55),w);dL(r,u,vec2(.6,.55),vec2(1.,.55),w);dL(r,u,vec2(-.5,.55),vec2(-.5,.95),w);dL(r,u,vec2(-.1,.95),vec2(-1.,.95),w);fT(u,r);return r;}vec2 wC(vec2 u){return vec2(fn(u*16.+16.,6.3,4.),fn(u*16.-16.,6.3,4.))*.8-.4;}vec4 oS(vec2 u){vec4 r=vec4(0.);vec2 a;float w=0.015;float t=0.;w=0.03;dL(t,u,vec2(1.,.3),vec2(-1.,.3),w);dL(t,u,vec2(.6,.3),vec2(.6,.55),w);if(r.x==0.)r=float(t>0.)*vec4(.8,.8,.3,.5);dL(t,u,vec2(-.5,.55),vec2(-1.,.55),w);if(r.x==0.)r=float(t>0.)*vec4(.7,.3,.3,.5);w=0.02;dL(t,u,vec2(.72,.42),vec2(.721,.42),.05);dL(t,u,vec2(.75,.42),vec2(.85,.42),w);dL(t,u,vec2(.85,.42),vec2(.85,.45),w);dL(t,u,vec2(.8,.42),vec2(.8,.45),w);if(r.x==0.)r=float(t>0.)*vec4(.8,.8,.3,1.);dL(t,u,vec2(-.29,.75),vec2(-.16,.75),.03);dL(t,u,vec2(-.2,.68),vec2(-.2,.82),w);dL(t,u,vec2(-.15,.75),vec2(.05,.75),.06);dL(t,u,vec2(.07,.79),vec2(.1,.75),w);dL(t,u,vec2(.07,.71),vec2(.1,.75),w);if(r.x==0.)r=float(t>0.)*vec4(.5,.2,.5,1.);dL(t,u,vec2(-.3,.75),vec2(.15,.75),.15);if(r.x==0.)r=float(t>0.)*vec4(.3,.3,.7,.5);dL(t,u,vec2(-.75,.75),vec2(-.751,.75),.08);if(r.x==0.)r=float(t>0.)*vec4(.3,.7,.3,1.);dL(t,u,vec2(-.75,.75),vec2(-.751,.75),.18);if(r.x==0.)r=float(t>0.)*vec4(.3,.3,.7,1.);dL(t,u,vec2(1.,-.9),vec2(1.,-.6),.4);if(r.x==0.)r=float(t>0.)*vec4(.7,.3,.3,.5);dL(t,u,-vec2(.4,.4),-vec2(.41,.4),.1);if(r.x==0.)r=float(t>0.)*vec4(.8,.8,.3,1.);dL(t,u,-vec2(.4,.4),-vec2(.41,.4),.4);if(r.x==0.)r=float(t>0.)*vec4(.7,.3,.3,1.);dL(t,u,-vec2(1.,.3),-vec2(.3,1.),.1);if(r.x==0.)r=float(t>0.)*vec4(.7,.3,.3,.5);a=u+.4;t=sin(atan(a.x,a.y)*16.)-.5-dot(a,a);if(r.x==0.)r=float(t>0.)*vec4(.7,.3,.3,1.);dL(t,u,-vec2(1.,.5),-vec2(.5,1.),.1);if(r.x==0.)r=float(t>0.)*vec4(.3,.3,.7,.5);t=0.;dL(t,u,vec2(0.68,-0.98),vec2(0.68,-0.69),w);dL(t,u,vec2(0.92,-0.96),vec2(0.92,-0.7),w);dL(t,u,vec2(-.99,-.33),vec2(-.39,-.98),w);return r;}vec4 mD(vec2 u){vec4 r=tH(u)*vec4(.7,.7,.6,1.)+.3;r=max(r,vec4(.2,.3,.4,.0)-.1*fn(u*64.,6.3,4.));fD(u,r);return r;}",
      wQ: 0.5,
      bC: [100, 170, 100, 1],
      dC: [-1, -1],
    });
  const n = [];
  let t, r;
  const a = (e, n) => {
      const t = document.createElement("div"),
        r = c(e, n);
      return (
        (r.style.width = r.style.height = "100%"),
        (r.style.marginTop = "6%"),
        t.appendChild(r),
        t.classList.add("b"),
        t
      );
    },
    c = (e, n) => {
      const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      return (
        (t.innerHTML =
          '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">'.concat(
            e,
            "</text>"
          )),
        t.setAttribute("viewBox", "0 0 ".concat(n, " 20")),
        t
      );
    },
    i = document.createElement("div");
  i.classList.add("ui"), document.body.appendChild(i);
  const o = document.createElement("div");
  document.body.appendChild(o), o.classList.add("ed");
  const v = a("▶", 20);
  (v.style.marginTop = "50%"),
    (v.style.width = "10%"),
    (v.style.height = "10%");
  const u = v.querySelector("svg");
  (u.style.marginTop = "21%"), (u.style.marginLeft = "5%"), i.appendChild(v);
  const d = document.createElement("div");
  for (let t = 1; t < e.length; t++) {
    let e = a(t, 30);
    1 != t && e.classList.add("l"),
      (e.style.width = e.style.height = "100%"),
      d.appendChild(e),
      n.push(e),
      (e.onclick = () => {
        r.loadLevel(t), x(d);
      });
  }
  d.classList.add("lvls"), i.appendChild(d);
  const l = (e) => (e.style.display = "grid"),
    x = (e) => (e.style.display = "none");
  x(d),
    (v.onclick = () => {
      s(r.uL), l(d), x(v);
    });
  const s = (e) => {
    for (let t = 1; t < n.length; t++)
      t > e - 1 ? n[t].classList.add("l") : n[t].classList.remove("l");
    localStorage.setItem(r.saveKey, r.uL);
  };
  let f = null;
  const h = () => {
      f ||
        (f = setTimeout(() => {
          s(r.uL), l(d), (f = null), x(o);
        }, 2e3));
    },
    w = (e) => {
      e
        ? ((o.innerText = "✓"), o.classList.remove("ls"))
        : ((o.innerText = "✖"), o.classList.add("ls")),
        l(o);
    },
    m = (e = 0) => {
      if (0 === e) {
        if (!t) return;
        t.parentNode.removeChild(t), (t = null);
      } else {
        const n = c("»", 20);
        (n.style.width = n.style.height = "20%"),
          n.classList.add("t1"),
          i.appendChild(n),
          (t = n),
          2 == e && n.classList.add("t2"),
          3 == e && n.classList.add("t3");
      }
    };
  document.addEventListener(
    "keydown",
    (e) => {
      83 == e.keyCode && e.shiftKey && (r.uL++, s(r.uL));
    },
    !0
  );
  const b = document.createElement("canvas");
  let y;
  const g = {};
  (g.saveKey = "pushback"),
    (g.uL = localStorage.getItem(g.saveKey) || 1),
    (r = g);
  const L = () => {
      (document.body.style.touchAction = "none"),
        (document.body.style.margin = "0px"),
        (b.style.position = "absolute"),
        document.body.appendChild(b),
        (window.onresize = A),
        A();
    },
    A = () => {
      b.width = b.height = Math.min(window.innerWidth, window.innerHeight);
      const e = Math.min(window.innerWidth, window.innerHeight);
      (b.style.top = Math.floor(window.innerHeight / 2 - e / 2) + "px"),
        (b.style.left = Math.floor(window.innerWidth / 2 - e / 2) + "px"),
        (b.style.width = e + "px"),
        (b.style.height = e + "px"),
        (y = b.getBoundingClientRect()),
        (() => {
          const e = Math.min(window.innerWidth, window.innerHeight);
          (i.style.width = e + "px"), (i.style.height = e + "px");
        })();
    },
    p = () => {
      (g.inputO = 0),
        (g.inputX = 0),
        (g.inputY = 0),
        (g.inputXd = 0),
        (g.inputYd = 0),
        (g.touchID = -1);
      const e = (e, n, t) => {
          (e -= y.left),
            (n -= y.top),
            (g.inputXd = e - g.inputX),
            (g.inputYd = n - g.inputY),
            (g.inputX = e),
            (g.inputY = n),
            2 != t && (g.inputO = t);
        },
        n = (n) => {
          const t = n.changedTouches;
          for (let r = 0; r < t.length; ++r)
            if (g.touchID == t[r].identifier) {
              (g.touchID = -1),
                e(n.changedTouches[r].clientX, n.changedTouches[r].clientY, 0);
              break;
            }
        },
        t = (n) => {
          e(n.clientX, n.clientY, 0);
        };
      b.addEventListener(
        "touchstart",
        (n) => {
          -1 == g.touchID &&
            ((g.touchID = n.changedTouches[0].identifier),
            e(n.changedTouches[0].clientX, n.changedTouches[0].clientY, 1),
            m(0));
        },
        !0
      ),
        b.addEventListener("touchend", n, !0),
        b.addEventListener("touchcancel", n, !0),
        b.addEventListener(
          "touchmove",
          (n) => {
            const t = n.changedTouches;
            for (let n = 0; n < t.length; ++n)
              if (g.touchID == t[n].identifier) {
                e(t[n].clientX, t[n].clientY, 2);
                break;
              }
          },
          !0
        ),
        b.addEventListener(
          "mousedown",
          (n) => {
            e(n.clientX, n.clientY, 1), m(0);
          },
          !0
        ),
        b.addEventListener("mouseup", t, !0),
        b.addEventListener("mouseout", t, !0),
        b.addEventListener("mouseleave", t, !0),
        b.addEventListener(
          "mousemove",
          (n) => {
            e(n.clientX, n.clientY, 2);
          },
          !0
        );
    },
    T = () => {
      const e = b.getContext("webgl", {
        alpha: !1,
        antialias: !1,
        depth: !1,
        stencil: !1,
        premultipliedAlpha: !1,
      });
      e.depthFunc(e.ALWAYS),
        e.disable(e.BLEND),
        e.disable(e.CULL_FACE),
        e.disable(e.DEPTH_TEST),
        e.disable(e.DITHER),
        e.disable(e.POLYGON_OFFSET_FILL),
        e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),
        e.disable(e.SAMPLE_COVERAGE),
        e.disable(e.SCISSOR_TEST),
        e.disable(e.STENCIL_TEST);
      e.getExtension("OES_texture_float");
      g.gl = e;
      const n = (g.vxSh0 =
          "precision highp float;attribute float vtx;varying vec2 uv;void main(){vec4 s=vec4(-1.,1.,0.,1.);if(vtx==.5 ){s.x=3.;}if(vtx==.75){s.y=-3.;}uv=s.xy;gl_Position=s*.5;}"),
        t = (n, t) => {
          const r = e.createProgram();
          let a;
          return (
            (a = e.createShader(e.VERTEX_SHADER)),
            e.shaderSource(a, n),
            e.compileShader(a),
            e.getShaderParameter(a, e.COMPILE_STATUS) ||
              alert(e.getShaderInfoLog(a)),
            e.attachShader(r, a),
            (a = e.createShader(e.FRAGMENT_SHADER)),
            e.shaderSource(a, t),
            e.compileShader(a),
            e.getShaderParameter(a, e.COMPILE_STATUS) ||
              alert(e.getShaderInfoLog(a)),
            e.attachShader(r, a),
            e.linkProgram(r),
            r
          );
        };
      (g.sC = t),
        (g.$1 = t(
          n,
          "precision highp float;uniform mat4 mtx;uniform sampler2D tex;varying vec2 uv;void main(){vec2 res=mtx[0].xy;vec2 r=1./res;vec2 u=floor((uv*.5+.5)*res)+.5;float k=mtx[0].z;float n=mtx[0].w;vec4 t=texture2D(tex,u*r).xyzw;vec4 t1= t+vec4(floor(u*.5)*2.+1.,0.,0.);vec2 v=vec2(0.);vec2 w=t1.xy-mtx[1].xy;float o=dot(w,w);float ol=16.;ol*= ol;if(dot(t1.zw,t1.zw)<.125&&o<ol){v+=mtx[1].zw*(ol-o)/ol;}u=floor(u*.5)*2.-2.;for(float j=.5;j<6.;++j){for(float i=.5;i<6.;++i){vec2 m=u+vec2(i,j);vec4 t2=texture2D(tex,m*r).xyzw;if(t2.x==1024.){continue;}t2=t2+vec4(floor(m*.5)*2.+1.,0.,0.)-t1;vec2 d=t2.xy;float l=length(d);d/=l;if(l>2.|| l<.001){d=vec2(0.);}float c=(2.-l)*k;float e=dot(d,t2.zw)*n;v-=d*(c-e);}}gl_FragColor=t+vec4(0.,0.,v);}"
        )),
        (g.$2 = e.getAttribLocation(g.$1, "vtx")),
        (g.$3 = e.getUniformLocation(g.$1, "mtx")),
        (g.$4 = e.getUniformLocation(g.$1, "tex")),
        (g.$5 = t(
          n,
          "precision highp float;uniform mat4 mtx;uniform sampler2D tex0;uniform sampler2D tex1;varying vec2 uv;vec4 lod(vec2 u){return texture2D(tex1,u).xyzw;}void main(){vec2 u=uv*.5+.5;vec4 t=texture2D(tex0,u).xyzw;vec2 res=mtx[0].xy;u=t.xy+floor(u*res*.5)*2.+1.;vec2 r=1./res;float a=mtx[2].w;vec4 v=(lod((u-vec2(.1,.0))*r).x-lod((u+vec2(.1,.0))*r).x)*vec4(0.,0.,1.,0.)*a+(lod((u-vec2(.0,.1))*r).x-lod((u+vec2(.0,.1))*r).x)*vec4(0.,0.,0.,1.)*a+(lod(u*r)*vec4(0.,0.,2.,2.)-vec4(0.,0.,1.,1.))*mtx[2].y;gl_FragColor=t+v;}"
        )),
        (g.$6 = e.getAttribLocation(g.$5, "vtx")),
        (g.$7 = e.getUniformLocation(g.$5, "mtx")),
        (g.$8 = e.getUniformLocation(g.$5, "tex0")),
        (g.$9 = e.getUniformLocation(g.$5, "tex1")),
        (g.$10 = t(
          n,
          "precision highp float;uniform mat4 mtx;uniform sampler2D tex;varying vec2 uv;void main(){vec2 res=mtx[0].xy;vec2 r=1./res;vec2 u=floor((uv*.5+.5)*res)+.5;float id=floor(dot(floor(fract(u*.5)*2.),vec2(1.,2.))+.5);float id2=-1.;u=floor(u*.5)*2.-2.;vec4 t=vec4(1024.);for(float j=.5;j<6.;++j){for(float i=.5;i<6.;++i){vec2 m=vec2(i,j);vec4 t2=texture2D(tex,(u+m)*r).xyzw;if(t2.x==1024.){continue;}t2.xy+=t2.zw+floor(m*.5)*2.-2.;if(t2.x>=-1.&&t2.x<1.&&t2.y>=-1.&&t2.y<1.){++id2;}if(id2==id){id2+=.1;t=t2;}}}gl_FragColor=t;}"
        )),
        (g.$11 = e.getAttribLocation(g.$10, "vtx")),
        (g.$12 = e.getUniformLocation(g.$10, "mtx")),
        (g.$13 = e.getUniformLocation(g.$10, "tex")),
        (g.$14 = t(
          n,
          "precision highp float;uniform mat4 mtx;uniform sampler2D tex0;uniform sampler2D tex1;varying vec2 uv;void main(){vec2 res=mtx[0].xy;vec2 u=floor((uv*.5+.5)*res)+.5;vec2 r=1./res;vec4 t=texture2D(tex0,u*r).xyzw;if(t.x==1024.){gl_FragColor=vec4(1024.);return;}vec4 t1=t+vec4(floor(u*.5)*2.+1.,0.,0.);vec4 b0=texture2D(tex1,(u-.25)*r).xyzw;b0=b0*255.+.1;vec4 b0les=step(b0,vec4(255.));vec4 b0mod=floor(mod(b0,vec4(15.)))-7.;vec4 b0div=floor(b0/15.)-7.;vec4 b1=texture2D(tex1,(u+.25)*r).xyzw;b1=b1*255.+.1;vec4 b1les=step(b1,vec4(255.));vec4 b1mod=floor(mod(b1,vec4(15.)))-7.;vec4 b1div=floor(b1/15.)-7.;vec2 v=vec2(0.);vec2 b;vec4 t2;float l;float L=mtx[2].x;float k=mtx[3].z;float n=mtx[3].w;b=u+vec2(b0mod.x,b0div.x);t2=texture2D(tex0,b*r).xyzw;t2=t2+vec4(floor(b*.5)*2.+1.,0.,0.)-t1;l=length(t2.xy);b=t2.xy/l;if(l<.001){b=vec2(0.);}v-=b0les.x*b*((L-l)*k-dot(t2.zw,b)*n);b=u+vec2(b0mod.y,b0div.y);t2=texture2D(tex0,b*r).xyzw;t2=t2+vec4(floor(b*.5)*2.+1.,0.,0.)-t1;l=length(t2.xy);b=t2.xy/l;if(l<.001){b=vec2(0.);}v-=b0les.y*b*((L-l)*k-dot(t2.zw,b)*n);b=u+vec2(b0mod.z,b0div.z);t2=texture2D(tex0,b*r).xyzw;t2=t2+vec4(floor(b*.5)*2.+1.,0.,0.)-t1;l=length(t2.xy);b=t2.xy/l;if(l<.001){b=vec2(0.);}v-=b0les.z*b*((L-l)*k-dot(t2.zw,b)*n);b=u+vec2(b0mod.w,b0div.w);t2=texture2D(tex0,b*r).xyzw;t2=t2+vec4(floor(b*.5)*2.+1.,0.,0.)-t1;l=length(t2.xy);b=t2.xy/l;if(l<.001){b=vec2(0.);}v-=b0les.w*b*((L-l)*k-dot(t2.zw,b)*n);b=u+vec2(b1mod.x,b1div.x);t2=texture2D(tex0,b*r).xyzw;t2=t2+vec4(floor(b*.5)*2.+1.,0.,0.)-t1;l=length(t2.xy);b=t2.xy/l;if(l<.001){b=vec2(0.);}v-=b1les.x*b*((L-l)*k-dot(t2.zw,b)*n);b=u+vec2(b1mod.y,b1div.y);t2=texture2D(tex0,b*r).xyzw;t2=t2+vec4(floor(b*.5)*2.+1.,0.,0.)-t1;l=length(t2.xy);b=t2.xy/l;if(l<.001){b=vec2(0.);}v-=b1les.y*b*((L-l)*k-dot(t2.zw,b)*n);gl_FragColor=t+vec4(0.,0.,v);}"
        )),
        (g.$15 = e.getAttribLocation(g.$14, "vtx")),
        (g.$16 = e.getUniformLocation(g.$14, "mtx")),
        (g.$17 = e.getUniformLocation(g.$14, "tex0")),
        (g.$18 = e.getUniformLocation(g.$14, "tex1")),
        (g.$19 = t(
          n,
          "precision highp float;uniform mat4 mtx;uniform sampler2D tex0;uniform sampler2D tex1;uniform sampler2D tex2;varying vec2 uv;vec2 find(sampler2D tex,vec4 o,vec2 u,vec2 r){vec2 e=vec2(0.);u=floor(u*.5)*2.;vec4 o0;vec2 u0;vec2 h;vec2 b=step(vec2(0.),o.xy)*4.-2.;o0=o;u0=u;h=u0+vec2(0.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(0.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}o0=o-vec4(b,0.,0.);u0=u+b;h=u0+vec2(0.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(0.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}o0=o-vec4(b*vec2(0.,1.),0.,0.);u0=u+b*vec2(0.,1.);h=u0+vec2(0.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(0.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}o0=o-vec4(b*vec2(1.,0.),0.,0.);u0=u+b*vec2(1.,0.);h=u0+vec2(0.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(0.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}return e;}void main(){vec2 res=mtx[0].xy;vec2 r=1./res;vec2 u=uv*.5+.5;vec4 t=texture2D(tex1,u).xyzw;if(t.x==1024.){gl_FragColor=vec4(1.1);return;}u*=res;vec2 x=vec2(float(fract(u.x)>=.5)*.5-.25,0.);vec2 f=find(tex2,t-vec4(t.zw,0.,0.),u,r);vec4 l=texture2D(tex0,(f+x)*r).xyzw;l=l*255.+.1;vec4 lmod=floor(mod(l,15.))-7.;vec4 ldiv=floor(l/15.)-7.;u=floor(u);vec2 f2=vec2(0.);f2=f+vec2(lmod.x,ldiv.x);t=texture2D(tex2,f2*r).xyzw;f2=find(tex1,t+vec4(t.zw,0.,0.),f2,r);if(l.x<255.){l.x=dot(f2-.5-u+7.,vec2(1.,15.))+.1;}f2=f+vec2(lmod.y,ldiv.y);t=texture2D(tex2,f2*r).xyzw;f2=find(tex1,t+vec4(t.zw,0.,0.),f2,r);if(l.y<255.){l.y=dot(f2-.5-u+7.,vec2(1.,15.))+.1;}f2=f+vec2(lmod.z,ldiv.z);t=texture2D(tex2,f2*r).xyzw;f2=find(tex1,t+vec4(t.zw,0.,0.),f2,r);if(l.z<255.){l.z=dot(f2-.5-u+7.,vec2(1.,15.))+.1;}f2=f+vec2(lmod.w,ldiv.w);t=texture2D(tex2,f2*r).xyzw;f2=find(tex1,t+vec4(t.zw,0.,0.),f2,r);if(l.w<255.){l.w=dot(f2-.5-u+7.,vec2(1.,15.))+.1;}gl_FragColor=l/255.;}"
        )),
        (g.$20 = e.getAttribLocation(g.$19, "vtx")),
        (g.$21 = e.getUniformLocation(g.$19, "mtx")),
        (g.$22 = e.getUniformLocation(g.$19, "tex0")),
        (g.$23 = e.getUniformLocation(g.$19, "tex1")),
        (g.$24 = e.getUniformLocation(g.$19, "tex2")),
        (g.$25 = t(
          n,
          "precision highp float;uniform mat4 mtx;uniform sampler2D tex0;uniform sampler2D tex1;varying vec2 uv;void main(){vec2 res=mtx[0].xy;vec2 r=1./res;vec2 u=uv*.5+.5;vec4 t=texture2D(tex0,u).xyzw;if(t.x==1024.){gl_FragColor=vec4(1024.);return;}float f=mtx[2].z;u=floor(u*res*.5)*2.;vec4 t1=vec4(u+1.,0.,0.)+t;u=u+.5+step(vec2(0.),t.xy)*2.-2.;for(float i=.5;i<4.;++i){for(float j=.5;j<4.;++j){vec2 m=u+vec2(j,i);vec4 t2=texture2D(tex1,m*r).xyzw;if(t2.x==1024.){continue;}vec2 v=t2.zw;t2=t2+vec4(floor(m*.5)*2.+1.,0.,0.)-t1;float l=length(v)*float(dot(t2.xy,t2.xy)<1.);v/=l;if(l<.001){v=vec2(0.);}t.zw+=v*dot(t2.zw,v)*f;}}gl_FragColor=t;}"
        )),
        (g.$26 = e.getAttribLocation(g.$25, "vtx")),
        (g.$27 = e.getUniformLocation(g.$25, "mtx")),
        (g.$28 = e.getUniformLocation(g.$25, "tex0")),
        (g.$29 = e.getUniformLocation(g.$25, "tex1")),
        (g.$50 = t(
          n,
          "precision highp float;uniform mat4 mtx;uniform sampler2D tex0;uniform sampler2D tex1;uniform sampler2D tex2;varying vec2 uv;vec2 find(sampler2D tex,vec4 o,vec2 u,vec2 r){vec2 e=vec2(0.);u=floor(u*.5)*2.;vec4 o0;vec2 u0;vec2 h;vec2 b=step(vec2(0.),o.xy)*4.-2.;o0=o;u0=u;h=u0+vec2(0.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(0.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}o0=o-vec4(b,0.,0.);u0=u+b;h=u0+vec2(0.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(0.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}o0=o-vec4(b*vec2(0.,1.),0.,0.);u0=u+b*vec2(0.,1.);h=u0+vec2(0.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(0.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}o0=o-vec4(b*vec2(1.,0.),0.,0.);u0=u+b*vec2(1.,0.);h=u0+vec2(0.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,0.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(0.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}h=u0+vec2(1.5,1.5);if(dot(abs(texture2D(tex,h*r).xyzw-o0),vec4(1.))<.001){e=h;}return e;}void main(){vec2 u=uv*.5+.5;vec4 t=texture2D(tex1,u).xyzw;if(t.x==1024.){gl_FragColor=vec4(0.);return;}vec2 res=mtx[0].xy;vec2 r=1./res;vec2 f=find(tex2,t-vec4(t.zw,0.,0.),u*res,r);gl_FragColor=texture2D(tex0,f*r).xyzw;}"
        )),
        (g.$60 = e.getAttribLocation(g.$50, "vtx")),
        (g.$70 = e.getUniformLocation(g.$50, "mtx")),
        (g.$80 = e.getUniformLocation(g.$50, "tex0")),
        (g.$81 = e.getUniformLocation(g.$50, "tex1")),
        (g.$82 = e.getUniformLocation(g.$50, "tex2")),
        (g.$51 = t(
          n,
          "precision highp float;uniform mat4 mtx;uniform sampler2D tex0;uniform sampler2D tex1;varying vec2 uv;void main(){vec2 res=mtx[0].xy;vec2 r=1./res;vec2 u=uv*.5+.5;vec4 c=texture2D(tex0,u).xyzw;if(c.w==0.){gl_FragColor=c;return;}float id=0.;if(c.x>c.y&&c.x>c.z){id=1.;}if(c.y>c.x&&c.y>c.z){id=2.;}if(c.z>c.x&&c.z>c.y){id=3.;}if(c.x==c.y&&c.x>c.z){id=4.;}if(c.x==c.z&&c.x>c.y){id=5.;}bool ge=id!=0.&&mtx[0].z!=0.;vec2 t=texture2D(tex1,u).xy;u=floor(u*res*.5)*2.-2.;vec4 d=fract(sin(dot(t,vec2(42.1234,74.4321)))*vec4(6456.5891,7456.6892,8456.7893,9456.8894));for(float j=.5;j<6.;++j){for(float i=.5;i<6.;++i){vec2 m=vec2(i,j);vec2 m2=(u+m)*r;vec4 c2=texture2D(tex0,m2).xyzw;vec2 t2=texture2D(tex1,m2).xy;float id2=0.;if(c2.x>c2.y&&c2.x>c2.z){id2=1.;}if(c2.y>c2.x&&c2.y>c2.z){id2=2.;}if(c2.z>c2.x&&c2.z>c2.y){id2=3.;}if(c2.x==c2.y&&c2.x>c2.z){id2=4.;}if(c2.x==c2.z&&c2.x>c2.y){id2=5.;}bool b=t2.x==1024.;t2=t2+(floor(m*.5)*2.-2.)-t;if(b || dot(t2,t2)>4.){id2=0.;}if(id==1.&&id2==5.){c=vec4(.6,.4,.6,0.)-d*vec4(.0,.2,.0,.0);}if(id==2.&&id2==1.){c=vec4(.6,.4,.4,0.)-d*vec4(.0,.2,.2,.0);}if(id==3.&&id2==4.){c=vec4(.6,.6,.4,0.)-d*vec4(.0,.0,.2,.0);}if(id==4.&&id2==2.){c=vec4(.4,.6,.4,0.)-d*vec4(.2,.0,.2,.0);}if(id==5.&&id2==1.){c=vec4(.4,.4,.6,0.)-d*vec4(.2,.2,.0,.0);}if(ge&&id2!=0.){c=d*vec4(1.,1.,1.,0.);}}}gl_FragColor=c;}"
        )),
        (g.$61 = e.getAttribLocation(g.$51, "vtx")),
        (g.$71 = e.getUniformLocation(g.$51, "mtx")),
        (g.$90 = e.getUniformLocation(g.$51, "tex0")),
        (g.$91 = e.getUniformLocation(g.$51, "tex1")),
        (g.$52 = t(
          n,
          "precision highp float;uniform mat4 mtx;uniform sampler2D tex0;uniform sampler2D tex1;varying vec2 uv;void main(){vec2 res=mtx[0].xy;vec2 r=1./res;vec2 u=uv*.5+.5;vec4 l=texture2D(tex0,u).xyzw;vec4 a=l*255.+.1;vec4 lmod=floor(mod(a,15.))-7.;vec4 ldiv=floor(a/15.)-7.;vec3 c=texture2D(tex1,u).xyz;u=floor(u*res)+.5;vec3 c2=vec3(0.);c2=texture2D(tex1,(u+vec2(lmod.x,ldiv.x))*r).xyz;if(!all(equal(c,c2))){l.x=1.;}c2=texture2D(tex1,(u+vec2(lmod.y,ldiv.y))*r).xyz;if(!all(equal(c,c2))){l.y=1.;}c2=texture2D(tex1,(u+vec2(lmod.z,ldiv.z))*r).xyz;if(!all(equal(c,c2))){l.z=1.;}c2=texture2D(tex1,(u+vec2(lmod.w,ldiv.w))*r).xyz;if(!all(equal(c,c2))){l.w=1.;}gl_FragColor=l;}"
        )),
        (g.$62 = e.getAttribLocation(g.$52, "vtx")),
        (g.$72 = e.getUniformLocation(g.$52, "mtx")),
        (g.$44 = e.getUniformLocation(g.$52, "tex0")),
        (g.$45 = e.getUniformLocation(g.$52, "tex1")),
        (g.$55 = t(
          n,
          "precision highp float;uniform sampler2D tex0;uniform sampler2D tex1;varying vec2 uv;void main(){vec2 u=uv*.5+.5;vec4 t=texture2D(tex0,u).xyzw;vec4 c=texture2D(tex1,u).xyzw;if(abs(c.w-.5)<.1){t*=vec4(1.,1.,0.,0.);}gl_FragColor=t;}"
        )),
        (g.$65 = e.getAttribLocation(g.$55, "vtx")),
        (g.$48 = e.getUniformLocation(g.$55, "tex0")),
        (g.$49 = e.getUniformLocation(g.$55, "tex1")),
        (g.shaderP6 = t(
          n,
          "precision highp float;uniform mat4 mtx;uniform sampler2D tex;varying vec2 uv;void main(){vec2 res=mtx[0].xy;vec2 r=1./res;vec2 u=(uv*.5+.5)*res;float id=0.;if(fract(u.x)>=.5){id=4.;}u=floor(u);vec2 p=u+.5;vec2 t=texture2D(tex,p*r).xy;p=floor(p*.5)*2.+1.+t;vec4 o=vec4(1.1);float id2=-1.;u-=7.;float wx=1.;float wy=1.;float wz=1.;float ww=1.;for(float j=.5;j<15.;++j){for(float i=.5;i<15.;++i){vec2 p2=u+vec2(i,j);vec2 t2=texture2D(tex,p2*r).xy;p2=floor(p2*.5)*2.+1.+t2;float l=length(p-p2);if(t2.x!=1024.&&l>1.9&&l<2.1){++id2;}vec4 w=vec4(0.);if(id2==id+0.){w.x=wx;wx=0.;}if(id2==id+1.){w.y=wy;wy=0.;}if(id2==id+2.){w.z=wz;wz=0.;}if(id2==id+3.){w.w=ww;ww=0.;}o+=((i-.4+floor(j)*15.)/255.-1.1)*w;}}if(t.x==1024.){o=vec4(1.1);}gl_FragColor=o;}"
        )),
        (g.shdVtx6 = e.getAttribLocation(g.shaderP6, "vtx")),
        (g.shdMtx6 = e.getUniformLocation(g.shaderP6, "mtx")),
        (g.shdTex6 = e.getUniformLocation(g.shaderP6, "tex")),
        (g.shaderPS = t(
          n,
          "precision highp float;uniform mat4 mtx;uniform sampler2D tex0;uniform sampler2D tex1;uniform sampler2D tex2;uniform sampler2D tex3;uniform sampler2D tex4;varying vec2 uv;void main(){vec2 res=mtx[0].xy;vec2 r=1./res;vec2 o=uv*.5+.5;vec2 u=o*res*.5;vec4 t=vec4(fract(u)*2.-1.,0.,0.);vec4 s=step(vec4(0.),t)*vec4(1.,1.,0.,0.)-vec4(1.,1.,0.,0.);u=(floor(u)+s.xy)*2.;s*= 2.;vec4 v1=vec4(1024.);vec4 v2=vec4(1024.);vec2 g2=vec2(0.);for(float i=.5;i<4.;++i){for(float j=.5;j<4.;++j){vec4 m=vec4(j,i,0.,0.);vec2 g=(u+m.xy)*r;vec4 t2=texture2D(tex0,g).xyzw;vec4 p=t-t2-s-2.*floor(m*.5);if(t2.x!=1024.&&dot(p.xy,p.xy)<1.){v1=t2;}t2=texture2D(tex2,g).xyzw;p=t-t2-s-2.*floor(m*.5);if(t2.x!=1024.&&dot(p.xy,p.xy)<1.){v2=t2;g2=g;}}}vec4 a=texture2D(tex4,o).xyzw;vec4 wtr=.5+.5*cos(6.3*(length(v1.zw)*.6+.54+vec4(.0,.1,.2,.0)))+texture2D(tex1,o).x;vec4 obj=length(v2.zw)+texture2D(tex3,g2).xyzw;if(v1.x!=1024.){a=wtr;}if(v2.x!=1024.){a=obj;}gl_FragColor=a;}"
        )),
        (g.shdVtxS = e.getAttribLocation(g.shaderPS, "vtx")),
        (g.shdMtxS = e.getUniformLocation(g.shaderPS, "mtx")),
        (g.shdTexS0 = e.getUniformLocation(g.shaderPS, "tex0")),
        (g.shdTexS1 = e.getUniformLocation(g.shaderPS, "tex1")),
        (g.shdTexS2 = e.getUniformLocation(g.shaderPS, "tex2")),
        (g.shdTexS3 = e.getUniformLocation(g.shaderPS, "tex3")),
        (g.shdTexS4 = e.getUniformLocation(g.shaderPS, "tex4"));
      const r = new Float32Array([0.25, 0.5, 0.75]);
      (g.mB = e.createBuffer()),
        e.bindBuffer(e.ARRAY_BUFFER, g.mB),
        e.bufferData(e.ARRAY_BUFFER, r, e.STATIC_DRAW);
      const a = (n, t, r, a, c, i, o) => {
        e.activeTexture(o);
        const v = e.createTexture();
        return (
          e.bindTexture(e.TEXTURE_2D, v),
          e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.REPEAT),
          e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.REPEAT),
          e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, c),
          e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, c),
          e.texImage2D(e.TEXTURE_2D, 0, n, t, r, 0, n, a, i),
          v
        );
      };
      (g.tW = 256),
        (g.th = 256),
        (g.tex0 = new Array(2)),
        (g.tex0[0] = a(
          e.RGBA,
          g.tW,
          g.th,
          e.FLOAT,
          e.NEAREST,
          null,
          e.TEXTURE0
        )),
        (g.tex0[1] = a(
          e.RGBA,
          g.tW,
          g.th,
          e.FLOAT,
          e.NEAREST,
          null,
          e.TEXTURE1
        )),
        (g.tex1 = new Array(2)),
        (g.tex1[0] = a(
          e.RGBA,
          2 * g.tW,
          2 * g.th,
          e.UNSIGNED_BYTE,
          e.LINEAR,
          null,
          e.TEXTURE2
        )),
        (g.tex1[1] = a(
          e.RGBA,
          2 * g.tW,
          2 * g.th,
          e.UNSIGNED_BYTE,
          e.LINEAR,
          null,
          e.TEXTURE3
        )),
        (g.tex2 = new Array(2)),
        (g.tex2[0] = a(
          e.RGBA,
          g.tW,
          g.th,
          e.FLOAT,
          e.NEAREST,
          null,
          e.TEXTURE4
        )),
        (g.tex2[1] = a(
          e.RGBA,
          g.tW,
          g.th,
          e.FLOAT,
          e.NEAREST,
          null,
          e.TEXTURE5
        )),
        (g.tex3 = new Array(2)),
        (g.tex3[0] = a(
          e.RGBA,
          2 * g.tW,
          g.th,
          e.UNSIGNED_BYTE,
          e.NEAREST,
          null,
          e.TEXTURE6
        )),
        (g.tex3[1] = a(
          e.RGBA,
          2 * g.tW,
          g.th,
          e.UNSIGNED_BYTE,
          e.NEAREST,
          null,
          e.TEXTURE7
        )),
        (g.tex4 = new Array(2)),
        (g.tex4[0] = a(
          e.RGBA,
          g.tW,
          g.th,
          e.UNSIGNED_BYTE,
          e.NEAREST,
          null,
          e.TEXTURE8
        )),
        (g.tex4[1] = a(
          e.RGBA,
          g.tW,
          g.th,
          e.UNSIGNED_BYTE,
          e.NEAREST,
          null,
          e.TEXTURE9
        ));
      const c = (n) => {
        const t = e.createFramebuffer();
        return (
          e.bindFramebuffer(e.FRAMEBUFFER, t),
          e.framebufferTexture2D(
            e.FRAMEBUFFER,
            e.COLOR_ATTACHMENT0,
            e.TEXTURE_2D,
            n,
            0
          ),
          t
        );
      };
      (g.fb0 = new Array(2)),
        (g.fb0[0] = c(g.tex0[0])),
        (g.fb0[1] = c(g.tex0[1])),
        (g.fb1 = new Array(2)),
        (g.fb1[0] = c(g.tex1[0])),
        (g.fb1[1] = c(g.tex1[1])),
        (g.fb2 = new Array(2)),
        (g.fb2[0] = c(g.tex2[0])),
        (g.fb2[1] = c(g.tex2[1])),
        (g.fb3 = new Array(2)),
        (g.fb3[0] = c(g.tex3[0])),
        (g.fb3[1] = c(g.tex3[1])),
        (g.fb4 = new Array(2)),
        (g.fb4[0] = c(g.tex4[0])),
        (g.fb4[1] = c(g.tex4[1])),
        (g.sX = new Float32Array(16)),
        (g.sX[0] = g.tW),
        (g.sX[1] = g.th),
        (g.l0n = 0),
        (g.l2n = 0),
        (g.l3n = 0),
        (g.l4n = 0),
        (g.f0 = !1),
        (g.f1 = !1),
        (g.f2 = !1),
        (g.rdPix = new Uint8Array(g.tW * g.th * 4));
    },
    E = () => {
      g.bO =
        "float hex(vec2 u){vec3 a=u.xyx*mat3(0.,1.,0.,.866,.5,0.,.866,-.5,0.);return 1.-dot(abs(a),vec3(1.));}void dD(inout float r,vec2 u,vec2 position,float scale,float rotate,float gap,float fat){rotate*=6.283;gap*=6.283;scale=1./scale;fat=1./fat;vec2 t=sin(vec2(0.,1.57)+rotate);vec2 a;vec2 b;b=(u-position)*scale;a=b*mat2(t,t.yx*vec2(-1.,1.));a=vec2(log(dot(a,a)),atan(a.x,a.y)*2.);a=vec2(max(abs(a.y)-gap,0.),a.x)*fat;r=max(r,1.-dot(a,a)*length(b));}void dL(inout float r,vec2 u,vec2 p1,vec2 p2,float w){vec2 a=normalize(p2-p1);u=u-(p1+p2)*.5;u=u*mat2(a,a.yx*vec2(-1.,1.));float l=distance(p1,p2)*.5;u.x=max(abs(u.x)-l,0.);u/=w;r=max(1.-dot(u,u),r);}float drawTerrainCircle(vec2 u,vec2 p1,vec2 s){vec2 a=(u+p1)*s;float t=max(1.-length(a),0.);float r=min(1.,t*(1.0+t/2.));return r;}float drawBoat(inout vec4 r,vec2 u,vec2 p,float angle){vec2 dir=sin(angle+vec2(0.,1.57));vec2 a=(u+p)*12.;a=a*mat2(dir,dir.yx*vec2(-1.,1.));a=vec2(max(abs(a.x)-1.,0.),a.y);a=abs(a);return float(1.-a.y-a.x>=0.);}void drawCurrent(inout vec2 v,vec2 u,vec2 p,vec2 s,vec2 a){vec2 r=(u+p)*s;v+=a*max(1.-dot(r,r),0.);}float rnd(vec2 u,vec2 f,float g1,float g2){vec4 a=fract(sin(dot(f,vec2(37.34,97.74)))*vec4(6925.953,7925.953,8925.953,9925.953));vec2 b=cos(a.x*g1+vec2(0.,1.57));return cos(dot(u,b*a.y*g2)+a.z*6.2831)*.5+.5;}float bub(vec2 u){vec3 a=u.xyx*mat3(0.,1.,0.,.86602540378,.5,0.,.86602540378,-.5,0.);return max(1.-dot(abs(a),vec3(.57735026919)),0.);}float fn(vec2 u,float g1,float g2){vec2 s=vec2(2.,1.73205080757);vec2 a0=(u+s*vec2(.0,.0))/s;vec2 a1=(u+s*vec2(.5,.0))/s;vec2 a2=(u+s*vec2(.25,.5))/s;vec2 a3=(u+s*vec2(.75,.5))/s;vec2 a0f=fract(a0)*s-s*.5;vec2 a1f=fract(a1)*s-s*.5;vec2 a2f=fract(a2)*s-s*.5;vec2 a3f=fract(a3)*s-s*.5;return bub(a0f)*rnd(u,floor(a0)+.0,g1,g2)+bub(a1f)*rnd(u,floor(a1)+.1,g1,g2)+bub(a2f)*rnd(u,floor(a2)+.2,g1,g2)+bub(a3f)*rnd(u,floor(a3)+.3,g1,g2);}vec2 corner(){return vec2(CORNER);}vec4 bC(){return vec4(MYBOATSCOLOR);}void fT(vec2 u,inout float r){u*=corner();vec2 a;a=u*6.-vec2(6.3);a+=sin(a.yx)*1.2;r=max((1.-dot(a,a)*.08)*(fn(u*18.,6.283,4.)*.6+1.),r);a=(u-vec2(.9))*32.;a=a*mat2(-1.,1.,1.,1.);a=abs(a);a=a-vec2(1.5,5.);r=max(min(1.-max(a.x,a.y),1.)*.6,r);}void fD(vec2 u,inout vec4 r){float h=0.;fT(u,h);u*=corner();vec2 a=u*24.;vec4 g=cos(6.28*((fn(a,.5,8.)+fn(a*2.+1.1,.5,8.)+fn(a*4.+2.2,.5,8.)+fn(a*6.+3.3,.5,8.))*.05+vec4(.3,.2,.33,.0)))*.5+.25+h*.5;r=mix(r,g,clamp(h*4.-2.,0.,1.));a=(u-vec2(.945))*128.;a=a*mat2(-1.,1.,1.,1.);a.y=abs(a.y)-16.;a.y=abs(a.y)-8.;a.y=abs(a.y)-4.;a.y=abs(a.y)-2.;a=abs(a)-vec2(6.,1.);r=mix(r,r*1.3,clamp(1.-max(a.x,a.y),0.,1.));}";
    },
    D = (n) => {
      const t = e[n];
      g.currentLevel = n;
      const r = g.gl;
      let a =
          "precision highp float;uniform mat4 mtx;varying vec2 uv;REPLACEvoid main(){vec2 res=mtx[0].xy;vec2 r=1./res;vec2 u=floor((uv*.5+.5)*res)*.5+.25;vec2 i=floor(fract(u)*2.);float id=floor(i.x+i.y*2.+.5);u=floor(u)*2.+1.;vec2 s=vec2(1.,1.732);vec2 a=mod(u,s*2.)-s;vec2 b=mod(u+s,s*2.)-s;if(dot(b,b)<dot(a,a)){a=b;}a=-a;float id2=-1.;float n=.5;vec4 o=vec4(1024.);i=a+vec2(0.,0.);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(2.,0.);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(-2.,0.);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(1.,1.732);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(-1.,1.732);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(1.,-1.732);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(-1.,-1.732);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}o.xy+=.001;if(oS((u+o.xy)*r*2.-1.).x==0.){o=vec4(1024.);}gl_FragColor=o;}",
        c =
          "precision highp float;uniform mat4 mtx;varying vec2 uv;REPLACEvoid main(){vec2 res=mtx[0].xy;vec2 r=1./res;vec2 u=floor((uv*.5+.5)*res)*.5+.25;vec2 i=floor(fract(u)*2.);float id=floor(i.x+i.y*2.+.5);u=floor(u)*2.+1.;vec2 s=vec2(1.,1.732);vec2 a=mod(u,s*2.)-s;vec2 b=mod(u+s,s*2.)-s;if(dot(b,b)<dot(a,a)){a=b;}a=-a;float id2=-1.;float n=.5;vec4 o=vec4(1024.);i=a+vec2(0.,0.);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(2.,0.);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(-2.,0.);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(1.,1.732);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(-1.,1.732);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(1.,-1.732);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}i=a+vec2(-1.,-1.732);if(i.x>=-1.&&i.x<1.&&i.y>=-1.&&i.y<1.){++id2;}if(id==id2){o=vec4(i,0.,0.);id2=n;}o.xy+=.001;gl_FragColor=oS((u+o.xy)*r*2.-1.);}",
        o =
          "precision highp float;varying vec2 uv;REPLACEvoid main(){gl_FragColor=vec4(tH(uv),0.,wC(uv)*.5+.5);}",
        v =
          "precision highp float;varying vec2 uv;void main(){vec4 a=fract(sin(vec4(dot(uv,vec2(23.123,87.987)),dot(uv,vec2(34.234,96.876)),dot(uv,vec2(45.345,15.765)),dot(uv,vec2(56.456,24.654))))*45678.7654)*2.-1.;a*=vec4(1.,1.,0.,0.);if(fract(sin(dot(uv,vec2(23.123,87.987)))*48366.8235)>REPLACE){a=vec4(1024.);}gl_FragColor=a;}",
        u =
          "precision highp float;varying vec2 uv;REPLACEvoid main(){gl_FragColor=mD(uv);}",
        d = g.bO + t.sF;
      (d = (d = d.replace(
        "CORNER",
        t.dC[0].toFixed(0) + "," + t.dC[1].toFixed(0)
      )).replace(
        "MYBOATSCOLOR",
        (t.bC[0] / 255).toFixed(4) +
          "," +
          (t.bC[1] / 255).toFixed(4) +
          "," +
          (t.bC[2] / 255).toFixed(4) +
          "," +
          t.bC[3]
      )),
        (a = a.replace("REPLACE", d)),
        (o = o.replace("REPLACE", d)),
        (c = c.replace("REPLACE", d)),
        (u = u.replace("REPLACE", d)),
        (v = v.replace("REPLACE", t.wQ.toFixed(2)));
      const l = g.sC,
        x = g.vxSh0;
      (g.shaderP5 = l(x, a)),
        (g.shdVtx5 = r.getAttribLocation(g.shaderP5, "vtx")),
        (g.shdMtx5 = r.getUniformLocation(g.shaderP5, "mtx")),
        (g.$53 = l(x, c)),
        (g.$63 = r.getAttribLocation(g.$53, "vtx")),
        (g.$73 = r.getUniformLocation(g.$53, "mtx")),
        (g.shaderP7 = l(x, o)),
        (g.shdVtx7 = r.getAttribLocation(g.shaderP7, "vtx")),
        (g.shaderP8 = l(x, v)),
        (g.shdVtx8 = r.getAttribLocation(g.shaderP8, "vtx")),
        (g.$54 = l(x, u)),
        (g.$64 = r.getAttribLocation(g.$54, "vtx")),
        (g.f0 = !0),
        (g.f1 = !0),
        (g.f2 = !0),
        (g.bC = [t.bC[0], t.bC[1], t.bC[2], 255 * t.bC[3]]),
        (g.dC = t.dC),
        (g.lE = !1),
        (g.cF = !1),
        i.querySelectorAll(".bl").forEach((e) => {
          e.parentNode.removeChild(e);
        }),
        t.bL &&
          t.bL.forEach((e) => {
            ((e, n, t, r) => {
              const a = document.createElement("div");
              a.classList.add("bl"),
                (a.style.width = "".concat(e, "%")),
                (a.style.height = "".concat(n, "%")),
                (a.style.left = "".concat(t, "%")),
                (a.style.top = "".concat(r, "%")),
                i.appendChild(a);
            })(e.w, e.h, e.l, e.t);
          }),
        n >= 1 && n <= 3 && m(n);
    };
  g.loadLevel = D;
  const F = () => {
      (g.bF = 0.1),
        (g.bD = 0.025),
        (g.wP = 7),
        (g.wC = 0.0015),
        (g.wF = 0.04),
        (g.tH = 2),
        (g.oL = 2),
        (g.oF = 0.06),
        (g.oD = 0.02);
    },
    P = () => {
      g.uL == g.currentLevel && g.uL++, h(), w(1);
    },
    C = () => {
      h(), w(0);
    },
    R = () => {
      (g.sX[4] = (0 + g.inputX / b.width) * g.tW),
        (g.sX[5] = (1 - g.inputY / b.height) * g.th),
        (g.sX[6] = (g.wP * g.inputXd) / b.width),
        (g.sX[7] = (g.wP * -g.inputYd) / b.height),
        0 == g.inputO && ((g.sX[4] = -1e4), (g.sX[5] = -1e4)),
        (g.sX[12] = 1 / b.width),
        (g.sX[13] = 1 / b.height),
        (g.sX[2] = g.bF),
        (g.sX[3] = g.bD),
        (g.sX[8] = g.oL),
        (g.sX[10] = g.wF),
        (g.sX[11] = g.tH),
        (g.sX[14] = g.oF),
        (g.sX[15] = g.oD);
      const e = g.gl;
      e.viewport(0, 0, g.tW, g.th);
      let n = 0,
        t = 0;
      g.f0 &&
        ((g.f0 = !1),
        e.bindFramebuffer(e.FRAMEBUFFER, g.fb0[1 & g.l0n]),
        e.useProgram(g.shaderP8),
        e.vertexAttribPointer(g.shdVtx8, 1, e.FLOAT, 0, 0, 0),
        e.enableVertexAttribArray(g.shdVtx8),
        e.drawArrays(e.TRIANGLES, 0, 3)),
        (n = 1 & g.l0n),
        ++g.l0n,
        (t = 1 & g.l0n),
        e.bindFramebuffer(e.FRAMEBUFFER, g.fb0[t]),
        e.useProgram(g.$1),
        e.uniform1i(g.$4, 0 + n),
        e.uniformMatrix4fv(g.$3, e.FALSE, g.sX),
        e.vertexAttribPointer(g.$2, 1, e.FLOAT, 0, 0, 0),
        e.enableVertexAttribArray(g.$2),
        e.drawArrays(e.TRIANGLES, 0, 3),
        (g.sX[9] = g.wC),
        (n = 1 & g.l0n),
        ++g.l0n,
        (t = 1 & g.l0n),
        e.bindFramebuffer(e.FRAMEBUFFER, g.fb0[t]),
        e.useProgram(g.$5),
        e.uniform1i(g.$8, 0 + n),
        e.uniform1i(g.$9, 2),
        e.uniformMatrix4fv(g.$7, e.FALSE, g.sX),
        e.vertexAttribPointer(g.$6, 1, e.FLOAT, 0, 0, 0),
        e.enableVertexAttribArray(g.$6),
        e.drawArrays(e.TRIANGLES, 0, 3),
        (n = 1 & g.l0n),
        ++g.l0n,
        (t = 1 & g.l0n),
        e.bindFramebuffer(e.FRAMEBUFFER, g.fb0[t]),
        e.useProgram(g.$10),
        e.uniform1i(g.$13, 0 + n),
        e.uniformMatrix4fv(g.$12, e.FALSE, g.sX),
        e.vertexAttribPointer(g.$11, 1, e.FLOAT, 0, 0, 0),
        e.enableVertexAttribArray(g.$11),
        e.drawArrays(e.TRIANGLES, 0, 3),
        g.f1 &&
          ((g.f1 = !1),
          e.viewport(0, 0, 2 * g.tW, 2 * g.th),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb1[0]),
          e.useProgram(g.shaderP7),
          e.vertexAttribPointer(g.shdVtx7, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.shdVtx7),
          e.drawArrays(e.TRIANGLES, 0, 3),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb1[1]),
          e.useProgram(g.$54),
          e.vertexAttribPointer(g.$64, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$64),
          e.drawArrays(e.TRIANGLES, 0, 3),
          e.viewport(0, 0, g.tW, g.th));
      {
        g.f2 &&
          ((g.f2 = !1),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb2[1 & g.l2n]),
          e.useProgram(g.shaderP5),
          e.uniformMatrix4fv(g.shdMtx5, e.FALSE, g.sX),
          e.vertexAttribPointer(g.shdVtx5, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.shdVtx5),
          e.drawArrays(e.TRIANGLES, 0, 3),
          e.viewport(0, 0, 2 * g.tW, g.th),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb3[1 & g.l3n]),
          e.useProgram(g.shaderP6),
          e.uniform1i(g.shdTex6, 4 + (1 & g.l2n)),
          e.uniformMatrix4fv(g.shdMtx6, e.FALSE, g.sX),
          e.vertexAttribPointer(g.shdVtx6, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.shdVtx6),
          e.drawArrays(e.TRIANGLES, 0, 3),
          e.viewport(0, 0, g.tW, g.th),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb4[1 & g.l4n]),
          e.useProgram(g.$53),
          e.uniformMatrix4fv(g.$73, e.FALSE, g.sX),
          e.vertexAttribPointer(g.$63, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$63),
          e.drawArrays(e.TRIANGLES, 0, 3)),
          (g.sX[6] = 0),
          (g.sX[7] = 0),
          (n = 1 & g.l2n),
          ++g.l2n,
          (t = 1 & g.l2n),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb2[t]),
          e.useProgram(g.$1),
          e.uniform1i(g.$4, 4 + n),
          e.uniformMatrix4fv(g.$3, e.FALSE, g.sX),
          e.vertexAttribPointer(g.$2, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$2),
          e.drawArrays(e.TRIANGLES, 0, 3),
          (n = 1 & g.l2n),
          ++g.l2n,
          (t = 1 & g.l2n),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb2[t]),
          e.useProgram(g.$14),
          e.uniform1i(g.$17, 4 + n),
          e.uniform1i(g.$18, 6 + (1 & g.l3n)),
          e.uniformMatrix4fv(g.$16, e.FALSE, g.sX),
          e.vertexAttribPointer(g.$15, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$15),
          e.drawArrays(e.TRIANGLES, 0, 3),
          (n = 1 & g.l2n),
          ++g.l2n,
          (t = 1 & g.l2n),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb2[t]),
          e.useProgram(g.$25),
          e.uniform1i(g.$28, 4 + n),
          e.uniform1i(g.$29, 0 + (1 & g.l0n)),
          e.uniformMatrix4fv(g.$27, e.FALSE, g.sX),
          e.vertexAttribPointer(g.$26, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$26),
          e.drawArrays(e.TRIANGLES, 0, 3),
          (g.sX[9] = 0),
          (n = 1 & g.l2n),
          ++g.l2n,
          (t = 1 & g.l2n),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb2[t]),
          e.useProgram(g.$5),
          e.uniform1i(g.$8, 4 + n),
          e.uniform1i(g.$9, 2),
          e.uniformMatrix4fv(g.$7, e.FALSE, g.sX),
          e.vertexAttribPointer(g.$6, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$6),
          e.drawArrays(e.TRIANGLES, 0, 3),
          (n = 1 & g.l2n),
          ++g.l2n,
          (t = 1 & g.l2n),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb2[t]),
          e.useProgram(g.$55),
          e.uniform1i(g.$48, 4 + n),
          e.uniform1i(g.$49, 8 + ((g.l4n + 0) & 1)),
          e.vertexAttribPointer(g.$65, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$65),
          e.drawArrays(e.TRIANGLES, 0, 3),
          (n = 1 & g.l2n),
          ++g.l2n,
          (t = 1 & g.l2n),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb2[t]),
          e.useProgram(g.$10),
          e.uniform1i(g.$13, 4 + n),
          e.uniformMatrix4fv(g.$12, e.FALSE, g.sX),
          e.vertexAttribPointer(g.$11, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$11),
          e.drawArrays(e.TRIANGLES, 0, 3),
          (n = 1 & g.l4n),
          ++g.l4n,
          (t = 1 & g.l4n),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb4[t]),
          e.useProgram(g.$50),
          e.uniform1i(g.$80, 8 + n),
          e.uniform1i(g.$81, 4 + ((g.l2n + 0) & 1)),
          e.uniform1i(g.$82, 4 + ((g.l2n + 1) & 1)),
          e.uniformMatrix4fv(g.$70, e.FALSE, g.sX),
          e.vertexAttribPointer(g.$60, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$60),
          e.drawArrays(e.TRIANGLES, 0, 3),
          (n = 1 & g.l4n),
          ++g.l4n,
          (t = 1 & g.l4n);
        let r = g.sX[2];
        (g.sX[2] = 1 * g.cF),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb4[t]),
          e.useProgram(g.$51),
          e.uniform1i(g.$90, 8 + n),
          e.uniform1i(g.$91, 4 + ((g.l2n + 0) & 1)),
          e.uniformMatrix4fv(g.$71, e.FALSE, g.sX),
          e.vertexAttribPointer(g.$61, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$61),
          e.drawArrays(e.TRIANGLES, 0, 3),
          (g.sX[2] = r),
          (() => {
            if (g.lE) return;
            if ((void 0 === g.fC && (g.fC = 0), ++g.fC, 0 != (3 & g.fC)))
              return;
            let e = g.rdPix;
            const n = g.gl;
            n.readPixels(0, 0, g.tW, g.th, n.RGBA, n.UNSIGNED_BYTE, e);
            let t = 0,
              r = !1,
              a = !1;
            for (let n = 0; n < g.th; ++n)
              for (let c = 0; c < g.tW; ++c) {
                if (e[t + 1] > e[t + 0] && e[t + 1] > e[t + 2]) {
                  r = !0;
                  let e = 0.07,
                    t = 0.85,
                    i =
                      (2 * (Math.floor(0.5 * c + 0.25) + 0.5)) / (0.5 * g.tW) -
                      1,
                    o =
                      (2 * (Math.floor(0.5 * n + 0.25) + 0.5)) / (0.5 * g.th) -
                      1;
                  (i -= g.dC[0] * t) * i + (o -= g.dC[1] * t) * o < e * e &&
                    (a = !0);
                }
                t += 4;
              }
            a && (P(), (g.lE = !0), (g.cF = !0)), r || (C(), (g.lE = !0));
          })(),
          e.viewport(0, 0, 2 * g.tW, g.th),
          (n = 1 & g.l3n),
          ++g.l3n,
          (t = 1 & g.l3n),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb3[t]),
          e.useProgram(g.$19),
          e.uniform1i(g.$22, 6 + n),
          e.uniform1i(g.$23, 4 + ((g.l2n + 0) & 1)),
          e.uniform1i(g.$24, 4 + ((g.l2n + 1) & 1)),
          e.uniformMatrix4fv(g.$21, e.FALSE, g.sX),
          e.vertexAttribPointer(g.$20, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$20),
          e.drawArrays(e.TRIANGLES, 0, 3),
          (n = 1 & g.l3n),
          ++g.l3n,
          (t = 1 & g.l3n),
          e.bindFramebuffer(e.FRAMEBUFFER, g.fb3[t]),
          e.useProgram(g.$52),
          e.uniform1i(g.$44, 6 + n),
          e.uniform1i(g.$45, 8 + ((g.l4n + 0) & 1)),
          e.uniformMatrix4fv(g.$72, e.FALSE, g.sX),
          e.vertexAttribPointer(g.$62, 1, e.FLOAT, 0, 0, 0),
          e.enableVertexAttribArray(g.$62),
          e.drawArrays(e.TRIANGLES, 0, 3);
      }
      e.viewport(0, 0, b.width, b.height),
        e.bindFramebuffer(e.FRAMEBUFFER, null),
        e.useProgram(g.shaderPS),
        e.uniform1i(g.shdTexS0, 0 + ((g.l0n + 0) & 1)),
        e.uniform1i(g.shdTexS1, 2),
        e.uniform1i(g.shdTexS2, 4 + ((g.l2n + 0) & 1)),
        e.uniform1i(g.shdTexS3, 8 + ((g.l4n + 0) & 1)),
        e.uniform1i(g.shdTexS4, 3),
        e.uniformMatrix4fv(g.shdMtxS, e.FALSE, g.sX),
        e.vertexAttribPointer(g.shdVtxS, 1, e.FLOAT, 0, 0, 0),
        e.enableVertexAttribArray(g.shdVtxS),
        e.drawArrays(e.TRIANGLES, 0, 3),
        window.requestAnimationFrame(R);
    };
  L(), p(), T(), E(), D(0), (g.lE = !0), F(), window.requestAnimationFrame(R);
})();
