const router = require("express").Router();
const passport = require("passport");

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
    console.log(req.user);
    res
      .cookie("token", req.user)
      .redirect("https://audiophile-by-ashakur.netlify.app/register");
  }
);

module.exports = router;
