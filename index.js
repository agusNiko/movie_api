const express = require('express'),
//const { unset } = require('lodash'),
  bodyParser = require('body-parser'),
  morgan = require('morgan');
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

let users =[
  {username: ' ',

  email: '',
  id: 1 
  }
]

let topMovies = [
  {
    title: 'The Shawshank Redemption',
    director: {
      name: ' ',
      bio: ' ',
      birth_year: 000,
      death_year: 000
    },
    year: 1994,
    description: '',
    genre: ' ',
    img: ' '
  },
  {
    title: 'TheGodfather',
    director: {
      name: ' ',
      bio: ' ',
      birth_year: 000,
      death_year: 000
    },
    year: 1972,
    description: '',
    genre: ' ',
    img: ' '
    },
  {
    title: 'The Godfather: Part II',
    director: ' ',
    year: 1974,
    description: '',
    genre: ' ',
    img: ' '
    },
  {
    title: 'The Dark Knight',
    director: {
      name: ' ',
      bio: ' ',
      birth_year: 000,
      death_year: 000
    },
    year: 2008,
    description: '',
    genre: ' ',
    img: ' '
    },
  {
    title: 'Angry Men',
    director: {
      name: ' ',
      bio: ' ',
      birth_year: 000,
      death_year: 000
    },
    year: 1957,
    description: '',
    genre: ' ',
    img: ' '
    },
    {
      title: 'Schindler\'s List',
      director: {
        name: 'StevenSpielberg',
        bio: 'is an American film director, producer, and screenwriter. He began his career in the New Hollywood era, and is one of the most commercially successful directors in history. Spielberg is the recipient of various accolades, including two Academy Awards for Best Director, a Kennedy Center honor, and a Cecil B. DeMille Award. ',
        birth_year: 1946,
        death_year: 000
      },
      year: 1993,
      description: '',
      genre: ' ',
      img: ' '
    },
    {
      title: 'The Lord of the Rings: The Return of the King',
      director: {
        name: ' ',
        bio: ' ',
        birth_year: 000,
        death_year: 000
      },
      year: 2003,
      description: '',
      genre: ' ',
      img: ' '
      },
    {
      title: 'The Godfather: Part II',
      director: {
        name: ' ',
        bio: ' ',
        birth_year: 000,
        death_year: 000
      },
      year: 1974,
      description: '',
      genre: ' ',
      img: ' '
      },
    {
      title: 'Pulp Fiction',
      director: {
        name: ' ',
        bio: ' ',
        birth_year: 000,
        death_year: 000
      },
      year: 1994,
      description: '',
      genre: ' ',
      img: ' '
      },
    {
      title: 'Fight Club',
      director: {
        name: ' ',
        bio: ' ',
        birth_year: 000,
        death_year: 000
      },
      year: 1999,
      description: '',
      genre: ' ',
      img: ' '
      }
];

app.use(morgan('common'));

// GET requests


app.get('/', (req, res) => {
  res.json('Welcome to myFlix!');
});

// Gets the list of data about ALL movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//Gets the data about a single movie, by title

app.get('/movies/:title' , (req,res) => {
  res.json(topMovies.find((movie) => 
  { return movie.title === req.params.title }));
});

//Gets the data about a single movie, by genre

app.get('/movies/:title/genre' , (req,res) => {
  res.json(topMovies.find((movie) => 
  { movie.title === req.params.title}));
}); //doest work

//Gets the data about a director

app.get('/movies/:directors' , (req,res) => {
  res.json(topMovies.find((movies) => {
    movies.director.name === req.params.director.directors
  }));
}); //Doesn't work



//register new user
app.post('/users', (req, res) => {
  let newUser = req.body;
if (!newUser.name){
  const message = 'Missing "name" in request body';
  res.status(400).send(message);
} else {
  newUser.id = uuid.v4();
  users.push(newUser)
  res.status(201).send(newUser);
}
});

// Update the "user name" of a user
app.put('/users/:username', (req, res) => {
  let user = users.find((user) => { return user.username === req.params.username });


});

//add a movie to a list of favorites 

//remove a movie from the list of favorites

//deregister User


app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});