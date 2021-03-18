const express = require('express');
const { unset } = require('lodash');
  morgan = require('morgan');

const app = express();
  

let topMovies = [
  {
    title: 'The Shawshank Redemption',
    director: ' ',
    year: 1994
  },
  {
    title: 'The Godfather',
    director: ' ',
    year: 1972
    },
  {
    title: 'The Godfather: Part II',
    director: ' ',
    year: 1974
    },
  {
    title: 'The Dark Knight',
    director: ' ',
    year: 2008
    },
  {
    title: 'Angry Men',
    director: ' ',
    year: 1957
    },
    {
      title: 'Schindler\'s List',
      director: ' ',
      year: 1993
    },
    {
      title: 'The Lord of the Rings: The Return of the King',
      director: ' ',
      year: 2003
      },
    {
      title: 'The Godfather: Part II',
      director: ' ',
      year: 1974
      },
    {
      title: 'Pulp Fiction',
      director: ' ',
      year: 1994
      },
    {
      title: 'Fight Club',
      director: ' ',
      year: 1999
      }
];

app.use(morgan('common'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});