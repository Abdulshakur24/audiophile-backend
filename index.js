const express = require("express");
const session = require("express-session");
const cors = require("cors");
require("./config/passport");
const app = express();
const apiRouter = require("./routers/routers");
const passport = require("passport");

const origin = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CORS_ORIGIN
      : "http://localhost:3000",
  credentials: true,
};
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.COOKIE_KEY,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(cors(origin));
app.options("*", cors(origin));
app.use(express.json());
app.use(apiRouter);

const PORT = process.env.PORT || 5010;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
