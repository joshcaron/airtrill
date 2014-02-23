// Server setup
var root = __dirname,
	express = require("express"),
	path = require("path"),
	app = express();

app.configure(function() {
	app.use(express.cookieParser("secret"));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var router = require("./router.js");
router.setup(app);

// Launch the server
app.listen(8888);
