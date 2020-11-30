const express = require('express');
const app = express();

const mongoose = require('mongoose');

const path = require('path');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');

const Route = require('./models/route');
const Crag = require('./models/crag');
const AppError = require('./utilities/AppError');
const catchAsync = require('./utilities/catchAsync');
const { ratings, styles, states } = require('./utilities/routeValues');
const { routeSchema, cragSchema } = require('./utilities/validationSchemas');

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
// -------------------------------------------------------------
// -------------------------ROUTING-----------------------------

const validateRoute = (req, res, next) => {
    const { error } = routeSchema.validate(req.body.route);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else{
        next();
    }
}
const validateCrag = (req, res, next) => {
    const { error } = cragSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else{
        next();
    }
}

app.get('/', catchAsync(async (req, res) => {
    const crags = await Crag.find({});
    res.render('landing', { crags });

}));

// DELETE THIS ROUTE and index.ejs view
app.get('/routes', catchAsync(async (req, res) => {
    const routes = await Route.find({});
    res.render('routes/index', { routes });
}));

// -------------------------------------------------------------
// ------------------------CRAGS ROUTES-------------------------

app.get('/crags', catchAsync(async (req, res) => {
    const crags = await Crag.find({});
    res.render('crags/index', { crags });
}));

app.get('/crags/new', (req, res) => {
    res.render('crags/new', { states });
});

app.post('/crags', validateCrag, catchAsync(async (req,res) => {
    const newCrag = new Crag(req.body.crag);
    await newCrag.save();
    res.redirect(`/crags/${newCrag._id}`);
}))

app.get('/crags/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const crag = await Crag.findById(id).populate('routes');
    const { routes } = crag;
    res.render('crags/show', { crag, routes });
}));

app.get('/crags/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const crag = await Crag.findById(id);
    res.render('crags/edit', { crag, states }); // MAKE EDIT VIEW
}));

app.put('/crags/:id', validateRoute, catchAsync(async (req, res) => {
    const { id } = req.params;
    const crag = await Crag.findByIdAndUpdate(id, {...req.body.crag});
    res.redirect(`/crags/${crag._id}`);
}));

app.delete('/crags/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Crag.findByIdAndDelete(id);
    res.redirect('/crags');
}));

// -------------------------------------------------------------
// -----------------------ROUTES ROUTES-------------------------

app.get('/crags/:id/routes/:id', catchAsync(async (req, res) => {
    const route = await Route.findById(req.params.id);
    const crag = await Crag.findById(route.crag);
    res.render('routes/show', { route, crag });
}));

app.get('/crags/:id/routes/new', catchAsync(async (req, res) => {
    const { id } = req.params;
    const crag = await Crag.findById(id);
    res.render('routes/new', { styles, ratings, crag });
}));

app.post('/crags/:id/routes', validateRoute, catchAsync(async (req, res) => {
    const { id } = req.params;
    const crag = await Crag.findById(id)
    const newRoute = new Route(req.body.route);
    console.log(crag);
    crag.routes.push(newRoute);
    newRoute.crag = crag;
    await newRoute.save();
    await crag.save();
    res.redirect(`/crags/${id}`);
}));

app.get('/crags/:id/routes/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const route = await Route.findById(id)
    res.render('routes/edit', { route, ratings, styles });
}));

app.put('/crags/:id/routes/:id', validateRoute, catchAsync(async (req, res) => {
    const { id } = req.params;
    const route = await Route.findByIdAndUpdate(id, {...req.body.route});
    res.redirect(`/crags/${route.crag}/routes/${id}`);
}));

app.delete('/crags/:id/routes/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const route = await Route.findByIdAndDelete(id);
    res.redirect(`/crags/${route.crag}`);
}));

// -------------------------------------------------------------

app.all('*', (req, res, next) => {
    next(new AppError('PAGE NOT FOUND', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong.';
    res.status(statusCode).render('error', { err });
});

// -------------------------------------------------------------
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})