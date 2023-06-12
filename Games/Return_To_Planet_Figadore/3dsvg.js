// 3D to SVG engine

// OpenGL default palette
var palette=[
  [102, 102, 102], // 0 "darkgrey"
  [255, 0, 0], // 1 "red"
  [0, 255, 0], // 2 "green"
  [0, 0, 255], // 3 "blue"
  [0, 255, 255], // 4 "cyan"
  [255, 0, 255], // 5 "magenta"
  [255, 255, 0], // 6 "yellow"
  [255, 255, 255], // 7 "white"
  [0, 0, 0], // 8 "black"
  [127, 0, 0], // 9 "darkred"
  [0, 127, 0], // 10 "darkgreen"
  [0, 0, 127], // 11 "darkblue"
  [0, 127, 127], // 12 "darkcyan"
  [127, 0, 127], // 13 "darkmagenta"
  [127, 127, 0], // 14 "darkyellow"
  [204, 204, 204] // 15 "lightgrey"
];

const PIOVER180=(Math.PI/180); // lookup for converting degrees to radians

// Class for rendering 3D to SVG
class svg3d
{
  constructor()
  {
    // Initialise SVG objects
    this.svg=null;
    this.svgobj=null;
    this.svghud=null;

    // World rotation in degrees
    this.rotx=0;
    this.roty=180;
    this.rotz=45;

    // World translation in pixels
    this.tranx=0;
    this.trany=-600;
    this.tranz=5000;

    // 3D to 2D coord cache
    this.d=[]; // World conversion matrix
    this.m=[]; // Model conversion matrix
    this.x=0;
    this.y=0;
    this.z=0;

    // Viewport reference
    this.f=800; // focal length (viewer to image plane)
    this.xmax=1280;
    this.ymax=720;
    this.vscale=800/1500;

    // 2D cursor
    this.cx=0;
    this.cy=0;

    // Lighting
    this.ambient=0.18;
    this.intensity=0.7;
    this.lightpos={x:0, y:600, z:600};
  }

  // Generate 3D world translation matrix from x/y/z rotation values
  initrotation(aa, bb, cc)
  {
    var a=PIOVER180*(aa);
    this.d[4]=Math.cos(a);
    this.d[5]=Math.sin(a);
    this.d[6]=-this.d[5];
    this.d[7]=this.d[4];

    var b=PIOVER180*(bb);
    this.d[8]=Math.cos(b);
    this.d[9]=Math.sin(b);
    this.d[10]=-this.d[9];
    this.d[11]=this.d[8];

    var c=PIOVER180*(cc);
    this.d[0]=Math.cos(c);
    this.d[1]=Math.sin(c);
    this.d[2]=-this.d[1];
    this.d[3]=this.d[0];
  }

  // Generate 3D model translation matrix from x/y/z rotation values
  initmodelrotation(aa, bb, cc)
  {
    var a=PIOVER180*(aa);
    this.m[4]=Math.cos(a);
    this.m[5]=Math.sin(a);
    this.m[6]=-this.m[5];
    this.m[7]=this.m[4];

    var b=PIOVER180*(bb);
    this.m[8]=Math.cos(b);
    this.m[9]=Math.sin(b);
    this.m[10]=-this.m[9];
    this.m[11]=this.m[8];

    var c=PIOVER180*(cc);
    this.m[0]=Math.cos(c);
    this.m[1]=Math.sin(c);
    this.m[2]=-this.m[1];
    this.m[3]=this.m[0];
  }

  // Convert 3d x,y,z into 2d x,y
  rotate()
  {
    // Apply viewport scale factor
    this.x*=this.vscale; this.y*=this.vscale; this.z*=this.vscale;

    this.y*=-1; // flip y
//    this.z*=-1; // flip z

    // roll - longitudinal axis (Z)
    var xs=this.x; // Save x
    this.x=(xs*this.d[4])+(this.y*this.d[6]);
    this.y=(xs*this.d[5])+(this.y*this.d[7]);

    // yaw - vertical axis (Y)
    xs=this.x; // Save x
    this.x=(xs*this.d[8])+(this.z*this.d[10]);
    this.z=(xs*this.d[9])+(this.z*this.d[11]);

    // pitch - transverse axis (X)
    var ys=this.y; // Save y
    this.y=(ys*this.d[0])+(this.z*this.d[2]);
    this.z=(ys*this.d[1])+(this.z*this.d[3]);

    // weak perspective projection, convert 3d to 2d
    this.x=(this.f*this.x)/(this.f+this.z);
    this.y=(this.f*this.y)/(this.f+this.z);

    // move 2d origin to centre of screen
    this.y+=(this.ymax/2); this.x+=(this.xmax/2);
  }

