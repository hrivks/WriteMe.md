import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constant';

@Injectable()
export class UtilService {

    // properties
    private readonly resizeEndpoint
        = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url={url}&container=focus&resize_w={w}&resize_h={h}';

    constructor() { }

    /**
     * Get resizable URL of image
     * @param url url of image
     * @param width width of the image
     * @param height height of the image
     */
    getResizedImgUrl(url: string, width: number, height: number) {
        if (!width && !height) {
            return url;
        } else {
            return this.resizeEndpoint
                .replace('{url}', url)
                .replace('{w}', Math.round(width).toString())
                .replace('{h}', Math.round(height).toString());
        }
    }

}
