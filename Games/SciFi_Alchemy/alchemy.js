var ingredients=[];
var discoveries=[];
var pantry=[];
var lastrand=-1;
var sound=true;
var moves=localStorage.getItem('sfa_moves') ? localStorage.getItem('sfa_moves') : 0;
var D={};
findResult=(id1,id2)=>{
	for (var i=0; i<recipes.length; i++){
		if ((recipes[i].i[0] == id1) && (recipes[i].i[1] == id2)) return [recipes[i].r,recipes[i].m];
		if ((recipes[i].i[0] == id2) && (recipes[i].i[1] == id1)) return [recipes[i].r,recipes[i].m];
	}
	return [];
};

makeCanvas=i=>{
	var cnew = document.getElementById('ctmp').cloneNode(true);
	cnew.setAttribute('id','c' + i);
	document.body.appendChild(cnew);
	return cnew;
};

drawEmoji=(i, emoji, x, y, size)=>{
	var cnew = document.getElementById('c'+i);
	if (cnew == null) cnew = makeCanvas(i);
	ctxnew = cnew.getContext('2d');
	ctxnew.font = size + 'px sans-serif';
	ctxnew.textAlign = 'left';
	ctxnew.fillText(emoji, x, y);
};
prepSlots=()=>{
	for (var e=0; e<elements.length; e++) {
		var slot = document.createElement('div');
		slot.id = 'pantrySlot' + e;
		slot.className = 'pantrySlot copy';
		document.getElementById('pantry').appendChild(slot);
		if (elements[e][4]) {
			var slot = document.createElement('div');
			slot.id = 'trophySlot' + e;
			slot.className = 'pantrySlot trophy';
			if(movies.includes(e))
				document.getElementById('collectioncontent').appendChild(slot);
			else
				document.getElementById('finalcontent').appendChild(slot);
		}
	}
};

prepElements=()=>{
	for (var e=0; e<elements.length; e++){
		var name = elements[e][0];
		var icon = elements[e][1];
		var pos = elements[e][2];
		var desc = elements[e][3];
		if (Array.isArray(icon)) {
			for (var b = 0; b < icon.length; b++) {
				if (pos[b]) {
					var x = pos[b][0];
					var y = pos[b][1];
					if (pos[b][2]) var size = pos[b][2];
					else var size = 70;
				}
				drawEmoji(e, icon[b], x, y, size);
			}
		} else if (pos=="svg") {
			svg(icon,e);
		} else drawEmoji(e, icon,0,70,70);
	}
};

prepIcons=()=>{
	for (var e=0; e<elements.length; e++){
		if (document.getElementById('c'+e)) {
			var img = document.createElement('img');
			img.src = document.getElementById('c' + e).toDataURL();
			var final = elements[e][4] == 1 ? true : false;
			img.className = 'pantryIngredient drag';
			img.id = 'i' + (ingredients.length);
			img.setAttribute('elid',e);
			ingredients[ingredients.length] = 'i' + (ingredients.length);
			var desc = document.createElement('span');
			desc.innerText = elements[e][0];
			document.getElementById('pantrySlot'+e).appendChild(img);
			document.getElementById('pantrySlot'+e).appendChild(desc);
			document.getElementById('pantrySlot'+e).style.display='none';
			if (final) {
				var img2 = img.cloneNode();
				img2.id = 'coll' + e;
				img2.className += " trophy";
				if (movies.includes(e)) img2.className +=" movie";
				document.getElementById('trophySlot' + e).appendChild(img2);
				document.getElementById('trophySlot' + e).appendChild(desc);
				document.getElementById('trophySlot' + e).style.display = 'none';
			}
		} else {
			var final = elements[e][4] == 1 ? true : false;
			if (final) {
				var pantrySlot = document.getElementById('pantrySlot'+e);
				var img = pantrySlot.children[0];
				var desc = pantrySlot.children[1].cloneNode(true);
				var img2 = img.cloneNode();
				desc.id = 'descoll' + e;
				img2.id = 'coll' + e;
				img2.className += " trophy";
				if (movies.includes(e)) img2.className +=" movie";
				document.getElementById('trophySlot' + e).appendChild(img2);
				document.getElementById('trophySlot' + e).appendChild(desc);
				document.getElementById('trophySlot' + e).style.display = 'none';
			}
		}
	}
};

