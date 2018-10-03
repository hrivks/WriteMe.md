// Provides CRUD for Social Actions
// Module Route Root: '/api/social'

module.exports = (function() {

    const router = require('express').Router();
    const UserModel = require('../models/model.server').User;
    const ActivityModel = require('../models/model.server').Activity;
    const Utils = require('./service-utils.js');
    const q = require('q');
    const passport = require('passport');


    /** Exported objects */
    const exp = {
        router: router, // router object
        api: { // list of functions supported by this service
            follow: follow,
            unfollow: unfollow,
            getFeeds: getFeeds
        }
    };

    //#region: Get Feeds

    // route: [GET] '/api/social/feeds'
    router.get('/feeds', Utils.checkAuth, (req, res) => {
        Utils.sendResponse(res, getFeeds, [req.user._id]);
    });

    /**
     * Get feeds for user
     * @param {string} userId user for whom feeds are to be obtained
     */
    function getFeeds(userId) {
        var def = q.defer();

        UserModel.findById(userId, (err, user) => {
            if (err) {
                def.reject(err);
            } else {
                if (user.following && user.following.length) {
                    ActivityModel.find({
                        actor: {
                            $in: user.following
                        }
                    }, (err, feeds) => {
                        if (err) {
                            def.reject(err);
                        } else {
                            def.resolve(feeds);
                        }
                    });
                } else {
                    def.resolve([]);
                }
            }
        });

        return def.promise;
    }

    //#endregion: Get Feeds

    //#region: Follow user

    // route: [PUT] '/api/social/follow'
    router.put('/follow', (req, res) => {
        Utils.sendResponse(res, follow, [req.user, req.body.follow]);
    });

    /**
     * Follow user
     * @returns {Promise<boolean[]>} promise that resolves to success on updation
     */
    function follow(user, toFollowId) {
        const def = q.defer();

        UserModel.findById(toFollowId, (err, userExists) => {
            if (err) {
                def.reject(err);
            } else if (!userExists) {
                def.reject('User does not exist');
            } else {
                UserModel.findByIdAndUpdate(user._id, {
                    $push: {
                        following: userExists._id
                    },
                }, {
                    new: true
                }, (err, res) => {
                    if (err) {
                        def.reject(err);
                    } else {
                        def.resolve({
                            following: res.following
                        });
                    }
                });
            }

        });

        return def.promise;
    }

    //#endregion: Follow user


    //#region: Unfollow user

    // route: [PUT] '/api/social/unfollow'
    router.put('/unfollow', (req, res) => {
        Utils.sendResponse(res, unfollow, [req.user, req.body.unfollow]);
    });

    /**
     * Unfollow user
     * @returns {Promise<boolean[]>} promise that resolves to success on updation
     */
    function unfollow(user, toUnfollowId) {
        const def = q.defer();

        UserModel.findByIdAndUpdate(user._id, {
            $pull: {
                following: toUnfollowId
            }
        }, {
            new: true
        }, (err, res) => {
            if (err) {
                def.reject(err);
            } else {
                def.resolve({
                    result: 'unfollow successful'
                });
            }
        });

        return def.promise;
    }

    //#endregion: Follow user



    return exp;

})();