  // Rotate vertex model space
  rotatevertex(x, y, z)
  {
    // roll - longitudinal axis (Z)
    var xs=x; // Save x
    x=(xs*this.m[4])+(y*this.m[6]);
    y=(xs*this.m[5])+(y*this.m[7]);

    // yaw - vertical axis (Y)
    xs=x; // Save x
    x=(xs*this.m[8])+(z*this.m[10]);
    z=(xs*this.m[9])+(z*this.m[11]);

    // pitch - transverse axis (X)
    var ys=y; // Save y
    y=(ys*this.m[0])+(z*this.m[2]);
    z=(ys*this.m[1])+(z*this.m[3]);

    return [x, y, z];
  }

  // Move 2d cursor to 3d coordinate
  move3d(x1, y1, z1)
  {
    this.x=x1; this.y=y1; this.z=z1;
    this.rotate();

    this.cx=Math.floor(this.x);
    this.cy=Math.floor(this.y);
  }

  calcnormal(v1, v2, v3)
  {
    var u={
      x:v2[0]-v1[0],
      y:v2[1]-v1[1],
      z:v2[2]-v1[2]
    };

    var v={
      x:v3[0]-v1[0],
      y:v3[1]-v1[1],
      z:v3[2]-v1[2]
    };

    var n={
      x:(u.y*v.z)-(u.z*v.y),
      y:(u.z*v.x)-(u.x*v.z),
      z:(u.x*v.y)-(u.y*v.x)
    };

    return n;
  }

  Q_rsqrt(x) // Q3 fast inverse square root
  {
    const qbuf = new ArrayBuffer(4), f32 = new Float32Array(qbuf), u32 = new Uint32Array(qbuf);
    const x2 = 0.5 * (f32[0] = x);
    u32[0] = (/*0x5f3759df*/0x5f375a86 - (u32[0] >> 1));
    let y = f32[0];
    y  = y * ( 1.5 - ( x2 * y * y ) );
    return y;
  }

  calcshade(v1, v2, v3)
  {
    var norm=this.calcnormal(v1, v2, v3);
    var len=0;
    var lightdir={
      x:this.lightpos.x+this.tranx-v1[0],
      y:this.lightpos.y+this.trany-v1[1],
      z:this.lightpos.z+this.tranz-v1[2]
    };

    // Normalise norm
    len=(norm.x * norm.x + norm.y * norm.y + norm.z * norm.z);
  //  len=Math.sqrt(norm.x * norm.x + norm.y * norm.y + norm.z * norm.z);
    len*=this.Q_rsqrt(len);
    if (len!=0)
    {
      len=(1.0/len);
      norm.x*=len; norm.y*=len; norm.z*=len;
    }

    // Normalise light direction
    len=(lightdir.x * lightdir.x + lightdir.y * lightdir.y + lightdir.z * lightdir.z);
  //  len=Math.sqrt(lightdir.x * lightdir.x + lightdir.y * lightdir.y + lightdir.z * lightdir.z);
    len*=this.Q_rsqrt(len);
    if (len!=0)
    {
      len=(1.0/len);
      lightdir.x*=len; lightdir.y*=len; lightdir.z*=len;
    }

    // compute angle between normal and light

    return Math.max(0, (norm.x * lightdir.x + norm.y * lightdir.y + norm.z * lightdir.z));
  }

