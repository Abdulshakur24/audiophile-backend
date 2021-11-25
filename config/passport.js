require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("../database/db");
const jwt = require("jsonwebtoken");

passport.serializeUser((token, done) => {
  done(null, token);
});

passport.deserializeUser(async (user, done) => {
  console.log(user);
  await pool
    .query("SELECT name, email, google_id FROM users WHERE id=$1", [user.id])
    .then((response) => {
      done(null, response.rows[0]);
    });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SERCRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      await pool
        .query("SELECT id, name, email FROM users WHERE google_id=$1", [
          profile.id,
        ])
        .then(async (userExist) => {
          if (userExist.rowCount) {
            const user = userExist.rows[0];
            const token = jwt.sign(user, process.env.SECRET_TOKEN_KEY, {
              expiresIn: "12h",
            });

            done(null, token);
            return;
          }
          const name = profile.displayName,
            email = profile.emails[0].value,
            google_id = profile.id;

          await pool
            .query(
              "INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING id, name, email;",
              [name, email, google_id]
            )
            .then((newUser) => {
              const user = newUser.rows[0];
              const token = jwt.sign(user, process.env.SECRET_TOKEN_KEY, {
                expiresIn: "12h",
              });

              done(null, token);
            });
        });
    }
  )
);

module.exports = passport;
