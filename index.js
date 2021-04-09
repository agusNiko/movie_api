const { response } = require('express');
const express = require('express');
const morgan = require('morgan');


const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//const bodyParser = require('body-parser');   body Parser is deprecated

const app = express();

app.use(express.json());

//app.use(bodyParser.json()); body Parser is deprecated

app.use(morgan('common'));

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// GET requests

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

// Gets the list of data about ALL movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch(
    (err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

//Gets the data about a single movie, by title

app.get('/movies/:requestedMovie' , (req,res) => {
  Movies.findOne({Title: req.params.requestedMovie})
    .then((thisMovie) => { res.json(thisMovie);
  })
    .catch(
      (err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//Gets the description of a genre by Genres Name

app.get('/movies/:requestedGenre/genre' , (req,res) => {
  Movies.findOne({"Genre.Name": req.params.requestedGenre})
  .then((thisMovie) => {
    let thisGenre = {genre: thisMovie.Genre}
    res.json(thisGenre);
})
  .catch(
    (err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Gets the description of a Movie genre

app.get('/movies/:requestedMovie/movie' , (req,res) => {
  Movies.findOne({Title: req.params.requestedMovie})
  .then((thisMovie) => {
    let thisMovieGenre = {Title: thisMovie.Title, genre: thisMovie.Genre.Name}
    res.json(thisMovieGenre);
})
  .catch(
    (err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Gets the data about a director

app.get('/director/:directorsName' , (req,res) => {
Movies.findOne({"Director.Name": req.params.directorsName})
.then(
  (thisDirector)=> {
    let directorInfo = {Name: thisDirector.Director}
    res.status(200).json(directorInfo)
  }
)
});

// Gets the users list

app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch(
      (err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
      });
});

// Gets users by name

app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// ------------ Register/Add a user :

/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// Update the "user name" of a user
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//add a movie to a list of favorites by MovieID 

app.post('/users/movies/:Username/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Remove a movie to a list of favorites by MovieID 

app.post('/users/movies/:Username/:MovieID/remove', (req, res) => {
  Users.updateOne({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { multi: false }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


//remove a movie from the list of favorites

app.delete('/users/:name', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.name })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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