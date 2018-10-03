import { environment } from '../environments/environment';

export class AppConstants {
    public static EVENTS = {
        showAlert: 'showAlert',
        hideAlert: 'hideAlert',
        showLoader: 'showLoader',
        loginChange: 'loginChange',
        showFeeds: 'showFeeds'
    };

    public static ENDPOINT = environment.endpoint;
    public static APP_ROOT_URL = 'http://writeme-md.herokuapp.com';
    public static ICONS_FOLDER_PATH = '/resources/glyphicons';
    public static FA_ICONS_FOLDER_PATH = '/resources/glyphicons/fa';
}
