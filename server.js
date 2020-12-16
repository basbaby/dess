const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var cors = require('cors')
app.use(cors())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// set port, listen for requests
const PORT = process.env.PORT || 8083;
var server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

var io = require('socket.io').listen(server);
global.io = io;
require('./app/routes/user.routes')(app);
require('./app/routes/az.routes')(app);
require('./app/routes/project.routes')(app);
require('./app/routes/git.routes')(app);

const db = require("./app/models");
const Role = db.role;
const dbConfig = require("./app/config/db.config");
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
