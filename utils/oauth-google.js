const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('config');
const { User } = require('../models/user');
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.

module.exports = function () {

    passport.use(new GoogleStrategy({

        clientID: config.get('google-client-id'),
        clientSecret: config.get('google-client-secret'),
        callbackURL: config.get('google-callback-url')
    },
        async (accessToken, refreshToken, profile, done) => {

            const existingUser = await User.findOne({ email: profile.emails[0].value });

            if (existingUser) {
                return done(null, existingUser);
            }
            const user = await new User({
                email: profile.emails[0].value,
                name: profile.displayName,
                isVerified: true,
                avatar_url: profile.photos[0].value
            }).save();

            done(null, user);
        }
    ));
};

