import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ProjectService } from '../../../services/project.service.client';
import { InteractionsService } from '../../../services/interactions.service.client';
import { ErrorHandlerService } from '../../../services/error-handler.service.client';
import { AuthService } from '../../../services/auth.service.client';
import { User, Project, Markdown } from '../../../model/model';
import { GitHubService } from '../../../services/github.service.client';

@Component({
  selector: 'app-edit-project',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class EditProjectComponent implements OnInit {

  // properties
  @ViewChild('editProjectForm') editProjectForm: NgForm;

  private members: string[];
  private admins: string[];
  private loggedInUser: User;
  private canEdit: boolean;
  private project: Project;
  private repos: string[];

  private inProgress: boolean;
  private confirmDelete: boolean;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private githubService: GitHubService,
    private interactionService: InteractionsService,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService) { }

  ngOnInit() {
    this.loggedInUser = this.authService.getLoggedInUser();
    if (!this.loggedInUser) {
      this.interactionService.showAlert('You must be logged in to view this page');
    } else {
      this.interactionService.showLoader(true);
      this.getUserRepos();
      this.activatedRoute.paramMap.subscribe((params: any) => {
        // get project details
        this.projectService.findProjectById(params.get('projectId'))
          .subscribe((project) => {
            this.project = project;
            this.canEdit = this.loggedInUser.isSiteAdmin || this.project.admins && this.project.admins.indexOf(this.loggedInUser._id) > -1;
            this.interactionService.showLoader(false);
          }, (err) => {
            this.errorHandlerService.handleError('Error getting project', err);
            this.interactionService.showLoader(false);
          });
      });
    }
  }

  /** Get list of user repositories */
  getUserRepos() {

    if (this.loggedInUser.github && this.loggedInUser.github.token) {
      this.githubService.getRepos()
        .subscribe((repos) => {
          this.repos = repos;
        }, (err) => {
          this.errorHandlerService.handleError('Error getting GitHub Repositories', err);
        });
    } else {

    }
  }

  /** Update project */
  updateProject() {
    if (this.inProgress) {
      return;
    }

    if (this.editProjectForm.invalid) {
      // touch controls to highlight validation
      this.editProjectForm.controls.name.markAsTouched({ onlySelf: true });
      return;
    }

    this.inProgress = true;

    this.interactionService.showLoader(true);
    this.projectService.updateProject(this.project._id, this.project)
      .subscribe((createdProject) => {
        this.inProgress = false;
        this.interactionService.showLoader(false);
        this.interactionService.showAlert('Project updated successfully', 'success', true);
      }, (err) => {
        console.error('Error updating project', err);
        this.inProgress = false;
        this.interactionService.showLoader(false);
        this.errorHandlerService.handleError('Error updating project', err);
      });

  }

  /** Delete Project */
  deleteProject() {
    if (this.inProgress) {
      return;
    }

    this.interactionService.showLoader(true);
    this.projectService.deleteProject(this.project._id)
      .subscribe((createdProject) => {
        this.inProgress = false;
        this.interactionService.showLoader(false);
        this.interactionService.showAlert('Project deleted successfully', 'success', true);
        this.router.navigate(['/projects']);
      }, (err) => {
        this.inProgress = false;
        this.interactionService.showLoader(false);
        this.errorHandlerService.handleError('Error deleting project', err);
      });

  }

}
