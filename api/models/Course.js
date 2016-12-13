/**
 * Course.js
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
		hosts: {
			collection: 'user',
			via: 'hostedCourses'
		},
		attendees: {
			collection: 'user',
			via: 'coursesEnrolledIn'
		}
	},
	
	
	createCourse: function (inputs, cb) {
		Course.create({
			description: inputs.description,
			host: inputs.host,
			startHour: inputs.startHour,
			endHour: inputs.endTime,
			date: inputs.date,
			room: inputs.room,
			attendees: inputs.attendees
		}).exec(cb);
	}
};