  calchemisphereshade(v1, v2, v3)
  {
    var norm=this.calcnormal(v1, v2, v3);
    var len=0;
    var lightdir={
      x:0.7,
      y:0.7,
      z:0.7
    };

    // Normalise norm
    len=(norm.x * norm.x + norm.y * norm.y + norm.z * norm.z);
  //  len=Math.sqrt(norm.x * norm.x + norm.y * norm.y + norm.z * norm.z);
    len*=this.Q_rsqrt(len);
    if (len!=0)
    {
      len=(1.0/len);
      norm.x*=len; norm.y*=len; norm.z*=len;
    }

    // compute angle between normal and light

    return Math.max(0, (norm.x * lightdir.x + norm.y * lightdir.y + norm.z * lightdir.z));
  }

  draw3dpoly(mesh, face, vs, p, mx, my, mz)
  {
    var lobj='<polygon points="';
    var poly={zmin:0,zmax:0,zavg:0,obj:""};
    var zds=[];
    var xs=[];
    var ys=[];
    var zs=[];
    var axs=[];
    var ays=[];
    var azs=[];

    var shade=0;

    // Draw points
    if (face.length==1)
    {
      if ((this.roty<90) || (this.roty>270)) return poly;

      lobj='<g style="filter:url(#dblur1)"><circle ';
      this.move3d(mx+(mesh.v[face[0]-1][0]*vs),my+(mesh.v[face[0]-1][1]*vs),mz+(mesh.v[face[0]-1][2]*vs));
      lobj+='cx="'+this.cx+'" cy="'+this.cy+'" ';
      zds.push(this.z);

      lobj+='r="'+mesh.s+'"';

      var rgbstr=Math.floor(palette[p%16][0])+','+Math.floor(palette[p%16][1])+','+Math.floor(palette[p%16][2]);

      // Serialize fill colour and close SVG circle
      lobj+='" fill="rgb('+rgbstr+')" stroke="rgb('+rgbstr+')" />';

      // Do smaller darker circles
      lobj+='<ellipse ';
      lobj+='cx="'+(this.cx-(mesh.s/3))+'" cy="'+(this.cy-(mesh.s/3))+'" ';
      lobj+='rx="'+(mesh.s/4.5);
      lobj+='" ry="'+(mesh.s/4);
      rgbstr=" rgba(20,20,20,0.4)";
      lobj+='" fill="'+rgbstr+'" stroke="'+rgbstr+'" />';

      lobj+='<ellipse ';
      lobj+='cx="'+(this.cx+(mesh.s/4))+'" cy="'+(this.cy+(mesh.s/4))+'" ';
      lobj+='rx="'+(mesh.s/6);
      lobj+='" ry="'+(mesh.s/6);
      rgbstr=" rgba(20,20,20,0.4)";
      lobj+='" fill="'+rgbstr+'" stroke="'+rgbstr+'" /></g>';

      // Determine further point in Z buffer
      poly.zmax=Math.max(...zds);
      poly.zmin=Math.min(...zds);
      poly.zavg=poly.zmin+((poly.zmax-poly.zmin)/2);

      poly.obj=lobj;

      return poly;
    }

    // Draw lines
    if (face.length==2)
    {
      lobj='<line ';

      this.move3d(mx+(mesh.v[face[0]-1][0]*vs),my+(mesh.v[face[0]-1][1]*vs),mz+(mesh.v[face[0]-1][2]*vs));
      lobj+='x1="'+this.cx+'" y1="'+this.cy+'" ';
      zds.push(this.z);

      this.move3d(mx+(mesh.v[face[1]-1][0]*vs),my+(mesh.v[face[1]-1][1]*vs),mz+(mesh.v[face[1]-1][2]*vs));
      lobj+='x2="'+this.cx+'" y2="'+this.cy+'"  class="line3d"/>';

      zds.push(this.z);

      // Determine further point in Z buffer
      poly.zmax=Math.max(...zds);
      poly.zmin=Math.min(...zds);
      poly.zavg=poly.zmin+((poly.zmax-poly.zmin)/2);

      poly.obj=lobj;

      return poly;
    }

    // Iterate through vertices for face
    for (var fv=0; fv<face.length; fv++)
    {
      var rv=this.rotatevertex(mesh.v[face[fv]-1][0], mesh.v[face[fv]-1][1], mesh.v[face[fv]-1][2]);
      xs[fv]=mx+(rv[0]*vs);
      ys[fv]=my+(rv[1]*vs);
      zs[fv]=mz+(rv[2]*vs);

      this.move3d(xs[fv], ys[fv], zs[fv]);
      axs[fv]=this.cx; ays[fv]=this.cy; azs[fv]=this.z;
      zds.push(this.z);

      // Serialize 2d vertex position to SVG polygon
      lobj+=this.cx+','+this.cy+' ';
    }

    var nz=((axs[0]-axs[1])*(ays[2]-ays[1])) - ((ays[0]-ays[1])*(axs[2]-axs[1]));

    // Determine if back face
    if (nz<0)
    {
      // Determine furthest points in Z buffer
      poly.zmax=Math.max(...zds);
      poly.zmin=Math.min(...zds);
      poly.zavg=poly.zmin+((poly.zmax-poly.zmin)/2);

      // Determine if behind viewer
      if (poly.zmin>-this.f)
      {
        // Calculate a shade value (percent of face colour)
        shade=this.calcshade([axs[0],ays[0],azs[0]], [axs[1],ays[1],azs[1]], [axs[2],ays[2],azs[2]])*this.intensity;
        shade+=this.ambient;

        // Clamp to 0..100%
        if (shade<0) shade=0;
        if (shade>1) shade=1;

        var rgbstr=Math.floor(palette[p%16][0]*shade)+','+Math.floor(palette[p%16][1]*shade)+','+Math.floor(palette[p%16][2]*shade);

        if (p>16)
        {
          var rgbobj=rgbstr.split(',');
          rgbobj[0]=""+(parseInt(rgbobj[0], 10)+gs.randoms.rnd(128)-75);
          rgbobj[1]=""+(parseInt(rgbobj[1], 10)+gs.randoms.rnd(128)-75);
          rgbobj[2]=""+(parseInt(rgbobj[2], 10)+gs.randoms.rnd(128)-75);

          rgbstr=rgbobj[0]+','+rgbobj[1]+','+rgbobj[2];
        }

        if (poly.zmax>2400)
          lobj+='" style="filter:url(#dblur2)';
        else
        if (poly.zmax>2300)
          lobj+='" style="filter:url(#dblur1)';

        // Serialize fill colour and close SVG polygon
        lobj+='" fill="rgb('+rgbstr+')" stroke="rgb('+rgbstr+')" />';

        poly.obj=lobj;
      }
    }

    return poly;
  }  

