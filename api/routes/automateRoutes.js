'use strict';
module.exports = function(app) {
  var automate = require('../controller/automateController');

  // todoList Routes
  app.route('/createproject')
    .post(automate.create_a_task);

};