finalize=()=>{
	for (var i=0; i<elements.length; i++){
		pantry[document.getElementById('i' + i).getAttribute('elid')] = i;
		if (document.getElementById('trophySlot' + i)) document.getElementById('trophySlot' + i).style.display = 'none';
		discoveries[i] = false;
	}
	for (var i=0; i<=3; i++){
		discoveries[i] = true;
	}
	if (localStorage.getItem('sfa_discoveries')) {
		discoveries = localStorage.getItem('sfa_discoveries').split(',');
	}
	for (var i=0; i<discoveries.length; i++){
		discoveries[i] = (discoveries[i] == 'false' || !discoveries[i]) ? false : true;
		if (discoveries[i]) {
			if (elements[i][4]){
				document.getElementById('trophySlot'+i).style.display='inline';
			} else {
				document.getElementById('pantrySlot' + i).style.display = 'inline';
			}
		} else {
			document.getElementById('pantrySlot'+i).style.display='none';
		}
	}
	for(var e=0;e<movies.length;e++) {
		document.getElementById('trophySlot' + movies[e]).style.display = 'inline';
		if (!discoveries[movies[e]]) document.getElementById('trophySlot' + movies[e]).style.opacity = .3;
	}
	document.getElementById('downbutton').src = makeSvg('p66600001M17,69L1,1c0,0,15,21,32,0L17,69z;i17693301000non02;pnonCCC02M1,1c0,0,15,21,32,0;i17690101CCCnon02',40,80);
	document.getElementById('upbutton').src = makeSvg('p66600001M17,0L1,68c0,0,15-21,32,0L17,0z;i33681700000non02;pnon00002M1,68c0,0,15-21,32,0;i01681700CCCnon02',40,80);
};

prepHome=()=>{
	if (localStorage.getItem('sfa_discoveries')) document.getElementById('playbutton').innerText="CONTINUE";
	var hcx = document.getElementById('homecanvas').getContext("2d");
	hcx.globalAlpha = .5;
	hcx.drawImage(document.getElementById('i3'),0,0);
	hcx.drawImage(document.getElementById('i3'),159,20);
	hcx.drawImage(document.getElementById('i3'),189,0);
	hcx.drawImage(document.getElementById('i3'),20,158);
	hcx.drawImage(document.getElementById('i3'),80,158);
	hcx.drawImage(document.getElementById('i3'),299,158);
	hcx.globalAlpha = .3;
	hcx.drawImage(document.getElementById('i3'),0,298);
	hcx.drawImage(document.getElementById('i3'),159,320);
	hcx.drawImage(document.getElementById('i3'),189,298);
	hcx.globalAlpha = .2;
	hcx.drawImage(document.getElementById('i3'),20,450);
	hcx.drawImage(document.getElementById('i3'),80,450);
	hcx.drawImage(document.getElementById('i3'),299,450);
	hcx.globalAlpha = .4;
	hcx.filter = 'blur(1px)';
	hcx.drawImage(document.getElementById('i15'),0,29);
	hcx.drawImage(document.getElementById('i33'),275,29);
	hcx.globalAlpha = .3;
	hcx.drawImage(document.getElementById('i72'),10,230);
	hcx.drawImage(document.getElementById('i30'),270,230);
	document.getElementById('home').style.backgroundImage = 'url('+document.getElementById('homecanvas').toDataURL()+')';
	close('loader');
};

