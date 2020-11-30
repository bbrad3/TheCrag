
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CragSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    images: [String],
    routes: [{
        type: Schema.Types.ObjectId,
        ref: 'Route'
    }]
});

const Crag = mongoose.model('Crag', CragSchema);
module.exports = Crag;