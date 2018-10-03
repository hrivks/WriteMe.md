// Route: /api
const router = require('express').Router();
const passport = require('passport');

// Init DB
require('./models/db.server.js');

// initialize PassportJs Auth
require('./auth.js');

//#region: api route definitions

// User route: /api/user
router.use('/user', require('./services/user.service.server.js').router);

// Markdown route: /api/markdown
router.use('/markdown', require('./services/markdown.service.server.js').router);

// Project route: /api/project
router.use('/project', require('./services/project.service.server.js').router);

// Auth route: /api/auth
router.use('/auth', require('./services/auth.service.server.js').router);

// Auth route: /api/social
router.use('/social', require('./services/social.service.server.js').router);


// Icon search route: /api/iconsearch
router.use('/iconsearch', require('./services/iconSearch.service.server.js').router);

//#endregion

module.exports = router;