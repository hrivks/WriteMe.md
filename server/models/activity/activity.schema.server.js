/**
 * Activity schema
 */
module.exports = (function() {
    var mongoose = require('mongoose');

    var ActivitySchema = new mongoose.Schema({
        title: String,
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        createdOn: {
            type: Date,
            default: Date.now
        }
    }, {
        collection: 'activities'
    });

    return ActivitySchema;
})();