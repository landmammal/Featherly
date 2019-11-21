const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");
// telling passport what Strategy to use
// and using email/password
// Strategy for checking user login against current user in db
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email"
    },
    function (email, password, done) {
      // when a user attempts to login run this code
      db.Users.findOne({ where: { email: email } }).then(function (dbUser) {
        //   if there is no user tell them no by that email register
        if (!dbUser) {
          return done(null, false, { message: "Incorrect email" });
        }
        // if there is a user but passwords dont match tell them wrong password
        else if (!dbUser.verifyPassword(password)) {
          return done(null, false, { message: "Incorrect password" });
        }
        // if none of the above retun user
        return done(null, dbUser);
      });
    }
  )
);
// strategy for creating a user in our db if he dosent already exist
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true
    },
    function (req, email, password, done) {
      // when a user attempts to register
      db.Users.findOne({ where: { email: email } }).then(function (dbUser) {
        //   if there is a user tell them email already used
        if (dbUser) {
          return done(null, false, { message: "That email is already in use" });
        } else {
          // if there is no user create one
          db.Users.create({
            fullName: req.body.name,
            email: email,
            password: password,
            dob: dob,
            phoneNumber: phoneNumber
          }).then(function (newUser) {
            if (!newUser) {
              return done(null, false);
            }
            if (!newUser) {
              return done(null, newUser);
            }
          });
        }
      });
    }
  )
);
// encrypting users to sessions and out of sessions
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (id, done) {
  done(null, user);
});
// exporting our configurations
module.exports = passport;
