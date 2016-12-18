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
		year: {
			type: 'string'
		},
		section: {
			type: 'string'
		},
		building: {
			type: 'string'
		},
		email: {
			type: 'string'
		},
		password: {
			type: 'string'
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
		},
		confirmedCourses: {
			collection: 'course',
			via: 'confirmedAttendees',
			dominant: true,
		}
		
	},
	
	preRegister: function (inputs, cb) {
		//TODO: preregister and then register user
		User.create({
				name: inputs.name
			})
			.exec(cb);
	},
	preRegister: function (inputs) {
		//TODO: preregister and then register user
		return User.create({
			name: inputs.name
		});
	},
	
	signUp: function (inputs, cb) {
		console.log(inputs)
		User.updateOrCreate({
			where: {
				name: inputs.name
			}
		}, {
			name: inputs.name,
			email: inputs.email, password: inputs.password,
			year: inputs.year,
			section: inputs.section,
			building: inputs.building
		}, cb);
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
	
	hostCourseProm: function (userName, courseId) {
		console.log(userName)
		return User.findOrCreate({name: userName}).then(function (user) {
			user.hostedCourses.add(courseId);
			return user.save();
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
		Course.find().populate("attendees").populate("hosts").populate("confirmedAttendees").exec(function (err, courses) {
			cb(err, courses.filter(function (course) {
				return _.contains(course.hosts.map(function (user) {
					return user.id;
				}), userId)
			}))
		})
	},
	
	getJoinedCourses: function (userId, cb) {
		Course.find().populate("attendees").populate("hosts").populate("confirmedAttendees").exec(function (err, courses) {
			cb(err, courses.filter(function (course) {
				return _.contains(course.attendees.map(function (user) {
					return user.id;
				}), userId)
			}))
		})
	},
	
	getCoursesToJoin: function (userId, cb) {
		User.findOne(userId).exec(function(err, user){
			Course.find({building: user.building}).populate("attendees").populate("hosts").populate("confirmedAttendees").exec(function (err, courses) {
				cb(err, courses.filter(function (course) {
					return !_.contains(course.attendees.map(function (user) {
							return user.id;
						}), userId) && !_.contains(course.attendees.map(function (user) {
							return user.id;
						}), userId)
				}))
			})
		})
	},
	
	getCoursesToHost: function (userId, cb) {
		Course.find().populate("hosts").exec(function (err, courses) {
			cb(err, courses.filter(function (course) {
				return !_.contains(course.hosts.map(function (user) {
					return user.id;
				}), userId)
			}))
		})
	}
};