  drawobj(mesh)
  {
    var polys=[];
    var norms=[];
    var mx=mesh.x;
    var my=mesh.y;
    var mz=mesh.z;

    this.initmodelrotation(mesh.rotx, mesh.roty, mesh.rotz);

    // Iterate through object faces
    mesh.f.forEach(function (item, index) {
      if ((mesh.f.length>1) && (mesh.n==undefined))
        norms[index]=this.calcnormal(mesh.v[item[0]-1], mesh.v[item[1]-1], mesh.v[item[2]-1]);
      polys.push(this.draw3dpoly(mesh, item, mesh.s, mesh.c[index]||7, mx+this.tranx, my+this.trany, mz+this.tranz));
    }, this);

    if (mesh.n==undefined)
      mesh.n=norms;

    return polys;
  }

  renderobjs(polys)
  {
    var svgtxt="";

    // Order faces by z such that smallest average z gets rendered first
    polys.sort(function(a,b){return b.zavg-a.zavg});

    // Serialise polys
    polys.forEach(function(item, index){svgtxt+=item.obj});

    return svgtxt;
  }

  render(progress)
  {
    var polys=[];

    // Initialise world rotation
    this.initrotation(this.rotx, this.roty, this.rotz);

    // Find polygons from active objects
    gs.activemodels.forEach(function (item, index) {
      polys=polys.concat(this.drawobj(item));
    }, this);

    // Update the SVG with the new frame
    this.svgobj.innerHTML=this.renderobjs(polys);
  }

  resize()
  {
    // Resize svg object to fit window
    this.svg.style.width=window.innerWidth+"px";
    this.svg.style.height=window.innerHeight+"px";
  }

  init()
  {
    // Find DOM objects
    this.svg=document.getElementById("svg");
    this.svgobj=document.getElementById("playfield");
    this.svghud=document.getElementById("hud");
  }
}
