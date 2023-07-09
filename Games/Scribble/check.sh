#!/bin/bash

SRC=`curl "https://raw.githubusercontent.com/js13kgames/js13kserver/master/index.js" | md5sum`

echo

DEST=`cat ./index.js | tr -d '\r' | md5sum`
if [ "$SRC" != "$DEST" ]; then
	echo "Corrupt index.js"
	exit 1;
fi

PROC=`cat ./Procfile`
if [ "$PROC" != "web: node index.js" ]; then
	echo "Corrupt Procfile"
	exit 1;
fi

echo "Ok"
exit 0