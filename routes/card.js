const { Router } = require('express');
const router = Router();
//models
const Course = require('../model/Course');
const auth = require('../middleware/auth');
//helpers
const mapCourses = (card) => {
    return card.map(c => ({
        ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count
    }))
}
const totalPrice = (card) => {
    return card.reduce((sum, course) => {
        return sum += course.count * course.courseId.price
    }, 0)
}

router.get('/',auth, async (req, res) => {
 

    try {
        const user = await req.user
            .populate('card.items.courseId')
            .execPopulate()

        res.render('card', {
            isCard: true,
            title: 'card',
            courses: mapCourses(user.card.items),
            price: totalPrice(user.card.items)
        })
    } catch (err) {
        console.log(err);
    }

})

router.post('/add', auth,async (req, res) => {
    const course = await Course.findById(req.body.id);
    await  req.user.addToCard(course);
    res.redirect('/card');
})

router.delete('/remove/:id', auth,async (req, res) => {
    await  req.user.removeFromCard(req.params.id);
    const user = await  req.user
        .populate('card.items.courseId')
        .execPopulate()


    res.status(200).json({
        courses: mapCourses(user.card.items),
        price: totalPrice(user.card.items)
    })
})

module.exports = router;






