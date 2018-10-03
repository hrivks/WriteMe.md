// Provides Authentication mechanism
// Module Route Root: '/auth'

module.exports = (function() {

    const router = require('express').Router({
        mergeParams: true
    });
    const passport = require('passport');
    const GithubPassportStrategy = require('passport-github2').Strategy;
    const Utils = require('./service-utils.js');
    const UserModel = require('../models/user/user.model.server.js');


    /** Exported object */
    const exp = {
        router: router, // router object
    };

    //#region: Github Authentication

    function githubStrategy(req, token, refreshToken, profile, done) {
        if (req.user) {
            // user is already authenticated.
            // associate git hub account
            req.user.github = {
                id: profile.id,
                token: token
            };

            UserModel.updateUser(req.user._id, req.user)
                .then((usr) => {
                        done(null, usr);
                    },
                    (err) => {
                        done(err, null);
                    });

        } else {
            if (!profile) {
                done(null, false);
            } else {
                // get user by github id
                UserModel.findUserByGithubId(profile.id)
                    .then((user) => {
                        if (user) {
                            done(null, user);
                        } else {
                            // user does not exist. create user
                            const newGitUser = {
                                name: profile.displayName,
                                github: {
                                    id: profile.id,
                                    token: token
                                }
                            };

                            UserModel.create(newGitUser, (err, createdUser) => {
                                if (err) {
                                    done(err, null);
                                } else {
                                    done(null, createdUser);
                                }
                            });
                        }
                    }, (err) => {
                        done(err, null);
                    });
            }
        }
    }

    var githubConfig = {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3100/api/auth/github/callback',
        passReqToCallback: true
    };

    passport.use(new GithubPassportStrategy(githubConfig, githubStrategy));

    // route: [GET] '/api/auth/github'
    router.get('/github', (req, res, next) => {
        if (req.query.next) {
            req.session.redirectTo = req.query.next;
        }
        next();
    }, passport.authenticate('github', {
        scope: 'repo'
    }));

    // route: [GET] '/api/auth/github/callback'
    router.get('/github/callback', passport.authenticate('github'), (req, res) => {
        const baseUrl = process.env.IS_SERVER ? '' : 'http://localhost:4200';
        const redirectTo = req.session.redirectTo || '/';
        res.redirect(baseUrl + req.session.redirectTo);
    });

    //#endregion : Github Authentication

    return exp;

})();