const { Router } = require('express');
const router = Router();
//models
const Course = require('../model/Course')
const auth = require('../middleware/auth');
const { addCourseValidators } = require('../util/validators');
const { validationResult } = require('express-validator');

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
        res.render('courses', {
            title: 'Courses Page',
            isCourses: true,
            courses: courses
        })
    } catch (err) {
        console.log(err);
    }
})
//get One Course By Id
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        res.render('course', {
            layout: 'empty',
            title: 'course',
            isCourse: true,
            course: course
        })
    } catch (err) {
        console.log(err);
    }
})

//edit course
router.get('/:id/edit', auth, async (req, res) => {
    try {
        if (!req.query.allow) {
            res.redirect('/');
        } else {
            const course = await Course.findById(req.params.id)
            res.render('course-edit', {
                title: 'course edit',
                course: course
            })
        }
    } catch (err) {
        console.log(err);
    }
})

router.post('/edit', auth, addCourseValidators, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).redirect(`${req.body.id}/edit?allow=true`)
        }

        const { id } = req.body
        delete req.body.id
        await Course.findByIdAndUpdate(id, req.body)
        res.redirect('/courses')
    } catch (err) {
        console.log(err);
    }
})

router.post('/remove', auth, async (req, res) => {

    try {
        await Course.deleteOne({
            _id: req.body.id
        })
        res.redirect('/courses');
    } catch (err) {
        console.log(err);
    }

})

module.exports = router;