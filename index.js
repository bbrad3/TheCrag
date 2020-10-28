const express = require('express');
const app = express();

const mongoose = require('mongoose');

const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const { routeSchema } = require('./utilities/validationSchemas');

const Route = require('./models/route');
const AppError = require('./utilities/AppError');
const catchAsync = require('./utilities/catchAsync');
const { ratings, types } = require('./utilities/routeValues');

mongoose.connect('mongodb://localhost:27017/TheCrag', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})
mongoose.connection.on('error', console.error.bind(console, 'connetion error:'));
mongoose.connection.once('open', () => {
    console.log('Database connected')
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// ********************************************
// ROUTING

const validateRoute = (req, res, next) => {
    const { error } = routeSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else{
        next();
    }
}

app.get('/', catchAsync(async (req, res) => {
    const routes = await Route.find({});
    // res.send(routes)
    res.render('landing', { routes });

}));

app.get('/routes', catchAsync(async (req, res) => {
    const routes = await Route.find({});
    res.render('routes/index', { routes });
}));

app.get('/routes/new', (req, res) => {
    res.render('routes/new', { types, ratings });
});

app.post('/routes', validateRoute, catchAsync(async (req, res) => {
    const newRoute = new Route(req.body.route);
    await newRoute.save();
    res.redirect(`/routes/${newRoute._id}`);
}));

app.get('/routes/:id', catchAsync(async (req, res) => {
    const route = await Route.findById(req.params.id)
    res.render('routes/show', { route });
}));

app.get('/routes/:id/edit', catchAsync(async (req, res) => {
    const route = await Route.findById(req.params.id)
    res.render('routes/edit', { route, ratings, types });
}));

app.put('/routes/:id', validateRoute, catchAsync(async (req, res) => {
    const { id } = req.params;
    const route = await Route.findByIdAndUpdate(id, {...req.body.route});
    res.redirect(`/routes/${route._id}`);
}));

app.delete('/routes/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Route.findByIdAndDelete(id);
    res.redirect('/routes');
}));

app.all('*', (req, res, next) => {
    next(new AppError('PAGE NOT FOUND', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong.';
    res.status(statusCode).render('error', { err });
});

// ********************************************
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})