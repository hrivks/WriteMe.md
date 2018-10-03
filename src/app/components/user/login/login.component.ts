import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../model/model';
import { UserService } from '../../../services/user.service.client';
import { AuthService } from '../../../services/auth.service.client';
import { InteractionsService } from '../../../services/interactions.service.client';
import { ErrorHandlerService } from '../../../services/error-handler.service.client';
import { ParamMap } from '@angular/router/src/shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // properties
  username: string;
  password: string;
  redirectTo: string;

  constructor(private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private interactionsService: InteractionsService,
    private errorHanderService: ErrorHandlerService) {
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      this.redirectTo = params.get('next');
    });
  }

  ngOnInit() {
  }

  /** Login User */
  login() {
    this.interactionsService.hideAlert();
    this.authService.login(this.username, this.password)
      .subscribe((usr) => {
        if (this.redirectTo) {
          this.router.navigateByUrl(this.redirectTo);
        } else {
          this.router.navigate(['/projects']);
        }
      }, (err) => {
        if (err.status === 401) {
          this.interactionsService.showAlert('Login failed. Please check username and password and try again');
        } else {
          this.errorHanderService.handleError('Login Failed', err);
        }
      });
  }

  /** Login through Github */
  loginToGit() {
    this.authService.loginToGit();
  }

}
