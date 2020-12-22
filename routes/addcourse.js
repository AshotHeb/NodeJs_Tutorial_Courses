const { Router } = require('express')
const router = Router()
const Course = require('../model/Course');
const auth = require('../middleware/auth');
const { addCourseValidators } = require('../util/validators');
const { validationResult } = require('express-validator/check');


router.get('/', auth, (req, res) => {
    res.render('addcourse', {
        title: 'Add Course Page',
        isAddCourse: true
    })
})

router.post('/', auth, addCourseValidators, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('addcourse', {
                title: 'Add Course Page',
                isAddCourse: true,
                error: errors.array()[0].msg,
                data: {
                    title: req.body.title,
                    price: req.body.price,
                    preice: req.body.url
                }
            })
        }
        const { title, price, url } = req.body
        const course = new Course({
            title,
            price,
            url,
            userId: req.user
        })
        await course.save()
        res.redirect('courses');
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;