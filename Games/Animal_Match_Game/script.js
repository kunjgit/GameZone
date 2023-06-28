// 定义一个常量animals:key是头像，value是全身像
const animals = {
    '🐭': '🐁',
    '🐶': '🐕',
    '🐷': '🐖',
    '🐮': '🐄',
    '🐯': '🐅',
    '🐔': '🐓',
    '🐵': '🐒',
    '🐲': '🐉',
    '🐴': '🐎',
    '🐰': '🐇',
}
// 定义一个常量，存储dom元素引用的数据对象dom
const dom = {
  wholeBody: document.querySelector(".whole-body"),
  bingo: document.querySelector(".bingo"),
  again: document.querySelector(".again"),
  faces: Array.from(document.querySelectorAll(".face")),
  slider: document.querySelector(".slider")
};

const animation = {
  frameOut: () => {
    return new Promise(resolve => {
      // dom.bingo.style.visibility = 'hidden'
      // when frame out animation
      new TimelineMax()
        .to(dom.bingo, 0, { visibility: "hidden" })
        .to(dom.slider, 1, { scale: 0 }, "t1")
        .staggerTo(dom.faces, 1, { scale: 0 }, "t1")
        .to(dom.wholeBody, 1, { scale: 0 }, "t1")
        .timeScale(5)
        .eventCallback("onComplete", resolve);
    });
  },
  frameIn: () => {
    return new Promise(resolve => {
      // 开局时滑块默认选中在最左侧 而不是上一局的位置
      // dom.slider.style.left = '0px'
      new TimelineMax()
        .to(dom.slider, 0, { left: "0px" })
        .to(dom.wholeBody, 1, { scale: 1, delay: 1 })
        .staggerTo(dom.faces, 1, { scale: 1 }, 0.25)
        .to(dom.slider, 1, { scale: 1 })
        .timeScale(5)
        .eventCallback("onComplete", resolve);
    });
  },
  moveSlider: position => {
    return new Promise(resolve => {
      // dom.slider.style.left = (25 + 60) * position + 'px'
      // move and select animation
      new TimelineMax()
        .to(dom.slider, 1, { scale: 0.3 })
        .to(dom.slider, 1, { left: (25 + 60) * position + "px" })
        .to(dom.slider, 1, { scale: 1 })
        .timeScale(5)
        .eventCallback("onComplete", resolve);
    });
  },
  showBingo: () => {
    return new Promise(resolve => {
      // dom.bingo.style.visibility = 'visible'
      // bingo animation
      new TimelineMax()
        .to(dom.bingo, 0, { visibility: "visible" })
        .to(dom.bingo, 1, { rotation: -5 })
        .to(dom.bingo, 1, { rotation: 5 })
        .to(dom.bingo, 1, { rotation: 0 })
        .timeScale(8)
        .eventCallback("onComplete", resolve);
    });
  }
};

let options = [];
let answer = [];
let canSelect = false;

async function newGame() {
  await animation.frameOut();
  shuffle();
  await animation.frameIn();
  canSelect = true;
}

// shuffle()函数随机的从animals数组中选出5个动物放在dom.faces中 再从其中选出一个的全身像放在dom.wholeBody中
function shuffle() {
  options = _.slice(_.shuffle(_.entries(animals)), -5);
  answer = _.sample(_.slice(options, -4));

  dom.faces.forEach((face, i) => {
    face.innerText = options[i][0];
  });
  dom.wholeBody.innerText = answer[1];
}

async function select(e) {
  if (!canSelect) return;

  let position = _.findIndex(options, x => x[0] == e.target.innerText);
  await animation.moveSlider(position);

  if (animals[e.target.innerText] == answer[1]) {
    // 选择正确出现提示语后 其他头像不可再点击
    canSelect = false;
    await animation.showBingo();
  }
}

function init() {
  dom.faces.forEach(face => {
    face.addEventListener("click", select);
  });
  dom.again.addEventListener("click", newGame);
  newGame();
}
window.onload = init;
