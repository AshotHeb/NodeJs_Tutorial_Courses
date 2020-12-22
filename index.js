const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const keys = require('./keys');
const PORT = process.env.PORT || 5001;
const csrf = require('csurf');
const flash = require('connect-flash');
const path = require('path')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGO_URI
})

//middlewares
const variables = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const fileMiddleware = require('./middleware/file')

//handlebars options in create method
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),


})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(express.static(path.join(__dirname,'public')))
app.use('/images',express.static(path.join(__dirname,'images')))

//middleWares

app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: keys.SESSOION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf());
app.use(flash());

app.use(variables);
app.use(userMiddleware);

//routes
app.use('/auth', require('./routes/auth'))
app.use('/', require('./routes/home.js'))
app.use('/courses', require('./routes/courses.js'))
app.use('/addcourse', require('./routes/addcourse'))
app.use('/card', require('./routes/card'))
app.use('/orders', require('./routes/orders'))
app.use('/profile', require('./routes/profile'))
app.use(require('./middleware/error'))





async function start() {
    try {

        await mongoose.connect(keys.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false
        })

        app.listen(PORT, () => {
            console.log(`Server is running  on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}
start()


