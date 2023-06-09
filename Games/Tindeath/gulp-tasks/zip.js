module.exports = function () {
  const gulp = require("gulp");
  const util = require("gulp-util");
  const replace = require("gulp-replace");
  const inlinesource = require("gulp-inline-source");
  const zip = require("gulp-zip");
  const advzip = require("gulp-advzip");
  const checkFileSize = require("gulp-check-filesize");

  const config = util.env.boilerplate.config;
  const zipConfig = config.tasks.zip;

  var replaceList = {
    step: "st",
    startButton: "sB",
    gameWrapper: "gW",
    backgroundDoor: "bD",
    backgroundOverflow: "bgo",
    backgroundWrapper: "bgw",
    c__imageWrapper: "c_iW",
    c__image: "c_i",
    errorMessage: "eM",
    t1Button: "t1B",
    "tutorial-1": "t1",
    "tutorial-2": "t2",
    "tutorial-3": "t3",
    "tutorial-4": "t4",
  };

  var valueList = [];
  for (var text in replaceList) {
    if (replaceList.hasOwnProperty(text)) {
      var value = replaceList[text];
      if (valueList.indexOf(value) >= 0) {
        console.log('----------- duplicate replace value: "' + value + '"');
      } else {
        valueList.push(value);
      }
    }
  }

  gulp.task("zip", function () {
    var task = gulp.src(config.destinationRoot + zipConfig.source).pipe(
      inlinesource({
        compress: false,
      })
    );

    for (var text in replaceList) {
      if (replaceList.hasOwnProperty(text)) {
        task = task.pipe(replace(text, replaceList[text]));
      }
    }

    return task
      .pipe(zip(zipConfig.filename))
      .pipe(advzip({ optimizationLevel: 4 }))
      .pipe(gulp.dest(zipConfig.destination))
      .pipe(
        checkFileSize({
          fileSizeLimit: 1024 * 13 * 2,
        })
      );
  });
};
