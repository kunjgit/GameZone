// wbc
//['ti', 'tiai', 'a', 'b', 'nt']
// opt.sN

let wordClues = clue => {
  let keys = Object.keys(clue.d[0]);
  let keys2 = Object.keys(clue.d[1] || {});
  let option, option2, option3;

  option = (curG.cats[curG.cNms.indexOf(keys[0])] || []).indexOf(clue.d[0][keys[0]]) + 1;
  option2 = (curG.cats[curG.cNms.indexOf(keys[1])] || []).indexOf(clue.d[0][keys[1]]) + 1;
  if (keys2.length)
  option3 = (curG.cats[curG.cNms.indexOf(keys2[0])] || []).indexOf(clue.d[1][keys2[0]]) + 1;
  let per = '';
  let sdo = '<span data-o="'

  switch(opt.lang) {
    case 'es':
    per = 'la persona con ';
    switch(clue.type) {
      case 'ti':
        return `${per} ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>, también tiene ${keys[1]}  ${sdo}${option2}">${clue.d[0][keys[1]]}</span>`;
      break;
      case 'tiai':
        return `<span class="person">${curG.sN[clue.d[1].i]}</span>tiene ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
      case 'b':
        return `${per} ${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span> está a la derecha de ${per} ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
      case 'a':
        return `${per} ${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span> está a la izquierda de ${per} ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
      case 'nt':
        return `${per} ${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span> está cerca de ${per} ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
    }
    break;
    case 'fr':
    per = 'la personne avec ';
    switch(clue.type) {
      case 'ti':
        return `${per} ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>, aussi tiens ${keys[1]}  ${sdo}${option2}">${clue.d[0][keys[1]]}</span>`;
      break;
      case 'tiai':
        return `<span class="person">${curG.sN[clue.d[1].i]}</span>tiens ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
      case 'b':
        return `${per} ${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span> est à droite de<br/>${per} ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
      case 'a':
        return `${per} ${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span> est à gauche de<br/>${per} ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
      case 'nt':
        return `${per} ${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span> est a coté de<br/>${per} ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
    }
    break;
    case 'zh-CN':
    switch(clue.type) {
      case 'ti':
        return `有${sdo}${option}">${clue.d[0][keys[0]]}</span> ${keys[0]} 的人, 也有${sdo}${option2}">${clue.d[0][keys[1]]}</span> 的${keys[1]}`;
      break;
      case 'tiai':
        return `<span class="person">${curG.sN[clue.d[1].i]}</span>有 ${sdo}${option}">${clue.d[0][keys[0]]}</span> 的${keys[0]}`;
      break;
      case 'b':
        return `${keys2[0]}${sdo}${option3}">${clue.d[1][keys2[0]]}</span> 在${keys[0]}${sdo}${option}">${clue.d[0][keys[0]]}</span> 的右边`;
      break;
      case 'a':
        return `${keys2[0]}${sdo}${option3}">${clue.d[1][keys2[0]]}</span> 在${keys[0]}${sdo}${option}">${clue.d[0][keys[0]]}</span> 的左边`;
      break;
      case 'nt':
        return `${keys2[0]}${sdo}${option3}">${clue.d[1][keys2[0]]}</span> 就在${keys[0]}${sdo}${option}">${clue.d[0][keys[0]]}</span> 的旁边`;
      break;
    }
    case 'tp':
    switch(clue.type) {
      case 'ti':
        return `jan li jo e ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span> li jo e ${keys[1]}  ${sdo}${option2}">${clue.d[0][keys[1]]}</span> kin`
      break;
      case 'tiai':
        return `jan <span class="person">${curG.sN[clue.d[1].i]}</span>li jo e ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
      case 'b':
        return `${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span> li lon poka pini pi ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
      case 'a':
        return `${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span> li lon poka open pi ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
      case 'nt':
        return `${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span> li lon poka pi ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
    }
    break;
    default:
    per = 'the person with ';
    switch(clue.type) {
      case 'ti':
        return `The one with ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>, also has ${keys[1]}  ${sdo}${option2}">${clue.d[0][keys[1]]}</span>`
      break;
      case 'tiai':
        return `<span class="person">${curG.sN[clue.d[1].i]}</span>has ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>`;
      break;
      case 'a':
        return `One left of ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span> is ${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span>`;
      break;
      case 'b':
        return `One right of ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span> is ${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span>`;
      break;
      case 'nt':
        return `Next to ${per} ${keys[0]}  ${sdo}${option}">${clue.d[0][keys[0]]}</span>,<br/> is ${per} ${keys2[0]}  ${sdo}${option3}">${clue.d[1][keys2[0]]}</span>`;
      break;
    }
    break;
  }
};

let showClueArr = (arr, div) => {
  [...d[gcn]('loading')][fe](c => c[ih] = '');
  arr.map(wordClues)[fe]((clue, i) => {
      let note = ce('div');
      note[cl].add('waiting')
      note[ih] = '';
      wbc[ac](note);
    to(() => {
      note[cl].remove('waiting');
      note[ih] = '';
      note.onclick = (e) => { say(e.target.innerText.replace(fsn, '')) };
      note[ih] = clue;
      note[cl].add('clue');
      sfx([2,0,~~(40 + M[ra]() * 40),.01,,.26,1,2.5,.2,,,,1,,,,,.3,.05]);
      say(note.innerText.replace(fsn, ''));
    }, clueTime * (i + (sound ? 0 : 1)));
  });

  if (div) {
    to(() => {
      let note = nnote();
      wbc[ac](note);
    }, (arr.length + 1) * 1000);
  }
}

let scoreMatrix = () => {
  [...d[gcn]('dan')][fe](c => c[cl].remove('dan'));
  curG.attempts += 1;

  //if (curG.level === curG.levels.length - 1) {
    // player is on last level check entire board
    let finalBoard = curG.levels[curG.levels.length -1].cb[0];
    let cleared = true;
    for(let col = 0; col < curG.sNum; col++) {
      for(let row = 0; row < curG.cats.length; row++) {
        let user = uB[col][curG.cNms[row]];
        user.span[cl].remove('correct,incorrect');
        if (user.d === '_'){
          cleared = opt.t = false;
          continue;
        }
        if (finalBoard[col][curG.cNms[row]] === user.d) {
          to(() => {
            user.span.parentElement.style.pointerEvents = 'none';
            user.span[cl].add('correct');
            user.span[cl].remove('incorrect');
          }, (row + col) * 100)

        } else {
          to(() => {
            user.span[cl].add('incorrect');
            sfx(bd);
          }, (row + col) * 100)

          cleared = opt.t = false;
        }
      }
    }
    return cleared;
}

let extraClueButton = () => {
  if (!curG.extraClue) return;
  let checker = ce('button');
  checker[cl].add('clue');
  checker.onclick = () => {
    curG.extraClue();
    checker.parentNode.removeChild(checker);
  };
  checker[ih] = '+ 🔍';

  let spacer = ce('div');
  spacer[cl].add('spacer');
  wbc[ac](spacer);

  wbc[ac](checker);
}

let nnote = () =>  {
  let n = ce('div');
  n[cl].add('clue');
  n[ih] = '<h3 class="loading">🔍</h3>';
  return n;
}

let clueTime, levelTime;
let setupWorkbook = () => {
  timeouts[fe](t => clearTimeout(t));
  clueTime = (sound ? 6600 : 800);
  levelTime = (sound ? 2000 : 7000);
  let tutorial = curG.sNum === 1 ? (sound ? 7000 : 4000) : (sound ? 2500 : 1000);

  let clues = 0;
  curG.levels[fe]((level, i, arr) => {
    to(() => {
      curG.level = i;
      showClueArr(level.rwc, i < arr.length - 1);

      // if it's the last level still show the ellipse
      if (curG.level === arr.length - 1) {
        let note = nnote();
        wbc[ac](note);
        to(() => {
          note[cl].add('clue');
          note[cl][ih] = '';
          note[ih] = `<br/><h3>${opt[opt.lang].solvable}</h3>`;
          opt.t = false;
          theme(-200);
          to(() => say(opt[opt.lang].solvable), 600);
          wbc[ac](note);
          extraClueButton();
        }, 6600 * level.rwc.length - 1 + (curG.sNum + curG.catNum) * 500);
      // }, clueTime * level.rwc.length - 1 + 2000);
      }
    }, clues * clueTime + tutorial + (i * levelTime));

    clues += level.rwc.length;
  });

  let note = ce('div');
  if (curG.sNum === 1) {
    note[ih] = `<div class="tutorial">${opt[opt.lang].tutorial}</div>`;
    say(opt[opt.lang].tutorial);
  } else {
    newDet();
    note[ih] = `<h1><span>${det}</span> ${opt[opt.lang].newCase}</h1>`;
    theme();
    to(() => say(opt[opt.lang].newCase), 700);
  }

  wbc[ac](note);
  wbc[ac](nnote());
};
