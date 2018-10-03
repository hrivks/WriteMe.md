module.exports = (function() {

    const UserModel = require('./user/user.model.server.js');
    const MarkdownModel = require('./markdown/markdown.model.server.js');
    const ProjectModel = require('./project/project.model.server.js');
    const ActivityModel = require('./activity/activity.model.server.js');

    var model = {
        User: UserModel,
        Markdown: MarkdownModel,
        Project: ProjectModel,
        Activity: ActivityModel
    };

    return model;
})();