const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    style: {
        type: [String],
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    crag: {
        type: Schema.Types.ObjectId,
        ref: 'Crag'
    },
    img: [String]
});

const Route = mongoose.model('Route', RouteSchema);

module.exports = Route;