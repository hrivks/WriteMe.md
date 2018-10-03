import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ProjectService } from '../../../services/project.service.client';
import { InteractionsService } from '../../../services/interactions.service.client';
import { ErrorHandlerService } from '../../../services/error-handler.service.client';
import { AuthService } from '../../../services/auth.service.client';
import { User, Markdown, Project } from '../../../model/model';
import { MarkdownService } from '../../../services/markdown.service.client';

@Component({
  selector: 'app-new-project',
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.css']
})
export class NewProjectComponent implements OnInit {

  // properties
  @ViewChild('newProjectForm') newProjectForm: NgForm;
  private name: string;
  private description: string;
  private markdownFileName = 'README.md';
  private members: string[];
  private admins: string[];
  private loggedInUser: User;

  private inProgress: boolean;

  constructor(private router: Router,
    private projectService: ProjectService,
    private markdownService: MarkdownService,
    private interactionService: InteractionsService,
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService) { }

  ngOnInit() {
    this.loggedInUser = this.authService.getLoggedInUser();
    if (!this.loggedInUser) {
      this.interactionService.showAlert('You must be logged in to view this page');
    }
  }

  /** Create project */
  createProject() {
    if (this.inProgress) {
      return;
    }

    if (this.newProjectForm.invalid) {
      // touch controls to highlight validation
      this.newProjectForm.controls.name.markAsTouched({ onlySelf: true });
      return;
    }

    const markdown: Markdown = {
      content: ''
    };

    this.markdownService.createMarkdown(markdown)
      .subscribe((createdMarkdown) => {

        const project: Project = {
          name: this.name,
          fileName: this.markdownFileName,
          members: this.members ? this.members : [],
          admins: this.admins ? this.admins : [],
          markdown: createdMarkdown._id
        };

        this.interactionService.showLoader(true);
        this.projectService.createProject(project)
          .subscribe((createdProject) => {
            this.interactionService.showLoader(false);
            this.router.navigate(['/projects']);
          }, (err) => {
            this.errorHandlerService.handleError('Error creating project', err);
          });

      }, (err) => {
        this.errorHandlerService.handleError('Error creating project', err);
      });

  }

}
