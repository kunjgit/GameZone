var g_scene = null;
var g_vrMode = -1;
var energyDiv = null;
var ENERGY_MAX = 8;
var mouseDownCount = 0;
AFRAME.registerComponent("game", {
  init: function () {
    g_scene = document.querySelector("a-scene");
    energyDiv = document.createElement("div");
    energyDiv.setAttribute("id", "infoPanel");
    energyDiv.setAttribute(
      "style",
      "position: absolute; top: 0; left: 0; right: 0; height: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center;  color: white; font-family: arial, helvetica, sans-serif"
    );
    var e = "";
    e += '<div style="display: flex; margin-bottom: 6px">';
    e +=
      '<div style="margin-right: 6px; display: flex; align-items: center">Energy</div>';
    e += '<div style="display: flex; align-items: center">';
    for (var t = 0; t < 8; t++) {
      e +=
        '<div id="energy_' +
        t +
        '" style="width: 16px; height: 16px; background-color: #0f0; margin-right: 4px"></div>';
    }
    e += "</div>";
    e +=
      '<div id="restart-button" style="display: flex; align-items: center; margin-left: 8px; cursor: pointer; height: 20px; color: #eee; background-color: #333; padding: 6px">Restart Level</div>';
    e += "</div>";
    e += '<div style="display: flex" id="instructions"></div>';
    energyDiv.innerHTML = e;
    document.body.appendChild(energyDiv);
    document
      .getElementById("restart-button")
      .addEventListener("click", function (e) {
        g_playfield.restartLevel();
      });
    g_playfield = new Playfield();
    g_playfield.init();
    g_sound = new Sound();
    document.addEventListener("mousedown", function (e) {
      g_sound.init();
      if (!g_vrMode) {
        if (mouseDownCount == 0) {
          mouseDownCount++;
          g_playfield.buttonDown(e);
        }
      }
    });
    document.addEventListener("mouseup", function (e) {
      if (!g_vrMode) {
        if (mouseDownCount > 0) {
          mouseDownCount--;
        }
        g_playfield.buttonUp(e);
      }
    });
  },
  tick: function (e, t) {
    if (g_scene.is("vr-mode")) {
      if (g_vrMode === false || g_vrMode === -1) {
        g_vrMode = true;
        energyDiv.style.display = "none";
        g_playfield.modeChange();
      }
    } else {
      if (g_vrMode === true || g_vrMode === -1) {
        g_vrMode = false;
        energyDiv.style.display = "flex";
        g_playfield.modeChange();
      }
    }
    if (g_playfield == null) {
    }
    while (t > 0) {
      var r = 40;
      if (r > t) {
        r = t;
      }
      t -= r;
      g_playfield.tick(e, r);
    }
  },
});
var g_startLevel = 0;
var g_playfield = null;
var g_playfieldScale = 1;
var g_raycaster = null;
var g_leftButtonDownCount = 0;
var g_rightButtonDownCount = 0;
var g_rightController = false;
var g_leftController = false;
var STATE_LEVEL_PREVIEW = 0;
var STATE_PLAYING = 1;
var STATE_IN_TELEPORT = 2;
var STATE_LEVEL_FINISHED = 3;
var STATE_TELEPORT_NEXT = 4;
var STATE_GAME_OVER = 5;
AFRAME.registerComponent("controller-connected", {
  init: function () {
    var e = this.el;
    e.addEventListener("controllerconnected", function (e) {
      if (e.detail.component.data.hand == "right") {
        g_rightController = true;
      }
      if (e.detail.component.data.hand == "left") {
        g_leftController = true;
      }
    });
    e.addEventListener("controllerdisconnected", function (e) {
      if (e.detail.component.data.hand == "right") {
        g_rightController = false;
      }
      if (e.detail.component.data.hand == "left") {
        g_leftController = false;
      }
    });
  },
});
var Playfield = function () {
  var o = 0;
  var l = false;
  var s = true;
  var u = false;
  var c = false;
  var f = false;
  var v = false;
  var d = false;
  var E = this;
  var e = -1;
  var g = null;
  var p = STATE_LEVEL_PREVIEW;
  var b = new THREE.Vector3();
  var A = new THREE.Vector3();
  var a = 0;
  var n = 0;
  var T = 0;
  var y = 0;
  var m = null;
  var _ = null;
  var h = false;
  var D = false;
  var R = null;
  var P = null;
  var w = null;
  var S = null;
  var L = null;
  var O = null;
  var V = [];
  var I = [];
  var x = null;
  var N = null;
  var M = null;
  var t = new THREE.Vector3();
  var H = new THREE.Vector3();
  var B = null;
  var i = null;
  var k = null;
  var G = null;
  var C = null;
  var j = null;
  var z = null;
  var U = null;
  var Y = [];
  var W = false;
  var q = false;
  var K = g_scene.object3D;
  var X = [];
  var F = new THREE.Vector3();
  var Z = new THREE.Vector3();
  var J = false;
  var Q = new THREE.Vector3();
  var $ = new THREE.Vector3(0, 0, 0);
  var ee = 0;
  E.setEnergyFromTo = function (e, t) {
    F.set(e.x, e.y + 0.3, e.z);
    Z.set(t.x, t.y, t.z);
  };
  E.setEnergyTransferring = function (e) {
    J = e;
  };
  E.updateEnergyBlocks = function (e, t) {
    for (var r = 0; r < X.length; r++) {
      if (X[r].mesh.visible) {
        var a = X[r].mesh;
        Q.set(Z.x - a.position.x, Z.y - a.position.y, Z.z - a.position.z);
        var n = $.distanceTo(Q);
        Q.normalize();
        var i = t * 0.008;
        if (i > n) {
          i = n;
        }
        if (i < 0.001) {
          a.visible = false;
        } else {
          a.position.set(
            a.position.x + i * Q.x,
            a.position.y + i * Q.y,
            a.position.z + i * Q.z
          );
        }
      }
    }
    if (J) {
      if (e - ee > 50) {
        for (var r = 0; r < X.length; r++) {
          if (X[r].mesh.visible == false) {
            X[r].mesh.visible = true;
            g_sound.playSound(SOUND_ENERGY);
            X[r].mesh.position.set(
              F.x + Math.random() * 0.4 - 0.2,
              F.y + Math.random() * 0.4 - 0.2,
              F.z + Math.random() * 0.4 - 0.2
            );
            break;
          }
        }
        ee = e;
      }
    }
  };
  var te = [];
  var re = new THREE.Vector3();
  var ae = new THREE.Vector3();
  var ne = false;
  var ie = new THREE.Vector3();
  var oe = 0;
  E.setEnergyDrainFromTo = function (e, t) {
    re.set(e.x, e.y, e.z);
    ae.set(t.x, t.y + 1.5, t.z);
  };
  E.setEnergyDrainTransferring = function (e) {
    ne = e;
  };
  E.updateEnergyDrainBlocks = function (e, t) {
    for (var r = 0; r < te.length; r++) {
      if (te[r].mesh.visible) {
        var a = te[r].mesh;
        ie.set(ae.x - a.position.x, ae.y - a.position.y, ae.z - a.position.z);
        var n = $.distanceTo(ie);
        ie.normalize();
        var i = t * 0.008;
        if (i > n) {
          i = n;
        }
        if (i < 0.001) {
          a.visible = false;
        } else {
          a.position.set(
            a.position.x + i * ie.x,
            a.position.y + i * ie.y,
            a.position.z + i * ie.z
          );
        }
      }
    }
    if (ne) {
      if (e - oe > 40) {
        for (var r = 0; r < te.length; r++) {
          if (te[r].mesh.visible == false) {
            te[r].mesh.visible = true;
            g_sound.playSound(SOUND_ENERGY2);
            te[r].mesh.position.set(
              re.x + Math.random() * 0.4 - 0.2,
              re.y + Math.random() * 0.4 - 0.2,
              re.z + Math.random() * 0.4 - 0.2
            );
            break;
          }
        }
        oe = e;
      }
    }
  };
  function se() {
    x = document.createElement("a-entity");
    x.setAttribute("class", "non-removable");
    var e = new THREE.ConeGeometry(0.4, 1.8, 3);
    var t = new THREE.MeshStandardMaterial({
      color: 16776960,
      transparent: true,
    });
    t.flatShading = true;
    var r = new THREE.Mesh(e, t);
    r.position.set(0, 0.9, 0);
    x.setObject3D("mesh", r);
    var a = new THREE.IcosahedronGeometry(0.4, 1);
    var n = new THREE.Mesh(a, t);
    n.position.set(0, 0.7, 0);
    r.add(n);
    var i = document.createElement("a-triangle");
    i.setAttribute("color", "#eee");
    i.setAttribute("rotation", "0 270 90");
    i.setAttribute("side", "double");
    i.setAttribute("scale", "0.2 0.26 0.2");
    i.setAttribute("position", "0 1.65 -0.7");
    x.append(i);
    var o = document.createElement("a-text");
    o.setAttribute("value", "Start Position");
    o.setAttribute("scale", "3 3 3");
    o.setAttribute("side", "double");
    o.setAttribute("color", "#bbb");
    o.setAttribute("position", "0 3 2");
    o.setAttribute("rotation", "0 90 0");
    x.append(o);
    M = document.getElementById("player-collision-box");
    j.append(x);
  }
  function le() {
    B = document.createElement("a-entity");
    B.setAttribute("class", "non-removable");
    k = new Exit(B);
    i = document.createElement("a-text");
    i.setAttribute("value", "Exit");
    i.setAttribute("scale", "3 3 3");
    i.setAttribute("side", "double");
    i.setAttribute("color", "#bbb");
    i.setAttribute("position", "0 3 0.6");
    i.setAttribute("rotation", "0 90 0");
    B.append(i);
    j.append(B);
  }
  E.showEnergy = function () {
    var e = g.getEnergy();
    for (var t = 0; t < ENERGY_MAX; t++) {
      var r = document.getElementById("energy_" + t);
      if (t < e) {
        r.style.backgroundColor = "#0f0";
      } else {
        r.style.backgroundColor = "#111";
      }
    }
    for (var t = 0; t < Y.length; t++) {
      Y[t].setEnergy(e);
    }
  };
  function ue(e, t) {
    if (e - y > 2) {
      r();
    }
  }
  function r() {
    o++;
    if (o >= g_levels.length) {
      o = 0;
      speak("Congratulations, you have finished all of the levels");
    }
    E.gotoLevel(o);
  }
  E.buildCollisionObjectList = function () {
    I = [];
    for (var e = 0; e < V.length; e++) {
      if (V[e].getIsSolid()) {
        var t = V[e].getObject();
        I.push(t);
      }
    }
    if (p == STATE_PLAYING) {
      M.object3D.isPlayer = true;
      if (M.object3D.children.length > 0) {
        M.object3D.children[0].isPlayer = true;
        I.push(M.object3D.children[0]);
      }
      I.push(M.object3D);
    }
  };
  E.getCollisionObjects = function () {
    return I;
  };
  var ce = [];
  var fe = [];
  function ve() {
    ce = [];
    for (var e = 0; e < V.length; e++) {
      if (V[e].getIsSolid()) {
        var t = V[e].getPadObject3D();
        if (t) {
          ce.push(t);
        }
        var r = V[e].getBoxObject3D();
        if (r) {
          ce.push(r);
        }
      }
    }
  }
  var de = new THREE.Vector3();
  var Ee = new THREE.Vector3();
  function ge(e, t) {
    de.copy(e.ray.origin);
    Ee.copy(e.ray.origin);
    Ee.addScaledVector(e.ray.direction, 40);
    e.near = 0;
    e.far = 40;
    var r = e.intersectObjects(ce, true);
    if (r.length > 0) {
      var a = r[0].object;
      Ee.copy(r[0].point);
      if (typeof a.userData.padIndex != "undefined") {
        var n = V[a.userData.padIndex];
        fe.push(n.getPadIndex());
        n.highlight();
      }
    }
    if (t) {
      var i = t.geometry.attributes.position.array;
      var o = 0;
      i[o++] = de.x;
      i[o++] = de.y;
      i[o++] = de.z;
      i[o++] = Ee.x;
      i[o++] = Ee.y;
      i[o++] = Ee.z;
      t.geometry.attributes.position.needsUpdate = true;
      t.geometry.computeBoundingBox();
      t.geometry.computeBoundingSphere();
    }
  }
  function pe() {
    if (!g_vrMode) {
      return;
    }
    ve();
    fe = [];
    if (g_leftController) {
      if (
        S &&
        typeof S.components.raycaster != "undefined" &&
        typeof S.components.raycaster.raycaster != "undefined"
      ) {
        ge(S.components.raycaster.raycaster, L);
        for (var e = 0; e < S.object3D.children.length; e++) {
          if (S.object3D.children[e].type == "Line") {
            S.object3D.children[e].visible = false;
          }
        }
      }
      L.visible = true;
      document.getElementById("left-info").object3D.visible = true;
    } else {
      L.visible = false;
      document.getElementById("left-info").object3D.visible = false;
    }
    if (g_rightController) {
      if (
        R &&
        typeof R.components.raycaster != "undefined" &&
        typeof R.components.raycaster.raycaster != "undefined"
      ) {
        ge(R.components.raycaster.raycaster, P);
        for (var e = 0; e < R.object3D.children.length; e++) {
          if (R.object3D.children[e].type == "Line") {
            R.object3D.children[e].visible = false;
          }
        }
      }
      P.visible = true;
      document.getElementById("right-info").object3D.visible = true;
    } else {
      P.visible = false;
      document.getElementById("right-info").object3D.visible = false;
    }
    for (var e = 0; e < V.length; e++) {
      if (V[e].getPadHighlighted()) {
        if (fe.indexOf(V[e].getPadIndex()) == -1) {
          V[e].unhighlight();
        }
      }
    }
  }
  E.init = function () {
    g = new Player(this);
    N = document.getElementById("player-shadow");
    j = document.getElementById("playfield");
    U = document.getElementById("playfield-holder");
    G = document.getElementById("level-text");
    m = document.getElementById("camera");
    _ = document.getElementById("camera-offset");
    z = document.getElementById("level-info");
    g_raycaster = new THREE.Raycaster();
    g_raycaster.near = 0;
    g_raycaster.far = 1e4;
    var e = new THREE.LineBasicMaterial({ color: 16777215 });
    S = document.getElementById("laser-left");
    var t = [];
    t.push(new THREE.Vector3(0, 0, 0));
    t.push(new THREE.Vector3(0, 10, 0));
    var r = new THREE.BufferGeometry().setFromPoints(t);
    L = new THREE.Line(r, e);
    K.add(L);
    w = new InfoPanel(document.getElementById("left-info"));
    Y.push(w);
    var a = new THREE.MeshStandardMaterial({
      color: 6711039,
      transparent: true,
      opacity: 1,
      emissive: 4474026,
    });
    var n = new THREE.MeshStandardMaterial({
      color: 16777215,
      transparent: true,
      opacity: 1,
      emissive: 16777215,
    });
    a.flatShading = true;
    var i = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    for (var o = 0; o < 30; o++) {
      var s = false;
      if (Math.random() > 0.7) {
        s = new THREE.Mesh(i, a);
        var l = 0.5 + Math.random() * 0.5;
        s.scale.set(l, l, l);
      } else {
        s = new THREE.Mesh(i, n);
        var l = Math.random() * 0.3;
        s.scale.set(l, l, l);
      }
      X.push({ mesh: s });
      K.add(s);
    }
    for (var o = 0; o < 30; o++) {
      var s = false;
      if (Math.random() > 0.7) {
        s = new THREE.Mesh(i, a);
        var l = 0.5 + Math.random() * 0.5;
        s.scale.set(l, l, l);
      } else {
        s = new THREE.Mesh(i, n);
        var l = Math.random() * 0.4;
        s.scale.set(l, l, l);
      }
      te.push({ mesh: s });
      K.add(s);
    }
    S.addEventListener("buttondown", function (e) {
      g_sound.init();
      W = T;
      w.setButtonDown(true);
      if (g_leftButtonDownCount == 0) {
        g_leftButtonDownCount++;
        E.buttonDown(e);
      }
      if (p === STATE_LEVEL_PREVIEW) {
        E.startLevel();
      }
    });
    S.addEventListener("buttonup", function (e) {
      if (g_leftButtonDownCount > 0) {
        g_leftButtonDownCount--;
      }
      w.setButtonDown(false);
      W = false;
      if (q === false) {
        v = false;
      }
      E.buttonUp(e);
    });
    t = [];
    t.push(new THREE.Vector3(0, 0, 0));
    t.push(new THREE.Vector3(0, 10, 0));
    r = new THREE.BufferGeometry().setFromPoints(t);
    P = new THREE.Line(r, e);
    K.add(P);
    R = document.getElementById("laser-right");
    O = new InfoPanel(document.getElementById("right-info"));
    Y.push(O);
    R.addEventListener("buttondown", function (e) {
      g_sound.init();
      q = T;
      O.setButtonDown(true);
      if (p === STATE_LEVEL_PREVIEW) {
        E.startLevel();
      }
      if (g_rightButtonDownCount == 0) {
        g_rightButtonDownCount++;
        E.buttonDown(e);
      }
    });
    R.addEventListener("buttonup", function (e) {
      if (g_rightButtonDownCount > 0) {
        g_rightButtonDownCount--;
      }
      O.setButtonDown(false);
      q = false;
      if (W === false) {
        v = false;
      }
      E.buttonUp(e);
    });
    C = new StartButton(this);
    E.gotoLevel(g_startLevel);
  };
  E.buttonDown = function (e) {
    for (var t = 0; t < V.length; t++) {
      V[t].buttonDown(e);
    }
  };
  E.buttonUp = function (e) {
    for (var t = 0; t < V.length; t++) {
      V[t].buttonUp(e);
    }
  };
  E.clearLevel = function () {
    for (var e = 0; e < V.length; e++) {
      V[e].cleanup();
    }
    V = [];
    while (j.children.length > 0) {
      var t = false;
      for (var e = 0; e < j.children.length; e++) {
        if (j.children[e].getAttribute("class") !== "non-removable") {
          t = e;
          break;
        }
      }
      if (t === false) {
        break;
      } else {
        j.removeChild(j.children[t]);
      }
    }
  };
  E.setControllerInfoVisible = function (e) {
    document.getElementById("left-info").object3D.visible = e;
    document.getElementById("right-info").object3D.visible = e;
  };
  var be = function () {
    document.getElementById("instructions").innerHTML = "";
  };
  var Ae = function () {
    var e = "";
    for (var t = 0; t < 4; t++) {
      var r = "";
      if (t < g_levels[o].text.length) {
        r = g_levels[o].text[t];
      }
      e += " " + r;
      w.setText(t, r);
      O.setText(t, r);
    }
    document.getElementById("instructions").innerHTML = e;
    speak(e);
  };
  E.modeChange = function () {
    if (g_vrMode) {
      E.setControllerInfoVisible(true);
      N.object3D.visible = false;
      if (S && g_leftController) {
        L.visible = true;
      }
      if (R && g_rightController) {
        P.visible = true;
      }
    } else {
      E.setControllerInfoVisible(false);
      N.object3D.visible = true;
      L.visible = false;
      P.visible = false;
    }
    if (p == STATE_LEVEL_PREVIEW) {
      Te();
    }
  };
  E.restartLevel = function () {
    E.gotoLevel(o);
  };
  function Te() {
    if (g_vrMode) {
      j.setAttribute(
        "position",
        new THREE.Vector3(-a * g_playfieldScale, 1, n * g_playfieldScale)
      );
      z.setAttribute("position", "0 1 -0");
      C.setYPosition(1.8);
    } else {
      j.setAttribute(
        "position",
        new THREE.Vector3(-a * g_playfieldScale, 1.4, n * g_playfieldScale)
      );
      z.setAttribute("position", "0 0.1 0");
      C.setYPosition(0.86);
    }
  }
  E.gotoLevel = function (e) {
    be();
    if (w != null) {
      w.setRestartText("");
    }
    if (O != null) {
      O.setRestartText("");
    }
    E.clearLevel();
    o = e;
    p = STATE_LEVEL_PREVIEW;
    for (var t = 0; t < 4; t++) {
      if (w != null) {
        w.setText(t, "");
      }
      if (O != null) {
        O.setText(t, "");
      }
    }
    var r = e + 1;
    G.setAttribute("value", "Level " + r);
    E.build();
    n = (A.z + b.z) / 2;
    a = (A.x + b.x) / 2;
    g_playfieldScale = 0.08;
    Te();
    j.setAttribute(
      "scale",
      new THREE.Vector3(g_playfieldScale, g_playfieldScale, g_playfieldScale)
    );
    j.setAttribute("rotation", "0 180 0");
    g.setPosition(-1.2, 0, 0, 0, -90, 0);
    ye();
    if (!g_vrMode || g_vrMode === -1) {
      m.setAttribute("look-controls", false);
      m.setAttribute("wasd-controls", false);
      m.object3D.rotation.set(0, 0, 0);
      m.setAttribute("rotation", "0 0 0");
      m.setAttribute("look-controls", true);
      m.setAttribute("wasd-controls", true);
      m.components["look-controls"].pitchObject.rotation.x = 0;
      m.components["look-controls"].yawObject.rotation.y = 0;
    }
    C.show();
    x.object3D.visible = true;
    G.object3D.visible = true;
    i.object3D.visible = true;
  };
  E.getGameState = function () {
    return p;
  };
  function ye() {
    h = -m.object3D.position.x;
    D = -m.object3D.position.z;
    _.object3D.position.setX(h);
    _.object3D.position.setZ(D);
  }
  function me() {
    for (var e = 0; e < V.length; e++) {
      V[e].unhighlight();
    }
  }
  E.startLevel = function () {
    if (p == STATE_PLAYING) {
      return;
    }
    g_sound.playSound(SOUND_CLICK);
    for (var e = 0; e < V.length; e++) {
      V[e].setClickable(true);
    }
    var r = 0;
    me();
    g.startTeleport(H.x, H.y, H.z, 0, 0, 0, function (e, t) {
      x.object3D.visible = false;
      i.object3D.visible = false;
      ye();
      g.setPosition(H.x, H.y, H.z, 0, r, 0);
      if (e == "arrived") {
        me();
        j.setAttribute("position", new THREE.Vector3(0, 0, 0));
        j.setAttribute("rotation", "0 0 0");
        g_playfieldScale = 1;
        j.setAttribute("scale", "1 1 1");
        G.object3D.visible = false;
        C.hide();
        Ae();
      }
    });
    p = STATE_PLAYING;
    s = true;
  };
  E.build = function () {
    b.x = 1e4;
    b.y = 1e4;
    b.z = 1e4;
    A.x = -1e4;
    A.y = -1e4;
    A.z = -1e4;
    var e = g_levels[o].data;
    var t = g_levels[o].startRotation;
    rotationSpeed = 70;
    if (typeof g_levels[o].robotSpeed != "undefined") {
      rotationSpeed = g_levels[o].robotSpeed;
    }
    for (var r = 0; r < e.length; r++) {
      var a = e[r][0];
      var n = V.length;
      var i = new Pad(E, j, n, a);
      j.append(i.getEntity());
      b.x = Math.min(b.x, e[r][1]);
      b.y = Math.min(b.y, e[r][2]);
      b.z = Math.min(b.z, e[r][3]);
      A.x = Math.max(A.x, e[r][1]);
      A.y = Math.max(A.y, e[r][2]);
      A.z = Math.max(A.z, e[r][3]);
      i.setPosition(e[r][1], e[r][2], e[r][3]);
      i.setRotation(e[r][4], e[r][5], e[r][6]);
      i.setClickable(false);
      V.push(i);
      g.setEnergy(g_levels[o].energy);
      if (a == START_PAD) {
        if (x == null) {
          se();
        }
        x.setAttribute(
          "position",
          new THREE.Vector3(e[r][1], e[r][2], e[r][3])
        );
        x.setAttribute("rotation", new THREE.Vector3(0, t, 0));
        H.set(e[r][1], e[r][2], e[r][3]);
        l = n;
      }
      if (a == 2) {
        if (B == null) {
          le();
        }
        B.setAttribute(
          "position",
          new THREE.Vector3(e[r][1], e[r][2], e[r][3])
        );
      }
    }
    I = [];
  };
  E.getCurrentPadIndex = function () {
    return l;
  };
  E.getOnPad = function () {
    return s;
  };
  E.noEnergy = function () {
    if (w != null) {
      w.setText(0, "No Energy");
      w.setText(1, "Hold button for 1 second");
      w.setText(2, "to restart level");
      w.setText(3, "");
    }
    if (O != null) {
      O.setText(0, "No Energy");
      O.setText(1, "Hold button for 1 second");
      O.setText(2, "to restart level");
      O.setText(3, "");
    }
  };
  E.hasEnergy = function () {
    for (var e = 0; e < 4; e++) {
      var t = "";
      if (e < g_levels[o].text.length) {
        t = g_levels[o].text[e];
      }
      if (w != null) {
        w.setText(e, t);
      }
      if (O != null) {
        O.setText(e, t);
      }
    }
  };
  E.teleportPlayer = function (e, t, r, a, n, i, o, s) {
    if (g.getEnergy() == 0) {
      if (g_vrMode) {
        speak(
          "No energy to teleport, hold the button for one second to restart"
        );
      } else {
        speak("No energy to teleport");
      }
      g_sound.playSound(SOUND_DIE);
      return;
    }
    if (o == 2) {
      g_sound.playSound(SOUND_DONE);
    } else {
      g_sound.playSound(SOUND_TELEPORT);
    }
    p = STATE_IN_TELEPORT;
    g.startTeleport(e, t, r, a, n, o, function (e, t) {
      l = i;
      ye();
      for (var r = 0; r < V.length; r++) {
        V[r].playerTeleported(i, t);
      }
      if (typeof s != "undefined") {
        s();
      }
      if (e == "finished") {
        p = STATE_PLAYING;
        if (t == 2) {
          p = STATE_LEVEL_FINISHED;
          y = T;
          speak("Level Complete. Well done");
        }
      }
    });
    g.decreaseEnergy(o !== EXIT_PAD);
  };
  E.getPlayerPosition = function () {
    M.object3D.getWorldPosition(t);
    return t;
  };
  E.getPlayer = function () {
    return g;
  };
  E.increasePlayerEnergy = function () {
    g.increaseEnergy();
    g_sound.playSound(SOUND_ADD_ENERGY);
  };
  E.decreasePlayerEnergy = function () {
    g.decreaseEnergy();
  };
  E.gameOver = function () {
    if (p !== STATE_GAME_OVER) {
      g_sound.playSound(SOUND_GAME_OVER);
      speak("Energy Drained. Game Over");
      E.setEnergyTransferring(false);
      E.setEnergyDrainTransferring(false);
      p = STATE_GAME_OVER;
      y = T;
    }
  };
  E.tick = function (e, t) {
    if (p == STATE_LEVEL_PREVIEW) {
    }
    if (p == STATE_LEVEL_FINISHED) {
      if (e - y > 3200) {
        p = STATE_TELEPORT_NEXT;
        y = e;
      }
    }
    if (p == STATE_GAME_OVER) {
      if (e - y > 3600) {
        E.gotoLevel(o);
      }
    }
    if (p == STATE_TELEPORT_NEXT) {
      ue(e, t);
    }
    E.buildCollisionObjectList();
    for (var r = 0; r < V.length; r++) {
      V[r].tick(e, t);
    }
    var a = m.object3D.position;
    N.object3D.position.setX(a.x + h);
    N.object3D.position.setZ(a.z + D);
    M.object3D.position.setX(a.x + h);
    M.object3D.position.setZ(a.z + D);
    M.object3D.position.setY(a.y - 0.24);
    if (p == STATE_PLAYING) {
      var n = Math.sqrt((a.x + h) * (a.x + h) + (a.z + D) * (a.z + D));
      if (W !== false || q !== false) {
        var i = false;
        for (var r = 0; r < V.length; r++) {
          if (V[r].getInAbsorb()) {
            i = true;
            break;
          }
        }
        if (i) {
          if (W !== false) {
            W = e;
          }
          if (q !== false) {
            q = e;
          }
        }
      }
      if ((W !== false && e - W > 1200) || (q !== false && e - q > 2e3)) {
        if (!i) {
          if (!v) {
            speak(
              "Button held for one second, the level will restart in three"
            );
            if (w != null) {
              w.setRestartText("Restarting Level...");
            }
            if (O != null) {
              O.setRestartText("Restarting Level...");
            }
            v = true;
            d = e;
            f = 3;
          }
          if (f == 3 && e - d > 4600) {
            if (!g_hasSpeech) {
              E.gotoLevel(o);
            }
            speak("two");
            f--;
          }
          if (f == 2 && e - d > 5400) {
            speak("one");
            f--;
          }
          if (f == 1 && e - d > 6200) {
            speak("level restart");
            E.gotoLevel(o);
          }
        }
      } else {
        if (v) {
          if (w != null) {
            w.setRestartText("");
          }
          if (O != null) {
            O.setRestartText("");
          }
        }
        v = false;
      }
      if (n > 1.5) {
        if (s) {
          s = false;
          u = e;
          c = false;
          f = 3;
        }
        if (e - u > 400 && !c) {
          speak("You are not on your pad, the level will restart in three");
          c = true;
          f = 3;
          u = e + 3e3;
        }
        if (c) {
          if (f == 3 && e - u > 1e3) {
            speak("two");
            f--;
            u = e;
          }
          if (f == 2 && e - u > 1e3) {
            speak("one");
            f--;
            u = e;
          }
          if (f == 1 && e - u > 1600) {
            speak("level restart");
            E.gotoLevel(o);
          }
        }
      } else {
        if (s === false) {
          speak("You are back on your pad");
        }
        s = true;
        c = false;
      }
    }
    T = e;
    pe();
    g.tick(e, t);
    k.tick(e, t);
    E.updateEnergyBlocks(e, t);
    E.updateEnergyDrainBlocks(e, t);
  };
};
var Player = function (t) {
  var r = this;
  var s = document.getElementById("player");
  var m = document.getElementById("camera");
  var _ = [];
  var l = new THREE.Vector3();
  var u = new THREE.Vector3();
  var c = false;
  var f = false;
  var v = false;
  var a = 0;
  var d = false;
  var E = 0;
  var g = 8;
  var e = function () {
    var e;
    var t = 10;
    for (e = 0; e < t; e++) {
      var r = (e * 360) / t;
      var a = 0.07;
      var n = -Math.sin((r * 2 * Math.PI) / 360) * a;
      var i = -Math.cos((r * 2 * Math.PI) / 360) * a;
      var o = document.createElement("a-box");
      o.setAttribute("scale", "0.05 0.04 0.001");
      o.setAttribute("color", "#ffffff");
      if (e == 0) {
        o.setAttribute("color", "#ffffff");
      } else if (e == 1) {
        o.setAttribute("color", "#ff0000");
      } else if (e == 2) {
        o.setAttribute("color", "#00ff00");
      } else if (e == 3) {
        o.setAttribute("color", "#00ffff");
      } else {
        o.setAttribute("color", "#ff00ff");
      }
      o.setAttribute("position", new THREE.Vector3(n, 1.6, i));
      o.setAttribute("rotation", new THREE.Vector3(0, r, 0));
      o.object3D.visible = false;
      s.append(o);
    }
  };
  var n = function () {
    var e = 40;
    var t = 1;
    var r = 2 * Math.PI * t;
    var a = r / e + 0.1;
    var n = 0;
    var i = 0;
    var o = 0;
    var s = 0;
    var l;
    var u;
    var c;
    var f = 0;
    for (var v = 0; v < e; v++) {
      i = (v * Math.PI * 2) / e;
      o = t * Math.cos(i);
      s = t * Math.sin(i);
      l = o;
      u = 2 * Math.PI * l;
      c = Math.round(u / a + 0.5);
      var d = [];
      for (var E = 0; E <= c; E++) {
        n = (E * Math.PI * 2) / c;
        var g = l * Math.cos(n);
        var p = l * Math.sin(n);
        var b = document.createElement("a-plane");
        var A = a - 0.04 + 0.15;
        var T = a - 0.1 + 0.16;
        var y = 0.007;
        b.setAttribute("scale", new THREE.Vector3(A, T, y));
        b.setAttribute("color", "#333333");
        b.setAttribute("material", "side: double;shader: flat;");
        b.setAttribute("position", new THREE.Vector3(g, s + 1, p));
        b.setAttribute(
          "rotation",
          new THREE.Vector3(-((v * 360) / e), 180 / 2 - (E * 360) / c, 0)
        );
        b.yPosition = s;
        b.object3D.visible = false;
        m.append(b);
        d.push(b);
        f++;
      }
      if (d.length > 0) {
        _.push(d);
      }
    }
    _.sort(function (e, t) {
      var r = e[0].yPosition - t[0].yPosition;
      return r;
    });
  };
  r.getPosition = function () {
    return s.getAttribute("position");
  };
  r.getEnergy = function () {
    return g;
  };
  r.increaseEnergy = function () {
    if (g < ENERGY_MAX) {
      if (g == 0) {
        t.hasEnergy();
      }
      g++;
      t.showEnergy();
    }
  };
  r.decreaseEnergy = function (e) {
    if (g > 0) {
      g--;
      t.showEnergy();
      if (g == 0) {
        if (typeof e === "undefined" || e === true) {
          speak("Warning, zero energy");
        }
        t.noEnergy();
      }
    } else {
      t.gameOver();
    }
  };
  r.setEnergy = function (e) {
    g = e;
    t.showEnergy();
  };
  r.startTeleport = function (e, t, r, a, n, i, o) {
    if (g <= 0) {
      return;
    }
    l.set(e, t, r);
    u.set(a, E, n);
    f = 0;
    v = 1;
    d = i;
    c = o;
  };
  r.updateTeleport = function () {
    if (v === 1) {
      for (var e = 0; e < _[f].length; e++) {
        _[f][e].object3D.visible = true;
        _[f][e].setAttribute("color", "#ffffff");
      }
      if (f > 0) {
        for (var e = 0; e < _[f - 1].length; e++) {
          _[f - 1][e].setAttribute("color", "#cccccc");
        }
      }
      if (f > 1) {
        for (var e = 0; e < _[f - 1].length; e++) {
          _[f - 1][e].setAttribute("color", "#aaaaaa");
        }
      }
      f++;
      if (f >= _.length) {
        f = 0;
        v = -1;
        r.moveToTeleport();
      }
    } else if (v === -1) {
      for (var e = 0; e < _[f].length; e++) {
        _[f][e].object3D.visible = false;
        _[f][e].setAttribute("color", "#ffffff");
      }
      f++;
      if (f >= _.length) {
        v = false;
        if (typeof c != "undefined") {
          c("finished", d);
        }
      }
    }
  };
  r.setPosition = function (e, t, r, a, n, i) {
    E = n;
    s.setAttribute("position", new THREE.Vector3(e, t, r));
    s.setAttribute("rotation", new THREE.Vector3(a, n, i));
  };
  r.moveToTeleport = function () {
    var e = 0;
    var t = 0;
    var r = 0;
    switch (u.z) {
      case 90:
        r = -1;
        break;
      case 180:
        e = -1;
        break;
      case 270:
        r = 1;
        break;
    }
    switch (u.x) {
      case 90:
        t = 1;
        break;
      case 180:
        e = -1;
        break;
      case 270:
        t = -1;
        break;
    }
    if (u.x == 0 && u.z == 0) {
      e = 1;
    }
    e = 0;
    t = 0;
    r = 0;
    s.setAttribute("position", new THREE.Vector3(l.x + r, l.y + e, l.z + t));
    s.setAttribute("rotation", new THREE.Vector3(u.x, E, u.z));
    if (typeof c != "undefined") {
      c("arrived", d);
    }
  };
  r.tick = function (e, t) {
    if (e - a > 30) {
      if (v !== false) {
        r.updateTeleport();
      }
      a = e;
    }
  };
  n();
};
var Exit = function (e) {
  var t = this;
  var a = 0;
  var r = document.createElement("a-cylinder");
  r.setAttribute("color", "#0044ff");
  r.setAttribute("opacity", "0.6");
  r.setAttribute("scale", "0.44 0.02 0.44");
  r.setAttribute("position", "0 0.02 0");
  e.append(r);
  var n = [];
  var i = new THREE.BoxGeometry(0.1, 30, 0.1);
  for (var o = 0; o < 30; o++) {
    var s = new THREE.MeshStandardMaterial({
      color: 1118719,
      transparent: true,
      opacity: 0.8,
      emissive: 4474111,
    });
    var l = new THREE.MeshStandardMaterial({
      color: 16777215,
      transparent: true,
      opacity: 0.8,
      emissive: 16777215,
    });
    s.flatShading = true;
    var u = false;
    if (Math.random() > 0.7) {
      u = new THREE.Mesh(i, s);
      var c = 0.5 + Math.random() * 0.5;
      u.scale.set(c, c, c);
    } else {
      u = new THREE.Mesh(i, l);
      var c = Math.random() * 0.3;
      u.scale.set(c, c, c);
    }
    n.push({ mesh: u });
    r.object3D.add(u);
  }
  t.tick = function (e, t) {
    for (var r = 0; r < n.length; r++) {
      if (n[r].mesh.visible) {
        distance = n[r].mesh.position.y + t * 0.06;
        n[r].mesh.material.opacity = (120 - distance) / 120;
        if (distance > 120) {
          n[r].mesh.visible = false;
        }
        n[r].mesh.position.setY(distance);
      }
    }
    if (e - a > 50) {
      for (var r = 0; r < n.length; r++) {
        if (n[r].mesh.visible == false) {
          n[r].mesh.visible = true;
          n[r].mesh.material.opacity = 0.6;
          n[r].mesh.position.set(
            Math.random() * 1.5 - 0.7,
            12,
            Math.random() * 1.5 - 0.7
          );
          break;
        }
      }
      a = e;
    }
  };
};
var rotationSpeed = 70;
var Pad = function (g, e, t, r) {
  var a = this;
  var o = false;
  var s = false;
  var l = false;
  var u = false;
  var n = false;
  var c = new THREE.Vector3(0, 1, 0);
  var f = r;
  var v = true;
  var i = t;
  var p = false;
  var b = false;
  var d = false;
  var E = false;
  var A = [];
  var T = false;
  var y = 0;
  var m = null;
  var _ = false;
  var h = false;
  var D = new THREE.Vector3();
  var R = new THREE.Vector3(0, 0, -1);
  var P = false;
  var w = g_scene.object3D;
  var S = false;
  var L = false;
  var O = false;
  var V = 0;
  var I = 0;
  var x = 0;
  var N = 0;
  var M = 0;
  var H = 0;
  var B = false;
  var k = false;
  a.setClickable = function (e) {
    if (!s) {
      return;
    }
    if (e) {
      s.setAttribute("class", "clickable");
    } else {
      s.setAttribute("class", "");
    }
  };
  var G = function () {
    if (o === false) {
      o = document.createElement("a-entity");
    }
    if (f !== BLOCKING_PAD) {
      s = document.createElement("a-box");
      switch (f) {
        case GREEN_PAD:
          s.setAttribute("color", "#00aa00");
          break;
        case RED_PAD:
          s.setAttribute("color", "#aa0000");
          break;
        default:
          s.setAttribute("color", "#aaaaaa");
      }
      s.setAttribute("transparent", true);
      s.setAttribute("opacity", "1");
      s.setAttribute("scale", "1.06 0.02 1.06");
      s.setAttribute("position", new THREE.Vector3(0, -0.01, 0));
      s.addEventListener("mouseenter", W);
      s.addEventListener("mouseleave", q);
      s.addEventListener("mousedown", function (e) {
        return;
        var t = false;
        if (e.detail) {
          if (e.detail.cursorEl) {
            t = e.detail.cursorEl;
          }
        }
        if (g_scene == t) {
          t = null;
        }
        if (t) {
          var r = t.getAttribute("position");
          console.log("position = ");
          console.log(r);
        } else {
          console.log("NO ORIGIN");
        }
        O = false;
        if (S) {
          j();
          O = true;
        } else {
        }
      });
      s.addEventListener("mouseup", function (e) {});
      s.addEventListener("click", K);
      v = true;
      o.append(s);
    }
    u = document.createElement("a-box");
    switch (f) {
      case GREEN_PAD:
        u.setAttribute("color", "#00ee00");
        break;
      case RED_PAD:
        u.setAttribute("color", "#ee0000");
        break;
      default:
        u.setAttribute("color", "#eeeeee");
    }
    u.setAttribute("transparent", true);
    u.setAttribute("opacity", "1");
    u.setAttribute("scale", "1.6 0.2 1.6");
    u.setAttribute("position", new THREE.Vector3(0, -0.12, 0));
    u.setAttribute("class", "clickable");
    o.append(u);
    if (f === PAD_WITH_ROBOT) {
      b = document.createElement("a-entity");
      var e = new THREE.ConeGeometry(0.4, 1.8, 4);
      d = new THREE.MeshStandardMaterial({ color: 3684424, transparent: true });
      d.flatShading = true;
      T = new THREE.Mesh(e, d);
      T.position.set(0, 0.9, 0);
      b.setObject3D("mesh", T);
      var t = new THREE.ConeGeometry(0.3, 0.6, 3);
      var r = new THREE.Mesh(t, d);
      r.rotateX(-Math.PI / 1.6);
      r.position.set(0, 0.8, -0.2);
      T.add(r);
      m = new THREE.LineBasicMaterial({ color: 16711680, transparent: true });
      o.append(b);
      for (var a = 0; a < 12; a++) {
        var n = [];
        n.push(new THREE.Vector3(0, 0, 0));
        n.push(new THREE.Vector3(0, 10, 0));
        var e = new THREE.BufferGeometry().setFromPoints(n);
        var i = new THREE.Line(e, m);
        A.push({ mesh: i, geometry: e });
        w.add(i);
      }
      S = true;
    }
    return o;
  };
  a.getObject = function () {
    return o.object3D;
  };
  var C = function () {
    if (!S || b == null) {
      return;
    }
    var e = g_playfieldScale;
    var t = new THREE.Vector3();
    b.setAttribute("rotation", "0 " + y + " 0");
    T.getWorldPosition(t);
    t.setY(t.y + 1 * e);
    var r = new THREE.Vector3();
    var a = g.getCollisionObjects();
    var n = 6 * e;
    var i = ((y + 90) * Math.PI) / 180;
    if (g.getGameState() == STATE_LEVEL_PREVIEW) {
      i = ((y - 90) * Math.PI) / 180;
    }
    B = false;
    for (var o = 0; o < A.length; o++) {
      var s = (-o * 5 * Math.PI) / 180;
      var l = A[o].geometry.attributes.position.array;
      var u = 0;
      l[u++] = t.x;
      l[u++] = t.y;
      l[u++] = t.z;
      var c = t.x + n * Math.cos(s);
      var f = t.y + n * Math.sin(s);
      var v = t.z;
      var d = c - t.x;
      c = t.x + d * Math.cos(-i);
      v = t.z + d * Math.sin(-i);
      r.setX(c - t.x);
      r.setY(f - t.y);
      r.setZ(v - t.z);
      r.normalize();
      g_raycaster.set(t, r);
      g_raycaster.near = 0;
      g_raycaster.far = n;
      var E = g_raycaster.intersectObjects(a, true);
      if (E.length > 0) {
        c = E[0].point.x;
        f = E[0].point.y;
        v = E[0].point.z;
        if (typeof E[0].object.isPlayer != "undefined") {
          B = true;
          if (!k) {
            k = true;
            g.setEnergyDrainTransferring(true);
            g.decreasePlayerEnergy();
            g_sound.playSound(SOUND_ENERGY);
            _ = p;
          }
        }
      }
      l[u++] = c;
      l[u++] = f;
      l[u++] = v;
      A[o].geometry.attributes.position.needsUpdate = true;
      A[o].geometry.computeBoundingBox();
      A[o].geometry.computeBoundingSphere();
    }
  };
  a.getInAbsorb = function () {
    return L !== false;
  };
  var j = function () {
    L = p;
    g.setEnergyTransferring(true);
  };
  var z = function () {
    L = false;
    g.setEnergyTransferring(false);
    if (d) {
      d.opacity = 1;
      m.opacity = 1;
    }
  };
  var U = function () {
    if (!S) {
      return;
    }
    S = false;
    L = false;
    g.setEnergyTransferring(false);
    o.removeChild(b);
    b = null;
    g.increasePlayerEnergy();
    if (k) {
      k = false;
      g.setEnergyDrainTransferring(false);
    }
    for (var e = 0; e < A.length; e++) {
      w.remove(A[e].mesh);
      A[e].geometry.dispose();
    }
    A = [];
  };
  a.cleanup = function () {
    U();
  };
  var Y = function () {
    if (i === g.getCurrentPadIndex()) {
      return false;
    }
    if (!g.getOnPad()) {
      return false;
    }
    var e = g.getPlayer().getPosition();
    var t = new THREE.Vector3(e.x - V, e.y - I, e.z - x);
    return t.dot(c) >= 0;
  };
  a.highlight = function () {
    if (g.getGameState() == STATE_PLAYING && Y()) {
      if (!P) {
        g_sound.playSound(SOUND_CLICK);
      }
      switch (f) {
        case GREEN_PAD:
          s.setAttribute("color", "#8f8");
          break;
        case RED_PAD:
          s.setAttribute("color", "#f88");
          break;
        default:
          s.setAttribute("color", "#ffd");
      }
    }
    P = true;
  };
  a.unhighlight = function () {
    P = false;
    if (s) {
      switch (f) {
        case GREEN_PAD:
          s.setAttribute("color", "#0a0");
          break;
        case RED_PAD:
          s.setAttribute("color", "#a00");
          break;
        default:
          s.setAttribute("color", "#aaa");
      }
    }
  };
  var W = function (e) {
    a.highlight();
  };
  var q = function (e) {
    a.unhighlight();
  };
  var K = function (e) {};
  a.buttonDown = function (e) {
    if (P) {
      if (g.getGameState() == STATE_PLAYING) {
        var t = false;
        if (e.detail) {
          if (e.detail.cursorEl) {
            t = e.detail.cursorEl;
          }
        }
        if (g_scene == t) {
          t = null;
        }
        if (t) {
          h = t;
        } else {
        }
        O = false;
        if (S) {
          j();
          O = true;
        } else {
        }
      }
      if (g.getGameState() == STATE_PLAYING && Y() && !S) {
        g.teleportPlayer(V, I, x, N, H, i, f, function () {
          a.unhighlight();
        });
      }
    }
  };
  a.buttonUp = function (e) {
    if (L !== false) {
      z();
    }
  };
  a.playerTeleported = function (e, t) {
    if (f == BLOCKING_PAD) {
      return;
    }
    if (f === t && i !== e && f !== NORMAL_PAD && f != PAD_WITH_ROBOT) {
      s.setAttribute("wireframe", true);
      u.setAttribute("wireframe", true);
      u.setAttribute("opacity", 0.4);
      u.setAttribute("class", "");
      s.setAttribute("class", "");
      v = false;
    } else {
      if (s) {
        s.setAttribute("wireframe", false);
        s.setAttribute("class", "clickable");
      }
      u.setAttribute("wireframe", false);
      u.setAttribute("opacity", 1);
      u.setAttribute("class", "clickable");
      v = true;
    }
    k = false;
    g.setEnergyDrainTransferring(false);
    a.unhighlight();
  };
  a.getIsSolid = function () {
    return v;
  };
  a.getPadHighlighted = function () {
    return P;
  };
  a.getPadIndex = function () {
    return i;
  };
  a.getPadObject3D = function () {
    if (s && typeof s.object3D != "undefined") {
      s.object3D.userData.padIndex = i;
      if (s.object3D.children.length) {
        s.object3D.children[0].userData.padIndex = i;
      }
      return s.object3D;
    }
    return null;
  };
  a.getBoxObject3D = function () {
    if (u && typeof u.object3D != "undefined") {
      return u.object3D;
    }
    return null;
  };
  a.getIndex = function () {
    return i;
  };
  a.getEntity = function () {
    return o;
  };
  a.setPosition = function (e, t, r) {
    V = e;
    I = t;
    x = r;
    o.setAttribute("position", new THREE.Vector3(e, t, r));
  };
  a.setRotation = function (e, t, r) {
    N = e;
    M = t;
    H = r;
    o.setAttribute("rotation", new THREE.Vector3(e, t, r));
    var a = 0;
    var n = 0;
    var i = 0;
    switch (r) {
      case 90:
        a = -1;
        break;
      case 180:
        n = -1;
        break;
      case 270:
        a = 1;
        break;
    }
    switch (e) {
      case 90:
        i = 1;
        break;
      case 180:
        n = -1;
        break;
      case 270:
        i = -1;
        break;
    }
    c.set(a, n, i);
  };
  a.getPosition = function () {
    return o.getAttribute("position");
  };
  a.tick = function (e, t) {
    if (S) {
      if (L !== false) {
        var r = e - L;
        if (l === false) {
          l = new THREE.Vector3(0, 0, 0);
          s.object3D.getWorldPosition(l);
        }
        D.set(0, 0, 0);
        if (h) {
          h.object3D.getWorldPosition(D);
        } else {
          var a = g.getPlayerPosition();
          D.set(a.x, a.y - 0.05, a.z);
        }
        g.setEnergyFromTo(l, D);
        if (r > 2e3) {
          U();
        } else {
          d.opacity = (1800 - r) / 1800;
          m.opacity = (1800 - r) / 1800;
        }
      }
      if (k) {
        var a = g.getPlayerPosition();
        var n = T.worldToLocal(a);
        n.setY(0);
        var i = R.angleTo(n);
        i = (i * 180) / Math.PI;
        if (n.x < 0) {
          y += i;
        } else {
          y -= i;
        }
        if (l === false) {
          l = new THREE.Vector3(0, 0, 0);
          s.object3D.getWorldPosition(l);
        }
        D.set(0, 0, 0);
        var a = g.getPlayerPosition();
        D.set(a.x, a.y - 0.05, a.z);
        g.setEnergyDrainFromTo(D, l);
        if (e - _ > 2e3) {
          g.decreasePlayerEnergy();
          g_sound.playSound(SOUND_REMOVE);
          _ = e;
        }
      } else if (!B) {
        y = (y + t / rotationSpeed) % 360;
      }
      C();
    }
    p = e;
  };
  G();
};
g_sound = null;
var SOUND_CLICK = 1;
var SOUND_TELEPORT = 2;
var SOUND_DIE = 3;
var SOUND_FALL = 5;
var SOUND_REMOVE = 8;
var SOUND_PLACE = 9;
var SOUND_LEVEL_END = 10;
var SOUND_ENERGY = 11;
var SOUND_ENERGY2 = 12;
var SOUND_DONE = 13;
var SOUND_GAME_OVER = 14;
var SOUND_ADD_ENERGY = 15;
var Sound = function () {
  var l = null;
  this.init = function () {
    if (l == null) {
      l = new AudioContext();
    }
  };
  var u = function (e) {
    return Math.pow(2, (e - 69) / 12) * 440;
  };
  this.playSound = function (e) {
    if (l == null) {
      return;
    }
    var t = l.currentTime;
    var r = 1 / 16;
    var a = 1 / 64;
    var n = r;
    var i = l.createGain();
    var o = null;
    var s = null;
    o = l.createOscillator();
    o.type = "square";
    o.connect(i);
    i.connect(l.destination);
    switch (e) {
      case SOUND_REMOVE:
        r = 1 / 32;
        o.type = "triangle";
        o.frequency.setValueAtTime(u(45), t);
        i.gain.setValueAtTime(0, t);
        i.gain.linearRampToValueAtTime(0.3, l.currentTime + 1 / 16);
        i.gain.linearRampToValueAtTime(0, l.currentTime + r * 3);
        n = r * 3;
        break;
      case SOUND_ENERGY:
        r = 1 / 32;
        o.type = "triangle";
        o.frequency.setValueAtTime(u(45), t);
        i.gain.setValueAtTime(0, t);
        i.gain.linearRampToValueAtTime(0.3, l.currentTime + 1 / 16);
        i.gain.linearRampToValueAtTime(0, l.currentTime + r * 3);
        n = r * 3;
        break;
      case SOUND_ENERGY2:
        r = 1 / 32;
        o.type = "sawtooth";
        o.frequency.setValueAtTime(u(33), t);
        i.gain.setValueAtTime(0, t);
        i.gain.linearRampToValueAtTime(0.2, l.currentTime + 1 / 16);
        i.gain.linearRampToValueAtTime(0, l.currentTime + r * 3);
        n = r * 3;
        break;
      case SOUND_PLACE:
      case SOUND_CLICK:
        r = 1 / 32;
        o.type = "triangle";
        o.frequency.setValueAtTime(u(60), t);
        i.gain.setValueAtTime(0, t);
        i.gain.linearRampToValueAtTime(0.3, l.currentTime + 1 / 128);
        i.gain.linearRampToValueAtTime(0, l.currentTime + r * 3);
        n = r * 3;
        break;
      case SOUND_FALL:
        r = 1 / 4;
        o.type = "triangle";
        o.frequency.setValueAtTime(u(62), t);
        o.frequency.linearRampToValueAtTime(u(55), t + r * 4);
        i.gain.setValueAtTime(0, t);
        i.gain.linearRampToValueAtTime(0.3, l.currentTime + 1 / 128);
        i.gain.linearRampToValueAtTime(0, l.currentTime + r * 3);
        n = r * 4;
        break;
      case SOUND_DIE:
        r = 1 / 12;
        o.type = "sawtooth";
        o.frequency.setValueAtTime(u(56), t);
        o.frequency.linearRampToValueAtTime(u(49), t + r);
        i.gain.setValueAtTime(0, t);
        i.gain.linearRampToValueAtTime(0.2, l.currentTime + r);
        i.gain.linearRampToValueAtTime(0, l.currentTime + r * 2);
        n = r * 2;
        break;
      case SOUND_ADD_ENERGY:
        r = 1 / 12;
        o.type = "triangle";
        o.frequency.setValueAtTime(u(55), t);
        o.frequency.setValueAtTime(u(62), t + r);
        i.gain.setValueAtTime(0, t);
        i.gain.linearRampToValueAtTime(0.2, l.currentTime + 1 / 64);
        i.gain.linearRampToValueAtTime(0, l.currentTime + r * 2);
        n = r * 2;
        break;
      case SOUND_TELEPORT:
        r = 1 / 12;
        o.type = "triangle";
        o.frequency.setValueAtTime(u(55), t);
        o.frequency.setValueAtTime(u(62), t + r);
        o.frequency.setValueAtTime(u(67), t + r * 2);
        i.gain.setValueAtTime(0, t);
        i.gain.linearRampToValueAtTime(0.3, l.currentTime + 1 / 64);
        i.gain.linearRampToValueAtTime(0, l.currentTime + r * 6);
        n = r * 6;
        break;
      case SOUND_DONE:
        r = 1 / 12;
        o.type = "sawtooth";
        o.frequency.setValueAtTime(u(43), t);
        o.frequency.setValueAtTime(u(50), t + r * 4);
        o.frequency.setValueAtTime(u(48), t + r * 8);
        o.frequency.setValueAtTime(u(41), t + r * 12);
        o.frequency.setValueAtTime(u(43), t + r * 16);
        i.gain.setValueAtTime(0, t);
        i.gain.linearRampToValueAtTime(0.18, l.currentTime + 1 / 32);
        i.gain.linearRampToValueAtTime(0, l.currentTime + r * 26);
        n = r * 26;
        break;
      case SOUND_GAME_OVER:
        r = 1 / 12;
        o.type = "sawtooth";
        o.frequency.setValueAtTime(u(50), t);
        o.frequency.setValueAtTime(u(41), t + r * 4);
        o.frequency.setValueAtTime(u(43), t + r * 8);
        i.gain.setValueAtTime(0, t);
        i.gain.linearRampToValueAtTime(0.2, l.currentTime + 1 / 64);
        i.gain.linearRampToValueAtTime(0, l.currentTime + r * 14);
        n = r * 14;
        break;
    }
    o.start(l.currentTime);
    o.stop(l.currentTime + n);
  };
};
var StartButton = function (e) {
  var t = this;
  var r = document.getElementById("playfield-holder");
  var a = document.getElementById("level-text");
  var n = document.getElementById("start-button");
  var i = document.createElement("a-box");
  i.setAttribute("color", "#00f");
  i.setAttribute("scale", "0.05 0.25 1");
  i.setAttribute("position", "0 0.1 0.5");
  i.setAttribute("class", "clickable");
  i.setAttribute("visible", false);
  n.append(i);
  r.append(n);
  i.addEventListener("click", function () {
    e.startLevel();
  });
  i.addEventListener("mouseenter", function () {
    a.setAttribute("color", "#fff");
    g_sound.playSound(SOUND_CLICK);
  });
  i.addEventListener("mouseleave", function () {
    a.setAttribute("color", "#aaa");
  });
  t.hide = function () {
    i.setAttribute("class", "");
    n.object3D.visible = false;
  };
  t.show = function () {
    i.setAttribute("class", "clickable");
    n.object3D.visible = true;
  };
  t.setYPosition = function (e) {
    n.object3D.position.setY(e);
  };
};
var START_PAD = 1;
var EXIT_PAD = 2;
var NORMAL_PAD = 3;
var PAD_WITH_ROBOT = 4;
var GREEN_PAD = 5;
var RED_PAD = 6;
var BLOCKING_PAD = 7;
var g_levels = [
  {
    text: [
      "Level 1.",
      "Select a pad to teleport to.",
      "Each teleport will use one",
      "unit of energy.",
    ],
    startRotation: 0,
    energy: 8,
    data: [
      [START_PAD, 0, 0, 0, 0, 0, 0],
      [NORMAL_PAD, 0, 0.4, -6, 0, 0, 0],
      [NORMAL_PAD, -2, 1.1, -12, 0, 0, 0],
      [NORMAL_PAD, 2, 1.1, -12, 0, 0, 0],
      [EXIT_PAD, 0, 2, -18, 0, 0, 0],
    ],
  },
  {
    text: ["Level 2.", "If a robot sees you", "it will drain your energy.", ""],
    energy: 8,
    robotSpeed: 60,
    data: [
      [START_PAD, 0, 0, 0, 0, 0, 0],
      [PAD_WITH_ROBOT, -2.5, 2.9, -7, 0, 0, 0],
      [NORMAL_PAD, 0, 0.5, -7, 0, 0, 0],
      [NORMAL_PAD, 0, 1.5, -12, 0, 0, 0],
      [PAD_WITH_ROBOT, 2, 2.9, -12, 0, 0, 0],
      [EXIT_PAD, 0, 2.3, -20, 0, 0, 0],
    ],
  },
  {
    text: [
      "Level 3.",
      "You can absorb a robot's",
      " energy by selecting it's pad.",
      "",
    ],
    startRotation: 0,
    energy: 2,
    data: [
      [START_PAD, 0, 0, 0, 0, 0, 0],
      [NORMAL_PAD, 2.5, -0.5, -8, 0, 0, 0],
      [PAD_WITH_ROBOT, -2.5, -0.5, -8, 0, 0, 0],
      [NORMAL_PAD, 0.5, 4, -19, 0, 0, 270],
      [EXIT_PAD, 4, 3.5, -17, 0, 0, 0],
    ],
  },
  {
    text: [
      "Level 4.",
      "When on a green pad,",
      "other green pads will",
      "disappear",
      "",
    ],
    energy: 4,
    robotSpeed: 30,
    data: [
      [START_PAD, 0, 0, 3, 0, 0, 0],
      [GREEN_PAD, 0, 0, -3, 0, 0, 0],
      [GREEN_PAD, 0, 2.4, -10, 0, 0, 0],
      [PAD_WITH_ROBOT, -3.5, 2.5, -10, 0, 0, 0],
      [PAD_WITH_ROBOT, 3.5, 2.5, -10, 0, 0, 0],
      [GREEN_PAD, 2, 3.6, -10, 0, 0, 90],
      [BLOCKING_PAD, 2.4, 3.6, -9, 90, 0, 0],
      [GREEN_PAD, -2, 3.6, -10, 0, 0, 270],
      [BLOCKING_PAD, -2.4, 3.6, -9, 90, 0, 0],
      [NORMAL_PAD, 0, 7, -8, 0, 0, 180],
      [BLOCKING_PAD, 0, 6, -6, 90, 0, 0],
      [BLOCKING_PAD, 0, 3.5, -19, 270, 0, 0],
      [EXIT_PAD, 0, 3.5, -20, 0, 0, 0],
      [NORMAL_PAD, 5.5, 6.5, -22, 0, 0, 90],
      [GREEN_PAD, 5.5, 6.5, -21, 270, 0, 0],
      [NORMAL_PAD, -5.5, 6.5, -22, 0, 0, 270],
      [GREEN_PAD, -5.5, 6.5, -21, 270, 0, 0],
    ],
  },
  {
    text: [
      "Level 5.",
      "When on a red pad,",
      "other red pads will",
      "disappear",
      "",
    ],
    energy: 2,
    robotSpeed: 40,
    data: [
      [START_PAD, 0, 0, 3, 0, 0, 0],
      [RED_PAD, 0, 0, -5, 0, 0, 0],
      [PAD_WITH_ROBOT, 4, 0, -5, 0, 0, 0],
      [RED_PAD, 3.5, 0, -3.5, 90, 0, 0],
      [BLOCKING_PAD, 3.5, 0.2, -6, 90, 0, 0],
      [RED_PAD, 3, 2, -5, 0, 0, 90],
      [PAD_WITH_ROBOT, -4, 0, -5, 0, 0, 0],
      [RED_PAD, -3.5, 0, -3.5, 90, 0, 0],
      [BLOCKING_PAD, -3.5, 0.2, -6, 90, 0, 0],
      [RED_PAD, -3, 2, -5, 0, 0, 270],
      [RED_PAD, 0, 5, -12, 270, 0, 0],
      [GREEN_PAD, 0, 6.5, -19, 90, 0, 0],
      [NORMAL_PAD, 0, 12.5, -16.5, 0, 0, 180],
      [GREEN_PAD, 0, 12.4, -16.5, 0, 0, 0],
      [EXIT_PAD, 0, 6, -21, 0, 0, 0],
    ],
  },
  {
    text: ["Level 6.", "", "", "", ""],
    energy: 5,
    robotSpeed: 40,
    data: [
      [START_PAD, 0, 2, 3, 0, 0, 0],
      [RED_PAD, 2.5, 0, -6, 0, 0, 0],
      [BLOCKING_PAD, -0.1, 2, -6, 0, 0, 90],
      [BLOCKING_PAD, -0.1, 0.6, -6, 0, 0, 90],
      [GREEN_PAD, -2.5, 0, -6, 0, 0, 0],
      [RED_PAD, -5.5, 13.9, -12, 0, 0, 0],
      [GREEN_PAD, -5.5, 14, -12, 0, 0, 180],
      [RED_PAD, 5.5, 10, -16, 90, 0, 0],
      [GREEN_PAD, 5.5, 10, -15.7, 90, 0, 0],
      [BLOCKING_PAD, 3.2, 7.5, -8, 90, 0, 0],
      [BLOCKING_PAD, 0, 9.7, -20, 90, 0, 0],
      [EXIT_PAD, 0, 9, -21, 0, 0, 0],
      [BLOCKING_PAD, -0.9, 9.7, -21, 0, 0, 90],
      [BLOCKING_PAD, 0.7, 9.7, -21, 0, 0, 90],
      [BLOCKING_PAD, -2.8, 11.6, -20, 90, 0, 0],
      [BLOCKING_PAD, -1.4, 5, -14, 90, 0, 0],
      [RED_PAD, 2, 4.9, -18, 0, 0, 0],
      [BLOCKING_PAD, -0.1, 6.9, -18, 0, 0, 90],
      [BLOCKING_PAD, -0.1, 5.5, -18, 0, 0, 90],
      [GREEN_PAD, -2, 4.9, -18, 0, 0, 0],
      [RED_PAD, 0, 11, -28, 90, 0, 0],
      [GREEN_PAD, 0, 11, -27.9, 270, 0, 0],
    ],
  },
  {
    text: ["Level 7.", "", "", "", ""],
    energy: 3,
    robotSpeed: 30,
    data: [
      [START_PAD, 0, 3, 4, 0, 0, 0],
      [PAD_WITH_ROBOT, 2, 0, -5, 0, 0, 0],
      [NORMAL_PAD, -2, 0, -5, 0, 0, 0],
      [GREEN_PAD, -4, 6.5, -6.3, 270, 0, 0],
      [RED_PAD, -7, 8, -15, 0, 0, 270],
      [PAD_WITH_ROBOT, -3.5, 7.5, -15, 0, 0, 0],
      [GREEN_PAD, 4, 12, -24, 270, 0, 0],
      [RED_PAD, 4, 12, -24, 90, 0, 0],
      [EXIT_PAD, 0, 9, -21, 0, 0, 0],
    ],
  },
  {
    text: ["Level 8.", "", "", "", ""],
    energy: 3,
    robotSpeed: 30,
    data: [
      [START_PAD, 0, 0, 4, 0, 0, 0],
      [PAD_WITH_ROBOT, 0, 6, -6, 0, 0, 0],
      [RED_PAD, 0, 5.4, -6, 180, 0, 0],
      [NORMAL_PAD, 0, 7.5, -12.2, 90, 0, 0],
      [RED_PAD, 0, 7.5, -12, 270, 0, 0],
      [RED_PAD, 0, 11, -1.5, 270, 0, 0],
      [EXIT_PAD, 0, 7.5, -21, 0, 0, 0],
    ],
  },
];
var english_voice = "";
var available_voices = null;
var g_hasSpeech = false;
if (typeof window.speechSynthesis != "undefined") {
  available_voices = window.speechSynthesis.getVoices();
}
var utterance = false;
function speak(e) {
  if (typeof window.speechSynthesis == "undefined") {
    return;
  }
  g_hasSpeech = true;
  if (!available_voices || available_voices.length == 0) {
    available_voices = window.speechSynthesis.getVoices();
  }
  if (english_voice == "") {
    for (var t = 0; t < available_voices.length; t++) {
      if (available_voices[t].lang === "en-GB") {
        english_voice = available_voices[t];
        break;
      }
    }
    if (english_voice === "" && available_voices.length > 0) {
      english_voice = available_voices[0];
    }
  }
  if (utterance) {
    window.speechSynthesis.cancel(utterance);
  }
  utterance = new SpeechSynthesisUtterance();
  utterance.text = e;
  if (english_voice != "") {
    utterance.voice = english_voice;
  }
  window.speechSynthesis.speak(utterance);
}
var InfoPanel = function (e) {
  var t = this;
  var r = [];
  var a = document.createElement("a-entity");
  var n = document.createElement("a-plane");
  n.setAttribute("scale", "1.2 1.8 1");
  n.setAttribute("color", "#222");
  a.append(n);
  var i = document.createElement("a-text");
  i.setAttribute("value", "Energy");
  i.setAttribute("position", "-0.55 0.7 0");
  a.append(i);
  var o = [];
  for (var s = 0; s < 4; s++) {
    o[s] = document.createElement("a-text");
    o[s].setAttribute("value", "Info line 1 ");
    o[s].setAttribute("position", new THREE.Vector3(-0.54, 0.15 - 0.15 * s, 0));
    o[s].setAttribute("scale", "0.4 0.4 0.4");
    o[s].setAttribute("anchor", "left");
    a.append(o[s]);
  }
  var l = document.createElement("a-text");
  l.setAttribute("value", "");
  l.setAttribute("position", new THREE.Vector3(-0.38, -0.76, 0));
  l.setAttribute("scale", "0.3 0.3 0.3");
  l.setAttribute("anchor", "left");
  a.append(l);
  for (var s = 0; s < 8; s++) {
    var u = document.createElement("a-plane");
    u.setAttribute("color", "#0f0");
    u.setAttribute("scale", "0.1 0.1 0.1");
    u.setAttribute("position", new THREE.Vector3(-0.46 + s * 0.12, 0.43, 0.02));
    r.push(u);
    a.append(u);
  }
  var c = document.createElement("a-plane");
  c.setAttribute("scale", "0.1 0.1 0.1");
  c.setAttribute("position", new THREE.Vector3(-0.46, -0.76, 0.02));
  c.setAttribute("color", "#111");
  a.append(c);
  e.append(a);
  t.setEnergy = function (e) {
    if (e >= r.length) {
      e = r.length;
    }
    var t = 0;
    for (t = 0; t < e; t++) {
      r[t].setAttribute("color", "#0f0");
    }
    for (t = e; t < r.length; t++) {
      r[t].setAttribute("color", "#111");
    }
  };
  t.setRestartText = function (e) {
    l.setAttribute("value", e);
  };
  t.setButtonDown = function (e) {
    if (e) {
      c.setAttribute("color", "#f90");
    } else {
      c.setAttribute("color", "#111");
    }
  };
  t.setText = function (e, t) {
    o[e].setAttribute("value", t);
  };
};
