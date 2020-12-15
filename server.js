const express = require('express');
var cors = require('cors');
var db = require("./db");
var bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (request,response) => {
    response.send('Welcome to nearby places API');
}); 

app.get('/places', (request,response) => {
    db.getPlaces().then(x => response.json(x));
});

app.get('/reviews/:placeid', (request, response) => {
    let reqID = request.params.placeid;
    db.getReviews(reqID).then(x => response.json(x));
});

app.get('/search', (request, response) => {
    let searchTerm = request.query.searchTerm;
    let city = request.query.city;
    let state = request.query.state;
    db.search(searchTerm, city, state).then(x => response.json(x));
});

app.post('/place', (request, response) => {
    console.log(request.body);
    let name = request.body.name;
    let city = request.body.city;
    let state = request.body.state;
    let cat = request.body.cat;
    let description = request.body.description;
    db.addPlace(name, city, state, cat, description).then(x => response.json({message: "Place successfully added."}));
});

app.post('/review', (request, response) => {
    console.log(request.body);
    let author = request.body.author;
    let rate = request.body.rate;
    let rating = request.body.rating;
    let placeid = request.body.placeid;
    db.addReview(author, rate, rating, placeid).then(x => response.json({message: "Review successfully added."}));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});