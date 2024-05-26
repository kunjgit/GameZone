const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const state = {};
const SOURCE_FILE = '../assets/rigFull.svg';
const OUTPUT_FILE = `../docs/svg.js`;

function pack(){
  console.log(`packing ${new Date().toLocaleTimeString('en-US')}...`)
  puppeteer
    .launch()
    .then(browser => {
      state.browser = browser;
      return browser.newPage();
    })
    .then(page => {
      state.page = page;
      return page;
    })
    .then(page => page.goto('file://' + path.resolve(__dirname, SOURCE_FILE)))
    .then(response => {
      return state.page.evaluate(()=>{
        const attributes = ['fill', 'opacity'];
        const data = [];
        const svg = document.querySelector('svg');

        attributes.forEach(a => {
          Array.prototype.forEach.call(document.querySelectorAll(`#rigFull>g:not([id=rigIcons]) [${a}]`), (e)=>{
            e.removeAttribute(a);
          });
        });

        parseChildren(svg, data);

        function parseChildren(target, children){
          Array.prototype.slice.call(target.children).forEach(child =>  parseChild(child, children))
        }

        function parseChild(child, children){
          let name = child.getAttribute('id');
          let armatures = [];
          if(name.indexOf(':armatures:') !== -1){
            name = name.split(':armatures:');
            armatures = name[1].split(',');
            name = name[0];
          }
          if(name.indexOf('rig') === 0 && name.indexOf('right') !== 0){
            name = name.replace('rig', '');
            name = name.split(/(?=[A-Z])/).join('-').toLowerCase();
            const c = {
              name,
              type: 'rig',
              armatures,
              children: []
            };
            children.push(c);
            parseChildren(child, c.children);
          }else{
            name = name.split(/(?=[A-Z])/).join('-').toLowerCase();
            // child.removeAttribute('id');
            child.setAttribute('id', name);
            children.push({
              name,
              type: 'svg',
              armatures,
              svg: child.outerHTML
            });
          }
        }
        return {
          viewBox: svg.getAttribute('viewBox'),
          data
        };
      });
    })
    .then(data => {
      return fs.writeFileSync(path.resolve(__dirname, OUTPUT_FILE), `window.SVG_DATA = ${JSON.stringify(data, null, 2)};`);
    })
    .then(() => state.browser.close());
}

fs.watchFile(path.resolve(__dirname, SOURCE_FILE), (eventType, filename) => {
  if (filename) {
    pack();
  }
});

pack();
