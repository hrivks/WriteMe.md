/**
 * Activity Model
 */
module.exports = (function() {
    const q = require('q');
    const mongoose = require('mongoose');
    const UserModel = require('../user/user.model.server');

    const ActivitySchema = require('./activity.schema.server');
    const ActivityModel = mongoose.model('ActivityModel', ActivitySchema);


    // API
    ActivityModel.createActivity = createActivity;
    ActivityModel.getActivitiesByUserIds = getActivitiesByUserIds;

    // Implimentation

    /**
     * Validate a activity object
     * @param {ActivitySchema} activity activity object to validate
     * @throws {String[]} list of errors encountered
     */
    function validate(activity) {
        var errors = [];

        if (!activity || Object.keys(activity).length == 0) {
            throw ['Activity object expected'];
        }

        if (!activity.title) {
            errors.push('Activity title is required');
        }

        if (!activity.actor) {
            errors.push('Actor is required');
        }

        if (errors.length > 0) {
            throw errors;
        }
    }

    /**
     * Create a new Activity
     * @param {string} actorId user id of the actor
     * @param {string} title activity 
     * @returns {Promise<ActivitySchema>} promise that resolves to the created activity
     */
    function createActivity(actorId, title) {
        var def = q.defer();
        const activity = {
            actor: actorId,
            title: title
        };
        validate(activity);
        UserModel.findById(activity.actor, (err, exists) => {
            if (err) {
                def.reject(err);
            } else if (!exists) {
                def.reject('Actor is not a valid user');
            } else {
                ActivityModel.create(activity, (err, createdActivity) => {
                    if (err) {
                        def.reject(err.message);
                    } else {
                        def.resolve(createdActivity);
                    }
                });
            }
        });

        return def.promise;
    }


    /**
     * Find activities by user ids
     * @param {string[]} userIds 
     * @returns {DocumentQuery<ActivitySchema>} query that resolves to the list of activities
     */
    function getActivitiesByUserIds(userIds) {
        return ActivityModel.find({
            actor: {
                $in: userIds
            }
        });
    }

    return ActivityModel;
})();