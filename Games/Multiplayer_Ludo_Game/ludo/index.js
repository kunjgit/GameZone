import { Ludo as Ludo2P } from './Ludo2P.js';
import { Ludo as Ludo3P } from './Ludo3P.js';
import { Ludo as Ludo4P } from './Ludo4P.js';

const numberPlayer = (JSON.parse(localStorage.getItem('config'))).numberPlayer;

const ludo = numberPlayer === 1 || numberPlayer === 2 ? new Ludo2P() : numberPlayer === 3 ? new Ludo3P() : new Ludo4P();