var gulp = require("gulp");
var concat = require("gulp-concat");
var htmlreplace = require("gulp-html-replace");
var closureCompiler = require("google-closure-compiler").gulp();
var uglify = require("gulp-uglify");
const zip = require("gulp-zip");

var sourceFiles =
[
    // Game
    "./src/math.js",
    "./src/util.js",
    "./src/camera.js",
    "./src/particle.js",
    "./src/player.js",
    "./src/coin.js",
    "./src/wall.js",
    "./src/ui.js",
    "./src/menu.js",
    "./src/playing.js",
    "./src/gameOver.js",
    "./src/speedLines.js",
    "./src/level.js",

    // Levels
    "./src/levels/l_01.js",
    "./src/levels/l_02.js",
    "./src/levels/l_03.js",
    "./src/levels/l_04.js",
    "./src/levels/l_05.js",
    "./src/levels/l_06.js",
    "./src/levels/l_07.js",
    "./src/levels/l_08.js",
    "./src/levels/l_09.js",
    "./src/levels/l_10.js",
    "./src/levels/l_11.js",
    "./src/levels/l_12.js",
    "./src/levels/l_13.js",
    "./src/levels/l_14.js",
    "./src/levels/l_15.js",
    "./src/levels/l_16.js",
    "./src/levels/l_17.js",
    "./src/levels/l_18.js",
    "./src/levels/l_19.js",
    "./src/levels/l_20.js",

    // Engine
    "./src/aw.js",

    // Entry point
    "./src/main.js",
];

var outputFiles =
[
    "./build/index.html",
    "./build/concat.min.js"
]

gulp.task("build_js", () =>
{
	return gulp.src(sourceFiles)
            .pipe(concat("concat.js"))
            .pipe(gulp.dest("./build/"));
});

gulp.task("build_html", (done) =>
{
    gulp.src("index.html")
        .pipe(htmlreplace({ "js": "concat.min.js" }))
        .pipe(gulp.dest("./build/"));

    done();
});

gulp.task("minify_js", gulp.series("build_js", "build_html", () =>
{
    return gulp.src("./build/concat.js")
        .pipe(closureCompiler(
            {
                compilation_level: "ADVANCED",
                warning_level: "QUIET",
                language_in: "ECMASCRIPT6_STRICT",
                language_out: "ECMASCRIPT5_STRICT",
                /*output_wrapper: "(function(){\n%output%\n}).call(this)",*/
                js_output_file: "concat.min.js"
            }))
        .pipe(gulp.dest("./build/"));
}));

gulp.task("zip", gulp.series("minify_js", (done) =>
{
    gulp.src(outputFiles)
        .pipe(zip("offtheline.zip"))
        .pipe(gulp.dest("./build/"))

    done();
}));

gulp.task("build", gulp.series("zip", (done) =>
{
    done();
}));