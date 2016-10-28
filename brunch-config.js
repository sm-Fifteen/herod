module.exports = {
	paths: {
		public: "docs",
	},

	files: {
		javascripts: {
			joinTo: {
				"vendor.js": /^node_modules/,
				"herod.js": /^app/,
			},
		},
		stylesheets: {joinTo: "herod.css"},
	},

	modules: {
		autoRequire: {"herod.js": ["app"]},
	},
};
