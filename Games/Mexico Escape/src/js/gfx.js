$.GFX_COLOR_TABLE = {
  "a": "000|000|000|000",
  "b": "047|026|027|255",
  "c": "073|044|040|255",
  "d": "167|113|092|255",
  "e": "051|120|030|255",
  "f": "032|076|019|255",
  "g": "017|039|010|255",
  "h": "204|083|051|255",
  "i": "090|037|023|255",
  "j": "156|064|040|255",
  "k": "120|049|030|255",
  "l": "206|195|185|255",
  "m": "176|166|157|255",
  "n": "176|161|147|255",
  "o": "145|133|121|255",
  "p": "200|184|149|255",
  "q": "195|172|123|255",
  "r": "153|135|097|255",
  "s": "105|089|055|255",
  "t": "064|050|021|255",
  "u": "173|144|092|255",
  "v": "155|120|068|255",
  "w": "251|223|132|255",
  "x": "234|197|077|255",
  "y": "239|224|211|255",
  "z": "250|241|233|255",
  "A": "225|206|189|255",
  "B": "068|090|062|255",
  "C": "046|054|044|255",
  "D": "118|131|114|255",
  "E": "085|096|081|255",
  "F": "068|091|062|255",
  "G": "041|049|038|255",
  "H": "032|041|029|255"
};

