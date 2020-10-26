const express = require('express');
const app = express();

const mongoose = require('mongoose');

const path = require('path');
const methodOverride = require('method-override')

const Route = require('./models/route');

mongoose.connect('mongodb://localhost:27017/TheCrag', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})
mongoose.connection.on('error', console.error.bind(console, 'connetion error:'));
mongoose.connection.once('open', () => {
    console.log('Database connected')
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// ********************************************
// ROUTING

app.get('/', (req, res) => {
    const routes = Route.find({})
        .catch(err => console.log('CANNOT FIND ROUTES:', err));
    res.render('landing', { routes });

});

app.get('/routes', async (req, res) => {
    const routes = await Route.find({});
    res.render('routes/index', { routes });
});

app.get('/routes/new', (req, res) => {
    res.render('routes/new');
});

app.post('/routes', async (req, res) => {
    const newRoute = new Route(req.body.route);
    await newRoute.save();
    res.redirect(`/routes/${newRoute._id}`);
});

app.get('/routes/:id', async (req, res) => {
    const route = await Route.findById(req.params.id)
    res.render('routes/show', { route });
});

app.get('/routes/:id/edit', async (req, res) => {
    const route = await Route.findById(req.params.id)
    res.render('routes/edit', { route });
});

app.put('/routes/:id', async (req, res) => {
    const { id } = req.params;
    const route = await Route.findByIdAndUpdate(id, {...req.body.route});
    res.redirect(`/routes/${route._id}`);
});

app.delete('/routes/:id', async (req, res) => {
    const { id } = req.params;
    await Route.findByIdAndDelete(id);
    res.redirect('/routes');
});


// ********************************************
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})