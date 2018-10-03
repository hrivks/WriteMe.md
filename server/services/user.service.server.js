// Provides CRUD for user model
// Module Route Root: '/api/user'

module.exports = (function() {

    const router = require('express').Router();
    const UserModel = require('../models/model.server').User;
    const Utils = require('./service-utils.js');
    const q = require('q');
    const passport = require('passport');
    const bcrypt = require('bcrypt-nodejs');
    const Acl = require('./access-control.service.server');

    /** Exported objects */
    const exp = {
        router: router, // router object
        api: { // list of functions supported by this service
            getAllUsers: getAllUsers,
            createUser: createUser,
            findUserById: findUserById,
            findUsersByIds: findUsersByIds,
            findUserByCredentials: findUserByCredentials,
            updateUser: updateUser,
            deleteUser: deleteUser
        }
    };

    // ACL checkers
    const hasReadAccess = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'UserRead');
    };

    const hasEditAccess = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'UserEdit');
    };

    const hasDeleteAccess = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'UserDelete');
    };

    const hasSiteAdminAccess = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'SiteAdmin');
    };

    //#region: Login User

    // route: [POST] '/api/user/login'
    router.post('/login', passport.authenticate('local'), (req, res) => {
        res.json(req.user);
    });

    //#endregion: Login User


    //#region: Logout User

    // route: [POST] '/api/user/logout'
    router.post('/logout', (req, res) => {
        req.logOut();
        res.json({
            result: 'logout successful'
        });
    });

    //#endregion: Logout User


    //#region: LoggedIn User

    // route: [POST] '/api/user/loggedIn'
    router.post('/loggedIn', (req, res) => {
        if (req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.json(false);
        }
    });

    //#endregion: LoggedIn User


    //#region: Register User

    // route: [POST] '/api/user/register'
    router.post('/register', function(req, res) {
        Utils.sendResponse(res, register, [req.body, req]);
    });

    function register(user, req) {
        const def = q.defer();

        createUser(user)
            .then((createdUser) => {
                // login created user
                req.login(createdUser, (err) => {
                    def.resolve(createdUser);
                });
            }, (err) => {
                def.reject(err);
            });

        return def.promise;
    }

    //#endregion: Register User


    //#region: Get all users

    // route: [GET] '/api/user/all'
    router.post('/all', hasSiteAdminAccess, (req, res) => {
        Utils.sendResponse(res, getAllUsers, []);
    });

    /**
     * Get all available users
     * @returns {Promise<UserSchema[]>} promise that resolves to the list of available users
     */
    function getAllUsers() {
        return UserModel.getAllUsers();
    }

    //#endregion: Get all users


    //#region: Search user by name

    // route: [GET] '/api/user/search?name=name1,name2,name3'
    router.get('/search', Utils.checkAuth, function(req, res) {
        Utils.sendResponse(res, searchByName, [req.query.name]);
    });

    function searchByName(query) {
        return UserModel.searchUsersByName(query);
    }

    //#endregion

    //#region : Create User

    // route: [POST] '/api/user'
    router.post('/', hasSiteAdminAccess, function(req, res) {
        Utils.sendResponse(res, createUser, [req.body]);
    });

    /**
     * Create a new user
     * @param {UserSchema} user user object to be added to the user list
     * @returns {Promise<UserSchema>} promise that resolves to the created user object
     */
    function createUser(user) {
        if (user.password) {
            user.password = bcrypt.hashSync(user.password);
        }
        return UserModel.createUser(user);
    }

    //#endregion: Create User


    //#region : Find users by Ids

    // route: [GET] '/api/user/byIds?userIds=id1,id2,id3..'
    router.get('/byIds', Utils.checkAuth, function(req, res) {
        Utils.sendResponse(res, findUsersByIds, [req.query.userIds]);
    });

    /**
     * Find users by user ids
     * @param {string} userIds comma seperated list of user ids
     * @returns {Promise<UserSchema[]>} promise that resolves to the list of users
     */
    function findUsersByIds(userIds) {
        return UserModel.findUsersByIds(userIds);
    }

    //#endregion Find users by ids


    //#region : Find user by Id

    // route: [GET] '/api/user/:userId'
    router.get('/:userId', hasReadAccess, function(req, res) {
        Utils.sendResponse(res, findUserById, [req.params.userId]);
    });

    /**
     * Find user by user id
     * @param {string} userId id of the user
     * @returns {Promise<UserSchema>} promise that resolves to user with the specifed id; null if id doesn't exist
     */
    function findUserById(userId) {
        return UserModel.findUserById(userId);
    }

    //#endregion Find user by id


    //#region : Find user username & credentials

    // route: [GET] '/api/user?username=username&password=password'
    router.get('/', function(req, res) {
        Utils.sendResponse(res, findUserByCredentials, [req.query.username, req.query.password]);
    });

    /**
     * Find user by credentials
     * @param {String} username username of the user
     * @param {String} password password of the user
     * @returns {User} user with the specifed username; null if id doesn't exist
     */
    function findUserByCredentials(username, password) {
        return UserModel.findUserByCredentials(username, password);
    }

    /**
     * Find user by user name
     * @param {String} username username of the user
     * @returns {Promise<UserSchema>} promise that resolves to user with the specifed username; null if id doesn't exist
     */
    function findUserByUsername(username) {
        return UserModel.findUserByUsername(username);
    }
    //#endregion


    //#region : Update User

    // route: [PUT] '/api/user/:userId'
    router.put('/:userId', hasEditAccess, function(req, res) {
        const user = req.body;
        if (user.isSiteAdmin && !req.user.isSiteAdmin) {
            user.isSiteAdmin = false;
        }
        Utils.sendResponse(res, updateUser, [req.params.userId, req.body]);
    });

    /**
     * Update user by user id
     * @param {string} userId id of the user
     * @param {UserSchema} user updated user object
     * @returns {Promise<UserSchema>} promise that resolves to updated user object
     */
    function updateUser(userId, user) {
        if (user.password) {
            user.password = bcrypt.hashSync(user.password);
        }
        return UserModel.updateUser(userId, user);
    }

    //#endregion: Update User


    //#region : Delete User

    // route: [DELETE] '/api/user/:userId'
    router.delete('/:userId', hasDeleteAccess, function(req, res) {
        Utils.sendResponse(res, deleteUser, [req.params.userId]);
    });

    /**
     * Delete user by user id
     * @param {string} userId id of the user
     * @returns {Promise<UserSchema>} promise that resolves to deleted user object
     */
    function deleteUser(userId) {
        return UserModel.deleteUser(userId);
    }

    // #endregion: Delete User

    return exp;

})();