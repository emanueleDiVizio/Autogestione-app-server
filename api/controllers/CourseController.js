/**
 * CourseController
 *
 * @description :: Server-side logic for managing courses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	/*createCourse: function (req, res) {
		
	}*/
	
	loadCourses: function(req, res){
		
		var courses = req.body;
		
		Course.loadCourses(courses).then(function(user){
			res.json({success: true, courses: user})
		}).catch(function(err){
			res.negotiate(err)
		})
		
}
};