$.GFX = {
  bg_layer_1: {
    w: 640,
    h: 236,
    canvas: null,
    ctx: null,
    pack: "a83b6a629b19a620b21a619b22a618b22a616b24a616b24a616b24a615b25a458b3a154b26a455b7a151b27a454b8a151b27a453b9a151b27a452b11a150b28a450b13a149b29a131ba316b15a148b29a131ba315b17a147b29a131ba315b18a145b30a131ba313b21a144b30a130b2a311b24a143b30a130b2a310b26a141b31a130b2a302b37a137b32a130b2a301b41a131b35a130b2a300b44a129b36a129b2a299b46a128b36a128b3a298b48a127b37a126b4a297b50a125b38a126b4a296b51a125b39a125b4a286b3ab2a4b51a124b40a125b4a283b10a2b52a123b41a125b5a280b13ab53a8b2a6b11a95b41a125b5a273b3a3b69a6b21a92b44a124b5a269b80a3b24a89b46a123b7a240b3ab2a20b82a2b26a2b3a82b48a122b7a237ba2b7a18b118a78b50a122b8a235b12a15b121a75b53a120b9a234b13a14b124a58b7a6b57a3b3ab2a109b9a233b18a9b126a52b76a2b7a108b9a200b3ab2a23b23a2ba3b129a50b87a107b10a196ba2b7a20b29ab131a48b88a106b11a131b2a62b12a17b164a45b94a102b12a129b13a44b3ab2ab13a15b168a18b5a18b97a2ba36b3ab2a56b12a127b16a40bab25a10b173a11b10a10b107a23b2a2b3ab12a53b13a72b4a50b20ab2a33b29a2ba2b181a4b14a7b113a16b24a51b15a69b16a39b26a30b234a5b116a14b26a49b20ab2a61b27a28b28a28b359a9b32a39b31a14b3ab2a15b9a14b31a25b29a26b361a3b3ab36a33b35a10b12a10b12a13b32a23b32a23b363a2b44a27b38a8b14a8b14a11b34a21b35aba18b412a23b42a5b16a6b15a10b36a4b3ab2a10b39a14b415a21b45ab19a4b20a6b49a7b42a8b419a9b3ab2a3b93abab51a4b46a5b422a4ba2b157a2b49a2b425ab117565"
  },
  bg_layer_2: {
    w: 640,
    h: 175,
    canvas: null,
    ctx: null,
    pack: "a574c12a622c24a612c32a605c38a589c54a580c62a574c68a198c12a359c73a59c12a64c12a21c12a10c24a10c12a328c82a47c24a52c24a9c80a254c12a16c12a26c90a37c32a44c32ac88a244c24a4c24a18c96a30c38a23c142a237c60a12c101a24c44a14c151a134c12a16c12a57c66a3c113a7c57a8c157a104c12a10c24a4c24a10c12a16c261a3c162a96c108a4c434a90c556a81c565a72c572a13ca23ca19c586a5c11a13c11a8c99547"
  },
  bg_layer_3: {
    w: 640,
    h: 122,
    canvas: null,
    ctx: null,
    pack: "a236d26a599d45a591d63a360d6a199d7ad76a345d20a92d9a88d106a317d32a83d24a74d120a302d41a77d43a23d10a15d134a293d60a60d236a279d69a55d239a272d83a45d246a261d112a14d263a246d399a236d413a223d426a204d441a183d462a159d486a150d495a141d530a88d572a39d4a23d65409"
  },
  player: {
    w: 41,
    h: 89,
    canvas: null,
    ctx: null,
    pack: "a14ea40fa40fea39gfa39gfea39gfea39gfea39gf2ea38gf2ea38gf2a39gf2ea37gf2ea37gf3a36g2f3ea35gfgf3a30g4fgfgf3e6a23g4fgfgf6efefe2a20g4fgfgf8efef2ea18g4fgfgf12ef2ea16g6fgf14hgfea14g6fgf5ef8h4ga14i2g3fgfgj2gefej2gf4eh5a13ik2g3fgjkjkgej4g2fefeh5a11i2k2g2fgjkj9hjg2feh5a11i2k7jkjkj7hjh9a9i2k7jkj11hjh8a9i2k8jkjkj7hjh10a8i2k7jkj11hjh9a8i2k6jkj11hjhjh8a7i2k8jkjkj9hjhj2h6a7i2k7jkj13hl2mjh6a6i2k8j14l4mjh5a6i2k7jkjkj11l2nomjh5a6i2k8j14l2nomjh5a6i2k7jkjkj11l4mjh5a6i2k6jkj15l2mjh6a6i2k7jkjkj11hjhjh7a6i2k6jkj15hjh8a6i2k7jkjkj11hjh9a6i2k6jkj13hjhjh8a7ik6jkj14hjh8a8i2k6jkjkj10hjh9a9ik5jkj14hjh2lmh4a9ik6jkjkj10hjh3lmh4a10k7j14h9a11k6jkj12hjh8a11ik6jkjkj10h8a13k5jkj12hjh6a14k6jkjkj8hjh7a14k5jkj12h8a14k6jkjkj8hjh6a15k5jkj10hjh7a15k4jkjkjkj6hjh8a15k5jkj10hjh6a16k4jkjkjkj6hjh7a16k5jkj10h8a16k4jkj10hjh6a17k3jkjkjkj6hjhjh5a17k4jkj10hjh5a18k3jkj10hjh6a18k2jkjkjkj6hjh6a18ik3jkj8hjhjh5a18k3jkj10hjh5a19k4jkjkj6hjh6a19k3jkj8hjh6a19k3jkj2kj5hjh7a19k2jkj10h7a20k3jkjkj6hjh5a20ik2jkj8hjh6a20k4jkjkj6h6a21k3jkj8hjh4a22k2jkj10h5a22k3jkjkj7h4a23k2jkj9h5a23k3jkjkj6h4a23ik2jkj9h3a24k2jkjkjkj5h3a25k3jkj8h2a26k2jkj2kj5h2a26k2jkj8h3a26k3jkjkj4h3a26ik2jkj5h4a26ik2jkj5h4a27ik3jkjkjh3a28ik3jkj3h2a29ik3jkj2kha30i2k2jkj3a32ik4jka35k3ja36"
  },
  sombrero: {
    w: 235,
    h: 105,
    canvas: null,
    ctx: null,
    pack: "a105p25a210p25a210p25a210p25a210p25a205p5q5r5q5r5q5p5a200p5q5r5q5r5q5p5a200p5q5r5q5r5q5p5a200p5q5r5q5r5q5p5a200p5q5r5q5r5q5p5a200q5r5q5r5q5r5q5a200q5r5q5r5q5r5q5a200q5r5q5r5q5r5q5a200q5r5q5r5q5r5q5a200q5r5q5r5q5r5q5a195p5r5q5r5q5r5q5r5p5a190p5r5q5r5q5r5q5r5p5a190p5r5q5r5q5r5q5r5p5a190p5r5q5r5q5r5q5r5p5a190p5r5q5r5q5r5q5r5p5a185p5r5q5r25q5r5p5a180p5r5q5r25q5r5p5a180p5r5q5r25q5r5p5a180p5r5q5r25q5r5p5a180p5r5q5r25q5r5p5a180r20q5r5q5r20a180r20q5r5q5r20a180r20q5r5q5r20a180r20q5r5q5r20a180r20q5r5q5r20a175r5q5r5q5r25q5r5q5r5a170r5q5r5q5r25q5r5q5r5a170r5q5r5q5r25q5r5q5r5a170r5q5r5q5r25q5r5q5r5a170r5q5r5q5r25q5r5q5r5a170r65a170r65a170r65a170r65a170r65a170r65a170r65a170r65a170r65a170r65a170s5r5s5r5s5r5s5r5s5r5s5r5s5a170s5r5s5r5s5r5s5r5s5r5s5r5s5a170s5r5s5r5s5r5s5r5s5r5s5r5s5a170s5r5s5r5s5r5s5r5s5r5s5r5s5a170s5r5s5r5s5r5s5r5s5r5s5r5s5a165r75a160r75a160r75a160r75a160r75a80r10a70r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5a70r20a70r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5a70r20a70r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5a70r20a70r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5a70r20a70r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5a70r30a60s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5a60r40a60s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5a60r40a60s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5a60r40a60s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5a60r40a60s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5a60r20a5r25a50s5t5s5t5s5t5s5t5s5t5s5t5s5t5s5a50r25a10r25a50s5t5s5t5s5t5s5t5s5t5s5t5s5t5s5a50r25a10r25a50s5t5s5t5s5t5s5t5s5t5s5t5s5t5s5a50r25a10r25a50s5t5s5t5s5t5s5t5s5t5s5t5s5t5s5a50r25a10r25a50s5t5s5t5s5t5s5t5s5t5s5t5s5t5s5a50r25a10r10s5r35q5r5q5r5q85r5q5r5q5r35s5r10a10r10s5r35q5r5q5r5q85r5q5r5q5r35s5r10a10r10s5r35q5r5q5r5q85r5q5r5q5r35s5r10a10r10s5r35q5r5q5r5q85r5q5r5q5r35s5r10a10r10s5r35q5r5q5r5q85r5q5r5q5r35s5r10a10r10q5r10s5r5s5r145s5r5s5r5q5r15a10r10q5r10s5r5s5r145s5r5s5r5q5r15a10r10q5r10s5r5s5r145s5r5s5r5q5r15a10r10q5r10s5r5s5r145s5r5s5r5q5r15a10r10q5r10s5r5s5r145s5r5s5r5q5r15a15q5u5q5r5q5r10q5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5q5r10q5r5q10u5r5a20q5u5q5r5q5r10q5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5q5r10q5r5q10u5r5a20q5u5q5r5q5r10q5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5q5r10q5r5q10u5r5a20q5u5q5r5q5r10q5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5q5r10q5r5q10u5r5a20q5u5q5r5q5r10q5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5r5s5q5r10q5r5q10u5r5a20u5q5u5q5u5q5u5q10r5q5r10q5r10q5r10q5r10q5r10q5r10q5r10q5r5q15u5q5u5q5u5q5s5a20u5q5u5q5u5q5u5q10r5q5r10q5r10q5r10q5r10q5r10q5r10q5r10q5r5q15u5q5u5q5u5q5s5a20u5q5u5q5u5q5u5q10r5q5r10q5r10q5r10q5r10q5r10q5r10q5r10q5r5q15u5q5u5q5u5q5s5a20u5q5u5q5u5q5u5q10r5q5r10q5r10q5r10q5r10q5r10q5r10q5r10q5r5q15u5q5u5q5u5q5s5a20u5q5u5q5u5q5u5q10r5q5r10q5r10q5r10q5r10q5r10q5r10q5r10q5r5q15u5q5u5q5u5q5s5a25v5u10q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u10v5a30v5u10q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u10v5a30v5u10q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u10v5a30v5u10q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u10v5a30v5u10q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u10v5a40v5u25q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u25v5a50v5u25q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u25v5a50v5u25q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u25v5a50v5u25q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u25v5a50v5u25q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u5q5u25v5a75v5u125v5a100v5u125v5a100v5u125v5a100v5u125v5a100v5u125v5a50"
  },
  peyote: {
    w: 21,
    h: 23,
    canvas: null,
    ctx: null,
    pack: "a9w3a17waxawa14yzax3azya11y3z5y3a9yABy7BAya8ACy2Ay3Ay2DAa7C3yACAyADAyBD2a5C3EACF2AF3AGBD2a4C3ECF2CHFDFDGD3a3C3ECF4HF4DGD3a2C3EFCFCFHF2DF2GBD2aC4ECF4HF5GD4C3ECF2CF2HF3DFDGD3C3EF6HF6GD3C3ECFCF3HF3DFDGD3C4EF5HF5GD4C3BEFCF3HF2DF2GBD3C4EF5HF4DGD4aC2BCEFCF2HF4GD4a2C3BEF4HFDF2GBD3a3C3FEF3HF3GFD3a6C2ECB2HB2DGD2a9C2ECBHBDGD2a5"
  }
};

