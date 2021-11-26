const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const isProduction = process.env.NODE_ENV === "production";

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", { session: true }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(user, process.env.SECRET_TOKEN_KEY, {
      expiresIn: "12h",
    });

    res
      .cookie("A_JWT", token)
      .redirect(
        isProduction
          ? process.env.GOOGLE_FRONT_END_REDIRECT_URL
          : "http://localhost:3000/register"
      );
  }
);

module.exports = router;
