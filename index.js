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



// let myLogger = (req, res, next) => {
//   console.log('hola')
//   console.log(req.url);
//   next();
//   console.log('chao')
// };

// let requestTime = (req, res, next) => {
//   console.log('time')
//   req.requestTime = Date.now();
//   next();
//   console.log('time-out')
// };

// // app.use(myLogger);
// app.use(requestTime);

app.use(morgan('common'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');

});

app.use('/StaticFiles', express.static('public'));

app.get('/welcome', (req, res) => {
  let responseText = 'Welcome to my app!';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

// app.get('/secreturl', (req, res) => {
//   let responseText = 'This is a secret url with super top-secret content.';
//   responseText += '<small>Requested at: ' + req.requestTime + '</small>';
//   res.send(responseText);

// });

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