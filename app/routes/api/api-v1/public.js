const express = require('express');
const router = express.Router();

// Controllers
const CourseController = require('app/http/controllers/api/v1/courseController');

router.get('/courses' , CourseController.courses);
router.get('/courses/:course' , CourseController.singleCourse);
router.get('/courses/:course/comments' , CourseController.commentForSingleCourse);

module.exports = router;