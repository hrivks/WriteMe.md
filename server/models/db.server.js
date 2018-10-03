var mongoose = require("mongoose");

var connectionStr = process.env.MONGODB_URI;

// todo: env based con str
mongoose.connect(connectionStr, { useMongoClient: true });