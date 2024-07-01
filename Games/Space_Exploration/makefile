JS = res/global.js res/storage.js res/fullscreen.js res/music.js res/melody.js res/draw.js res/update.js res/play.js res/unlock.js res/game.js
GLOBAL = storage, fullscreen, music, draw, update, play, unlock

.PHONY: check
check: min/game.zip
	@echo
	@echo "Current size:"
	@wc -c min/game.zip

min/all.js: $(JS)
	(echo "(function(){var $(GLOBAL);" && cat $(JS) && echo "})()") > min/all.js

min/min.js: min/all.js
	minify-js min/all.js > min/min.js

#based on xem's mini minifier
min/min.css: res/game.css
	tr '\t\n\r' ' ' < res/game.css | sed -e's/\(\/\*[^*]\+\*\/\| \)\+/ /g' | sed -e's/^ \|\([ ;]*\)\([^a-zA-Z0-9:*.#"()% -]\)\([ ;]*\)\|\*\?\(:\) */\2\4/g' > min/min.css

min/index.html: min/min.js min/min.css index.html
	sed -f modify.sed index.html > min/index.html

min/game.zip: min/index.html
	cd min && zip -9 game.zip index.html

.PHONY: clean
clean:
	find . -name '*~' -delete
	rm min/all.js min/min.js min/min.css min/index.html min/game.zip

.PHONY: lint
lint:
	jshint -a $(JS)
	jscs -a $(JS)