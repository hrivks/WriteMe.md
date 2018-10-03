import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service.client';
import { UserService } from '../../../services/user.service.client';
import { InteractionsService } from '../../../services/interactions.service.client';
import { ErrorHandlerService } from '../../../services/error-handler.service.client';
import { User } from '../../../model/model';
import { ParamMap } from '@angular/router/src/shared';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  // properties
  private user: User;
  private password: string;
  private verifyPassword: string;
  private linkedToGit: boolean;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private interactionService: InteractionsService,
    private errorHandlerService: ErrorHandlerService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((param: ParamMap) => {
      if (param.get('userId')) {
        this.interactionService.showLoader(true);
        this.userService.findUserById(param.get('userId'))
          .subscribe((user) => {
            this.interactionService.showLoader(false);
            this.user = user;
            this.linkedToGit = this.user.github && this.user.github.id.length > 0;
          }, (err) => {
            this.interactionService.showLoader(false);
            this.errorHandlerService.handleError('Error getting user', err);
          });
      } else {
        this.user = this.authService.getLoggedInUser();
        this.linkedToGit = this.user.github && this.user.github.id.length > 0;
      }

    });
  }

  /** Save user info */
  save() {
    if (this.password && this.password !== this.verifyPassword) {
      return;
    } else {
      this.user.password = this.password;
    }

    this.userService.updateUser(this.user._id, this.user)
      .subscribe((updatedUser) => {
        this.user = updatedUser;
        this.linkedToGit = this.user.github && this.user.github.id.length > 0;
        const loggedInUser = this.authService.getLoggedInUser();
        if (loggedInUser._id === updatedUser._id) {
          this.authService.setLoggedInUser(updatedUser);
        }
        this.interactionService.showAlert('Profile updated successfully', 'success', true);
      }, (err) => {
        this.errorHandlerService.handleError('Error updating profile', err);
      });
  }

  /** Unlink Github with user */
  unlinkGit() {
    this.user.github = null;
    this.save();
  }

  /** Link with Github account */
  loginToGit() {
    this.authService.loginToGit();
  }

}
