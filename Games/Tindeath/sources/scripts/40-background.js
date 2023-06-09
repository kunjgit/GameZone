function createBackground() {
  let content = "";
  // Draw clouds
  [
    { t: 130, l: 30 },
    { t: 108, l: 36 },
    { t: 164, l: 41 },
    { t: 116, l: 59 },
    { t: 92, l: 53 },
    { t: 132, l: 57 },
  ].forEach((cloudPosition, index) => {
    content += createSvg(
      122,
      78,
      [
        {
          d: "M107 48.4h-.5v-4.5c0-8-6.5-14.4-14.4-14.4-3 0-5.9.9-8.2 2.5.5-1.9.7-3.9.7-6C84.6 12 73.2.6 59.2.6S33.8 12 33.8 26c0 .7 0 1.3.1 2-2.7-1-5.5-1.5-8.5-1.5C11.4 26.5 0 37.8 0 51.9c0 14 11.4 25.4 25.4 25.4H107c8 0 14.4-6.5 14.4-14.4 0-8.1-6.5-14.5-14.4-14.5z",
        },
      ],
      {
        style: `top: ${cloudPosition.t}px; left: ${
          cloudPosition.l
        }%; animation-delay: -${index * 4}s; animation-duration: ${
          (index % 3) * 2 + 6
        }s;`,
      }
    );
  });
  // // Draw stars
  // [
  //   { t: 170, l: 33 },
  //   { t: 138, l: 39 },
  //   { t: 194, l: 44 },
  // ].forEach(() => {
  //   content += createSvg(
  //     26,
  //     31,
  //     [
  //       {
  //         d: "m14.926.458 2.563 8.722 8.473 3.296-7.503 5.132-.517 9.076-7.2-5.549-8.791 2.314 3.053-8.563L.087 7.24l9.087.257L14.926.458Z",
  //       },
  //     ],
  //     { style: "fill: #fd5;" }
  //   );
  // });
  $("clouds").innerHTML = content;
}
