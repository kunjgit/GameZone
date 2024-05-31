let showChoose = () => {
  clear();
  timeouts[fe](t => clearTimeout(t));
  cont[cl].remove('end');
  root.style.display = 'flex';
  say(opt[opt.lang].ff);
  fi('nc', opt[opt.lang].newCase);
  fi('cf', opt[opt.lang].ff);
  fi('ch', `${opt[opt.lang].ch} ${opt[opt.lang].newCase}`);
  fi('peplabel', opt[opt.lang].p);
  fi('catlabel', opt[opt.lang].c);
  fi('create', `${opt[opt.lang].cr} ${opt[opt.lang].newCase}`);
  fi('com', opt[opt.lang].com);
  fi('com2', opt[opt.lang].com);
  fi('com3', opt[opt.lang].newCase);
}

// serialize
let ser = g => {
  delete g.sNum;
  delete g.catNum;
  delete g.attempts;
  let ss = JSON.stringify(g)
  g.cNms[fe]((n, i) => ss = ss.replace(new RegExp(n, 'g'), `b${i}b`));
  ss = JSON.parse(ss)
  ss.cNms = g.cNms;
  return JSON.stringify(ss)
}

// deserialize
let deser = g => {
  let ss = JSON.parse(g);
  ss.cNms[fe]((n, i) => g = g.replace(new RegExp(`b${i}b`, 'g'), n));
  g = JSON.parse(g);
  g.sN = g.sN || g.slotNames;
  g.sNum = g.sN.length;
  g.catNum = g.cNms.length;
  g.attempts = 0;

  return g;
}

// configure minimal network settings and key storage
let config = {
  nodeUrl: "https://rpc.testnet.near.org",
  deps: {
    keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
  },
  networkId: 'testnet',
};

let subGame;

// open a connection to the NEAR platform
(async function () {
  let { connect, keyStores, WalletConnection } = nearApi;

  let config = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };

  // connect to NEAR
  window.near = await connect(config);
  // create wallet connection
  let wallet = new WalletConnection(near);
  let account = await wallet.account();

  let link = d[ge]('near');

  if(wallet.isSignedIn()) {
    link[ih] = 'You\'re signed into NEAR.';
  }

  link.onclick = () => {
    var r = confirm("Going to NEAR to log in.");
    if (r == true) {
      wallet.requestSignIn(
        "dev-1629217600951-74234604044359", // contract requesting access
      );
    }
  }

  let contract = new nearApi.Contract(
    account, // the account object that is connecting
    "dev-1629217600951-74234604044359",
    {
      // name of contract you're connecting to
      viewMethods: ["getMessages"], // view methods do not change state but usually return a value
      changeMethods: ["addMessage"], // change methods modify state
      sender: account, // account object to initialize and sign transactions.
    }
  );

  messages = await contract.getMessages();

  subGame = () => {
    if(wallet.isSignedIn()) {
      clear();
      wbc[ac](nnote());
      root.style.display = 'none';
      addGame(4,4).then(g => {
        sng(g);
        contract.addMessage({ text: ser(g), gas: 100000000000000});
      });
    } else {
      var r = confirm("Going to NEAR to log in.");
      if (r == true) {
        wallet.requestSignIn(
          "dev-1629217600951-74234604044359", // contract requesting access
        );
      }
    }
  }

  let list = d[ge]('com-list');
  sampleSize(20, messages.filter(m => m.text[0] === '{'))[fe](m => {
    let gg = ce('div');
    gg[ih] = `<div class="sub-game"><span>Play</span> - ${m.sender}: <span>👍</span></div>`;
    gg.onclick = () => { clear(); root.style.display = 'none'; sng(deser(m.text)); }
    list[ac](gg);
  });
})(window);
