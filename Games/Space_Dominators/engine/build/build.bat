rem SIMPLE BUILD SCRIPT FOR    by Nishant kaushal
rem minfies and combines index.html and index.js and zips the result

set name=app

rem go to top of project
cd ..
cd ..

rem remove old files
del %name%.zip index.min.html
rmdir /s /q build

rem combine code
mkdir build
type engine\engineUtil.js >> build\index.js
echo.>> build\index.js
type engine\build\engineBuild.js >> build\index.js
echo.>> build\index.js
type engine\engine.js >> build\index.js
echo.>> build\index.js
type engine\engineAudio.js >> build\index.js
echo.>> build\index.js
type engine\engineObject.js >> build\index.js
echo.>> build\index.js
type engine\engineTileLayer.js >> build\index.js
echo.>> build\index.js
type engine\engineInput.js >> build\index.js
echo.>> build\index.js
type engine\engineParticle.js >> build\index.js
echo.>> build\index.js
type engine\engineWebGL.js >> build\index.js
echo.>> build\index.js
type engine\engineDraw.js >> build\index.js
echo.>> build\index.js

rem add app files to include here
type appObjects.js >> build\index.js
echo.>> build\index.js
type appCharacters.js >> build\index.js
echo.>> build\index.js
type appEffects.js >> build\index.js
echo.>> build\index.js
type appLevel.js >> build\index.js
echo.>> build\index.js
type app.js >> build\index.js
echo.>> build\index.js

rem minify code with closure
call google-closure-compiler --js build\index.js --js_output_file build\index.js --compilation_level ADVANCED --language_out ECMASCRIPT_2019 --warning_level VERBOSE --jscomp_off * --assume_function_wrapper
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem more minification with uglify or terser (they both are about the same)
call uglifyjs -o build\index.js --compress --mangle -- build\index.js
rem call terser -o build\index.js --compress --mangle -- build\index.js
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem roadroaller compresses the code better then zip
call roadroller build\index.js -o build\index.js
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem build the html
type engine\build\index.html >> build\index.html
echo ^<script^> >> build\index.html
type build\index.js >> build\index.html
echo ^</script^> >> build\index.html

rem minify the png
call imagemin tiles.png > build\tiles.png
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem zip the result
cd build
rem call advzip -a -4 -i 99 ..\%name%.zip index.html
call ..\ect -9 -strip -zip ..\%name%.zip index.html
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b %ERRORLEVEL%
)

rem remove build folder
copy index.html ..\index.min.html
cd ..
rmdir /s /q build

rem pause to see result        ect -9 -strip -zip   .zip index.html