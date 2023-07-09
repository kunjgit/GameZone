let addGame = (sNum = 2, catNum = 2) => {
  return new Promise(function(resolve){
  let row,
    constraints,
    prevSolution,
    steps,
    currentStep,
    everyObject,
    firstBoard,
    attemptedConstraints,
    firstOffering,
    solutionFound,
    levels,
    stepTest;

  let reset = () => {
    row = [...Array(sNum)].map(a => ({}));
    constraints = [];
    prevSolution = 0;
    steps = [];
    currentStep = [];
    everyObject = false;
    firstBoard = false;
    attemptedConstraints = [];
    firstOffering = 0;
    solutionFound = false;
    levels = [];
    stepTest = [];
  };

  reset();

  let chunk = (arr) => {
    var R = [];
    let chunkSize;
    for (var i = 0, len = arr.length; i < len; i += chunkSize) {
      chunkSize = M.max(1, ~~(M[ra]() * sNum) + 1, ~~(M[ra]() * catNum) + 1);
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  let cats = opt.cats;
  let cNms = opt.cNms;
  let sN = opt.sN;

  sN = sampleSize(sNum, sN).map(f => rst(f)).map(f => randGender(f));

  let select = sampleSize(catNum, [...Array(cNms.length).keys()]);

  cNms = cNms.filter((a, i) => select.indexOf(i) !== -1);
  cats = cats.filter((a, i) => select.indexOf(i) !== -1).map(e => sampleSize(sNum + 2, e));

  let maxFill = catNum * sNum;

  let canBe = (slot, criteria) => {
    for (let key of Object.keys(criteria))
      if (slot[key] && slot[key] !== criteria[key]) return false;
    return true;
  };

  let clueCheck = {
    * ti(critA, critB, row) {
      for (let i of [...Array(row.length).keys()])
        yield* this.tiai(critA, {i}, row);
    },
    * tiai(critA, critB, row) {
      if (canBe(row[critB.i], critA)) {
        let newRow = JSON.parse(JSON.stringify(row));
        newRow[critB.i] = Object.assign({}, row[critB.i], critA);
        yield newRow;
      }
    },
    * b(critA, critB, row) {
      for (let i of [...Array(row.length - 1).keys()]) {
        if (canBe(row[i], critA) && canBe(row[i + 1], critB)) {
          let newRow = JSON.parse(JSON.stringify(row));
          newRow[i] = Object.assign({}, row[i], critA);
          newRow[i + 1] = Object.assign({}, row[i + 1], critB);
          yield newRow;
        }
      }
    },
    * a(critA, critB, row) {
      for (let i of [...Array(row.length - 1).keys()].map(k => k + 1)) {
        if (canBe(row[i], critA) && canBe(row[i - 1], critB)) {
          let newRow = JSON.parse(JSON.stringify(row));
          newRow[i] = Object.assign({}, row[i], critA);
          newRow[i - 1] = Object.assign({}, row[i - 1], critB);
          yield newRow;
        }
      }
    },
    * nt(critA, critB, row) {
      yield* this.a(critA, critB, row);
      yield* this.b(critA, critB, row);
    },
  };

  let findDupes = (row) => {
    let dupes = false;
    let checks = {};
    row.reduce(function(acc, x) {
      for (var key in x) {
        if (!checks[key]) {
          checks[key] = [];
        }
        if (checks[key].indexOf(x[key]) > -1) {
          dupes = true;
        }
        checks[key].push(x[key]);
        acc[key] = x[key];
      }
      return acc;
    }, {});
    return dupes;
  };

  function* findSolution(remainingConstraints, row) {
    remainingConstraints = remainingConstraints.map(c => {
      return typeof c === 'function' ? c : (s) => clueCheck[c.type](c.d[0], c.d[1], s)
    });
    if (remainingConstraints.length === 0) {
      if (findDupes(row)) {
        yield false;
        return;
      }
      yield row;
    } else {
      let [head, ...tail] = remainingConstraints
      for (let newRow of head(row))
        yield* findSolution(tail, newRow);
    }
  }

  let findSolutions = (consts) => {
    let solutions = [];
    for (let rowSolution of findSolution(consts, row)) {
      solutions.push(rowSolution);
    }

    return solutions.filter(a => a);
  };

  let addConstraint = (type = null, depth, callback) => {
    if (depth > 100) {
      return callback(false);
    }

    let data;
    let constraint = {};
    let constraint2 = {};
    let newConstraint;

    let pickConstraint = (not = '', size = 1) => {
      let key = sample(cNms.filter(a => a !== not));
      let obj = {};
      obj.key = key;
      let category = cats[cNms.indexOf(key)];
      return {
        key,
        d: size === 1 ? sample(category) : sampleSize(size, category)
      };
    };

    // balance types of clues by adding more of that #
    switch (type || sample([0, 0, 0, 1, 2, 2, 3, 3, 4, 4])) {
      case 0:
        data = pickConstraint();
        constraint[data.key] = data.d;
        data = pickConstraint(data.key);
        constraint[data.key] = data.d;
        newConstraint = {
          type: opt.clueTypes[0],
          d: [constraint, {d: []}],
        }
        break;
      case 1:
        data = pickConstraint();
        constraint[data.key] = data.d;
        constraint2 = {
          i: ~~(M[ra]() * row.length)
        };
        newConstraint = {
          type: opt.clueTypes[1],
          d: [constraint, constraint2],
        };
        break;
      case 2:
        data = pickConstraint('', 2);
        constraint[data.key] = data.d[0];
        constraint2[data.key] = data.d[1];
        newConstraint = {
          type: opt.clueTypes[2],
          d: [constraint, constraint2],
        };
        break;
      case 3:
        data = pickConstraint('', 2);
        constraint[data.key] = data.d[0];
        constraint2[data.key] = data.d[1];
        newConstraint = {
          type: opt.clueTypes[3],
          d: [constraint2, constraint],
        };
        break;
      case 4:
        data = pickConstraint();
        constraint[data.key] = data.d;
        data = pickConstraint(data.key);
        constraint2[data.key] = data.d;
        newConstraint = {
          type: opt.clueTypes[4],
          d: [constraint, constraint2],
        }
        break;
    }

    if (attemptedConstraints.some(a => checkToString(a) === checkToString(newConstraint.d))) {
      raf(() => addConstraint(type, ++depth, callback));
      return;
    }
    attemptedConstraints.push(newConstraint.d);
    callback(newConstraint);
  };

  // let firstFill = (solution) => {
  //   if (everyObject) return;
  //   everyObject = true;
  //   firstOffering = prevSolution;
  //   stepTest.push({
  //     solution,
  //     selections: prevSolution
  //   });
  //   steps.push(currentStep.slice(0));
  //   currentStep = [];
  // };

  // let firstSolution = (solution) => {
  //   if (firstBoard) return;
  //   firstBoard = true;
  //   stepTest.push({
  //     solution,
  //     selections: prevSolution
  //   });
  //   steps.push(currentStep.slice(0));
  //   currentStep = [];
  // };

  let ext = sNum < 2;

  let aac = (type = null, depth = 0, print = false) => {
    let constraint = addConstraint(type, depth, (constraint) => {
      if (!constraint) {
        if (print) {
          let note = ce('div');
          note[cl].add('clue');
          note[ih] = `<h3>${opt[opt.lang].noMore}</h3>`;
          wbc[ac](note);
        }
        return;
      }

      constraints.push(constraint);
      let solution = findSolutions(constraints);

      // constraint breaks the game, pop it off
      if (solution == false || !solution[0]) {
        constraints.pop();
        aac(null, ++depth, print);
        return;
      }

      let currentLength = solution[0].reduce((a, b) => {
        return a + Object.keys(b).length
      }, 0);

      currentStep.push(constraint);
      if ((solution.reduce((a, b) => a.concat(b), []).some(obj => [Object, Array].includes((obj || {}).constructor) &&
            !Object.entries((obj || {})).length) ||
          currentLength === prevSolution) && prevSolution < maxFill) {
        // empty objects, or fewer than all selections indicated
        if (constraints.length > row.length * 8) {
          reset();
          aac();
          return;
        }
        raf(() => aac(null, 0, print));
        return;
      }
      prevSolution = currentLength;

      if (!everyObject) {
        // chapter one make sure every object has at least one key
        everyObject = true;
        firstOffering = prevSolution;
        raf(() => aac(null, 0, print));
        return;
      } else if (everyObject && prevSolution < maxFill) {
        // chapter 2 make sure clues indicate one possible arrangement
        if (prevSolution > M.min(firstOffering + sNum, firstOffering + catNum)) {
          firstBoard = true;
        }
        raf(() => aac(null, 0, print));
        return;
      } else {
        // chapter 3 make sure all selections are indicated by clues
        let rev = findSolutions(constraints.map(c => {
          if (c.type === 'nt') {
              c.d = c.d.reverse();
          }
          return c;
        }).reverse())[0];

        if (!rev || !iareEquals(solution[0], rev)) {
          raf(() => {
            aac(1, 0, print);
          });
          return;
        }

        if (!ext) {
          ext = true;
          raf(() => aac(null, 0, print));
          return;
        }
        stepTest.push({
          solution,
          selections: prevSolution
        });
        if (!solutionFound) {
          steps.push(currentStep.slice(0));
          solutionFound = true;
        } else {
          // Extra Clue
          showClueArr([constraint]);
          extraClueButton();
          return;
        }

        //create chunked Steps
        let chunkedSteps = steps.map(arr => chunk(arr));
        chunkedSteps[fe]((step, act) => {
          step[fe]((level, scene) => {
            levels.push({
              cb:  stepTest[act].solution,
              rwc: level,
            });
          });
        });

        // reduce to one level
        if (constraints.length <= 3) {
          levels[levels.length - 1].rwc = levels.map(l => l.rwc).reduce((o, n) => o.concat(n));
          levels = levels.slice(levels.length - 1)
        }

        resolve({
          sNum,
          catNum,
          levels,
          extraClue: () => {
            aac(null, 0, true);
          },
          clues: constraints,
          cats,
          cNms,
          sN,
          attempts: 0,
        });

        games = games.sort((a, b) => a.clues.length - b.clues.length);
      }
    });
  }

  aac(1);
});
};
