const { response } = require("express");
const express = require("express");
const morgan = require("morgan");

const uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

const passport = require("passport");
require("./passport.js");

const { check, validationResult } = require("express-validator");

const bodyParser = require("body-parser"); // body Parser is deprecated

const swaggerJSDoc = require("swagger-jsdoc"); // swagger exportation to add API documentation
const swaggerUi = require("swagger-ui-express");

const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.json()); //body Parser is deprecated substituted by:
//app.use(express.json());

app.use(morgan("common"));

// mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from JSONPlaceholder.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "JSONPlaceholder",
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Development server",
    },
  ],
};
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["index.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const cors = require("cors");

let allowedOrigins = [
  "http://localhost:8080",
  "http://testsite.com",
  "http://localhost:1234",
  "https://agusniko.github.io",
  "https://confident-babbage-994a9f.netlify.app",
  "https://myflapix.herokuapp.com",
  "http://localhost:4200",
  "http://anotherhost",
  "madhouse",
  "https://festive-clarke-ff1c85.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

let auth = require("./auth")(app);

/**
 * @swagger
 * /:
 *   get:
 *     summary: welcome page
 *     description: send you to the landing page
 */
app.get("/", (req, res) => {
  res.send("Welcome to myFlix!");
});

/**
 *@function get All Movies
 *@description get All movies from the database
 *@returns {JSON} JSON object of all movies, each of which contain the movie's title, description, director, genre, image url, and featured status.
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * @function getMovieByTitle
 * @description Gets the data about a single movie, by title
 * @returns {JSON} JSON object the movie that contains title, description, director, genre, image url, reviews and featured status.
 */
app.get(
  "/movies/:requestedMovie",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.requestedMovie })
      .then((thisMovie) => {
        res.json(thisMovie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function getMovieById
 * @description Gets the data about a single movie, by id
 * @returns {JSON} JSON object the movie that contains title, description, director, genre, image url, reviews and featured status.
 */

app.get(
  "/movie/id/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ _id: req.params.id })
      .then((thisMovie) => {
        res.json(thisMovie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function getGenre
 * @description Gets the description of a genre by Genres Name
 * @returns {JSON} JSON object the genre and description.
 */
app.get(
  "/movies/:requestedGenre/genre",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.requestedGenre })
      .then((thisMovie) => {
        let thisGenre = { genre: thisMovie.Genre };
        res.json(thisGenre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @getDirector
 * @description Gets the data about a director
 * @returns {JSON} JSON object with the name and bio data of the director
 */
app.get(
  "/director/:directorsName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.directorsName }).then(
      (thisDirector) => {
        let directorInfo = { Name: thisDirector.Director };
        res.status(200).json(directorInfo);
      }
    );
  }
);

/**
 * @function getUsers
 * @description Gets the users list
 * @returns {JSON} JSON object of all users, each of which contain username, email, id, favorite movies, and birthday.
 *
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

/**
 * @function GetsUserByName
 * @description get user by username
 * @returns {JSON} JSON object of all users, each of which contain username, email, id, favorite movies, and birthday.
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function registerUser
 * @description Register/Add a user
 * @augments userData
 * @returns {JSON} JSON object of all users, each of which contain username, email, id, favorite movies, and birthday.
 */

/*expect JSON in this format 
  {
    ID: Integer,
    Username: String, 
    Password: String,
    Email: String, 
    Birthday: Date}
 */
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * * @function updateUserData
 * @description Update the username
 * @returns {JSON} JSON object of all users, each of which contain username, email, id, favorite movies, and birthday.
 * */

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

app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          // Password: req.body.Password,
          // Email: req.body.Email,
          // Birthday: req.body.Birthday
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 *
 * @function sendReview
 * @description Allows to add reviews and ratings to the movies
 * @returns {JSON} JSON object with review, reviewId, userId and rating
 */

app.post(
  "/movies/:MovieID/reviews",
  passport.authenticate("jwt", { session: false }),
  [
    check("MovieID", "MovieID is required").not().isEmpty(),
    check("Comment", "Comment is required").not().isEmpty(),
    check("Rating", "Rating is required").isNumeric(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Movies.findOneAndUpdate(
      { _id: req.params.MovieID },
      {
        $push: {
          Reviews: {
            Comment: req.body.Comment,
            User: req.user,
            Rating: req.body.Rating,
          },
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedMovieReview) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedMovieReview);
        }
      }
    );
  }
);

/**
 * @function addToFavorites
 * @description Adds movie to favorites
 */

app.post(
  "/users/movies/:Username/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findById(req.params.MovieID) // first I use findOne to see if the MovieID exist
      .then((movie) => {
        if (!movie) {
          res.status(404).send("movie not found");
        } else {
          Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
              $addToSet: { FavoriteMovies: req.params.MovieID },
            },
            { new: true }, // This line makes sure that the updated document is returned
            (err, updatedUser) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error: " + err);
              } else {
                res.json(updatedUser);
              }
            }
          );
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @function removeFromFavorites
 * @description Remove a movie from a list of favorites by MovieID
 */

app.post(
  "/users/movies/:Username/:MovieID/remove",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.updateOne(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { multi: false }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * @function unsubscribe
 * @description Removes User to unsubscribe
 * @returns message "user was deleted" or "user was not found"
 */

app.delete(
  "/users/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.name })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(port, "0.0.0.0", () => {
  console.log("Your app is listening on port " + port);
});
