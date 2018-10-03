import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service.client';
import { InteractionsService } from '../../../services/interactions.service.client';
import { ErrorHandlerService } from '../../../services/error-handler.service.client';
import { Project } from '../../../model/model';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service.client';

@Component({
  selector: 'app-list-project',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ListProjectComponent implements OnInit {

  // properties
  private projects: Project[];

  constructor(private projectService: ProjectService,
    private authService: AuthService,
    private interactionService: InteractionsService,
    private errorHandlerService: ErrorHandlerService,
    private route: Router) { }

  ngOnInit() {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.interactionService.showLoader(true);
      this.projectService.getMyProjects()
        .subscribe((projects) => {
          this.projects = projects;
          this.interactionService.showLoader(false);
        });
    } else {
      this.interactionService.showAlert('You must be logged in to view this page');
    }

  }

}
