import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { User, Activity } from '../model/model';
import { AppConstants } from '../app.constant';

@Injectable()
export class SocialService {

    endpoint = {
        'getFeeds': AppConstants.ENDPOINT.baseUrl + '/social/feeds',
        'follow': AppConstants.ENDPOINT.baseUrl + '/social/follow',
        'unfollow': AppConstants.ENDPOINT.baseUrl + '/social/unfollow'
    };

    constructor(private http: HttpClient) { }

    /** Get feeds for current loggedIn user
     * @returns Observable that resolves to the list of feeds for this user
     */
    getFeeds(): Observable<Activity[]> {
        const url = this.endpoint.getFeeds;
        return this.http.get<Activity[]>(url, { withCredentials: true });
    }

    /**
     * follow specified user
     * @param userId user to follow
     */
    follow(userId: string): Observable<any> {
        const url = this.endpoint.follow;
        return this.http.put(url, { follow: userId }, { withCredentials: true });
    }

    /**
     * follow specified user
     * @param userId user to follow
     */
    unfollow(userId: string): Observable<any> {
        const url = this.endpoint.unfollow;
        return this.http.put(url, { unfollow: userId }, { withCredentials: true });
    }
}
