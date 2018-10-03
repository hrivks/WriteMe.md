/**
 * Project Model
 */
module.exports = (function() {
    const q = require('q');
    const mongoose = require('mongoose');
    const ProjectSchema = require('./project.schema.server');
    const UserModel = require('../user/user.model.server');
    const MarkdownModel = require('../markdown/markdown.model.server');
    var ProjectModel = mongoose.model('ProjectModel', ProjectSchema);

    // API
    ProjectModel.createProject = createProject;
    ProjectModel.findProjectById = findProjectById;
    ProjectModel.findProjectsByMembership = findProjectsByMembership;
    ProjectModel.updateProject = updateProject;
    ProjectModel.deleteProject = deleteProject;

    // Implimentation

    /**
     * Validate a project object
     * @param {ProjectSchema} project project object to validate
     * @throws {String[]} list of errors encountered
     */
    function validate(project) {
        var errors = [];

        if (!project || Object.keys(project).length == 0) {
            throw ['Project object expected'];
        }

        if (!project.name) {
            errors.push('Project name is required');
        }

        if (!project.markdown) {
            errors.push('Markdown is required');
        }

        if (!project.fileName) {
            errors.push('File Name is required');
        }

        if (errors.length > 0) {
            throw errors;
        }
    }

    /**
     * Create a new Project
     * @param {ProjectSchema} project 
     * @returns {Promise<ProjectSchema>} promise that resolves to the created project
     */
    function createProject(project) {
        var def = q.defer();

        validate(project);
        ProjectModel.create(project, (err, createdProject) => {
            if (err) {
                def.reject(err.message);
            } else {
                def.resolve(createdProject);
            }
        });

        return def.promise;
    }

    /**
     * Find project by project id
     * @param {string} projectId 
     * @returns {DocumentQuery<ProjectSchema>} query that resolves to the project object
     */
    function findProjectById(projectId) {
        return ProjectModel.findById(projectId);
    }

    /**
     * Find project by membership
     * @param {string} userId 
     * @returns {DocumentQuery<ProjectSchema[]>} query that resolves to the list of projects where the user is member
     */
    function findProjectsByMembership(userId) {
        return ProjectModel.find({
            '$or': [{
                    members: mongoose.Types.ObjectId(userId)
                },
                {
                    admins: mongoose.Types.ObjectId(userId)
                },
            ]
        });
    }

    /**
     * Update project by project id
     * @param {string} projectId 
     * @param {ProjectSchema} project 
     * @returns {DocumentQuery<ProjectSchema>} query that resolves to the updated project object
     */
    function updateProject(projectId, project) {
        validate(project);
        return ProjectModel.findByIdAndUpdate(projectId, project, {
            new: true
        });
    }

    /**
     * Delete project by project id
     * @param {string} projectId 
     * @returns {Promise<ProjectSchema>} promise that resolves successfully when the project is removed
     */
    function deleteProject(projectId) {
        var def = q.defer();
        ProjectModel.findByIdAndRemove(projectId, (err, removedProject) => {
            if (err) {
                def.reject(err);
            } else {
                MarkdownModel.findByIdAndRemove(removedProject.markdown, (err, removedMarkdown) => {
                    if (err) {
                        def.reject(err);
                    } else {
                        def.resolve(removedProject);
                    }
                });
            }
        });

        return def.promise;
    }

    return ProjectModel;
})();