// provides authentication services

module.exports = (function() {
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    const UserModel = require('./models/model.server').User;
    const bcrypt = require('bcrypt-nodejs');

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    passport.use(new LocalStrategy(localStrategy));

    /** Local Strategy for authenticating user
     * @param {string} username username
     * @param {string} password password
     * @param {function} done callback function to invoke upon authentication
     */
    function localStrategy(username, password, done) {
        UserModel.findUserByUsername(username)
            .then((user) => {
                try {
                    if (user && bcrypt.compareSync(password, user.password)) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                } catch (ex) {
                    done(null, false);
                }
            }, (err) => {
                done(err, null);
            });

    }

    /** User serializer function for passport js */
    function serializeUser(user, done) {
        done(null, user);
    }

    /** User deserializer function for passport js */
    function deserializeUser(user, done) {
        UserModel.findUserById(user._id)
            .then((user) => {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            }, (err) => {
                done(err, null);
            });
    }

})();