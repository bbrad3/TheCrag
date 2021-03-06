const axios = require('axios');
const mongoose = require('mongoose');
const cities = require('./cities');
const Route = require('../models/route');

mongoose.connect('mongodb://localhost:27017/TheCrag', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})
mongoose.connection.on('error', console.error.bind(console, 'connetion error:'));
mongoose.connection.once('open', () => {
    console.log('Database connected')
});


function getCityLocations() {
    const cityLocations = [];

    for(let city of cities){
        // const rand1000 = Math.floor(Math.random() * 1000);
        // const city = cities[rand1000]
        const location = {city: city.city, state: city.state, latitude: city.latitude, longitude: city.longitude};
        cityLocations.push(location);
        getRoutes(location);
    }
    console.log(`Cities found: ${cityLocations.length}`);
};

function getRoutes(location) {
    const { latitude, longitude } = location;
    
    const configure = { headers: { Accept: 'application/json' }};
    axios.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${latitude}&lon=${longitude}&maxDistance=50&minDiff=5.8&maxDiff=5.12&key=200105277-8f004ddc86c6a5ed347e2dbb02394575`, configure)
        .then(res => {
            const routes = res.data.routes;
            buildRoutes(routes, location);
        })
        .catch(err => {
            console.log(err);
        });
    
};

const seedRoutes = [];

function buildRoutes(routes, location){
    const { city, state } = location;
    for(let route of routes){
        const newRoute = {
            title: route.name,
            type: route.type,
            rating: route.rating,
            location: {
                city: city,
                state: state,
                latitude: route.latitude,
                longitude: route.longitude
            },
            crag: route.location[route.location.length -1]
        }
        if(route.imgMedium){
            newRoute.img = route.imgMedium;
        } else {
            newRoute.img = '';
        }
        seedRoutes.push(newRoute);
        makeModel(newRoute);
    }
};

async function makeModel(newRoute){
    try {
        const route = new Route(newRoute);
        await route.save();
    } catch (error) {
        console.log(error);
    }
}

const seedDB = async () => {
    await Route.deleteMany({}); // Delete routes in db
    console.log('DB cleared')
    getCityLocations(); // Start SEED with new routes!
    console.log('Seeding DB...')
}

seedDB();