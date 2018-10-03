import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Project } from '../model/model';
import { AppConstants } from '../app.constant';

@Injectable()
export class ProjectService {

    endpoint = {
        'createProject': AppConstants.ENDPOINT.baseUrl + '/project',
        'findProjectById': AppConstants.ENDPOINT.baseUrl + '/project/{projectId}',
        'getMyProjects': AppConstants.ENDPOINT.baseUrl + '/project/my',
        'getAllProjects': AppConstants.ENDPOINT.baseUrl + '/project/all',
        'updateProject': AppConstants.ENDPOINT.baseUrl + '/project/{projectId}',
        'deleteProject': AppConstants.ENDPOINT.baseUrl + '/project/{projectId}'
    };

    constructor(private http: HttpClient) { }

    /**
     * Create a new project
     * @param project project object to create
     * @returns Observable that resolves to the created project
     */
    createProject(project: Project): Observable<Project> {
        return this.http.post<Project>(this.endpoint.createProject, project, { withCredentials: true });
    }

    /**
     * Find project by project id
     * @param projectId id of the project
     * @returns Observable that resolves to project with the specifed id; null if id doesn't exist
     */
    findProjectById(projectId: string): Observable<Project> {
        const url = this.endpoint.findProjectById.replace('{projectId}', projectId);
        return this.http.get<Project>(url, { withCredentials: true });
    }

    /**
     * Find project by project name
     * @returns Observable that resolves to project with the specifed projectname; null if id doesn't exist
     */
    getMyProjects(): Observable<Project[]> {
        const url = this.endpoint.getMyProjects;
        return this.http.get<Project[]>(url, { withCredentials: true });
    }


    /**
     * Get all projects
     * @returns Observable that resolves to all the available projects
     */
    getAllProjects(): Observable<Project[]> {
        const url = this.endpoint.getAllProjects;
        return this.http.get<Project[]>(url, { withCredentials: true });
    }

    /**
     * Update project by project id
     * @param {string} projectId id of the project
     * @param project updated project object
     * @returns Observable that resolves to updated project object
     */
    updateProject(projectId: string, project: Project): Observable<Project> {
        const url = this.endpoint.updateProject.replace('{projectId}', projectId);
        return this.http.put<Project>(url, project, { withCredentials: true });
    }

    /**
     * Delete project by project id
     * @param {string} projectId id of the project
     * @returns Observable that resolves to deleted project object
     */
    deleteProject(projectId: string): Observable<Project> {
        const url = this.endpoint.deleteProject.replace('{projectId}', projectId);
        return this.http.delete<Project>(url, { withCredentials: true });
    }
}