store=(k,z)=>{
	localStorage.setItem(k, z);
};
scrollUp=()=>{
	document.getElementById('pantry').scrollTop -= 400;
};
scrollDown=()=>{
	document.getElementById('pantry').scrollTop += 400;
};
score=()=>{
	var pts = 0;
	for (var e=0;e<discoveries.length;e++){
		if (discoveries[e]) pts++;
	}
	document.getElementById('score').innerText = pts-4;
	document.getElementById('max').innerText = discoveries.length-4;
	if (pts == discoveries.length) {
		win();
	}
	var foundmovies = 0;
	for(var e=0;e<movies.length;e++) {
		if (discoveries[movies[e]]) foundmovies++;
	}
	document.getElementById('collectionnumbers').innerText = foundmovies + '/13';
};
win=()=>{
	document.getElementById('moves').innerText = "You found every element in " + moves + " moves.";
	openm('wincontent');
	openm('collection');
};
close=m=>{
	document.getElementById(m).style.display="none";
};
clearForge=()=>{
	var forgeElements = document.getElementById('forge').getElementsByTagName('img');
	var count = forgeElements.length;
	for (var f=0; f<count; f++) forgeElements[0].remove();
};
openm=m=>{
	document.getElementById(m).style.display="block";
};
play=()=>{
	hintInterval = setInterval(enableHint, hintTime);
	finalize();
	score();
	close('home');
	document.getElementById('soundbutton').onclick=null;
	document.getElementById('playbutton').innerText = 'CONTINUE';
	if (!listened) {
		(D = e => {
			pointercancel = e => {
				D.n.remove();
				if (D.g.m) D.g.m.remove();
				touchinprogress = false;
				bugfix();
			}
			pointerdown = e => {
				if (touchinprogress) return;
				touchinprogress = true;
				e.preventDefault();
				D.w = 1;
				D.g = null;
				D.n = null;
				if (e.touches) {
					D.g = document.elementFromPoint(
						e.touches[0].pageX,
						e.touches[0].pageY
					);
				} else {
					D.g = e.target;
				}
				D.scroll = e.target.parentElement.parentElement.scrollTop;
				if (D.g && D.g.id == 'homebutton') {
					openm('home');
				} else if (D.g && D.g.id == 'collectionbutton') {
					openm('collection');
				} else if (D.g && D.g.id == 'playbutton') {
					play();
				} else if (D.g && (D.g.id == 'newgamebutton' || D.g.id == 'newgamebutton2')) {
					newgame();
				} else if (D.g && D.g.id == 'upbutton') {
					scrollUp();
				} else if (D.g && D.g.id == 'downbutton') {
					scrollDown();
				} else if (D.g && D.g.classList.contains("outlink")) {
					go(D.g.getAttribute('href'));
				} else if (D.g && D.g.classList.contains("modal")) {
					close('modal');
				} else if (D.g && D.g.classList.contains("trophy")) {
					close('collection');
				} else if (D.g && D.g.id == 'trash') {
					clearForge();
				} else if (D.g && D.g.id == 'soundbutton') {
					toggleSound();
				} else if (D.g && D.g.id == 'hint' && hintsEnabled) {
					showHint();
				} else if (D.g && D.g.id == 'hint') {
					upsell();
				}
				while (D.g != document && !D.g.classList.contains("drag")) {
					D.g = D.g.parentNode;
				}
				if (D.g == document) {
					D.g = null;
				} else if (D.g.parentNode.classList.contains("move") || D.g.parentNode.classList.contains("copy")) {
					D.X = e.touches ? e.touches[0].pageX : e.pageX;
					D.Y = e.touches ? e.touches[0].pageY : e.pageY;
					D.x = D.X - e.target.offsetLeft;
					D.y = D.Y - e.target.offsetTop;
					D.n = document.body.appendChild(D.g.cloneNode(true));
					D.n.className = D.n.className.replace(/pantryIngredient/, 'ingredient');
					D.n.id = 'i' + ingredients.length++;
					if (D.g.parentNode.classList.contains("move")) {
						D.g.style.visibility = "hidden";
						D.g.m = D.g;
					}
					D.n.style.position = "absolute";
					D.n.style.pointerEvents = "none";
					D.n.style.left = D.X - D.x - 3 + "px";
					D.n.style.top = D.Y - D.y - 3 + "px";
				}
			}
			pointermove = e => {
				e.preventDefault();
				if (D.w && D.n) {
					D.X = (e.touches ? e.touches[0].pageX : e.pageX);
					D.Y = (e.touches ? e.touches[0].pageY : e.pageY);
					D.n.style.left = D.X - D.x - 3 + "px";
					D.n.style.top = D.Y - D.y - 3 - D.scroll + "px";
					D.lastX = (e.touches ? e.touches[0].pageX : e.pageX);
					D.lastY = (e.touches ? e.touches[0].pageY : e.pageY);
				}
			}

			pointerup = e => {
				A.resume();
				touchinprogress = false;
				e.preventDefault();
				D.w = 0;
				if (e.touches && D.X) {
					D.p = document.elementFromPoint(
						D.X,
						D.Y
					);
				} else {
					D.p = e.target;
				}
				if (D.n) {
					if (D.p.classList.contains("ingredient")) {
						moves++;
						store('sfa_moves',moves);
						var id1 = D.p.getAttribute('elid');
						var id2 = D.n.getAttribute('elid');
						var result = findResult(id1, id2);
						if (result.length > 0) {
							imgId = pantry[result[0]];
							c = document.getElementById('i' + imgId).cloneNode(true);
							c.style.left = D.lastX - D.x - 3 + "px";
							c.style.top = D.lastY - D.y - 3 - D.scroll + "px";
							c.className = 'ingredient drag';
							c.id = 'i' + (ingredients.length);
							c.style.display = 'inline';
							c.style.position = 'absolute';
							ingredients[ingredients.length] = 'i' + (ingredients.length);
							document.getElementById('forge').appendChild(c);
							D.p.remove();
							D.n.remove();
							if (D.g.m) D.g.m.remove();

							if (elements[result[0]][4] != 1) {
								var o = document.getElementById('pantrySlot' + result[0]);
								o.style.display = 'inline';
							}
							if (!discoveries[result[0]]) {
								resetHints();
								document.getElementById('discovery').innerText = elements[result[0]][0];
								document.getElementById('discoveryimage').style.display = 'inline';
								document.getElementById('discoveryimage').className = 'focusin modal';
								document.getElementById('discoveryimage').src = document.getElementById('i' + imgId).src;
								document.getElementById('discoverydesc').innerHTML = elements[result[0]][3] ? elements[result[0]][3] : '';
								openm('modal');
								discoveries[result[0]] = true;
								store('sfa_discoveries',discoveries);
								if (elements[result[0]][4]) {
									document.getElementById('trophySlot' + result[0]).style.display = 'inline';
									if (movies.includes(result[0])) {
										document.getElementById('trophySlot' + result[0]).style.opacity = 1;
									}
								}
								if (result[1] == 'n') {
									var rand = Math.floor(Math.random() * non.length)
									while (rand == lastrand) {
										rand = Math.floor(Math.random() * non.length)
									}
									playSong(non[rand]);
									lastrand = rand;
								} else if (result[1] == 'm') {
									var rand = Math.floor(Math.random() * non2.length)
									while (rand == lastrand) {
										rand = Math.floor(Math.random() * non2.length)
									}
									playSong(non2[rand]);
									lastrand = rand;
								} else playSong(result[1]);
							}
							score();
							return;
						}
					}
					while (D.p != document && !D.p.classList.contains("drop")) {
						D.p = D.p.parentNode;
					}
					if (D.p != document) {
						D.f = D.p.appendChild(D.n.cloneNode(true));
						D.f.style.position = "absolute";
						D.f.style.pointerEvents = "";
						D.X = e.pageX;
						D.Y = e.pageY;
						D.f.style.left = D.X - D.x - 3 + "px";
						D.f.style.top = D.Y - D.y - 3 + "px";
					}
					if (D.g.m) {
						D.g.remove();
					}
					D.n.remove();
				}
				bugfix();
			}
			addEventListener("touchcancel", pointercancel);
			addEventListener("mousedown", pointerdown);
			addEventListener("touchstart", pointerdown, {passive: false});
			addEventListener("touchstart", function(){A.resume()});
			addEventListener("mousemove", pointermove);
			addEventListener("touchmove", pointermove, {passive: false});
			addEventListener("mouseup", pointerup);
			addEventListener("touchend", pointerup);
		})();
		listened = true;
	}
};
toggleSound=()=>{
	if (sound) {
		document.getElementById('soundbutton').innerText = 'SOUND OFF';
		sound = false;
	} else {
		document.getElementById('soundbutton').innerText = 'SOUND ON';
		sound = true;
	}
};
newgame=()=>{
	scrollUp();scrollUp();scrollUp();scrollUp();
	localStorage.removeItem('sfa_discoveries');
	localStorage.removeItem('sfa_moves');
	discoveries = [];
	moves = 0;
	close('wincontent');
	resetHints();
	close('collection');
	clearForge();
	play();
};
enableHint=()=>{
	document.getElementById('hint').style.opacity = 1;
	hintsEnabled = true;
};
showHint=()=>{
	document.getElementById('discovery').innerText = '';
	document.getElementById('discoveryimage').style.display = 'none';
	document.getElementById('discoverydesc').innerHTML = findHint();
	openm('modal');
};
upsell=()=>{
	document.getElementById('discovery').innerText = 'Want more hints?';
	document.getElementById('discoveryimage').style.display = 'none';
	document.getElementById('discoverydesc').innerHTML = 'Hints recharge twice as fast for <a href="https://coil.com" class="outlink" id="coil">web-monetized</a> players.<br><br>(Try the <a href="https://pumabrowser.com" class="outlink" id="puma">Puma browser</a> on your mobile device.)';
	openm('modal');
};
go=href=>{
	window.open(href,'_new');
};
findHint=()=>{
	var hints = [];
	for (var d=0; d<discoveries.length; d++){
		for (var e=0; e<discoveries.length; e++){
			if (discoveries[d] && discoveries[e]){
				var result = findResult(d,e);
				if (discoveries[result[0]]) {
					continue;
				} else if (result.length > 1) {
					hints[hints.length] = "Try creating " + elements[result[0]][0] + " with " + elements[e][0] + ".";
				}
			}
		}
	}
	var hintNumber = Math.floor(Math.random()*hints.length);
	resetHints();
	return hints[hintNumber];
};
resetHints=()=>{
	hintsEnabled = false;
	clearInterval(hintInterval);
	hintInterval = setInterval(enableHint, hintTime);
	document.getElementById('hint').style.opacity = .3;
};