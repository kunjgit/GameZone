let uB = [];

let createMatrix = () => {
  uB = [];
  for (let i = 0; i < curG.sNum; i++) {
    uB.push({});
  }
  // why does this make one object by reference
  // uB = Array(curG.sNum).fill(new Object());

  let table = ce('table');
  let col = ce('col');
  col[sa]('span', 1);
  table[ac](col);
  let labelRow = ce('tr');
  let spacer = ce('td');
  labelRow[ac](spacer);

  curG.sN[fe](col => {
    let newCol = ce('th');
    newCol[cl].add('person');
    newCol[ih] = `<span>${col}</span>`;
    labelRow[ac](newCol)
  });

  table[ac](labelRow);

  let re = (span, opt, slot, category) => {
    let current = span.innerText;
    current = opt[opt.indexOf(current) + 1];
    if (!current) {
      current = opt[0]
    }

    sfx([.7,.45,82.40689,,,.02,,3,35,,-150 + ((opt.indexOf(current) + 1) * 100),-0.06,,,,,,.5,.03,.21]);
    uB[slot][category] = { d: current, span };
    span.innerText = current;
    span[cl].remove('correct','incorrect');
    span[sa]('data-o', opt.indexOf(current));
  };

  curG.cats[fe]((r, i) => {
    labelRow = ce('tr');
    labelRow[cl].add('mrow');
    spacer = ce('th');
    spacer[ih] = curG.cNms[i];
    labelRow[ac](spacer);

    let clickopt = ['_', ...r];
    curG.sN[fe]((col, slot) => {
      let newCol = ce('td');
      newCol[cl].add('cme');

      let newSpan = ce('span');
      newSpan[sa]('data-o', 0);
      newSpan[ih] = clickopt[0];
      uB[slot][curG.cNms[i]] = { d: '_', span: newSpan };
      newCol.onclick = (e) => {
        re(newSpan, clickopt, slot, curG.cNms[i]);
      };
      newCol[ac](newSpan);
      labelRow[ac](newCol);
    });

    table[ac](labelRow);

    labelRow = ce('tr');
    labelRow[cl].add('mrow');
  });

  labelRow = ce('tr');
  labelRow[cl].add('mrow');
  let li = ce('td');
  li[sa]('id', 'li');
  li[ih] = '●●●';
  labelRow[ac](li);

  let checker = ce('button');
  checker[cl].add('clue');
  checker.onclick = () => {
    if (scoreMatrix()) {
      checker.parentNode.parentNode.parentNode.removeChild(checker.parentNode.parentNode);
      wbc[ih] = '';

      wbc.parentElement.scrollTo(0,0);
      cont[cl].add('end');
      if (curG.attempts <= 3) {
        say(opt[opt.lang].wellDone + (opt.t ? '... 🥇': ''));
        sfx([1.4,,474,,.25,.63,1,1.145,-0.3,,100,.09,.09,,,,.09,.4,.65]);
        opt.t ? mn.innerText = parseInt(mn.innerText) + 1 : null;
      } else {
        say('')
        wbc[sa]('data-flair', rst(randGender('🙅🏽‍♂️')));
        wbc[sa]('data-msg', '○○○');
        sfx([1.11,,260,.05,.18,.78,,1.9,,,-23,.06,.14,,,,,.8]);
        pause = true;
        // repeat board of same size
        to(() => {
          addGame(curG.sNum,curG.catNum).then((g) => {
            newDet();
            sng(g);
          });
        }, 3000);
        return;
      }
      cn.innerText = parseInt(cn.innerText) + 1;
      pause = true;
      to(() => {
        pause = false;
        wbc[ih] = ``;
        timeouts[fe](t => clearTimeout(t));
        selectNewVoice();
        sng();
      }, 3000);
    } else if (curG.attempts <= 3){
      sfx(bd);
      li[ih] = '●'.repeat(3 - curG.attempts) + '○'.repeat(curG.attempts);
    }
  };
  checker.innerText = '👍';

  spacer = ce('td');
  spacer[sa]('colspan', curG.sNum );
  spacer[ac](checker);
  labelRow[ac](spacer);

  table[ac](labelRow);

  matrix[ac](table);

};
