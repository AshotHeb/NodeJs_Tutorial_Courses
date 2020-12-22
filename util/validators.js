const { body } = require('express-validator/check');
const User = require('../model/User');

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Incorrect Email ,please write normal Email!')
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: value });
            if (user) {
                return Promise.reject('Such Email has been already Exist')
            } else {
                return true;
            }
        })
        .normalizeEmail(),
    body('password')
        .isLength({ max: 20, min: 6 })
        .withMessage('The Password must be max:20 ,min:6 length')
        .trim(),
    body('confirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('not true Confirm  of password!')
            } else {
                return true
            }
        })
        .trim(),
    body('name', ' Name must be max:20 , min:6 length')
        .isLength({ max: 20, min: 6 })
        .trim()


]

exports.loginValidators = [
    body('email', 'Incorrect Email address')
        .isEmail()
        .normalizeEmail(),
    body('password', 'PAssword length must be long 3!')
        .isLength({ min: 3 })
        .trim(),
]


exports.addCourseValidators = [
    body('title', 'Short Title ,must be 3 letters minimum')
        .isLength({ min: 3 })
        .trim(),
    body('price', 'This input must be only numbers')
        .isNumeric()
        .trim(),
    body('url', 'Wrong url address')
        .isURL()
        .trim()
]