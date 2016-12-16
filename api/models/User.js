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
		year: {
			type: 'string',
			required: true
		},
		section: {
			type: 'string',
			required: true
		},
		building: {
			type: 'string',
			required: true
		},
		email: {
			type: 'email'
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
		}
		
	},
	
	preRegister: function (inputs, cb) {
		//TODO: preregister and then register user
		User.create({
				name: inputs.name,
				surname: inputs.surname,
				year: inputs.year,
				section: inputs.section,
				building: inputs.building
			})
			.exec(cb);
	},
	
	signUp: function (inputs, cb) {
		User.update( {
			name: inputs.name,
			surname: inputs.surname,
			year: inputs.year,
			section: inputs.section,
			building: inputs.building
		}, {email: inputs.email, password: inputs.password}).exec(cb);
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
        Course.find().populate("attendees").populate("hosts").exec(function (err, courses){
            cb(err, courses.filter(function(course){
                return _.contains(course.hosts.map(function (user) {
                    return user.id;
                }), userId)
            }))
        })
	},
	
	getJoinedCourses: function (userId, cb) {
        Course.find().populate("attendees").populate("hosts").exec(function (err, courses){
            cb(err, courses.filter(function(course){
                return _.contains(course.attendees.map(function (user) {
                    return user.id;
                }), userId)
            }))
        })
	},
	
	getCoursesToJoin: function(userId, cb){
		Course.find().populate("attendees").populate("hosts").exec(function (err, courses){
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

