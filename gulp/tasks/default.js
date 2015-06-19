"use strict";

let gulp = require("gulp");
let runSequence = require("run-sequence");

gulp.task("default", (cb) => {
    return runSequence(
        "lint",
        "copy",
        "browserify",
        "server-unit-test",
        "client-unit-test",
        cb
    );
});
