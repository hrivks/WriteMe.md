import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service.client';
import { InteractionsService } from './services/interactions.service.client';
import { AppConstants } from './app.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // properties
  private loggedInUserId: string;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private authService: AuthService,
    private interactionsService: InteractionsService) {

    // set title on route change
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // set page title
        title.setTitle(this.activatedRoute.snapshot.firstChild.data.title || 'WriteMe.md');
      }
    });

  }
}
