import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service.client';
import { InteractionsService } from '../../../../services/interactions.service.client';
import { AppConstants } from '../../../../app.constant';
import { GitHubService } from '../../../../services/github.service.client';
import { ErrorHandlerService } from '../../../../services/error-handler.service.client';

@Component({
  selector: 'app-commit-to-git',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.css']
})
export class CommitComponent implements OnInit {

  // properties
  @Input() fileContent: string;
  @Output() onComplete: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() repoName: string;
  private gitToken: string;
  private repos: string[];
  private commitInProgres: boolean;

  // form fields
  private repo: string;
  private branch: string;
  private fileName: string;
  private commitMessage: string;
  @ViewChild('commitForm') commitForm: NgForm;

  constructor(private authService: AuthService,
    private interactionService: InteractionsService,
    private githubService: GitHubService,
    private errorHandlerService: ErrorHandlerService) {
  }

  ngOnInit() {
    const loggedInUser = this.authService.getLoggedInUser();
    this.fileName = 'README.md';
    this.repo = this.repoName;
    this.branch = 'master';
    if (loggedInUser && loggedInUser.github && loggedInUser.github.token) {
      this.gitToken = loggedInUser.github.token;
      this.getUserRepos();
    }

    // register for login change
    this.interactionService.registerCallback(AppConstants.EVENTS.loginChange, (user) => {
      if (user && user.github && user.github.token) {
        this.gitToken = loggedInUser.github.token;
        this.getUserRepos();
      } else {
        this.gitToken = null;
      }
    });
  }

  /** Get list of user repositories */
  getUserRepos() {
    this.githubService.getRepos()
      .subscribe((repos) => {
        this.repos = repos;
      }, (err) => {
        this.errorHandlerService.handleError('Error getting GitHub Repositories', err);
      });
  }

  /** Commit to Git */
  commit() {

    if (this.commitForm.invalid) {
      // touch controls to highlight validation
      this.commitForm.controls.repo.markAsTouched({ onlySelf: true });
      this.commitForm.controls.branch.markAsTouched({ onlySelf: true });
      this.commitForm.controls.fileName.markAsTouched({ onlySelf: true });
      this.commitForm.controls.commitMessage.markAsTouched({ onlySelf: true });
      return;
    }

    if (this.commitInProgres) {
      return;
    }

    this.commitInProgres = true;
    this.githubService.commit(this.repo, this.branch, this.fileContent, this.fileName, this.commitMessage)
      .subscribe((success) => {
        this.onComplete.emit(success);
        this.commitInProgres = false;
      }, (err) => {
        this.errorHandlerService.handleError('Error committing to Git', err);
        this.commitInProgres = false;
      });
  }

  loginToGit() {
    localStorage.setItem('openModalOnLoad', 'commitToGit');
    this.authService.loginToGit();
  }

}
