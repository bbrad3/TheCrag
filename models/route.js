const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
    title: String,
    type: String,
    rating: String,
    crag: String,
    location: {
        city: String,
        state: String,
        latitude: String,
        longitude: String
    },
    img: String
});

const Route = mongoose.model('Route', RouteSchema);

module.exports = Route;