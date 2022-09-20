'use strict';

// import all required modules
const logger = require('../utils/logger');
const folderStore = require('../models/folder-store.js');
const accounts = require ('./accounts.js');

// create start object
const start = {
  
  // index method - responsible for creating and rendering the view
  index(request, response) {

    const loggedInUser = accounts.getCurrentUser(request);
    logger.info('start rendering');

    if(loggedInUser){

      const folders = folderStore.getAllFolders();
      let numFolders = folders.length;
      let numGames = 0;
      for (let item of folders) {
        numGames += item.games.length;
      }

      const viewData = {
        title: 'Welcome to the Games App!',
        totalFolders: numFolders,
        totalGames: numGames,
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      };

      response.render('start', viewData);
    }
    else response.redirect('/');
  },
};

// export the start module
module.exports = start;