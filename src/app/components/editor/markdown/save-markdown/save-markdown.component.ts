import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service.client';
import { InteractionsService } from '../../../../services/interactions.service.client';
import { AppConstants } from '../../../../app.constant';
import { Markdown, Project, User } from '../../../../model/model';
import { MarkdownService } from '../../../../services/markdown.service.client';
import { ErrorHandlerService } from '../../../../services/error-handler.service.client';
import { ProjectService } from '../../../../services/project.service.client';


@Component({
  selector: 'app-save-markdown',
  templateUrl: './save-markdown.component.html',
  styleUrls: ['./save-markdown.component.css']
})
export class SaveMarkdownComponent implements OnInit {

  // properties
  @Input() markdown: Markdown;
  @Input() project: Project;
  @Output() onComplete: EventEmitter<Markdown> = new EventEmitter<Markdown>();

  // markdown properties
  private projectName: string;
  private fileName: string;
  private loggedInUser: User;
  @ViewChild('saveForm') saveForm: NgForm;
  private saveInProgres: boolean;

  constructor(private authService: AuthService,
    private markdownService: MarkdownService,
    private projectService: ProjectService,
    private interactionService: InteractionsService,
    private errorHanderService: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loggedInUser = this.authService.getLoggedInUser();
    if (!this.markdown) {
      this.markdown = new Markdown();
    }
    this.fileName = this.project && this.project.fileName ? this.project.fileName : 'README.md';

    // register for login change
    this.interactionService.registerCallback(AppConstants.EVENTS.loginChange, (user) => {
      this.loggedInUser = this.authService.getLoggedInUser();
    });

  }

  /** Save markdown */
  saveMarkdown() {

    if (this.saveInProgres) {
      return;
    }

    if (this.saveForm.invalid) {
      // touch controls to highlight validation
      if (!this.project) {
        this.saveForm.controls.projectName.markAsTouched({ onlySelf: true });
      }
      this.saveForm.controls.fileName.markAsTouched({ onlySelf: true });
      this.saveForm.controls.commitMessage.markAsTouched({ onlySelf: true });
      return;
    }

    this.saveInProgres = true;

    if (this.markdown._id) {
      this.markdownService.updateMarkdown(this.markdown._id, this.markdown)
        .subscribe((updatedMarkdown) => {
          this.saveInProgres = false;
          this.onComplete.emit(updatedMarkdown);
        }, (err) => {
          this.errorHanderService.handleError('Error saving markdown', err);
        });
    } else {
      // create new markdown
      this.markdownService.createMarkdown(this.markdown)
        .subscribe((createdMarkdown) => {
          // create project and associate with created markdown
          const project: Project = {
            name: this.projectName,
            fileName: this.fileName,
            markdown: createdMarkdown._id
          };
          this.projectService.createProject(project)
            .subscribe((createdProject) => {
              this.router.navigate(['/project', createdProject._id, 'editor', createdMarkdown._id]);
            }, (err) => {
              this.errorHanderService.handleError('Error saving markdown', err);
            });

          this.saveInProgres = false;
          this.onComplete.emit(createdMarkdown);
        }, (err) => {
          this.errorHanderService.handleError('Error saving markdown', err);
        });
    }

  }

}
