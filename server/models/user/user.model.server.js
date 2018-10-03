/**
 * User Model
 */
module.exports = (function() {
    const q = require('q');
    const mongoose = require('mongoose');
    const UserSchema = require('./user.schema.server');
    const ProjectModel = require('../project/project.model.server');

    var UserModel = mongoose.model('UserModel', UserSchema);

    // API
    UserModel.getAllUsers = getAllUsers;
    UserModel.createUser = createUser;
    UserModel.findUserById = findUserById;
    UserModel.findUsersByIds = findUsersByIds;
    UserModel.findUserByUsername = findUserByUsername;
    UserModel.findUserByCredentials = findUserByCredentials;
    UserModel.findUserByUsername = findUserByUsername;
    UserModel.findUserByGithubId = findUserByGithubId;
    UserModel.searchUsersByName = searchUsersByName;
    UserModel.updateUser = updateUser;
    UserModel.deleteUser = deleteUser;

    // Implimentation

    /**
     * Validate a user object
     * @param {UserSchema} user user object to validate
     * @throws {String[]} list of errors encountered
     */
    function validate(user) {
        var errors = [];

        if (!user || Object.keys(user).length == 0) {
            throw ['User object expected'];
        }

        if (!user.username) {
            errors.push('Username is required');
        }

        if (!user.password) {
            errors.push('Password is required');
        }

        if (errors.length > 0) {
            throw errors;
        }
    }


    /** Get all users
     * @returns {Promise<UserSchema[]>} promise that resolves to the list of all users
     */
    function getAllUsers() {
        return UserModel.find();
    }


    /**
     * Create a new User
     * @param {UserSchema} user 
     * @returns {Promise<UserSchema>} promise that resolves to the created user
     */
    function createUser(user) {
        var def = q.defer();

        validate(user);
        UserModel.findOne({
            username: user.username
        }, (err, alreadyExists) => {
            if (alreadyExists) {
                def.reject({
                    message: 'User with username ' + user.username + ' already exists'
                });
            } else {
                user.isSiteAdmin = false;
                UserModel.create(user, (err, createdUser) => {
                    if (err) {
                        def.reject(err.message);
                    } else {
                        def.resolve(createdUser);
                    }
                });
            }
        });

        return def.promise;
    }


    /**
     * Find user by user id
     * @param {string} userId 
     * @returns {DocumentQuery<UserSchema>} query that resolves to the user object
     */
    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    /**
     * Find users by user ids
     * @param {string[]} userIds list of user ids
     * @returns {DocumentQuery<UserSchema[]>} query that resolves to the list of users corresponding to the user ids
     */
    function findUsersByIds(userIds) {
        const Ids = userIds.split(',');
        return UserModel.find({
            '_id': {
                '$in': Ids
            }
        });
    }


    /**
     * Find user by username
     * @param {string} username 
     * @returns {DocumentQuery<UserSchema>} query that resolves to the user object
     */
    function findUserByUsername(username) {
        return UserModel.findOne({
            username: username
        });
    }


    /**
     * Find user by username and password
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<UserSchema>} promise that resolves to the user object
     */
    function findUserByCredentials(username, password) {
        const def = q.defer();
        UserModel
            .findOne({
                username: username,
                password: password
            }, (err, user) => {
                if (err) {
                    def.reject(err);
                } else if (!user) {
                    def.reject('Invalid Credentails');
                } else {
                    def.resolve(user);
                }
            });
        return def.promise;
    }


    /**
     * Find user by facebookId
     * @param {string} githubId
     * @returns {DocumentQuery<UserSchema>} query that resolves to the user with the specified facebook id
     */
    function findUserByGithubId(githubId) {
        return UserModel.findOne({
            'github.id': githubId
        });
    }

    /**
     * Search for users based on name or username
     * @param {string} query comma seperated list of name
     */
    function searchUsersByName(query) {
        const def = q.defer();
        var keywords = query ? query.split(',') : [];
        if (keywords.length) {
            const keywordsRegex = keywords.map((i) => {
                return new RegExp(i.trim(), "i");
            });

            UserModel.find({
                '$or': [{
                        'username': {
                            '$in': keywordsRegex
                        }
                    },
                    {
                        'name': {
                            '$in': keywordsRegex
                        }
                    }
                ]
            }, (err, users) => {
                if (err) {
                    def.reject(err);
                } else {
                    def.resolve(users);
                }
            });

        } else {
            def.resolve([]);
        }

        return def.promise;
    }


    /**
     * Update user by user id
     * @param {string} userId 
     * @param {UserSchema} user 
     * @returns {DocumentQuery<UserSchema>} query that resolves to the updated user object
     */
    function updateUser(userId, user) {
        return UserModel.findByIdAndUpdate(userId, user, {
            new: true
        });
    }


    /**
     * Delete user by user id
     * @param {string} userId 
     * @returns {DocumentQuery<UserSchema>} query that resolves successfully when the user is removed
     */
    function deleteUser(userId) {
        const def = q.defer();
        UserModel.findByIdAndRemove(userId, (err, res) => {
            if (err) {
                def.reject(err);
            } else {
                // remove user entry from all projects
                ProjectModel.update({
                    $or: [{
                        admins: userId
                    }, {
                        members: userId
                    }]
                }, {
                    $pull: {
                        admins: userId,
                        members: userId
                    }
                }, {
                    multi: true
                }, (err, projects) => {
                    if (err) {
                        def.reject(err);
                    } else {
                        def.resolve({
                            result: 'deleted'
                        });
                    }
                });
            }
        });
        return def.promise;
    }

    /**
     * Make user as site admin
     * @param {string} userId id of the user
     * @param {boolean} isSiteAdmin true, to make site admin
     */
    function makeSiteAdmin(userId, isSiteAdmin) {
        return UserModel.findByIdAndUpdate(userId, {
            $set: {
                isSiteAdmin: isSiteAdmin
            }
        }, {
            new: true
        });
    }


    return UserModel;
})();