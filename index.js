const express = require('express');
const app = express();

const mongoose = require('mongoose');

const path = require('path');
const methodOverride = require('method-override')

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
app.use(methodOverride('_method'))
// ********************************************
// ROUTING

app.get('/', (req, res) => {
    res.render('landing');
});




// ********************************************
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})