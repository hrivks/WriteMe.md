import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service.client';
import { User, Activity } from '../../../model/model';
import { SocialService } from '../../../services/social.service.client';
import { UserService } from '../../../services/user.service.client';
import { DatePipe } from '@angular/common';
import { InteractionsService } from '../../../services/interactions.service.client';
import { AppConstants } from '../../../app.constant';

@Component({
  selector: 'app-user-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {

  // properties
  private following: User[];
  private me: User;
  private feeds: Activity[];
  private feedError: string;
  private compHeight: number;
  private showFeeds: boolean;

  constructor(private authService: AuthService,
    private userService: UserService,
    private socialService: SocialService,
    private interactionService: InteractionsService) { }

  ngOnInit() {
    this.showFeeds = false;

    this.interactionService.registerCallback(AppConstants.EVENTS.showFeeds, () => {
      this.showFeeds = !this.showFeeds;
    });

    this.compHeight = window.innerHeight;
    this.me = this.authService.getLoggedInUser();
    this.following = [];
    if (this.me) {
      // get user details of following users
      if (this.me.following && this.me.following.length) {
        this.userService.findUsersByIds(this.me.following.join(','))
          .subscribe((users) => {
            this.following = users;
            this.getFeeds();
          }, (err) => {
            console.log('Error getting following user info', err);
            this.feedError = 'Error getting feeds';
          });
      }

    }
  }

  /** Get feeds of user */
  getFeeds() {
    this.feeds = [];
    this.socialService.getFeeds()
      .subscribe((feeds) => {
        this.feeds = feeds.map((i) => {
          const actor = this.following.find((x) => x._id === i.actor);
          if (actor) {
            i.actor = actor.name || actor.username;
          }
          return i;
        });
      }, (err) => {
        console.error('Error getting feeds', err);
        this.feedError = 'Error getting feeds';
      });
  }

  /** Follow user
   * @param user user to follow
   */
  follow(user: User) {
    this.socialService.follow(user._id)
      .subscribe((res) => {
        this.following.push(user);
        console.log('follow successful', res);
        this.getFeeds();
      }, (err) => {
        console.log('error following user', err);
      });
  }


  /** Unfollow user
  * @param user user to unfollow
  */
  unfollow(user: User) {
    this.socialService.unfollow(user._id)
      .subscribe((res) => {
        console.log('unfollow successful', res);
        this.getFeeds();
      }, (err) => {
        console.log('error unfollowing user', err);
      });
  }

  /** Hide feeds */
  hideFeeds() {
    this.interactionService.showFeeds();
  }

}
