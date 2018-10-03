// Provides Access Control
// Module Route Root: '/auth'

module.exports = (function() {

    const Models = require('../models/model.server.js');

    /** Check if user is allowed to perform the action on the specified target entity
     * @param {Object} req Request context object
     * @param {Object} res Response context object
     * @param {Function} next Next callback
     * @param {string} action action to be performed. Eg: EditProject, DeleteUser
     */
    function checkAccess(req, res, next, action) {
        const user = req.user;

        if (user) {
            // site admins have full access
            if (user.isSiteAdmin) {
                next();
                return;
            }

            switch (action) {
                case 'ProjectEdit':
                case 'ProjectDelete':
                case 'ProjectRead':
                case 'ProjectCreate':
                    checkProjectAccess(req, res, next, action);
                    break;

                case 'MarkdownEdit':
                case 'MarkdownDelete':
                case 'MarkdownRead':
                case 'MarkdownCreate':
                    checkMarkdownAccess(req, res, next, action);
                    break;

                case 'UserEdit':
                case 'UserDelete':
                case 'UserRead':
                case 'UserCreate':
                    checkUserAccess(req, res, next, action);
                    break;

                case 'SiteAdmin':
                    if (req.user.isSiteAdmin) {
                        next();
                    } else {
                        res.status(401).json(['You do not have permission to perform this action']);
                    }
                    break;

                default:
                    next();
            }

        } else {
            res.status(401).json(['You do not have permission to perform this action']);
        }


        /** Check access for Project model */
        function checkProjectAccess(req, res, next, action) {
            switch (action) {
                case 'ProjectEdit':
                case 'ProjectDelete':
                    Models.Project.findOne({
                        _id: req.params.projectId,
                        admins: user._id
                    }, (err, project) => {
                        if (err || !project) {
                            res.status(401).json(['You do not have permission to perform this action']);
                        } else {
                            next();
                        }
                    });
                    break;

                case 'ProjectRead':
                    Models.Project.findOne({
                        _id: req.params.projectId,
                        $or: [{
                            admins: user._id
                        }, {
                            members: user._id
                        }]
                    }, (err, project) => {
                        if (err || !project) {
                            res.status(401).json(['You do not have permission to view this project']);
                        } else {
                            res.locals.project = project;
                            next();
                        }
                    });
                    break;
            }
        }

        /** Check access for Markdown model */
        function checkMarkdownAccess(req, res, next, action) {
            switch (action) {
                case 'MarkdownRead':
                case 'MarkdownEdit':
                    Models.Project.findOne({
                        markdown: req.params.markdownId,
                        $or: [{
                            admins: user._id
                        }, {
                            members: user._id
                        }]
                    }, (err, project) => {
                        if (err || !project) {
                            res.status(401).json(['You do not have permission to view this project']);
                        } else {
                            res.locals.project = project;
                            next();
                        }
                    });
                    break;

                case 'MarkdownDelete':
                    if (req.user.isSiteAdmin) {
                        next();
                    } else {
                        res.status(401).json(['You do not have permission to delete a markdown']);
                    }
            }
        }

        /** Check access for User Model */
        function checkUserAccess(req, res, next, action) {
            switch (action) {
                case 'UserEdit':
                case 'UserDelete':
                    if (req.user._id.toString() === req.params.userId) {
                        next();
                    } else {
                        res.status(401).json(['You do not have permission to perform this action']);
                    }
                    break;
            }
        }
    }

    return {
        checkAccess: checkAccess
    };

})();