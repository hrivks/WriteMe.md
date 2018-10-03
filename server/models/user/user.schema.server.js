/**
 * User schema
 */
module.exports = (function() {
    var mongoose = require('mongoose');

    var UserSchema = new mongoose.Schema({
        username: String,
        password: String,
        github: {
            id: String,
            token: String
        },
        name: String,
        email: String,
        dateCreated: {
            type: Date,
            default: Date.now
        },
        isSiteAdmin: Boolean,
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }]
    }, {
        collection: 'users'
    });

    return UserSchema;
})();