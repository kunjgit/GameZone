var LevelMenuItem = (function () {
  return {
    create: function (data) {
      var btn       = el('button'),
          userTime  = retreive('lvl' + data.id + 'time') || '0.00',
          userCombo = retreive('lvl' + data.id + 'combo') || '0',
          content;

      content = new Template('level-menu-item');
      content.querySelector('.level-title').innerText = data.name;
      content.querySelector('.level-time').innerText = userTime;
      content.querySelector('.level-combo').innerText = userCombo;
      data.userCombo = userCombo;
      btn.appendChild(content);
      btn.style.backgroundImage = linearGradient(data.topColor,data.botColor);

      return btn;
    }
  };
})();