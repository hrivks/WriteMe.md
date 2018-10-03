import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { AppConstants } from '../app.constant';

@Injectable()
export class IconSearchService {
    // properties

    api = {
        'getIconFinderApiKey': this.getIconFinderApiKey,
        'search': this.search
    };

    endpoint = {
        'getApiKey': AppConstants.ENDPOINT.baseUrl + '/iconsearch/iconfinder/ApiKey',
        'search': 'https://api.iconfinder.com/v3/icons/search?query={query}&size_minimum=128&premium=0&count=30&vector=0' +
            '&grant_type=jwt_bearer&client_id={client_id}&client_secret={client_secret}'
    };

    private iconFinderApiKey = {
        clientId: '',
        clientSecret: ''
    };

    constructor(private http: HttpClient) { }

    getIconFinderApiKey(): Observable<{ clientId: string, clientSecret: string }> {
        const obs = new Observable<any>((observer) => {
            // check if api key is already available
            if (this.iconFinderApiKey.clientId && this.iconFinderApiKey.clientSecret) {
                observer.next(this.iconFinderApiKey);
                observer.complete();
            } else {
                // api key is not locally available. get from server
                this.http.get(this.endpoint.getApiKey)
                    .subscribe(
                    (data: any) => {
                        if (data.clientId && data.clientSecret) {
                            this.iconFinderApiKey = data;
                            observer.next(this.iconFinderApiKey);
                            observer.complete();
                        } else {
                            const err = Error('Unable to retrieve icon search API key. Contact Adminstrator if problem persists');
                            // this.errorHanderService.handleError('Flickr Api key is required', err);
                            observer.error(err);
                        }
                    },
                    (err) => {
                        // this.errorHanderService.handleError('Oops! Error getting Flickr API key from server', err);
                        observer.error(err);
                    }
                    );
            }
        });

        return obs;
    }

    search(keyword: string) {
        const obs = new Observable<any>((observer) => {
            if (keyword) {
                this.getIconFinderApiKey().subscribe(
                    (apiKey) => {
                        const url = this.endpoint.search
                            .replace('{query}', keyword)
                            .replace('{client_id}', apiKey.clientId)
                            .replace('{client_secret}', apiKey.clientSecret);

                        this.http.get(url).subscribe(
                            (data: any) => {
                                const result = {
                                    count: 0,
                                    icons: []
                                };
                                result.count = data.total_count;
                                if (data.icons) {
                                    data.icons.forEach(i => {

                                        const latestSizeIcon = i.raster_sizes[i.raster_sizes.length - 1];
                                        if (latestSizeIcon && latestSizeIcon.formats[0].preview_url) {
                                            const availableSizes = i.raster_sizes.map((s) => (
                                                {
                                                    size: s.size,
                                                    url: s.formats[0].preview_url
                                                }));
                                            result.icons.push({ url: latestSizeIcon.formats[0].preview_url, sizes: availableSizes });
                                        }

                                    });
                                }
                                observer.next(result);
                                observer.complete();

                            },
                            (err) => {
                                observer.error(err);
                            }
                        );
                    },
                    (err) => {
                        observer.error(err);
                    }
                );

            } else {
                observer.error('Keyword cannot be empty.');
            }

        });

        return obs;
    }

}
