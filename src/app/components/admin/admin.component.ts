import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service.client';
import { ProjectService } from '../../services/project.service.client';
import { Project, User, Markdown } from '../../model/model';
import { InteractionsService } from '../../services/interactions.service.client';
import { ErrorHandlerService } from '../../services/error-handler.service.client';
import { UserService } from '../../services/user.service.client';
import { MarkdownService } from '../../services/markdown.service.client';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  // properties
  private isSiteAdmin: boolean;
  private projects: Project[];
  private users: User[];
  private me: User;
  private newProjectName: string;
  private newUserName: string;
  private newUserPassword: string;
  private newlyCreatedProject: Project;
  private newlyCreatedUser: User;

  constructor(private authService: AuthService,
    private projectService: ProjectService,
    private userService: UserService,
    private markdownService: MarkdownService,
    private interactionService: InteractionsService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router) { }

  ngOnInit() {
    this.me = this.authService.getLoggedInUser();
    if (this.me.isSiteAdmin) {
      this.isSiteAdmin = true;

      this.projectService.getAllProjects()
        .subscribe((projects) => {
          this.projects = projects;
        }, (err) => {
          this.errorHandlerService.handleError('Error getting list of all projects', err);
        });

      this.userService.getAllUsers()
        .subscribe((users) => {
          this.users = users.filter((i) => i._id !== this.me._id);
        }, (err) => {
          this.errorHandlerService.handleError('Error getting list of all users', err);
        });

    } else {
      this.interactionService.showAlert('You do not have access to view this page');
    }
  }


  /** Create a new project */
  createProject() {
    if (!this.newProjectName) {
      this.interactionService.showAlert('Project name cannot be empty', 'danger', true);
      return;
    }

    const newMarkdown: Markdown = {
      content: ''
    };
    this.interactionService.showLoader(true);
    this.markdownService.createMarkdown(newMarkdown)
      .subscribe((createdMarkdown) => {
        // create project and associate with created markdown
        const project: Project = {
          name: this.newProjectName,
          fileName: 'README.md',
          markdown: createdMarkdown._id
        };
        this.projectService.createProject(project)
          .subscribe((createdProject) => {
            this.newProjectName = '';
            this.projects.push(createdProject);
            this.newlyCreatedProject = createdProject;
            this.interactionService.showLoader(false);
            this.interactionService.showAlert('Project created successfully', 'success', true);
          }, (err) => {
            this.interactionService.showLoader(false);
            this.errorHandlerService.handleError('Error creating project', err);
          });

      }, (err) => {
        this.interactionService.showLoader(false);
        this.errorHandlerService.handleError('Error creating project markdown', err);
      });
  }

  /**
   * Delete project
   * @param project projec to delete
   */
  deleteProject(project: Project) {
    this.interactionService.showLoader(true);
    this.projectService.deleteProject(project._id)
      .subscribe((deletedProject) => {
        this.projects.splice(this.projects.indexOf(project), 1);
        this.interactionService.showLoader(false);
        this.interactionService.showAlert('Project deleted successfully', 'success');
      }, (err) => {
        this.interactionService.showLoader(false);
        this.errorHandlerService.handleError('Error deleting project', err);
      });
  }

  /** Create new user */
  createUser() {
    if (!this.newUserName || !this.newUserPassword) {
      this.interactionService.showAlert('Username or password cannot be empty', 'danger', true);
      return;
    }

    if (this.users.find((i) => i.username === this.newUserName)) {
      this.interactionService.showAlert('Username already exists', 'danger', true);
      return;
    }

    this.interactionService.showLoader(true);
    this.userService.createUser(this.newUserName, this.newUserPassword)
      .subscribe((createdUser) => {
        this.newUserName = '';
        this.newUserPassword = '';
        this.users.push(createdUser);
        this.newlyCreatedUser = createdUser;
        this.interactionService.showLoader(false);
        this.interactionService.showAlert('User created successfully', 'success', true);
      }, (err) => {
        this.interactionService.showLoader(false);
        this.errorHandlerService.handleError('Error creating new user', err);
      });
  }


  /** Delete user
   * @param user user to delete
  */
  deleteUser(user: User) {
    this.userService.deleteUser(user._id)
      .subscribe((deleted) => {
        this.users.splice(this.users.indexOf(user), 1);
        this.interactionService.showAlert('User deleted successfully', 'success', true);
      }, (err) => {
        this.errorHandlerService.handleError('Error deleting user', err);
      });
  }


  /** Toggle user's site admin status
    * @param user user to be set/unset as site admin
  */
  makeUserAdmin(user) {
    user.isSiteAdmin = user.isSiteAdmin ? false : true;
    this.interactionService.showLoader(true);
    this.userService.updateUser(user._id, user)
      .subscribe((updatedUser) => {
        user = updatedUser;
        this.interactionService.showLoader(false);
        this.interactionService.showAlert('User updated successfully', 'success', true);
      }, (err) => {
        this.interactionService.showLoader(false);
        this.errorHandlerService.handleError('Error updating User', err);
      });
  }

}
