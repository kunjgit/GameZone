let curG, sound = true, pause = false, games = [];
let shuffle = (arr) => arr.sort(() => .5 - M[ra]()),
timeouts = [],
cont = d[ge]('cont'),
wbc = d[ge]('wbc'),
matrix = d[ge]('matrix'),
root = d[ge]('root'),
cn = d[ge]('cn'),
mn = d[ge]('mn'),
bd = [1.82,,1554,,.03,.23,,1.67,,,,,,,34,,.06,.62,.06];

let theme = (mod = 65) => {
  // let s = (t, a) => to(() => sfx([.82,0.1,a,.1,.3,.22,,3,,,,.05,,,,,,(700 - a) / 1000,.19,1]), t);
  let s = (t, a) => to(() => sfx([2,,a,,.08,.07,,.94,,,510,.09,.08,,,,.05,1.5,.02,.1]), t);
  [0, 250, 500][fe]((e,i) => s(e, 100 - i * mod));
},

// get value
gi = (id, or = 3) => parseInt(d[ge](id).value) || or,
// replace text
fi = (id, txt) => d[ge](id)[ih] = txt,
// create element
ce = s => d.createElement(s),

to = (func, time) => {
  timeouts.push(setTimeout(func, time));
},

checkToString = (arr) => arr.map(o => {
  return Object.keys(o).concat(Object.values(o))
}).flat().sort().join(),

sample = arr => {
  let len = arr == null ? 0 : arr.length
  return len ? arr[~~(M[ra]() * len)] : undefined
},

sampleSize = (size, list, collected = []) => size < 1 || list.length < 1 ?
  collected :
  shuffle(size >= list.length ? [...collected, ...list] : M[ra]() < size / list.length ?
  sampleSize(size - 1, list.slice(1), [...collected, list[0]]) :
  sampleSize(size, list.slice(1), collected)),

iareEquals = (a, b) => {
  for(let i = 0; i < a.length; i++) {
    for(var key in a[i]) {
        if(!(key in b[i]) || a[i][key] !== b[i][key]) {
            return false;
        }
    }
    for(var key in b[i]) {
        if(!(key in a[i]) || a[i][key] !== b[i][key]) {
            return false;
        }
    }
  }
  return true;
},

// random skin tone?
stMod = [
  '\u{1f3fb}',
  '\u{1f3fc}',
  '\u{1f3fd}',
  '\u{1f3fe}',
  '\u{1f3ff}',
],

gMod = [
  '👩',
  '👨',
];
gMod2 = ['♂️','♀️'],

fsn = new RegExp("\ud83c[\udffb-\udfff]", "g"),
fg = new RegExp(gMod.join('|'), "g"),
fg2 = new RegExp(gMod2.join('|'), "g"),
rst = (string) => string.replace(fsn, sample(stMod)),
randGender = (string) => string.replace(fg, sample(gMod)).replace(fg2, sample(gMod2));

let det;
let newDet = () => {
  det = rst(randGender('🕵🏼‍♂️'));
  d[ge]('det')[ih] = det;
  d.title = `BLANKS ${det} - Reduce the space`;
  wbc[sa]('data-flair', `${det}`);
}

let su = a => a.split(',');
let opt = {
  lang: 'en',
  files: 6,
  clueTypes: su('ti,tiai,a,b,nt'),
  cats: [
    "👓,👕,👘,🎩,👠,🧤,🧣,👒,🧢,🩳,🧦",
    "🎷,🎸,🎺,🎻,🪕,🥁,🎹",
    "⚽,🏀,🏈,🎾,🥏,🏓,🎳,⚾,🏸,🥌",
    "❤️,🧡,💛,💚,💙,💜,🖤,🤎,💔,💖,💕",
    "🍇,🍉,🍊,🍎,🥝,🥥,🍐,🍑,🍒,🍋,🍌",
    "🐒,🐕,🐈,🦓,🐄,🐖,🐪,🐘,🐇,🐿️,🦨,🦇",
    "🥯,🍔,🍕,🧀,🍜,🍦,🍩,🍿,🥐,🌮,🍣,🥔,🧁,🥪",
    "🥰,😎,👿,🤔,😓,😷,🥺,🤪,😇,🥶,🥱,🧐,😉,😲"
  ],
  sN: "🧟‍♂️,🦹🏽‍♂️,🦸🏽‍♂️,🧛🏽‍♂️,👷🏻‍♂️,👨🏽‍🎨,👨🏿‍💼,👨🏻‍🔧,👨🏾‍⚕️,👨🏼‍🌾,👨🏽‍⚖️,👨🏾‍🔬,👨🏼‍🎤,👨🏽‍🚀,👮🏽‍♂️,👩🏽‍🍳,🧕🏼,💂🏽‍♂️,🧙🏼‍♂️,👰🏻,👩🏼‍✈️,🧝🏽‍♂️,👨🏾‍🚒,👩🏽‍🎓,👩🏼‍🏭,🧚🏽‍♂️",
  en: "Well Done!_Possible 👍_No more clues._Tutorial: Use these clues. Fill in those spaces.  Then 👍_New Case!_# of People_# of Categories_Choose_Create_Community_Case Files",
  tp: "pona!_ken 👍_pini_kama sona: o kute e toki pi wile sona. tenpo pini la o luka e 👍_utala sin_jan_kulupu ilo_o pana_o sin_kulupu_utala mute",
  fr: "Bien Joué!_👍 Possible_Indices terminés._Tutoriel: Utilisez les indices. Remplissez les espaces. Enfin appuyez sur 👍_Nouveau Mystère!_Nombre de Personnes_Nombre de Catégories_Choisir_Créer_Communauté_Fichiers de Mystères",
  es: "¡Bien Hecho!_👍 Posible_No más pistas._Tutorial: Usa las pistas. Completa la información. Finalmente toca 👍_Nuevo Misterio!_Gente_Categorías_Elegir_Crear_Comunidad_Archivos de Misterios",
  'zh-CN': "做得好!_可以完成_没有了_教程：使用线索并完成信息。 然后单击 👍。_新谜底!_人数_类别数_选择_创建_社区_神秘档案",
};

