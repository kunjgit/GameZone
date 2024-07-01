
const OFFERS = [
  {
    name: 'Launch Velocity',
    desc: 'Shove some more gunpowder into the cannon.',
    cost: 30,
    gain: 10,
    expo: 1.6,
  },
  {
    name: 'Aerodynamics',
    desc: 'Slice through the air as fast as... a chicken... through air...',
    cost: 100,
    gain: 3,
    expo: 1.8,
  },
  {
    name: 'Fuel Surplus',
    desc: 'Make more room in your fuel tank that doesn\'t really exist anyway.',
    cost: 200,
    gain: 50,
    expo: 1.5,
  },
  {
    name: 'Shock Absorber',
    desc: 'Lose less speed when you smack into the ground.',
    cost: 150,
    gain: 1,
    expo: 1.7,
  },
  {
    name: 'Lucky Not-Ducky',
    desc: 'Have an increased chance of trampolines appearing.',
    cost: 100,
    gain: 0.4,
    expo: 1.6,
  },
  {
    name: 'Rocket Science',
    desc: 'Get a better firework rocket to speed you up with less fuel.',
    cost: 150,
    gain: 0.1,
    expo: 1.7,
  },
];

const STAR_TYPES = [
  {
    range: [800, 8000],
    count: 100,
    value: 0,
    frame: 'not a star lol',
  },
  {
    range: [3, 70],
    count: 5,
    value: 1,
    frame: 0,
  },
  {
    range: [70, 150],
    count: 5,
    value: 2,
    frame: 1,
  },
  {
    range: [150, 300],
    count: 10,
    value: 3,
    frame: 2,
  },
  {
    range: [300, 600],
    count: 20,
    value: 4,
    frame: 3,
  },
  {
    range: [600, 1000],
    count: 25,
    value: 5,
    frame: 4,
  },
  {
    range: [1000, 2000],
    count: 50,
    value: 7,
    frame: 5,
  },
  {
    range: [2000, 3000],
    count: 50,
    value: 10,
    frame: 0,
  },
  {
    range: [3000, 4000],
    count: 50,
    value: 15,
    frame: 1,
  },
  {
    range: [4000, 5000],
    count: 50,
    value: 20,
    frame: 2,
  },
  {
    range: [5000, 7500],
    count: 80,
    value: 25,
    frame: 3,
  },
  {
    range: [7500, 10000],
    count: 80,
    value: 30,
    frame: 4,
  },
  {
    range: [10000, 12500],
    count: 80,
    value: 35,
    frame: 5,
  },
  {
    range: [12500, 15000],
    count: 80,
    value: 40,
    frame: 0,
  },
  
  {
    range: [15000, 20000],
    count: 160,
    value: 45,
    frame: 1,
  },
  {
    range: [20000, 25000],
    count: 160,
    value: 50,
    frame: 2,
  },
  
  {
    range: [25000, 30000],
    count: 160,
    value: 55,
    frame: 3,
  },
  {
    range: [30000, 35000],
    count: 160,
    value: 60,
    frame: 4,
  },
  {
    range: [35000, 40000],
    count: 160,
    value: 65,
    frame: 5,
  },
  {
    range: [40000, 50000],
    count: 330,
    value: 70,
    frame: 0,
  },
  {
    range: [50000, 60000],
    count: 330,
    value: 75,
    frame: 1,
  },
  {
    range: [60000, 70000],
    count: 330,
    value: 80,
    frame: 2,
  },
  {
    range: [70000, 80000],
    count: 330,
    value: 85,
    frame: 3,
  },
  {
    range: [80000, 90000],
    count: 330,
    value: 90,
    frame: 4,
  },
  {
    range: [90000, 100000],
    count: 330,
    value: 95,
    frame: 5,
  },

  // SPACE (100k)

  {
    range: [100000, 150000],
    count: 1650,
    value: 100,
    frame: 6,
  },
  {
    range: [150000, 200000],
    count: 1650,
    value: 110,
    frame: 7,
  },
  {
    range: [200000, 250000],
    count: 1650,
    value: 120,
    frame: 8,
  },
  {
    range: [250000, 300000],
    count: 1650,
    value: 130,
    frame: 9,
  },

  // FANCY SPACE
  
  {
    range: [300000, 400000],
    count: 1650,
    value: 150,
    frame: 6,
  },
  {
    range: [300000, 400000],
    count: 1650,
    value: 300,
    frame: 10,
  },

  {
    range: [400000, 600000],
    count: 3300,
    value: 200,
    frame: 7,
  },
  {
    range: [400000, 600000],
    count: 3300,
    value: 450,
    frame: 11,
  },

  {
    range: [600000, 1000000],
    count: 6600,
    value: 300,
    frame: 8,
  },
  {
    range: [600000, 1000000],
    count: 6600,
    value: 700,
    frame: 12,
  },

  {
    range: [1000000, 2000000],
    count: 13000,
    value: 500,
    frame: 9,
  },
  {
    range: [1000000, 2000000],
    count: 13000,
    value: 1200,
    frame: 13,
  },
];
