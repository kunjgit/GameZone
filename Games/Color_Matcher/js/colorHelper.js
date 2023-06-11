
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); 


    [array[i], array[j]] = [array[j], array[i]];
  }
}


export const getRandomColorPairs = (count) => {
  const hueList = ['red', 'yellow', 'green', 'blue', 'pink', 'monochrome', 'goldenrod', 'purple']
  const colorList = [];

  for (let i = 0; i < count; i++) {
    const color = randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    });

    colorList.push(color);
  }


  const fullColorList = [...colorList, ...colorList];

 
  shuffle(fullColorList);

  return fullColorList;
}