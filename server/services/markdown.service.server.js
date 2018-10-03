// Provides CRUD for markdown model
// Module Route Root: '/api/markdown'

module.exports = (function() {

    const router = require('express').Router();
    const MarkdownModel = require('../models/model.server').Markdown;
    const ActivityModel = require('../models/model.server').Activity;
    const ProjectModel = require('../models/model.server').Project;
    const Utils = require('./service-utils.js');
    const q = require('q');
    const Acl = require('./access-control.service.server');

    /** Exported objects */
    const exp = {
        router: router, // router object
        api: { // list of functions supported by this service
            createMarkdown: createMarkdown,
            findMarkdownById: findMarkdownById,
            updateMarkdown: updateMarkdown,
            deleteMarkdown: deleteMarkdown
        }
    };

    // ACL checkers
    const hasReadAccess = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'MarkdownRead');
    };

    const hasEditAccess = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'MarkdownEdit');
    };

    const hasDeleteAccess = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'MarkdownDelete');
    };

    const hasProjectReadAccess = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'ProjectRead');
    };

    //#region : Create Markdown

    // route: [POST] '/api/markdown'
    router.post('/', function(req, res) {
        Utils.sendResponse(res, createMarkdown, [req.body, req.user]);
    });

    /**
     * Create a new markdown
     * @param {MarkdownSchema} markdown markdown object to create
     * @returns {Promise<MarkdownSchema>} promise that resolves to the created markdown object
     */
    function createMarkdown(markdown, user) {
        markdown.editedBy = user.name || user.username;
        return MarkdownModel.createMarkdown(markdown);
    }

    //#endregion: Create Markdown


    //#region : Find Markdown by Id

    // route: [GET] '/api/markdown/:markdownId'
    router.get('/:markdownId', hasReadAccess, function(req, res) {
        if (res.locals.markdown) {
            res.json(res.locals.markdown);
        } else {
            Utils.sendResponse(res, findMarkdownById, [req.params.markdownId]);
        }
    });

    /**
     * Find markdown by markdown id
     * @param {string} markdownId id of the markdown
     * @returns {Promise<MarkdownSchema>} promise that resolves to markdown with the specifed id; null if id doesn't exist
     */
    function findMarkdownById(markdownId) {
        return MarkdownModel.findMarkdownById(markdownId);
    }

    //#endregion Find markdown by id

    // route: [GET] '/api/markdown/byProject/:projectId'
    router.get('/byProject/:projectId', hasProjectReadAccess, function(req, res) {
        Utils.sendResponse(res, findMarkdownsByProject, [req.params.projectId]);
    });

    /**
     * Find markdowns by author id
     * @param {String} authorId id of the author
     * @returns {Promise<MarkdownSchema[]>} promise that resolves to list of markdowns in the specified project
     */
    function findMarkdownsByProject(projectId) {
        return MarkdownModel.findMarkdownsByProject(projectId);
    }

    //#endregion: Find markdowns by author


    //#region: Update markdown

    // route: [PUT] '/api/markdown/:markdownId'
    router.put('/:markdownId', hasEditAccess, function(req, res) {
        Utils.sendResponse(res, updateMarkdown, [req.params.markdownId, req.body, req.user]);
    });

    /**
     * Update markdown by markdown id
     * @param {string} markdownId id of the markdown
     * @param {MarkdownSchema} markdown updated markdown object
     * @returns {Promise<MarkdownSchema>} promise that resolves to updated markdown object
     */
    function updateMarkdown(markdownId, markdown, user) {
        const def = q.defer();
        markdown.editedBy = user.name || user.username;
        MarkdownModel.updateMarkdown(markdownId, markdown)
            .then((updatedMarkdown) => {
                // add activity
                ProjectModel.find({
                    markdown: updatedMarkdown._id
                }, (err, project) => {
                    ActivityModel.createActivity(user._id, 'saved markdown in project "' + project.name + '"');
                });
                def.resolve(updatedMarkdown);
            }, (err) => {
                def.reject(err);
            });

        return def.promise;
    }

    //#endregion: Update markdown


    //#region : Delete markdown

    // route: [DELETE] '/api/markdown/:markdownId'
    router.delete('/:markdownId', hasDeleteAccess, function(req, res) {
        Utils.sendResponse(res, deleteMarkdown, [req.params.markdownId]);
    });

    /**
     * Delete markdown by markdown id
     * @param {string} markdownId id of the markdown
     * @returns {Promise<MarkdownSchema>} promise that resolves to deleted markdown object
     */
    function deleteMarkdown(markdownId) {
        return MarkdownModel.deleteMarkdown(markdownId);
    }

    // #endregion: Delete markdown

    return exp;

})();