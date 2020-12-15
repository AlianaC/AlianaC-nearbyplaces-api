'use strict';

require('dotenv').config();
const { Pool } = require('pg');

const postgreConnectionString =
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;

console.log(postgreConnectionString);

const postgrePool = new Pool({
    connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL : postgreConnectionString,
    ssl: { rejectUnauthorized: false }
});

function getPlaces() {
    return postgrePool.query("SELECT * FROM nearbyplaces.places;").then(x => x.rows);
};

function getReviews(id) {
    return postgrePool.query("SELECT * FROM nearbyplaces.reviews WHERE placeid = $1;", [id]).then(x => x.rows);
}

function search(searchTerm, city, state) {
    let query = `SELECT * FROM nearbyplaces.places`;
    let conditions = [];
    if(searchTerm){
        conditions.push(`upper(cat) LIKE upper('${searchTerm}')`);
    }
    if(city){
        conditions.push(`upper(city) LIKE upper('${city}')`);
    }
    if(state){
        conditions.push(`upper(state) LIKE upper('${state}')`);
    }

    if(conditions.length != 0){
        query += " WHERE ";
        query += conditions.join(" AND ");
    }
    
    console.log(query);

    return postgrePool.query(`${query};`).then(x => x.rows);
}

function addPlace(name, city, state, cat, description) {
    let query = `INSERT INTO nearbyplaces.places ("name", city, state, cat, description) VALUES('${name}', '${city}', '${state}', '${cat}', '${description}');`
    return postgrePool.query(query).then(x => x.rows);
}

function addReview(author, rate, rating, placeid){
    let query = `INSERT INTO nearbyplaces.reviews (author, rate, rating, placeid) VALUES('${author}', ${rate}, '${rating}', ${placeid});`;
    return postgrePool.query(query).then(x => x.rows);
}

function deletePlace(placeid){
    let query = `DELETE FROM nearbyplaces.places WHERE id=${placeid};`
    return postgrePool.query(query).then(x => x.rows);
}
    

module.exports = { getPlaces, getReviews, addPlace, search, addReview, deletePlace };

