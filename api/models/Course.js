/**
 * Course.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Promise = require("bluebird");

module.exports = {
	
	attributes: {
		name: {
			type: 'string',
			required: true
		},
		description: {
			type: 'string',
			required: true
		},
		startHour: {
			type: 'string',
			required: true
		},
		endHour: {
			type: 'string',
			required: true
		},
		date: {
			type: 'string',
			required: true
		},
		room: {
			type: 'string',
			required: true
		},
		building: {
			type: 'string',
			required: true
		},
		hosts: {
			collection: 'user',
			via: 'hostedCourses'
		},
		attendees: {
			collection: 'user',
			via: 'coursesEnrolledIn'
		},
		confirmedAttendees: {
			collection: 'user',
			via: 'confirmedCourses'
		}
	},
	
	
	loadCourses: function (courses) {
		return Promise.map(courses, function (course) {
				return {
					course: {
						name: course.name,
						description: course.description,
						startHour: course.startHour,
						endHour: course.endHour,
						date: course.date,
						room: course.room,
						building: course.building
					},
					host: course.host
				}
			})
			.reduce(function (total, course) {
				total.courses.push(course.course);
				total.hosts.push(course.host);
				return total;
			}, {courses: [], hosts: []})
			.then(function (courseObj) {
				return Course.create(courseObj.courses).then(function (courses) {
					return Promise.map(courses, function (course) {
						return course.id
					}).then(function (ids) {
						return _.zipWith(ids, courseObj.hosts, function (courseId, hostId) {
							return {userName: hostId, courseId: courseId}
						})
					}).then(function (obj) {
						return Promise.each(obj, function (obj) {
							return User.hostCourseProm(obj.userName, obj.courseId)
						})
					})
				})
			})
	},
	
	
	confirmAttendee: function(userId, courseId, cb){
		Course.findOne(courseId).exec(function(err, course){
			if(err){
				cb(err, course)
			}
			
			course.confirmedAttendees.add(userId)
			
			course.save(cb)
		})
	},
	
	
	createCourse: function (inputs, cb) {
		Course.create().exec(cb);
	}
};

