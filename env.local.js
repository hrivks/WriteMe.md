/** DO NOT COMMIT THIS FILE : has sensitive api keys
* environment variables for local development 
* ------------------------------------------------------------------------------------------
* Change this file locally and use the following command to stop git from tracking changes
* git update-index --assume-unchanged server.local.js
* ------------------------------------------------------------------------------------------
* */

// cookie session enc key
process.env.SESSION_SECRET = 'ABCDED';
// mongo db connection string
process.env.MONGODB_URI = 'mongodb://localhost:27017/writeme';
// Icon finder app info
process.env.ICONFINDER_API_CLIENT_ID = '';
process.env.ICONFINDER_API_CLIENT_SECRET = '';
// Github app info
process.env.GITHUB_CLIENT_ID = '';
process.env.GITHUB_CLIENT_SECRET = '';
process.env.GITHUB_CALLBACK_URL = 'http://localhost:3100/api/auth/github/callback';
