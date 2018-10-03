// Provides CRUD for project model
// Module Route Root: '/api/project'

module.exports = (function() {

    const router = require('express').Router();
    const ProjectModel = require('../models/model.server').Project;
    const ActivityModel = require('../models/model.server').Activity;
    const Utils = require('./service-utils.js');
    const q = require('q');
    const passport = require('passport');
    const Acl = require('./access-control.service.server');

    /** Exported objects */
    const exp = {
        router: router, // router object
        api: { // list of functions supported by this service
            createProject: createProject,
            findProjectById: findProjectById,
            findProjectsByMembership: findProjectsByMembership,
            getAllProjects: getAllProjects,
            updateProject: updateProject,
            deleteProject: deleteProject
        }
    };

    // ACL checkers
    const hasReadAccess = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'ProjectRead');
    };

    const hasEditAccess = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'ProjectEdit');
    };

    const hasDeleteAccess = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'ProjectDelete');
    };

    const hasSiteAdmin = function(req, res, next) {
        Acl.checkAccess(req, res, next, 'SiteAdmin');
    };


    //#region : Create Project

    // route: [POST] '/api/project'
    router.post('/', Utils.checkAuth, function(req, res) {
        Utils.sendResponse(res, createProject, [req.body, req.user]);
    });

    /**
     * Create a new project
     * @param {ProjectSchema} project project object to create
     * @param {UserSchema} admin admin who created the project
     * @returns {Promise<ProjectSchema>} promise that resolves to the created project object
     */
    function createProject(project, admin) {
        const def = q.defer();

        if (project.admins) {
            project.admins.push(admin._id.toString());
        } else {
            project.admins = [admin._id.toString()];
        }

        // add all admins to members
        if (project.members && project.members.length) {
            project.admins.forEach((i) => {
                if (project.members.indexOf(i) === -1) {
                    project.members.push(i);
                }
            });
        } else {
            project.members = [admin._id.toString()];
        }

        ProjectModel.createProject(project).then((createdProject) => {
            // add activity
            ActivityModel.createActivity(admin._id, 'created project "' + project.name + '"');
            def.resolve(createdProject);
        }, (err) => {
            def.reject(err);
        });

        return def.promise;
    }

    //#endregion: Create Project


    //#region: Find projects by author

    // route: [GET] '/api/project/my'
    router.get('/my', Utils.checkAuth, function(req, res) {
        Utils.sendResponse(res, findProjectsByMembership, [req.user._id]);
    });

    /**
     * Find projects by user id
     * @param {String} userId id of the user
     * @returns {Promise<ProjectSchema[]>} promise that resolves to list of projects where the user is a member/admin
     */
    function findProjectsByMembership(userId) {
        return ProjectModel.findProjectsByMembership(userId);
    }

    //#endregion: Find projects by author


    //#region: Get all projects

    // route: [GET] '/api/project/all'
    router.get('/all', hasSiteAdmin, function(req, res) {
        Utils.sendResponse(res, getAllProjects, []);
    });

    /**
     * Find projects by user id
     * @param {String} userId id of the user
     * @returns {Promise<ProjectSchema[]>} promise that resolves to list of all projects
     */
    function getAllProjects() {
        return ProjectModel.find({});
    }

    //#endregion: Find projects by author


    //#region : Find Project by Id

    // route: [GET] '/api/project/:projectId'
    router.get('/:projectId', hasReadAccess, function(req, res) {
        if (res.locals.project) {
            res.json(res.locals.project);
        } else {
            Utils.sendResponse(res, findProjectById, [req.params.projectId]);
        }
    });

    /**
     * Find project by project id
     * @param {string} projectId id of the project
     * @returns {Promise<ProjectSchema>} promise that resolves to project with the specifed id; null if id doesn't exist
     */
    function findProjectById(projectId) {
        return ProjectModel.findProjectById(projectId);
    }

    //#endregion Find project by id


    //#region: Update project

    // route: [PUT] '/api/project/:projectId'
    router.put('/:projectId', hasEditAccess, function(req, res) {
        Utils.sendResponse(res, updateProject, [req.params.projectId, req.body, req.user]);
    });

    /**
     * Update project by project id
     * @param {string} projectId id of the project
     * @param {ProjectSchema} project updated project object
     * @param {UserSchema} user user who requested the update
     * @returns {Promise<ProjectSchema>} promise that resolves to updated project object
     */
    function updateProject(projectId, project, user) {
        const def = q.defer();

        ProjectModel.updateProject(projectId, project)
            .then((updatedProject) => {
                // add activity
                ActivityModel.createActivity(user._id, 'updated project "' + project.name + '"');
                def.resolve(updatedProject);
            }, (err) => {
                def.reject(err);
            });

        return def.promise;
    }

    //#endregion: Update project


    //#region : Delete project

    // route: [DELETE] '/api/project/:projectId'
    router.delete('/:projectId', hasDeleteAccess, function(req, res) {
        Utils.sendResponse(res, deleteProject, [req.params.projectId, req.user]);
    });

    /**
     * Delete project by project id
     * @param {string} projectId id of the project
     * @param {UserSchema} user user who requested for deletion
     * @returns {Promise<ProjectSchema>} promise that resolves to deleted project object
     */
    function deleteProject(projectId, user) {
        const def = q.defer();
        ProjectModel.deleteProject(projectId)
            .then((deletedProject) => {
                // add activity
                ActivityModel.createActivity(user._id, 'deleted project "' + deletedProject.name + '"');
                def.resolve(deletedProject);
            }, (err) => {
                def.reject(err);
            });
        return def.promise;
    }

    // #endregion: Delete project

    return exp;

})();