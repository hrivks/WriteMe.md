/**
 * Project schema
 */
module.exports = (function() {
    var mongoose = require('mongoose');
    var UserSchema = require('../user/user.schema.server');
    var MarkdownSchema = require('../markdown/markdown.schema.server');

    var ProjectSchema = new mongoose.Schema({
        name: String,
        description: String,
        gitRepo: String,
        fileName: String,
        markdown: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'markdowns'
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }],
        admins: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }],
        dateCreated: {
            type: Date,
            default: Date.now
        }
    }, {
        collection: 'projects'
    });

    return ProjectSchema;
})();