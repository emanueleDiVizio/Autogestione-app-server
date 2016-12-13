/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
	 * `UserController.login()`
	 */
	login: function (req, res) {
		
		// See `api/responses/login.js`
		return res.login({
			email: req.param('email'),
			password: req.param('password'),
			successRedirect: '/',
			invalidRedirect: '/login'
		});
	},
	
	
	/**
	 * `UserController.logout()`
	 */
	logout: function (req, res) {
		
		// "Forget" the user from the session.
		// Subsequent requests from this user agent will NOT have `req.session.me`.
		req.session.me = null;
		
		return res.json({success: true, message: 'Log out successful.'});
	},
	
	
	/**
	 * `UserController.signup()`
	 */
	signup: function (req, res) {
		
		// Attempt to signup a user using the provided parameters
		User.signup({
			name: req.param('name'),
			surname: req.param('surname'),
			class: req.param('class'),
			email: req.param('email'),
			password: req.param('password')
		}, function (err, user) {
			// res.negotiate() will determine if this is a validation error
			// or some kind of unexpected server error, then call `res.badRequest()`
			// or `res.serverError()` accordingly.
			if (err) return res.negotiate(err);
			
			// Go ahead and log this user in as well.
			// We do this by "remembering" the user in the session.
			// Subsequent requests from this user agent will have `req.session.me` set.
			req.session.me = user.id;
			
			return res.json({success: true, message: 'Signup Successful.', user: user});
			
		});
	},
	
	joinCourse: function (req, res) {
		User.joinCourse(req.session.me, req.param('courseId'), function (err, user) {
			if (err) return res.negotiate(err);
			
			return res.json({
				success: true,
				message: 'Student: ' + req.session.me +  " enrolled in course " + req.param('courseId')
			})
		})
	},
	
	hostCourse: function (req, res) {
		User.hostCourse(req.session.me, req.param('courseId'), function (err, user) {
			if (err) return res.negotiate(err);
			
			return res.json({
				success: true,
				message: 'Student: ' + req.session.me +  " is now hosting course " + req.param('courseId')
			})
		})
	},
	
	hostedCourses: function (req, res) {
		User.getHostedCourses(req.session.me, function(err, courses){
			if(err) return res.negotiate(err);
			
			return res.json({courses: courses})
		})
	},
	
	joinedCourses: function (req, res) {
		User.getJoinedCourses(req.session.me, function(err, courses){
			if(err) return res.negotiate(err);
			
			return res.json({courses: courses})
		})
	},
	
	availableCoursesToJoin: function (req, res) {
		User.getCoursesToJoin(req.session.me, function(err, courses){
			if(err) return res.negotiate(err);
			
			return res.json({courses: courses})
		})
	},
	availableCoursesToHost: function (req, res) {
		User.getCoursesToHost(req.session.me, function(err, courses){
			if(err) return res.negotiate(err);
			
			return res.json({courses: courses})
		})
	}
	
};

