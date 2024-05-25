const elementsData = {
    H: { name: "Hydrogen", AtomicNumber: "1", Symbol: "H", AtomicMass: "1.008" },
    He: { name: "Helium", AtomicNumber: "2", Symbol: "He", AtomicMass: "4.0026" },
    Li: { name: "Lithium", AtomicNumber: "3", Symbol: "Li", AtomicMass: "6.94" },
    Be: { name: "Beryllium", AtomicNumber: "4", Symbol: "Be", AtomicMass: "9.0122" },
    B: { name: "Boron", AtomicNumber: "5", Symbol: "B", AtomicMass: "10.81" },
    C: { name: "Carbon", AtomicNumber: "6", Symbol: "C", AtomicMass: "12.011" },
    N: { name: "Nitrogen", AtomicNumber: "7", Symbol: "N", AtomicMass: "14.007" },
    O: { name: "Oxygen", AtomicNumber: "8", Symbol: "O", AtomicMass: "15.999" },
    F: { name: "Fluorine", AtomicNumber: "9", Symbol: "F", AtomicMass: "18.998" },
    Ne: { name: "Neon", AtomicNumber: "10", Symbol: "Ne", AtomicMass: "20.180" },
    Na: { name: "Sodium", AtomicNumber: "11", Symbol: "Na", AtomicMass: "22.990" },
    Mg: { name: "Magnesium", AtomicNumber: "12", Symbol: "Mg", AtomicMass: "24.305" },
    Al: { name: "Aluminum", AtomicNumber: "13", Symbol: "Al", AtomicMass: "26.982" },
    Si: { name: "Silicon", AtomicNumber: "14", Symbol: "Si", AtomicMass: "28.085" },
    P: { name: "Phosphorus", AtomicNumber: "15", Symbol: "P", AtomicMass: "30.974" },
    S: { name: "Sulfur", AtomicNumber: "16", Symbol: "S", AtomicMass: "32.06" },
    Cl: { name: "Chlorine", AtomicNumber: "17", Symbol: "Cl", AtomicMass: "35.45" },
    Ar: { name: "Argon", AtomicNumber: "18", Symbol: "Ar", AtomicMass: "39.948" },
    K: { name: "Potassium", AtomicNumber: "19", Symbol: "K", AtomicMass: "39.098" },
    Ca: { name: "Calcium", AtomicNumber: "20", Symbol: "Ca", AtomicMass: "40.078" },
    Sc: { name: "Scandium", AtomicNumber: "21", Symbol: "Sc", AtomicMass: "44.956" },
    Ti: { name: "Titanium", AtomicNumber: "22", Symbol: "Ti", AtomicMass: "47.867" },
    V: { name: "Vanadium", AtomicNumber: "23", Symbol: "V", AtomicMass: "50.942" },
    Cr: { name: "Chromium", AtomicNumber: "24", Symbol: "Cr", AtomicMass: "51.996" },
    Mn: { name: "Manganese", AtomicNumber: "25", Symbol: "Mn", AtomicMass: "54.938" },
    Fe: { name: "Iron", AtomicNumber: "26", Symbol: "Fe", AtomicMass: "55.845" },
    Co: { name: "Cobalt", AtomicNumber: "27", Symbol: "Co", AtomicMass: "58.933" },
    Ni: { name: "Nickel", AtomicNumber: "28", Symbol: "Ni", AtomicMass: "58.693" },
    Cu: { name: "Copper", AtomicNumber: "29", Symbol: "Cu", AtomicMass: "63.546" },
    Zn: { name: "Zinc", AtomicNumber: "30", Symbol: "Zn", AtomicMass: "65.38" },
    Ga: { name: "Gallium", AtomicNumber: "31", Symbol: "Ga", AtomicMass: "69.723" },
    Ge: { name: "Germanium", AtomicNumber: "32", Symbol: "Ge", AtomicMass: "72.630" },
    As: { name: "Arsenic", AtomicNumber: "33", Symbol: "As", AtomicMass: "74.922" },
    Se: { name: "Selenium", AtomicNumber: "34", Symbol: "Se", AtomicMass: "78.971" },
    Br: { name: "Bromine", AtomicNumber: "35", Symbol: "Br", AtomicMass: "79.904" },
    Kr: { name: "Krypton", AtomicNumber: "36", Symbol: "Kr", AtomicMass: "83.798" },
    Rb: { name: "Rubidium", AtomicNumber: "37", Symbol: "Rb", AtomicMass: "85.468" },
    Sr: { name: "Strontium", AtomicNumber: "38", Symbol: "Sr", AtomicMass: "87.62" },
    Y: { name: "Yttrium", AtomicNumber: "39", Symbol: "Y", AtomicMass: "88.906" },
    Zr: { name: "Zirconium", AtomicNumber: "40", Symbol: "Zr", AtomicMass: "91.224" },
    Nb: { name: "Niobium", AtomicNumber: "41", Symbol: "Nb", AtomicMass: "92.906" },
    Mo: { name: "Molybdenum", AtomicNumber: "42", Symbol: "Mo", AtomicMass: "95.95" },
    Tc: { name: "Technetium", AtomicNumber: "43", Symbol: "Tc", AtomicMass: "98" },
    Ru: { name: "Ruthenium", AtomicNumber: "44", Symbol: "Ru", AtomicMass: "101.07" },
    Rh: { name: "Rhodium", AtomicNumber: "45", Symbol: "Rh", AtomicMass: "102.91" },
    Pd: { name: "Palladium", AtomicNumber: "46", Symbol: "Pd", AtomicMass: "106.42" },
    Ag: { name: "Silver", AtomicNumber: "47", Symbol: "Ag", AtomicMass: "107.87" },
    Cd: { name: "Cadmium", AtomicNumber: "48", Symbol: "Cd", AtomicMass: "112.41" },
    In: { name: "Indium", AtomicNumber: "49", Symbol: "In", AtomicMass: "114.82" },
    Sn: { name: "Tin", AtomicNumber: "50", Symbol: "Sn", AtomicMass: "118.71" },
    Sb: { name: "Antimony", AtomicNumber: "51", Symbol: "Sb", AtomicMass: "121.76" },
    Te: { name: "Tellurium", AtomicNumber: "52", Symbol: "Te", AtomicMass: "127.60" },
    I: { name: "Iodine", AtomicNumber: "53", Symbol: "I", AtomicMass: "126.90" },
    Xe: { name: "Xenon", AtomicNumber: "54", Symbol: "Xe", AtomicMass: "131.29" },
    Cs: { name: "Cesium", AtomicNumber: "55", Symbol: "Cs", AtomicMass: "132.91" },
    Ba: { name: "Barium", AtomicNumber: "56", Symbol: "Ba", AtomicMass: "137.33" },
    La: { name: "Lanthanum", AtomicNumber: "57", Symbol: "La", AtomicMass: "138.91" },
    Ce: { name: "Cerium", AtomicNumber: "58", Symbol: "Ce", AtomicMass: "140.12" },
    Pr: { name: "Praseodymium", AtomicNumber: "59", Symbol: "Pr", AtomicMass: "140.91" },
    Nd: { name: "Neodymium", AtomicNumber: "60", Symbol: "Nd", AtomicMass: "144.24" },
    Pm: { name: "Promethium", AtomicNumber: "61", Symbol: "Pm", AtomicMass: "145" },
    Sm: { name: "Samarium", AtomicNumber: "62", Symbol: "Sm", AtomicMass: "150.36" },
    Eu: { name: "Europium", AtomicNumber: "63", Symbol: "Eu", AtomicMass: "151.96" },
    Gd: { name: "Gadolinium", AtomicNumber: "64", Symbol: "Gd", AtomicMass: "157.25" },
    Tb: { name: "Terbium", AtomicNumber: "65", Symbol: "Tb", AtomicMass: "158.93" },
    Dy: { name: "Dysprosium", AtomicNumber: "66", Symbol: "Dy", AtomicMass: "162.50" },
    Ho: { name: "Holmium", AtomicNumber: "67", Symbol: "Ho", AtomicMass: "164.93" },
    Er: { name: "Erbium", AtomicNumber: "68", Symbol: "Er", AtomicMass: "167.26" },
    Tm: { name: "Thulium", AtomicNumber: "69", Symbol: "Tm", AtomicMass: "168.93" },
    Yb: { name: "Ytterbium", AtomicNumber: "70", Symbol: "Yb", AtomicMass: "173.05" },
    Lu: { name: "Lutetium", AtomicNumber: "71", Symbol: "Lu", AtomicMass: "174.97" },
    Hf: { name: "Hafnium", AtomicNumber: "72", Symbol: "Hf", AtomicMass: "178.49" },
    Ta: { name: "Tantalum", AtomicNumber: "73", Symbol: "Ta", AtomicMass: "180.95" },
    W: { name: "Tungsten", AtomicNumber: "74", Symbol: "W", AtomicMass: "183.84" },
    Re: { name: "Rhenium", AtomicNumber: "75", Symbol: "Re", AtomicMass: "186.21" },
    Os: { name: "Osmium", AtomicNumber: "76", Symbol: "Os", AtomicMass: "190.23" },
    Ir: { name: "Iridium", AtomicNumber: "77", Symbol: "Ir", AtomicMass: "192.22" },
    Pt: { name: "Platinum", AtomicNumber: "78", Symbol: "Pt", AtomicMass: "195.08" },
    Au: { name: "Gold", AtomicNumber: "79", Symbol: "Au", AtomicMass: "196.97" },
    Hg: { name: "Mercury", AtomicNumber: "80", Symbol: "Hg", AtomicMass: "200.59" },
    Tl: { name: "Thallium", AtomicNumber: "81", Symbol: "Tl", AtomicMass: "204.38" },
    Pb: { name: "Lead", AtomicNumber: "82", Symbol: "Pb", AtomicMass: "207.2" },
    Bi: { name: "Bismuth", AtomicNumber: "83", Symbol: "Bi", AtomicMass: "208.98" },
    Po: { name: "Polonium", AtomicNumber: "84", Symbol: "Po", AtomicMass: "209" },
    At: { name: "Astatine", AtomicNumber: "85", Symbol: "At", AtomicMass: "210" },
    Rn: { name: "Radon", AtomicNumber: "86", Symbol: "Rn", AtomicMass: "222" },
    Fr: { name: "Francium", AtomicNumber: "87", Symbol: "Fr", AtomicMass: "223" },
    Ra: { name: "Radium", AtomicNumber: "88", Symbol: "Ra", AtomicMass: "226" },
    Ac: { name: "Actinium", AtomicNumber: "89", Symbol: "Ac", AtomicMass: "227" },
    Th: { name: "Thorium", AtomicNumber: "90", Symbol: "Th", AtomicMass: "232.04" },
    Pa: { name: "Protactinium", AtomicNumber: "91", Symbol: "Pa", AtomicMass: "231.04" },
    U: { name: "Uranium", AtomicNumber: "92", Symbol: "U", AtomicMass: "238.03" },
    Np: { name: "Neptunium", AtomicNumber: "93", Symbol: "Np", AtomicMass: "237" },
    Pu: { name: "Plutonium", AtomicNumber: "94", Symbol: "Pu", AtomicMass: "244" },
    Am: { name: "Americium", AtomicNumber: "95", Symbol: "Am", AtomicMass: "243" },
    Cm: { name: "Curium", AtomicNumber: "96", Symbol: "Cm", AtomicMass: "247" },
    Bk: { name: "Berkelium", AtomicNumber: "97", Symbol: "Bk", AtomicMass: "247" },
    Cf: { name: "Californium", AtomicNumber: "98", Symbol: "Cf", AtomicMass: "251" },
    Es: { name: "Einsteinium", AtomicNumber: "99", Symbol: "Es", AtomicMass: "252" },
    Fm: { name: "Fermium", AtomicNumber: "100", Symbol: "Fm", AtomicMass: "257" },
    Md: { name: "Mendelevium", AtomicNumber: "101", Symbol: "Md", AtomicMass: "258" },
    No: { name: "Nobelium", AtomicNumber: "102", Symbol: "No", AtomicMass: "259" },
    Lr: { name: "Lawrencium", AtomicNumber: "103", Symbol: "Lr", AtomicMass: "266" },
    Rf: { name: "Rutherfordium", AtomicNumber: "104", Symbol: "Rf", AtomicMass: "267" },
    Db: { name: "Dubnium", AtomicNumber: "105", Symbol: "Db", AtomicMass: "270" },
    Sg: { name: "Seaborgium", AtomicNumber: "106", Symbol: "Sg", AtomicMass: "271" },
    Bh: { name: "Bohrium", AtomicNumber: "107", Symbol: "Bh", AtomicMass: "270" },
    Hs: { name: "Hassium", AtomicNumber: "108", Symbol: "Hs", AtomicMass: "277" },
    Mt: { name: "Meitnerium", AtomicNumber: "109", Symbol: "Mt", AtomicMass: "276" },
    Ds: { name: "Darmstadtium", AtomicNumber: "110", Symbol: "Ds", AtomicMass: "281" },
    Rg: { name: "Roentgenium", AtomicNumber: "111", Symbol: "Rg", AtomicMass: "280" },
    Cn: { name: "Copernicium", AtomicNumber: "112", Symbol: "Cn", AtomicMass: "285" },
    Nh: { name: "Nihonium", AtomicNumber: "113", Symbol: "Nh", AtomicMass: "284" },
    Fl: { name: "Flerovium", AtomicNumber: "114", Symbol: "Fl", AtomicMass: "289" },
    Mc: { name: "Moscovium", AtomicNumber: "115", Symbol: "Mc", AtomicMass: "288" },
    Lv: { name: "Livermorium", AtomicNumber: "116", Symbol: "Lv", AtomicMass: "293" },
    Ts: { name: "Tennessine", AtomicNumber: "117", Symbol: "Ts", AtomicMass: "294" },
    Og: { name: "Oganesson", AtomicNumber: "118", Symbol: "Og", AtomicMass: "294" }
};

function showElementCard(element) {
    const card = document.getElementById('element-card');
    const nameElem = document.getElementById('element-name');
    const detailsElem = document.getElementById('element-details');

    nameElem.textContent = elementsData[element].name;
    detailsElem.innerHTML = "Atomic Number: " + elementsData[element].AtomicNumber + "<br>" +
        "Symbol: " + elementsData[element].Symbol + "<br>" +
        "Atomic Mass: " + elementsData[element].AtomicMass;


    card.classList.remove('hidden');
}

function closeElementCard() {
    const card = document.getElementById('element-card');
    card.classList.add('hidden');
}
