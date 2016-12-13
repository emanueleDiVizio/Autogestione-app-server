/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {
	
	attributes: {
		name: {
			type: 'string',
			required: true
		},
		surname: {
			type: 'string',
			required: true
		},
		class: {
			type: 'string',
			required: true
		},
		email: {
			type: 'email',
			required: true
		},
		password: {
			type: 'string',
			required: true
		},
		hostedCourses: {
			collection: 'course',
			via: 'hosts',
			dominant: true
		},
		coursesEnrolledIn: {
			collection: 'course',
			via: 'attendees',
			dominant: true
		}
		
	},
	
	signup: function (inputs, cb) {
		User.create({
				name: inputs.name,
				surname: inputs.surname,
				class: inputs.class,
				email: inputs.email,
				password: inputs.password,
			})
			.exec(cb);
	},
	
	attemptLogin: function (inputs, cb) {
		User.findOne({
				email: inputs.email,
				password: inputs.password
			})
			.exec(cb);
	},
	hostCourse: function (userId, courseId, cb) {
		User.findOne(userId).exec(function (err, user) {
			if (err) {
				
			}
			
			user.hostedCourses.add(courseId);
			user.save(cb)
		})
	},
	joinCourse: function (userId, courseId, cb) {
		User.findOne(userId).exec(function (err, user) {
			if (err) {
				cb(err, user)
			}
			
			user.coursesEnrolledIn.add(courseId);
			user.save(cb)
		})
	},
	
	getHostedCourses: function (userId, cb) {
		User.findOne(userId).populate('hostedCourses').exec(function (err, user) {
			if(err){
				cb(err, [])
			}
			
			cb(err, user.hostedCourses)
		})
	},
	
	getJoinedCourses: function (userId, cb) {
		User.findOne(userId).populate('coursesEnrolledIn').exec(function (err, user) {
			if(err){
				cb(err, [])
			}
			
			cb(err, user.coursesEnrolledIn)
		})
	},
	
	getCoursesToJoin: function(userId, cb){
		Course.find().populate("attendees").exec(function (err, courses){
			cb(err, courses.filter(function(course){
				return !_.contains(course.attendees.map(function (user) {
					return user.id;
				}), userId)
			}))
		})
	},
	
	getCoursesToHost: function(userId, cb){
		Course.find().populate("hosts").exec(function (err, courses){
			cb(err, courses.filter(function(course){
				return !_.contains(course.hosts.map(function (user) {
					return user.id;
				}), userId)
			}))
		})
	}
};

