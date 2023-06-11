#!/bin/bash

clear

echo "Compressing Js's."

java -jar yuicompressor-2.4.8.jar -o min.js/game.min.js --type js js/game.js
java -jar yuicompressor-2.4.8.jar -o min.js/island.min.js --type js js/island.js
java -jar yuicompressor-2.4.8.jar -o min.js/item.min.js --type js js/item.js
java -jar yuicompressor-2.4.8.jar -o min.js/level.min.js --type js js/level.js
java -jar yuicompressor-2.4.8.jar -o min.js/levels.min.js --type js js/levels.js
java -jar yuicompressor-2.4.8.jar -o min.js/obstacle.min.js --type js js/obstacle.js
java -jar yuicompressor-2.4.8.jar -o min.js/player.min.js --type js js/player.js
java -jar yuicompressor-2.4.8.jar -o min.js/wind.min.js --type js js/wind.js

echo "Compressing Css's."

java -jar yuicompressor-2.4.8.jar -o min.css/game.min.css --type css css/game.css

echo "Creating zip file."

rm piratesOfWind.zip
rm -rf piratesOfWind

mkdir piratesOfWind
mkdir piratesOfWind/assets
mkdir piratesOfWind/min.js
mkdir piratesOfWind/min.css

cp index.min.html piratesOfWind/index.html
cp assets/* piratesOfWind/assets
cp min.js/* piratesOfWind/min.js
cp min.css/* piratesOfWind/min.css

7z a -tzip piratesOfWind.zip piratesOfWind

rm -rf piratesOfWind

#7z a -tzip piratesOfWind.zip index.min.html
#7z a -tzip piratesOfWind.zip assets
#7z a -tzip piratesOfWind.zip min.js
#7z a -tzip piratesOfWind.zip min.css

echo "Done."

