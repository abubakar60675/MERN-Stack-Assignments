var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var config = require("config");

var indexRouter = require("./routes/index");
var studentRouter = require("./routes/api/Student");
var validateStudent = require("./middlewares/validateStudent");
var teacherRouter = require("./routes/api/Teacher");
var validateTeacher = require("./middlewares/validateTeacher");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", indexRouter);
app.use("/api/students", validateStudent, studentRouter);
app.use("/api/teachers", validateTeacher, teacherRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

const db = config.get("db");
mongoose
    .connect(db)
    .then(async(data) => {
        console.log("DB Connected Successfully");
    })
    .catch((error) => {
        console.log("Error Connecting DB");
    });

module.exports = app;