const { Router } = require('express');
const router = Router();
const Order = require('../model/Order');
const auth = require('../middleware/auth');



router.get('/', auth,async (req, res) => {
    const orders = await Order.find({ 'user.userId': req.user._id })
        .populate('user.userId')



    res.render('orders', {
        isOrder: true,
        title: 'Orders Page',
        orders: orders.map(o => {
            return {
                ...o._doc,
                price: o.courses.reduce((sum, c) => {
                    return sum += c.course.price * c.count
                },0)
            }
        }),


    })
})

router.post('/', auth,async (req, res) => {
    try {
        const user = await req.user
            .populate('card.items.courseId')
            .execPopulate();

        const courses = user.card.items.map(c => ({
            course: { ...c.courseId._doc },
            count: c.count
        }))
        const order = new Order({
            courses,
            user: {
                name: user.name,
                userId: user
            }
        })
        await order.save();
        await req.user.clearCard()
        res.redirect('/orders');
    } catch (err) {
        console.log(err);
    }
})


module.exports = router;