opt.sN = su(opt.sN);
opt.cats = opt.cats.map(su);
let kk = su("wellDone,solvable,noMore,tutorial,newCase,p,c,ch,cr,com,ff");
['en', 'tp', 'fr', 'es', 'zh-CN'][fe]((l) => {
  let nl = {};
  opt[l] = opt[l].split('_')[fe]((w, i) => nl[kk[i]] = w);
  opt[l] = nl;
})


let lang = (e, play = true) => {
  pause = false;
  if (play) {
    sfx([.7,.45,82.40689,,,.02,,3,35,,-150,-0.06,,,,,,.5,.03,.21]);
    if (e.target) {
      e.target[cl].add('selected');
      e = e ? e.target.getAttribute('id') : 'en';
    }
  }

  opt.lang = e;

  switch (opt.lang) {
    case 'tp':
      opt.cNms = su('len,kalama musi,musi utala,olin,kili,soweli,moku,pilin');
    break;
    case 'fr':
      opt.cNms = su('le vêtement,l\'instrument,le sport,le cœur,le fruit,l\'animal,la bouffe,le sentiment');
    break;
    case 'es':
      opt.cNms = su('la ropa,el instrumento,el deporte,el corazón,la fruta,el animal,la comida,el sentimiento');
    break;
    case 'zh-CN':
      opt.cNms = su('衣服,乐器,运动,心脏,水果,动物,食物,心情');
    break;
    default:
      opt.cNms = su('clothes,instrument,sport,heart,fruit,animal,food,mood');
    break;
  }
  games = [];
  addGame(1, 2).then((g) => tt = g);
}

lang('en', false);

[...d[gcn]('lang')][fe]((button, i, arr) => {
  button.addEventListener('click', (e) => {
    arr[fe](a => a[cl].remove('selected'));
    lang(e);
  });
});

newDet();

let voice;
let selectNewVoice = () => {
  let tries = 0;

  voice = window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.indexOf(opt.lang) > -1);
  voice = voice[new Date%voice.length];

  if (!voice) {
    to(selectNewVoice, 1000);
  }
}

selectNewVoice();
let sfx = (d) => {
  if (pause) return;
  if (!sound) return;
  zzfx(...d);
}

let say = (m) => {
  if (opt.lang === 'tp') return;
  if (!sound) return;
  if (pause) return;
  selectNewVoice();
  speechSynthesis.cancel();
  let msg = new SpeechSynthesisUtterance();
  msg.voice = voice;
  // msg.volume = 1;
  // msg.pitch = 1.1;
  // msg.rate = 1;
  msg.text = m.replace(new RegExp("cœur|corazón|heart", "g"), '');
  msg.lang = opt.lang;
  speechSynthesis.speak(msg);
};

let chooseGame = () => {
  clear();
  wbc[ac](nnote());
  root.style.display = 'none';
  addGame(gi('people'), gi('cats')).then(g => sng(g));
};

setInterval(() => {
  if (cont[cl].contains('end')) return;
  let s = sample([...d[gcn]('cme')]);
  if (!s || s.children[0][cl].contains('correct', 'incorrect') || curG.sNum == 1) {
    return;
  }
  s[cl].add('dan');
  setTimeout(() => {
  while (s.children[0].dataset.o !== '0'){
    if (!s[cl].contains('dan')) return;
    s.click();
  }
  [...d[gcn]('dan')][fe](c => c[cl].remove('dan'))
  }, 800);
}, 50000);
