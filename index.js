const { response } = require('express');
const express = require('express'),
//const { unset } = require('lodash'),
  bodyParser = require('body-parser'),
  morgan = require('morgan');
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

let users = [
  {name: 'Pedro',
   email: ' ',
   movies: [],
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
    title: 'The God father',
    director: {
      name: 'papa',
      bio: ' ',
      birth_year: 000,
      death_year: 000
    },
    year: 1972,
    description: '',
    genre: 'Drama',
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
        name: 'Spielberg',
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
      genre: 'Drama',
      img: ' '
      },
      {
        title: 'Pelicula',
        director: {
          name: ' ',
          bio: ' ',
          birth_year: 000,
          death_year: 000
        },
        year: 1999,
        description: '',
        genre: 'Drama',
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
  res.json(topMovies.find((movie) => { return movie.title === req.params.title }));
});

//Gets the data about a single movie, by genre

app.get('/movies/:title/genre' , (req,res) => {
  let thisMovie = topMovies.find((movie) => { return movie.title === req.params.title})
  
  let movieGenre = {'name' : thisMovie.title, genre: thisMovie.genre}
  res.json(movieGenre);
});

//Gets the data about a director

app.get('/director/:name' , (req,res) => {
  let thisMovie = topMovies.find((movie) => { return movie.director.name === req.params.name})
  console.log(thisMovie);

  let thisDirector = {'name' : thisMovie.director}
  console.log(thisMovie)
    res.json(thisDirector);
}); //-----------------------------------Doesn't work

// Gets the users list

app.get('/users', (req, res) => {
  res.json(users);
});

//add a new movie to topMovies
app.post('/movies', (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {
    const message = 'Missing title in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    topMovies.push(newMovie);
    res.status(201).send(newMovie);
  }
});


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

app.put('/users/:username/:newUsername', (req, res) => {
  let user = users.find((user) => { return user.name === req.params.username });

  if (user) {
    user.name = (req.params.newUsername);
    res.status(201).json(users).send('Username '+ req.params.username + 'was change to ' + req.params.newUsername);
  } else {
    res.status(404).send('Student with the name ' + req.params.username + ' was not found.');
  }
});

//add a movie to a list of favorites 

app.put('/users/movies/:username/:addMovie', (req, res) =>{
  let user = users.find((user) => { return user.name === req.params.username });
  let newMovie = topMovies.find((movie) => { return movie.title === req.params.addMovie} );

  if (user){
      user.movies.push(newMovie)
      res.status(201).json(user).send( req.params.addMovie.title + ' was add to favorites.');
  }else {
    res.status(404).send(req.params.username + ' or' + req.params.addMovie + ' was not found.');
  }
});

//remove a movie from the list of favorites


app.delete('/users/:name', (req, res) => {
  let user = users.find((student) => { return student.name === req.params.name });
  console.log('pedro: ' + users)
  
  if (user) {
    users = users.filter((obj) => { return obj.name !== req.params.name });
    res.status(201).send('User ' + req.params.name + ' was deleted.');
  }
  console.log('pedro: ' + users)
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});