$.unpackColorTable = function() {
  Object.keys($.GFX_COLOR_TABLE).forEach(function(label) {
    $.GFX_COLOR_TABLE[label] = $.GFX_COLOR_TABLE[label].split("|").map(function(s) {return parseInt(s);});
  });
};

$.unpackGFX = function(cb) {
  $.unpackColorTable();

  Object.keys($.GFX).forEach(function(g) {
    var gfx = $.GFX[g];
    gfx.ctx = (gfx.canvas = document.createElement("canvas")).getContext("2d");
    gfx.canvas.webkitImageSmoothingEnabled = false;
    gfx.canvas.mozImageSmoothingEnabled = false;
    gfx.canvas.imageSmoothingEnabled = false;

    gfx.canvas.width = gfx.w;
    gfx.canvas.height = gfx.h;

    if(gfx.pack) {

      var m = [], k, packs, idx;

      packs = gfx.pack.split(/(\w\d*)/g).filter(function(_) {return !!_});
      for(idx in packs) {
        k = parseInt(packs[idx].substr(1), 10);
        k = ( isNaN(k) ? 1 : k );
        while(k--)
          m.push(
              $.GFX_COLOR_TABLE[packs[idx][0]][0],
              $.GFX_COLOR_TABLE[packs[idx][0]][1],
              $.GFX_COLOR_TABLE[packs[idx][0]][2],
              $.GFX_COLOR_TABLE[packs[idx][0]][3]
          );
      }

      try {
        gfx.ctx.putImageData(new ImageData(new Uint8ClampedArray(m), gfx.w, gfx.h), 0, 0);
      } catch(e) {
        //Last minute fix for Edge; slow as hell but it works :)
        for(var i=0;i<m.length;i+=4) {
          gfx.ctx.beginPath();
          gfx.ctx.fillStyle = "rgba(" + m[i] + ", " + m[i+1] + ", " + m[i+2] + ", " + m[i+3] + ")";
          gfx.ctx.fillRect(Math.floor((i / 4) % gfx.w), Math.floor((i / 4) / gfx.w), 1, 1);
        }
      }
    }

    /*gfx.canvas.style.top = gfx.h + "px";
    document.body.appendChild(gfx.canvas);*/

  });

  cb();
};