const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const accountRouter = require("./routers/account");
const studentRouter = require("./routers/student");
const managerRouter = require("./routers/manager");
const dbRouter = require("./routers/database");

var app = express();

app.use(cookieParser());
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/account", accountRouter);
app.use("/student", studentRouter);
app.use("/manager", managerRouter);
app.use("/database", dbRouter);

// 404 Error handling route
app.get("*", (req, res) => {
  res.status(404).send("Resource not found");
});

module.exports = app;

