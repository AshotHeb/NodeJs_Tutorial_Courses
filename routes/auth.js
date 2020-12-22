const { Router } = require('express');
const router = Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
// const mailer = require('../nodemailer/index');
const { validationResult } = require('express-validator/check');
const { registerValidators, loginValidators } = require('../util/validators');



router.get('/login', (req, res) => {
    res.render('auth/login', {
        isAuthPage: true,
        title: 'Auth',
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})


router.post('/register', registerValidators, async (req, res) => {
    const { name, email, password } = req.body;
    const candidate = await User.findOne({ email });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('registerError', errors.array()[0].msg);
        return res.status(422).redirect('/auth/login#registration');
    }

    if (candidate) {
        req.flash('registerError', 'Նման էլ-հասցեով գրանցում արդեն կա');
        res.redirect('/auth/login#register');
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const user = new User({
        name,
        email,
        password: hashPassword,
        card: { items: [] }
    })
    user.save();
    //send mail
    // const message = {
    //     to:email,
    //     subject:'Test Email',
    //     text:'Some Text'
    // }
    // mailer(message)

    res.redirect('/auth/login#login')
})

router.post('/login', loginValidators, async (req, res) => {
    try {
        const { email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('loginError' , errors.array()[0].msg)
            return res.status(422).redirect("/auth/login#login");
        }

        const candidate = await User.findOne({ email });
        const asSome = candidate ? await bcrypt.compare(password, candidate.password) : null;

        if (candidate && asSome) {
            req.session.user = candidate;
            req.session.isAuthicated = true;
            req.session.save((err) => {
                if (err) console.log(err);
            });
            res.redirect('/')
        } else {
            req.flash('loginError', 'Սխալ գաղտաբառ կամ սխալ էլ-հասցե');
            res.redirect('/auth/login#login');
        }
    } catch (err) {
        console.log(err);
    }


})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
})

module.exports = router;